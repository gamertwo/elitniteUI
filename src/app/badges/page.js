// app/page.js
"use client";

import { useMemo, useState } from "react";

/* ========================================================================== */
/*                              AVATARS & BADGES                              */
/* ========================================================================== */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        {/* <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-neutral-900 ml-95">
          Premium <span className="text-indigo-600">Avatars</span> & Badges
        </h1> */}

        {/* PREVIEW GRID */}
        <div className="mx-auto w-full md:w-[88%] lg:w-[78%] grid gap-10 md:grid-cols-2 mb-20">
          <AvatarCard variant="classic" />
          <AvatarCard variant="ringed" />
          <AvatarCard variant="status" />
          <AvatarCard variant="stacked" />
          <AvatarCard variant="initials" />
          <AvatarCard variant="badges" />
        </div>

        {/* CODEPEN STYLE VIEWER */}
        <div className="relative">
          <div className="sticky top-[calc(100vh-360px)]">
            <AvatarsCodeShowcase />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------------------------- CARD --------------------------------- */
function AvatarCard({ variant = "classic" }) {
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
        {/* Classic / Ringed / Status / Initials / Badges (all initials-only) */}
        {["classic", "ringed", "status", "initials", "badges"].includes(variant) && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <AvatarInitials
                size="lg"
                text={variant === "initials" ? "UX" : "DU"}
                theme={variant === "ringed" ? "indigo" : "neutral"}
                ringed={variant === "ringed"}
              />
              {variant === "status" && <StatusDot status="online" />}
              {variant === "badges" && (
                <>
                  <CornerBadge icon="⭐" title="Pro" />
                  <CounterBadge value={3} />
                </>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-black font-semibold truncate">
                {variant === "initials" ? "UX Team" : "Default User"}
              </h4>
              <p className="text-sm text-neutral-500 truncate">
                {variant === "initials" ? "Design System" : "Product Designer"}
              </p>

              {["classic", "ringed", "status", "badges"].includes(variant) && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge label="Active" tone="success" />
                  <Badge label="Team" tone="indigo" variant="soft" />
                  <Badge label="New" tone="amber" variant="outline" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stacked / Group (initials-only) */}
        {variant === "stacked" && (
          <div>
            <div className="flex -space-x-3">
              <AvatarInitials size="md" text="DU" theme="neutral" ringed />
              <AvatarInitials size="md" text="JC" theme="indigo" ringed />
              <AvatarInitials size="md" text="WW" theme="emerald" ringed />
              <AvatarInitials size="md" text="AK" theme="rose" ringed />
              <MoreCounter count={12} />
            </div>

            <div className="mt-4">
              <div className="text-black font-semibold">Design Review</div>
              <div className="text-sm text-neutral-500">Participants</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge label="Today 4:00 PM" tone="indigo" />
                <Badge label="UI/UX" tone="pink" variant="soft" />
                <Badge label="Sprint 12" tone="neutral" variant="outline" />
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button className={v.primaryBtn}>Message</button>
          <button className={v.secondaryBtn}>Profile</button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ AVATAR PARTS ----------------------------- */
function AvatarInitials({ size = "md", text = "AB", theme = "indigo", ringed = false }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  };
  const themes = {
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
    neutral: "bg-neutral-200 text-neutral-700",
  };
  return (
    <div
      className={`relative rounded-full ${sizes[size]} ${themes[theme]} flex items-center justify-center font-semibold ${
        ringed ? "ring-2 ring-white shadow" : ""
      }`}
    >
      {text}
    </div>
  );
}

function StatusDot({ status = "online" }) {
  const map = {
    online: "bg-emerald-500",
    busy: "bg-rose-500",
    away: "bg-amber-400",
    offline: "bg-neutral-400",
  };
  return (
    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white ${map[status]}`} />
  );
}

function CornerBadge({ icon = "⭐", title = "Pro" }) {
  return (
    <span className="absolute -top-1.5 -left-1.5 text-[11px] px-1.5 py-0.5 rounded-md bg-white/90 text-black shadow">
      {icon} {title}
    </span>
  );
}

function CounterBadge({ value = 1 }) {
  return (
    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center ring-2 ring-white">
      {value}
    </span>
  );
}

function MoreCounter({ count = 5 }) {
  return (
    <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center justify-center ring-2 ring-white shadow">
      +{count}
    </div>
  );
}

/* --------------------------------- BADGES -------------------------------- */
function Badge({ label, tone = "neutral", variant = "solid" }) {
  const toneMap = {
    neutral: {
      solid: "bg-neutral-900 text-white",
      soft: "bg-neutral-100 text-neutral-700",
      outline: "ring-1 ring-neutral-300 text-neutral-700",
    },
    indigo: {
      solid: "bg-indigo-600 text-white",
      soft: "bg-indigo-50 text-indigo-700",
      outline: "ring-1 ring-indigo-300 text-indigo-700",
    },
    success: {
      solid: "bg-emerald-600 text-white",
      soft: "bg-emerald-50 text-emerald-700",
      outline: "ring-1 ring-emerald-300 text-emerald-700",
    },
    pink: {
      solid: "bg-pink-600 text-white",
      soft: "bg-pink-50 text-pink-700",
      outline: "ring-1 ring-pink-300 text-pink-700",
    },
    amber: {
      solid: "bg-amber-500 text-black",
      soft: "bg-amber-50 text-amber-700",
      outline: "ring-1 ring-amber-300 text-amber-700",
    },
    rose: {
      solid: "bg-rose-600 text-white",
      soft: "bg-rose-50 text-rose-700",
      outline: "ring-1 ring-rose-300 text-rose-700",
    },
  };

  const cls = toneMap[tone]?.[variant] || toneMap.neutral.solid;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

/* ------------------------------- VARIANTS -------------------------------- */
function variants(variant) {
  switch (variant) {
    case "ringed":
      return {
        wrapper:
          "rounded-2xl border border-neutral-200 bg-white text-black overflow-hidden",
        header: true,
        title: "Ringed",
        subtitle: "Initials avatar with subtle ring / shadow",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    case "status":
      return {
        wrapper:
          "rounded-2xl border border-neutral-200 bg-white text-black overflow-hidden",
        header: true,
        title: "Presence",
        subtitle: "Online / Busy / Away / Offline",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    case "stacked":
      return {
        wrapper:
          "rounded-2xl bg-white text-black overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.08)] border border-neutral-100",
        header: true,
        title: "Avatar Group",
        subtitle: "Overlapping initials with counter",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    case "initials":
      return {
        wrapper:
          "rounded-2xl border border-neutral-200 bg-white text-black overflow-hidden",
        header: true,
        title: "Initials",
        subtitle: "Brand-colored monograms",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    case "badges":
      return {
        wrapper:
          "rounded-2xl border border-neutral-200 bg-white text-black overflow-hidden",
        header: true,
        title: "Decorated",
        subtitle: "Corner & counter badges on initials",
        body: "p-5",
        primaryBtn:
          "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition",
        secondaryBtn:
          "px-3.5 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition",
      };
    default: // classic
      return {
        wrapper:
          "rounded-2xl bg-white text-black overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.08)] border border-neutral-100",
        header: true,
        title: "Classic",
        subtitle: "Clean initials + inline badges",
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
function AvatarsCodeShowcase() {
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
        <h2 className="text-white font-mono text-sm md:text-base">ELITNITE • Avatar Components</h2>
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
        <span>✨ Classic • Ringed • Presence • Stacked • Initials • Decorated</span>
        <span className="hidden sm:block">🟢 Status • 🔢 Counters • 🏷️ Pills</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Initials-only avatar primitives (no images) + badges
export function AvatarInitials({ size = "md", text = "AB", theme = "indigo", ringed = false }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" };
  const themes = {
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
    neutral: "bg-neutral-200 text-neutral-700",
  };
  return <div className={\`relative rounded-full \${sizes[size]} \${themes[theme]} flex items-center justify-center font-semibold \${ringed ? "ring-2 ring-white shadow" : ""}\`}>{text}</div>;
}

export function StatusDot({ status = "online" }) {
  const map = { online: "bg-emerald-500", busy: "bg-rose-500", away: "bg-amber-400", offline: "bg-neutral-400" };
  return <span className={\`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white \${map[status]}\`} />;
}

export function CornerBadge({ icon = "⭐", title = "Pro" }) {
  return <span className="absolute -top-1.5 -left-1.5 text-[11px] px-1.5 py-0.5 rounded-md bg-white/90 text-black shadow">{icon} {title}</span>;
}

export function CounterBadge({ value = 1 }) {
  return <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center ring-2 ring-white">{value}</span>;
}

export function Badge({ label, tone = "neutral", variant = "solid" }) {
  const toneMap = {
    neutral:{ solid:"bg-neutral-900 text-white", soft:"bg-neutral-100 text-neutral-700", outline:"ring-1 ring-neutral-300 text-neutral-700" },
    indigo: { solid:"bg-indigo-600 text-white", soft:"bg-indigo-50 text-indigo-700", outline:"ring-1 ring-indigo-300 text-indigo-700" },
    success:{ solid:"bg-emerald-600 text-white", soft:"bg-emerald-50 text-emerald-700", outline:"ring-1 ring-emerald-300 text-emerald-700" },
    pink:   { solid:"bg-pink-600 text-white",   soft:"bg-pink-50 text-pink-700",     outline:"ring-1 ring-pink-300 text-pink-700" },
    amber:  { solid:"bg-amber-500 text-black",  soft:"bg-amber-50 text-amber-700",   outline:"ring-1 ring-amber-300 text-amber-700" },
    rose:   { solid:"bg-rose-600 text-white",   soft:"bg-rose-50 text-rose-700",     outline:"ring-1 ring-rose-300 text-rose-700" },
  };
  const cls = toneMap[tone]?.[variant] || toneMap.neutral.solid;
  return <span className={\`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full \${cls}\`}>{label}</span>;
}
`;

const CSS_CODE = `/* Tailwind notes — no images */
.avatar      { @apply rounded-full flex items-center justify-center font-semibold; }
.avatar-ring { @apply ring-2 ring-white shadow; }
.avatar-dot  { @apply absolute rounded-full ring-2 ring-white; }
.badge       { @apply inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full; }`;

const HTML_CODE = `<!-- Static initials avatar (no images) -->
<div class="flex items-center gap-4">
  <div class="relative rounded-full w-14 h-14 bg-neutral-200 text-neutral-700 font-semibold flex items-center justify-center ring-2 ring-white shadow">
    DU
    <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white bg-emerald-500"></span>
    <span class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center ring-2 ring-white">3</span>
  </div>
  <div>
    <div class="font-semibold text-neutral-900">Default User</div>
    <div class="text-sm text-neutral-500">Product Designer</div>
    <div class="mt-2 flex gap-2">
      <span class="badge bg-neutral-900 text-white">Active</span>
      <span class="badge bg-indigo-50 text-indigo-700">Team</span>
      <span class="badge ring-1 ring-amber-300 text-amber-700">New</span>
    </div>
  </div>
</div>`;

const JS_CODE = `// Example: cycle status dot on click (initials-only)
const avatar = document.querySelector('[data-avatar]');
const statuses = ['online','busy','away','offline'];
let i = 0;
if (avatar) {
  avatar.addEventListener('click', () => {
    i = (i + 1) % statuses.length;
    const map = { online:'bg-emerald-500', busy:'bg-rose-500', away:'bg-amber-400', offline:'bg-neutral-400' };
    const dot = avatar.querySelector('[data-dot]');
    dot.className = 'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white ' + map[statuses[i]];
  });
}`;

/* --------------------------- Syntax Highlighter --------------------------- */
function syntaxHighlight(code, language) {
  const patterns = {
    react: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: "text-neutral-500" },
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(import|export|from|const|let|var|function|class|return|if|else|useState|useMemo)\b/g, class: "text-purple-400" },
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
