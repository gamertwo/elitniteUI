"use client";

import { useMemo, useState } from "react";
import MagicBento from "./MagicBento";
import "./MagicBento.css"; // make sure the CSS exists

export default function ElitnitePage() {
  const [showCode, setShowCode] = useState(true);

  // This is the code we’ll display in the colorful block
  const usageCode = useMemo(
    () => `import MagicBento from './MagicBento'

<MagicBento 
  textAutoHide={true}
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={true}
  enableMagnetism={true}
  clickEffect={true}
  spotlightRadius={300}
  particleCount={12}
  glowColor="132, 0, 255"
/>`,
    []
  );

  return (
    <main className="page">
      {/* Header / Hero */}
      <section className="hero container">
        <div className="badge">Elitnite</div>
        <h1 className="title">Experience. Automate. Scale.</h1>
        <p className="subtitle">
          Elitnite helps teams launch beautiful data-driven experiences with real-time
          insights, seamless collaboration, and enterprise-grade security.
        </p>
      </section>

      {/* Live Output */}
      <section className="preview container">
        <div className="section-head">
          <h2>Live Preview</h2>
          <div className="controls">
            <button className="btn" onClick={() => setShowCode((s) => !s)}>
              {showCode ? "Hide code" : "Show code"}
            </button>
          </div>
        </div>

        {/* Your interactive component */}
        <div className="preview-surface">
          <MagicBento
            textAutoHide
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
            clickEffect
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        </div>
      </section>

      {/* Code View */}
      {showCode && (
        <section className="code container">
          <div className="section-head">
            <h2>Code View</h2>
            <button
              className="btn"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(usageCode);
                } catch {}
              }}
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>

          <div className="code-wrap">
            {/* gradient frame */}
            <div className="code-frame">
              <pre className="code-scroll">
                <code className="code-syntax">{usageCode}</code>
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* Local styles for this page (colorful + clean) */}
      <style jsx>{`
        .page {
          min-height: 100svh;
          background:
            radial-gradient(1200px 600px at 10% 0%, rgba(132,0,255,0.15), transparent 60%),
            radial-gradient(900px 500px at 90% -10%, rgba(0,150,255,0.12), transparent 60%),
            #060010;
          color: #e9e7ee;
          padding-bottom: 80px;
        }

        .container {
          width: min(1200px, 92vw);
          margin: 0 auto;
        }

        .hero {
          padding: 64px 0 24px;
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(132,0,255,0.15);
          border: 1px solid rgba(132,0,255,0.35);
          color: #cbbaff;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .title {
          margin: 16px 0 8px;
          font-size: clamp(28px, 4vw, 48px);
          line-height: 1.1;
          font-weight: 800;
        }

        .subtitle {
          opacity: 0.75;
          max-width: 820px;
          margin: 0 auto;
          font-size: clamp(14px, 1.7vw, 18px);
        }

        .preview {
          margin-top: 32px;
        }

        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }

        .section-head h2 {
          margin: 0;
          font-size: 18px;
          opacity: 0.85;
        }

        .btn {
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          padding: 8px 12px;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.08s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); }
        .btn:active { transform: translateY(1px) scale(0.99); }

        .preview-surface {
          border-radius: 18px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 20px 60px rgba(0,0,0,0.45);
        }

        .code {
          margin-top: 24px;
        }

        .code-wrap {
          position: relative;
        }

        .code-frame {
          border-radius: 16px;
          padding: 2px;
          background:
            conic-gradient(from 180deg at 50% 50%,
              rgba(132,0,255,0.8),
              rgba(0,196,255,0.7),
              rgba(255,128,0,0.7),
              rgba(132,0,255,0.8));
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.12) inset,
            0 30px 80px rgba(0,0,0,0.5);
        }

        .code-scroll {
          margin: 0;
          padding: 18px 20px;
          border-radius: 14px;
          overflow: auto;
          max-height: 420px;
          background: linear-gradient(180deg, #0c0a16, #090712);
        }

        /* lightweight syntax “color” without a lib */
        .code-syntax {
          white-space: pre;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 13.5px;
          line-height: 1.6;
          color: #e7e3ff;
        }
        /* just a little flair using text-shadow */
        .code-syntax::selection { background: rgba(132,0,255,0.35); }
      `}</style>
    </main>
  );
}
