import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === "success"
          ? "bg-green-500 text-white"
          : type === "error"
          ? "bg-red-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckCircle size={20} />
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 cursor-pointer">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
