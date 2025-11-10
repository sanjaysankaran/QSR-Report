import React, { useState } from 'react';
import { FileText, FileDown, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface StepGenerateProps {
  onGenerate: (formats: string[]) => Promise<void>;
  isGenerating: boolean;
  generationStatus: {
    processing: boolean;
    calculating: boolean;
    template: boolean;
    downloads: boolean;
  };
}

const StepGenerate: React.FC<StepGenerateProps> = ({ onGenerate, isGenerating, generationStatus }) => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['pdf']);

  const handleFormatToggle = (format: string) => {
    setSelectedFormats((prev) => {
      if (prev.includes(format)) {
        return prev.filter((f) => f !== format);
      }
      return [...prev, format];
    });
  };

  const handleGenerate = () => {
    if (selectedFormats.length > 0) {
      onGenerate(selectedFormats);
    }
  };

  const statusItems = [
    { key: 'processing', label: 'Processing Data', status: generationStatus.processing },
    { key: 'calculating', label: 'Calculating Metrics', status: generationStatus.calculating },
    { key: 'template', label: 'Generating Template', status: generationStatus.template },
    { key: 'downloads', label: 'Creating Downloads', status: generationStatus.downloads },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Generate Report</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Generation Options</h4>
            <p className="text-sm text-gray-400 mb-4">
              Select the formats you want to generate:
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes('pdf')}
                  onChange={() => handleFormatToggle('pdf')}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isGenerating}
                />
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-red-400" />
                  <span className="text-white group-hover:text-blue-400 transition-colors">PDF Document</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes('docx')}
                  onChange={() => handleFormatToggle('docx')}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isGenerating}
                />
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span className="text-white group-hover:text-blue-400 transition-colors">Word Document (.docx)</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || selectedFormats.length === 0}
              className={`
                px-8 py-4 rounded-lg font-semibold text-white transition-all 
                shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                ${!isGenerating && selectedFormats.length > 0 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 animate-glow' 
                  : 'bg-gray-700'}
              `}
            >
              <div className="flex items-center space-x-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="h-5 w-5" />
                    <span>Generate Report</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {isGenerating && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-medium text-white mb-3">Generation Status</h4>
              <div className="space-y-2">
                {statusItems.map((item) => (
                  <div key={item.key} className="flex items-center space-x-3">
                    {item.status === true ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : item.status === false ? (
                      <Clock className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                    )}
                    <span className={`text-sm ${
                      item.status === true ? 'text-green-400' : 
                      item.status === false ? 'text-gray-500' : 
                      'text-blue-400'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepGenerate;