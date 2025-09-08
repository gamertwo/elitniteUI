'use client'
import React, { useState } from 'react';

const ElitniteCodePenShowcase = () => {
  const [activeTab, setActiveTab] = useState('html');

  const codeBlocks = {
    html: `<!-- Elitnite Hero Section -->
<div class="elitnite-hero">
  <!-- Background Elements -->
  <div class="elitnite-background-overlay">
    <div class="elitnite-organic-shape elitnite-shape-1"></div>
    <div class="elitnite-organic-shape elitnite-shape-2"></div>
    <div class="elitnite-organic-shape elitnite-shape-3"></div>
  </div>

  <!-- Navigation -->
  <nav class="elitnite-navigation">
    <div class="elitnite-nav-brand">GreenMotive</div>
    
    <div class="elitnite-nav-center">
      <button class="elitnite-nav-btn elitnite-menu-btn">≡ Menu</button>
      <button class="elitnite-nav-btn elitnite-discover-btn">→ Discover Innovations</button>
    </div>
    
    <div class="elitnite-nav-indicator">
      <div class="elitnite-indicator-dot"></div>
      <span>Renewable Energy Solutions</span>
    </div>
  </nav>

  <!-- Hero Title -->
  <section class="elitnite-hero-title">
    <h1>GreenMotive</h1>
  </section>

  <!-- Services Grid -->
  <section class="elitnite-services-grid">
    <div class="elitnite-service-card" data-service="eco-urban">
      <div class="elitnite-glass-overlay"></div>
      
      <div class="elitnite-service-content">
        <span class="elitnite-category-tag">Resources</span>
        
        <div class="elitnite-service-icon">
          <span>+</span>
        </div>
        
        <h3 class="elitnite-service-title">ECO-URBAN<br>DEVELOPMENT</h3>
        
        <div class="elitnite-service-description">
          <p>Sustainable urban planning and green infrastructure 
          development for modern cities.</p>
        </div>
      </div>
    </div>

    <div class="elitnite-service-card" data-service="conservation">
      <div class="elitnite-glass-overlay"></div>
      
      <div class="elitnite-service-content">
        <span class="elitnite-category-tag">Management</span>
        
        <div class="elitnite-service-icon">
          <span>↻</span>
        </div>
        
        <h3 class="elitnite-service-title">CONSERVATION<br>TECHNOLOGIES</h3>
        
        <div class="elitnite-service-description">
          <p>Advanced technologies for environmental conservation 
          and resource management.</p>
        </div>
      </div>
    </div>

    <div class="elitnite-service-card" data-service="restore-oceans">
      <div class="elitnite-glass-overlay"></div>
      
      <div class="elitnite-service-content">
        <span class="elitnite-category-tag">Development</span>
        
        <div class="elitnite-service-icon">
          <span>✕</span>
        </div>
        
        <h3 class="elitnite-service-title">RESTORE OUR<br>OCEANS</h3>
        
        <div class="elitnite-service-description">
          <p>Ocean restoration projects and marine ecosystem 
          protection initiatives.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Decorative Wave -->
  <div class="elitnite-bottom-wave">
    <svg viewBox="0 0 1200 200" class="elitnite-wave-svg">
      <path d="M0,100 C300,150 600,50 900,100 C1050,125 1150,75 1200,100 
               L1200,200 L0,200 Z" fill="currentColor"/>
    </svg>
  </div>

  <!-- Floating Action Button -->
  <button class="elitnite-fab">↑</button>
</div>`,

    css: `/* Elitnite Hero Styles */
.elitnite-hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.elitnite-background-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.2;
}

.elitnite-organic-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}

.elitnite-shape-1 {
  top: 80px;
  left: 40px;
  width: 128px;
  height: 128px;
  background: #fbbf24;
}

.elitnite-shape-2 {
  top: 160px;
  right: 80px;
  width: 192px;
  height: 192px;
  background: #a8a29e;
}

.elitnite-shape-3 {
  bottom: 80px;
  left: 33.333333%;
  width: 160px;
  height: 160px;
  background: #d6d3d1;
}

.elitnite-navigation {
  position: relative;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
}

.elitnite-nav-brand {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
}

.elitnite-nav-center {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.elitnite-nav-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.elitnite-menu-btn {
  background: rgba(255, 255, 255, 0.8);
  color: #374151;
  border: 1px solid #d1d5db;
  backdrop-filter: blur(4px);
}

.elitnite-menu-btn:hover {
  background: rgba(255, 255, 255, 1);
}

.elitnite-discover-btn {
  background: #374151;
  color: white;
}

.elitnite-discover-btn:hover {
  background: #1f2937;
}

.elitnite-nav-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.elitnite-indicator-dot {
  width: 12px;
  height: 12px;
  background: #374151;
  border-radius: 50%;
}

.elitnite-nav-indicator span {
  font-size: 0.875rem;
  color: #6b7280;
}

.elitnite-hero-title {
  position: relative;
  z-index: 40;
  text-align: center;
  margin-top: 4rem;
  margin-bottom: 5rem;
}

.elitnite-hero-title h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.025em;
  margin: 0;
}

.elitnite-services-grid {
  position: relative;
  z-index: 40;
  padding: 0 2rem;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.elitnite-service-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.elitnite-service-card:hover {
  transform: scale(1.02);
}

.elitnite-glass-overlay {
  position: absolute;
  inset: -1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(1);
  transition: all 0.3s ease;
}

.elitnite-service-card:hover .elitnite-glass-overlay {
  opacity: 1;
  transform: scale(1.05);
}

.elitnite-service-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

.elitnite-category-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #374151;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.elitnite-service-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.elitnite-service-icon span {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
}

.elitnite-service-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.05em;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.elitnite-service-description {
  opacity: 0;
  transform: translateY(1rem);
  transition: all 0.3s ease;
}

.elitnite-service-card:hover .elitnite-service-description {
  opacity: 1;
  transform: translateY(0);
}

.elitnite-service-description p {
  font-size: 0.875rem;
  color: #6b7280;
  max-width: 20rem;
  margin: 0 auto;
  line-height: 1.5;
}

.elitnite-bottom-wave {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.elitnite-wave-svg {
  width: 100%;
  height: 8rem;
  color: #e7e5e4;
  opacity: 0.6;
}

.elitnite-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  background: #111827;
  color: white;
  border-radius: 50%;
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  z-index: 50;
  transition: all 0.3s ease;
}

.elitnite-fab:hover {
  background: #1f2937;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .elitnite-navigation {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .elitnite-nav-center {
    order: 2;
  }
  
  .elitnite-nav-indicator {
    order: 3;
  }
  
  .elitnite-services-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }
}`,

    js: `// Elitnite Hero JavaScript
class ElitniteHero {
  constructor() {
    this.activeService = null;
    this.serviceCards = document.querySelectorAll('.elitnite-service-card');
    this.fab = document.querySelector('.elitnite-fab');
    
    this.init();
  }

  init() {
    this.bindServiceHovers();
    this.bindFabClick();
    this.bindNavigation();
    this.setupIntersectionObserver();
    this.setupParallaxEffect();
  }

  bindServiceHovers() {
    this.serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.setActiveService(card.dataset.service);
      });
      
      card.addEventListener('mouseleave', () => {
        this.setActiveService(null);
      });
      
      // Touch support for mobile
      card.addEventListener('touchstart', () => {
        this.setActiveService(card.dataset.service);
      });
    });
  }

  setActiveService(serviceId) {
    this.activeService = serviceId;
    
    this.serviceCards.forEach(card => {
      const isActive = card.dataset.service === serviceId;
      card.classList.toggle('elitnite-active', isActive);
      
      // Add visual feedback
      if (isActive) {
        card.style.transform = 'scale(1.02)';
      } else {
        card.style.transform = 'scale(1)';
      }
    });
  }

  bindFabClick() {
    this.fab.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  bindNavigation() {
    const menuBtn = document.querySelector('.elitnite-menu-btn');
    const discoverBtn = document.querySelector('.elitnite-discover-btn');
    
    menuBtn.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    discoverBtn.addEventListener('click', () => {
      this.scrollToServices();
    });
  }

  toggleMobileMenu() {
    // Mobile menu implementation
    const nav = document.querySelector('.elitnite-navigation');
    nav.classList.toggle('elitnite-menu-open');
  }

  scrollToServices() {
    const servicesGrid = document.querySelector('.elitnite-services-grid');
    servicesGrid.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('elitnite-animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe service cards for animation
    this.serviceCards.forEach(card => {
      observer.observe(card);
    });

    // Observe title
    const title = document.querySelector('.elitnite-hero-title');
    if (title) observer.observe(title);
  }

  setupParallaxEffect() {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Move organic shapes
      const shapes = document.querySelectorAll('.elitnite-organic-shape');
      shapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        shape.style.transform = \`translateY(\${scrolled * speed}px)\`;
      });
      
      // Move hero title
      const heroTitle = document.querySelector('.elitnite-hero-title h1');
      if (heroTitle) {
        heroTitle.style.transform = \`translateY(\${rate}px)\`;
      }
      
      ticking = false;
    };

    const requestParallaxUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestParallaxUpdate);
  }

  // Utility method for smooth animations
  animateElement(element, animation, duration = 300) {
    element.style.transition = \`all \${duration}ms ease\`;
    
    Object.assign(element.style, animation);
    
    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  }

  // Method to handle responsive behavior
  handleResize() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Disable parallax on mobile for performance
      this.serviceCards.forEach(card => {
        card.style.transform = 'none';
      });
    }
  }
}

// Custom event system for component communication
class ElitniteEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const elitniteHero = new ElitniteHero();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    elitniteHero.handleResize();
  });
  
  // Performance optimization: throttle scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
      // Custom scroll handling if needed
    }, 16); // ~60fps
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ElitniteHero, ElitniteEventEmitter };
}`
  };

  const tabs = [
    { id: 'html', label: 'HTML', color: 'bg-orange-500', icon: '🌐' },
    { id: 'css', label: 'CSS', color: 'bg-blue-500', icon: '🎨' },
    { id: 'js', label: 'JS', color: 'bg-yellow-500', icon: '⚡' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-8 bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* Elitnite CodePen Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h2 className="text-white font-mono text-lg">Elitnite Hero Component</h2>
          <div className="w-16"></div>
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
                ? 'bg-gray-900 text-white border-t-2 border-green-400'
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
        <span>Elitnite Hero • Glass Morphism & Organic Design</span>
        <div className="flex space-x-4">
          <span>🌱 Sustainable</span>
          <span>🔮 Glass Effects</span>
          <span>⚡ Interactive</span>
        </div>
      </div>
    </div>
  );
};

// Syntax highlighting function
const syntaxHighlight = (code, language) => {
  const patterns = {
    html: [
      { pattern: /&lt;[^&]*&gt;/g, class: 'text-red-400' }, // Tags
      { pattern: /elitnite-[\w-]+/g, class: 'text-cyan-400' }, // Elitnite classes
      { pattern: /class="[^"]*"/g, class: 'text-green-400' }, // Attributes
      { pattern: /data-[\w-]+="[^"]*"/g, class: 'text-purple-400' }, // Data attributes
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, class: 'text-gray-500' }, // Comments
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'text-gray-500' }, // Comments
      { pattern: /\.elitnite-[\w-]+/g, class: 'text-cyan-400' }, // Elitnite selectors
      { pattern: /[.#][\w-]+/g, class: 'text-yellow-400' }, // Other selectors
      { pattern: /[\w-]+(?=\s*:)/g, class: 'text-blue-400' }, // Properties
      { pattern: /:[\s]*[^;]+/g, class: 'text-green-400' }, // Values
      { pattern: /@media[^{]+/g, class: 'text-purple-400' }, // Media queries
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: 'text-gray-500' }, // Comments
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'text-gray-500' }, // Block comments
      { pattern: /\bElitnite[\w]+\b/g, class: 'text-cyan-400' }, // Elitnite classes
      { pattern: /\.elitnite-[\w-]+/g, class: 'text-cyan-400' }, // Elitnite selectors
      { pattern: /\b(class|function|const|let|var|if|else|for|while|return|this|constructor|addEventListener)\b/g, class: 'text-purple-400' }, // Keywords
      { pattern: /'[^']*'/g, class: 'text-green-400' }, // Strings
      { pattern: /"[^"]*"/g, class: 'text-green-400' }, // Strings
      { pattern: /\b\d+\b/g, class: 'text-orange-400' }, // Numbers
      { pattern: /\$\{[^}]+\}/g, class: 'text-yellow-400' }, // Template literals
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

export default ElitniteCodePenShowcase;