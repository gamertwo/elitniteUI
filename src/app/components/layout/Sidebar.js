import React from 'react';

const Sidebar = ({
  centralTopic,
  setCentralTopic,
  onTopicSubmit,
  loading,
  nodes,
  favorites,
  expandedNodes,
  setExpandedNodes
}) => {
  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          🧠
        </div>
        <h2 className="text-lg font-semibold text-gray-900">New Topic</h2>
      </div>
      <form onSubmit={onTopicSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <textarea
            value={centralTopic}
            onChange={(e) => setCentralTopic(e.target.value)}
            placeholder="Enter topic..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-gray-900 placeholder-gray-400 text-sm"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !centralTopic.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Activate'}
        </button>
      </form>
      {nodes.length > 0 && (
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Stats
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Active Nodes</span>
                <span>{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Processed</span>
                <span>{nodes.filter((n) => n.answer).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Favorited</span>
                <span>{favorites.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Depth</span>
                <span>{Math.max(...nodes.map((n) => n.level), 0)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() =>
                setExpandedNodes(new Set(['center', ...nodes.map((n) => n.id)]))
              }
              className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedNodes(new Set(['center']))}
              className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
