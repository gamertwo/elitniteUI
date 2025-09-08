import React from 'react';

const TreeNode = ({
  node,
  depth = 0,
  expandedNodes,
  favorites,
  onNodeClick,
  onNodeExpand,
  onToggleExpanded,
  onToggleFavorite,
  loading
}) => {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isFavorite = favorites.has(node.id);

  return (
    <div className="fade-in" style={{ marginLeft: depth > 0 ? '1.5rem' : 0 }}>
      <div className="flex items-start space-x-4 py-3">
        <div className="flex flex-col space-y-2 pt-2">
          {(hasChildren || !node.isRoot) && (
            <button
              onClick={() =>
                hasChildren ? onToggleExpanded(node.id) : onNodeExpand(node)
              }
              disabled={loading}
              className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center text-sm font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              ⚡
            </button>
          )}
          {!node.isRoot && (
            <button
              onClick={() => onToggleFavorite(node.id)}
              className={`w-8 h-8 rounded-md flex items-center justify-center ${
                isFavorite
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-yellow-100'
              }`}
            >
              ⭐
            </button>
          )}
        </div>
        <div
          onClick={() => onNodeClick(node)}
          className="flex-1 cursor-pointer card p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center">
                {node.isRoot ? '🎯' : '💡'}
              </div>
              <div className="flex flex-col">
                {!node.isRoot && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      Level {node.level}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {node.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {!node.isRoot && (
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${node.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {node.progress || 0}%
                </span>
              </div>
            )}
          </div>
          <div
            className={`font-medium ${
              node.isRoot ? 'text-lg text-gray-900 text-center' : 'text-gray-800'
            }`}
          >
            {node.question}
          </div>
          {!node.isRoot && (
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              {node.answer && (
                <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                  ✓ Processed
                </span>
              )}
              {hasChildren && <span>{node.children.length} sub-nodes</span>}
            </div>
          )}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              favorites={favorites}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              onToggleExpanded={onToggleExpanded}
              onToggleFavorite={onToggleFavorite}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
