import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, AlertTriangle } from 'lucide-react';

interface MarketData {
  ingredient: string;
  current_price: number;
  price_change_24h: number;
  price_change_7d: number;
  volume_24h: number;
  supplier: string;
  availability: 'high' | 'medium' | 'low';
  last_updated: string;
  price_alerts: Array<{
    type: 'price_spike' | 'shortage' | 'new_supplier';
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export default function MarketPriceTracker() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(loadMarketData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    
    // Simulate real-time market data API
    const mockData: MarketData[] = [
      {
        ingredient: "Pea Protein Isolate",
        current_price: 12.45 + (Math.random() - 0.5) * 0.5,
        price_change_24h: 2.3 + (Math.random() - 0.5) * 2,
        price_change_7d: 5.8 + (Math.random() - 0.5) * 3,
        volume_24h: 1250000,
        supplier: "Roquette",
        availability: 'high',
        last_updated: new Date().toISOString(),
        price_alerts: [
          {
            type: 'price_spike',
            message: 'Price increased 15% due to supply chain disruption',
            severity: 'medium'
          }
        ]
      },
      {
        ingredient: "Soy Protein Isolate",
        current_price: 8.90 + (Math.random() - 0.5) * 0.3,
        price_change_24h: -1.2 + (Math.random() - 0.5) * 1.5,
        price_change_7d: -3.4 + (Math.random() - 0.5) * 2,
        volume_24h: 2100000,
        supplier: "ADM",
        availability: 'high',
        last_updated: new Date().toISOString(),
        price_alerts: []
      },
      {
        ingredient: "Heme (Plant-Based)",
        current_price: 185.50 + (Math.random() - 0.5) * 10,
        price_change_24h: 5.7 + (Math.random() - 0.5) * 8,
        price_change_7d: 12.3 + (Math.random() - 0.5) * 15,
        volume_24h: 45000,
        supplier: "Impossible Foods",
        availability: 'low',
        last_updated: new Date().toISOString(),
        price_alerts: [
          {
            type: 'shortage',
            message: 'Limited availability - only 2 weeks supply remaining',
            severity: 'high'
          }
        ]
      },
      {
        ingredient: "Methylcellulose",
        current_price: 15.80 + (Math.random() - 0.5) * 0.8,
        price_change_24h: 0.5 + (Math.random() - 0.5) * 1,
        price_change_7d: 1.2 + (Math.random() - 0.5) * 2,
        volume_24h: 890000,
        supplier: "DowDuPont",
        availability: 'medium',
        last_updated: new Date().toISOString(),
        price_alerts: []
      },
      {
        ingredient: "Nutritional Yeast",
        current_price: 6.25 + (Math.random() - 0.5) * 0.2,
        price_change_24h: -0.8 + (Math.random() - 0.5) * 1,
        price_change_7d: -2.1 + (Math.random() - 0.5) * 1.5,
        volume_24h: 560000,
        supplier: "Lallemand",
        availability: 'high',
        last_updated: new Date().toISOString(),
        price_alerts: []
      },
      {
        ingredient: "Coconut Oil (Refined)",
        current_price: 4.35 + (Math.random() - 0.5) * 0.3,
        price_change_24h: 1.8 + (Math.random() - 0.5) * 2,
        price_change_7d: 4.2 + (Math.random() - 0.5) * 3,
        volume_24h: 3200000,
        supplier: "Cargill",
        availability: 'high',
        last_updated: new Date().toISOString(),
        price_alerts: []
      }
    ];

    setMarketData(mockData);
    setLastUpdate(new Date());
    setLoading(false);
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-600" />;
    return <div className="h-4 w-4" />;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Live Market Prices</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-sm">Live Data</span>
              </div>
              <button
                onClick={loadMarketData}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <p className="text-green-100">
            Real-time pricing data for alternative food ingredients from major suppliers worldwide.
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex space-x-2">
            {(['24h', '7d', '30d'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Market Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Ingredient</th>
                <th className="text-right p-4 font-semibold text-gray-900">Price (USD/kg)</th>
                <th className="text-right p-4 font-semibold text-gray-900">24h Change</th>
                <th className="text-right p-4 font-semibold text-gray-900">7d Change</th>
                <th className="text-center p-4 font-semibold text-gray-900">Availability</th>
                <th className="text-left p-4 font-semibold text-gray-900">Supplier</th>
                <th className="text-center p-4 font-semibold text-gray-900">Alerts</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{item.ingredient}</div>
                    <div className="text-sm text-gray-500">
                      Vol: {(item.volume_24h / 1000000).toFixed(1)}M kg
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${item.current_price.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${getPriceChangeColor(item.price_change_24h)}`}>
                      {getPriceChangeIcon(item.price_change_24h)}
                      <span className="font-medium">
                        {item.price_change_24h > 0 ? '+' : ''}{item.price_change_24h.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${getPriceChangeColor(item.price_change_7d)}`}>
                      {getPriceChangeIcon(item.price_change_7d)}
                      <span className="font-medium">
                        {item.price_change_7d > 0 ? '+' : ''}{item.price_change_7d.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(item.availability)}`}>
                      {item.availability}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-900">{item.supplier}</div>
                  </td>
                  <td className="p-4 text-center">
                    {item.price_alerts.length > 0 ? (
                      <div className="flex justify-center">
                        <div className="relative group">
                          <AlertTriangle className="h-5 w-5 text-orange-500 cursor-pointer" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                            <div className="bg-black text-white text-xs rounded py-2 px-3 whitespace-nowrap">
                              {item.price_alerts[0].message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Alerts Section */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Alerts</h3>
          <div className="space-y-3">
            {marketData
              .filter(item => item.price_alerts.length > 0)
              .map((item, index) => (
                <div key={index}>
                  {item.price_alerts.map((alert, alertIndex) => (
                    <div
                      key={alertIndex}
                      className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.ingredient}</div>
                          <div className="text-sm">{alert.message}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {alert.type.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            
            {marketData.every(item => item.price_alerts.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active market alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}