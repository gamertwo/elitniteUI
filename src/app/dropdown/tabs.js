// app/page.js
"use client";

import { useState, useMemo } from "react";

/* ========================================================================== */
/*                          TABS & SEGMENTED CONTROLS                         */
/* ========================================================================== */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-neutral-900">
          Tabs <span className="text-indigo-600">&</span> Segmented Controls
        </h1>

        {/* PREVIEWS */}
        <div className="mx-auto w-full md:w-[80%] lg:w-[70%] grid gap-12 mb-20">
          <Row title="Depth Tabs & Segmented Control">
            <Tabs variant="depth" />
            <Segmented variant="depth" />
          </Row>

          <Row title="Minimal Outline">
            <Tabs variant="minimal" />
            <Segmented variant="minimal" />
          </Row>

          <Row title="Rounded / Pill">
            <Tabs variant="pill" />
            <Segmented variant="pill" />
          </Row>

          <Row title="Bold / Contrast">
            <Tabs variant="bold" />
            <Segmented variant="bold" />
          </Row>
        </div>

        {/* CODEPEN */}
        <div className="relative">
          <div className="sticky top-[calc(100vh-360px)]">
            <TabsCodeShowcase />
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

/* ------------------------------- Tabs ----------------------------------- */
function Tabs({ variant = "depth" }) {
  const tabs = ["Overview", "Features", "Pricing", "Reviews"];
  const [active, setActive] = useState("Overview");
  const v = tabVariants(variant, active);

  return (
    <div className="w-full">
      <div className={`flex ${v.container}`}>
        {tabs.map((t) => (
          <button
            key={t}
            className={v.tab(t === active)}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 text-sm text-neutral-600">
        Active tab: <span className="font-semibold text-black">{active}</span>
      </div>
    </div>
  );
}

function tabVariants(variant, active) {
  switch (variant) {
    case "minimal":
      return {
        container: "border-b border-neutral-200",
        tab: (isActive) =>
          `px-4 py-2 -mb-px border-b-2 transition-colors ${
            isActive
              ? "border-indigo-600 text-black font-medium"
              : "border-transparent text-neutral-500 hover:text-black"
          }`,
      };
    case "pill":
      return {
        container: "gap-2 bg-neutral-100 rounded-full p-1",
        tab: (isActive) =>
          `px-4 py-1.5 rounded-full text-sm transition ${
            isActive
              ? "bg-indigo-600 text-white font-medium"
              : "text-neutral-600 hover:bg-white hover:text-black"
          }`,
      };
    case "bold":
      return {
        container: "gap-4",
        tab: (isActive) =>
          `px-4 py-2 rounded-lg text-sm font-semibold transition ${
            isActive
              ? "bg-yellow-400 text-black"
              : "bg-black text-white hover:bg-neutral-800"
          }`,
      };
    default: // depth
      return {
        container: "gap-4 bg-white rounded-xl shadow px-2 py-1",
        tab: (isActive) =>
          `px-4 py-1.5 rounded-lg text-sm transition ${
            isActive
              ? "bg-indigo-600 text-white font-medium shadow"
              : "text-neutral-600 hover:bg-neutral-100"
          }`,
      };
  }
}

/* -------------------------- Segmented Controls -------------------------- */
function Segmented({ variant = "depth" }) {
  const segments = ["Day", "Week", "Month"];
  const [active, setActive] = useState("Day");
  const v = segmentedVariants(variant, active);

  return (
    <div className="w-full">
      <div className={v.container}>
        {segments.map((s) => (
          <button
            key={s}
            className={v.segment(s === active)}
            onClick={() => setActive(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-3 text-sm text-neutral-600">
        Selected: <span className="font-semibold text-black">{active}</span>
      </div>
    </div>
  );
}

function segmentedVariants(variant, active) {
  switch (variant) {
    case "minimal":
      return {
        container: "flex border border-neutral-200 rounded-lg overflow-hidden",
        segment: (isActive) =>
          `flex-1 px-4 py-2 text-sm transition ${
            isActive
              ? "bg-neutral-900 text-white font-medium"
              : "text-neutral-600 hover:bg-neutral-100"
          }`,
      };
    case "pill":
      return {
        container: "flex gap-2 bg-neutral-100 rounded-full p-1",
        segment: (isActive) =>
          `flex-1 px-4 py-1.5 rounded-full text-sm transition ${
            isActive
              ? "bg-indigo-600 text-white font-medium"
              : "text-neutral-600 hover:bg-white hover:text-black"
          }`,
      };
    case "bold":
      return {
        container: "flex gap-3",
        segment: (isActive) =>
          `flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            isActive
              ? "bg-yellow-400 text-black"
              : "bg-black text-white hover:bg-neutral-800"
          }`,
      };
    default: // depth
      return {
        container: "flex bg-white rounded-xl shadow p-1",
        segment: (isActive) =>
          `flex-1 px-4 py-1.5 rounded-lg text-sm transition ${
            isActive
              ? "bg-indigo-600 text-white font-medium shadow"
              : "text-neutral-600 hover:bg-neutral-100"
          }`,
      };
  }
}

/* ========================================================================== */
/*                         CODEPEN-LIKE CODE VIEWER                           */
/* ========================================================================== */
function TabsCodeShowcase() {
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
        <h2 className="text-white font-mono text-sm md:text-base">ELITNITE • Tabs & Segmented Controls</h2>
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
        <span>✨ Depth, pill, minimal, bold variants</span>
        <span className="hidden sm:block">⌨️ Click / focus states</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Tabs and Segmented Controls with variants
"use client";
import { useState } from "react";

export function Tabs() {
  const [active, setActive] = useState("Overview");
  const tabs = ["Overview", "Features", "Pricing", "Reviews"];
  return (
    <div>
      <div className="flex gap-4 border-b">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={\`px-4 py-2 -mb-px border-b-2
              \${active === t ? "border-indigo-600 text-black font-medium" : "border-transparent text-neutral-500"}\`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 text-sm">Active: {active}</div>
    </div>
  );
}

export function Segmented() {
  const [active, setActive] = useState("Day");
  const segments = ["Day", "Week", "Month"];
  return (
    <div>
      <div className="flex border rounded-lg overflow-hidden">
        {segments.map(s => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={\`flex-1 px-4 py-2 text-sm
              \${active === s ? "bg-neutral-900 text-white" : "text-neutral-600"}\`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-3 text-sm">Selected: {active}</div>
    </div>
  );
}`;

const CSS_CODE = `/* Tailwind utility notes */
.tab-active { @apply border-indigo-600 text-black font-medium; }
.tab-inactive { @apply border-transparent text-neutral-500; }
.segmented-container { @apply flex border rounded-lg overflow-hidden; }
.segment-active { @apply bg-neutral-900 text-white; }
.segment-inactive { @apply text-neutral-600; }`;

const HTML_CODE = `<!-- Static Markup -->
<div class="tabs">
  <div class="flex gap-4 border-b">
    <button class="tab-active">Overview</button>
    <button class="tab-inactive">Features</button>
    <button class="tab-inactive">Pricing</button>
    <button class="tab-inactive">Reviews</button>
  </div>
</div>

<div class="segmented">
  <div class="segmented-container">
    <button class="segment-active">Day</button>
    <button class="segment-inactive">Week</button>
    <button class="segment-inactive">Month</button>
  </div>
</div>`;

const JS_CODE = `// Keyboard accessibility
document.querySelectorAll('[role="tab"], [role="button"]').forEach(btn => {
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // move focus between tabs/segments
    }
  });
});`;

/* --------------------------- Syntax Highlight --------------------------- */
function syntaxHighlight(code, language) {
  const patterns = {
    react: [
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(import|export|from|const|let|var|function|class|return|useState)\b/g, class: "text-purple-400" },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /<[^>]+>/g, class: "text-rose-400" },
    ],
    css: [
      { pattern: /\.[\w-]+/g, class: "text-yellow-400" },
      { pattern: /@apply/g, class: "text-purple-400" },
      { pattern: /bg-[\w-]+|text-[\w-]+|border-[\w-]+/g, class: "text-blue-400" },
    ],
    html: [
      { pattern: /<[^>]+>/g, class: "text-rose-400" },
      { pattern: /class="[^"]*"/g, class: "text-green-400" },
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(const|let|var|if|else|function|return|document|querySelector(All)?|addEventListener)\b/g, class: "text-purple-400" },
      { pattern: /'[^']*'|"[^"]*"/g, class: "text-green-400" },
    ],
  };

  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  (patterns[language] || []).forEach(({ pattern, class: cls }) => {
    highlighted = highlighted.replace(pattern, (m) => `<span class="${cls}">${m}</span>`);
  });
  return highlighted;
}
