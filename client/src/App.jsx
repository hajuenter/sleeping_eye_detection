import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Toast from "./components/Toast";
import ConfirmationModal from "./components/ConfirmationModal";
import LandingPage from "./pages/LandingPage";
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-out",
    });
  }, []);

  const handleStartDetection = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCamera = async () => {
    setShowConfirmation(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsDetecting(true);
      setToast({
        message: "Camera access granted! Detection started.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          "Camera access denied. Please allow camera access to use detection.",
        type: "error",
      });
    }
  };

  const handleToggleDetection = () => {
    if (isDetecting) {
      setIsDetecting(false);
      setToast({ message: "Detection stopped.", type: "info" });
    } else {
      handleStartDetection();
    }
  };

  const closeToast = () => setToast(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />
      <LandingPage
        isDetecting={isDetecting}
        onToggleDetection={handleToggleDetection}
        onStartDetection={handleStartDetection}
      />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmCamera}
        title="Camera Access Required"
        message="This application needs access to your camera to detect drowsiness. Your privacy is protected - no video data is stored or transmitted."
      />
    </div>
  );
};

export default App;
