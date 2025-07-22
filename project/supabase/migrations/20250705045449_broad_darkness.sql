/*
  # Seed Ingredients Database

  1. Purpose
    - Populate the ingredients database with common alternative food ingredients
    - Include taste properties, chemical compounds, and regulatory data
    - Provide realistic cost and availability data

  2. Categories
    - Proteins (plant-based, lab-grown)
    - Binding agents
    - Flavoring compounds
    - Texturizers
    - Preservatives
    - Colorants
*/

-- Insert protein ingredients
INSERT INTO ingredients_database (name, category, chemical_compounds, taste_properties, nutritional_data, regulatory_status, cost_per_kg, availability_score) VALUES
('Soy Protein Isolate', 'protein', 
 '{"primary": "protein", "compounds": ["glycinin", "beta-conglycinin"]}',
 '{"umami": 6.5, "bitterness": 4.2, "astringency": 3.8}',
 '{"protein": 90, "fat": 1, "carbs": 3, "fiber": 2}',
 '{"FDA": "approved", "EU": "approved", "organic_certified": true}',
 8.50, 9),

('Pea Protein Isolate', 'protein',
 '{"primary": "protein", "compounds": ["legumin", "vicilin"]}',
 '{"umami": 5.8, "bitterness": 5.1, "earthy": 4.3}',
 '{"protein": 85, "fat": 2, "carbs": 5, "fiber": 1}',
 '{"FDA": "approved", "EU": "approved", "allergen_free": true}',
 12.30, 8),

('Mycoprotein', 'protein',
 '{"primary": "fungal_protein", "compounds": ["chitin", "beta_glucan"]}',
 '{"umami": 7.2, "meaty": 6.8, "earthy": 5.5}',
 '{"protein": 45, "fat": 5, "carbs": 9, "fiber": 25}',
 '{"FDA": "approved", "EU": "approved", "novel_food": true}',
 18.75, 6),

('Lab-Grown Chicken Protein', 'protein',
 '{"primary": "animal_protein", "compounds": ["myosin", "actin", "collagen"]}',
 '{"umami": 8.5, "meaty": 9.2, "savory": 8.8}',
 '{"protein": 75, "fat": 15, "carbs": 0, "cholesterol": 45}',
 '{"FDA": "pending", "EU": "under_review", "novel_food": true}',
 125.00, 2);

-- Insert binding agents
INSERT INTO ingredients_database (name, category, chemical_compounds, taste_properties, nutritional_data, regulatory_status, cost_per_kg, availability_score) VALUES
('Methylcellulose', 'binder',
 '{"primary": "cellulose_derivative", "compounds": ["methyl_cellulose"]}',
 '{"neutral": 9.0, "mouthfeel": 7.5}',
 '{"protein": 0, "fat": 0, "carbs": 85, "fiber": 85}',
 '{"FDA": "approved", "EU": "approved", "E_number": "E461"}',
 15.20, 7),

('Transglutaminase', 'binder',
 '{"primary": "enzyme", "compounds": ["transglutaminase"]}',
 '{"neutral": 8.5, "binding_strength": 9.5}',
 '{"protein": 95, "fat": 0, "carbs": 0}',
 '{"FDA": "approved", "EU": "approved", "enzyme": true}',
 45.60, 5),

('Konjac Gum', 'binder',
 '{"primary": "glucomannan", "compounds": ["glucomannan"]}',
 '{"neutral": 9.2, "gel_strength": 8.8}',
 '{"protein": 0, "fat": 0, "carbs": 90, "fiber": 90}',
 '{"FDA": "approved", "EU": "approved", "natural": true}',
 22.40, 6);

-- Insert flavoring compounds
INSERT INTO ingredients_database (name, category, chemical_compounds, taste_properties, nutritional_data, regulatory_status, cost_per_kg, availability_score) VALUES
('Heme (Plant-Based)', 'flavoring',
 '{"primary": "iron_porphyrin", "compounds": ["leghemoglobin"]}',
 '{"umami": 9.5, "meaty": 9.8, "metallic": 3.2}',
 '{"protein": 60, "iron": 15, "fat": 5}',
 '{"FDA": "approved", "EU": "pending", "GMO": true}',
 180.00, 3),

('Yeast Extract', 'flavoring',
 '{"primary": "nucleotides", "compounds": ["glutamate", "inosinate", "guanylate"]}',
 '{"umami": 9.2, "savory": 8.8, "salty": 6.5}',
 '{"protein": 45, "sodium": 8, "potassium": 12}',
 '{"FDA": "approved", "EU": "approved", "natural": true}',
 8.90, 9),

('Natural Smoke Flavor', 'flavoring',
 '{"primary": "phenolic_compounds", "compounds": ["guaiacol", "syringol"]}',
 '{"smoky": 9.0, "woody": 7.5, "bitter": 2.8}',
 '{"negligible_nutrition": true}',
 '{"FDA": "approved", "EU": "approved", "natural": true}',
 35.20, 7);

-- Insert texturizers
INSERT INTO ingredients_database (name, category, chemical_compounds, taste_properties, nutritional_data, regulatory_status, cost_per_kg, availability_score) VALUES
('Carrageenan', 'texturizer',
 '{"primary": "sulfated_polysaccharide", "compounds": ["kappa_carrageenan", "iota_carrageenan"]}',
 '{"neutral": 9.0, "gel_strength": 8.5}',
 '{"protein": 0, "fat": 0, "carbs": 80, "fiber": 75}',
 '{"FDA": "approved", "EU": "approved", "E_number": "E407"}',
 18.50, 8),

('Agar', 'texturizer',
 '{"primary": "agarose", "compounds": ["agarose", "agaropectin"]}',
 '{"neutral": 9.5, "gel_strength": 9.0}',
 '{"protein": 0, "fat": 0, "carbs": 85, "fiber": 80}',
 '{"FDA": "approved", "EU": "approved", "natural": true}',
 28.70, 6),

('Pectin', 'texturizer',
 '{"primary": "pectin", "compounds": ["methoxylated_pectin"]}',
 '{"neutral": 8.8, "gel_strength": 7.2}',
 '{"protein": 0, "fat": 0, "carbs": 90, "fiber": 85}',
 '{"FDA": "approved", "EU": "approved", "natural": true}',
 12.80, 8);