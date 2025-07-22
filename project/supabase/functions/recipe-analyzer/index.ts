const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface RecipeAnalysisRequest {
  productDescription: string;
  targetMarket?: string;
  dietaryRestrictions?: string[];
  budgetConstraint?: number;
}

interface RecipeAnalysisResponse {
  suggested_ingredients: Array<{
    name: string;
    category: string;
    percentage_range: {
      min: number;
      max: number;
      recommended: number;
    };
    function: string;
    alternatives: string[];
  }>;
  estimated_properties: {
    texture: string;
    color: string;
    shelf_life_days: number;
    cooking_behavior: string;
  };
  compliance_notes: {
    regulatory_status: string;
    allergens: string[];
    certifications_possible: string[];
  };
  development_timeline: {
    prototype_weeks: number;
    testing_weeks: number;
    regulatory_weeks: number;
  };
}

// Mock AI-powered recipe analysis
function analyzeProductDescription(description: string): RecipeAnalysisResponse {
  const lowerDesc = description.toLowerCase();
  
  // Determine product type and suggest ingredients accordingly
  let suggested_ingredients = [];
  let estimated_properties = {
    texture: "firm",
    color: "natural",
    shelf_life_days: 14,
    cooking_behavior: "stable"
  };

  if (lowerDesc.includes('burger') || lowerDesc.includes('patty') || lowerDesc.includes('meat')) {
    suggested_ingredients = [
      {
        name: "Pea Protein Isolate",
        category: "protein",
        percentage_range: { min: 15, max: 25, recommended: 20 },
        function: "Primary protein source",
        alternatives: ["Soy Protein Isolate", "Mycoprotein"]
      },
      {
        name: "Heme (Plant-Based)",
        category: "flavoring",
        percentage_range: { min: 0.5, max: 2, recommended: 1 },
        function: "Meat-like flavor and color",
        alternatives: ["Beet Extract", "Natural Smoke Flavor"]
      },
      {
        name: "Methylcellulose",
        category: "binder",
        percentage_range: { min: 1, max: 3, recommended: 2 },
        function: "Binding and texture",
        alternatives: ["Konjac Gum", "Transglutaminase"]
      },
      {
        name: "Coconut Oil",
        category: "fat",
        percentage_range: { min: 8, max: 15, recommended: 12 },
        function: "Fat content and mouthfeel",
        alternatives: ["Sunflower Oil", "Avocado Oil"]
      },
      {
        name: "Yeast Extract",
        category: "flavoring",
        percentage_range: { min: 1, max: 3, recommended: 2 },
        function: "Umami enhancement",
        alternatives: ["Mushroom Extract", "Soy Sauce Powder"]
      }
    ];
    
    estimated_properties = {
      texture: "firm, juicy",
      color: "brown when cooked",
      shelf_life_days: 10,
      cooking_behavior: "browns and firms when heated"
    };
  } else if (lowerDesc.includes('cheese') || lowerDesc.includes('dairy')) {
    suggested_ingredients = [
      {
        name: "Cashew Base",
        category: "protein",
        percentage_range: { min: 25, max: 40, recommended: 30 },
        function: "Creamy texture base",
        alternatives: ["Almond Base", "Coconut Cream"]
      },
      {
        name: "Nutritional Yeast",
        category: "flavoring",
        percentage_range: { min: 3, max: 8, recommended: 5 },
        function: "Cheesy flavor",
        alternatives: ["Yeast Extract", "Fermented Cashew"]
      },
      {
        name: "Agar",
        category: "texturizer",
        percentage_range: { min: 1, max: 3, recommended: 2 },
        function: "Firmness and sliceability",
        alternatives: ["Carrageenan", "Konjac Gum"]
      },
      {
        name: "Lactic Acid",
        category: "flavoring",
        percentage_range: { min: 0.5, max: 2, recommended: 1 },
        function: "Tangy cheese flavor",
        alternatives: ["Citric Acid", "Vinegar Powder"]
      }
    ];
    
    estimated_properties = {
      texture: "smooth, sliceable",
      color: "pale yellow",
      shelf_life_days: 21,
      cooking_behavior: "melts when heated"
    };
  } else {
    // Generic alternative protein product
    suggested_ingredients = [
      {
        name: "Soy Protein Isolate",
        category: "protein",
        percentage_range: { min: 20, max: 35, recommended: 25 },
        function: "Primary protein source",
        alternatives: ["Pea Protein", "Rice Protein"]
      },
      {
        name: "Natural Flavoring",
        category: "flavoring",
        percentage_range: { min: 2, max: 5, recommended: 3 },
        function: "Taste enhancement",
        alternatives: ["Yeast Extract", "Spice Blend"]
      }
    ];
  }

  const compliance_notes = {
    regulatory_status: "Generally Recognized as Safe (GRAS) ingredients",
    allergens: determineAllergens(suggested_ingredients),
    certifications_possible: ["Vegan", "Non-GMO", "Organic (with certified ingredients)"]
  };

  const development_timeline = {
    prototype_weeks: 2,
    testing_weeks: 4,
    regulatory_weeks: 8
  };

  return {
    suggested_ingredients,
    estimated_properties,
    compliance_notes,
    development_timeline
  };
}

function determineAllergens(ingredients: any[]): string[] {
  const allergens = new Set<string>();
  
  ingredients.forEach(ingredient => {
    const name = ingredient.name.toLowerCase();
    if (name.includes('soy')) allergens.add('Soy');
    if (name.includes('cashew') || name.includes('almond')) allergens.add('Tree Nuts');
    if (name.includes('wheat') || name.includes('gluten')) allergens.add('Gluten');
  });
  
  return Array.from(allergens);
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

    const { productDescription, targetMarket, dietaryRestrictions, budgetConstraint }: RecipeAnalysisRequest = await req.json();

    if (!productDescription || productDescription.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Product description is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate recipe analysis
    const analysis = analyzeProductDescription(productDescription);

    // Apply dietary restrictions filter
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      analysis.suggested_ingredients = analysis.suggested_ingredients.filter(ingredient => {
        const name = ingredient.name.toLowerCase();
        
        if (dietaryRestrictions.includes('gluten-free') && name.includes('wheat')) {
          return false;
        }
        if (dietaryRestrictions.includes('soy-free') && name.includes('soy')) {
          return false;
        }
        if (dietaryRestrictions.includes('nut-free') && (name.includes('cashew') || name.includes('almond'))) {
          return false;
        }
        
        return true;
      });
    }

    // Apply budget constraints
    if (budgetConstraint && budgetConstraint > 0) {
      // Filter out expensive ingredients if budget is low
      if (budgetConstraint < 20) {
        analysis.suggested_ingredients = analysis.suggested_ingredients.filter(ingredient => 
          !ingredient.name.toLowerCase().includes('heme') && 
          !ingredient.name.toLowerCase().includes('lab-grown')
        );
      }
    }

    return new Response(
      JSON.stringify(analysis),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Recipe analysis error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});