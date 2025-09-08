import React from 'react';

const Header = ({
  isDarkMode,
  setIsDarkMode,
  searchQuery,
  setSearchQuery,
  clearSearch,
  viewMode,
  setViewMode,     // may be undefined on /knowledge-map
  setShowTutorial,
  progress = {}    // guard
}) => {
  const total = progress.total || 0;
  const explored = progress.explored || 0;
  const canToggleView = typeof setViewMode === 'function';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                ⚡
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Knowledge Tree</h1>
                <p className="text-sm text-gray-500">AI-Powered Knowledge Explorer</p>
              </div>
            </div>

            {total > 0 && (
              <div className="flex items-center space-x-3 px-3 py-1.5 bg-gray-100 rounded-lg">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${(explored / total) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {explored}/{total}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {typeof setSearchQuery === 'function' && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 text-sm"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                )}
              </div>
            )}

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => canToggleView && setViewMode('tree')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  viewMode === 'tree' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                } ${!canToggleView ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canToggleView}
              >
                🌐 Tree
              </button>
              <button
                onClick={() => canToggleView && setViewMode('compact')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  viewMode === 'compact' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                } ${!canToggleView ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canToggleView}
              >
                📊 List
              </button>
            </div>

            <button
              onClick={() => (window.location.href = '/knowledge-map')}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              🌐 Map View
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              ↩ Back to Tree
            </button>

            {typeof setShowTutorial === 'function' && (
              <button onClick={() => setShowTutorial(true)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200" title="Show tutorial">
                ❓
              </button>
            )}
            {typeof setIsDarkMode === 'function' && (
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                {isDarkMode ? '💡' : '🌙'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
