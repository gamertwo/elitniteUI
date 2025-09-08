'use client';
import React, { useRef } from 'react';

const Step = ({ n, label, active }) => (
  <div className={`flex items-center gap-2 px-2 py-1 rounded ${active ? 'bg-emerald-500 text-black' : 'bg-neutral-200/70 dark:bg-neutral-700'}`}>
    <span className="text-xs font-bold">{n}</span><span className="text-xs">{label}</span>
  </div>
);

export default function Toolbar({
  query, setQuery, start,
  mode, setMode, depth, setDepth,
  tags, setTags, steer, setSteer,
  search, setSearch,
  autoLayout, setAutoLayout, relayout,
  onClear, nodeCount, hint
}) {
  const fileRef = useRef();

  const addTag = (t) => {
    const v = t.trim();
    if (!v) return;
    const s = new Set(tags);
    s.add(v);
    setTags([...s]);
  };
  const removeTag = (t) => setTags(tags.filter(x => x !== t));

  // export from localStorage snapshot
  const exportJSON = () => {
    const raw = localStorage.getItem('knowledge-studio-v1') || '{}';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'graph.json' });
    a.click(); URL.revokeObjectURL(url);
  };
  const importJSON = async (file) => {
    const text = await file.text();
    try { localStorage.setItem('knowledge-studio-v1', text); location.reload(); }
    catch { alert('Invalid graph file'); }
  };

  return (
    <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 px-3">
      <Step n="1" label="Topic → Start" active={!nodeCount} />
      <Step n="2" label="Double-click a node" active={!!nodeCount} />
      <Step n="3" label="Expand" active={!!nodeCount} />

      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Topic (e.g., Microservices)"
          className="h-9 px-3 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm"
          style={{ width: 280 }}
        />
        <button onClick={start} className="h-9 px-3 rounded bg-emerald-500 text-black text-sm font-medium">Start</button>
      </div>

      <select value={mode} onChange={(e)=>setMode(e.target.value)} className="h-9 px-2 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm">
        <option value="summary">Summary</option>
        <option value="definitions">Definitions</option>
        <option value="examples">Examples</option>
        <option value="prerequisites">Prerequisites</option>
        <option value="related">Related</option>
        <option value="advanced">Advanced</option>
      </select>

      <label className="text-xs opacity-70">Depth</label>
      <input type="number" min={1} max={8} value={depth} onChange={(e)=>setDepth(Number(e.target.value||1))} className="h-9 w-14 px-2 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm"/>

      <input
        value={steer}
        onChange={(e)=>setSteer(e.target.value)}
        placeholder="Global steer (e.g., 'focus on system design')"
        className="h-9 px-3 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm"
        style={{ width: 300 }}
      />

      <input
        placeholder="Add tag ↵"
        onKeyDown={(e)=>{ if(e.key==='Enter'){ addTag(e.currentTarget.value); e.currentTarget.value=''; }}}
        className="h-9 px-3 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm"
        style={{ width: 160 }}
      />
      <div className="flex gap-1 max-w-[160px] overflow-x-auto no-scrollbar">
        {tags.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-700 whitespace-nowrap">
            {t} <button onClick={()=>removeTag(t)}>×</button>
          </span>
        ))}
      </div>

      <input
        id="global-search"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search (Ctrl/Cmd+K)"
        className="h-9 px-3 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm"
        style={{ width: 220 }}
      />

      <label className="text-xs opacity-70">Auto-layout</label>
      <input type="checkbox" checked={autoLayout} onChange={(e)=>setAutoLayout(e.target.checked)} />
      <button onClick={relayout} className="h-9 px-3 rounded border border-neutral-400 dark:border-neutral-600 text-sm">Re-layout</button>

      <button onClick={exportJSON} className="h-9 px-3 rounded border border-neutral-400 dark:border-neutral-600 text-sm">Export</button>
      <input type="file" ref={fileRef} accept="application/json" className="hidden" onChange={(e)=>e.target.files?.[0] && importJSON(e.target.files[0])}/>
      <button onClick={()=>fileRef.current?.click()} className="h-9 px-3 rounded border border-neutral-400 dark:border-neutral-600 text-sm">Import</button>

      <div className="ml-auto text-xs opacity-70">{hint}</div>
      <button onClick={onClear} className="h-9 ml-2 px-3 rounded bg-rose-500 text-black text-sm">Clear</button>
    </div>
  );
}
