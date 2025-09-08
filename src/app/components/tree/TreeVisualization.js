import React from 'react';
import TreeNode from './TreeNode';

const TreeVisualization = ({
  treeData,
  viewMode,
  filteredNodes,
  expandedNodes,
  favorites,
  onNodeClick,
  onNodeExpand,
  onToggleExpanded,
  onToggleFavorite,
  loading
}) => {
  return (
    <div className="space-y-4">
      {treeData ? (
        viewMode === 'tree' ? (
          <TreeNode
            node={treeData}
            depth={0}
            expandedNodes={expandedNodes}
            favorites={favorites}
            onNodeClick={onNodeClick}
            onNodeExpand={onNodeExpand}
            onToggleExpanded={onToggleExpanded}
            onToggleFavorite={onToggleFavorite}
            loading={loading}
          />
        ) : (
          <div className="space-y-2">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => onNodeClick(node)}
                className="card p-3 hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-medium text-gray-800">
                    {node.question}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Level {node.level} • {node.category}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(node.id);
                    }}
                    className={`p-1 rounded ${
                      favorites.has(node.id)
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-yellow-100'
                    }`}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeExpand(node);
                    }}
                    className="p-1 rounded bg-gray-100 text-gray-500 hover:bg-blue-100"
                  >
                    ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 text-gray-500">
          Enter a topic to start exploring.
        </div>
      )}
    </div>
  );
};

export default TreeVisualization;
