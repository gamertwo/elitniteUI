'use client'
import React, { useState } from 'react';

const CodePenShowcase = () => {
  const [activeTab, setActiveTab] = useState('html');

  const codeBlocks = {
    html: `<!-- Plant Card Component Structure -->
<div class="plant-carousel">
  <div class="carousel-container">
    <div class="plant-card active">
      <div class="plant-image-wrapper">
        <img src="/plants/monstera-deliciosa.png" alt="Monstera Deliciosa" />
        <span class="care-badge easy">Easy Care</span>
      </div>
      
      <div class="plant-info">
        <h3 class="plant-title">Monstera Deliciosa</h3>
        <p class="plant-description">
          Large, glossy leaves with natural splits make this 
          tropical beauty perfect for bright spaces.
        </p>
        
        <div class="plant-meta">
          <span class="light-requirement">
            ☀️ Bright indirect light
          </span>
        </div>
        
        <a href="/plants" class="view-details-btn">
          View Details →
        </a>
      </div>
      
      <!-- Decorative leaf elements -->
      <div class="leaf-decoration leaf-1"></div>
      <div class="leaf-decoration leaf-2"></div>
      <div class="leaf-decoration leaf-3"></div>
    </div>
  </div>
  
  <!-- Navigation -->
  <button class="nav-btn prev-btn">‹</button>
  <button class="nav-btn next-btn">›</button>
  
  <!-- Indicators -->
  <div class="indicators">
    <button class="indicator active"></button>
    <button class="indicator"></button>
    <button class="indicator"></button>
  </div>
</div>`,

    css: `/* Plant Carousel Styles */
.plant-carousel {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  overflow: hidden;
  position: relative;
}

.carousel-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 450px;
  position: relative;
}

.plant-card {
  width: 280px;
  height: 400px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.plant-card.active {
  transform: translate(-50%, -50%) scale(1.05);
  z-index: 30;
}

.plant-image-wrapper {
  height: 256px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 24px 24px 0 0;
  position: relative;
  overflow: hidden;
}

.plant-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.care-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.care-badge.easy {
  background: #dcfce7;
  color: #166534;
}

.plant-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 256px);
}

.plant-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.plant-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.plant-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.light-requirement {
  font-size: 0.75rem;
  color: #6b7280;
}

.view-details-btn {
  color: #059669;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-top: auto;
  transition: transform 0.3s ease;
}

.view-details-btn:hover {
  transform: translateX(4px);
}

/* Decorative Elements */
.leaf-decoration {
  position: absolute;
  background: #059669;
  opacity: 0.2;
}

.leaf-1 {
  bottom: -12px;
  right: 32px;
  width: 8px;
  height: 24px;
  border-radius: 50% 50% 0 0;
  transform: rotate(15deg);
}

.leaf-2 {
  bottom: -20px;
  right: 56px;
  width: 12px;
  height: 40px;
  border-radius: 50% 50% 0 0;
  transform: rotate(-10deg);
  opacity: 0.15;
}

.leaf-3 {
  bottom: -8px;
  right: 80px;
  width: 8px;
  height: 20px;
  border-radius: 50% 50% 0 0;
  transform: rotate(25deg);
  opacity: 0.1;
}

/* Navigation */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: white;
  border: 1px solid #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #059669;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 40;
}

.prev-btn {
  left: 1rem;
}

.next-btn {
  right: 1rem;
}

.nav-btn:hover {
  background: #f0fdf4;
}

/* Indicators */
.indicators {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #059669;
  width: 32px;
  border-radius: 6px;
}

.indicator:hover {
  background: #86efac;
}`,

    js: `// Plant Carousel JavaScript
class PlantCarousel {
  constructor() {
    this.activeIndex = 0;
    this.plants = [
      {
        title: 'Monstera Deliciosa',
        image: '/plants/monstera-deliciosa.png',
        description: 'Large, glossy leaves with natural splits make this tropical beauty perfect for bright spaces.',
        careLevel: 'Easy',
        lightRequirement: 'Bright indirect'
      },
      {
        title: 'Snake Plant',
        image: '/plants/snake-plant.png',
        description: 'Hardy succulent with striking upright leaves, perfect for beginners and low-light areas.',
        careLevel: 'Easy',
        lightRequirement: 'Low to bright'
      },
      {
        title: 'Fiddle Leaf Fig',
        image: '/plants/fiddle-leaf-fig.png',
        description: 'Dramatic broad leaves create a stunning focal point in bright, indirect light.',
        careLevel: 'Medium',
        lightRequirement: 'Bright indirect'
      },
      {
        title: 'Peace Lily',
        image: '/plants/peace-lily.png',
        description: 'Elegant white blooms and dark green foliage thrive in medium light.',
        careLevel: 'Easy',
        lightRequirement: 'Medium'
      },
      {
        title: 'Rubber Tree',
        image: '/plants/rubber-tree.png',
        description: 'Glossy, thick leaves and easy care make this classic houseplant perfect.',
        careLevel: 'Easy',
        lightRequirement: 'Bright indirect'
      }
    ];
    
    this.init();
  }

  init() {
    this.renderCarousel();
    this.bindEvents();
    this.startAutoRotation();
  }

  renderCarousel() {
    const container = document.querySelector('.carousel-container');
    
    this.plants.forEach((plant, index) => {
      const card = this.createPlantCard(plant, index);
      container.appendChild(card);
    });
    
    this.updateCardPositions();
    this.renderIndicators();
  }

  createPlantCard(plant, index) {
    const card = document.createElement('div');
    card.className = \`plant-card \${index === this.activeIndex ? 'active' : ''}\`;
    card.innerHTML = \`
      <div class="plant-image-wrapper">
        <img src="\${plant.image}" alt="\${plant.title}" />
        <span class="care-badge \${plant.careLevel.toLowerCase()}">\${plant.careLevel} Care</span>
      </div>
      
      <div class="plant-info">
        <h3 class="plant-title">\${plant.title}</h3>
        <p class="plant-description">\${plant.description}</p>
        
        <div class="plant-meta">
          <span class="light-requirement">☀️ \${plant.lightRequirement} light</span>
        </div>
        
        <a href="/plants" class="view-details-btn">View Details →</a>
      </div>
      
      <div class="leaf-decoration leaf-1"></div>
      <div class="leaf-decoration leaf-2"></div>
      <div class="leaf-decoration leaf-3"></div>
    \`;
    
    return card;
  }

  updateCardPositions() {
    const cards = document.querySelectorAll('.plant-card');
    
    cards.forEach((card, index) => {
      const position = this.getCardPosition(index);
      
      card.style.transform = \`translate(-50%, -50%) translateX(\${position.x}%) scale(\${position.scale})\`;
      card.style.opacity = position.opacity;
      card.style.zIndex = position.zIndex;
      
      card.classList.toggle('active', index === this.activeIndex);
    });
  }

  getCardPosition(index) {
    const position = index - this.activeIndex;
    const normalizedPosition = this.normalizePosition(position);
    
    const positions = {
      0: { x: 0, scale: 1.05, opacity: 1, zIndex: 30 },
      [-1]: { x: -90, scale: 0.85, opacity: 0.7, zIndex: 20 },
      [1]: { x: 90, scale: 0.85, opacity: 0.7, zIndex: 20 },
      [-2]: { x: -160, scale: 0.7, opacity: 0.4, zIndex: 10 },
      [2]: { x: 160, scale: 0.7, opacity: 0.4, zIndex: 10 }
    };
    
    return positions[normalizedPosition] || { x: 0, scale: 0, opacity: 0, zIndex: 0 };
  }

  normalizePosition(position) {
    const half = Math.floor(this.plants.length / 2);
    
    if (position < -half) return position + this.plants.length;
    if (position > half) return position - this.plants.length;
    return position;
  }

  goToNext() {
    this.activeIndex = (this.activeIndex + 1) % this.plants.length;
    this.updateCardPositions();
    this.updateIndicators();
  }

  goToPrevious() {
    this.activeIndex = (this.activeIndex - 1 + this.plants.length) % this.plants.length;
    this.updateCardPositions();
    this.updateIndicators();
  }

  goToSlide(index) {
    this.activeIndex = index;
    this.updateCardPositions();
    this.updateIndicators();
  }

  renderIndicators() {
    const indicatorsContainer = document.querySelector('.indicators');
    
    this.plants.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = \`indicator \${index === this.activeIndex ? 'active' : ''}\`;
      indicator.addEventListener('click', () => this.goToSlide(index));
      indicatorsContainer.appendChild(indicator);
    });
  }

  updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.activeIndex);
    });
  }

  bindEvents() {
    document.querySelector('.prev-btn').addEventListener('click', () => this.goToPrevious());
    document.querySelector('.next-btn').addEventListener('click', () => this.goToNext());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goToPrevious();
      if (e.key === 'ArrowRight') this.goToNext();
    });
    
    // Touch/swipe support
    let startX = 0;
    const carousel = document.querySelector('.plant-carousel');
    
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.goToNext();
        else this.goToPrevious();
      }
    });
  }

  startAutoRotation() {
    setInterval(() => {
      this.goToNext();
    }, 5000);
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PlantCarousel();
});`
  };

  const tabs = [
    { id: 'html', label: 'HTML', color: 'bg-orange-500', icon: '🌐' },
    { id: 'css', label: 'CSS', color: 'bg-blue-500', icon: '🎨' },
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
          <h2 className="text-white font-mono text-lg">Plant Carousel Component</h2>
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
        <span>Plant Carousel • Modern & Responsive</span>
        <div className="flex space-x-4">
          <span>🌱 Eco-friendly</span>
          <span>📱 Mobile Ready</span>
          <span>⚡ Performance Optimized</span>
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
      { pattern: /class="[^"]*"/g, class: 'text-green-400' }, // Attributes
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, class: 'text-gray-500' }, // Comments
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'text-gray-500' }, // Comments
      { pattern: /[.#][\w-]+/g, class: 'text-yellow-400' }, // Selectors
      { pattern: /[\w-]+(?=\s*:)/g, class: 'text-blue-400' }, // Properties
      { pattern: /:[\s]*[^;]+/g, class: 'text-green-400' }, // Values
    ],
    js: [
      { pattern: /\/\/.*$/gm, class: 'text-gray-500' }, // Comments
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'text-gray-500' }, // Block comments
      { pattern: /\b(class|function|const|let|var|if|else|for|while|return|this)\b/g, class: 'text-purple-400' }, // Keywords
      { pattern: /'[^']*'/g, class: 'text-green-400' }, // Strings
      { pattern: /"[^"]*"/g, class: 'text-green-400' }, // Strings
      { pattern: /\b\d+\b/g, class: 'text-orange-400' }, // Numbers
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

export default CodePenShowcase;