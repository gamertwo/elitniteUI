'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

/* ------------------- Demo code shown on the left ------------------- */
const CODE = `// Glassmorphism Product Card — parallax tilt + animated blobs
// - Frosted glass via backdrop-filter
// - Ambient gradient blobs (CSS keyframes)
// - Shimmer highlight on hover
// - Parallax tilt follows cursor
// - Interactive size/color selections

function lerp(a, b, t) { return a + (b - a) * t; }
`;

/* =============================== PAGE =============================== */

export default function Page() {
  return (
    <main style={styles.main}>
      <div style={styles.leftPane}>
        <Header label="Code" />
        <CodeTyper code={CODE} />
      </div>
      <div style={styles.rightPane}>
        <Header label="Output" />
        <ProductShowcase />
      </div>
      <NoiseOverlay />
    </main>
  );
}

/* ----------------------- Left: colorful code ----------------------- */

function CodeTyper({ code }) {
  const [cursor, setCursor] = useState(0);
  const src = useMemo(() => code.replace(/\t/g, '  '), [code]);

  useEffect(() => {
    let i = 0;
    let timer = 0;
    const tick = () => {
      i = (i + 1) % (src.length + 40);
      setCursor(Math.min(i, src.length));
      const ch = src[i] || ' ';
      const isBreak = ch === '\n' ? 40 : 0;
      timer = setTimeout(tick, 14 + Math.random() * 60 + isBreak);
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [src]);

  const visible = src.slice(0, cursor);

  const highlighted = useMemo(() => {
    const esc = visible.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>')
      .replace(/('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*")/g, '<span class="tok-string">$1</span>')
      .replace(/\b(\d+(\.\d+)?|\.\d+)\b/g, '<span class="tok-number">$1</span>')
      .replace(/\b(const|let|var|function|return|for|of|if|else|new|class|while|break|continue)\b/g, '<span class="tok-key">$1</span>')
      .replace(/\b(Math|Array|Object|String|Number|Date|Promise|requestAnimationFrame)\b/g, '<span class="tok-builtin">$1</span>')
      .replace(/(\b[a-zA-Z_]\w*)(\s*)\(/g, '<span class="tok-fn">$1</span>$2(');
  }, [visible]);

  const lines = useMemo(() => highlighted.split('\n'), [highlighted]);

  return (
    <div style={styles.codeWrap}>
      <div style={styles.gutter}>
        {lines.map((_, i) => (
          <div key={i} style={styles.lineNo}>{i + 1}</div>
        ))}
      </div>
      <pre style={styles.pre}>
        <code dangerouslySetInnerHTML={{ __html: lines.join('\n') }} />
        <span style={styles.caret} />
      </pre>
      <div style={styles.codeGlow} />
    </div>
  );
}

/* ---------------------- Right: Product Card ------------------------ */

function ProductShowcase() {
  return (
    <div style={styles.stage}>
      <AmbientBlobs />
      <GlassCard />
    </div>
  );
}

function AmbientBlobs() {
  // decorative animated gradient blobs behind the card
  return (
    <>
      <div style={{ ...styles.blob, ...styles.blobA }} />
      <div style={{ ...styles.blob, ...styles.blobB }} />
      <div style={{ ...styles.blob, ...styles.blobC }} />
    </>
  );
}

function GlassCard() {
  const cardRef = useRef(null);
  const rafRef = useRef(0);
  const target = useRef({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  const state = useRef({ rx: 0, ry: 0, glowX: 50, glowY: 50 });

  useEffect(() => {
    const el = cardRef.current;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0..1
      const y = (e.clientY - rect.top) / rect.height;  // 0..1
      target.current.ry = (x - 0.5) * 14; // rotateY
      target.current.rx = -(y - 0.5) * 10; // rotateX
      target.current.glowX = x * 100;
      target.current.glowY = y * 100;
    };
    const onLeave = () => {
      target.current.rx = 0;
      target.current.ry = 0;
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    const loop = () => {
      // smooth lerp to target
      state.current.rx = state.current.rx + (target.current.rx - state.current.rx) * 0.08;
      state.current.ry = state.current.ry + (target.current.ry - state.current.ry) * 0.08;
      state.current.glowX = state.current.glowX + (target.current.glowX - state.current.glowX) * 0.08;
      state.current.glowY = state.current.glowY + (target.current.glowY - state.current.glowY) * 0.08;

      el.style.setProperty('--rx', `${state.current.rx}deg`);
      el.style.setProperty('--ry', `${state.current.ry}deg`);
      el.style.setProperty('--glowX', `${state.current.glowX}%`);
      el.style.setProperty('--glowY', `${state.current.glowY}%`);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // sample product data
  const [color, setColor] = useState('Sky');
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);

  const colors = [
    { name: 'Sky', hex: '#92b4ff' },
    { name: 'Mint', hex: '#9ef4ce' },
    { name: 'Lilac', hex: '#caa9ff' },
  ];
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div ref={cardRef} style={styles.card}>
      <div style={styles.cardShine} />
      <div style={styles.cardBorderGlow} />

      <div style={styles.mediaWrap}>
        {/* placeholder product silhouette using SVG so we don’t need an image */}
        <svg width="100%" height="100%" viewBox="0 0 600 360" style={styles.svg}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
            </linearGradient>
          </defs>
          <g filter="url(#shadow)">
            <rect x="80" y="80" rx="22" ry="22" width="440" height="200" fill="url(#grad)" opacity="0.65" />
            <circle cx="220" cy="180" r="58" fill="rgba(255,255,255,0.8)" opacity="0.7" />
            <rect x="300" y="150" rx="10" width="180" height="60" fill="rgba(255,255,255,0.55)" />
          </g>
        </svg>
      </div>

      <div style={styles.meta}>
        <h3 style={styles.title}>Orbit Headphones</h3>
        <div style={styles.rating}>
          {'★★★★★'} <span style={{ opacity: 0.6, marginLeft: 8 }}>(1,284)</span>
        </div>

        <div style={styles.priceRow}>
          <div style={styles.price}>
            $199 <span style={styles.priceSub}>USD</span>
          </div>
          <div style={styles.badge}>Free Shipping</div>
        </div>

        <div style={styles.options}>
          <div style={styles.optGroup}>
            <div style={styles.optLabel}>Color</div>
            <div style={styles.swatches}>
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  style={{
                    ...styles.swatch,
                    background: c.hex,
                    outline: color === c.name ? '2px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                    boxShadow: color === c.name ? '0 0 20px rgba(255,255,255,0.25)' : 'none',
                  }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div style={styles.optGroup}>
            <div style={styles.optLabel}>Size</div>
            <div style={styles.sizes}>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    ...styles.sizeBtn,
                    borderColor: size === s ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                    background: size === s ? 'rgba(255,255,255,0.12)' : 'transparent',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.qtyRow}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={styles.qtyBtn}
              aria-label="Decrease quantity"
            >−</button>
            <div style={styles.qty}>{qty}</div>
            <button
              onClick={() => setQty((q) => Math.min(9, q + 1))}
              style={styles.qtyBtn}
              aria-label="Increase quantity"
            >+</button>
          </div>
        </div>

        <div style={styles.ctaRow}>
          <button style={styles.ctaPrimary}>
            Add to Cart
            <span style={styles.ctaShimmer} />
          </button>
          <button style={styles.ctaGhost}>Wishlist</button>
        </div>

        <div style={styles.note}>
          {color} · Size {size} · Ships in 24h
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- UI bits ----------------------------- */

function Header({ label }) {
  return (
    <div style={styles.header}>
      <div style={{ opacity: 0.75, letterSpacing: 1 }}>{label}</div>
      <div style={styles.dot} />
    </div>
  );
}

function NoiseOverlay() {
  return <div style={styles.noise} aria-hidden />;
}

/* ------------------------------ Styles ----------------------------- */

const styles = {
  main: {
    minHeight: '100svh',
    display: 'grid',
    gridTemplateColumns: 'minmax(340px, 1fr) minmax(340px, 1fr)',
    background: 'radial-gradient(60% 80% at 30% 20%, #0b0f19, #070a12 60%, #05070d 100%)',
    color: '#e8ecf1',
    overflow: 'hidden',
    position: 'relative',
  },
  leftPane: {
    position: 'relative',
    padding: '24px',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(6px)',
  },
  rightPane: { position: 'relative', padding: '24px' },
  header: {
    fontSize: 12, textTransform: 'uppercase', opacity: 0.6,
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  dot: { width: 6, height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.4)' },

  codeWrap: {
    position: 'relative',
    height: 'calc(100vh - 72px)',
    borderRadius: 12,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
    border: '1px solid rgba(255,255,255,0.12)',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.35) inset',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },
  gutter: {
    userSelect: 'none',
    width: 44,
    padding: '18px 8px',
    textAlign: 'right',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.08))',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 12.5,
    color: 'rgba(235,240,255,0.35)',
    lineHeight: 1.6,
  },
  lineNo: { padding: '0 6px' },
  pre: {
    margin: 0, padding: '18px 20px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere',
    color: '#eaf1ff', position: 'relative',
  },
  caret: {
    display: 'inline-block', width: 8, height: 16, marginLeft: 2, transform: 'translateY(3px)',
    background: 'linear-gradient(180deg, #fff, #cfe3ff)',
    boxShadow: '0 0 10px rgba(120,180,255,0.65)',
    animation: 'blink 1s steps(1) infinite',
  },
  codeGlow: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(120% 120% at 0% 0%, rgba(120,180,255,0.08), rgba(0,0,0,0) 60%)',
    mixBlendMode: 'screen',
  },

  /* stage + blobs */
  stage: {
    position: 'relative',
    height: 'calc(100vh - 72px)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
    overflow: 'hidden',
    display: 'grid',
    placeItems: 'center',
  },
  blob: {
    position: 'absolute',
    width: 320,
    height: 320,
    filter: 'blur(60px)',
    opacity: 0.35,
    borderRadius: '50%',
    mixBlendMode: 'screen',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  blobA: {
    background: 'radial-gradient(circle at 30% 30%, #8ac6ff, transparent 60%)',
    left: '-80px',
    top: '-80px',
    animationName: 'blobA',
    animationDuration: '28s',
  },
  blobB: {
    background: 'radial-gradient(circle at 60% 40%, #a6ffde, transparent 60%)',
    right: '-120px',
    top: '20%',
    animationName: 'blobB',
    animationDuration: '34s',
  },
  blobC: {
    background: 'radial-gradient(circle at 50% 50%, #d5b6ff, transparent 60%)',
    left: '20%',
    bottom: '-120px',
    animationName: 'blobC',
    animationDuration: '40s',
  },

  /* glass card */
 card: {
    position: 'relative',
    width: 400,              // was 560
    maxWidth: '88%',
    borderRadius: 20,
    padding: 16,             // was 18
    background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
    border: '1px solid rgba(255,255,255,0.28)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    transform: 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
    transition: 'transform 120ms ease-out',
    overflow: 'hidden',
  },
  cardShine: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(800px 400px at var(--glowX,50%) var(--glowY,50%), rgba(255,255,255,0.18), transparent 60%)',
    pointerEvents: 'none',
    mixBlendMode: 'soft-light',
  },
  cardBorderGlow: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background:
      'conic-gradient(from 0deg at var(--glowX,50%) var(--glowY,50%), rgba(135,190,255,0.25), rgba(180,255,220,0.25), rgba(210,180,255,0.25), rgba(135,190,255,0.25))',
    opacity: 0.12,
    maskImage: 'linear-gradient(#000, transparent 65%)',
  },
  mediaWrap: {
    height: 160,              // was 220
    borderRadius: 14,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))',
    border: '1px solid rgba(255,255,255,0.35)',
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
  },
  svg: { display: 'block', opacity: 0.9 },
  meta: { padding: 14 },
  title: { margin: '2px 0 6px', fontSize: 20, letterSpacing: 0.2 }, // slightly smaller font
  price: { fontSize: 24, fontWeight: 700 },                         // slightly smaller font  rating: { fontSize: 14, opacity: 0.9 },
  priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  priceSub: { fontSize: 12, opacity: 0.7, marginLeft: 6 },
  badge: {
    fontSize: 12, padding: '6px 10px', borderRadius: 999,
    background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.35)',
    backdropFilter: 'blur(6px)',
  },

  options: { display: 'grid', gap: 14, marginTop: 14 },
  optGroup: {},
  optLabel: { fontSize: 12, opacity: 0.8, marginBottom: 6 },
  swatches: { display: 'flex', gap: 10 },
  swatch: {
    width: 26, height: 26, borderRadius: 999, border: '1px solid rgba(255,255,255,0.6)',
    cursor: 'pointer',
  },
  sizes: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  sizeBtn: {
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#eaf1ff',
    cursor: 'pointer',
  },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.10)', cursor: 'pointer',
  },
  qty: { minWidth: 24, textAlign: 'center', fontWeight: 700 },

  ctaRow: { display: 'flex', gap: 10, marginTop: 14 },
  ctaPrimary: {
    position: 'relative',
    flex: 1,
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.55)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.65))',
    color: '#0b0f19',
    fontWeight: 700,
    cursor: 'pointer',
    overflow: 'hidden',
  },
  ctaShimmer: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.7), transparent 70%)',
    transform: 'translateX(-100%)',
    animation: 'shimmer 2.6s ease-in-out infinite',
  },
  ctaGhost: {
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.10)',
    color: '#eaf1ff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  note: { marginTop: 10, fontSize: 12, opacity: 0.8 },

  canvas: {
    width: '100%',
    height: 'calc(100vh - 72px)',
    display: 'block',
    borderRadius: 12,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.35) inset',
  },
  noise: {
    position: 'fixed', inset: 0,
    backgroundImage:
      'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%271%27 stitchTiles=%27stitch%27/></filter><rect width=%27100%%27 height=%27100%%27 filter=%27url(%23n)%27 opacity=%270.025%27/></svg>")',
    pointerEvents: 'none', mixBlendMode: 'soft-light',
  },
};

// inject keyframes + token colors once
if (typeof document !== 'undefined') {
  const id = 'page-styles';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes blink { 0%, 50% { opacity: 1 } 50.01%, 100% { opacity: 0 } }
      .tok-key { color: #82aaff; } .tok-string { color: #ecc48d; }
      .tok-number { color: #f78c6c; } .tok-builtin { color: #c792ea; }
      .tok-fn { color: #54d1db; } .tok-comment { color: #7f8c8d; }
      @keyframes blobA {
        0% { transform: translate(0,0) scale(1); }
        50% { transform: translate(60px, 40px) scale(1.15); }
        100% { transform: translate(0,0) scale(1); }
      }
      @keyframes blobB {
        0% { transform: translate(0,0) scale(1); }
        50% { transform: translate(-80px, 20px) scale(1.12); }
        100% { transform: translate(0,0) scale(1); }
      }
      @keyframes blobC {
        0% { transform: translate(0,0) scale(1); }
        50% { transform: translate(40px, -60px) scale(1.1); }
        100% { transform: translate(0,0) scale(1); }
      }
      @keyframes shimmer {
        0% { transform: translateX(-120%); }
        60% { transform: translateX(140%); }
        100% { transform: translateX(140%); }
      }
    `;
    document.head.appendChild(style);
  }
}
