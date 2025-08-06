// BenefitsSection.jsx
import React from "react";
import { Shield, Users, Smartphone } from "lucide-react";
import { benefits } from "../assets/assets";

const BenefitsSection = () => {
  return (
    <section id="benefits" className="pb-20 pt-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Judul - Muncul duluan */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose SafeDrive?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the advantages of using our drowsiness detection system for
            safer roads.
          </p>
        </div>

        {/* Grid card - Muncul satu per satu dari kiri ke kanan */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={`${300 + index * 200}`}
                data-aos-offset="100"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
