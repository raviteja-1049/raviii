import React from 'react';
import { Database, Cpu, TrendingUp, Shield, Globe, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Database,
      title: "Comprehensive Database",
      description: "Access to extensive chemical compound and taste profile databases for accurate predictions."
    },
    {
      icon: Cpu,
      title: "Advanced AI Models",
      description: "State-of-the-art machine learning algorithms trained on millions of food science data points."
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Get accurate predictions for taste, texture, and stability before physical prototyping."
    },
    {
      icon: Shield,
      title: "Compliance Assurance",
      description: "Built-in regulatory compliance checking for multiple markets and food safety standards."
    },
    {
      icon: Globe,
      title: "Global Market Data",
      description: "Access market preferences and regulatory requirements from around the world."
    },
    {
      icon: Zap,
      title: "Real-time Optimization",
      description: "Continuously optimize recipes based on cost, availability, and performance metrics."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Food Innovation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to accelerate your alternative food development process, 
            from initial concept to market-ready product.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}