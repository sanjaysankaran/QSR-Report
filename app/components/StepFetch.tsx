import React, { useState } from 'react';
import { Search, Database, FileText, Link2, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface StepFetchProps {
  onFetchData: (itemId: string) => Promise<void>;
  isLoading: boolean;
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}

const StepFetch: React.FC<StepFetchProps> = ({ onFetchData, isLoading, fetchStatus, errorMessage }) => {
  const [itemId, setItemId] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateItemId = (id: string): boolean => {
    const trimmedId = id.trim();
    if (!trimmedId) {
      setValidationError('Item ID is required');
      return false;
    }
    if (!trimmedId.startsWith('KFF-')) {
      setValidationError('Invalid Item ID. Must start with "KFF-"');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = itemId.trim();
    if (validateItemId(trimmedId)) {
      await onFetchData(trimmedId);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemId(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const dataTypes = [
    { icon: <FileText className="h-5 w-5" />, label: 'Feature Information' },
    { icon: <Link2 className="h-5 w-5" />, label: 'Document Links' },
    { icon: <Users className="h-5 w-5" />, label: 'Team Information' },
    { icon: <Database className="h-5 w-5" />, label: 'Test Data' },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Fetch Data from Kissflow</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="itemId" className="block text-sm font-medium text-gray-300 mb-2">
                Kissflow Item ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="itemId"
                  value={itemId}
                  onChange={handleInputChange}
                  placeholder="Enter Item ID (e.g., KFF-0111)"
                  className={`w-full rounded-lg bg-gray-800/50 border px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    validationError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {validationError && (
                <div className="flex items-center space-x-2 text-red-400 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{validationError}</span>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !itemId.trim()}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
            >
              {isLoading ? 'Fetching Data...' : 'Fetch Data'}
            </button>
          </form>

          {fetchStatus !== 'idle' && !validationError && (
            <div className="mt-4">
              {fetchStatus === 'loading' && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-sm">Connecting to Kissflow...</span>
                </div>
              )}
              {fetchStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Data fetched successfully!</span>
                </div>
              )}
              {fetchStatus === 'error' && (
                <div className="flex items-start space-x-2 text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{errorMessage || 'Failed to fetch data'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">What We'll Fetch</h3>
          <p className="text-sm text-gray-400 mb-4">
            The following information will be automatically retrieved from Kissflow:
          </p>
          
          <div className="space-y-3">
            {dataTypes.map((type, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 rounded-lg bg-gray-800/30 p-3 border border-gray-700"
              >
                <div className="text-blue-400">{type.icon}</div>
                <span className="text-sm text-gray-300">{type.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/50">
            <p className="text-xs text-yellow-400">
              <strong>Note:</strong> Some fields may require manual entry if not available in Kissflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFetch;