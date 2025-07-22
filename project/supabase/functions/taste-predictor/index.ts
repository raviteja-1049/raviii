const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface TastePredictionRequest {
  ingredients: Array<{
    id: string;
    name: string;
    percentage: number;
  }>;
  targetProfile?: {
    sweetness?: number;
    umami?: number;
    bitterness?: number;
    saltiness?: number;
    sourness?: number;
  };
}

interface TastePredictionResponse {
  predictions: {
    sweetness: number;
    umami: number;
    bitterness: number;
    saltiness: number;
    sourness: number;
    overall_rating: number;
    confidence: number;
  };
  recommendations: Array<{
    type: 'increase' | 'decrease' | 'add' | 'remove';
    ingredient: string;
    reason: string;
    impact: number;
  }>;
  cost_analysis: {
    total_cost_per_kg: number;
    cost_breakdown: Array<{
      ingredient: string;
      cost: number;
      percentage: number;
    }>;
  };
}

// Simulate AI taste prediction algorithm
function predictTasteProfile(ingredients: any[]): TastePredictionResponse['predictions'] {
  let sweetness = 0;
  let umami = 0;
  let bitterness = 0;
  let saltiness = 0;
  let sourness = 0;

  // Simple weighted algorithm based on ingredient properties
  ingredients.forEach(ingredient => {
    const weight = ingredient.percentage / 100;
    
    // Mock taste contributions based on ingredient types
    if (ingredient.name.toLowerCase().includes('protein')) {
      umami += 6.5 * weight;
      bitterness += 3.2 * weight;
    }
    
    if (ingredient.name.toLowerCase().includes('yeast')) {
      umami += 9.2 * weight;
      saltiness += 6.5 * weight;
    }
    
    if (ingredient.name.toLowerCase().includes('heme')) {
      umami += 9.5 * weight;
      bitterness += 2.1 * weight;
    }
    
    if (ingredient.name.toLowerCase().includes('smoke')) {
      bitterness += 4.5 * weight;
      umami += 3.2 * weight;
    }
  });

  // Normalize scores to 0-10 range
  const normalize = (score: number) => Math.min(Math.max(score, 0), 10);
  
  const normalizedScores = {
    sweetness: normalize(sweetness),
    umami: normalize(umami),
    bitterness: normalize(bitterness),
    saltiness: normalize(saltiness),
    sourness: normalize(sourness)
  };

  // Calculate overall rating
  const overall_rating = (
    normalizedScores.umami * 0.3 +
    (10 - normalizedScores.bitterness) * 0.25 +
    normalizedScores.saltiness * 0.2 +
    normalizedScores.sweetness * 0.15 +
    normalizedScores.sourness * 0.1
  );

  // Calculate confidence based on ingredient database coverage
  const confidence = Math.min(0.85 + (ingredients.length * 0.03), 0.98);

  return {
    ...normalizedScores,
    overall_rating: normalize(overall_rating),
    confidence: Number(confidence.toFixed(2))
  };
}

function generateRecommendations(
  predictions: TastePredictionResponse['predictions'],
  ingredients: any[]
): TastePredictionResponse['recommendations'] {
  const recommendations = [];

  // If bitterness is too high
  if (predictions.bitterness > 6) {
    recommendations.push({
      type: 'add' as const,
      ingredient: 'Natural Sweetener',
      reason: 'Reduce perceived bitterness',
      impact: 0.8
    });
  }

  // If umami is low
  if (predictions.umami < 5) {
    recommendations.push({
      type: 'add' as const,
      ingredient: 'Yeast Extract',
      reason: 'Enhance savory flavor profile',
      impact: 1.2
    });
  }

  // If overall rating is low
  if (predictions.overall_rating < 6) {
    recommendations.push({
      type: 'add' as const,
      ingredient: 'Heme (Plant-Based)',
      reason: 'Improve overall taste and meatiness',
      impact: 1.5
    });
  }

  return recommendations;
}

function calculateCostAnalysis(ingredients: any[]): TastePredictionResponse['cost_analysis'] {
  // Mock cost data (in real implementation, this would query the ingredients database)
  const costData: Record<string, number> = {
    'Soy Protein Isolate': 8.50,
    'Pea Protein Isolate': 12.30,
    'Mycoprotein': 18.75,
    'Lab-Grown Chicken Protein': 125.00,
    'Methylcellulose': 15.20,
    'Heme (Plant-Based)': 180.00,
    'Yeast Extract': 8.90,
    'Natural Smoke Flavor': 35.20
  };

  let total_cost_per_kg = 0;
  const cost_breakdown = ingredients.map(ingredient => {
    const cost_per_kg = costData[ingredient.name] || 10.00;
    const ingredient_cost = (cost_per_kg * ingredient.percentage) / 100;
    total_cost_per_kg += ingredient_cost;
    
    return {
      ingredient: ingredient.name,
      cost: Number(ingredient_cost.toFixed(2)),
      percentage: ingredient.percentage
    };
  });

  return {
    total_cost_per_kg: Number(total_cost_per_kg.toFixed(2)),
    cost_breakdown
  };
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { ingredients, targetProfile }: TastePredictionRequest = await req.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid ingredients data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate ingredient percentages sum to 100
    const totalPercentage = ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.1) {
      return new Response(
        JSON.stringify({ error: "Ingredient percentages must sum to 100%" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate predictions
    const predictions = predictTasteProfile(ingredients);
    const recommendations = generateRecommendations(predictions, ingredients);
    const cost_analysis = calculateCostAnalysis(ingredients);

    const response: TastePredictionResponse = {
      predictions,
      recommendations,
      cost_analysis
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Taste prediction error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});