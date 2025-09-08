'use client';
import React, { useId as useReactId, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Shared item primitive for menus/listboxes.
 * Renders left icon slot, label, and optional right shortcut text.
 * @param {Object} props
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.active]
 * @param {boolean} [props.selected]
 * @param {function} [props.onClick]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.shortcut]
 * @param {'menuitem'|'option'} [props.role]
 * @param {string} [props.id]
 * @param {string} [props.ariaSelected]
 * @param {string} [props.ariaDisabled]
 * @param {string} [props.ariaChecked]
 */
export default function MenuItem({
  disabled,
  active,
  selected,
  onClick,
  icon,
  children,
  shortcut,
  role = 'menuitem',
  id,
  ...rest
}) {
  const base = 'w-full text-left px-3 py-2 rounded-md flex items-center gap-3';
  const states =
    (disabled
      ? 'opacity-50 cursor-not-allowed'
      : active
        ? 'bg-[#0F0F0F] outline outline-1 outline-white'
        : 'hover:bg-[#0F0F0F]') + ' transition-all duration-100';
  const sel = selected ? 'font-semibold' : '';
  return (
    <div
      id={id}
      role={role}
      aria-disabled={disabled || undefined}
      aria-selected={selected || undefined}
      aria-checked={selected || undefined}
      tabIndex={-1}
      className={`${base} ${states} ${sel}`}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      <div aria-hidden className="w-5 h-5 flex items-center justify-center">
        {icon ?? null}
      </div>
      <div className="flex-1 text-[14px] leading-5">{children}</div>
      {shortcut ? (
        <div className="text-[12px] text-muted">{shortcut}</div>
      ) : null}
    </div>
  );
}

/* ------------------------- utilities (shared) ------------------------- */

/** Portal helper that renders children into document.body */
export function Portal({ children }) {
  const mount = typeof window !== 'undefined' ? document.body : null;
  return mount ? createPortal(children, mount) : null;
}

/** useOutsideClick: fires handler when a click/touch happens outside of the given refs */
export function useOutsideClick(refs, handler) {
  useEffect(() => {
    function onDoc(e) {
      const list = Array.isArray(refs) ? refs : [refs];
      const isInside = list.some(r => r?.current && r.current.contains(e.target));
      if (!isInside) handler(e);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [refs, handler]);
}

/**
 * useListNavigation — roving focus + typeahead + Home/End.
 * Keep focus on the container and set aria-activedescendant to the active item id.
 *
 * @param {Object} cfg
 * @param {Array<{id:string,label:string,disabled?:boolean}>} cfg.items
 * @param {(index:number)=>void} [cfg.onEnter]
 * @param {(index:number)=>void} [cfg.onTypeaheadMatch]
 * @param {(index:number)=>void} [cfg.onNavigate]
 * @param {number} [cfg.initialIndex]
 * @param {boolean} [cfg.loop] - when true, wraps at ends
 */
export function useListNavigation({
  items,
  onEnter,
  onTypeaheadMatch,
  onNavigate,
  initialIndex = -1,
  loop = true,
}) {
  const [active, setActive] = useState(initialIndex);
  const typeBuffer = useRef('');
  const lastType = useRef(0);

  useEffect(() => {
    onNavigate && onNavigate(active);
  }, [active]); // eslint-disable-line

  function nextIdx(dir) {
    if (!items.length) return -1;
    let i = active;
    for (let step = 0; step < items.length; step++) {
      i = (i + dir + items.length) % items.length;
      if (!items[i]?.disabled) return i;
      if (!loop && (i === 0 || i === items.length - 1)) break;
    }
    return active;
  }

  function handleKeyDown(e) {
    if (!items.length) return;
    const key = e.key;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      e.preventDefault();
    }
    if (key === 'ArrowDown') setActive(prev => nextIdx(+1));
else if (key === 'ArrowUp') setActive(prev => nextIdx(-1));
    else if (key === 'Home') {
      const i = items.findIndex(it => !it.disabled);
      if (i >= 0) setActive(i);
    } else if (key === 'End') {
      const i = [...items].map((it, idx) => [it, idx]).reverse().find(([it]) => !it.disabled)?.[1];
      if (i != null) setActive(i);
    } else if (key === 'Enter') {
      if (active >= 0 && !items[active]?.disabled) onEnter && onEnter(active);
    } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Typeahead
      const now = Date.now();
      if (now - lastType.current > 500) typeBuffer.current = '';
      typeBuffer.current += key.toLowerCase();
      lastType.current = now;
      const i = items.findIndex(
        (it) => !it.disabled && (it.label?.toLowerCase()?.startsWith(typeBuffer.current))
      );
      if (i >= 0) {
        setActive(i);
        onTypeaheadMatch && onTypeaheadMatch(i);
      }
    } else if (key === 'Escape') {
      // container should handle closing; we just allow bubble
    }
  }

  return { active, setActive, handleKeyDown };
}

/** Generate a stable React id across SSR/CSR */
export function useStableId(prefix = 'elit') {
  const rid = useReactId();
  return `${prefix}-${rid.replace(/:/g, '')}`;
}

/** Position a floating panel relative to an anchor element. Keeps within viewport and flips vertically. */
export function placePanel(anchorEl, panelEl, preferred = 'bottom-start', gap = 8) {
  if (!anchorEl || !panelEl) return;
  const ar = anchorEl.getBoundingClientRect();
  const pr = panelEl.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;

  let top = ar.bottom + gap;
  let left = ar.left;
  if (preferred.endsWith('end')) left = ar.right - pr.width;

  // Flip vertically if overflowing bottom
  if (top + pr.height > vh && ar.top - gap - pr.height >= 0) {
    top = ar.top - gap - pr.height;
    panelEl.dataset.placement = 'top';
  } else {
    panelEl.dataset.placement = 'bottom';
  }

  // Keep within viewport horizontally
  left = Math.min(Math.max(8, left), vw - pr.width - 8);

  Object.assign(panelEl.style, {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    minWidth: `${Math.max(ar.width, 180)}px`,
    zIndex: 50,
  });
}
