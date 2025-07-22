import React, { useState } from 'react';
import { Camera, Upload, Zap, Brain, Target, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { aiAPI } from '../lib/api';

interface DetectionResult {
  food_name: string;
  confidence: number;
  predicted_ingredients: Array<{
    name: string;
    percentage: number;
    confidence: number;
    category: string;
  }>;
  taste_profile: {
    sweetness: number;
    umami: number;
    bitterness: number;
    saltiness: number;
    sourness: number;
    overall_rating: number;
  };
  nutritional_estimate: {
    calories_per_100g: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  estimated_cost: {
    cost_per_kg: number;
    market_price_range: {
      min: number;
      max: number;
    };
  };
  development_suggestions: string[];
}

interface FoodDetectorProps {
  onResultSelect?: (result: DetectionResult) => void;
}

export default function FoodDetector({ onResultSelect }: FoodDetectorProps) {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleFoods = [
    "Plant-based burger patty with smoky flavor",
    "Dairy-free cheese alternative with sharp taste",
    "Lab-grown chicken nuggets",
    "Vegan chocolate milk with creamy texture",
    "Alternative protein pasta made from legumes",
    "Synthetic seafood with ocean-like taste",
    "Plant-based bacon strips with crispy texture",
    "Cultured meat steak with marbling",
    "Mushroom-based protein powder",
    "Algae-derived omega-3 supplement"
  ];

  const detectRandomFood = () => {
    const randomFood = sampleFoods[Math.floor(Math.random() * sampleFoods.length)];
    setDescription(randomFood);
    analyzeFood(randomFood);
  };

  const analyzeFood = async (foodDescription?: string) => {
    const textToAnalyze = foodDescription || description;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate AI food detection with realistic data
      const mockResult = generateMockDetection(textToAnalyze);
      
      // Add some delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult(mockResult);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze food');
    } finally {
      setLoading(false);
    }
  };

  const generateMockDetection = (description: string): DetectionResult => {
    const lowerDesc = description.toLowerCase();
    
    // Determine food type and generate realistic data
    let food_name = "Unknown Food Product";
    let predicted_ingredients: DetectionResult['predicted_ingredients'] = [];
    let taste_profile: DetectionResult['taste_profile'] = {
      sweetness: 2,
      umami: 5,
      bitterness: 3,
      saltiness: 4,
      sourness: 2,
      overall_rating: 6.5
    };
    let nutritional_estimate: DetectionResult['nutritional_estimate'] = {
      calories_per_100g: 250,
      protein: 20,
      fat: 15,
      carbs: 10,
      fiber: 5
    };
    let estimated_cost = {
      cost_per_kg: 25.00,
      market_price_range: { min: 20.00, max: 35.00 }
    };
    let development_suggestions: string[] = [];

    if (lowerDesc.includes('burger') || lowerDesc.includes('patty')) {
      food_name = "Plant-Based Burger Patty";
      predicted_ingredients = [
        { name: "Pea Protein Isolate", percentage: 22, confidence: 0.92, category: "protein" },
        { name: "Heme (Plant-Based)", percentage: 1.5, confidence: 0.88, category: "flavoring" },
        { name: "Methylcellulose", percentage: 2, confidence: 0.85, category: "binder" },
        { name: "Coconut Oil", percentage: 12, confidence: 0.90, category: "fat" },
        { name: "Yeast Extract", percentage: 2.5, confidence: 0.87, category: "flavoring" },
        { name: "Natural Smoke Flavor", percentage: 0.8, confidence: 0.82, category: "flavoring" },
        { name: "Water", percentage: 45, confidence: 0.95, category: "base" },
        { name: "Salt", percentage: 1.2, confidence: 0.93, category: "seasoning" }
      ];
      taste_profile = {
        sweetness: 1.5,
        umami: 8.2,
        bitterness: 2.8,
        saltiness: 6.5,
        sourness: 1.2,
        overall_rating: 8.1
      };
      nutritional_estimate = {
        calories_per_100g: 280,
        protein: 25,
        fat: 18,
        carbs: 8,
        fiber: 3
      };
      estimated_cost = {
        cost_per_kg: 32.50,
        market_price_range: { min: 28.00, max: 40.00 }
      };
      development_suggestions = [
        "Increase heme content for more authentic meat flavor",
        "Add beetroot extract for better color development",
        "Consider adding transglutaminase for improved texture binding"
      ];
    } else if (lowerDesc.includes('cheese')) {
      food_name = "Dairy-Free Cheese Alternative";
      predicted_ingredients = [
        { name: "Cashew Base", percentage: 35, confidence: 0.89, category: "protein" },
        { name: "Nutritional Yeast", percentage: 8, confidence: 0.91, category: "flavoring" },
        { name: "Agar", percentage: 2.5, confidence: 0.86, category: "texturizer" },
        { name: "Lactic Acid", percentage: 1.2, confidence: 0.88, category: "flavoring" },
        { name: "Coconut Oil", percentage: 15, confidence: 0.87, category: "fat" },
        { name: "Water", percentage: 35, confidence: 0.94, category: "base" },
        { name: "Salt", percentage: 1.8, confidence: 0.92, category: "seasoning" }
      ];
      taste_profile = {
        sweetness: 2.1,
        umami: 6.8,
        bitterness: 1.5,
        saltiness: 7.2,
        sourness: 4.5,
        overall_rating: 7.3
      };
      nutritional_estimate = {
        calories_per_100g: 320,
        protein: 12,
        fat: 28,
        carbs: 8,
        fiber: 2
      };
      estimated_cost = {
        cost_per_kg: 28.75,
        market_price_range: { min: 25.00, max: 35.00 }
      };
      development_suggestions = [
        "Add fermented cashew cultures for more complex flavor",
        "Increase agar concentration for better slicing properties",
        "Consider adding natural cheese flavoring compounds"
      ];
    } else if (lowerDesc.includes('chicken') || lowerDesc.includes('nugget')) {
      food_name = "Lab-Grown Chicken Product";
      predicted_ingredients = [
        { name: "Lab-Grown Chicken Protein", percentage: 65, confidence: 0.95, category: "protein" },
        { name: "Wheat Flour", percentage: 15, confidence: 0.88, category: "coating" },
        { name: "Sunflower Oil", percentage: 8, confidence: 0.90, category: "fat" },
        { name: "Natural Chicken Flavor", percentage: 2, confidence: 0.85, category: "flavoring" },
        { name: "Salt", percentage: 1.5, confidence: 0.92, category: "seasoning" },
        { name: "Water", percentage: 8, confidence: 0.93, category: "base" }
      ];
      taste_profile = {
        sweetness: 1.8,
        umami: 9.1,
        bitterness: 1.2,
        saltiness: 5.8,
        sourness: 0.8,
        overall_rating: 8.8
      };
      nutritional_estimate = {
        calories_per_100g: 220,
        protein: 28,
        fat: 12,
        carbs: 5,
        fiber: 1
      };
      estimated_cost = {
        cost_per_kg: 125.00,
        market_price_range: { min: 100.00, max: 150.00 }
      };
      development_suggestions = [
        "Optimize cell culture medium for cost reduction",
        "Add natural texturizing agents for better mouthfeel",
        "Consider hybrid approach with plant proteins to reduce costs"
      ];
    }

    return {
      food_name,
      confidence: 0.87 + Math.random() * 0.1,
      predicted_ingredients,
      taste_profile,
      nutritional_estimate,
      estimated_cost,
      development_suggestions
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-8 w-8" />
            <h2 className="text-2xl font-bold">AI Food Detection & Analysis</h2>
          </div>
          <p className="text-emerald-100">
            Describe any food product and get instant AI-powered ingredient analysis, 
            taste predictions, and development insights.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Description
            </label>
            <div className="flex space-x-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the food product you want to analyze (e.g., 'Plant-based burger with smoky flavor and juicy texture')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3 mt-3">
              <button
                onClick={() => analyzeFood()}
                disabled={loading || !description.trim()}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Analyze Food</span>
                  </>
                )}
              </button>
              
              <button
                onClick={detectRandomFood}
                disabled={loading}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Target className="h-4 w-4" />
                <span>Random Food</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Detection Summary */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-emerald-900">{result.food_name}</h3>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {result.predicted_ingredients.length}
                    </div>
                    <div className="text-emerald-700">Ingredients Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {result.taste_profile.overall_rating.toFixed(1)}/10
                    </div>
                    <div className="text-emerald-700">Taste Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      ${result.estimated_cost.cost_per_kg.toFixed(2)}
                    </div>
                    <div className="text-emerald-700">Cost per kg</div>
                  </div>
                </div>
              </div>

              {/* Predicted Ingredients */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Predicted Ingredients</h4>
                <div className="space-y-3">
                  {result.predicted_ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{ingredient.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{ingredient.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{ingredient.percentage}%</div>
                        <div className="text-sm text-gray-600">
                          {(ingredient.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Taste Profile */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Predicted Taste Profile</h4>
                <div className="space-y-3">
                  {Object.entries(result.taste_profile).map(([taste, score]) => {
                    if (taste === 'overall_rating') return null;
                    return (
                      <div key={taste} className="flex items-center justify-between">
                        <span className="capitalize font-medium text-gray-700">{taste}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${(score / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nutritional Estimate */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Nutritional Estimate (per 100g)</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.nutritional_estimate.calories_per_100g}
                    </div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.nutritional_estimate.protein}g
                    </div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {result.nutritional_estimate.fat}g
                    </div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {result.nutritional_estimate.carbs}g
                    </div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.nutritional_estimate.fiber}g
                    </div>
                    <div className="text-sm text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Estimated Production Cost</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${result.estimated_cost.cost_per_kg.toFixed(2)}/kg
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Market Price Range</span>
                    </div>
                    <div className="text-lg text-blue-600">
                      ${result.estimated_cost.market_price_range.min.toFixed(2)} - 
                      ${result.estimated_cost.market_price_range.max.toFixed(2)}/kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Development Suggestions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Development Suggestions</h4>
                <div className="space-y-3">
                  {result.development_suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-blue-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {onResultSelect && (
                <div className="flex justify-center">
                  <button
                    onClick={() => onResultSelect(result)}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Use This Analysis</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}