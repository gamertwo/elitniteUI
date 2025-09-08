'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MenuItem, { Portal, useOutsideClick, useListNavigation, useStableId, placePanel } from './MenuItem';

/**
 * MultiSelect with tags in trigger, Select All / Clear All actions.
 * @param {Object} props
 * @param {string} props.label
 * @param {{value:string,label:string}[]} props.options
 * @param {string[]} props.value
 * @param {(vals:string[])=>void} props.onChange
 */
export default function MultiSelect({ label, options, value, onChange }) {
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const menuId = useStableId('multibox');

  const items = useMemo(
    () => [{ id: `${menuId}-all`, label: '__UTIL__' }, ...options.map((o, i) => ({ id: `${menuId}-opt-${i}`, label: o.label }))],
    [options, menuId]
  );

  const { active, setActive, handleKeyDown } = useListNavigation({
    items,
    initialIndex: 0,
    onEnter: (i) => handleSelect(i),
  });

  function handleSelect(i) {
    if (i === 0) {
      // Select all / Clear all
      const all = options.map(o => o.value);
      const isAll = all.every(v => value.includes(v));
      onChange(isAll ? [] : all);
      return;
    }
    const opt = options[i - 1];
    if (!opt) return;
    const set = new Set(value);
    if (set.has(opt.value)) set.delete(opt.value); else set.add(opt.value);
    onChange([...set]);
  }

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => placePanel(triggerRef.current, panelRef.current, 'bottom-start', 8));
    const onWin = () => placePanel(triggerRef.current, panelRef.current, 'bottom-start', 8);
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
  }, [open]);

  useOutsideClick([panelRef, triggerRef], () => setOpen(false));

  const allVals = options.map(o => o.value);
  const isAll = allVals.every(v => value.includes(v));

  return (
    <div className="space-y-2">
      <label className="block text-sm">{label}</label>
      <button
        ref={triggerRef}
        type="button"
        className="elit-outline w-full min-h-11 h-auto rounded-elit px-2 py-1 bg-surface hover:border-white text-left flex flex-wrap gap-2 items-center"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => { setOpen(o => !o); setActive(0); }}
        onKeyDown={(e) => {
          if (['ArrowDown','Enter',' '].includes(e.key)) { e.preventDefault(); setOpen(true); setTimeout(()=>panelRef.current?.focus(),0); }
          else if (e.key === 'Escape') setOpen(false);
        }}
      >
        {value.length ? value.map(v => {
          const label = options.find(o => o.value === v)?.label ?? v;
          return <span key={v} className="elit-pill">{label}</span>;
        }) : <span className="text-muted">Select tags…</span>}
        <span className="ml-auto"><ChevronDown /></span>
      </button>

      {open ? (
        <Portal>
          <div
            ref={panelRef}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-activedescendant={items[active]?.id}
            className="elit-panel menu-enter shadow-elit-glow"
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); return; }
              if (e.key === ' ') { e.preventDefault(); handleSelect(active); return; }
              handleKeyDown(e);
            }}
          >
            <div className="max-h-72 overflow-auto p-1">
              <div className="flex gap-2 p-2">
                <button
                  type="button"
                  className="elit-pill hover:bg-[#111]"
                  onClick={() => onChange(allVals)}
                >Select all</button>
                <button
                  type="button"
                  className="elit-pill hover:bg-[#111]"
                  onClick={() => onChange([])}
                >Clear all</button>
              </div>
              <div className="elit-sep my-1" />
              {options.map((opt, i) => {
                const checked = value.includes(opt.value);
                const id = items[i + 1].id;
                const isActive = active === i + 1;
                return (
                  <MenuItem
                    key={opt.value}
                    id={id}
                    role="menuitem"
                    active={isActive}
                    selected={checked}
                    onClick={() => handleSelect(i + 1)}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
                        <rect x="3" y="3" width="14" height="14" rx="2" stroke="white" fill={checked ? 'white' : 'none'} />
                        {checked ? <path d="M7 10l2 2 4-5" stroke="black" strokeWidth="1.5" fill="none" /> : null}
                      </svg>
                    }
                  >
                    {opt.label}
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

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
      <path d="M5 7l5 6 5-6" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
