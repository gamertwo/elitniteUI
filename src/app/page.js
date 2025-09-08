// app/page.js
"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  // Configuration object for easy page management
  const pages = [
    {
      title: 'Badges',
      href: '/badges',
      // description: 'Learn more about our company and mission'
    },
    {
      title: 'Buttons',
      href: '/buttons',
      // description: 'Discover what we can do for you'
    },
    {
      title: 'Card',
      href: '/card',
      // description: 'Check out our latest projects'
    },
    {
      title: 'Dropdown',
      href: '/dropdown',
      // description: 'Get in touch with our team'
    },
    {
      title: 'Table',
      href: '/table',
      // description: 'Read our latest insights and updates'
    },
    {
      title: 'Tooltips',
      href: '/tooltips',
      // description: 'Flexible plans for every budget'
    },
    {
      title: 'Navbar',
      href: "/nav",
    },
     {
      title: 'Tabs',
      href: "/tabs",
    },
     {
      title: 'Card 2nd',
      href: "/card-two",
    }
  ];

  const [query, setQuery] = useState("");

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(query.toLowerCase()) ||
    page.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100/70">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pt-10 md:pt-14">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-4">
           <span className="text-indigo-600">Elitnite</span> UI
          </h1>
          <p className="text-lg text-neutral-600">
            Navigate through our different sections to discover what we have to offer
          </p>
        </div>

        {/* Navigation Section */}
        <section className="rounded-2xl bg-white overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.08)] border border-neutral-100">
          
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-900">Pages</h3>
              <span className="text-xs text-neutral-500">{filteredPages.length} available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none">
                  <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input
                  className="bg-transparent outline-none text-sm placeholder-neutral-500 w-40"
                  placeholder="Search pages…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button className="px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition">
                New
              </button>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
            {filteredPages.map((page, index) => (
              <Link 
                key={index} 
                href={page.href}
                className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    {page.title}
                  </div>
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs text-neutral-500">
                  {page.description}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-neutral-400">
                    {page.href}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Active
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </section>

     

        {/* Footer */}
        <footer className="mt-16 pb-8">
          <div className="text-center">
            <p className="text-neutral-500 text-sm">
              © 2024 My Next.js App. Built with Next.js 14.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}