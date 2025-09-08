import React from 'react';

const TutorialModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              How to Use
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <strong>1. Enter Topic</strong> — Type your main topic in the left
              panel and press Activate.
            </div>
            <div>
              <strong>2. Explore Nodes</strong> — Click ⚡ to expand deeper
              subtopics.
            </div>
            <div>
              <strong>3. View Details</strong> — Click a node to see full AI
              analysis.
            </div>
            <div>
              <strong>4. Organize</strong> — Favorite important nodes for quick
              access.
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
