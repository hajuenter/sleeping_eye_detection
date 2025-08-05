// src/components/HeroSection.jsx
import React from "react";
import { Camera } from "lucide-react";

const HeroSection = ({ onStartDetection }) => {
  const navigateToDetection = () => {
    const section = document.getElementById("detection");
    if (section) {
      // Different offset for mobile and desktop
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 20 : 64; // Consistent with Navigation component
      const elementPosition = section.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-green-600 flex items-center relative overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl md:text-7xl font-bold mb-6">
            Drive Safe, Stay Awake.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-2xl mx-auto leading-relaxed">
            Real-time eye monitoring to detect drowsiness and reduce road
            accidents using advanced AI technology.
          </p>
          <button
            onClick={navigateToDetection}
            className="bg-white text-teal-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3 mx-auto hover:cursor-pointer"
          >
            <Camera size={24} />
            Start Detection
          </button>
        </div>
      </div>

      <div className="absolute lg:bottom-8 md:bottom-7 bottom-[87px] left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
