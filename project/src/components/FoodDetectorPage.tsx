import React, { useState } from 'react';
import { ArrowLeft, Beaker } from 'lucide-react';
import FoodDetector from './FoodDetector';
import { projectsAPI, recipesAPI } from '../lib/api';

interface FoodDetectorPageProps {
  onBack: () => void;
}

export default function FoodDetectorPage({ onBack }: FoodDetectorPageProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  const handleResultSelect = async (result: any) => {
    setShowProjectSelector(true);
    
    // Load user projects
    try {
      const userProjects = await projectsAPI.getAll();
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const createRecipeFromDetection = async (result: any, projectId: string) => {
    try {
      const ingredients = result.predicted_ingredients.map((ing: any) => ({
        id: `ingredient_${ing.name.toLowerCase().replace(/\s+/g, '_')}`,
        name: ing.name,
        percentage: ing.percentage
      }));

      const newRecipe = await recipesAPI.create({
        project_id: projectId,
        name: `${result.food_name} - AI Generated`,
        ingredients
      });

      // Update recipe with AI predictions
      await recipesAPI.update(newRecipe.id, {
        predicted_taste_scores: result.taste_profile,
        cost_analysis: {
          estimated_cost_per_kg: result.estimated_cost.cost_per_kg,
          market_price_range: result.estimated_cost.market_price_range
        }
      });

      setShowProjectSelector(false);
      onBack(); // Return to dashboard to see the new recipe
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <Beaker className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Food Detection</h1>
          </div>
        </div>

        <FoodDetector onResultSelect={handleResultSelect} />

        {/* Project Selection Modal */}
        {showProjectSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Save to Project
              </h3>
              <p className="text-gray-600 mb-6">
                Choose a project to save this AI-generated recipe analysis.
              </p>

              <div className="space-y-3 mb-6">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      createRecipeFromDetection(result, project.id);
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-600 capitalize">{project.category}</div>
                  </button>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p>No projects found. Create a project first.</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowProjectSelector(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    // Create new project
                    try {
                      const newProject = await projectsAPI.create({
                        name: 'AI Detection Project',
                        description: 'Project created from AI food detection',
                        category: 'alt-protein'
                      });
                      createRecipeFromDetection(result, newProject.id);
                    } catch (error) {
                      console.error('Error creating project:', error);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  New Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}