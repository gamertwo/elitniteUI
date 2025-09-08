// app/page.js
"use client";

import { useMemo, useState } from "react";

/* ========================================================================== */
/*                                     CARDS                                  */
/* ========================================================================== */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-neutral-900 ml-95">
          Premium <span className="text-indigo-600">Cards</span>
        </h1>

        {/* PREVIEW GRID */}
        <div className="mx-auto w-full md:w-[88%] lg:w-[78%] grid gap-10 md:grid-cols-2 mb-20">
          <Card variant="depth" />
          <Card variant="minimal" />
          <Card variant="glass" />
          <Card variant="bold" />
          <Card variant="media" />
          <Card variant="stats" />
        </div>

        {/* CODEPEN STYLE VIEWER */}
        <div className="relative">
          <div className="sticky top-[calc(100vh-360px)]">
            <CardsCodeShowcase />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------------------------- CARD --------------------------------- */
function Card({ variant = "depth" }) {
  const v = variants(variant);

  return (
    <article className={v.wrapper}>
      {/* media header (optional, removed real image → replaced with gray box) */}
      {v.media && (
        <div className={v.mediaWrap}>
          <div className="h-40 w-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
            Placeholder
          </div>
          {variant === "media" && (
            <span className="absolute top-3 left-3 text-[11px] px-2 py-0.5 rounded-full bg-white/90 text-black shadow">
              Featured
            </span>
          )}
        </div>
      )}

      {/* content */}
      <div className={v.body}>
        <div className="flex items-start gap-3">
          <DefaultAvatar />
          <div className="min-w-0">
            <h3 className="text-black font-semibold truncate">Default User</h3>
            <p className="text-sm text-neutral-500 truncate">
              Example user profile description
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-700 mt-4">
          This is a default card layout with placeholder visuals for user or content. Replace with real data when needed.
        </p>

        {variant === "stats" ? (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Posts" value="42" />
            <Stat label="Followers" value="1.2k" />
            <Stat label="Following" value="364" />
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-3">
            <button className={v.primaryBtn}>Message</button>
            <button className={v.secondaryBtn}>Profile</button>
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------------------------- Default Avatar ---------------------------- */
function DefaultAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 text-xs font-bold">
      U
    </div>
  );
}


function Avatar() {
  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow">
      <img
        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
        alt="Avatar"
        className="w-full h-full object-cover"
      />
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-neutral-50 border border-neutral-200 py-3 text-center">
      <div className="text-black font-semibold">{value}</div>
      <div className="text-[11px] text-neutral-500">{label}</div>
    </div>
  );
}

/* ------------------------------- VARIANTS -------------------------------- */
function variants(variant) {
  switch (variant) {
    case "minimal":
      return {
        wrapper:
          "rounded-2xl border border-neutral-200 bg-white text-black overflow-hidden",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    case "glass":
      return {
        wrapper:
          "rounded-2xl border border-white/30 bg-white/60 backdrop-blur-lg text-black overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,.08)]",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-white/50 bg-white/40 hover:bg-white/70 transition",
      };
    case "bold":
      return {
        wrapper:
          "rounded-2xl bg-indigo-600 text-white overflow-hidden shadow-xl",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-yellow-300 hover:text-black transition",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg bg-indigo-500/40 border border-white/30 hover:bg-indigo-500/60 transition",
      };
    case "media":
      return {
        wrapper:
          "rounded-2xl border border-neutral-200 bg-white text-black overflow-hidden",
        mediaWrap: "relative",
        media: "h-40 w-full object-cover",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    case "stats":
      return {
        wrapper:
          "rounded-2xl border border-neutral-200 bg-white text-black overflow-hidden",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    default: // depth
      return {
        wrapper:
          "rounded-2xl bg-white text-black overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.08)] border border-neutral-100",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
  }
}

/* ========================================================================== */
/*                         CODEPEN-LIKE CODE VIEWER                           */
/* ========================================================================== */
function CardsCodeShowcase() {
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
        <h2 className="text-white font-mono text-sm md:text-base">ELITNITE • Card Components</h2>
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
        <span>✨ Depth • Minimal • Glass • Bold • Media • Stats</span>
        <span className="hidden sm:block">🖼️ Images • 📊 Metrics • 🎛️ CTAs</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Reusable Card with variants (depth, minimal, glass, bold, media, stats)
export function Card({ variant = "depth" }) {
  const v = variants(variant);
  return (
    <article className={v.wrapper}>
      {v.media && (
        <div className={v.mediaWrap}>
          <img src="/cover.jpg" alt="Cover" className={v.media} />
        </div>
      )}
      <div className={v.body}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-200" />
          <div className="min-w-0">
            <h3 className="font-semibold truncate">Aurora UI Kit</h3>
            <p className="text-sm text-neutral-500 truncate">Next.js + Tailwind</p>
          </div>
        </div>
        <p className="text-sm text-neutral-700 mt-4">
          Build production-grade interfaces faster with polished components.
        </p>
        {variant === "stats" ? (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-neutral-50 border border-neutral-200 py-3 text-center">
              <div className="font-semibold">12.4k</div>
              <div className="text-[11px] text-neutral-500">Users</div>
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-200 py-3 text-center">
              <div className="font-semibold">3.2%</div>
              <div className="text-[11px] text-neutral-500">Conv.</div>
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-200 py-3 text-center">
              <div className="font-semibold">$84k</div>
              <div className="text-[11px] text-neutral-500">MRR</div>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-3">
            <button className={v.primaryBtn}>Get Started</button>
            <button className={v.secondaryBtn}>Preview</button>
          </div>
        )}
      </div>
    </article>
  );
}

function variants(variant) {
  switch (variant) {
    case "minimal":
      return {
        wrapper: "rounded-2xl border border-neutral-200 bg-white",
        body: "p-5",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white",
        secondaryBtn: "px-3.5 py-2 rounded-lg border border-neutral-300",
      };
    case "glass":
      return {
        wrapper: "rounded-2xl border border-white/30 bg-white/60 backdrop-blur-lg",
        body: "p-5",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-indigo-600 text-white",
        secondaryBtn: "px-3.5 py-2 rounded-lg border border-white/50 bg-white/40",
      };
    case "bold":
      return {
        wrapper: "rounded-2xl bg-indigo-600 text-white",
        body: "p-5",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-white text-indigo-700 font-semibold",
        secondaryBtn: "px-3.5 py-2 rounded-lg bg-indigo-500/40 border border-white/30",
      };
    case "media":
      return {
        wrapper: "rounded-2xl border border-neutral-200 bg-white overflow-hidden",
        mediaWrap: "relative",
        media: "h-40 w-full object-cover",
        body: "p-5",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white",
        secondaryBtn: "px-3.5 py-2 rounded-lg border border-neutral-300",
      };
    case "stats":
      return {
        wrapper: "rounded-2xl border border-neutral-200 bg-white",
        body: "p-5",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white",
        secondaryBtn: "px-3.5 py-2 rounded-lg border border-neutral-300",
      };
    default:
      return {
        wrapper: "rounded-2xl bg-white shadow border border-neutral-100",
        body: "p-5",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-indigo-600 text-white",
        secondaryBtn: "px-3.5 py-2 rounded-lg border border-neutral-300",
      };
  }
}`;

const CSS_CODE = `/* Tailwind utility notes for Cards */
.card-depth   { @apply rounded-2xl bg-white shadow border border-neutral-100; }
.card-minimal { @apply rounded-2xl bg-white border border-neutral-200; }
.card-glass   { @apply rounded-2xl bg-white/60 border border-white/30 backdrop-blur-lg; }
.card-bold    { @apply rounded-2xl bg-indigo-600 text-white; }
.card-media   { @apply rounded-2xl bg-white border overflow-hidden; }
.card-stats   { @apply rounded-2xl bg-white border; }

.card-title   { @apply font-semibold; }
.card-sub     { @apply text-sm text-neutral-500; }
.card-body    { @apply text-sm text-neutral-700; }

.btn-primary  { @apply px-3.5 py-2 rounded-lg bg-indigo-600 text-white; }
.btn-secondary{ @apply px-3.5 py-2 rounded-lg border border-neutral-300; }`;

const HTML_CODE = `<!-- Static card markup -->
<article class="card-depth">
  <div class="p-5">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-full bg-neutral-200"></div>
      <div class="min-w-0">
        <h3 class="card-title">Aurora UI Kit</h3>
        <p class="card-sub">Next.js + Tailwind</p>
      </div>
    </div>
    <p class="card-body mt-4">
      Build production-grade interfaces faster with polished components.
    </p>
    <div class="mt-5 flex items-center gap-3">
      <button class="btn-primary">Get Started</button>
      <button class="btn-secondary">Preview</button>
    </div>
  </div>
</article>`;

const JS_CODE = `// Example: toggle a 'selected' visual on card click
document.querySelectorAll('article').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('ring-2');
    card.classList.toggle('ring-indigo-400');
  });
});`;

/* --------------------------- Syntax Highlighter --------------------------- */
function syntaxHighlight(code, language) {
  const patterns = {
    react: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(import|export|from|const|let|var|function|class|return|if|else|useState)\b/g, class: "text-purple-400" },
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
      { pattern: /\b(class|function|const|let|var|if|else|return|document|querySelector(All)?|addEventListener|toggle)\b/g, class: "text-purple-400" },
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
