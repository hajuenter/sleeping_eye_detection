import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import DetectionSection from "../components/DetectionSection";
import BenefitsSection from "../components/BenefitsSection";
import Footer from "../components/Footer";

const LandingPage = ({
  isDetecting,
  onToggleDetection,
  onStartDetection,
  onSummaryReceived,
}) => {
  return (
    <>
      <HeroSection onStartDetection={onStartDetection} />
      <FeaturesSection />
      <DetectionSection
        isDetecting={isDetecting}
        onToggleDetection={onToggleDetection}
        onSummaryReceived={onSummaryReceived}
      />
      <BenefitsSection />
      <Footer />
    </>
  );
};

export default LandingPage;
