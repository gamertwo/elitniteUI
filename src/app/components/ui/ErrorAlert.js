// Fixed ErrorAlert.js
import React from 'react';

const ErrorAlert = ({ error, onClear, isDarkMode }) => {
  return (
    <div className="mb-6 p-4 glass-panel border border-red-500/30 rounded-xl flex items-center justify-between animate-fadeInUp">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center circuit-node">
          <span className="text-white font-bold text-lg">⚠️</span>
        </div>
        <div>
          <div className="text-red-400 font-medium">Circuit Error Detected</div>
          <div className="text-red-300/80 text-sm">{error}</div>
        </div>
      </div>
      <button
        onClick={onClear}
        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorAlert;