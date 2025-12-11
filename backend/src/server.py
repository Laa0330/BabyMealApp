from flask import Flask, jsonify
from flask_cors import CORS
from routes.feeds import feeds_blueprint
import os

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify(ok=True, service="feeding")

# Register routes from routes/feeds.py
app.register_blueprint(feeds_blueprint, url_prefix="/api/feeds")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 4000))
    app.run(host="0.0.0.0", port=port, debug=True)
