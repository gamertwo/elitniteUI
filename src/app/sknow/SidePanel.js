'use client';
import React, { useMemo, useState } from 'react';

export default function SidePanel({ nodes, edges, selectedId, onSelect, onChangeNode, onExpand, busy }) {
  const selected = useMemo(() => nodes.find(n => n.id === selectedId) || null, [nodes, selectedId]);
  const children = useMemo(
    () => edges.filter(e => e.source === selectedId).map(e => nodes.find(n => n.id === e.target)).filter(Boolean),
    [edges, nodes, selectedId]
  );
  const parents = useMemo(
    () => edges.filter(e => e.target === selectedId).map(e => nodes.find(n => n.id === e.source)).filter(Boolean),
    [edges, nodes, selectedId]
  );

  const update = (patch) => selected && onChangeNode({ ...selected, data: { ...selected.data, ...patch } });

  // Suggestion state
  const [suggesting, setSuggesting] = useState(false);
  const [sugs, setSugs] = useState({ suggestions: [], tags: [], questions: [] });
  const [toast, setToast] = useState('');

  const suggest = async () => {
    if (!selected) return;
    try {
      setSuggesting(true);
      setSugs({ suggestions: [], tags: [], questions: [] });
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selected.data.isCenter ? selected.data.title : (nodes.find(n => n.data.isCenter)?.data?.title || ''),
          node: {
            title: selected.data.title,
            summary: selected.data.summary,
            tags: selected.data.tags
          }
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setSugs(json);
    } catch (e) {
      console.error(e);
      setToast('Suggestion failed');
      setTimeout(()=>setToast(''), 1200);
    } finally {
      setSuggesting(false);
    }
  };

  const applySuggestion = (s) => {
    // put steer into node hint and add any new tags
    const tagsSet = new Set([...(selected?.data?.tags || []), ...(sugs.tags || [])]);
    update({ hint: s.steer, tags: Array.from(tagsSet) });
    setToast(`Applied steer. Mode: ${s.mode}`);
    setTimeout(()=>setToast(''), 1200);

    // (optional) broadcast desired mode to toolbar (so user can one-click set it)
    try { window.dispatchEvent(new CustomEvent('ks:suggestedMode', { detail: s.mode })); } catch {}
  };

  return (
    <div className="border-l border-neutral-200 dark:border-neutral-800" style={{ height:'100%', minHeight:0, display:'flex', flexDirection:'column' }}>
      <div style={{ flex:'1 1 auto', minHeight:0, overflow:'auto', padding:12 }}>
        {!selected ? (
          <div className="opacity-70 text-sm">Double-click a node to edit. You can read the practical guide in the bottom panel.</div>
        ) : (
          <>
            {/* Title */}
            <input
              value={selected.data.title || ''}
              onChange={(e)=>update({ title: e.target.value })}
              className="w-full h-9 px-2 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm mb-2"
            />

            {/* Expansion hint FIRST (as requested) + AI helper */}
            <div className="flex items-center gap-2 mb-2">
              <input
                value={selected.data.hint || ''}
                onChange={(e)=>update({ hint: e.target.value })}
                placeholder="Expansion hint (e.g., 'step-by-step for a beginner project')"
                className="w-full h-9 px-2 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-sm"
              />
              <button
                onClick={suggest}
                disabled={suggesting}
                className={`h-9 px-3 rounded ${suggesting ? 'bg-neutral-400' : 'bg-sky-400'} text-black text-sm`}
                title="Let AI suggest next paths"
              >
                {suggesting ? '…' : 'Suggest'}
              </button>
              <button
                onClick={()=>onExpand(selected.id)}
                disabled={busy}
                className={`h-9 px-3 rounded ${busy ? 'bg-neutral-400' : 'bg-amber-400'} text-black text-sm`}
                title="Expand from this node"
              >
                {busy ? '…' : 'Expand'}
              </button>
            </div>

            {/* Suggestions board */}
            {sugs?.suggestions?.length > 0 && (
              <div className="mb-3">
                <div className="text-[11px] opacity-70 mb-1">Suggested next paths</div>
                <div className="flex flex-col gap-2">
                  {sugs.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-[2px] rounded bg-neutral-700 text-neutral-100">{s.mode}</span>
                      <button
                        className="text-left text-xs px-2 py-1 rounded bg-neutral-200/70 dark:bg-neutral-700 hover:bg-neutral-200"
                        onClick={()=>applySuggestion(s)}
                        title={s.why || 'apply steer'}
                      >
                        {s.steer}
                      </button>
                      {s.why && <span className="text-[10px] opacity-70">— {s.why}</span>}
                    </div>
                  ))}
                </div>

                {/* Optional tags & questions */}
                {(sugs.tags?.length || sugs.questions?.length) ? (
                  <div className="mt-2 flex flex-col gap-1">
                    {sugs.tags?.length > 0 && (
                      <div className="text-[11px] opacity-70">
                        Suggested tags:
                        <span className="ml-2">{sugs.tags.join(', ')}</span>
                      </div>
                    )}
                    {sugs.questions?.length > 0 && (
                      <div className="text-[11px] opacity-70">
                        Consider asking:
                        <ul className="list-disc ml-5">
                          {sugs.questions.map((q, i) => <li key={i} className="text-[11px]">{q}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Summary */}
            <textarea
              value={selected.data.summary || ''}
              onChange={(e)=>update({ summary: e.target.value })}
              placeholder="Short summary"
              className="w-full p-2 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 mb-2 text-sm"
              style={{ height: 120 }}
            />

            {/* Tags */}
            <label className="text-[11px] opacity-70">Tags (comma-separated)</label>
            <input
              value={(selected.data.tags || []).join(', ')}
              onChange={(e)=>update({ tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full h-9 px-2 rounded border bg-white/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 mb-3 text-sm"
            />

            {/* Links */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <NavList title="Backlinks" list={parents} onSelect={onSelect} left />
              <NavList title="Children" list={children} onSelect={onSelect} />
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className="px-2 py-1 text-xs bg-emerald-400 text-black">{toast}</div>
      )}
    </div>
  );
}

function NavList({ title, list, onSelect, left }) {
  return (
    <div>
      <div className="text-[11px] opacity-70 mb-1">{title}</div>
      <div className="flex flex-col gap-1">
        {list.map(n => (
          <button key={n.id} onClick={()=>onSelect(n.id)} className="text-left text-xs px-2 py-1 rounded bg-neutral-200/60 dark:bg-neutral-700">
            {left ? '← ' : ''}{n.data.title}{left ? '' : ' →'}
          </button>
        ))}
        {list.length === 0 && <div className="opacity-50 text-[11px]">None</div>}
      </div>
    </div>
  );
}
