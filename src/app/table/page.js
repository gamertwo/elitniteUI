// app/page.js
"use client";

import { useMemo, useState } from "react";

/* ========================================================================== */
/*                               TABLES & DATA GRIDS                          */
/* ========================================================================== */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        {/* <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-neutral-900 ml-95">
          Premium <span className="text-indigo-600">Tables</span>
        </h1> */}

        {/* PREVIEW GRID */}
        <div className="mx-auto w-full md:w-[88%] lg:w-[78%] grid gap-10 md:grid-cols-2 mb-20">
          <DataGrid variant="striped" />
          <DataGrid variant="minimal" />
          <DataGrid variant="bordered" />
          <DataGrid variant="cards" />
          <DataGrid variant="sticky" />
          <DataGrid variant="interactive" />
        </div>

        {/* CODEPEN STYLE VIEWER */}
        <div className="relative">
          <div className="sticky top-[calc(100vh-360px)]">
            <TablesCodeShowcase />
          </div>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------- DATA GRID ------------------------------- */
const SAMPLE_ROWS = [
  { id: "INV-00124", customer: "Default User", email: "user@example.com", status: "Paid", amount: 1840, date: "2025-08-01" },
  { id: "INV-00125", customer: "Jane Cooper", email: "jane@co.by", status: "Pending", amount: 620, date: "2025-08-12" },
  { id: "INV-00126", customer: "Wade Warren", email: "wade@w.io", status: "Failed", amount: 210, date: "2025-08-15" },
  { id: "INV-00127", customer: "Cody Fisher", email: "cody@fish.dev", status: "Paid", amount: 990, date: "2025-08-20" },
  { id: "INV-00128", customer: "Eleanor Pena", email: "eleanor@pena.co", status: "Refunded", amount: 132, date: "2025-08-22" },
  { id: "INV-00129", customer: "Devon Lane", email: "devon@lane.ai", status: "Pending", amount: 440, date: "2025-08-30" },
];

function DataGrid({ variant = "striped" }) {
  const v = variants(variant);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const rows = useMemo(() => {
    let r = SAMPLE_ROWS.filter(
      (x) =>
        x.id.toLowerCase().includes(query.toLowerCase()) ||
        x.customer.toLowerCase().includes(query.toLowerCase()) ||
        x.email.toLowerCase().includes(query.toLowerCase())
    );
    r.sort((a, b) => {
      const k = sort.key;
      const av = a[k];
      const bv = b[k];
      if (typeof av === "number" && typeof bv === "number") {
        return sort.dir === "asc" ? av - bv : bv - av;
      }
      if (k === "date") {
        return sort.dir === "asc"
          ? new Date(av) - new Date(bv)
          : new Date(bv) - new Date(av);
      }
      return sort.dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return r;
  }, [query, sort]);

  const setSortKey = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  return (
    <section className={v.wrapper}>
      {/* Header / toolbar */}
      <div className={v.toolbar}>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-neutral-900">Invoices</h3>
          <span className="text-xs text-neutral-500">{rows.length} results</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={v.searchWrap}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none">
              <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              className={v.searchInput}
              placeholder="Search invoices…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className={v.primaryBtn}>New</button>
        </div>
      </div>

      {/* Table / Cards */}
      {variant === "cards" ? (
        <div className="grid sm:grid-cols-2 gap-3 p-3">
          {rows.map((r) => (
            <article key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-neutral-900">{r.id}</div>
                <StatusPill status={r.status} />
              </div>
              <div className="mt-2 text-sm text-neutral-700">{r.customer}</div>
              <div className="text-xs text-neutral-500">{r.email}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-medium text-neutral-900">${r.amount.toLocaleString()}</div>
                <div className="text-xs text-neutral-500">{r.date}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs">View</button>
                <button className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs">Refund</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={v.scroller}>
          <table className={v.table}>
            <thead className={v.thead}>
              <tr>
                <Th onClick={() => setSortKey("id")} active={sort.key === "id"} dir={sort.dir}>
                  Invoice
                </Th>
                <Th onClick={() => setSortKey("customer")} active={sort.key === "customer"} dir={sort.dir}>
                  Customer
                </Th>
                <Th className="hidden md:table-cell" onClick={() => setSortKey("email")} active={sort.key === "email"} dir={sort.dir}>
                  Email
                </Th>
                <Th onClick={() => setSortKey("status")} active={sort.key === "status"} dir={sort.dir}>
                  Status
                </Th>
                <Th onClick={() => setSortKey("amount")} active={sort.key === "amount"} dir={sort.dir} align="right">
                  Amount
                </Th>
                <Th onClick={() => setSortKey("date")} active={sort.key === "date"} dir={sort.dir} align="right">
                  Date
                </Th>
                {variant === "interactive" && <Th align="center">Actions</Th>}
              </tr>
            </thead>
            <tbody className={v.tbody}>
              {rows.map((r) => (
                <tr key={r.id} className={v.tr}>
                  <td className={v.td}>{r.id}</td>
                  <td className={v.td}>
                    <div className="flex items-center gap-2 min-w-0">
                      <DefaultAvatar />
                      <div className="min-w-0">
                        <div className="truncate text-sm text-neutral-900">{r.customer}</div>
                        <div className="truncate text-xs text-neutral-500 md:hidden">{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`${v.td} hidden md:table-cell`}>{r.email}</td>
                  <td className={v.td}><StatusPill status={r.status} /></td>
                  <td className={`${v.td} text-right font-medium text-neutral-900`}>${r.amount.toLocaleString()}</td>
                  <td className={`${v.td} text-right text-neutral-500`}>{r.date}</td>
                  {variant === "interactive" && (
                    <td className={`${v.td} text-center`}>
                      <div className="inline-flex gap-2">
                        <button className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs">View</button>
                        <button className="px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs">Refund</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ------------------------------- SUBCOMPONENTS ---------------------------- */
function Th({ children, onClick, active, dir, align = "left", className = "" }) {
  return (
    <th
      onClick={onClick}
      className={`text-[11px] uppercase tracking-wide text-neutral-500 font-medium select-none whitespace-nowrap px-3 py-2.5 ${className} ${
        onClick ? "cursor-pointer hover:text-neutral-900" : ""
      } ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {onClick && (
          <svg className={`w-3 h-3 ${active ? "opacity-100" : "opacity-40"}`} viewBox="0 0 20 20" fill="none">
            {dir === "asc" ? (
              <path d="M10 6l-4 6h8l-4-6z" fill="currentColor" />
            ) : (
              <path d="M10 14l4-6H6l4 6z" fill="currentColor" />
            )}
          </svg>
        )}
      </span>
    </th>
  );
}

function StatusPill({ status }) {
  const map = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Failed: "bg-rose-50 text-rose-700 ring-rose-200",
    Refunded: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full ring-1 ${map[status] || "bg-neutral-100 text-neutral-700 ring-neutral-200"}`}>
      {status}
    </span>
  );
}

function DefaultAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 text-[10px] font-bold">
      U
    </div>
  );
}

/* -------------------------------- VARIANTS -------------------------------- */
function variants(variant) {
  switch (variant) {
    case "minimal":
      return {
        wrapper: "rounded-2xl border border-neutral-200 bg-white overflow-hidden",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm",
        thead: "",
        tbody: "",
        tr: "hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
      };
    case "bordered":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden border border-neutral-200",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm border-separate border-spacing-0",
        thead: "bg-neutral-50",
        tbody: "",
        tr: "hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700 border-t border-neutral-200",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition",
      };
    case "cards":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden border border-neutral-200",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "",
        table: "",
        thead: "",
        tbody: "",
        tr: "",
        td: "",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
      };
    case "sticky":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden border border-neutral-200",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-auto max-h-80",
        table: "min-w-full text-sm",
        thead: "sticky top-0 bg-white/90 backdrop-blur border-b border-neutral-200",
        tbody: "",
        tr: "hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
      };
    case "interactive":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.08)] border border-neutral-100",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm",
        thead: "",
        tbody: "",
        tr: "hover:bg-neutral-50 cursor-pointer",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white ring-1 ring-neutral-200 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow",
      };
    default: // striped
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.08)] border border-neutral-100",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm",
        thead: "",
        tbody: "",
        tr: "odd:bg-neutral-50/60 hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition",
      };
  }
}

/* ========================================================================== */
/*                         CODEPEN-LIKE CODE VIEWER                           */
/* ========================================================================== */
function TablesCodeShowcase() {
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
        <h2 className="text-white font-mono text-sm md:text-base">ELITNITE • Table Components</h2>
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
        <span>✨ Striped • Minimal • Bordered • Cards • Sticky • Interactive</span>
        <span className="hidden sm:block">🔎 Search • ↕ Sort • 🏷️ Status</span>
      </div>
    </div>
  );
}

/* ------------------------------ CODE STRINGS ----------------------------- */
const REACT_CODE = `// Reusable DataGrid with variants (striped, minimal, bordered, cards, sticky, interactive)
export function DataGrid({ variant = "striped" }) {
  const v = variants(variant);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const rows = useMemo(() => {
    let r = SAMPLE_ROWS.filter(
      (x) =>
        x.id.toLowerCase().includes(query.toLowerCase()) ||
        x.customer.toLowerCase().includes(query.toLowerCase()) ||
        x.email.toLowerCase().includes(query.toLowerCase())
    );
    r.sort((a, b) => {
      const k = sort.key;
      const av = a[k];
      const bv = b[k];
      if (typeof av === "number" && typeof bv === "number") {
        return sort.dir === "asc" ? av - bv : bv - av;
      }
      if (k === "date") {
        return sort.dir === "asc"
          ? new Date(av) - new Date(bv)
          : new Date(bv) - new Date(av);
      }
      return sort.dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return r;
  }, [query, sort]);

  const setSortKey = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  return (
    <section className={v.wrapper}>
      <div className={v.toolbar}>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-neutral-900">Invoices</h3>
          <span className="text-xs text-neutral-500">{rows.length} results</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={v.searchWrap}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none">
              <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              className={v.searchInput}
              placeholder="Search invoices…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className={v.primaryBtn}>New</button>
        </div>
      </div>

      {variant === "cards" ? (
        <div className="grid sm:grid-cols-2 gap-3 p-3">
          {rows.map((r) => (
            <article key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-neutral-900">{r.id}</div>
                <StatusPill status={r.status} />
              </div>
              <div className="mt-2 text-sm text-neutral-700">{r.customer}</div>
              <div className="text-xs text-neutral-500">{r.email}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-medium text-neutral-900">\${r.amount.toLocaleString()}</div>
                <div className="text-xs text-neutral-500">{r.date}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs">View</button>
                <button className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs">Refund</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={v.scroller}>
          <table className={v.table}>
            <thead className={v.thead}>
              <tr>
                <Th onClick={() => setSortKey("id")} active={sort.key === "id"} dir={sort.dir}>Invoice</Th>
                <Th onClick={() => setSortKey("customer")} active={sort.key === "customer"} dir={sort.dir}>Customer</Th>
                <Th className="hidden md:table-cell" onClick={() => setSortKey("email")} active={sort.key === "email"} dir={sort.dir}>Email</Th>
                <Th onClick={() => setSortKey("status")} active={sort.key === "status"} dir={sort.dir}>Status</Th>
                <Th onClick={() => setSortKey("amount")} active={sort.key === "amount"} dir={sort.dir} align="right">Amount</Th>
                <Th onClick={() => setSortKey("date")} active={sort.key === "date"} dir={sort.dir} align="right">Date</Th>
                {variant === "interactive" && <Th align="center">Actions</Th>}
              </tr>
            </thead>
            <tbody className={v.tbody}>
              {rows.map((r) => (
                <tr key={r.id} className={v.tr}>
                  <td className={v.td}>{r.id}</td>
                  <td className={v.td}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-neutral-200" />
                      <div className="min-w-0">
                        <div className="truncate text-sm text-neutral-900">{r.customer}</div>
                        <div className="truncate text-xs text-neutral-500 md:hidden">{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={\`\${v.td} hidden md:table-cell\`}>{r.email}</td>
                  <td className={v.td}><StatusPill status={r.status} /></td>
                  <td className={\`\${v.td} text-right font-medium text-neutral-900\`}>\${r.amount.toLocaleString()}</td>
                  <td className={\`\${v.td} text-right text-neutral-500\`}>{r.date}</td>
                  {variant === "interactive" && (
                    <td className={\`\${v.td} text-center\`}>
                      <div className="inline-flex gap-2">
                        <button className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs">View</button>
                        <button className="px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs">Refund</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function variants(variant) {
  switch (variant) {
    case "minimal":
      return {
        wrapper: "rounded-2xl border border-neutral-200 bg-white overflow-hidden",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm",
        thead: "",
        tbody: "",
        tr: "hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white",
      };
    case "bordered":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden border border-neutral-200",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm border-separate border-spacing-0",
        thead: "bg-neutral-50",
        tbody: "",
        tr: "hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700 border-t border-neutral-200",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-indigo-600 text-white",
      };
    case "cards":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden border border-neutral-200",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "",
        table: "",
        thead: "",
        tbody: "",
        tr: "",
        td: "",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white",
      };
    case "sticky":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden border border-neutral-200",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-auto max-h-80",
        table: "min-w-full text-sm",
        thead: "sticky top-0 bg-white/90 backdrop-blur border-b border-neutral-200",
        tbody: "",
        tr: "hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white",
      };
    case "interactive":
      return {
        wrapper: "rounded-2xl bg-white overflow-hidden shadow border border-neutral-100",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm",
        thead: "",
        tbody: "",
        tr: "hover:bg-neutral-50 cursor-pointer",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white ring-1 ring-neutral-200 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-indigo-600 text-white",
      };
    default: // striped
      return {
        wrapper: "rounded-2xl bg-white shadow border border-neutral-100 overflow-hidden",
        toolbar: "px-4 py-3 border-b border-neutral-200 flex items-center justify-between",
        scroller: "overflow-x-auto",
        table: "min-w-full text-sm",
        thead: "",
        tbody: "",
        tr: "odd:bg-neutral-50/60 hover:bg-neutral-50",
        td: "px-3 py-2 align-middle text-neutral-700",
        searchWrap: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500",
        searchInput: "bg-transparent outline-none text-sm placeholder-neutral-500 w-40",
        primaryBtn: "px-3.5 py-2 rounded-lg bg-neutral-900 text-white",
      };
  }
}`;

const CSS_CODE = `/* Tailwind utility notes for Tables */
.table-striped { @apply min-w-full text-sm; }
.table-minimal  { @apply min-w-full text-sm; }
.table-bordered { @apply min-w-full text-sm border-separate border-spacing-0; }
.td-base       { @apply px-3 py-2 align-middle text-neutral-700; }
.th-base       { @apply text-[11px] uppercase tracking-wide text-neutral-500; }
.toolbar       { @apply px-4 py-3 border-b border-neutral-200 flex justify-between; }

.pill          { @apply px-2 py-1 text-xs rounded-full ring-1; }
.pill-paid     { @apply bg-emerald-50 text-emerald-700 ring-emerald-200; }
.pill-pending  { @apply bg-amber-50 text-amber-700 ring-amber-200; }
.pill-failed   { @apply bg-rose-50 text-rose-700 ring-rose-200; }
.pill-refunded { @apply bg-indigo-50 text-indigo-700 ring-indigo-200; }`;

const HTML_CODE = `<!-- Static table markup -->
<section class="rounded-2xl bg-white shadow border border-neutral-100 overflow-hidden">
  <div class="toolbar">
    <div class="flex items-center gap-2">
      <h3 class="text-sm font-semibold text-neutral-900">Invoices</h3>
      <span class="text-xs text-neutral-500">6 results</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500">
        <svg class="w-4 h-4"></svg>
        <input class="bg-transparent outline-none text-sm placeholder-neutral-500 w-40" placeholder="Search invoices…" />
      </div>
      <button class="px-3.5 py-2 rounded-lg bg-neutral-900 text-white">New</button>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="table-striped">
      <thead>
        <tr>
          <th class="th-base">Invoice</th>
          <th class="th-base">Customer</th>
          <th class="th-base">Email</th>
          <th class="th-base">Status</th>
          <th class="th-base text-right">Amount</th>
          <th class="th-base text-right">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr class="odd:bg-neutral-50/60 hover:bg-neutral-50">
          <td class="td-base">INV-00124</td>
          <td class="td-base">Default User</td>
          <td class="td-base">user@example.com</td>
          <td class="td-base"><span class="pill pill-paid">Paid</span></td>
          <td class="td-base text-right">$1,840</td>
          <td class="td-base text-right">2025-08-01</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>`;

const JS_CODE = `// Example: row click + simple filter
document.querySelectorAll('tbody tr').forEach((tr) => {
  tr.addEventListener('click', () => tr.classList.toggle('ring-2'));
});

const input = document.querySelector('input[placeholder="Search invoices…"]');
if (input) {
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach((tr) => {
      const text = tr.innerText.toLowerCase();
      tr.style.display = text.includes(q) ? '' : 'none';
    });
  });
});`;

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
      { pattern: /\b(class|function|const|let|var|if|else|return|document|querySelector(All)?|addEventListener|toggle|forEach)\b/g, class: "text-purple-400" },
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
