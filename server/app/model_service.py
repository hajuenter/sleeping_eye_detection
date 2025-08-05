from ultralytics import YOLO
from config.settings import MODEL_PATH

# Load model sekali di awal
model = YOLO(MODEL_PATH)


def predict_image(image):
    results = model(image)
    return results
