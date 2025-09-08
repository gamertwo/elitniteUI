'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MenuItem, { Portal, useOutsideClick, useListNavigation, useStableId, placePanel } from './MenuItem';

/**
 * Inline Combobox (filterable select)
 * @param {Object} props
 * @param {string} props.label
 * @param {{value:string,label:string}[]} props.options
 * @param {string} props.value
 * @param {(v:string)=>void} props.onChange
 */
export default function Combobox({ label, options, value, onChange }) {
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const listId = useStableId('combo-list');

  const filtered = useMemo(() => {
    if (!query) return options;
    return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const items = useMemo(
    () => filtered.map((o, i) => ({ id: `${listId}-opt-${i}`, label: o.label })),
    [filtered, listId]
  );

  const { active, setActive, handleKeyDown } = useListNavigation({
    items,
    initialIndex: 0,
    onEnter: (i) => {
      const v = filtered[i]; if (!v) return;
      onChange(v.value);
      setQuery(v.label);
      setOpen(false);
      inputRef.current?.focus();
    }
  });

  useEffect(() => {
    setQuery(options.find(o => o.value === value)?.label ?? '');
  }, [value, options]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => placePanel(inputRef.current, listRef.current, 'bottom-start', 4));
    const onWin = () => placePanel(inputRef.current, listRef.current, 'bottom-start', 4);
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
  }, [open, query, filtered.length]);

  useOutsideClick([listRef, inputRef], () => setOpen(false));

  function highlight(label) {
    if (!query) return label;
    const i = label.toLowerCase().indexOf(query.toLowerCase());
    if (i < 0) return label;
    const pre = label.slice(0, i);
    const mid = label.slice(i, i + query.length);
    const post = label.slice(i + query.length);
    return <>{pre}<mark className="elit">{mid}</mark>{post}</>;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm">{label}</label>
      <input
        ref={inputRef}
        className="elit-outline w-full h-11 rounded-elit px-3 bg-surface hover:border-white"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? items[active]?.id : undefined}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => { setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End' || e.key === 'Enter') {
            e.preventDefault();
            setOpen(true);
            handleKeyDown(e);
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        placeholder="Type to filter…"
      />
      {open ? (
        <Portal>
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            className="elit-panel menu-enter shadow-elit-glow"
            onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); inputRef.current?.focus(); } }}
          >
            <div className="max-h-64 overflow-auto p-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-muted">No matches.</div>
              ) : filtered.map((opt, i) => {
                const isActive = active === i;
                const isSel = value === opt.value;
                return (
                  <MenuItem
                    key={opt.value}
                    id={items[i].id}
                    role="option"
                    active={isActive}
                    selected={isSel}
                    onClick={() => {
                      onChange(opt.value);
                      setQuery(opt.label);
                      setOpen(false);
                      inputRef.current?.focus();
                    }}
                  >
                    {highlight(opt.label)}
                  </MenuItem>
                );
              })}
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  );
}
