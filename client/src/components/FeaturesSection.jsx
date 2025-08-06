import React from "react";
import { Eye, Brain, Car, BarChart3 } from "lucide-react";
import { features } from "../assets/assets";

const FeaturesSection = () => {
  return (
    <section id="features" className="pb-20 pt-10 bg-green-50">
      <div className="container mx-auto px-4">
        {/* Judul - Muncul duluan */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our advanced AI system uses multiple detection methods to ensure
            your safety on the road.
          </p>
        </div>

        {/* Grid card - Muncul satu per satu dari kiri ke kanan */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={`${300 + index * 150}`}
              data-aos-offset="100"
            >
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-600 transition-colors">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
