import { useState } from 'react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'workout', name: 'Workout', icon: '🏋️' },
    { id: 'planner', name: 'Planner', icon: '📋' },
    { id: 'progress', name: 'Progress', icon: '📈' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏃‍♂️</span>
            <h1 className="text-xl font-bold text-gray-800">FitTrack Pro</h1>
          </div>
          
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}