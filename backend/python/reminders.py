from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Reminder, db
from datetime import datetime

reminders_bp = Blueprint('reminders', __name__)

@reminders_bp.route('/reminder', methods=['POST'])
@jwt_required()
def create_reminder():
    user_id = get_jwt_identity()
    data = request.json

    try:
        reminder_time = datetime.fromisoformat(data["reminder_time"])
    except Exception:
        return jsonify({"error": "Invalid datetime format"}), 400

    reminder = Reminder(
        user_id=user_id,
        title=data["title"],
        message=data.get("message"),
        reminder_time=datetime.fromisoformat(data["reminder_time"])
    )

    db.session.add(reminder)
    db.session.commit()

    return jsonify({"message": "Reminder created"}), 201

@reminders_bp.route("/reminders", methods=["GET"])
@jwt_required()
def get_reminders():
    user_id = get_jwt_identity()
    reminders = Reminder.query.filter_by(user_id=user_id).all()
    
    output = []
    for r in reminders:
        output.append({
            "id": r.id,
            "title": r.title,
            "message": r.message,
            "reminder_time": r.reminder_time.isoformat(),
            "is_completed": r.is_completed
        })

    return jsonify(output), 200

@reminders_bp.route("/reminders/<int:reminder_id>", methods=["DELETE"])
@jwt_required()
def delete_reminder(reminder_id):
    user_id = get_jwt_identity()
    reminder = Reminder.query.filter_by(id=reminder_id, user_id=user_id).first()

    if not reminder:
        return jsonify({"error": "Reminder not found"}), 404

    db.session.delete(reminder)
    db.session.commit()

    return jsonify({"message": "Reminder deleted"}), 200