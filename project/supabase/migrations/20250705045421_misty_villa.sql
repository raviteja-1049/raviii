/*
  # Initial Schema for Synthetic Food OS

  1. New Tables
    - `profiles` - User profiles extending Supabase auth
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `company` (text)
      - `role` (text)
      - `subscription_tier` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects` - Food development projects
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `category` (text) - e.g., 'alt-protein', 'dairy-alternative', 'synthetic-meat'
      - `status` (text) - 'concept', 'development', 'testing', 'completed'
      - `target_taste_profile` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recipes` - Recipe formulations
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text)
      - `version` (integer)
      - `ingredients` (jsonb) - array of ingredient objects with proportions
      - `predicted_taste_scores` (jsonb)
      - `predicted_texture_scores` (jsonb)
      - `compliance_status` (jsonb)
      - `cost_analysis` (jsonb)
      - `created_at` (timestamp)
    
    - `taste_predictions` - AI taste prediction results
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, references recipes)
      - `sweetness_score` (decimal)
      - `umami_score` (decimal)
      - `bitterness_score` (decimal)
      - `saltiness_score` (decimal)
      - `sourness_score` (decimal)
      - `overall_rating` (decimal)
      - `confidence_score` (decimal)
      - `created_at` (timestamp)
    
    - `ingredients_database` - Master ingredient database
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `chemical_compounds` (jsonb)
      - `taste_properties` (jsonb)
      - `nutritional_data` (jsonb)
      - `regulatory_status` (jsonb)
      - `cost_per_kg` (decimal)
      - `availability_score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public ingredient database
</*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  company text,
  role text DEFAULT 'developer',
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'alt-protein',
  status text DEFAULT 'concept',
  target_taste_profile jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  version integer DEFAULT 1,
  ingredients jsonb DEFAULT '[]',
  predicted_taste_scores jsonb DEFAULT '{}',
  predicted_texture_scores jsonb DEFAULT '{}',
  compliance_status jsonb DEFAULT '{}',
  cost_analysis jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create taste_predictions table
CREATE TABLE IF NOT EXISTS taste_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  sweetness_score decimal(3,2) DEFAULT 0.0,
  umami_score decimal(3,2) DEFAULT 0.0,
  bitterness_score decimal(3,2) DEFAULT 0.0,
  saltiness_score decimal(3,2) DEFAULT 0.0,
  sourness_score decimal(3,2) DEFAULT 0.0,
  overall_rating decimal(3,2) DEFAULT 0.0,
  confidence_score decimal(3,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now()
);

-- Create ingredients_database table
CREATE TABLE IF NOT EXISTS ingredients_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL,
  chemical_compounds jsonb DEFAULT '{}',
  taste_properties jsonb DEFAULT '{}',
  nutritional_data jsonb DEFAULT '{}',
  regulatory_status jsonb DEFAULT '{}',
  cost_per_kg decimal(10,2) DEFAULT 0.0,
  availability_score integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE taste_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients_database ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can manage own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Recipes policies
CREATE POLICY "Users can manage recipes in own projects"
  ON recipes
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Taste predictions policies
CREATE POLICY "Users can manage taste predictions for own recipes"
  ON taste_predictions
  FOR ALL
  TO authenticated
  USING (
    recipe_id IN (
      SELECT r.id FROM recipes r
      JOIN projects p ON r.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Ingredients database policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read ingredients database"
  ON ingredients_database
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_project_id ON recipes(project_id);
CREATE INDEX IF NOT EXISTS idx_taste_predictions_recipe_id ON taste_predictions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients_database(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();