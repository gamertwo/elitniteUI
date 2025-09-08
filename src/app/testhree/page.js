"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

/* =========================================================
   Reusable: Canvas recorder button (8s WebM)
========================================================= */
function CanvasRecorderButton({ canvasRef, durationMs = 8000, filename = "broll" }) {
  const [recording, setRecording] = useState(false);

  async function record() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stream = canvas.captureStream(30);

    let mimeType =
      MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
        ? "video/webm;codecs=vp8"
        : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.webm`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setRecording(false);
    };

    setRecording(true);
    recorder.start();
    setTimeout(() => recorder.state !== "inactive" && recorder.stop(), durationMs);
  }

  return (
    <button onClick={record} disabled={recording} className="btn" title="Capture 8 seconds to WebM">
      {recording ? "Recording…" : "Record 8s"}
    </button>
  );
}

/* =========================================================
   Reusable: Lightweight JS highlighter (used in terminal)
========================================================= */
function highlightJS(src) {
  let s = src.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  s = s.replace(/(`[^`]*`)/g, '<span class="tok str">$1</span>');
  s = s.replace(/("[^"\n]*")/g, '<span class="tok str">$1</span>');
  s = s.replace(/('[^'\n]*')/g, '<span class="tok str">$1</span>');
  s = s.replace(/(\/\/[^\n]*)/g, '<span class="tok com">$1</span>');
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok com">$1</span>');
  const kw =
    "\\b(import|from|export|default|return|const|let|var|function|if|else|for|while|new|class|extends|try|catch|finally|await|async|switch|case|break|continue|yield|throw|true|false|null|undefined|useRef|useEffect|useState|useMemo)\\b";
  s = s.replace(new RegExp(kw, "g"), '<span class="tok kw">$1</span>');
  s = s.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok num">$1</span>');
  s = s.replace(/(&lt;\/?[A-Za-z][^&]*?&gt;)/g, '<span class="tok jsx">$1</span>');
  return s;
}

/* =========================================================
   New: VS Code–style Terminal Panel
========================================================= */
function TerminalPanel({
  title = "Terminal",
  prompt = "user@dev",
  cwd = "~/project",
  lines = [],
  typingSpeed = 18,
  openByDefault = true,
}) {
  const [expanded, setExpanded] = useState(openByDefault);
  const [copied, setCopied] = useState(false);
  const [typed, setTyped] = useState({ lineIndex: 0, chars: 0 });
  const animRef = useRef();

  const plainText = useMemo(() => {
    return lines
      .map((l) => {
        if (l.type === "cmd") return `${prompt} ${cwd} % ${l.text}`;
        return l.text;
      })
      .join("\n");
  }, [lines, prompt, cwd]);

  useEffect(() => {
    function tick() {
      setTyped((t) => {
        const current = lines[t.lineIndex];
        if (!current) return t;

        if (current.type === "cmd") {
          const nextChars = Math.min(current.text.length, t.chars + Math.max(1, typingSpeed / 12));
          if (nextChars < current.text.length) {
            return { ...t, chars: nextChars };
          }
          return { lineIndex: t.lineIndex + 1, chars: 0 };
        } else {
          return { lineIndex: t.lineIndex + 1, chars: 0 };
        }
      });
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [lines, typingSpeed]);

  function onCopy() {
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  const rendered = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const isCurrent = i === typed.lineIndex;
    if (i > typed.lineIndex) break;

    if (l.type === "cmd") {
      const shown = isCurrent ? l.text.slice(0, typed.chars) : l.text;
      rendered.push(
        <div className="tline cmd" key={`l-${i}`}>
          <span className="dim">{prompt} {cwd} %</span>&nbsp;
          <span dangerouslySetInnerHTML={{ __html: highlightJS(shown) }} />
          {isCurrent && Math.floor(Date.now() / 500) % 2 === 0 ? <span className="caret">▌</span> : null}
        </div>
      );
    } else {
      rendered.push(
        <div className={`tline ${l.type || "out"}`} key={`l-${i}`} dangerouslySetInnerHTML={{ __html: highlightJS(l.text) }} />
      );
    }
  }

  return (
    <div className={`vscode-term ${expanded ? "open" : ""}`}>
      <div className="vscode-bar">
        <div className="lights">
          <span className="light red" />
          <span className="light yellow" />
          <span className="light green" />
        </div>
        <div className="tabs">
          <span className="tab active">bash</span>
          <span className="tab">zsh</span>
          <span className="tab">powershell</span>
        </div>
        <div className="actions">
          <button className="ghost" onClick={onCopy}>{copied ? "Copied!" : "Copy"}</button>
          <button className="ghost" onClick={() => setExpanded((v) => !v)}>{expanded ? "Hide" : "Show"}</button>
        </div>
      </div>
      <div className="vscode-body" style={{ display: expanded ? "block" : "none" }}>
        <div className="term-inner">{rendered}</div>
      </div>
    </div>
  );
}

/* =========================================================
   New: Beautiful Code Panel with syntax highlighting
========================================================= */
function CodePanel({ title, code, language = "javascript", openByDefault = false }) {
  const [expanded, setExpanded] = useState(openByDefault);
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => highlightJS(code), [code]);

  function onCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  const lineCount = code.split('\n').length;

  return (
    <div className={`code-panel ${expanded ? "open" : ""}`}>
      <div className="code-header">
        <div className="code-lights">
          <span className="light red" />
          <span className="light yellow" />
          <span className="light green" />
        </div>
        <div className="code-title">
          <span className="filename">{title}</span>
          <span className="language">{language}</span>
        </div>
        <div className="code-actions">
          <button className="ghost" onClick={onCopy}>{copied ? "Copied!" : "Copy"}</button>
          <button className="ghost" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide Code" : "Show Code"}
          </button>
        </div>
      </div>
      <div className="code-body" style={{ display: expanded ? "block" : "none" }}>
        <div className="code-gutter">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="line-number">{i + 1}</div>
          ))}
        </div>
        <div className="code-content">
          <pre className="code-pre" dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   B-ROLL SCENE 1: Matrix Rain
========================================================= */
function MatrixRain({ width = 640, height = 360, density = 0.9 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;
    const cols = Math.floor(width / 12);
    const drops = new Array(cols).fill(0).map(() => Math.floor(Math.random() * -50));
    const glyphs =
      "アァカサタナハマヤラワガザダバパイィキシチニヒミリギジヂビピウゥクスツヌフムユルグズブプエェケセテネヘメレゲゼデベペオォコソトノホモヨロゴゾドボポ0123456789<>[]{}()$#*/=+-";

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "16px monospace";
      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > density) continue;

        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * 12;
        const y = drops[i] * 16;

        ctx.fillStyle = "rgba(180,255,190,0.9)";
        ctx.fillText(text, x, y);
        ctx.fillStyle = "rgba(80,200,120,0.6)";
        ctx.fillText(text, x, y - 16);

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animationFrame = requestAnimationFrame(draw);
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [width, height, density]);

  const matrixCode = `function MatrixRain({ width = 640, height = 360, density = 0.9 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;
    const cols = Math.floor(width / 12);
    const drops = new Array(cols).fill(0)
      .map(() => Math.floor(Math.random() * -50));
    
    const glyphs = "アァカサタナハマヤラワガザダバパ" +
      "イィキシチニヒミリギジヂビピウゥクスツヌフムユル" +
      "グズブプエェケセテネヘメレゲゼデベペオォコソト" +
      "ノホモヨロゴゾドボポ0123456789<>[]{}()$#*/=+-";

    function draw() {
      // Fade effect
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "16px monospace";
      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > density) continue;

        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * 12;
        const y = drops[i] * 16;

        // Bright leading character
        ctx.fillStyle = "rgba(180,255,190,0.9)";
        ctx.fillText(text, x, y);
        
        // Dimmer trailing character
        ctx.fillStyle = "rgba(80,200,120,0.6)";
        ctx.fillText(text, x, y - 16);

        // Reset drop when it reaches bottom
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrame = requestAnimationFrame(draw);
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    draw();
    
    return () => cancelAnimationFrame(animationFrame);
  }, [width, height, density]);

  return <canvas ref={ref} width={width} height={height} />;
}`;

  return (
    <div className="scene">
      <header>
        <h3>Matrix Rain</h3>
        <CanvasRecorderButton canvasRef={ref} filename="broll-matrix-rain" />
      </header>
      <canvas ref={ref} width={width} height={height} />

      <TerminalPanel
        title="MatrixRain build"
        prompt="dev@studio"
        cwd="~/broll"
        lines={[
          { type: "cmd", text: "node tools/generate-matrix --fps 30 --duration 8" },
          { type: "out", text: "Building shader trails…  ██████████████ 100%" },
          { type: "ok", text: "✔ output: dist/broll-matrix-rain.webm (8s, 30fps)" },
        ]}
      />

      <CodePanel
        title="MatrixRain.jsx"
        code={matrixCode}
        language="javascript"
      />
    </div>
  );
}

/* =========================================================
   B-ROLL SCENE 2: Typewriter Code
========================================================= */
function TypewriterCode({ width = 640, height = 360 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    const bg = "#0b0f14";
    const editor = "#0f1620";
    const gutter = "#0a1118";
    const text = "#e6edf3";
    const accent = "#7ee787";
    const comment = "#8b949e";

    const codeLines = [
      "import http from 'node:http';",
      "",
      "const server = http.createServer((req, res) => {",
      "  res.writeHead(200, { 'Content-Type': 'application/json' });",
      "  const payload = { ok: true, ts: Date.now() };",
      "  res.end(JSON.stringify(payload));",
      "});",
      "",
      "server.listen(3000, () => {",
      "  console.log('✅ API up on :3000');",
      "});",
      "",
      "// TODO: add /health route",
    ];

    let frame;
    let charIndex = 0;
    const fullText = codeLines.join("\n");

    function paintEditorChrome() {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = editor; ctx.fillRect(20, 20, width - 40, height - 40);
      ctx.fillStyle = "#0b1320"; ctx.fillRect(20, 20, width - 40, 32);
      ["#ff5f57","#febc2e","#28c840"].forEach((c,i)=>{ctx.beginPath();ctx.fillStyle=c;ctx.arc(40+i*16,36,6,0,Math.PI*2);ctx.fill();});
      ctx.fillStyle = gutter; ctx.fillRect(20, 52, 56, height - 72);
    }

    function typeLoop() {
      paintEditorChrome();

      ctx.fillStyle = "#5a6b80";
      ctx.font = "14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textBaseline = "top";
      const linesSoFar = fullText.slice(0, charIndex).split("\n");
      const totalLines = Math.max(linesSoFar.length, codeLines.length);
      for (let i = 0; i < totalLines; i++) {
        ctx.fillText(String(i + 1).padStart(2, " "), 36, 60 + i * 18);
      }

      let y = 60;
      const visible = fullText.slice(0, charIndex);
      const visLines = visible.split("\n");
      for (const ln of visLines) {
        const tokens = ln.split(/(\bconst\b|\bimport\b|\bfrom\b|\breturn\b|\bconsole\b|\blog\b|\/\/.*$|['"`][^'"`]*['"`])/g);
        let x = 84;
        for (const tok of tokens) {
          if (/^\/\//.test(tok)) ctx.fillStyle = comment;
          else if (/\bimport|from|const|return|console|log\b/.test(tok)) ctx.fillStyle = accent;
          else if (/^['"`].*['"`]$/.test(tok)) ctx.fillStyle = "#79c0ff";
          else ctx.fillStyle = text;
          ctx.fillText(tok, x, y); x += ctx.measureText(tok).width;
        }
        y += 18;
      }

      if (Math.floor(Date.now() / 500) % 2 === 0) {
        const lastLine = visLines[visLines.length - 1] || "";
        const caretX = 84 + ctx.measureText(lastLine).width + 2;
        const caretY = 60 + (visLines.length - 1) * 18;
        ctx.fillStyle = "#e6edf3"; ctx.fillRect(caretX, caretY, 8, 16);
      }

      const speed = 2;
      charIndex = Math.min(fullText.length, charIndex + speed);
      if (charIndex >= fullText.length && (Date.now() % 3000) < 30) charIndex = 0;

      frame = requestAnimationFrame(typeLoop);
    }

    frame = requestAnimationFrame(typeLoop);
    return () => cancelAnimationFrame(frame);
  }, [width, height]);

  const typewriterCode = `function TypewriterCode({ width = 640, height = 360 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    // Editor theme colors
    const bg = "#0b0f14";
    const editor = "#0f1620";
    const gutter = "#0a1118";
    const text = "#e6edf3";
    const accent = "#7ee787";
    const comment = "#8b949e";

    const codeLines = [
      "import http from 'node:http';",
      "",
      "const server = http.createServer((req, res) => {",
      "  res.writeHead(200, { 'Content-Type': 'application/json' });",
      "  const payload = { ok: true, ts: Date.now() };",
      "  res.end(JSON.stringify(payload));",
      "});",
      "",
      "server.listen(3000, () => {",
      "  console.log('✅ API up on :3000');",
      "});",
      "",
      "// TODO: add /health route",
    ];

    let frame;
    let charIndex = 0;
    const fullText = codeLines.join("\\n");

    function paintEditorChrome() {
      // Background
      ctx.fillStyle = bg; 
      ctx.fillRect(0, 0, width, height);
      
      // Editor area
      ctx.fillStyle = editor; 
      ctx.fillRect(20, 20, width - 40, height - 40);
      
      // Title bar
      ctx.fillStyle = "#0b1320"; 
      ctx.fillRect(20, 20, width - 40, 32);
      
      // Traffic lights
      ["#ff5f57","#febc2e","#28c840"].forEach((c,i) => {
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.arc(40 + i * 16, 36, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Gutter
      ctx.fillStyle = gutter; 
      ctx.fillRect(20, 52, 56, height - 72);
    }

    function typeLoop() {
      paintEditorChrome();

      // Line numbers
      ctx.fillStyle = "#5a6b80";
      ctx.font = "14px ui-monospace, monospace";
      ctx.textBaseline = "top";
      
      const linesSoFar = fullText.slice(0, charIndex).split("\\n");
      const totalLines = Math.max(linesSoFar.length, codeLines.length);
      
      for (let i = 0; i < totalLines; i++) {
        ctx.fillText(String(i + 1).padStart(2, " "), 36, 60 + i * 18);
      }

      // Syntax highlighted code
      let y = 60;
      const visible = fullText.slice(0, charIndex);
      const visLines = visible.split("\\n");
      
      for (const ln of visLines) {
        const tokens = ln.split(/(\\bconst\\b|\\bimport\\b|\\bfrom\\b|\\breturn\\b|\\bconsole\\b|\\blog\\b|\\/\\/.*$|['"\`][^'"\`]*['"\`])/g);
        let x = 84;
        
        for (const tok of tokens) {
          // Apply syntax colors
          if (/^\\/\\//.test(tok)) ctx.fillStyle = comment;
          else if (/\\bimport|from|const|return|console|log\\b/.test(tok)) ctx.fillStyle = accent;
          else if (/^['"\`].*['"\`]$/.test(tok)) ctx.fillStyle = "#79c0ff";
          else ctx.fillStyle = text;
          
          ctx.fillText(tok, x, y); 
          x += ctx.measureText(tok).width;
        }
        y += 18;
      }

      // Blinking cursor
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        const lastLine = visLines[visLines.length - 1] || "";
        const caretX = 84 + ctx.measureText(lastLine).width + 2;
        const caretY = 60 + (visLines.length - 1) * 18;
        ctx.fillStyle = "#e6edf3"; 
        ctx.fillRect(caretX, caretY, 8, 16);
      }

      // Animation speed and reset
      const speed = 2;
      charIndex = Math.min(fullText.length, charIndex + speed);
      if (charIndex >= fullText.length && (Date.now() % 3000) < 30) {
        charIndex = 0;
      }

      frame = requestAnimationFrame(typeLoop);
    }

    frame = requestAnimationFrame(typeLoop);
    return () => cancelAnimationFrame(frame);
  }, [width, height]);

  return <canvas ref={ref} width={width} height={height} />;
}`;

  return (
    <div className="scene">
      <header>
        <h3>Typewriter Code</h3>
        <CanvasRecorderButton canvasRef={ref} filename="broll-typewriter-code" />
      </header>
      <canvas ref={ref} width={width} height={height} />

      <TerminalPanel
        title="Typewriter demo"
        prompt="dev@studio"
        cwd="~/broll"
        lines={[
          { type: "cmd", text: "npm run dev" },
          { type: "out", text: "ready - started server on 0.0.0.0:3000, url: http://localhost:3000" },
          { type: "out", text: "info  - building client and server… ✨" },
          { type: "ok",  text: "compiled successfully in 2.4s (vital chunks)" },
        ]}
      />

      <CodePanel
        title="TypewriterCode.jsx"
        code={typewriterCode}
        language="javascript"
      />
    </div>
  );
}

/* =========================================================
   B-ROLL SCENE 3: Network Graph
========================================================= */
function NetworkGraph({ width = 640, height = 360, nodesCount = 64 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let frame;

    const nodes = new Array(nodesCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: 2 + Math.random() * 2,
    }));

    function step() {
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const alpha = 1 - dist / 120;
            ctx.strokeStyle = `rgba(120,200,255,${alpha * 0.6})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = "#9cd4ff";
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [width, height, nodesCount]);

  const networkCode = `function NetworkGraph({ width = 640, height = 360, nodesCount = 64 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let frame;

    // Generate random nodes with physics properties
    const nodes = new Array(nodesCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6, // velocity x
      vy: (Math.random() - 0.5) * 0.6, // velocity y
      r: 2 + Math.random() * 2,        // radius
    }));

    function step() {
      // Clear canvas with dark background
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);

      // Update node positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        
        // Bounce off edges
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // Draw connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 120) {
            const alpha = 1 - dist / 120; // Fade based on distance
            ctx.strokeStyle = \`rgba(120,200,255,\${alpha * 0.6})\`;
            ctx.lineWidth = 1;
            ctx.beginPath(); 
            ctx.moveTo(a.x, a.y); 
            ctx.lineTo(b.x, b.y); 
            ctx.stroke();
          }
        }
      }

      // Draw nodes on top of connections
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = "#9cd4ff";
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [width, height, nodesCount]);

  return <canvas ref={ref} width={width} height={height} />;
}`;

  return (
    <div className="scene">
      <header>
        <h3>Network Graph</h3>
        <CanvasRecorderButton canvasRef={ref} filename="broll-network-graph" />
      </header>
      <canvas ref={ref} width={width} height={height} />

      <TerminalPanel
        title="NetworkGraph export"
        prompt="dev@studio"
        cwd="~/broll"
        lines={[
          { type: "cmd", text: "node scripts/export --scene network --fps 30 --out dist/network.webm" },
          { type: "out", text: "connecting nodes 64 • link threshold 120px" },
          { type: "out", text: "rendering frames: 240/240" },
          { type: "ok",  text: "done  dist/network.webm  (8.0s @ 30fps)" },
        ]}
      />

      <CodePanel
        title="NetworkGraph.jsx"
        code={networkCode}
        language="javascript"
      />
    </div>
  );
}

/* =========================================================
   Page
========================================================= */
export default function Page() {
  return (
    <main className="wrap">
      <h1>Coding B-Roll Generator</h1>
      <p className="sub">
        Three looping, royalty-free animations you can record as WebM clips—now with VS Code–style terminals and beautiful code panels under each scene.
      </p>

      <div className="grid">
        <MatrixRain />
        <TypewriterCode />
        <NetworkGraph />
      </div>

      <style jsx>{`
        /* layout */
        .wrap {
          min-height: 100vh;
          background: radial-gradient(1200px 600px at 20% -20%, #0a1222, #05080e 60%);
          color: #fff;
          padding: 32px 24px 80px;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }
        h1 { margin: 0 0 8px 0; font-size: 28px; letter-spacing: 0.2px; }
        .sub { margin: 0 0 24px 0; opacity: 0.8; }
        .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
        .scene {
          grid-column: span 12;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }
        @media (min-width: 900px) { .scene { grid-column: span 6; } }
        header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
        header h3 { margin: 0; font-size: 16px; letter-spacing: 0.3px; }
        canvas { width: 100%; height: auto; display: block; border-radius: 12px; background: #000; }
        .btn {
          padding: 8px 12px; border: 1px solid #333; border-radius: 8px;
          background: #111; color: #fff; cursor: pointer;
        }
        .btn[disabled] { opacity: 0.6; cursor: not-allowed; }

        /* VS Code terminal */
        .vscode-term {
          margin-top: 14px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: #0b1220;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.35);
        }
        .vscode-term.open { box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05); }
        .vscode-bar {
          height: 40px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 0 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(180deg, rgba(10,15,25,0.95), rgba(6,10,18,0.95));
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
        }
        .lights { display: flex; gap: 8px; }
        .light { width: 10px; height: 10px; border-radius: 50%; display:inline-block; opacity: 0.9; }
        .light.red { background: #ff5f57; }
        .light.yellow { background: #febc2e; }
        .light.green { background: #28c840; }
        .tabs { display: flex; gap: 10px; align-items: center; }
        .tab {
          font-size: 12px; padding: 6px 10px; border-radius: 6px;
          background: rgba(255,255,255,0.04); border: 1px solid transparent; color: #cbd5e1;
        }
        .tab.active {
          background: rgba(126, 231, 135, 0.09);
          border-color: rgba(126, 231, 135, 0.25);
          color: #d1f7d6;
        }
        .actions { display: flex; gap: 8px; }
        .ghost {
          font-size: 12px; padding: 6px 10px; border-radius: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: #e6edf3; cursor: pointer;
        }
        .ghost:hover { background: rgba(255,255,255,0.1); }
        .vscode-body {
          max-height: 360px; overflow: auto;
          font: 13px/1.55 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          padding: 12px 14px 16px;
          color: #d7e0ea;
        }
        .term-inner { white-space: pre-wrap; }
        .tline { margin: 0 0 6px 0; }
        .tline.cmd { color: #e6edf3; }
        .tline.out { color: #c0cad6; }
        .tline.info { color: #79c0ff; }
        .tline.ok { color: #7ee787; }
        .tline.err { color: #ff7b72; }
        .dim { opacity: 0.6; }
        .caret { display:inline-block; margin-left:2px; }

        /* Beautiful Code Panel */
        .code-panel {
          margin-top: 14px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(14,21,35,0.95), rgba(8,12,20,0.95));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
        }
        .code-panel.open { 
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 
                      0 0 0 1px rgba(126,231,135,0.08), 
                      inset 0 1px 0 rgba(255,255,255,0.06); 
        }
        .code-header {
          height: 44px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(12,18,30,0.95), rgba(8,12,20,0.95));
          backdrop-filter: blur(8px);
        }
        .code-lights { display: flex; gap: 8px; }
        .code-title { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          padding-left: 8px; 
        }
        .filename { 
          font-size: 13px; 
          font-weight: 500; 
          color: #e6edf3; 
          font-family: ui-monospace, monospace;
        }
        .language { 
          font-size: 11px; 
          padding: 2px 6px; 
          border-radius: 4px;
          background: rgba(126, 231, 135, 0.12);
          color: #7ee787;
          border: 1px solid rgba(126, 231, 135, 0.2);
        }
        .code-actions { display: flex; gap: 8px; }
        .code-body { 
          display: flex;
          max-height: 520px; 
          overflow: auto;
          background: linear-gradient(180deg, rgba(11,18,32,0.98), rgba(8,12,20,0.98));
        }
        .code-gutter {
          background: rgba(8,12,20,0.8);
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 16px 8px 16px 12px;
          min-width: 44px;
          user-select: none;
        }
        .line-number {
          font: 12px/1.6 ui-monospace, monospace;
          color: #5a6b80;
          text-align: right;
          margin-bottom: 2px;
        }
        .code-content {
          flex: 1;
          overflow: auto;
        }
        .code-pre {
          margin: 0; 
          padding: 16px 18px 18px 16px;
          font: 13px/1.6 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          color: #e6edf3; 
          tab-size: 2; 
          white-space: pre;
          background: transparent;
        }

        /* syntax tint (shared) */
        .tok.kw { color: #7ee787; }
        .tok.str { color: #79c0ff; }
        .tok.com { color: #8b949e; }
        .tok.num { color: #ffa657; }
        .tok.jsx { color: #c9a6ff; }
      `}</style>
    </main>
  );
}