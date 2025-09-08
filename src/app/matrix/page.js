'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

/* ------------------- Demo code shown on the left ------------------- */
const CODE = `// Code Rain — cascading glyph streams with cursor "wind"
const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*+=-•<>';

function initColumns(width, height, fontSize) {
  const cols = Math.ceil(width / fontSize);
  const data = [];
  for (let i = 0; i < cols; i++) {
    data.push({
      x: i * fontSize,
      y: Math.random() * -height,        // start above screen
      speed: 60 + Math.random() * 120,   // px/sec
      drift: (Math.random() - 0.5) * 10, // subtle sideways
      len: 8 + Math.floor(Math.random() * 18),
    });
  }
  return data;
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}
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
        <CodeRain />
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

/* ---------------------- Right: CODE RAIN canvas -------------------- */

function CodeRain() {
  const ref = useRef(null);
  const colsRef = useRef([]);     // column state
  const glyphGridRef = useRef([]); // cached glyphs per column
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0, has: false, vx: 0, vy: 0 });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let fontSize = 16; // base; scaled on DPR

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      // choose font size based on viewport (keeps density nice)
      fontSize = Math.max(14, Math.min(22, Math.round(Math.min(width, height) / 45)));
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
      ctx.textBaseline = 'top';

      colsRef.current = initColumns(width, height, fontSize);
      glyphGridRef.current = colsRef.current.map(() =>
        new Array(100).fill(0).map(randomGlyph)
      );
      ctx.clearRect(0, 0, width, height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // mouse wind
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      mouse.current.vx = nx - mouse.current.x;
      mouse.current.vy = ny - mouse.current.y;
      mouse.current.x = nx;
      mouse.current.y = ny;
      mouse.current.has = true;
    };
    const onLeave = () => (mouse.current.has = false);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    // touch wind
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      const nx = t.clientX - rect.left;
      const ny = t.clientY - rect.top;
      mouse.current.vx = nx - mouse.current.x;
      mouse.current.vy = ny - mouse.current.y;
      mouse.current.x = nx;
      mouse.current.y = ny;
      mouse.current.has = true;
    };
    const onTouchEnd = () => (mouse.current.has = false);
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    const loop = (tms) => {
      if (!startRef.current) startRef.current = tms;
      const t = (tms - startRef.current) / 1000;

      // trails (soft fade)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(7,10,18,0.10)';
      ctx.fillRect(0, 0, width, height);

      const cols = colsRef.current;
      const glyphGrid = glyphGridRef.current;

      // subtle background glow lines
      ctx.globalCompositeOperation = 'lighter';

      for (let ci = 0; ci < cols.length; ci++) {
        const col = cols[ci];

        // wind from cursor: push columns a bit
        if (mouse.current.has) {
          const dx = mouse.current.x - (col.x + 0.5 * fontSize);
          const dy = mouse.current.y - col.y;
          const d2 = dx * dx + dy * dy + 1;
          const k = Math.min(12, 2500 / d2);
          col.drift += (mouse.current.vx * 0.02 + (dx / Math.sqrt(d2)) * 0.6) * (k / 12);
        }

        // update column
        col.y += (col.speed * 0.0167); // approx 60fps baseline
        col.x += col.drift * 0.008;
        col.drift *= 0.98;

        // recycle when off-screen
        if (col.y - col.len * fontSize > height + fontSize * 2) {
          col.y = -Math.random() * height - col.len * fontSize;
          col.speed = 60 + Math.random() * 120;
          col.drift = (Math.random() - 0.5) * 10;
          col.len = 8 + Math.floor(Math.random() * 18);
          // refresh glyph buffer
          glyphGrid[ci] = new Array(100).fill(0).map(randomGlyph);
        }

        // occasionally swap a glyph for life
        if (Math.random() < 0.05) {
          const idx = Math.floor(Math.random() * glyphGrid[ci].length);
          glyphGrid[ci][idx] = randomGlyph();
        }

        // draw column (head brighter, tail dim)
        for (let i = 0; i < col.len; i++) {
          const gy = Math.floor((col.y / fontSize + i)) % glyphGrid[ci].length;
          const ch = glyphGrid[ci][(gy + glyphGrid[ci].length) % glyphGrid[ci].length];

          const y = col.y + i * fontSize;
          const head = i === 0;
          ctx.shadowBlur = head ? 12 : 6;
          ctx.shadowColor = head ? 'rgba(160, 255, 160, 0.8)' : 'rgba(120, 220, 140, 0.5)';
          ctx.fillStyle = head ? 'rgba(210,255,210,0.95)' : 'rgba(140,220,160,0.75)';

          ctx.fillText(ch, col.x, y);
        }
      }

      // soft vignette
      ctx.globalCompositeOperation = 'source-over';
      const cx = width / 2, cy = height / 2;
      const grd = ctx.createRadialGradient(cx, cy, Math.min(cx, cy) * 0.2, cx, cy, Math.max(width, height) * 0.75);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  function initColumns(width, height, fontSize) {
    const cols = Math.ceil(width / fontSize);
    const data = [];
    for (let i = 0; i < cols; i++) {
      data.push({
        x: i * fontSize,
        y: Math.random() * -height,
        speed: 60 + Math.random() * 120,
        drift: (Math.random() - 0.5) * 10,
        len: 8 + Math.floor(Math.random() * 18),
      });
    }
    return data;
  }

  const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*+=-•<>';

  function randomGlyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  return <canvas ref={ref} style={styles.canvas} />;
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
      .tok-key { color: #82aaff; }
      .tok-string { color: #ecc48d; }
      .tok-number { color: #f78c6c; }
      .tok-builtin { color: #c792ea; }
      .tok-fn { color: #54d1db; }
      .tok-comment { color: #7f8c8d; }
    `;
    document.head.appendChild(style);
  }
}
