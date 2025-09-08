// app/page.js
"use client";

import { useState, useMemo } from "react";

/* --------------------------- NAVBAR SHOWCASE --------------------------- */
export default function Page() {
  const [anyOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-neutral-900">
          Different <span className="text-indigo-600">Navigation Bars</span>
        </h1>

        {/* NAVBAR PREVIEWS */}
        <div
          className={`mx-auto w-full md:w-[80%] lg:w-[70%] grid gap-10 mb-20`}
        >
          <NavBar variant="depth" />
          <NavBar variant="minimal" />
          <NavBar variant="pill" />
          <NavBar variant="bold" />
        </div>

        {/* CODEPEN */}
        <div className="relative">
          <div className="sticky top-[calc(100vh-360px)]">
            <NavbarCodeShowcase />
          </div>
        </div>
      </div>
    </main>
  );
}

/* --------------------------- NAVBAR VARIANTS --------------------------- */
function NavBar({ variant }) {
  const links = ["Home", "Products", "Pricing", "About", "Contact"];
  const styles = getVariant(variant);

  return (
    <nav
      className={`flex items-center justify-between px-6 py-3 ${styles.base}`}
    >
      <span className="text-xl font-bold text-black">Brand</span>
      <ul className={`flex gap-6 ${styles.links}`}>
        {links.map((l) => (
          <li
            key={l}
            className={`cursor-pointer transition-colors ${styles.link}`}
          >
            {l}
          </li>
        ))}
      </ul>
      <button className={styles.cta}>Sign In</button>
    </nav>
  );
}

function getVariant(variant) {
  switch (variant) {
    case "depth":
      return {
        base: "rounded-2xl bg-white shadow-lg",
        links: "text-sm font-medium",
        link: "hover:text-indigo-600 text-black",
        cta: "px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700",
      };
    case "minimal":
      return {
        base: "border-b border-neutral-200 bg-white",
        links: "text-sm",
        link: "hover:text-indigo-600 text-black",
        cta: "px-4 py-2 rounded-md border border-neutral-300 text-black hover:bg-neutral-100",
      };
    case "pill":
      return {
        base: "rounded-full bg-neutral-100 px-8",
        links: "text-sm font-medium",
        link: "px-3 py-1 rounded-full hover:bg-indigo-600 hover:text-white text-black",
        cta: "px-4 py-1.5 rounded-full bg-black text-white hover:bg-indigo-600",
      };
    case "bold":
      return {
        base: "rounded-2xl bg-indigo-600 text-white shadow-xl",
        links: "text-sm font-semibold",
        link: "hover:text-yellow-300",
        cta: "px-4 py-2 rounded-lg bg-white text-indigo-600 font-bold hover:bg-yellow-300 hover:text-black",
      };
    default:
      return getVariant("depth");
  }
}

/* ------------------------- CODEPEN-LIKE VIEWER ------------------------- */
function NavbarCodeShowcase() {
  const [activeTab, setActiveTab] = useState("react");

  const codeBlocks = useMemo(
    () => ({
      react: REACT_CODE,
      css: CSS_CODE,
      html: HTML_CODE,
      js: JS_CODE,
    }),
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
        <h2 className="text-white font-mono text-sm md:text-base">
          ELITNITE • Premium Navbars
        </h2>
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

      {/* code block */}
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
        <span>✨ Depth, minimal, pill, bold styles</span>
        <span className="hidden sm:block">⌨️ Responsive • Hover states</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Simple NavBar component with variants
function NavBar({ variant }) {
  const links = ["Home", "Products", "Pricing", "About", "Contact"];
  return (
    <nav className="flex items-center justify-between px-6 py-3">
      <span className="font-bold">Brand</span>
      <ul className="flex gap-6 text-sm">
        {links.map(l => <li key={l}>{l}</li>)}
      </ul>
      <button className="px-4 py-2 rounded bg-indigo-600 text-white">
        Sign In
      </button>
    </nav>
  );
}`;

const CSS_CODE = `/* Tailwind utility styles (examples) */
.navbar-depth {
  @apply rounded-2xl bg-white shadow-lg;
}
.navbar-minimal {
  @apply border-b border-neutral-200 bg-white;
}
.navbar-pill {
  @apply rounded-full bg-neutral-100 px-8;
}
.navbar-bold {
  @apply rounded-2xl bg-indigo-600 text-white shadow-xl;
}`;

const HTML_CODE = `<!-- Structure -->
<nav class="navbar-depth">
  <span class="brand">Brand</span>
  <ul>
    <li>Home</li>
    <li>Products</li>
    <li>Pricing</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
  <button>Sign In</button>
</nav>`;

const JS_CODE = `// Example toggle for mobile menu
const btn = document.querySelector(".mobile-toggle");
btn.addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("hidden");
});`;

/* --------------------------- Syntax Highlight --------------------------- */
function syntaxHighlight(code, language) {
  const patterns = {
    react: [
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(import|export|from|const|let|var|function|class|return)\b/g, class: "text-purple-400" },
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: "text-green-400" },
      { pattern: /<[^>]+>/g, class: "text-rose-400" },
    ],
    css: [
      { pattern: /\.[\w-]+/g, class: "text-yellow-400" },
      { pattern: /@apply/g, class: "text-purple-400" },
      { pattern: /bg-[\w-]+|text-[\w-]+|rounded-[\w-]+/g, class: "text-blue-400" },
    ],
    html: [
      { pattern: /<[^>]+>/g, class: "text-rose-400" },
      { pattern: /class="[^"]*"/g, class: "text-green-400" },
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: "text-neutral-500" },
      { pattern: /\b(const|let|var|if|else|function|return)\b/g, class: "text-purple-400" },
      { pattern: /'[^']*'|"[^"]*"/g, class: "text-green-400" },
      { pattern: /document|querySelector|classList|toggle/g, class: "text-cyan-400" },
    ],
  };

  let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  (patterns[language] || []).forEach(({ pattern, class: cls }) => {
    highlighted = highlighted.replace(pattern, (m) => `<span class="${cls}">${m}</span>`);
  });
  return highlighted;
}
