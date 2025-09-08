// app/page.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------- DATA -------------------------------- */
const ALL_TOOLS = [
  { id: "figma", label: "Figma", icon: FigmaIcon, badge: "1–4" },
  { id: "ps", label: "Photoshop", icon: PsIcon },
  { id: "ai", label: "Illustrator", icon: AiIcon },
  { id: "id", label: "InDesign", icon: IdIcon, disabled: true },
  { id: "ae", label: "After Effects", icon: AeIcon },
  { id: "pr", label: "Premiere Pro", icon: PrIcon },
];

export default function Page() {
  const [anyOpen, setAnyOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      {/* content container centered */}
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-neutral-900">
          Different <span className="text-indigo-600">Dropdowns</span>
        </h1>

        {/* DROPDOWNS */}
        <div
          className={`mx-auto w-full md:w-[80%] lg:w-[70%] 
                      grid md:grid-cols-2 gap-10 transition-[margin] duration-300
                      ${anyOpen ? "mb-48" : "mb-20"}`}
        >
          <Dropdown
            label="Tools"
            description="Choose your primary design app"
            items={ALL_TOOLS}
            defaultValue="ps"
            variant="depth"
            onOpenChange={setAnyOpen}
          />
          <Dropdown
            label="Tools"
            description="Minimal outline with right accent"
            items={ALL_TOOLS}
            defaultValue="ps"
            variant="minimal"
            onOpenChange={setAnyOpen}
          />
          <Dropdown
            label="Tools"
            description="Shows badges and hover tags"
            items={ALL_TOOLS}
            defaultValue="ps"
            variant="tagged"
            onOpenChange={setAnyOpen}
          />
          <Dropdown
            label="Tools"
            description="Bold outline + custom scrollbar"
            items={ALL_TOOLS}
            defaultValue="ps"
            variant="bold"
            onOpenChange={setAnyOpen}
          />
        </div>

        {/* CODEPEN — STICKY & LOWER */}
        <div className="relative">
          {/* the sticky wrapper makes the codepen sit low on the screen
              and still move when the dropdown region grows */}
          <div className="sticky top-[calc(100vh-360px)]">
            <DropdownCodeShowcase />
          </div>
        </div>
      </div>

      {/* global utilities */}
      <style jsx global>{`
        .dd-scroll::-webkit-scrollbar {
          width: 7px;
        }
        .dd-scroll::-webkit-scrollbar-thumb {
          background: rgba(67, 56, 202, 0.35);
          border-radius: 9999px;
        }
        .dd-pop {
          filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.12))
            drop-shadow(0 3px 8px rgba(0, 0, 0, 0.05));
        }
        .glass {
          backdrop-filter: blur(8px);
        }
        /* ensure selected line text is black */
        .dd-item[aria-selected="true"] .dd-label {
          color: #000;
        }
      `}</style>
    </main>
  );
}

/* ------------------------------- DROPDOWN ------------------------------- */
function Dropdown({
  label,
  description,
  items,
  defaultValue,
  variant = "depth",
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? items[0]?.id);
  const [active, setActive] = useState(
    Math.max(0, items.findIndex((i) => i.id === (defaultValue ?? items[0]?.id)))
  );
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const listRef = useRef(null);

  // outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // inform parent when open changes
  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // keep active in view
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const selected = items.find((i) => i.id === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const styles = getVariant(variant);

  return (
    <div className="w-full" ref={rootRef}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="block text-xs font-medium text-neutral-600">{label}</label>
          {description && (
            <p className="text-[11px] text-neutral-500 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setValue("");
            setQuery("");
          }}
          className="text-xs text-neutral-500 hover:text-neutral-900 underline decoration-dotted"
        >
          Clear
        </button>
      </div>

      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`group relative w-full flex items-center justify-between ${styles.trigger}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selected?.icon && <selected.icon className="w-5 h-5 opacity-90" />}
          {/* always black text on trigger */}
          <span className="truncate text-black">{selected?.label ?? "Select.."}</span>
        </div>

        <div className="flex items-center gap-2">
          {styles.accent && <span className={styles.accent} />}
          <Chevron className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </div>

        {styles.ring && <span className={styles.ring} aria-hidden />}
      </button>

      {/* Popover */}
      {open && (
        <div className={`dd-pop ${styles.pop} mt-2`}>
          <div className="px-3 pt-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200">
              <SearchIcon className="w-4 h-4 text-neutral-500" />
              <input
                placeholder="Search tools…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-neutral-900"
              />
            </div>
          </div>

          <ul
            role="listbox"
            ref={listRef}
            tabIndex={-1}
            className="dd-scroll max-h-56 overflow-y-auto p-2"
          >
            {filtered.map((item, idx) => {
              const isSelected = value === item.id;
              const isDisabled = !!item.disabled;
              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  data-idx={idx}
                  aria-disabled={isDisabled}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => !isDisabled && (setValue(item.id), setOpen(false))}
                  className={`dd-item group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                    ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-100"}
                    ${isSelected ? "bg-indigo-50 ring-1 ring-indigo-200" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <div className="min-w-0">
                      {/* label is black by default */}
                      <div className="dd-label text-sm truncate text-black">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {helperText(item.id)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-600 text-white">
                        {item.badge}
                      </span>
                    )}
                    {isSelected && <CheckIcon className="w-4 h-4" />}
                  </div>
                </li>
              );
            })}

            {!filtered.length && (
              <div className="px-3 py-6 text-sm text-neutral-500">No results</div>
            )}

            <div className="h-px bg-neutral-200 my-2" />
            <button
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-neutral-100 flex items-center gap-2"
              onClick={() => alert("Manage tools clicked")}
            >
              <SettingsIcon className="w-4 h-4" />
              Manage tools
            </button>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- VARIANT STYLES ----------------------------- */
function getVariant(variant) {
  switch (variant) {
    case "depth":
      return {
        trigger:
          "relative rounded-2xl text-sm px-4 py-3 bg-white/90 glass " +
          "border border-transparent p-[1.5px] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] " +
          "bg-gradient-to-b from-white to-neutral-50 " +
          "hover:shadow-xl hover:shadow-indigo-200/50 transition-all",
        pop:
          "w-full bg-white rounded-2xl border border-neutral-200 overflow-hidden",
        accent: "block h-5 w-1 rounded-full bg-indigo-500/70",
        ring: "pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5",
      };
    case "minimal":
      return {
        trigger:
          "rounded-xl border border-neutral-300 px-4 py-3 text-sm bg-white hover:shadow-md transition-shadow",
        pop: "w-full bg-white rounded-xl border border-neutral-200 overflow-hidden",
        accent: "block h-4 w-1 rounded bg-neutral-400",
      };
    case "tagged":
      return {
        trigger:
          "rounded-2xl border border-neutral-200 px-4 py-3 text-sm bg-white shadow-sm hover:shadow-lg transition-shadow",
        pop: "w-full bg-white rounded-2xl border border-neutral-200 overflow-hidden",
      };
    case "bold":
      return {
        trigger:
          "rounded-2xl border-2 border-indigo-300 px-4 py-3 text-sm bg-white hover:shadow-lg transition-shadow",
        pop: "w-full bg-white rounded-2xl border border-indigo-200 overflow-hidden",
        accent: "block h-4 w-1 rounded bg-indigo-500",
      };
    default:
      return getVariant("depth");
  }
}

/* --------------------------- HELPERS & ICONS --------------------------- */
function helperText(id) {
  switch (id) {
    case "figma":
      return "Best for UI systems";
    case "ps":
      return "Photo & compositing";
    case "ai":
      return "Vector illustrations";
    case "id":
      return "Layout & publishing";
    case "ae":
      return "Motion graphics";
    case "pr":
      return "Video editing";
    default:
      return "";
  }
}

function Chevron({ className = "" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" className={className}>
      <path
        d="M6.5 8l3.5 3.5L13.5 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CheckIcon({ className = "" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" className={className}>
      <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19.4 15a7.8 7.8 0 00.1-6l2-1.4-2-3.4-2.3 1a8 8 0 00-4.4-1.2l-.5-2.6h-4l-.5 2.6A8 8 0 005.8 5.2l-2.3-1L1.5 7.6l2 1.4a7.8 7.8 0 000 6l-2 1.4 2 3.4 2.3-1A8 8 0 0012 21.2l.5 2.6h4l.5-2.6a8 8 0 004.3-2.2l2.3 1 2-3.4L19.5 15" stroke="currentColor" strokeWidth=".8" opacity=".4"/>
    </svg>
  );
}

function IconBox({ letters, className = "" }) {
  return (
    <div className={`w-5 h-5 rounded-[4px] grid place-items-center text-[10px] font-bold text-white ${className}`}>
      {letters}
    </div>
  );
}
function FigmaIcon(props){return <IconBox {...props} letters="Fg" className="bg-pink-500" />;}
function PsIcon(props){return <IconBox {...props} letters="Ps" className="bg-blue-600" />;}
function AiIcon(props){return <IconBox {...props} letters="Ai" className="bg-orange-500" />;}
function IdIcon(props){return <IconBox {...props} letters="Id" className="bg-fuchsia-600" />;}
function AeIcon(props){return <IconBox {...props} letters="Ae" className="bg-indigo-700" />;}
function PrIcon(props){return <IconBox {...props} letters="Pr" className="bg-violet-600" />;}

/* ----------------------- CODEPEN-LIKE CODE VIEWER ---------------------- */
function DropdownCodeShowcase() {
  const [activeTab, setActiveTab] = useState("react");
  const codeBlocks = useMemo(
    () => ({ react: REACT_CODE, css: CSS_CODE, html: HTML_CODE, js: JS_CODE }),
    []
  );

  const tabs = [
    { id: "react", label: "React", icon: "⚛️" },
    { id: "css", label: "CSS", icon: "🎨" },
    { id: "html", label: "HTML", icon: "🌐" },
    { id: "js", label: "JS", icon: "⚡" },
  ];

  return (
    <div className="w-[92%] md:w-full mx-auto bg-neutral-950 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <h2 className="text-white font-mono text-sm md:text-base">
          ELITNITE • Premium Dropdowns
        </h2>
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Live
        </div>
      </div>

      <div className="flex bg-neutral-900 border-b border-neutral-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 px-5 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === t.id
                ? "bg-neutral-950 text-white border-t-2 border-indigo-400"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-neutral-950 p-6 max-h-96 overflow-y-auto">
        <pre className="text-xs md:text-sm leading-relaxed">
          <code
            className="text-neutral-100 font-mono"
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(codeBlocks[activeTab], activeTab),
            }}
          />
        </pre>
      </div>

      <div className="bg-neutral-900 px-6 py-3 text-neutral-400 text-sm flex items-center justify-between">
        <span>✨ Depth, glass, search, badges, disabled states</span>
        <span className="hidden sm:block">⌨️ Arrow keys • Enter • Esc</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Depthy Dropdown with search, badges & disabled items
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

const items = [
  { id: "figma", label: "Figma", badge: "1–4" },
  { id: "ps", label: "Photoshop" },
  { id: "ai", label: "Illustrator" },
  { id: "id", label: "InDesign", disabled: true },
  { id: "ae", label: "After Effects" },
  { id: "pr", label: "Premiere Pro" },
];

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("ps");
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);

  useEffect(() => {
    const close = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  }, [query]);

  return (
    <div ref={rootRef} className="relative w-64">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-2xl border px-4 py-2 bg-white shadow-sm text-left"
      >
        {items.find((i) => i.id === value)?.label ?? "Select.."}
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-2xl border bg-white shadow-lg">
          <input
            placeholder="Search tools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="m-2 w-[calc(100%-1rem)] rounded-lg border px-2 py-1 text-sm"
          />
          <ul className="max-h-48 overflow-y-auto">
            {filtered.map((i) => (
              <li
                key={i.id}
                className={\`px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer
                  \${value === i.id ? "bg-indigo-50 font-medium text-black" : ""}
                  \${i.disabled ? "opacity-40 cursor-not-allowed" : ""}\`}
                onClick={() => !i.disabled && (setValue(i.id), setOpen(false))}
              >
                {i.label} {i.badge && <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">{i.badge}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}`;

const CSS_CODE = `/* Tailwind utility classes used */
.trigger {
  @apply rounded-2xl border border-neutral-200 px-4 py-2 bg-white shadow-sm hover:shadow-md transition;
}
.popover {
  @apply mt-2 w-full rounded-2xl border border-neutral-200 bg-white shadow-lg;
}
.search {
  @apply m-2 w-[calc(100%-1rem)] px-2 py-1 text-sm border rounded-lg;
}
.row {
  @apply px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer rounded-lg;
}
.row.selected {
  @apply bg-indigo-50 font-medium text-black;
}
.row.disabled {
  @apply opacity-40 cursor-not-allowed;
}
.badge {
  @apply text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-600 text-white ml-2;
}`;

const HTML_CODE = `<!-- Structure -->
<div class="dropdown">
  <button class="trigger">Photoshop</button>
  <div class="popover">
    <input class="search" placeholder="Search tools…" />
    <ul>
      <li class="row">Figma <span class="badge">1–4</span></li>
      <li class="row selected">Photoshop</li>
      <li class="row">Illustrator</li>
      <li class="row disabled">InDesign</li>
      <li class="row">After Effects</li>
      <li class="row">Premiere Pro</li>
    </ul>
  </div>
</div>`;

const JS_CODE = `// Keyboard helpers
const button = document.querySelector(".trigger");

button.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    // focus first list item
  }
  if (e.key === "Escape") {
    // close dropdown
  }
});`;


/* --------------------------- Syntax Highlight --------------------------- */
function syntaxHighlight(code, language) {
  const patterns = {
    react: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(import|export|from|const|let|var|function|class|return|if|else|for|while|try|catch|new|this|async|await)\b/g, class: "text-purple-400" },
      { pattern: /\b(React|useState|useEffect|useMemo|useRef)\b/g, class: "text-cyan-400" },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /\b\d+\.?\d*\b/g, class: "text-orange-400" },
      { pattern: /&lt;[^&]*&gt;/g, class: "text-rose-400" },
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /[.#@][\w-]+/g, class: "text-yellow-400" },
      { pattern: /[\w-]+(?=\s*:)/g, class: "text-blue-400" },
      { pattern: /:[\s]*[^;{]+/g, class: "text-green-400" },
      { pattern: /@keyframes|@media|@import/g, class: "text-purple-400" },
    ],
    html: [
      { pattern: /&lt;[^&]*&gt;/g, class: "text-rose-400" },
      { pattern: /class="[^"]*"|id="[^"]*"|src="[^"]*"/g, class: "text-green-400" },
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, class: "text-neutral-500" },
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(class|function|const|let|var|if|else|for|while|return|this|new|async|await|import|export|from|default)\b/g, class: "text-purple-400" },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /\b\d+\.?\d*\b/g, class: "text-orange-400" },
      { pattern: /\b(document|window|console|setTimeout|setInterval)\b/g, class: "text-cyan-400" },
    ],
  };

  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  (patterns[language] || []).forEach(({ pattern, class: cls }) => {
    highlighted = highlighted.replace(pattern, (m) => `<span class="${cls}">${m}</span>`);
  });
  return highlighted;
}
