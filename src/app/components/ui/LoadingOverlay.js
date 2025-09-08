// Fixed LoadingOverlay.js
import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Multi-ring loader */}
          <div className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-purple-500/30 border-r-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-4 border-4 border-cyan-500/30 border-b-cyan-400 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-8 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">⚡</span>
          </div>
        </div>
        
        <div className="text-white text-xl font-bold mb-2 hologram-text">
          Neural Processing
        </div>
        <div className="text-blue-400 text-sm">
          Analyzing circuit pathways...
        </div>
        
        {/* Progress bars */}
        <div className="mt-6 space-y-2">
          {['Initializing Neural Network', 'Processing Data Streams', 'Generating Pathways'].map((text, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-xs text-blue-300 w-32 text-right">{text}</span>
              <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"
                  style={{ 
                    width: '100%',
                    animation: `dataFlow 2s infinite`,
                    animationDelay: `${index * 0.5}s`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;