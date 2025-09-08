import React from 'react';

const DetailPanel = ({ selectedNode, onClose, onRelatedQuestionClick }) => {
  return (
    <div className="card p-5 sticky top-28">
      {selectedNode ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center">
                💡
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Node Analysis
                </h3>
                <p className="text-sm text-gray-500">
                  Level {selectedNode.level} • {selectedNode.category}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Question</h4>
            <p className="text-gray-800">{selectedNode.question}</p>
          </div>
          {selectedNode.loading ? (
            <div className="text-center py-10 text-gray-500">
              Processing...
            </div>
          ) : selectedNode.answer ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Answer
                </h4>
                <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedNode.answer.answer}
                </p>
              </div>
              {selectedNode.answer.keyPoints?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Key Points
                  </h4>
                  <ul className="list-disc pl-5 text-gray-800 text-sm space-y-1">
                    {selectedNode.answer.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedNode.answer.relatedQuestions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Related
                  </h4>
                  <div className="space-y-1">
                    {selectedNode.answer.relatedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => onRelatedQuestionClick(q)}
                        className="block w-full text-left text-sm text-blue-600 hover:underline"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              Click a node to view details.
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm">
          Select a node to view analysis.
        </div>
      )}
    </div>
  );
};

export default DetailPanel;
