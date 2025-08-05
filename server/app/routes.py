from flask import Blueprint, request, jsonify
import numpy as np
import cv2
from app.model_service import predict_image
from config.settings import CLASS_NAMES

detection_blueprint = Blueprint("detection", __name__)


@detection_blueprint.route("/")
def index():
    return "✅ Sleeping Detection API is running!"


@detection_blueprint.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = predict_image(img)

    detections = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls)
            conf = float(box.conf)
            label = CLASS_NAMES.get(cls_id, str(cls_id))
            xyxy = [int(x) for x in box.xyxy[0]]
            detections.append(
                {"class": label, "confidence": round(conf, 3), "box": xyxy}
            )

    return jsonify({"results": detections})
