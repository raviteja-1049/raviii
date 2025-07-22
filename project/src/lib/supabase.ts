import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  company?: string
  role: string
  subscription_tier: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string
  category: string
  status: string
  target_taste_profile: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  project_id: string
  name: string
  version: number
  ingredients: Array<{
    id: string
    name: string
    percentage: number
  }>
  predicted_taste_scores: Record<string, number>
  predicted_texture_scores: Record<string, any>
  compliance_status: Record<string, any>
  cost_analysis: Record<string, any>
  created_at: string
}

export interface Ingredient {
  id: string
  name: string
  category: string
  chemical_compounds: Record<string, any>
  taste_properties: Record<string, number>
  nutritional_data: Record<string, any>
  regulatory_status: Record<string, any>
  cost_per_kg: number
  availability_score: number
  created_at: string
}

export interface TastePrediction {
  id: string
  recipe_id: string
  sweetness_score: number
  umami_score: number
  bitterness_score: number
  saltiness_score: number
  sourness_score: number
  overall_rating: number
  confidence_score: number
  created_at: string
}