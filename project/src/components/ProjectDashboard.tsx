import React, { useState, useEffect } from 'react';
import { Plus, Beaker, Clock, Target, TrendingUp, Brain, Zap, Camera, DollarSign } from 'lucide-react';
import { projectsAPI, recipesAPI } from '../lib/api';
import RealtimeIndicator from './RealtimeIndicator';
import FoodDetectorPage from './FoodDetectorPage';
import LiveFoodScanner from './LiveFoodScanner';
import MarketPriceTracker from './MarketPriceTracker';

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'food-detector' | 'live-scanner' | 'market-tracker'>('dashboard');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadRecipes(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async (projectId: string) => {
    try {
      const data = await recipesAPI.getByProject(projectId);
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  const createNewProject = async () => {
    try {
      const newProject = await projectsAPI.create({
        name: `New Project ${projects.length + 1}`,
        description: 'A new food development project',
        category: 'alt-protein'
      });
      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Render different views based on currentView state
  if (currentView === 'food-detector') {
    return <FoodDetectorPage onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'live-scanner') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>← Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Live Food Scanner</h1>
            </div>
          </div>
          <LiveFoodScanner />
        </div>
      </div>
    );
  }

  if (currentView === 'market-tracker') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>← Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Market Price Tracker</h1>
            </div>
          </div>
          <MarketPriceTracker />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Beaker className="h-12 w-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your food development projects with AI-powered tools</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentView('market-tracker')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <DollarSign className="h-5 w-5" />
              <span>Market Prices</span>
            </button>
            <button
              onClick={() => setCurrentView('live-scanner')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>Live Scanner</span>
            </button>
            <button
              onClick={() => setCurrentView('food-detector')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Brain className="h-5 w-5" />
              <span>AI Detection</span>
            </button>
            <button
              onClick={createNewProject}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setCurrentView('live-scanner')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Camera className="h-8 w-8" />
              <h3 className="text-xl font-bold">Live Scanner</h3>
            </div>
            <p className="text-blue-100 mb-4">
              Use your camera or upload images to scan and analyze food products in real-time.
            </p>
            <div className="flex items-center space-x-2 text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Camera Ready</span>
            </div>
          </div>

          <div 
            onClick={() => setCurrentView('market-tracker')}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="h-8 w-8" />
              <h3 className="text-xl font-bold">Market Prices</h3>
            </div>
            <p className="text-green-100 mb-4">
              Track real-time ingredient prices, market trends, and supplier availability.
            </p>
            <div className="flex items-center space-x-2 text-green-200">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Live Data Feed</span>
            </div>
          </div>

          <div 
            onClick={() => setCurrentView('food-detector')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-8 w-8" />
              <h3 className="text-xl font-bold">AI Detection</h3>
            </div>
            <p className="text-purple-100 mb-4">
              Analyze food descriptions and get instant ingredient predictions and insights.
            </p>
            <div className="flex items-center space-x-2 text-purple-200">
              <Zap className="h-4 w-4" />
              <span className="text-sm">AI Powered</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-8 w-8" />
              <h3 className="text-xl font-bold">Active Projects</h3>
            </div>
            <div className="text-3xl font-bold mb-2">{projects.length}</div>
            <p className="text-emerald-100">Total projects in development</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Projects Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              </div>
              <div className="p-4 space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProject?.id === project.id
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{project.category}</div>
                  </button>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Beaker className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No projects yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Project Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                      <p className="text-gray-600">{selectedProject.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{recipes.length}</div>
                        <div className="text-sm text-gray-500">Recipes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 capitalize">{selectedProject.status}</div>
                        <div className="text-sm text-gray-500">Status</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Created {new Date(selectedProject.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span className="capitalize">{selectedProject.category}</span>
                    </div>
                  </div>
                </div>

                {/* Recipes Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Recipes</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentView('live-scanner')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Scan Food</span>
                        </button>
                        <button
                          onClick={() => setCurrentView('food-detector')}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm"
                        >
                          <Brain className="h-4 w-4" />
                          <span>AI Generate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {recipes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipes.map((recipe) => (
                          <div key={recipe.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-200 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                              <span className="text-sm text-gray-500">v{recipe.version}</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              {recipe.ingredients?.length || 0} ingredients
                            </div>
                            {recipe.predicted_taste_scores && (
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm text-emerald-600">
                                  Score: {recipe.predicted_taste_scores.overall_rating?.toFixed(1) || 'N/A'}
                                </span>
                              </div>
                            )}
                            {recipe.name.includes('AI Generated') && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Brain className="h-4 w-4 text-purple-600" />
                                <span className="text-sm text-purple-600">AI Generated</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        <Beaker className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No recipes yet</p>
                        <p className="text-sm mb-6">Start by creating your first recipe for this project</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={() => setCurrentView('live-scanner')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Camera className="h-5 w-5" />
                            <span>Scan Food Product</span>
                          </button>
                          <button
                            onClick={() => setCurrentView('food-detector')}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                          >
                            <Brain className="h-5 w-5" />
                            <span>Generate with AI</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Beaker className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Synthetic Food OS</h3>
                <p className="text-gray-600 mb-6">Create your first project to start developing alternative food products</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={createNewProject}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Project</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('live-scanner')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Try Live Scanner</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Collaboration Indicator */}
      <RealtimeIndicator projectId={selectedProject?.id} />
    </div>
  );
}