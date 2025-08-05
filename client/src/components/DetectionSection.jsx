import React, { useRef } from "react";
import { Camera, Play, Pause } from "lucide-react";

const DetectionSection = ({ isDetecting, onToggleDetection }) => {
  const videoRef = useRef(null);

  return (
    <section id="detection" className="pb-20 pt-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Live Detection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start the drowsiness detection system and see real-time analysis of
            your alertness level.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 rounded-2xl p-8 shadow-xl">
            <div className="aspect-video bg-gray-800 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
              {isDetecting ? (
                <div className="text-white text-center">
                  <Camera size={48} className="mx-auto mb-4 animate-pulse" />
                  <p className="text-lg">Camera Active - Monitoring...</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">Status: Alert</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <Camera size={48} className="mx-auto mb-4" />
                  <p className="text-lg">Camera feed will appear here</p>
                  <p className="text-sm mt-2">
                    Click "Start Detection" to begin monitoring
                  </p>
                </div>
              )}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                style={{ display: isDetecting ? "block" : "none" }}
                autoPlay
                muted
                playsInline
              />
            </div>

            <div className="text-center">
              <button
                onClick={onToggleDetection}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg flex items-center gap-3 mx-auto ${
                  isDetecting
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                }`}
              >
                {isDetecting ? <Pause size={24} /> : <Play size={24} />}
                {isDetecting ? "Stop Detection" : "Start Detection"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetectionSection;
