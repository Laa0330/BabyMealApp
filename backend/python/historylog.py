from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Feeding, db
from datetime import datetime

feedings_bp = Blueprint("feedings", __name__)

@feedings_bp.route("/feedings", methods=["POST"])
@jwt_required()
def create_feeding():
    user_id = get_jwt_identity()
    data = request.json

    feeding = Feeding(
        user_id=user_id,
        feeding_type=data.get("feeding_type"),
        amount=data.get("amount"),
        unit=data.get("unit"),
        timestamp=datetime.utcnow(),
        notes=data.get("notes")
    )

    db.session.add(feeding)
    db.session.commit()

    return jsonify({"message": "Feeding entry created"}), 201

@feedings_bp.route("/feedings", methods=["GET"])
@jwt_required()
def get_feedings():
    user_id = get_jwt_identity()
    feedings = Feeding.query.filter_by(user_id=user_id).all()

    output = []
    for f in feedings:
        output.append({
            "id": f.id,
            "feeding_type": f.feeding_type,
            "amount": f.unit,
            "timestamp": f.timestamp.isoformat(),
            "notes": f.notes
        })

    return jsonify(output), 200

@feedings_bp.route("/feedings/<int:feeding_id>", methods=["DELETE"])
@jwt_required()
def delete_feeding(feeding_id):
    user_id = get_jwt_identity()
    feeding = Feeding.query.filter_by(id=feeding_id, user_id=user_id).first()

    if not feeding:
        return jsonify({"error": "Feeding entry not found"}), 404
    
    db.session.delete(feeding)
    db.session.commit()

    return jsonify({"message": "Feeding entry deleted"}), 200