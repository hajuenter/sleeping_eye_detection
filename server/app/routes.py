from flask import Blueprint, request, jsonify, send_file
import numpy as np
import cv2
from app.model_service import predict_image
from config.settings import CLASS_NAMES
from app.analysis_service import add_detection, get_analysis_images, detection_sessions

detection_blueprint = Blueprint("detection", __name__)


@detection_blueprint.route("/")
def index():
    return "✅ Sleeping Detection API is running!"


@detection_blueprint.route("/api/detect", methods=["POST"])
def detect():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

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
            add_detection(session_id, label)

    return jsonify({"results": detections})


@detection_blueprint.route("/api/analysis/line")
def analysis_line():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    img1, _ = get_analysis_images(session_id)
    if img1 is None:
        return jsonify({"error": "No detection history yet."}), 400
    return send_file(img1, mimetype="image/png")


@detection_blueprint.route("/api/analysis/pie")
def analysis_pie():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    _, img2 = get_analysis_images(session_id)
    if img2 is None:
        return jsonify({"error": "No detection history yet."}), 400
    return send_file(img2, mimetype="image/png")


@detection_blueprint.route("/api/summary")
def summary():
    session_id = request.args.get("session_id")
    if not session_id or session_id not in detection_sessions:
        return jsonify({"error": "Invalid session ID"}), 400

    history = detection_sessions[session_id]
    total = len(history)

    count = {"closed": 0, "opened": 0}
    for d in history:
        cls = d["status"]
        count[cls] = count.get(cls, 0) + 1

    percentage_closed = round((count.get("closed", 0) / total) * 100, 1)
    percentage_opened = round((count.get("opened", 0) / total) * 100, 1)

    conclusion = "You're alert 😃"
    if percentage_closed > 60:
        conclusion = "You seem drowsy 🥱"

    return jsonify(
        {
            "total_frames": total,
            "closed": count.get("closed", 0),
            "opened": count.get("opened", 0),
            "percentage_closed": percentage_closed,
            "percentage_opened": percentage_opened,
            "status": conclusion,
        }
    )
