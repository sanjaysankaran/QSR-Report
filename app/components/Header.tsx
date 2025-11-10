import React from 'react';
import { FileText, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold text-white">QSR Automation</h1>
              <p className="text-xs text-gray-400">Quality Summary Report Generator</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-xs text-gray-400">Powered by</p>
            <p className="text-sm font-semibold text-white">Kissflow</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">v1.0.0</span>
            <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;