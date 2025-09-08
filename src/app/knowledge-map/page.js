'use client';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useKnowledgeTree } from '../components/hooks/useKnowledgeTree';
import DetailPanel from '../components/panels/DetailPanel';
import Header from '../components/layout/Header';

function flattenTreeToNodes(root) {
  const list = [];
  function walk(n) {
    list.push(n);
    (n.children || []).forEach(walk);
  }
  if (root) walk(root);
  return list;
}

export default function KnowledgeMapPage() {
  const { nodes: hookNodes, treeData, selectedNode, setSelectedNode, progress } = useKnowledgeTree();
  const [storedNodes, setStoredNodes] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kt_nodes');
      if (raw) setStoredNodes(JSON.parse(raw));
    } catch {}
  }, []);

  const baseNodes =
    (hookNodes && hookNodes.length > 0 && hookNodes) ||
    (treeData ? flattenTreeToNodes(treeData) : []) ||
    storedNodes ||
    [];

  const { rfNodes, rfEdges } = useMemo(() => {
    const levelGroups = new Map();
    baseNodes.forEach(n => {
      const lvl = n.level ?? 0;
      if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
      levelGroups.get(lvl).push(n);
    });

    const vGap = 160;
    const hGap = 280;

    const rfNodes = [];
    const rfEdges = [];

    Array.from(levelGroups.keys()).sort((a, b) => a - b).forEach((lvl, colIdx) => {
      const col = levelGroups.get(lvl);
      const total = col.length;
      col.forEach((n, rowIdx) => {
        const x = colIdx * hGap;
        const y = rowIdx * vGap - ((total - 1) * vGap) / 2;
        rfNodes.push({
          id: String(n.id),
          position: { x, y },
          data: { label: n.question },
          style: {
            padding: 10,
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            fontSize: 12,
            width: 260
          }
        });

        if (n.children && n.children.length) {
          n.children.forEach(child => {
            rfEdges.push({
              id: `${n.id}-${child.id}`,
              source: String(n.id),
              target: String(child.id),
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#CBD5E1' }
            });
          });
        }
      });
    });

    return { rfNodes, rfEdges };
  }, [baseNodes]);

  const onNodeClick = useCallback((_, node) => {
    const found = baseNodes.find(n => String(n.id) === node.id);
    if (found) setSelectedNode(found);
  }, [baseNodes, setSelectedNode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header viewMode="map" progress={progress} />
      <div className="flex">
        <div className="flex-1 h-[calc(100vh-72px)]">
          {rfNodes.length > 0 ? (
            <ReactFlow
              nodes={rfNodes}
              edges={rfEdges}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.2, includeHiddenNodes: true }}
            >
              <MiniMap pannable zoomable />
              <Controls />
              <Background gap={24} />
            </ReactFlow>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No data yet. Go to the Tree page, generate nodes, then return.
            </div>
          )}
        </div>
        <div className="w-96 border-l border-gray-200 bg-white p-4 overflow-y-auto h-[calc(100vh-72px)]">
          <DetailPanel
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
            onRelatedQuestionClick={(q) => {
              const found = baseNodes.find(n => n.question === q);
              if (found) setSelectedNode(found);
            }}
          />
        </div>
      </div>
    </div>
  );
}
