export const metadata = {
  title: 'Researifier — AI Knowledge Maps',
  description: 'A compact mini-SaaS that turns any topic into an expandable, practical knowledge map.',
};

// NOTE: This is a Next.js page component. Do NOT call ReactDOM.createRoot() anywhere.
// Next.js will mount this page for you. If you had a custom client entry that used createRoot,
// remove it. If you need a standalone SPA entry, see the commented snippet at the very bottom.

function UseCases() {
  return (
    <div className="mt-6 flex flex-wrap gap-2 text-[12px] text-slate-400">
      <span className="px-2 py-1 rounded-full border border-slate-700 bg-[#0b1733]">Researchers</span>
      <span className="px-2 py-1 rounded-full border border-slate-700 bg-[#0b1733]">Students</span>
      <span className="px-2 py-1 rounded-full border border-slate-700 bg-[#0b1733]">Writers</span>
      <span className="px-2 py-1 rounded-full border border-slate-700 bg-[#0b1733]">Product Teams</span>
      <span className="px-2 py-1 rounded-full border border-slate-700 bg-[#0b1733]">Educators</span>
    </div>
  );
}

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#040a18] text-slate-100 relative overflow-hidden selection:bg-cyan-500/20 selection:text-slate-100">
      {/* BG FX */}
      <Noise />
      <Glow />

      {/* Top bar */}
      <header className="relative z-10 border-b border-slate-800/60 bg-gradient-to-b from-[#06102a]/70 to-transparent backdrop-blur-sm">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm opacity-90">
            <a href="#features" className="hover:opacity-100">Features</a>
            <a href="#how" className="hover:opacity-100">How it works</a>
            <a href="#pricing" className="hover:opacity-100">Pricing</a>
            <a href="#faq" className="hover:opacity-100">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/knowledgemap" className="btn-primary">Open App</a>
          </div>
        </div>
      </header>

      {/* Announcement */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 pt-4">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-[12px] px-3 py-1 rounded-full border border-cyan-400/40 text-cyan-300/90 hover:text-cyan-200 hover:border-cyan-300/60 transition"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Mini SaaS — early access pricing live
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 pt-10 md:pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Research faster with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
                  AI knowledge maps
                </span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-slate-300/90">
                Researifier turns any topic into an expandable, steerable graph of <strong>practical guides</strong> —
                not fluffy summaries. Branch ideas, set direction, and save multiple canvases as projects.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="/knowledgemap" className="btn-primary text-base">Start Mapping</a>
                <a href="#features" className="btn-ghost text-base">See Features</a>
              </div>
              <p className="mt-3 text-[12px] text-slate-400">
                Runs in your browser • Local topics • BYO OpenAI key
              </p>
              <UseCases />
            </div>

            {/* App mock — wider, edgy */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0a1633] to-[#09142b] p-4 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]">
              <div className="h-[420px] md:h-[520px] rounded-2xl border border-slate-800/80 bg-[#0a1329] relative overflow-hidden">
                <GridDots />
                <MockToolbar />
                <MockCanvas />
                <div className="absolute bottom-3 right-3 text-[10px] px-2 py-1 rounded bg-blue-700/20 border border-blue-600/40">
                  preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 pb-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-200/90">Why Researifier</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <Card title="Obsidian-style canvas" text="Drop a topic, expand nodes, and visualize connections in a clean, compact UI." />
            <Card title="Practical, applied output" text="Every node can generate checklists, steps, and examples you can use today." />
            <Card title="Topics as projects" text="Create multiple canvases, save locally, and switch with one click." />
            <Card title="Steer the AI" text="Ask for prerequisites, pitfalls, playbooks, or advanced angles per node." />
            <Card title="VS Code-style dock" text="A bottom panel with tabs: Practical Guide, All Nodes, Topics." />
            <Card title="Zero setup" text="No signup needed. Works offline for browsing saved canvases; AI needs your key." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 py-10">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#0a1633] to-[#0a1124] p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Step n="1" title="Start a topic" text="Name it. A center node appears on a fresh canvas." />
              <Step n="2" title="Expand with intent" text="Double-click a node, add a hint, choose a mode, and expand." />
              <Step n="3" title="Save & switch" text="Store canvases locally. Hop between topics like projects." />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 py-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-200/90">Simple pricing</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <Pricing name="Hobby" price="$0" note="Local topics • BYO key" cta="Use Free" />
            <Pricing name="Pro" price="$7/mo" note="Themes • Export packs • Priority features" highlight cta="Get Pro (soon)" />
            <Pricing name="Team" price="Contact" note="Shared canvases • SSO • Admin" cta="Talk to us" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 py-12">
          <h2 className="text-xl font-semibold mb-4 text-slate-200/90">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Faq q="Do I need an account?" a="No. You can start immediately. Saving topics uses your browser storage. For AI expansion, you’ll need your OpenAI API key in the app settings." />
            <Faq q="Is my data private?" a="Yes. Topics are stored locally in your browser. Nothing is uploaded unless you export or connect cloud storage later." />
            <Faq q="Can I use other models?" a="The app is designed to be model-agnostic. OpenAI is wired now; adding Claude/Mistral is on the roadmap." />
            <Faq q="Will it generate citations?" a="We’re exploring a search tab to pull sources and citations alongside the Practical Guide." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/70 py-8">
        <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm opacity-80">© {new Date().getFullYear()} Researifier</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/knowledgemap" className="btn-primary">Open App</a>
            <a href="mailto:hello@researifier.app" className="btn-ghost">Contact</a>
          </div>
        </div>
      </footer>

      {/* Inject shared button styles */}
      <StyleInjector />
    </main>
  );
}

/* ---------- Pieces ---------- */

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center font-black text-[#050b1a]">R</span>
      <span className="font-semibold tracking-tight">Researifier</span>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-[#0a1633] to-[#0a1122] p-5 hover:border-cyan-500/40 transition">
      <div className="text-sm font-semibold mb-1">{title}</div>
      <p className="text-sm text-slate-300/90">{text}</p>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0a142e] p-5">
      <div className="text-xs mb-1 opacity-70">Step {n}</div>
      <div className="text-sm font-semibold mb-1">{title}</div>
      <p className="text-sm text-slate-300/90">{text}</p>
    </div>
  );
}

function Pricing({ name, price, note, cta, highlight }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight ? 'border-cyan-500/60 bg-[#0b1733]' : 'border-slate-800 bg-gradient-to-b from-[#0a1633] to-[#0a1122]'}`}>
      <div className="text-sm font-semibold">{name}</div>
      <div className="mt-2 text-3xl font-extrabold">{price}</div>
      <div className="mt-1 text-sm text-slate-300/90">{note}</div>
      <button
        className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold ${
          highlight
            ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-[#050b1a]'
            : 'border border-slate-700'
        }`}
        disabled={!highlight}
        title={highlight ? '' : 'Coming soon'}
      >
        {cta}
      </button>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <details className="rounded-xl border border-slate-800 bg-[#09142b] p-4 open:border-cyan-500/40">
      <summary className="cursor-pointer text-sm font-semibold">{q}</summary>
      <p className="mt-2 text-sm text-slate-300/90">{a}</p>
    </details>
  );
}

/* ---------- Visual helpers ---------- */

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-40 -left-24 h-96 w-96 rounded-full blur-3xl opacity-40"
        style={{background:'radial-gradient(closest-side,#0ea5e9,#040a18)'}}/>
      <div className="absolute -bottom-56 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30"
        style={{background:'radial-gradient(closest-side,#1d4ed8,#040a18)'}}/>
    </div>
  );
}

function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light -z-10"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 40 40%27%3E%3Cpath fill=%27%23ffffff%27 fill-opacity=%270.5%27 d=%27M0 0h2v2H0zM20 10h2v2h-2zM30 30h2v2h-2zM10 25h2v2h-2zM35 2h2v2h-2z%27/%3E%3C/svg%3E")',
      }}
    />
  );
}

function GridDots() {
  return (
    <div
      className="absolute inset-0 opacity-60"
      style={{ backgroundImage: 'radial-gradient(#0ea5e910 1px, transparent 1px)', backgroundSize: '14px 14px' }}
    />
  );
}

function MockToolbar() {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center gap-2">
      <div className="h-8 w-44 rounded-lg bg-gradient-to-r from-cyan-500/40 to-blue-600/40" />
      <div className="h-8 w-20 rounded-lg border border-slate-700/60 bg-[#0a142e]" />
      <div className="h-8 w-28 rounded-lg border border-slate-700/60 bg-[#0a142e]" />
      <div className="ml-auto h-8 w-24 rounded-lg border border-slate-700/60 bg-[#0a142e]" />
    </div>
  );
}

function MockCanvas() {
  return (
    <div className="absolute inset-0 pt-16 px-4">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-700/60 bg-gradient-to-b from-[#111b3a] to-[#0c1630] p-3"
          >
            <div className="h-3 w-2/3 rounded bg-slate-400/30" />
            <div className="mt-2 h-2 w-11/12 rounded bg-slate-500/20" />
            <div className="mt-1 h-2 w-9/12 rounded bg-slate-500/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Shared button styles ---------- */
const style = `
.btn-primary{
  @apply rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2.5 text-[#050b1a] font-semibold shadow-lg shadow-blue-900/30 hover:brightness-110;
}
.btn-ghost{
  @apply rounded-lg border border-slate-700 px-4 py-2.5 hover:border-slate-500;
}
`;
/* inject styles (keeps file self-contained) */
export function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: style }} />;
}

/* ---------------- Optional: Standalone SPA entry (NOT for Next.js) ----------------
   If you ever run this as a plain React app, create src/main.jsx with:

   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import Landing from './app/page';

   const container = document.getElementById('root');
   if (!container._reactRoot) {
     container._reactRoot = ReactDOM.createRoot(container);
   }
   container._reactRoot.render(<Landing />);

   This ensures createRoot() is only called once per container.
------------------------------------------------------------------------------- */