import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CTA() {
  const benefits = [
    "Free 14-day trial",
    "No credit card required",
    "Full platform access",
    "Dedicated support team"
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Revolutionize Your Food Development?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join leading food companies using AI to accelerate innovation and bring 
            sustainable products to market faster than ever before.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 font-semibold">
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-200 font-semibold border border-white/20">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}