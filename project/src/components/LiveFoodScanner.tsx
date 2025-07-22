import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Scan, DollarSign, TrendingUp, Eye, X, RefreshCw } from 'lucide-react';

interface MarketPrice {
  ingredient: string;
  current_price: number;
  price_change_24h: number;
  supplier: string;
  availability: 'high' | 'medium' | 'low';
  last_updated: string;
}

interface LiveDetectionResult {
  detected_food: string;
  confidence: number;
  ingredients: Array<{
    name: string;
    percentage: number;
    market_price: MarketPrice;
    alternatives: Array<{
      name: string;
      price_difference: number;
      availability: string;
    }>;
  }>;
  total_market_cost: number;
  cost_trend: 'rising' | 'falling' | 'stable';
  regional_availability: {
    north_america: boolean;
    europe: boolean;
    asia: boolean;
  };
}

export default function LiveFoodScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState<LiveDetectionResult | null>(null);
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMarketPrices();
    const interval = setInterval(loadMarketPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMarketPrices = async () => {
    // Simulate real-time market data API call
    const mockMarketData: MarketPrice[] = [
      {
        ingredient: "Pea Protein Isolate",
        current_price: 12.45,
        price_change_24h: 2.3,
        supplier: "Roquette",
        availability: 'high',
        last_updated: new Date().toISOString()
      },
      {
        ingredient: "Soy Protein Isolate",
        current_price: 8.90,
        price_change_24h: -1.2,
        supplier: "ADM",
        availability: 'high',
        last_updated: new Date().toISOString()
      },
      {
        ingredient: "Heme (Plant-Based)",
        current_price: 185.50,
        price_change_24h: 5.7,
        supplier: "Impossible Foods",
        availability: 'low',
        last_updated: new Date().toISOString()
      },
      {
        ingredient: "Methylcellulose",
        current_price: 15.80,
        price_change_24h: 0.5,
        supplier: "DowDuPont",
        availability: 'medium',
        last_updated: new Date().toISOString()
      },
      {
        ingredient: "Nutritional Yeast",
        current_price: 6.25,
        price_change_24h: -0.8,
        supplier: "Lallemand",
        availability: 'high',
        last_updated: new Date().toISOString()
      }
    ];
    
    setMarketPrices(mockMarketData);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions or use file upload.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Convert to blob and analyze
      canvas.toBlob(async (blob) => {
        if (blob) {
          await analyzeImage(blob);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzeImage(file);
    }
  };

  const analyzeImage = async (imageBlob: Blob) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate AI image analysis with realistic food detection
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI detection result
      const mockResult = generateMockDetection();
      setDetectionResult(mockResult);
      
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockDetection = (): LiveDetectionResult => {
    const detectedFoods = [
      'Plant-Based Burger Patty',
      'Vegan Cheese Block',
      'Alternative Protein Nuggets',
      'Lab-Grown Meat Sample',
      'Plant-Based Milk'
    ];
    
    const randomFood = detectedFoods[Math.floor(Math.random() * detectedFoods.length)];
    
    const ingredients = marketPrices.slice(0, 3 + Math.floor(Math.random() * 2)).map(price => ({
      name: price.ingredient,
      percentage: 15 + Math.random() * 25,
      market_price: price,
      alternatives: [
        {
          name: `Alternative ${price.ingredient}`,
          price_difference: -10 + Math.random() * 20,
          availability: 'medium'
        }
      ]
    }));
    
    const total_market_cost = ingredients.reduce((sum, ing) => 
      sum + (ing.market_price.current_price * ing.percentage / 100), 0
    );
    
    return {
      detected_food: randomFood,
      confidence: 0.85 + Math.random() * 0.1,
      ingredients,
      total_market_cost: Number(total_market_cost.toFixed(2)),
      cost_trend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as any,
      regional_availability: {
        north_america: Math.random() > 0.2,
        europe: Math.random() > 0.3,
        asia: Math.random() > 0.4
      }
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Scan className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Live Food Scanner</h2>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Market Data Live</span>
            </div>
          </div>
          <p className="text-blue-100">
            Scan food products with your camera or upload images for real-time ingredient analysis 
            with current market pricing and availability data.
          </p>
        </div>

        {/* Market Price Ticker */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <TrendingUp className="h-4 w-4" />
              <span>Live Prices:</span>
            </div>
            {marketPrices.slice(0, 3).map((price, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="text-sm text-gray-600">{price.ingredient}</span>
                <span className="text-sm font-medium">${price.current_price}/kg</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  price.price_change_24h > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {price.price_change_24h > 0 ? '+' : ''}{price.price_change_24h.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Scan Mode Selection */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                scanMode === 'camera'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span>Live Camera</span>
            </button>
            <button
              onClick={() => setScanMode('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                scanMode === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Upload Image</span>
            </button>
          </div>

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-80 object-cover"
                  style={{ display: isScanning ? 'block' : 'none' }}
                />
                {!isScanning && (
                  <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Camera not active</p>
                      <button
                        onClick={startCamera}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Camera
                      </button>
                    </div>
                  </div>
                )}
                
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-white rounded-lg opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 border-2 border-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                {isScanning ? (
                  <>
                    <button
                      onClick={captureImage}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-5 w-5" />
                          <span>Capture & Analyze</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Stop Camera
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Start Camera</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upload Mode */}
          {scanMode === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload Food Image</p>
                <p className="text-gray-500">Click to select or drag and drop an image</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Detection Results */}
          {detectionResult && (
            <div className="mt-8 space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{detectionResult.detected_food}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">
                      {(detectionResult.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${detectionResult.total_market_cost.toFixed(2)}
                    </div>
                    <div className="text-green-700">Current Market Cost/kg</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      detectionResult.cost_trend === 'rising' ? 'text-red-600' :
                      detectionResult.cost_trend === 'falling' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      {detectionResult.cost_trend === 'rising' ? '↗' :
                       detectionResult.cost_trend === 'falling' ? '↘' : '→'}
                    </div>
                    <div className="text-gray-700 capitalize">{detectionResult.cost_trend} Trend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {detectionResult.ingredients.length}
                    </div>
                    <div className="text-blue-700">Ingredients Detected</div>
                  </div>
                </div>
              </div>

              {/* Ingredient Analysis with Live Pricing */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Market Analysis</h4>
                <div className="space-y-4">
                  {detectionResult.ingredients.map((ingredient, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{ingredient.name}</h5>
                          <p className="text-sm text-gray-600">{ingredient.percentage.toFixed(1)}% of formula</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ${ingredient.market_price.current_price}/kg
                          </div>
                          <div className={`text-sm ${
                            ingredient.market_price.price_change_24h > 0 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {ingredient.market_price.price_change_24h > 0 ? '+' : ''}
                            {ingredient.market_price.price_change_24h.toFixed(1)}% (24h)
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Supplier:</span>
                          <span className="ml-2 font-medium">{ingredient.market_price.supplier}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Availability:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                            ingredient.market_price.availability === 'high' ? 'bg-green-100 text-green-700' :
                            ingredient.market_price.availability === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {ingredient.market_price.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Availability */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Regional Availability</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      detectionResult.regional_availability.north_america 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {detectionResult.regional_availability.north_america ? '✓' : '✗'}
                    </div>
                    <div className="text-sm font-medium">North America</div>
                  </div>
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      detectionResult.regional_availability.europe 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {detectionResult.regional_availability.europe ? '✓' : '✗'}
                    </div>
                    <div className="text-sm font-medium">Europe</div>
                  </div>
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      detectionResult.regional_availability.asia 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {detectionResult.regional_availability.asia ? '✓' : '✗'}
                    </div>
                    <div className="text-sm font-medium">Asia</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}