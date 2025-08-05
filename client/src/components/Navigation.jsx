import React, { useEffect, useState } from "react";
import { Eye, Home, Layers, Camera, HeartPulse } from "lucide-react";

const sections = [
  { id: "home", label: "Home", icon: Home },
  { id: "features", label: "Features", icon: Layers },
  { id: "detection", label: "Detection", icon: Camera },
  { id: "benefits", label: "Benefits", icon: HeartPulse },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState(null);

  // Function to handle smooth scrolling with offset
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      // Different offset for mobile and desktop
      const isMobile = window.innerWidth < 768;
      let offset;

      if (sectionId === "home") {
        offset = 0; // No offset for home section
      } else {
        offset = isMobile ? 0 : 64; // Updated offset for new navbar height
      }

      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    let currentTimeout = null;

    // Function to show mobile nav and set auto-hide timer
    const showMobileNav = () => {
      setIsMobileNavVisible(true);

      // Clear existing timeout
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      // Check if we're at the top of the page
      const isAtTop = window.scrollY <= 50;

      // Only set hide timeout if not at top
      if (!isAtTop) {
        currentTimeout = setTimeout(() => {
          setIsMobileNavVisible(false);
        }, 4000); // Hide after 4 seconds of inactivity
      }
    };

    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const scrollPosition = window.scrollY + (isMobile ? 60 : 120); // Updated for new navbar height
      const isAtTop = window.scrollY <= 50;

      // Handle active section detection
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }

      // Handle mobile nav visibility
      if (isMobile) {
        if (isAtTop) {
          // Always show when at top
          setIsMobileNavVisible(true);
          if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
          }
        } else {
          // Show nav and set auto-hide timer when scrolling
          showMobileNav();
        }
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []); // Empty dependency array

  return (
    <>
      {/* Desktop navbar */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white/95 backdrop-blur-xl z-40 border-b border-gray-200/50 shadow-sm shadow-gray-100/50">
        <div className="container mx-auto lg:px-20 md:px-12 px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-green-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-teal-500 to-green-500 p-2 rounded-full">
                  <Eye className="text-white" size={24} />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                SafeDrive
              </span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50/80 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-200/50">
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className={`relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer group ${
                    activeSection === id
                      ? "text-white shadow-lg"
                      : "text-gray-600 hover:text-teal-600 hover:bg-white/50"
                  }`}
                >
                  {activeSection === id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-500 rounded-full shadow-lg"></div>
                  )}
                  <span className="relative z-10">{label}</span>
                  {activeSection !== id && (
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/50 rounded-full transition-all duration-300"></div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile floating nav at bottom */}
      <nav
        className={`md:hidden fixed border border-teal-600 bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md shadow-lg rounded-full px-6 py-2 flex justify-between w-[90%] max-w-sm transition-all duration-500 ease-in-out ${
          isMobileNavVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none"
        }`}
        onTouchStart={() => {
          setIsMobileNavVisible(true);
          // Clear any existing timeout when user touches
        }}
        onMouseEnter={() => {
          setIsMobileNavVisible(true);
          // Clear any existing timeout when user hovers
        }}
      >
        {sections.map(({ id, icon: Icon, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => handleNavClick(e, id)}
            className={`flex flex-col items-center text-xs cursor-pointer ${
              activeSection === id ? "text-teal-600" : "text-gray-500"
            } hover:text-teal-500 transition-colors`}
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
