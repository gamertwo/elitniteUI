'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MenuItem, { Portal, useOutsideClick, useListNavigation } from './MenuItem';

/**
 * Right-Click Context Menu bound to its children wrapper.
 * @param {Object} props
 * @param {{key:string,label:string,icon?:React.ReactNode,separator?:boolean,destructive?:boolean,disabled?:boolean}[]} props.items
 * @param {(key:string)=>void} props.onSelect
 */
export default function ContextMenu({ items = [], onSelect }) {
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const list = useMemo(() => items.filter(i => !i.separator), [items]);
  const { active, setActive, handleKeyDown } = useListNavigation({
    items: list.map(i => ({ id: `ctx-${i.key}`, label: i.label, disabled: !!i.disabled })),
    initialIndex: 0,
    onEnter: (i) => {
      const it = list[i]; if (!it || it.disabled) return;
      onSelect?.(it.key); setOpen(false);
      wrapRef.current?.focus();
    }
  });

  useEffect(() => {
    if (!open) return;
    // position at coords, keep within viewport
    const el = panelRef.current;
    if (!el) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const rect = el.getBoundingClientRect();
    let left = coords.x, top = coords.y;
    if (left + rect.width > vw) left = vw - rect.width - 8;
    if (top + rect.height > vh) top = vh - rect.height - 8;
    Object.assign(el.style, { position: 'fixed', left: `${left}px`, top: `${top}px`, zIndex: 60, minWidth: '200px' });
  }, [open, coords]);

  useOutsideClick([panelRef, wrapRef], () => setOpen(false));

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      className="elit-outline rounded-elit p-6 bg-surface hover:border-white relative select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        setCoords({ x: e.clientX, y: e.clientY });
        setOpen(true);
        setTimeout(()=>panelRef.current?.focus(),0);
        setActive(0);
      }}
      onKeyDown={(e) => {
        if (open) {
          if (e.key === 'Escape') { setOpen(false); return; }
        }
      }}
      aria-label="Context menu demo area"
    >
      <div className="text-muted">Right-click here to open the context menu.</div>

      {open ? (
        <Portal>
          <div
            ref={panelRef}
            role="menu"
            tabIndex={-1}
            aria-activedescendant={list[active] ? `ctx-${list[active].key}` : undefined}
            className="elit-panel menu-enter shadow-elit-glow"
            onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); } else handleKeyDown(e); }}
          >
            <div className="max-h-72 overflow-auto p-1">
              {items.map((it, i) => {
                if (it.separator) return <div key={`sep-${i}`} className="elit-sep my-1" role="separator" />;
                const isActive = active === list.findIndex(li => li.key === it.key);
                const id = `ctx-${it.key}`;
                const base = it.destructive ? 'text-white' : '';
                return (
                  <MenuItem
                    key={it.key}
                    id={id}
                    role="menuitem"
                    active={isActive}
                    disabled={it.disabled}
                    onClick={() => { if (!it.disabled) { onSelect?.(it.key); setOpen(false); } }}
                    icon={it.icon}
                  >
                    <span className={base}>{it.label}</span>
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
