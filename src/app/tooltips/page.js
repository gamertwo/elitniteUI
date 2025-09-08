// app/tooltips/page.js
"use client";

import React, { useEffect, useRef, useState, useId, cloneElement, useMemo } from "react";

/* ========================================================================== */
/*                          TOOLTIPS & POPOVERS (DEMO)                        */
/* ========================================================================== */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        {/* PREVIEW GRID */}
        <div className="mx-auto w-full md:w-[88%] lg:w-[78%] grid gap-10 md:grid-cols-2 mb-20">
          <Card variant="tooltip-basic" />
          <Card variant="tooltip-rich" />
          <Card variant="tooltip-delay" />
          <Card variant="tooltip-arrow" />
          <Card variant="popover-basic" />
          <Card variant="popover-confirm" />
        </div>

        {/* CODEPEN STYLE VIEWER */}
        <div className="relative">
          <div className="sticky top-[calc(100vh-360px)]">
            <CodeShowcase />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------------------------- CARD --------------------------------- */
function Card({ variant = "tooltip-basic" }) {
  const v = variants(variant);

  return (
    <article className={v.wrapper}>
      {v.header && (
        <div className="px-5 pt-5">
          <h3 className="text-black font-semibold">{v.title}</h3>
          <p className="text-sm text-neutral-500">{v.subtitle}</p>
        </div>
      )}

      <div className={v.body}>
        {/* Tooltip: basic */}
        {variant === "tooltip-basic" && (
          <div className="flex items-center gap-4">
            <Tooltip label="Copy to clipboard" side="top">
              <button className={v.primaryBtn}>Copy</button>
            </Tooltip>
            <Tooltip label="Share link" side="bottom">
              <button className={v.secondaryBtn}>Share</button>
            </Tooltip>
          </div>
        )}

        {/* Tooltip: rich content */}
        {variant === "tooltip-rich" && (
          <div className="flex items-center gap-4">
            <Tooltip
              side="right"
              className="max-w-[220px]"
              content={
                <div>
                  <div className="font-semibold text-white">Keyboard tips</div>
                  <div className="text-neutral-300 text-xs mt-1">
                    Press{" "}
                    <kbd className="px-1 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                      /
                    </kbd>{" "}
                    to search
                  </div>
                </div>
              }
            >
              <button className={v.primaryBtn}>Hints</button>
            </Tooltip>
            <Tooltip side="left" label="Opens settings panel">
              <button className={v.secondaryBtn}>Settings</button>
            </Tooltip>
          </div>
        )}

        {/* Tooltip: show delay / hide delay */}
        {variant === "tooltip-delay" && (
          <div className="flex items-center gap-4">
            <Tooltip label="Will appear after 400ms" delayIn={400} delayOut={100}>
              <button className={v.primaryBtn}>Hover me</button>
            </Tooltip>
            <Tooltip label="Immediate" delayIn={0} delayOut={0}>
              <button className={v.secondaryBtn}>Instant</button>
            </Tooltip>
          </div>
        )}

        {/* Tooltip: arrowed */}
        {variant === "tooltip-arrow" && (
          <div className="flex items-center gap-4">
            <Tooltip label="With arrow" side="top" arrow>
              <button className={v.primaryBtn}>Top</button>
            </Tooltip>
            <Tooltip label="With arrow" side="right" arrow>
              <button className={v.secondaryBtn}>Right</button>
            </Tooltip>
          </div>
        )}

        {/* Popover: basic menu */}
        {variant === "popover-basic" && (
          <div className="flex items-center gap-4">
            <Popover
              side="bottom"
              align="start"
              trigger={(props) => (
                <button className={v.primaryBtn} {...props}>
                  New…
                </button>
              )}
            >
              <div className="min-w-[200px]">
                <MenuItem icon="📄" label="Document" />
                <MenuItem icon="📊" label="Spreadsheet" />
                <MenuItem icon="🖼️" label="Design File" />
                <div className="my-1 h-px bg-neutral-200" />
                <MenuItem icon="📁" label="Folder" />
              </div>
            </Popover>

            <Popover
              side="bottom"
              align="end"
              trigger={(props) => (
                <button className={v.secondaryBtn} {...props}>
                  Filters
                </button>
              )}
            >
              <div className="grid gap-3 p-2">
                <ToggleRow label="Only starred" />
                <ToggleRow label="Owned by me" />
                <ToggleRow label="Has comments" />
                <div className="flex justify-end gap-2 pt-1">
                  <button className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100">
                    Reset
                  </button>
                  <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                    Apply
                  </button>
                </div>
              </div>
            </Popover>
          </div>
        )}

        {/* Popover: confirm dialog */}
        {variant === "popover-confirm" && (
          <Popover
            side="top"
            align="center"
            arrow
            trigger={(props) => (
              <button
                className="px-3.5 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition shadow"
                {...props}
              >
                Delete
              </button>
            )}
          >
            <div className="max-w-[260px]">
              <div className="font-semibold text-black">Delete file?</div>
              <div className="text-sm text-neutral-600 mt-1">
                This action can’t be undone.
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100">
                  Cancel
                </button>
                <button className="px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700">
                  Delete
                </button>
              </div>
            </div>
          </Popover>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button className={v.primaryBtn}>Primary</button>
          <button className={v.secondaryBtn}>Secondary</button>
        </div>
      </div>
    </article>
  );
}

/* --------------------------- REUSABLE UI bits ---------------------------- */
function MenuItem({ icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 text-left">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-neutral-800">{label}</span>
    </button>
  );
}

function ToggleRow({ label }) {
  const [on, setOn] = useState(false);
  return (
    <label className="flex items-center justify-between gap-6 px-2 py-1.5">
      <span className="text-sm text-neutral-800">{label}</span>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          on ? "bg-indigo-600" : "bg-neutral-300"
        }`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-4" : ""
          }`}
        />
      </button>
    </label>
  );
}

/* ------------------------------- TOOLTIP --------------------------------- */
/** Accessible, headless tooltip (no portals, no images). */
function Tooltip({
  children,
  label,
  content,
  side = "top", // top | right | bottom | left
  delayIn = 100,
  delayOut = 80,
  arrow = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const tidIn = useRef(null);
  const tidOut = useRef(null);
  // SSR/CSR-stable id to avoid hydration mismatches
  const id = `tt-${useId()}`;

  useEffect(() => {
    if (hovering) {
      clearTimeout(tidOut.current);
      tidIn.current = setTimeout(() => setOpen(true), delayIn);
    } else {
      clearTimeout(tidIn.current);
      tidOut.current = setTimeout(() => setOpen(false), delayOut);
    }
    return () => {
      clearTimeout(tidIn.current);
      clearTimeout(tidOut.current);
    };
  }, [hovering, delayIn, delayOut]);

  const pos = {
    top: "bottom-full left-1/2 -translate-x-1/2 -translate-y-2",
    right: "left-full top-1/2 -translate-y-1/2 translate-x-2",
    bottom: "top-full left-1/2 -translate-x-1/2 translate-y-2",
    left: "right-full top-1/2 -translate-y-1/2 -translate-x-2",
  }[side];

  const arrowPos = {
    top: "top-full left-1/2 -translate-x-1/2",
    right: "right-full top-1/2 -translate-y-1/2",
    bottom: "bottom-full left-1/2 -translate-x-1/2",
    left: "left-full top-1/2 -translate-y-1/2",
  }[side];

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {typeof children === "function"
        ? children()
        : cloneElement(children, { "aria-describedby": id })}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute z-40 ${pos}`}
        >
          <span
            className={`inline-block rounded-md bg-neutral-900 text-white text-xs leading-snug px-2.5 py-1.5 shadow-lg ring-1 ring-black/10 ${className}`}
          >
            {content ?? label}
          </span>
          {arrow && (
            <span
              className={`absolute w-2 h-2 rotate-45 bg-neutral-900 ${arrowTranslate(
                side
              )} ${arrowPos}`}
              aria-hidden
            />
          )}
        </span>
      )}
    </span>
  );
}

/* ------------------------------- POPOVER --------------------------------- */
/** Click-to-toggle popover with outside-click & ESC close. */
function Popover({
  trigger,
  children,
  side = "bottom",
  align = "center", // start | center | end
  arrow = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keyup", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keyup", onKey);
    };
  }, []);

  const sidePos = {
    top: "bottom-full -translate-y-2",
    right: "left-full translate-x-2",
    bottom: "top-full translate-y-2",
    left: "right-full -translate-x-2",
  }[side];

  const alignPos = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }[align];

  const arrowPos = {
    top: "top-full left-1/2 -translate-x-1/2",
    right: "right-full top-1/2 -translate-y-1/2",
    bottom: "bottom-full left-1/2 -translate-x-1/2",
    left: "left-full top-1/2 -translate-y-1/2",
  }[side];

  return (
    <span className="relative inline-flex" ref={ref}>
      {typeof trigger === "function"
        ? trigger({
            onClick: () => setOpen((v) => !v),
            "aria-expanded": open,
            "aria-haspopup": "dialog",
          })
        : null}
      {open && (
        <div
          role="dialog"
          className={`absolute z-40 ${sidePos} ${alignPos} w-max min-w-[220px]`}
        >
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 p-2">
            {children}
          </div>
          {arrow && (
            <span
              className={`absolute w-3 h-3 rotate-45 bg-white border border-neutral-200 ${arrowTranslate(
                side
              )} ${arrowPos}`}
              aria-hidden
            />
          )}
        </div>
      )}
    </span>
  );
}

/* ----------------------------- tiny helpers ------------------------------ */
function arrowTranslate(side) {
  switch (side) {
    case "top":
      return "translate-y-0.5";
    case "right":
      return "-translate-x-0.5";
    case "bottom":
      return "-translate-y-0.5";
    case "left":
      return "translate-x-0.5";
    default:
      return "";
  }
}

/* ------------------------------- VARIANTS -------------------------------- */
function variants(variant) {
  const base = {
    wrapper:
      "rounded-2xl bg-white text-black overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.08)] border border-neutral-100",
    header: true,
    body: "p-5",
    primaryBtn:
      "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow",
    secondaryBtn:
      "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
  };

  switch (variant) {
    case "tooltip-basic":
      return {
        ...base,
        title: "Tooltip • Basic",
        subtitle: "Simple labels on hover / focus",
      };
    case "tooltip-rich":
      return {
        ...base,
        title: "Tooltip • Rich",
        subtitle: "Arbitrary content, keyboard hints",
      };
    case "tooltip-delay":
      return {
        ...base,
        title: "Tooltip • Delay",
        subtitle: "Configurable show/hide timing",
      };
    case "tooltip-arrow":
      return {
        ...base,
        title: "Tooltip • Arrowed",
        subtitle: "Directional caret for context",
      };
    case "popover-basic":
      return {
        ...base,
        title: "Popover • Menu",
        subtitle: "Contextual actions & filters",
      };
    case "popover-confirm":
      return {
        ...base,
        title: "Popover • Confirm",
        subtitle: "Lightweight confirm dialog",
      };
    default:
      return base;
  }
}

/* ========================================================================== */
/*                         CODEPEN-LIKE CODE VIEWER                           */
/* ========================================================================== */
function CodeShowcase() {
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
      {/* header */}
      <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <h2 className="text-white font-mono text-sm md:text-base">ELITNITE • Tooltips & Popovers</h2>
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Live
        </div>
      </div>

      {/* tabs */}
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

      {/* code area */}
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

      {/* footer */}
      <div className="bg-neutral-900 px-6 py-3 text-neutral-400 text-sm flex items-center justify-between">
        <span>✨ Basic • Rich • Delay • Arrowed • Menu • Confirm</span>
        <span className="hidden sm:block">⌨️ Esc closes • 🖱️ Outside-click</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Hydration-safe Tooltip/Popover (useId + cloneElement)
export function Tooltip({ children, label, content, side = "top", delayIn = 100, delayOut = 80, arrow = false, className = "" }) {
  const [open, setOpen] = useState(false), [hovering, setHovering] = useState(false);
  const tidIn = useRef(null), tidOut = useRef(null);
  const id = "tt-" + useId(); // SSR/CSR-stable
  useEffect(() => {
    if (hovering) { clearTimeout(tidOut.current); tidIn.current = setTimeout(() => setOpen(true), delayIn); }
    else { clearTimeout(tidIn.current); tidOut.current = setTimeout(() => setOpen(false), delayOut); }
    return () => { clearTimeout(tidIn.current); clearTimeout(tidOut.current); };
  }, [hovering, delayIn, delayOut]);
  const pos = { top:"bottom-full left-1/2 -translate-x-1/2 -translate-y-2", right:"left-full top-1/2 -translate-y-1/2 translate-x-2", bottom:"top-full left-1/2 -translate-x-1/2 translate-y-2", left:"right-full top-1/2 -translate-y-1/2 -translate-x-2" }[side];
  const arrowPos = { top:"top-full left-1/2 -translate-x-1/2", right:"right-full top-1/2 -translate-y-1/2", bottom:"bottom-full left-1/2 -translate-x-1/2", left:"left-full top-1/2 -translate-y-1/2" }[side];
  return (
    <span className="relative inline-flex" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}>
      {typeof children === "function" ? children() : React.cloneElement(children, { "aria-describedby": id })}
      {open && (
        <span id={id} role="tooltip" className={\`pointer-events-none absolute z-40 \${pos}\`}>
          <span className={\`inline-block rounded-md bg-neutral-900 text-white text-xs leading-snug px-2.5 py-1.5 shadow-lg ring-1 ring-black/10 \${className}\`}>
            {content ?? label}
          </span>
          {arrow && <span className={\`absolute w-2 h-2 rotate-45 bg-neutral-900 \${arrowTranslate(side)} \${arrowPos}\`} aria-hidden />}
        </span>
      )}
    </span>
  );
}

export function Popover({ trigger, children, side="bottom", align="center", arrow=false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e){ if(!ref.current) return; if(!ref.current.contains(e.target)) setOpen(false); }
    function onKey(e){ if(e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keyup", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keyup", onKey); };
  }, []);
  const sidePos = { top:"bottom-full -translate-y-2", right:"left-full translate-x-2", bottom:"top-full translate-y-2", left:"right-full -translate-x-2" }[side];
  const alignPos = { start:"left-0", center:"left-1/2 -translate-x-1/2", end:"right-0" }[align];
  const arrowPos = { top:"top-full left-1/2 -translate-x-1/2", right:"right-full top-1/2 -translate-y-1/2", bottom:"bottom-full left-1/2 -translate-x-1/2", left:"left-full top-1/2 -translate-y-1/2" }[side];
  return (
    <span className="relative inline-flex" ref={ref}>
      {typeof trigger === "function" ? trigger({ onClick: () => setOpen(v => !v), "aria-expanded": open, "aria-haspopup": "dialog" }) : null}
      {open && (
        <div role="dialog" className={\`absolute z-40 \${sidePos} \${alignPos} w-max min-w-[220px]\`}>
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 p-2">{children}</div>
          {arrow && <span className={\`absolute w-3 h-3 rotate-45 bg-white border border-neutral-200 \${arrowTranslate(side)} \${arrowPos}\`} aria-hidden />}
        </div>
      )}
    </span>
  );
}
`;

const CSS_CODE = `/* Tailwind utility notes (no external CSS needed) */
.tooltip      { @apply relative inline-flex; }
.tooltip-box  { @apply inline-block rounded-md bg-neutral-900 text-white text-xs px-2.5 py-1.5 shadow-lg ring-1 ring-black/10; }
.tooltip-arrow{ @apply absolute w-2 h-2 rotate-45 bg-neutral-900; }
.popover      { @apply relative inline-flex; }
.popover-box  { @apply rounded-xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 p-2; }`;

const HTML_CODE = `<!-- Static tooltip markup example -->
<span class="relative inline-flex">
  <button class="px-3.5 py-2 rounded-lg bg-indigo-600 text-white">Copy</button>
  <span role="tooltip" class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2">
    <span class="tooltip-box">Copy to clipboard</span>
    <span class="tooltip-arrow translate-y-0.5 top-full left-1/2 -translate-x-1/2"></span>
  </span>
</span>`;

const JS_CODE = `// Minimal JS: toggle a popover via data attributes
document.querySelectorAll('[data-popover-trigger]').forEach(btn => {
  const pop = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    pop.hidden = open;
  });
  document.addEventListener('click', (e) => {
    if (!pop.contains(e.target) && !btn.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false'); pop.hidden = true;
    }
  });
});`;

/* --------------------------- Syntax Highlighter --------------------------- */
function syntaxHighlight(code, language) {
  const patterns = {
    react: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      {
        pattern:
          /\b(import|export|from|const|let|var|function|class|return|if|else|useState|useMemo|useRef|useEffect|useId|cloneElement)\b/g,
        class: "text-purple-400",
      },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /&lt;[^&]*&gt;/g, class: "text-rose-400" },
      { pattern: /\b\d+\.?\d*\b/g, class: "text-orange-400" },
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /[.#@][\w-]+/g, class: "text-yellow-400" },
      { pattern: /[\w-]+(?=\s*:)/g, class: "text-blue-400" },
      { pattern: /:[\s]*[^;{]+/g, class: "text-green-400" },
      { pattern: /@apply|@media|@keyframes/g, class: "text-purple-400" },
    ],
    html: [
      { pattern: /&lt;[^&]*&gt;/g, class: "text-rose-400" },
      { pattern: /class="[^"]*"/g, class: "text-green-400" },
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, class: "text-neutral-500" },
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      {
        pattern:
          /\b(class|function|const|let|var|if|else|return|document|querySelector(All)?|addEventListener|toggle|getElementById)\b/g,
        class: "text-purple-400",
      },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /\b\d+\.?\d*\b/g, class: "text-orange-400" },
    ],
  };

  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  (patterns[language] || []).forEach(({ pattern, class: cls }) => {
    highlighted = highlighted.replace(pattern, (m) => `<span class="${cls}">${m}</span>`);
  });
  return highlighted;
}
