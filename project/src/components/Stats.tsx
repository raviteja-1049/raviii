import React from 'react';
import { TrendingUp, Clock, DollarSign, Target } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: TrendingUp,
      value: "95%",
      label: "Prediction Accuracy",
      description: "Industry-leading taste and texture prediction accuracy"
    },
    {
      icon: Clock,
      value: "90%",
      label: "Time Reduction",
      description: "Faster development cycles compared to traditional methods"
    },
    {
      icon: DollarSign,
      value: "$2M+",
      label: "Cost Savings",
      description: "Average savings per product development cycle"
    },
    {
      icon: Target,
      value: "500+",
      label: "Products Launched",
      description: "Successful products developed using our platform"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-emerald-500 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Proven Results in Food Innovation
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Our platform has helped food companies worldwide accelerate their development 
            cycles and bring innovative products to market faster.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-all duration-300">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-xl font-semibold text-emerald-100 mb-2">{stat.label}</div>
              <p className="text-emerald-100 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}