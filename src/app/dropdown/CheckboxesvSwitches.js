// app/page.js
"use client";

import { useMemo, useState } from "react";

/* ========================================================================== */
/*                               CHECKS & SWITCHES                             */
/* ========================================================================== */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-neutral-900">
          Checkboxes <span className="text-indigo-600">vs</span> Switches
        </h1>

        {/* PREVIEW GRID */}
        <div className="mx-auto w-full md:w-[80%] lg:w-[70%] grid gap-12 mb-20">
          <Row title="Standard (Depth)">
            <Checkbox variant="depth" id="c1" label="Enable notifications" />
            <Switch variant="depth" id="s1" label="Notifications" />
          </Row>

          <Row title="Minimal Outline">
            <Checkbox variant="minimal" id="c2" label="Remember me" />
            <Switch variant="minimal" id="s2" label="Remember me" />
          </Row>

          <Row title="Rounded / Pill">
            <Checkbox variant="pill" id="c3" label="Beta features" />
            <Switch variant="pill" id="s3" label="Beta features" />
          </Row>

          <Row title="Bold / Contrast">
            <Checkbox variant="bold" id="c4" label="Marketing emails" />
            <Switch variant="bold" id="s4" label="Marketing emails" />
          </Row>

          <Row title="Disabled states">
            <Checkbox variant="depth" id="c5" label="Location access" disabled />
            <Switch variant="depth" id="s5" label="Location access" disabled />
          </Row>
        </div>

        {/* CODEPEN STYLE VIEWER */}
        <div className="relative">
          <div className="sticky top-[calc(100vh-360px)]">
            <ChecksCodeShowcase />
          </div>
        </div>
      </div>
    </main>
  );
}

/* --------------------------------- Row ---------------------------------- */
function Row({ title, children }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-500 mb-3">{title}</h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

/* ------------------------------- Checkbox -------------------------------- */
function Checkbox({ id, label, disabled, variant = "depth" }) {
  const [checked, setChecked] = useState(false);
  const v = checkboxVariant(variant, disabled, checked);
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setChecked(!checked)}
        onClick={() => !disabled && setChecked(!checked)}
        className={v.box}
      >
        <svg
          className={`transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
          width="16" height="16" viewBox="0 0 20 20" aria-hidden
        >
          <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <span className={`text-sm ${disabled ? "text-neutral-400" : "text-black"}`}>{label}</span>
        <p className="text-xs text-neutral-500">Checkbox toggles a **state**; can be multi-select.</p>
      </div>
      <input id={id} type="checkbox" className="sr-only" disabled={disabled} checked={checked} onChange={()=>{}} />
    </label>
  );
}

function checkboxVariant(variant, disabled, checked) {
  const base =
    "inline-grid place-items-center w-5 h-5 rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";
  if (variant === "minimal")
    return {
      box:
        `${base} ${disabled ? "opacity-40" : ""} ` +
        (checked
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white border-neutral-300 hover:border-neutral-400"),
    };
  if (variant === "pill")
    return {
      box:
        `${base} rounded-full ${disabled ? "opacity-40" : ""} ` +
        (checked ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-neutral-300"),
    };
  if (variant === "bold")
    return {
      box:
        `${base} ${disabled ? "opacity-40" : ""} ` +
        (checked ? "bg-yellow-400 text-black border-yellow-400" : "bg-black/90 border-black/90 text-white"),
    };
  // depth
  return {
    box:
      `${base} ${disabled ? "opacity-40" : ""} ` +
      (checked
        ? "bg-indigo-600 text-white border-indigo-600 shadow-[0_8px_20px_rgba(79,70,229,.35)]"
        : "bg-white border-neutral-200 shadow-sm hover:shadow-md"),
  };
}

/* -------------------------------- Switch --------------------------------- */
function Switch({ id, label, disabled, variant = "depth" }) {
  const [on, setOn] = useState(false);
  const v = switchVariant(variant, disabled, on);

  return (
    <label htmlFor={id} className="flex items-center justify-between gap-6 w-full max-w-md cursor-pointer">
      <div className="min-w-0">
        <span className={`block text-sm ${disabled ? "text-neutral-400" : "text-black"}`}>{label}</span>
        <p className="text-xs text-neutral-500">Switches represent **instant actions**; usually single setting.</p>
      </div>

      <span
        role="switch"
        aria-checked={on}
        tabIndex={0}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setOn(!on)}
        onClick={() => !disabled && setOn(!on)}
        className={v.track}
      >
        <span className={v.thumb} />
      </span>

      <input id={id} type="checkbox" className="sr-only" disabled={disabled} checked={on} onChange={()=>{}} />
    </label>
  );
}

function switchVariant(variant, disabled, on) {
  const base =
    "relative inline-flex h-6 w-11 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";
  const thumbBase =
    "absolute top-0.5 h-5 w-5 rounded-full transition-all will-change-transform";
  if (variant === "minimal")
    return {
      track:
        `${base} ${disabled ? "opacity-40" : ""} ` +
        (on ? "bg-neutral-900" : "bg-neutral-300"),
      thumb: `${thumbBase} bg-white shadow translate-x-0.5 ${on ? "translate-x-5" : ""}`,
    };
  if (variant === "pill")
    return {
      track:
        `${base} ${disabled ? "opacity-40" : ""} ` +
        (on ? "bg-indigo-600" : "bg-neutral-200"),
      thumb: `${thumbBase} ${on ? "translate-x-5 bg-white" : "translate-x-0.5 bg-white"} shadow`,
    };
  if (variant === "bold")
    return {
      track:
        `${base} ${disabled ? "opacity-40" : ""} ` +
        (on ? "bg-yellow-400" : "bg-black"),
      thumb: `${thumbBase} ${on ? "translate-x-5 bg-black" : "translate-x-0.5 bg-white"} shadow`,
    };
  // depth
  return {
    track:
      `${base} ${disabled ? "opacity-40" : ""} ` +
      (on ? "bg-indigo-600 shadow-[0_8px_24px_rgba(79,70,229,.35)]" : "bg-neutral-200"),
    thumb: `${thumbBase} ${on ? "translate-x-5 bg-white" : "translate-x-0.5 bg-white"} shadow`,
  };
}

/* ========================================================================== */
/*                         CODEPEN-LIKE CODE VIEWER                           */
/* ========================================================================== */
function ChecksCodeShowcase() {
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
        <h2 className="text-white font-mono text-sm md:text-base">ELITNITE • Checkboxes vs Switches</h2>
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live
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
        <span>✅ Multi-select states vs 🔀 immediate actions</span>
        <span className="hidden sm:block">⌨️ Space / Enter toggles • Focus rings</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Checkbox & Switch components with variants
"use client";
import { useState } from "react";

export function Checkbox({ label }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setChecked(!checked)}
        onClick={() => setChecked(!checked)}
        className={\`inline-grid place-items-center w-5 h-5 rounded-md border transition
          \${checked ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-neutral-300"}\`}
      >
        <svg width="16" height="16" viewBox="0 0 20 20">
          <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
      <span className="text-sm text-black">{label}</span>
    </label>
  );
}

export function Switch({ label }) {
  const [on, setOn] = useState(false);
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer w-64">
      <span className="text-sm text-black">{label}</span>
      <span
        role="switch"
        aria-checked={on}
        tabIndex={0}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setOn(!on)}
        onClick={() => setOn(!on)}
        className={\`relative inline-flex h-6 w-11 rounded-full transition
          \${on ? "bg-indigo-600" : "bg-neutral-300"}\`}
      >
        <span className={\`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition
          \${on ? "translate-x-5" : "translate-x-0.5"}\`} />
      </span>
    </label>
  );
}`;

const CSS_CODE = `/* Tailwind utility notes */
.checkbox-box { @apply inline-grid place-items-center w-5 h-5 rounded-md border transition; }
.checkbox-on { @apply bg-indigo-600 text-white border-indigo-600; }
.checkbox-off { @apply bg-white border-neutral-300; }
.switch-track { @apply relative inline-flex h-6 w-11 rounded-full transition; }
.switch-on { @apply bg-indigo-600; }
.switch-off { @apply bg-neutral-300; }
.switch-thumb { @apply absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition; }`;

const HTML_CODE = `<!-- Static markup examples -->
<label class="checkbox">
  <span class="checkbox-box checkbox-on">
    <svg width="16" height="16" viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2"/></svg>
  </span>
  <span class="text-sm">Enable notifications</span>
</label>

<label class="switch">
  <span class="text-sm">Notifications</span>
  <span class="switch-track switch-on">
    <span class="switch-thumb" style="transform: translateX(20px)"></span>
  </span>
</label>`;

const JS_CODE = `// Keyboard toggling helpers
document.querySelectorAll('[role="checkbox"], [role="switch"]').forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      el.click();
    }
  });
});`;

/* --------------------------- Syntax Highlighter --------------------------- */
function syntaxHighlight(code, language) {
  const patterns = {
    react: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(import|export|from|const|let|var|function|class|return|if|else|for|while|try|catch|new|this|async|await)\b/g, class: "text-purple-400" },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /&lt;[^&]*&gt;/g, class: "text-rose-400" },
      { pattern: /\b\d+\.?\d*\b/g, class: "text-orange-400" },
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /[.#@][\w-]+/g, class: "text-yellow-400" },
      { pattern: /[\w-]+(?=\s*:)/g, class: "text-blue-400" },
      { pattern: /:[\s]*[^;{]+/g, class: "text-green-400" },
      { pattern: /@keyframes|@media|@import|@apply/g, class: "text-purple-400" },
    ],
    html: [
      { pattern: /&lt;[^&]*&gt;/g, class: "text-rose-400" },
      { pattern: /class="[^"]*"/g, class: "text-green-400" },
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, class: "text-neutral-500" },
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(class|function|const|let|var|if|else|for|while|return|this|new|async|await|document|querySelector(All)?|addEventListener|click|keydown)\b/g, class: "text-purple-400" },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /\b\d+\.?\d*\b/g, class: "text-orange-400" },
    ],
  };

  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  (patterns[language] || []).forEach(({ pattern, class: cls }) => {
    highlighted = highlighted.replace(pattern, (m) => `<span class="${cls}">${m}</span>`);
  });
  return highlighted;
}
