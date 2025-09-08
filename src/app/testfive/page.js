"use client"
import dynamic from 'next/dynamic';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Dynamically import the gallery (client-only)
const CircularGallery = dynamic(() => import('./CircularGallery'), {
  ssr: false,
});

// Put your CircularGallery.js code here as a string
// You can paste the shortened version or the full code if you want the whole thing shown
const gallerySource = `import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

// ... rest of your CircularGallery.js code ...
export default function CircularGallery({ items, bend = 3, textColor = "#ffffff", borderRadius = 0.05, font = "bold 30px Figtree", scrollSpeed = 2, scrollEase = 0.05, }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase });
    return () => { app.destroy(); };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);
  return <div className="circular-gallery" ref={containerRef} />;
}
`;

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Circular Gallery Demo</h1>

      {/* Gallery */}
      <div style={{ height: '600px', position: 'relative', marginBottom: 40 }}>
        <CircularGallery
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div>

      {/* Code block */}
      <h2 style={{ marginBottom: 12 }}>Source Code</h2>
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        wrapLines={true}
        showLineNumbers
      >
        {gallerySource}
      </SyntaxHighlighter>
    </main>
  );
}
