import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DatabaseSetup() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        setConnectionStatus('error');
        setError(error.message);
      } else {
        setConnectionStatus('connected');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError('Failed to connect to Supabase');
    }
  };

  if (connectionStatus === 'checking') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Checking Database Connection
            </h3>
            <p className="text-gray-600">
              Verifying connection to Supabase...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Database Setup Required
            </h3>
            <p className="text-gray-600 mb-6">
              Please configure your Supabase connection in the .env file with your project URL and anon key.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left text-sm font-mono">
              <div className="text-gray-700">
                VITE_SUPABASE_URL=your_project_url<br/>
                VITE_SUPABASE_ANON_KEY=your_anon_key
              </div>
            </div>
            <button 
              onClick={checkConnection}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-emerald-100 border border-emerald-200 rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-5 w-5 text-emerald-600" />
        <span className="text-emerald-800 font-medium">Database Connected</span>
      </div>
    </div>
  );
}