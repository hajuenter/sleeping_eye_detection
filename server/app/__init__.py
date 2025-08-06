from flask import Flask
from flask_cors import CORS
from app.routes import detection_blueprint

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB upload limit
CORS(app)
app.register_blueprint(detection_blueprint)
