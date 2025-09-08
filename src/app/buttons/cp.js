'use client'
import React, { useState } from 'react';

const ButtonsCodePenShowcase = () => {
  const [activeTab, setActiveTab] = useState('react');

  const codeBlocks = {
    react: `// ELITNITE Premium Interactive Buttons
"use client"
import React, { useState } from 'react';
import { ChevronRight, Sparkles, Zap, Eye } from 'lucide-react';

const ElitniteButtons = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const PrimaryButton = ({ children, onClick }) => (
    <button
      className="group relative px-8 py-4 bg-white text-black font-semibold rounded-lg border-2 border-white overflow-hidden transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-white/30"
      onClick={onClick}
      onMouseEnter={() => setHoveredButton('primary')}
      onMouseLeave={() => setHoveredButton(null)}
      style={{
        animation: 'float 6s ease-in-out infinite, breathe 4s ease-in-out infinite'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      <div className="absolute inset-0 border-2 border-white rounded-lg group-hover:shadow-lg group-hover:shadow-white/50 transition-all duration-700 ease-out"></div>
      
      <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-all duration-500 ease-out">
        {children}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
      </span>
      
      {/* Particle trail effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-black rounded-full animate-ping"
            style={{
              left: \`\${20 + i * 10}%\`,
              top: \`\${40 + (i % 2) * 20}%\`,
              animationDelay: \`\${i * 150}ms\`
            }}
          />
        ))}
      </div>
    </button>
  );

  const SecondaryButton = ({ children, onClick }) => (
    <button
      className="group relative px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white overflow-hidden transition-all duration-700 ease-out hover:scale-105"
      onClick={onClick}
      onMouseEnter={() => setHoveredButton('secondary')}
      onMouseLeave={() => setHoveredButton(null)}
      style={{
        animation: 'float 8s ease-in-out infinite reverse, borderGlow 3s ease-in-out infinite'
      }}
    >
      <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-800 ease-out"></div>
      
      {/* Electric border animation */}
      <div className="absolute inset-0 rounded-lg">
        <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500 ease-out"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500 ease-out" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500 ease-out" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500 ease-out" style={{ animationDelay: '0.6s' }}></div>
      </div>
      
      <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-all duration-500 ease-out">
        {children}
        <Zap className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 ease-out" />
      </span>
    </button>
  );

  const GhostButton = ({ children, onClick }) => (
    <button
      className="group relative px-8 py-4 bg-transparent text-white font-semibold rounded-lg overflow-hidden transition-all duration-700 ease-out hover:scale-105"
      onClick={onClick}
      onMouseEnter={() => setHoveredButton('ghost')}
      onMouseLeave={() => setHoveredButton(null)}
      style={{
        animation: 'float 10s ease-in-out infinite, shimmer 4s ease-in-out infinite'
      }}
    >
      <div className="absolute inset-0 border-2 border-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-out"></div>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-out"></div>
      
      {/* Morphing underline */}
      <div className="absolute bottom-2 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:-translate-x-1/2 transition-all duration-700 ease-out"></div>
      
      <span className="relative z-10 flex items-center gap-2 group-hover:tracking-wider transition-all duration-600 ease-out">
        {children.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block group-hover:animate-bounce transition-all duration-300 ease-out"
            style={{ animationDelay: \`\${i * 80}ms\` }}
          >
            {char}
          </span>
        ))}
        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 ease-out" />
      </span>
    </button>
  );

  return (
    <div className="flex flex-col items-center space-y-8">
      <PrimaryButton onClick={() => console.log('Primary clicked')}>
        Launch Project
      </PrimaryButton>
      
      <SecondaryButton onClick={() => console.log('Secondary clicked')}>
        View Details
      </SecondaryButton>
      
      <GhostButton onClick={() => console.log('Ghost clicked')}>
        Discover
      </GhostButton>
    </div>
  );
};

export default ElitniteButtons;`,

    css: `/* ELITNITE Premium Button Animations */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  33% { 
    transform: translateY(-10px) rotate(1deg); 
  }
  66% { 
    transform: translateY(5px) rotate(-1deg); 
  }
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.02); 
  }
}

@keyframes borderGlow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255,255,255,0.1); 
  }
  50% { 
    box-shadow: 0 0 40px rgba(255,255,255,0.3); 
  }
}

@keyframes shimmer {
  0% { 
    background-position: -200% 0; 
  }
  100% { 
    background-position: 200% 0; 
  }
}

/* Primary Button Styles */
.primary-btn {
  position: relative;
  padding: 1rem 2rem;
  background: white;
  color: black;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 2px solid white;
  overflow: hidden;
  transition: all 0.7s ease-out;
  animation: float 6s ease-in-out infinite, breathe 4s ease-in-out infinite;
}

.primary-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 25px 50px -12px rgba(255,255,255,0.3);
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
  transition: transform 1s ease-out;
}

.primary-btn:hover::before {
  transform: translateX(100%);
}

/* Secondary Button Styles */
.secondary-btn {
  position: relative;
  padding: 1rem 2rem;
  background: transparent;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 2px solid white;
  overflow: hidden;
  transition: all 0.7s ease-out;
  animation: float 8s ease-in-out infinite reverse, borderGlow 3s ease-in-out infinite;
}

.secondary-btn:hover {
  transform: scale(1.05);
}

.secondary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  transform: translateX(-100%);
  transition: transform 0.8s ease-out;
}

.secondary-btn:hover::before {
  transform: translateX(0);
}

.secondary-btn:hover {
  color: black;
}

/* Electric corner animations */
.electric-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: ping 1s infinite;
}

.electric-corner.top-left {
  top: 0;
  left: 0;
}

.electric-corner.top-right {
  top: 0;
  right: 0;
  animation-delay: 0.2s;
}

.electric-corner.bottom-left {
  bottom: 0;
  left: 0;
  animation-delay: 0.4s;
}

.electric-corner.bottom-right {
  bottom: 0;
  right: 0;
  animation-delay: 0.6s;
}

.secondary-btn:hover .electric-corner {
  opacity: 1;
}

/* Ghost Button Styles */
.ghost-btn {
  position: relative;
  padding: 1rem 2rem;
  background: transparent;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.7s ease-out;
  animation: float 10s ease-in-out infinite, shimmer 4s ease-in-out infinite;
}

.ghost-btn:hover {
  transform: scale(1.05);
  letter-spacing: 0.1em;
}

.ghost-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid white;
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.ghost-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.05);
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.ghost-btn:hover::before,
.ghost-btn:hover::after {
  opacity: 1;
}

/* Morphing underline */
.ghost-underline {
  position: absolute;
  bottom: 8px;
  left: 50%;
  width: 0;
  height: 2px;
  background: white;
  transition: all 0.7s ease-out;
}

.ghost-btn:hover .ghost-underline {
  width: 75%;
  transform: translateX(-50%);
}

/* Character bounce animation */
.bounce-char {
  display: inline-block;
  transition: all 0.3s ease-out;
}

.ghost-btn:hover .bounce-char {
  animation: bounce 0.6s ease-out;
}

.bounce-char:nth-child(1) { animation-delay: 0ms; }
.bounce-char:nth-child(2) { animation-delay: 80ms; }
.bounce-char:nth-child(3) { animation-delay: 160ms; }
.bounce-char:nth-child(4) { animation-delay: 240ms; }
.bounce-char:nth-child(5) { animation-delay: 320ms; }
.bounce-char:nth-child(6) { animation-delay: 400ms; }
.bounce-char:nth-child(7) { animation-delay: 480ms; }
.bounce-char:nth-child(8) { animation-delay: 560ms; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Particle effects */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: black;
  border-radius: 50%;
  animation: ping 1s infinite;
}

.particle-1 { left: 20%; top: 40%; animation-delay: 0ms; }
.particle-2 { left: 30%; top: 60%; animation-delay: 150ms; }
.particle-3 { left: 40%; top: 40%; animation-delay: 300ms; }
.particle-4 { left: 50%; top: 60%; animation-delay: 450ms; }
.particle-5 { left: 60%; top: 40%; animation-delay: 600ms; }
.particle-6 { left: 70%; top: 60%; animation-delay: 750ms; }`,

    html: `<!-- ELITNITE Premium Interactive Buttons -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ELITNITE Premium Buttons</title>
  <link rel="stylesheet" href="buttons.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/lucide.min.css" rel="stylesheet">
</head>
<body>
  <div class="buttons-container">
    
    <!-- Primary Button -->
    <button class="primary-btn" onclick="handlePrimaryClick()">
      <div class="btn-content">
        <span>Launch Project</span>
        <i class="lucide lucide-chevron-right"></i>
      </div>
      
      <!-- Particle Effects -->
      <div class="particles">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
        <div class="particle particle-6"></div>
      </div>
    </button>

    <!-- Secondary Button -->
    <button class="secondary-btn" onclick="handleSecondaryClick()">
      <div class="btn-content">
        <span>View Details</span>
        <i class="lucide lucide-zap"></i>
      </div>
      
      <!-- Electric Corner Effects -->
      <div class="electric-corner top-left"></div>
      <div class="electric-corner top-right"></div>
      <div class="electric-corner bottom-left"></div>
      <div class="electric-corner bottom-right"></div>
    </button>

    <!-- Ghost Button -->
    <button class="ghost-btn" onclick="handleGhostClick()">
      <div class="btn-content">
        <span class="text-chars">
          <span class="bounce-char">D</span>
          <span class="bounce-char">i</span>
          <span class="bounce-char">s</span>
          <span class="bounce-char">c</span>
          <span class="bounce-char">o</span>
          <span class="bounce-char">v</span>
          <span class="bounce-char">e</span>
          <span class="bounce-char">r</span>
        </span>
        <i class="lucide lucide-eye"></i>
      </div>
      
      <div class="ghost-underline"></div>
    </button>

  </div>

  <script src="buttons.js"></script>
</body>
</html>`,

    js: `// ELITNITE Premium Buttons JavaScript
class ElitniteButtons {
  constructor() {
    this.hoveredButton = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.startAnimations();
  }

  bindEvents() {
    // Primary Button Events
    const primaryBtn = document.querySelector('.primary-btn');
    primaryBtn.addEventListener('mouseenter', () => {
      this.hoveredButton = 'primary';
      this.showParticles(primaryBtn);
    });
    
    primaryBtn.addEventListener('mouseleave', () => {
      this.hoveredButton = null;
      this.hideParticles(primaryBtn);
    });

    // Secondary Button Events
    const secondaryBtn = document.querySelector('.secondary-btn');
    secondaryBtn.addEventListener('mouseenter', () => {
      this.hoveredButton = 'secondary';
      this.triggerElectricEffect(secondaryBtn);
    });
    
    secondaryBtn.addEventListener('mouseleave', () => {
      this.hoveredButton = null;
    });

    // Ghost Button Events
    const ghostBtn = document.querySelector('.ghost-btn');
    ghostBtn.addEventListener('mouseenter', () => {
      this.hoveredButton = 'ghost';
      this.triggerCharacterAnimation(ghostBtn);
    });
    
    ghostBtn.addEventListener('mouseleave', () => {
      this.hoveredButton = null;
    });
  }

  showParticles(button) {
    const particles = button.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      setTimeout(() => {
        particle.style.opacity = '1';
        particle.style.animation = 'ping 1s infinite';
      }, index * 150);
    });
  }

  hideParticles(button) {
    const particles = button.querySelectorAll('.particle');
    particles.forEach(particle => {
      particle.style.opacity = '0';
    });
  }

  triggerElectricEffect(button) {
    const corners = button.querySelectorAll('.electric-corner');
    corners.forEach((corner, index) => {
      setTimeout(() => {
        corner.style.opacity = '1';
      }, index * 200);
    });
  }

  triggerCharacterAnimation(button) {
    const chars = button.querySelectorAll('.bounce-char');
    chars.forEach((char, index) => {
      setTimeout(() => {
        char.style.animation = 'bounce 0.6s ease-out';
      }, index * 80);
    });
    
    // Reset animations
    setTimeout(() => {
      chars.forEach(char => {
        char.style.animation = '';
      });
    }, 1000);
  }

  startAnimations() {
    // Continuous floating animations are handled by CSS
    // This method can be used for additional dynamic effects
    
    setInterval(() => {
      this.pulseRandomButton();
    }, 3000);
  }

  pulseRandomButton() {
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn, .ghost-btn');
    const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
    
    randomButton.style.transform = 'scale(1.02)';
    setTimeout(() => {
      randomButton.style.transform = '';
    }, 200);
  }

  // Button click handlers
  handlePrimaryClick() {
    console.log('Primary button clicked - Launch Project');
    this.createClickEffect('primary');
  }

  handleSecondaryClick() {
    console.log('Secondary button clicked - View Details');
    this.createClickEffect('secondary');
  }

  handleGhostClick() {
    console.log('Ghost button clicked - Discover');
    this.createClickEffect('ghost');
  }

  createClickEffect(type) {
    const button = document.querySelector(\`.\${type}-btn\`);
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = type === 'primary' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Additional CSS animations for ripple effect
const style = document.createElement('style');
style.textContent = \`
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .click-ripple {
    pointer-events: none;
  }
\`;
document.head.appendChild(style);

// Global button click handlers
function handlePrimaryClick() {
  buttonsInstance.handlePrimaryClick();
}

function handleSecondaryClick() {
  buttonsInstance.handleSecondaryClick();
}

function handleGhostClick() {
  buttonsInstance.handleGhostClick();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.buttonsInstance = new ElitniteButtons();
});`
  };

  const tabs = [
    { id: 'react', label: 'React', color: 'bg-cyan-500', icon: '⚛️' },
    { id: 'css', label: 'CSS', color: 'bg-blue-500', icon: '🎨' },
    { id: 'html', label: 'HTML', color: 'bg-orange-500', icon: '🌐' },
    { id: 'js', label: 'JS', color: 'bg-yellow-500', icon: '⚡' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-8 bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* CodePen Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h2 className="text-white font-mono text-lg">ELITNITE Premium Interactive Buttons</h2>
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm">60 FPS</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white border-t-2 border-cyan-400'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="bg-gray-900 p-6 min-h-96 max-h-96 overflow-y-auto">
        <pre className="text-sm leading-relaxed">
          <code 
            className="text-gray-100 font-mono"
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(codeBlocks[activeTab], activeTab)
            }}
          />
        </pre>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 px-6 py-3 flex justify-between items-center text-sm text-gray-400">
        <span>ELITNITE Buttons • Premium Interactive Components</span>
        <div className="flex space-x-4">
          <span>✨ 60fps Animations</span>
          <span>🎯 Magnetic Effects</span>
          <span>⚡ Electric Borders</span>
          <span>🌟 Particle Systems</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced Syntax highlighting function
const syntaxHighlight = (code, language) => {
  const patterns = {
    react: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'text-gray-500' }, // Block comments
      { pattern: /\/\/.*$/gm, class: 'text-gray-500' }, // Line comments
      { pattern: /\b(import|export|from|const|let|var|function|class|extends|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|static|async|await)\b/g, class: 'text-purple-400' }, // Keywords
      { pattern: /\b(React|useState|useEffect|useRef|Component|Fragment)\b/g, class: 'text-cyan-400' }, // React specific
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: 'text-green-400' }, // Strings
      { pattern: /\b\d+\.?\d*\b/g, class: 'text-orange-400' }, // Numbers
      { pattern: /&lt;[^&]*&gt;/g, class: 'text-red-400' }, // JSX tags
      { pattern: /className=|onClick=|onMouseEnter=|onMouseLeave=|style=/g, class: 'text-yellow-400' }, // JSX props
    ],
    html: [
      { pattern: /&lt;[^&]*&gt;/g, class: 'text-red-400' }, // Tags
      { pattern: /class="[^"]*"|id="[^"]*"|onclick="[^"]*"|src="[^"]*"/g, class: 'text-green-400' }, // Attributes
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, class: 'text-gray-500' }, // Comments
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'text-gray-500' }, // Comments
      { pattern: /[.#@][\w-]+/g, class: 'text-yellow-400' }, // Selectors and at-rules
      { pattern: /[\w-]+(?=\s*:)/g, class: 'text-blue-400' }, // Properties
      { pattern: /:[\s]*[^;{]+/g, class: 'text-green-400' }, // Values
      { pattern: /@keyframes|@media|@import/g, class: 'text-purple-400' }, // At-rules
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: 'text-gray-500' }, // Comments
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'text-gray-500' }, // Block comments
      { pattern: /\b(class|function|const|let|var|if|else|for|while|return|this|new|async|await|import|export|from|default)\b/g, class: 'text-purple-400' }, // Keywords
      { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, class: 'text-green-400' }, // Strings
      { pattern: /\b\d+\.?\d*\b/g, class: 'text-orange-400' }, // Numbers
      { pattern: /\b(document|window|console|setTimeout|setInterval|addEventListener|querySelector|querySelectorAll)\b/g, class: 'text-cyan-400' }, // DOM/Browser APIs
    ]
  };

  let highlightedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (patterns[language]) {
    patterns[language].forEach(({ pattern, class: className }) => {
      highlightedCode = highlightedCode.replace(pattern, (match) => 
        `<span class="${className}">${match}</span>`
      );
    });
  }

  return highlightedCode;
};

export default ButtonsCodePenShowcase;