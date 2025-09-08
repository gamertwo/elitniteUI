'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

/* ------------------- Demo code shown on the left ------------------- */
const CODE = `// Dynamic particles — cursor attraction + trails (no flashing)
const TWO_PI = Math.PI * 2;

function randRange(min, max) { return min + Math.random() * (max - min); }

function initParticles(count, w, h) {
  const cx = w / 2, cy = h / 2;
  const maxR = Math.min(cx, cy) * 0.95;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * maxR; // denser center
    const a = Math.random() * TWO_PI;
    pts.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      vx: 0, vy: 0,
      speed: 0.6 + Math.random() * 1.2,
      size: 0.9 + Math.random() * 1.6,
    });
  }
  return pts;
}

function flow(x, y, t) {
  // light, dependency-free pseudo-noise
  const n = Math.sin(x * 0.002 + t * 0.18) + Math.cos(y * 0.0023 - t * 0.15);
  const a = n * 1.6;
  return { ax: Math.cos(a), ay: Math.sin(a) };
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
        <OutputCanvas />
      </div>
      <NoiseOverlay />
    </main>
  );
}

/* ----------------------- Left: colorful code ----------------------- */

function CodeTyper({ code }) {
  const [cursor, setCursor] = useState(0);
  const src = useMemo(() => code.replace(/\t/g, '  '), [code]);

  // looping typewriter with slight jitter
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

  // simple syntax highlighter (no deps)
  const highlighted = useMemo(() => {
    const esc = visible
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return esc
      // comments
      .replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>')
      // strings
      .replace(/('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*")/g, '<span class="tok-string">$1</span>')
      // numbers
      .replace(/\b(\d+(\.\d+)?|\.\d+)\b/g, '<span class="tok-number">$1</span>')
      // keywords
      .replace(/\b(const|let|var|function|return|for|of|if|else|new|class|while|break|continue)\b/g, '<span class="tok-key">$1</span>')
      // builtins
      .replace(/\b(Math|Array|Object|String|Number|Date|Promise|requestAnimationFrame)\b/g, '<span class="tok-builtin">$1</span>')
      // function names (heuristic)
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

/* ---------------------- Right: dynamic canvas ---------------------- */

function OutputCanvas() {
  const ref = useRef(null);
  const partsRef = useRef([]);
  const mouse = useRef({ x: 0, y: 0, has: false });
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(80, Math.floor((width * height) / 6500));
      partsRef.current = initParticles(count, width, height);
      ctx.clearRect(0, 0, width, height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, has: true };
    };
    const onLeave = () => (mouse.current.has = false);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    // touch support
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: t.clientX - rect.left, y: t.clientY - rect.top, has: true };
    };
    const onTouchEnd = () => (mouse.current.has = false);
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    const loop = (tms) => {
      if (!startRef.current) startRef.current = tms;
      const t = (tms - startRef.current) / 1000;

      // trails (steady, no flashing)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(7,10,18,0.07)';
      ctx.fillRect(0, 0, width, height);

      const pts = partsRef.current;
      const cx = width / 2, cy = height / 2;

      // steady colors
      const fillColor = 'rgba(220,235,255,0.9)';
      const glowColor = 'rgba(170,205,255,0.7)';

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // gentle flow field
        const f = flow(p.x, p.y, t);
        p.vx += f.ax * 0.04;
        p.vy += f.ay * 0.04;

        // attraction to cursor
        if (mouse.current.has) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const d2 = dx * dx + dy * dy;
          const d = Math.sqrt(d2) || 1;
          const pull = Math.min(0.12, 40 / (d2 + 80)); // smooth, capped
          p.vx += (dx / d) * pull;
          p.vy += (dy / d) * pull;
        } else {
          // relax towards center if no cursor
          p.vx += (cx - p.x) * 0.0003;
          p.vy += (cy - p.y) * 0.0003;
        }

        // damping + slight bias
        const s = p.speed;
        p.vx = p.vx * 0.92 + 0.01 * s;
        p.vy = p.vy * 0.92 + 0.01 * s;

        p.x += p.vx;
        p.y += p.vy;

        // soft wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8 + p.size * 4;
        ctx.fill();
      }

      // subtle vignette
      ctx.globalCompositeOperation = 'source-over';
      const grd = ctx.createRadialGradient(cx, cy, Math.min(cx, cy) * 0.2, cx, cy, Math.max(width, height) * 0.7);
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

  // helpers (no color offsets)
  function initParticles(count, w, h) {
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(cx, cy) * 0.95;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * maxR;
      const a = Math.random() * Math.PI * 2;
      pts.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: 0, vy: 0,
        speed: 0.6 + Math.random() * 1.2,
        size: 0.9 + Math.random() * 1.6,
      });
    }
    return pts;
  }

  function flow(x, y, t) {
    const n = Math.sin(x * 0.002 + t * 0.18) + Math.cos(y * 0.0023 - t * 0.15);
    const a = n * 1.6;
    return { ax: Math.cos(a), ay: Math.sin(a) };
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
