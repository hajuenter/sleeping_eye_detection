import React, { useRef } from "react";
import { Camera, Play, Pause } from "lucide-react";

const DetectionSection = ({ isDetecting, onToggleDetection }) => {
  const videoRef = useRef(null);

  return (
    <section id="detection" className="pb-20 pt-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Live Detection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start the drowsiness detection system and see real-time analysis of
            your alertness level.
          </p>
        </div>

        <div
          className="max-w-4xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="500"
          data-aos-offset="100"
        >
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
                className="group relative bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-10 py-5 rounded-full text-lg font-semibold hover:from-cyan-300 hover:to-teal-400 hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/25 flex items-center gap-3 mx-auto overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>

                {/* Button Content */}
                <div className="relative flex items-center gap-3">
                  {isDetecting ? (
                    <Pause
                      size={24}
                      className="group-hover:rotate-12 transition-transform duration-300"
                    />
                  ) : (
                    <Play
                      size={24}
                      className="group-hover:rotate-12 transition-transform duration-300"
                    />
                  )}
                  {isDetecting ? "Stop Detection" : "Start Detection"}
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetectionSection;
