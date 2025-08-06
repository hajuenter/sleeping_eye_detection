import React from "react";
import { Camera, Sparkles } from "lucide-react";

const HeroSection = ({ onStartDetection }) => {
  const navigateToDetection = () => {
    const section = document.getElementById("detection");
    if (section) {
      // Different offset for mobile and desktop
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 0 : 64; // Consistent with Navigation component
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
      className="min-h-screen relative overflow-hidden pt-16 flex items-center"
    >
      {/* Enhanced gradient background with radial center focus */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900"></div>

      {/* Radial gradient overlay for bright center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle, rgba(45, 212, 191, 0.3) 0%, rgba(20, 184, 166, 0.2) 50%, transparent 100%)",
        }}
      ></div>

      {/* Additional radial glow effect */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(20, 184, 166, 0.3) 50%, transparent 100%)",
        }}
      ></div>

      {/* Animated particles/sparkles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-teal-300 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/2 w-1 h-1 bg-teal-200 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Floating sparkle icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-cyan-300 animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 text-cyan-300 animate-ping opacity-20">
                <Sparkles className="w-full h-full" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent leading-tight">
            Drive Safe, Stay Awake.
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-cyan-100/90 max-w-2xl mx-auto leading-relaxed font-light">
            Real-time eye monitoring to detect drowsiness and reduce road
            accidents using advanced AI technology.
          </p>

          <button
            onClick={navigateToDetection}
            className="group relative bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-10 py-5 rounded-full text-lg font-semibold hover:from-cyan-300 hover:to-teal-400 hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/25 flex items-center gap-3 mx-auto hover:cursor-pointer overflow-hidden"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>

            {/* Button content */}
            <div className="relative flex items-center gap-3">
              <Camera
                size={24}
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              Start Detection
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
          </button>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute lg:bottom-2.5 md:bottom-6 bottom-[87px] left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="relative">
          {/* Glow effect for scroll indicator */}
          <div className="absolute inset-0 w-6 h-10 border-2 border-cyan-300/50 rounded-full blur-sm"></div>
          <div className="relative w-6 h-10 border-2 border-cyan-200/70 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-gradient-to-b from-cyan-300 to-teal-300 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
