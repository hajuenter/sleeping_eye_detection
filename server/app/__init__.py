from flask import Flask
from app.routes import detection_blueprint

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB upload limit
app.register_blueprint(detection_blueprint)
