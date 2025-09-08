'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow, Background, Controls,
  addEdge, useNodesState, useEdgesState, MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import * as dagre from 'dagre';

import SidePanel from './SidePanel';
import NodeCard from './NodeCard';
import DockPanel from './DockPanel';

/* ---------------- Store ---------------- */
const useGraph = create((set, get) => ({
  topic: '',
  nodes: [],
  edges: [],
  selected: null,
  setTopic: (t) => set({ topic: t }),
  setGraph: (nodes, edges) => set({ nodes, edges }),
  setSelected: (id) => set({ selected: id }),
  upsertNode: (node) => {
    const list = [...get().nodes];
    const i = list.findIndex(n => n.id === node.id);
    if (i >= 0) list[i] = node; else list.push(node);
    set({ nodes: list });
  },
  clearStore: () => set({ topic: '', nodes: [], edges: [], selected: null })
}));

/* ------------- Layout (dagre) ------------- */
function layoutDagre(nodes, edges, dir = 'LR') {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: dir, nodesep: 40, ranksep: 80, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach(n => g.setNode(n.id, { width: 260, height: 80 }));
  edges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);

  const pos = {};
  g.nodes().forEach(id => { const { x, y } = g.node(id); pos[id] = { x: x - 130, y: y - 40 }; });

  return { nodes: nodes.map(n => ({ ...n, position: pos[n.id] || n.position })), edges };
}

/* --------- Local helpers ---------- */
const LOCAL_KEY  = 'knowledge-studio-v1';        // autosave snapshot (last canvas)
const TOPICS_KEY = 'knowledge-studio-topics-v1'; // map topicName -> {topic, nodes, edges}
const saveLocal  = (g) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(g)); } catch {} };
const loadLocal  = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); } catch { return null; } };

export default function Page() {
  const {
    topic, nodes: storeNodes, edges: storeEdges,
    setGraph, setTopic, selected, setSelected, upsertNode, clearStore
  } = useGraph();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Controls (now shown in Dock → Topics)
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('summary');
  const [depth, setDepth] = useState(3);
  const [steer, setSteer] = useState('');
  const [tags, setTags] = useState([]);
  const [autoLayout, setAutoLayout] = useState(true);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('Open the Topics tab below to start');

  /* ---- Dock (VS Code style) ---- */
  const [dockOpen, setDockOpen] = useState(true);
  const [dockHeight, setDockHeight] = useState(0.28); // % of viewport
  const [dockTab, setDockTab] = useState('topics');   // default to "Topics" now

  // SSR-safe viewport height
  const [viewportH, setViewportH] = useState(0);
  useEffect(() => {
    const update = () => setViewportH(window.innerHeight || 0);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const dockPx = useMemo(() => {
    const vh = viewportH || 800;
    const desired = Math.round(vh * dockHeight);
    const clamped = Math.max(120, Math.min(Math.round(vh * 0.9), desired));
    return clamped;
  }, [viewportH, dockHeight]);
  const canvasHeight = dockOpen
    ? `calc(100vh - ${dockPx}px)`  // no top toolbar anymore
    : '100vh';

  // keep RF hooks in sync with store
  useEffect(() => setNodes(storeNodes), [storeNodes, setNodes]);
  useEffect(() => setEdges(storeEdges), [storeEdges, setEdges]);

  // local autosave snapshot (not per-topic)
  useEffect(() => {
    const data = loadLocal();
    if (data && data.nodes?.length) {
      setTopic(data.topic || '');
      setGraph(data.nodes || [], data.edges || []);
      setHint('Double-click a node → Expand');
    }
  }, [setGraph, setTopic]);
  useEffect(() => { saveLocal({ topic, nodes: storeNodes, edges: storeEdges }); }, [topic, storeNodes, storeEdges]);

  /* ---- Topics manager (separate canvases) ---- */
  const [currentTopic, setCurrentTopic] = useState('');
  const [topics, setTopics] = useState([]); // list of names

  // Load topics map and optionally last-open topic
  useEffect(() => {
    try {
      const map = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
      setTopics(Object.keys(map));
      const last = localStorage.getItem(TOPICS_KEY + ':last');
      if (last && map[last]) {
        setCurrentTopic(last);
        setTopic(map[last].topic || last);
        setGraph(map[last].nodes || [], map[last].edges || []);
        setSelected(map[last].nodes?.[0]?.id || null);
        setHint('Double-click a node → Expand');
      }
    } catch {}
  }, [setGraph, setTopic]);

  const persistCurrentTopic = () => {
    if (!currentTopic) return;
    try {
      const map = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
      map[currentTopic] = { topic: currentTopic, nodes: storeNodes, edges: storeEdges };
      localStorage.setItem(TOPICS_KEY, JSON.stringify(map));
      localStorage.setItem(TOPICS_KEY + ':last', currentTopic);
      setTopics(Object.keys(map));
    } catch {}
  };

  const startNewTopic = (name) => {
    const safe = (name || '').trim();
    if (!safe) return;
    persistCurrentTopic();

    const id = nanoid();
    const center = {
      id,
      type: 'card',
      position: { x: 0, y: 0 },
      data: { title: safe, summary: 'Central topic', tags: [], bullets: [], markdown: '', isCenter: true },
      style: { width: 260 }
    };

    setCurrentTopic(safe);
    setTopic(safe);
    setGraph([center], []);
    setSelected(id);
    setHint('Double-click the node → Expand');

    try {
      const map = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
      map[safe] = { topic: safe, nodes: [center], edges: [] };
      localStorage.setItem(TOPICS_KEY, JSON.stringify(map));
      localStorage.setItem(TOPICS_KEY + ':last', safe);
      setTopics(Object.keys(map));
    } catch {}
  };

  const switchTopic = (name) => {
    const target = (name || '').trim();
    if (!target) return;
    persistCurrentTopic();
    try {
      const map = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
      const g = map[target];
      if (g) {
        setCurrentTopic(target);
        setTopic(g.topic || target);
        setGraph(g.nodes || [], g.edges || []);
        setSelected(g.nodes?.[0]?.id || null);
        setHint('Double-click a node → Expand');
        localStorage.setItem(TOPICS_KEY + ':last', target);
      }
    } catch {}
  };

  const deleteTopic = (name) => {
    const t = (name || '').trim();
    if (!t) return;
    try {
      const map = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
      delete map[t];
      localStorage.setItem(TOPICS_KEY, JSON.stringify(map));
      setTopics(Object.keys(map));
      if (currentTopic === t) {
        setCurrentTopic('');
        setTopic('');
        setGraph([], []);
        setSelected(null);
      }
    } catch {}
  };

  /* ---- Start/Export/Import/Clear/Relayout ---- */
  const start = () => {
    const name = (query || '').trim();
    if (!name) return;
    startNewTopic(name);
    setDockTab('guide');
  };

  const exportJSON = () => {
    const raw = localStorage.getItem(LOCAL_KEY) || '{}';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'graph.json' });
    a.click(); URL.revokeObjectURL(url);
  };
  const importJSON = async (file) => {
    const text = await file.text();
    try { localStorage.setItem(LOCAL_KEY, text); location.reload(); }
    catch { alert('Invalid graph file'); }
  };

  const clearAll = () => {
    clearStore();
    try { localStorage.removeItem(LOCAL_KEY); } catch {}
    setSelected(null);
    setHint('Open the Topics tab below to start');
    setGraph([], []);
  };

  const relayout = () => { const laid = layoutDagre(storeNodes, storeEdges); setGraph(laid.nodes, laid.edges); };

  /* ---- Expand from node ---- */
  const expandFrom = useCallback(async (nodeId) => {
    if (busy) return;
    const src = storeNodes.find(n => n.id === nodeId);
    if (!src) return;

    setBusy(true);
    setHint('Generating…');

    try {
      const nodeHint = (src.data.hint || '').trim();
      const combinedSteer = [steer, nodeHint].filter(Boolean).join(' | ');

      const res = await fetch('/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          source: {
            title: src.data.title,
            summary: src.data.summary,
            bullets: src.data.bullets,
            tags: src.data.tags,
            markdown: src.data.markdown
          },
          mode, depth, tags, steer: combinedSteer
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const { nodes: newNodesRaw } = await res.json();

      const existingTitles = new Set(storeNodes.map(n => (n.data.title || '').toLowerCase()));
      const fresh = (newNodesRaw || [])
        .filter(n => n.title && !existingTitles.has(n.title.toLowerCase()))
        .map(n => ({
          id: nanoid(),
          type: 'card',
          position: { x: 0, y: 0 },
          data: {
            title: n.title,
            summary: n.summary || '',
            bullets: n.bullets || [],
            tags: Array.from(new Set([...(n.tags || []), ...(tags || [])])),
            markdown: n.markdown || ''
          },
          style: { width: 260 }
        }));

      const newEdges = fresh.map(n => ({
        id: `${src.id}-${n.id}`,
        source: src.id,
        target: n.id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed }
      }));

      const nextNodes = [...storeNodes, ...fresh];
      const nextEdges = [...storeEdges, ...newEdges];

      const laid = autoLayout ? layoutDagre(nextNodes, nextEdges) : { nodes: nextNodes, edges: nextEdges };
      setGraph(laid.nodes, laid.edges);
      setHint(`Added ${fresh.length} node(s)`);

      if (!dockOpen) setDockOpen(true);
      setDockTab('guide');
      // persist current topic after change
      try {
        const map = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
        if (currentTopic) {
          map[currentTopic] = { topic: currentTopic, nodes: laid.nodes, edges: laid.edges };
          localStorage.setItem(TOPICS_KEY, JSON.stringify(map));
        }
      } catch {}
    } catch (e) {
      console.error(e);
      alert('API error:\n' + (e?.message || e));
      setHint('Failed. Try again.');
    } finally {
      setBusy(false);
      setTimeout(() => setHint('Double-click a node → Expand'), 1200);
    }
  }, [busy, storeNodes, storeEdges, topic, mode, depth, tags, steer, autoLayout, setGraph, dockOpen, currentTopic]);

  /* ---- Search highlight ---- */
  const filteredNodes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.map(n => {
      const hit =
        (n.data.title || '').toLowerCase().includes(q) ||
        (n.data.summary || '').toLowerCase().includes(q) ||
        (n.data.tags || []).some(t => (t || '').toLowerCase().includes(q));
      return { ...n, style: { ...n.style, opacity: hit ? 1 : 0.25 } };
    });
  }, [nodes, search]);

  const onConnect = useCallback(
    (p) => setEdges(eds => addEdge({ ...p, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );
  const onNodeDoubleClick = useCallback((_, node) => setSelected(node.id), [setSelected]);
  const nodeTypes = useMemo(() => ({ card: NodeCard }), []);

  // VS Code terminal toggle: Ctrl+`
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === '`') { e.preventDefault(); setDockOpen(v => !v); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Allow SidePanel suggestions to set mode
  useEffect(() => {
    const onMode = (e) => {
      const m = e?.detail;
      if (m && ['summary','definitions','examples','prerequisites','related','advanced'].includes(m)) {
        setMode(m);
      }
    };
    window.addEventListener('ks:suggestedMode', onMode);
    return () => window.removeEventListener('ks:suggestedMode', onMode);
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* Top area: canvas + right editor (no toolbar) */}
      <div style={{ height: canvasHeight, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 320px' }}>
        <div style={{ position: 'relative', minHeight: 0 }}>
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={onNodeDoubleClick}
            fitView
            nodeTypes={nodeTypes}
            style={{ height: '100%' }}
          >
            <Background />
            <Controls />
          </ReactFlow>

          {!storeNodes.length && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-sm px-3 py-2 rounded-full bg-neutral-200/80 dark:bg-neutral-800">
              Open the <b>Topics</b> tab below → Start
            </div>
          )}
        </div>

        <SidePanel
          nodes={storeNodes}
          edges={storeEdges}
          selectedId={selected}
          onSelect={setSelected}
          onChangeNode={upsertNode}
          onExpand={expandFrom}
          busy={busy}
        />
      </div>

      {/* Bottom Dock (controls live in Topics tab) */}
      <DockPanel
        open={dockOpen}
        setOpen={setDockOpen}
        heightPx={dockPx}
        setHeightPct={(pct) => setDockHeight(pct)}
        activeTab={dockTab}
        setActiveTab={setDockTab}
        nodes={storeNodes}
        selectedId={selected}
        onSelectNode={setSelected}

        /* topics (isolated canvases) */
        topics={topics}
        currentTopic={currentTopic}
        onNewTopic={startNewTopic}
        onSwitchTopic={switchTopic}
        onDeleteTopic={deleteTopic}

        /* moved toolbar controls */
        query={query} setQuery={setQuery} onStart={start}
        mode={mode} setMode={setMode}
        depth={depth} setDepth={setDepth}
        steer={steer} setSteer={setSteer}
        tags={tags} setTags={setTags}
        search={search} setSearch={setSearch}
        autoLayout={autoLayout} setAutoLayout={setAutoLayout}
        relayout={relayout}
        onExport={exportJSON}
        onImport={importJSON}
        onClear={clearAll}
        hint={hint}
      />
    </div>
  );
}
