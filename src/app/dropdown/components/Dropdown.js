'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MenuItem, { Portal, useOutsideClick, useListNavigation, useStableId, placePanel } from './MenuItem';

/**
 * Dropdown menu with sections, icons, shortcuts, disabled items.
 * @param {Object} props
 * @param {string} props.label
 * @param {{title?:string, items: {key:string,label:string,icon?:React.ReactNode,shortcut?:string,disabled?:boolean}[]}[]} props.sections
 * @param {(key:string)=>void} props.onSelect
 */
export default function Dropdown({ label = 'New', sections = [], onSelect }) {
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const menuId = useStableId('menu');

  const flat = useMemo(() => {
    const arr = [];
    sections.forEach((s) => {
      s.items.forEach((it) => arr.push({ id: `${menuId}-${it.key}`, label: it.label, disabled: !!it.disabled, data: it }));
    });
    return arr;
  }, [sections, menuId]);

  const { active, setActive, handleKeyDown } = useListNavigation({
    items: flat,
    initialIndex: flat.findIndex(i => !i.disabled),
    onEnter: (i) => {
      const it = flat[i]; if (it && !it.disabled) { onSelect?.(it.data.key); setOpen(false); triggerRef.current?.focus(); }
    }
  });

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

  let idx = -1;
  return (
    <div className="inline-block">
      <button
        ref={triggerRef}
        type="button"
        className="elit-outline h-11 rounded-elit px-3 bg-surface hover:border-white inline-flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => { setOpen(o => !o); setActive(flat.findIndex(i => !i.disabled)); }}
        onKeyDown={(e) => {
          if (['ArrowDown','Enter',' '].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
            setTimeout(()=>panelRef.current?.focus(), 0);
          } else if (e.key === 'Escape') setOpen(false);
        }}
      >
        <span>{label}</span>
        <ChevronDown />
      </button>

      {open ? (
        <Portal>
          <div
            ref={panelRef}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-activedescendant={active >=0 ? flat[active].id : undefined}
            className="elit-panel menu-enter shadow-elit-glow"
            onKeyDown={(e)=>{ if (e.key==='Escape'){ setOpen(false); triggerRef.current?.focus(); return; } handleKeyDown(e); }}
          >
            <div className="max-h-72 overflow-auto p-1 w-full">
              {sections.map((sec, sI) => (
                <div key={`sec-${sI}`} className="py-1">
                  {sec.title ? <div className="px-3 py-1 text-[12px] text-muted">{sec.title}</div> : null}
                  <div className="flex flex-col gap-1">
                    {sec.items.map((it) => {
                      idx++;
                      const isActive = active === idx;
                      const id = `${menuId}-${it.key}`;
                      const disabled = !!it.disabled;
                      return (
                        <MenuItem
                          key={it.key}
                          id={id}
                          role="menuitem"
                          icon={it.icon}
                          shortcut={it.shortcut}
                          active={isActive}
                          disabled={disabled}
                          onClick={() => { if (!disabled) { onSelect?.(it.key); setOpen(false); triggerRef.current?.focus(); } }}
                        >
                          {it.label}
                        </MenuItem>
                      );
                    })}
                  </div>
                </div>
              ))}
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
