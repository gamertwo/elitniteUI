'use client';
import React, { useRef, useState } from 'react';

export default function DockPanel({
  open, setOpen,
  heightPx, setHeightPct,
  activeTab, setActiveTab,
  nodes, selectedId, onSelectNode,

  /* Topics (isolated canvases) */
  topics = [], currentTopic = '',
  onNewTopic, onSwitchTopic, onDeleteTopic,

  /* Controls moved from top toolbar */
  query, setQuery, onStart,
  mode, setMode,
  depth, setDepth,
  steer, setSteer,
  tags, setTags,
  search, setSearch,
  autoLayout, setAutoLayout,
  relayout,
  onExport, onImport, onClear,
  hint
}) {
  // Drag-to-resize
  const startY = useRef(0);
  const startH = useRef(heightPx);
  const onMouseDown = (e) => {
    startY.current = e.clientY;
    startH.current = heightPx;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    const dy = startY.current - e.clientY; // drag up -> bigger
    const newH = Math.max(120, Math.min(window.innerHeight * 0.9, startH.current + dy));
    const pct = newH / window.innerHeight;
    setHeightPct(pct);
  };
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  if (!open) {
    return (
      <div
        className="border-t border-neutral-300 dark:border-neutral-700 px-2 py-1 flex items-center gap-2"
        style={{ height: 28, background: 'rgba(28,28,28,0.9)', color: '#eee' }}
      >
        <button
          onClick={() => setOpen(true)}
          className="text-xs px-2 py-0.5 rounded bg-neutral-200/40 dark:bg-neutral-700"
          title="Show panel (Ctrl+`)"
        >▲ Show Panel</button>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} disabled />
        <div className="ml-auto text-[11px] opacity-80 pr-2">Dock hidden — press Ctrl+`</div>
      </div>
    );
  }

  const selected = nodes.find(n => n.id === selectedId) || null;

  return (
    <div
      className="border-t border-neutral-300 dark:border-neutral-700"
      style={{ height: heightPx, minHeight: 120, background: 'rgba(22,22,22,0.96)', color: '#f6f6f6', display: 'flex', flexDirection: 'column' }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-2" style={{ height: 32 }}>
        <div className="font-medium text-xs opacity-90">Panel</div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="ml-auto text-[11px] opacity-70">{hint}</div>
        <div className="ml-2">
          <button onClick={() => setOpen(false)} className="text-xs px-2 py-0.5 rounded bg-neutral-200/20 hover:bg-neutral-200/30">
            ▼ Hide (Ctrl+`)
          </button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onMouseDown}
        style={{ height: 6, cursor: 'ns-resize', background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))' }}
        title="Drag to resize"
      />

      {/* Content */}
      <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'auto', padding: 12 }}>
        {activeTab === 'guide'   && <GuideTab selected={selected} />}
        {activeTab === 'nodes'   && <NodesTab nodes={nodes} selectedId={selectedId} onSelectNode={onSelectNode} />}
        {activeTab === 'topics'  && (
          <TopicsTab
            /* topic canvases */
            topics={topics}
            currentTopic={currentTopic}
            onNewTopic={onNewTopic}
            onSwitchTopic={onSwitchTopic}
            onDeleteTopic={onDeleteTopic}
            /* controls moved into this tab */
            query={query} setQuery={setQuery} onStart={onStart}
            mode={mode} setMode={setMode}
            depth={depth} setDepth={setDepth}
            steer={steer} setSteer={setSteer}
            tags={tags} setTags={setTags}
            search={search} setSearch={setSearch}
            autoLayout={autoLayout} setAutoLayout={setAutoLayout}
            relayout={relayout}
            onExport={onExport}
            onImport={onImport}
            onClear={onClear}
          />
        )}
      </div>
    </div>
  );
}

function Tabs({ activeTab, setActiveTab, disabled = false }) {
  const items = [
    ['guide',  'Practical Guide'],
    ['nodes',  'All Nodes'],
    ['topics', 'Topics']
  ];
  return (
    <div className="flex items-center gap-1 ml-2">
      {items.map(([id, label]) => (
        <button
          key={id}
          disabled={disabled}
          onClick={() => !disabled && setActiveTab(id)}
          className={`text-xs px-2 py-1 rounded ${activeTab === id ? 'bg-emerald-500 text-black' : 'bg-neutral-200/20 hover:bg-neutral-200/30 text-neutral-100'}`}
          style={{ opacity: disabled ? 0.5 : 1 }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ------------ Tabs content ------------- */

function GuideTab({ selected }) {
  if (!selected) {
    return <div className="text-sm opacity-80" style={{ paddingLeft: 8 }}>Select a node to see its practical guide here.</div>;
  }
  return (
    <div>
      <div className="text-[12px] opacity-80 mb-2" style={{ paddingLeft: 8 }}>
        {selected.data.title} — Practical Guide
      </div>
      <pre
        className="whitespace-pre-wrap bg-neutral-900/50 border border-neutral-700 rounded"
        style={{
          fontSize: '14px',
          lineHeight: 1.5,
          padding: '12px 14px',
          paddingLeft: 20,
          maxHeight: '100%',
          overflow: 'auto',
          marginLeft: 6
        }}
      >
        {selected?.data?.markdown || '—'}
      </pre>
    </div>
  );
}

function NodesTab({ nodes, selectedId, onSelectNode }) {
  return (
    <div>
      <div className="text-[11px] opacity-80 mb-2" style={{ paddingLeft: 6 }}>All Nodes</div>
      <div className="flex flex-wrap gap-2" style={{ paddingLeft: 6 }}>
        {nodes.map(n => (
          <button
            key={n.id}
            onClick={() => onSelectNode(n.id)}
            className={`text-xs px-2 py-1 rounded ${n.id === selectedId ? 'bg-emerald-500 text-black' : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-100'}`}
            title={n.data.title}
          >
            {n.data.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function TopicsTab(props) {
  const {
    topics, currentTopic, onNewTopic, onSwitchTopic, onDeleteTopic,
    query, setQuery, onStart,
    mode, setMode,
    depth, setDepth,
    steer, setSteer,
    tags, setTags,
    search, setSearch,
    autoLayout, setAutoLayout,
    relayout, onExport, onImport, onClear
  } = props;

  const fileRef = useRef();
  const addTag = (t) => {
    const v = (t || '').trim();
    if (!v) return;
    const s = new Set(tags);
    s.add(v);
    setTags([...s]);
  };
  const removeTag = (t) => setTags(tags.filter(x => x !== t));

  return (
    <div>
      {/* Topic bar: new/switch/delete */}
      <div className="text-[11px] opacity-80 mb-2" style={{ paddingLeft: 6 }}>
        Topics (local) — current: <b>{currentTopic || '—'}</b>
      </div>

      <div className="flex items-center gap-2 mb-3" style={{ paddingLeft: 6 }}>
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Topic name (e.g., Machine learning)"
          className="h-8 px-2 rounded border bg-neutral-900/40 border-neutral-700 text-sm"
          style={{ width: 300 }}
        />
        <button onClick={onStart} className="h-8 px-3 rounded bg-emerald-500 text-black text-sm">Start</button>
      </div>

      <div className="flex flex-wrap gap-2" style={{ paddingLeft: 6 }}>
        {topics.length === 0 && <div className="text-xs opacity-70">No saved topics yet.</div>}
        {topics.map(t => (
          <div key={t} className={`flex items-center gap-1 rounded px-2 py-1 ${t===currentTopic ? 'bg-emerald-600 text-black' : 'bg-neutral-800 text-neutral-100'}`}>
            <button className="text-xs" title={`Switch to ${t}`} onClick={()=>onSwitchTopic(t)}>{t}</button>
            <button className="text-[10px] opacity-80 hover:opacity-100" title="Delete" onClick={()=>onDeleteTopic(t)}>×</button>
          </div>
        ))}
      </div>

      {/* Controls row */}
      <div className="border-t border-neutral-700 mt-4 pt-3" style={{ paddingLeft: 6 }}>
        <div className="flex items-center flex-wrap gap-2">
          <select value={mode} onChange={(e)=>setMode(e.target.value)} className="h-8 px-2 rounded border bg-neutral-900/40 border-neutral-700 text-sm">
            <option value="summary">Prerequisites</option>
            <option value="definitions">Definitions</option>
            <option value="examples">Examples</option>
            <option value="prerequisites">Prerequisites (alt)</option>
            <option value="related">Related</option>
            <option value="advanced">Advanced</option>
          </select>

          <span className="text-xs opacity-70">Depth</span>
          <input type="number" min={1} max={8} value={depth} onChange={(e)=>setDepth(Number(e.target.value||1))} className="h-8 w-14 px-2 rounded border bg-neutral-900/40 border-neutral-700 text-sm"/>

          <input
            value={steer}
            onChange={(e)=>setSteer(e.target.value)}
            placeholder="Global steer (e.g., 'focus on system design')"
            className="h-8 px-2 rounded border bg-neutral-900/40 border-neutral-700 text-sm"
            style={{ width: 320 }}
          />

          <input
            placeholder="Add tag ↵"
            onKeyDown={(e)=>{ if(e.key==='Enter'){ addTag(e.currentTarget.value); e.currentTarget.value=''; }}}
            className="h-8 px-2 rounded border bg-neutral-900/40 border-neutral-700 text-sm"
            style={{ width: 160 }}
          />
          <div className="flex gap-1 max-w-[180px] overflow-x-auto no-scrollbar">
            {tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-neutral-700 whitespace-nowrap">
                {t} <button onClick={()=>removeTag(t)}>×</button>
              </span>
            ))}
          </div>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search nodes"
            className="h-8 px-2 rounded border bg-neutral-900/40 border-neutral-700 text-sm"
            style={{ width: 220 }}
          />

          <label className="text-xs opacity-70">Auto-layout</label>
          <input type="checkbox" checked={autoLayout} onChange={(e)=>setAutoLayout(e.target.checked)} />
          <button onClick={relayout} className="h-8 px-3 rounded border border-neutral-600 text-sm">Re-layout</button>

          <button onClick={onExport} className="h-8 px-3 rounded border border-neutral-600 text-sm">Export</button>
          <input type="file" ref={fileRef} accept="application/json" className="hidden" onChange={(e)=>e.target.files?.[0] && onImport(e.target.files[0])}/>
          <button onClick={()=>fileRef.current?.click()} className="h-8 px-3 rounded border border-neutral-600 text-sm">Import</button>

          <button onClick={onClear} className="h-8 px-3 rounded bg-rose-500 text-black text-sm">Clear</button>
        </div>
      </div>
    </div>
  );
}
