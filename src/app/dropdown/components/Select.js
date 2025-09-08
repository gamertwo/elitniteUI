'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MenuItem, { Portal, useOutsideClick, useListNavigation, useStableId, placePanel } from './MenuItem';

/**
 * Basic Select (Listbox) — fully controlled, accessible, typeahead, roving focus.
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.helper]
 * @param {{value:string,label:string}[]} props.options
 * @param {string} props.value
 * @param {(v:string)=>void} props.onChange
 */
export default function Select({ label, helper, options, value, onChange }) {
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const listboxId = useStableId('listbox');
  const buttonId = useStableId('button');

  const items = useMemo(
    () => options.map((o, i) => ({ id: `${listboxId}-opt-${i}`, label: o.label, disabled: false })),
    [options, listboxId]
  );
  const selectedIndex = options.findIndex(o => o.value === value);

  const { active, setActive, handleKeyDown } = useListNavigation({
    items,
    initialIndex: selectedIndex >= 0 ? selectedIndex : 0,
    onEnter: (i) => {
      onChange(options[i].value);
      setOpen(false);
      buttonRef.current?.focus();
    },
  });

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => placePanel(buttonRef.current, panelRef.current, 'bottom-start', 8));
    function onWin() {
      placePanel(buttonRef.current, panelRef.current, 'bottom-start', 8);
    }
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
  }, [open]);

  useOutsideClick([panelRef, buttonRef], () => setOpen(false));

  return (
    <div className="space-y-2">
      <label htmlFor={buttonId} className="block text-sm tracking-wide text-text/90">{label}</label>
      {helper ? <p className="text-[12px] text-muted -mt-1">{helper}</p> : null}
      <button
        id={buttonId}
        ref={buttonRef}
        type="button"
        className="elit-outline w-full h-11 rounded-elit px-3 flex items-center justify-between bg-surface hover:border-white transition text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => { setOpen(o => !o); setActive(selectedIndex >= 0 ? selectedIndex : 0); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key.length === 1) {
            e.preventDefault();
            setOpen(true);
            setTimeout(() => {
              panelRef.current?.focus();
            }, 0);
          } else if (e.key === 'Escape') setOpen(false);
        }}
      >
        <span className="truncate">{options.find(o => o.value === value)?.label ?? '—'}</span>
        <ChevronDown />
      </button>

      {open ? (
        <Portal>
          <div
            ref={panelRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={active >= 0 ? items[active].id : undefined}
            className="elit-panel menu-enter elit-shadow"
            style={{ '--elit-shadow': 'var(--ring)' }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); return; }
              handleKeyDown(e);
            }}
          >
            <div className="max-h-64 overflow-auto p-1">
              {options.map((opt, i) => {
                const isSel = value === opt.value;
                const isActive = active === i;
                return (
                  <MenuItem
                    key={opt.value}
                    id={items[i].id}
                    role="option"
                    active={isActive}
                    selected={isSel}
                    onClick={() => { onChange(opt.value); setOpen(false); buttonRef.current?.focus(); }}
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
