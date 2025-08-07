import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Toast from "./components/Toast";
import ConfirmationModal from "./components/ConfirmationModal";
import SummaryModal from "./components/SummaryModal";
import LandingPage from "./pages/LandingPage";
import AOS from "aos";
import "aos/dist/aos.css";
import { getSessionId } from "./utils/session";

const App = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [detectionStartTime, setDetectionStartTime] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-out",
    });

    const sessionId = getSessionId();
    // console.log("📌 Session ID:", sessionId);
  }, []);

  const handleStartDetection = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCamera = async () => {
    setShowConfirmation(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      // Stop the stream immediately, the DetectionSection will handle camera
      stream.getTracks().forEach((track) => track.stop());

      setIsDetecting(true);
      setDetectionStartTime(Date.now());
      setSummary(null); // Clear previous summary
      setToast({
        message: "Detection started! Face the camera.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Camera access denied. Please allow camera access.",
        type: "error",
      });
    }
  };

  const handleStopDetection = async () => {
    if (!detectionStartTime) return;

    const detectionDuration = Math.floor(
      (Date.now() - detectionStartTime) / 1000
    );

    setIsDetecting(false);
    setDetectionStartTime(null);

    // Show toast for stopping detection
    setToast({
      message: `Detection stopped. Session lasted ${Math.floor(
        detectionDuration / 60
      )}m ${detectionDuration % 60}s`,
      type: "info",
    });

    // Wait a moment for final data processing, then show summary
    setTimeout(() => {
      setShowSummary(true);
    }, 1500);
  };

  const handleToggleDetection = () => {
    if (isDetecting) {
      handleStopDetection();
    } else {
      handleStartDetection();
    }
  };

  const handleSummaryReceived = (summaryData) => {
    setSummary(summaryData);
  };

  const closeSummary = () => {
    setShowSummary(false);
    setSummary(null);
  };

  const closeToast = () => setToast(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />
      <LandingPage
        isDetecting={isDetecting}
        onToggleDetection={handleToggleDetection}
        onStartDetection={handleStartDetection}
        onSummaryReceived={handleSummaryReceived}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Camera Permission Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmCamera}
        title="Camera Access Required"
        message="This application needs access to your camera to detect drowsiness. Your privacy is protected - no video data is stored or transmitted."
      />

      {/* Summary Modal */}
      <SummaryModal
        isOpen={showSummary}
        onClose={closeSummary}
        summary={summary}
      />
    </div>
  );
};

export default App;
