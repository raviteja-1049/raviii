import { supabase } from './supabase'

// API functions for interacting with Supabase and edge functions

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'APIError'
  }
}

// Auth functions
export const authAPI = {
  async signUp(email: string, password: string, userData: { full_name?: string; company?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw new APIError(error.message)
    
    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: userData.full_name,
          company: userData.company
        })
      
      if (profileError) throw new APIError(profileError.message)
    }
    
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw new APIError(error.message)
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new APIError(error.message)
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw new APIError(error.message)
    return user
  }
}

// Projects API
export const projectsAPI = {
  async create(projectData: {
    name: string
    description?: string
    category?: string
    target_taste_profile?: Record<string, any>
  }) {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()
    
    if (error) throw new APIError(error.message)
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw new APIError(error.message)
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new APIError(error.message)
    return data
  },

  async update(id: string, updates: Partial<{
    name: string
    description: string
    category: string
    status: string
    target_taste_profile: Record<string, any>
  }>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new APIError(error.message)
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw new APIError(error.message)
  }
}

// Recipes API
export const recipesAPI = {
  async create(recipeData: {
    project_id: string
    name: string
    ingredients: Array<{ id: string; name: string; percentage: number }>
  }) {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single()
    
    if (error) throw new APIError(error.message)
    return data
  },

  async getByProject(projectId: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw new APIError(error.message)
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new APIError(error.message)
    return data
  },

  async update(id: string, updates: Partial<{
    name: string
    ingredients: Array<{ id: string; name: string; percentage: number }>
    predicted_taste_scores: Record<string, number>
    predicted_texture_scores: Record<string, any>
    compliance_status: Record<string, any>
    cost_analysis: Record<string, any>
  }>) {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new APIError(error.message)
    return data
  }
}

// Ingredients API
export const ingredientsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('ingredients_database')
      .select('*')
      .order('name')
    
    if (error) throw new APIError(error.message)
    return data
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('ingredients_database')
      .select('*')
      .eq('category', category)
      .order('name')
    
    if (error) throw new APIError(error.message)
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('ingredients_database')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
    
    if (error) throw new APIError(error.message)
    return data
  }
}

// AI Functions API
export const aiAPI = {
  async predictTaste(ingredients: Array<{ id: string; name: string; percentage: number }>) {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/taste-predictor`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new APIError(error.error || 'Taste prediction failed', response.status)
    }

    return response.json()
  },

  async analyzeRecipe(productDescription: string, options?: {
    targetMarket?: string
    dietaryRestrictions?: string[]
    budgetConstraint?: number
  }) {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recipe-analyzer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productDescription,
        ...options
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new APIError(error.error || 'Recipe analysis failed', response.status)
    }

    return response.json()
  }
}