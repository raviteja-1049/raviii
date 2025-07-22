import React from 'react';
import { Clock, DollarSign, AlertTriangle } from 'lucide-react';

export default function Problem() {
  const problems = [
    {
      icon: Clock,
      title: "Time-Consuming Development",
      description: "Traditional R&D takes 10-36 months per product, slowing innovation and market entry.",
      color: "from-red-500 to-rose-600"
    },
    {
      icon: DollarSign,
      title: "Expensive Testing",
      description: "Millions spent on ingredient testing and lab trials without predictability.",
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: AlertTriangle,
      title: "Trial-and-Error Approach",
      description: "Lack of predictive models leads to inefficient experimentation cycles.",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Challenge in Alternative Food Development
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Current R&D processes in alt-proteins and synthetic foods are inefficient, 
            expensive, and unpredictable, hindering innovation in sustainable food production.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${problem.color} flex items-center justify-center mb-6`}>
                <problem.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{problem.title}</h3>
              <p className="text-gray-600 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}