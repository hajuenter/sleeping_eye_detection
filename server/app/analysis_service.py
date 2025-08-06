import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from io import BytesIO

detection_sessions = {}


def add_detection(session_id, status):
    if session_id not in detection_sessions:
        detection_sessions[session_id] = []
    detection_sessions[session_id].append({"status": status})
    print(f"[📦] {session_id} → {status}")


def get_analysis_images(session_id):
    if session_id not in detection_sessions or not detection_sessions[session_id]:
        return None, None

    df = pd.DataFrame(detection_sessions[session_id])
    df["status_numeric"] = df["status"].map({"closed": 0, "opened": 1})
    df["index"] = range(len(df))

    fig1, ax1 = plt.subplots()
    ax1.step(df["index"], df["status_numeric"], where="post")
    ax1.set_yticks([0, 1])
    ax1.set_yticklabels(["Closed", "Opened"])
    ax1.set_xlabel("Frame ke-")
    ax1.set_ylabel("Status Mata")
    ax1.set_title("Status Mata Seiring Waktu")
    img1 = BytesIO()
    plt.tight_layout()
    plt.savefig(img1, format="png")
    img1.seek(0)
    plt.close(fig1)

    fig2, ax2 = plt.subplots()
    counts = df["status"].value_counts()
    ax2.pie(counts, labels=counts.index, autopct="%1.1f%%", colors=["red", "green"])
    ax2.set_title("Proporsi Status Mata")
    img2 = BytesIO()
    plt.tight_layout()
    plt.savefig(img2, format="png")
    img2.seek(0)
    plt.close(fig2)

    return img1, img2
