import React from 'react';
import { Brain, Zap, Target, Microscope } from 'lucide-react';

export default function Solutions() {
  const solutions = [
    {
      icon: Brain,
      title: "AI Taste Profile Predictor",
      description: "Advanced machine learning models trained on chemical compound and taste databases predict how new recipes will taste across all flavor dimensions.",
      features: [
        "Predict sweetness, umami, bitterness levels",
        "Optimize ingredient proportions",
        "Reduce trial iterations by 90%"
      ],
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Recipe Reverse Engineering",
      description: "Input any existing product and get probable ingredient lists with precise proportions using advanced biochemical analysis and LLM technology.",
      features: [
        "Mimic existing products accurately",
        "Generate ingredient alternatives",
        "Optimize for cost and availability"
      ],
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Target,
      title: "Texture & Stability Simulation",
      description: "Predict product texture, mouthfeel, and shelf stability before physical prototyping, saving time and resources.",
      features: [
        "Texture modeling and prediction",
        "Shelf-life optimization",
        "Temperature stability analysis"
      ],
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: Microscope,
      title: "Compliance Modeling",
      description: "Ensure your products meet regulatory requirements across different markets with automated compliance checking.",
      features: [
        "Multi-region compliance checks",
        "Nutritional requirement validation",
        "Allergen and safety analysis"
      ],
      gradient: "from-blue-500 to-indigo-600"
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Solutions for Food Innovation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with food science expertise 
            to revolutionize how alternative foods are developed and optimized.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${solution.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <solution.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{solution.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{solution.description}</p>
              
              <ul className="space-y-3">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${solution.gradient}`}></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}