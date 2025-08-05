import React from "react";
import { Eye, Github, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/yourusername",
      label: "GitHub",
      hoverColor: "hover:text-gray-300",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/yourusername",
      label: "Instagram",
      hoverColor: "hover:text-pink-400",
    },
    {
      icon: MessageCircle,
      href: "https://open.kakao.com/o/yourkakaoID",
      label: "KakaoTalk",
      hoverColor: "hover:text-yellow-400",
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Main Content - Left/Right Layout */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6">
          {/* Left: Logo, Brand and Description */}
          <div className="mb-6 md:mb-0 text-center md:text-left w-full md:w-auto">
            <div className="flex items-center gap-1 justify-center md:justify-start mb-3">
              <Eye className="text-teal-400" size={32} />
              <span className="text-2xl font-bold">SafeDrive</span>
            </div>
            <p className="text-gray-300 max-w-xs mx-auto md:mx-0 text-sm leading-relaxed">
              Advanced AI-powered drowsiness detection system designed to keep
              drivers safe on the road.
            </p>
          </div>

          {/* Right: Social Media Section */}
          <div className="text-center md:text-right w-full md:w-auto">
            <p className="text-gray-300 text-sm mb-3">
              Get in touch for further information
            </p>
            <div className="flex items-center gap-6 justify-center md:justify-end">
              {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${hoverColor} transition-colors duration-300 transform hover:scale-110`}
                  aria-label={label}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-700 mb-4"></div>

        {/* Copyright - Centered */}
        <div className="text-center text-gray-400 text-sm">
          © 2025 SafeDrive. Built with ❤️ for road safety.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
