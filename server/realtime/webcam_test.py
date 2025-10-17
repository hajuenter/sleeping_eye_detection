import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ultralytics import YOLO
import cv2
from config.settings import MODEL_PATH, CLASS_NAMES

model = YOLO(MODEL_PATH)
cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    results = model(frame, stream=True, conf=0.25)

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls)
            conf = box.conf.item()
            label = f"{CLASS_NAMES.get(cls_id, cls_id)}: {conf:.2f}"
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                label,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2,
            )

    cv2.imshow("Sleeping Detection Realtime", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

# import sys
# import os
# import serial
# import time
# import cv2
# from ultralytics import YOLO

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# from config.settings import MODEL_PATH, CLASS_NAMES

# # --- KONFIGURASI SERIAL ARDUINO ---
# arduino = serial.Serial("COM4", 9600)  # ganti COM sesuai port Arduino
# time.sleep(2)  # tunggu koneksi serial siap

# # --- LOAD YOLO MODEL ---
# model = YOLO(MODEL_PATH)
# cap = cv2.VideoCapture(0)

# # --- VARIABEL UNTUK TRACKING STATUS ---
# current_status = "NORMAL"  # Status: NORMAL, SLEEP
# last_sent_status = None
# closed_start_time = None  # waktu mulai mata tertutup
# opened_start_time = None  # waktu mulai mata terbuka
# last_detection = None  # deteksi terakhir

# # Konstanta waktu (dalam detik)
# CLOSED_THRESHOLD = 3.0  # 3 detik mata tertutup berturut-turut
# OPENED_THRESHOLD = 3.0  # 3 detik mata terbuka untuk reset

# while cap.isOpened():
#     success, frame = cap.read()
#     if not success:
#         break

#     results = model(frame, stream=True, conf=0.25)
#     detected_status = None  # deteksi saat ini
#     current_time = time.time()

#     for r in results:
#         for box in r.boxes:
#             cls_id = int(box.cls)
#             conf = box.conf.item()
#             label = f"{CLASS_NAMES.get(cls_id, cls_id)}: {conf:.2f}"
#             x1, y1, x2, y2 = map(int, box.xyxy[0])

#             # --- bounding box dan label di frame ---
#             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#             cv2.putText(
#                 frame,
#                 label,
#                 (x1, y1 - 10),
#                 cv2.FONT_HERSHEY_SIMPLEX,
#                 0.6,
#                 (0, 255, 0),
#                 2,
#             )

#             # --- Deteksi status mata ---
#             class_name = CLASS_NAMES.get(cls_id, cls_id).lower()
#             if "opened" in class_name:
#                 detected_status = "OPENED"
#             elif "closed" in class_name:
#                 detected_status = "CLOSED"

#     # --- LOGIC UNTUK STATUS CONTROL DENGAN FILTER KEDIPAN ---
#     if detected_status == "CLOSED":
#         # Mata tertutup terdeteksi
#         if last_detection != "CLOSED":
#             # Baru mulai tertutup, catat waktu
#             closed_start_time = current_time
#             opened_start_time = None
#         elif closed_start_time:
#             # Sudah tertutup sebelumnya, cek durasi
#             closed_duration = current_time - closed_start_time
#             if closed_duration >= CLOSED_THRESHOLD and current_status == "NORMAL":
#                 current_status = "SLEEP"
#                 print(f"SLEEP activated after {closed_duration:.1f} seconds")

#     elif detected_status == "OPENED":
#         # Mata terbuka terdeteksi
#         if last_detection != "OPENED":
#             # Baru mulai terbuka, catat waktu
#             opened_start_time = current_time
#             closed_start_time = None
#         elif opened_start_time and current_status == "SLEEP":
#             # Sudah terbuka sebelumnya, cek durasi
#             opened_duration = current_time - opened_start_time
#             if opened_duration >= OPENED_THRESHOLD:
#                 current_status = "NORMAL"
#                 print(f"NORMAL activated after {opened_duration:.1f} seconds")

#     # Update deteksi terakhir
#     if detected_status:
#         last_detection = detected_status

#     # --- KIRIM STATUS KE ARDUINO ---
#     if current_status != last_sent_status:
#         arduino.write((current_status + "\n").encode())
#         last_sent_status = current_status
#         print(f"Sent to Arduino: {current_status}")

#     # --- TAMPILKAN STATUS DI FRAME ---
#     status_text = f"Status: {current_status}"
#     if detected_status:
#         detection_text = f"Eyes: {detected_status}"
#     else:
#         detection_text = "Eyes: NOT DETECTED"

#     # Tampilkan timer countdown
#     timer_text = ""
#     if detected_status == "CLOSED" and closed_start_time and current_status == "NORMAL":
#         closed_duration = current_time - closed_start_time
#         remaining = max(0, CLOSED_THRESHOLD - closed_duration)
#         timer_text = f"Sleep in: {remaining:.1f}s"
#     elif (
#         detected_status == "OPENED" and opened_start_time and current_status == "SLEEP"
#     ):
#         opened_duration = current_time - opened_start_time
#         remaining = max(0, OPENED_THRESHOLD - opened_duration)
#         timer_text = f"Normal in: {remaining:.1f}s"
#     else:
#         timer_text = "Timer: Ready"

#     cv2.putText(
#         frame, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2
#     )
#     cv2.putText(
#         frame, detection_text, (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2
#     )
#     cv2.putText(
#         frame, timer_text, (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2
#     )

#     cv2.imshow("Sleeping Detection Realtime", frame)

#     if cv2.waitKey(1) & 0xFF == ord("q"):
#         break

# cap.release()
# cv2.destroyAllWindows()
# arduino.close()
