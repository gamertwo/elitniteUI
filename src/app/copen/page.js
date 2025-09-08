'use client'
import { useState, useEffect } from 'react';

const BlobbyProductCard = ({ product, isActive }) => {
  const { title, description } = product;
  
  const bgColor = isActive ? 'rgba(252, 165, 165, 1)' : 'rgba(252, 165, 165, 0.6)';
  const btnColor = 'rgb(231, 111, 81)';
  
  return (
    <div 
      style={{
        width: '280px',
        height: '380px',
        opacity: isActive ? 1 : 0.7,
        transform: isActive ? 'scale(1)' : 'scale(0.9)',
        transition: 'all 0.5s ease',
        position: 'relative',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '24px',
          background: bgColor,
          borderRadius: '50% 50% 48% 52% / 50% 50% 52% 50%',
          boxShadow: isActive ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none',
          clipPath: \`polygon(
            0% 0%, 100% 0%, 100% 85%, 94% 85%, 94% 93%, 89% 93%, 
            89% 89%, 85% 89%, 85% 96%, 80% 96%, 80% 91%, 75% 91%, 
            75% 95%, 70% 95%, 70% 91%, 65% 91%, 65% 87%, 60% 87%, 
            60% 96%, 55% 96%, 55% 86%, 50% 86%, 50% 92%, 45% 92%, 
            45% 89%, 40% 89%, 40% 95%, 35% 95%, 35% 91%, 30% 91%, 
            30% 94%, 25% 94%, 25% 89%, 20% 89%, 20% 97%, 15% 97%, 
            15% 92%, 10% 92%, 10% 89%, 5% 89%, 5% 85%, 0% 85%
          )\`,
        }}
      >
        <div 
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgb(250, 245, 235)',
            borderRadius: '50%',
            marginTop: '16px',
            marginBottom: '24px',
          }}
        />
        
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '12px'
        }}>
          {title}
        </h3>
        
        <p style={{
          color: '#4B5563',
          marginBottom: '32px',
          maxWidth: '200px'
        }}>
          {isActive ? description : description.substring(0, 60) + '...'}
        </p>
        
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '24px'
        }}>
          $19.99
        </div>
        
        <button 
          style={{
            backgroundColor: btnColor,
            color: 'white',
            padding: '12px 32px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => alert(\`Added \${title} to cart!\`)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const products = [
    {
      title: 'Premium Exterior Paint',
      description: 'Weather-resistant formula with superior coverage and durability for all your exterior painting needs.',
    },
    {
      title: 'Interior Satin Finish', 
      description: 'Smooth, washable finish ideal for living spaces and high-traffic areas in your home.',
    },
    {
      title: 'Industrial Epoxy Coating',
      description: 'Heavy-duty protection for concrete and metal surfaces in industrial environments.',
    },
  ];

  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: 'rgb(250, 245, 235)',
      borderRadius: '12px'
    }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '40px',
        color: '#374151'
      }}>
        Premium Paint Collection
      </h2>
      
      <div style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '420px',
        overflow: 'hidden'
      }}>
        {products.map((product, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              transform: \`translateX(\${(index - activeIndex) * 300}px)\`,
              transition: 'transform 0.5s ease',
            }}
          >
            <BlobbyProductCard 
              product={product} 
              isActive={index === activeIndex}
            />
          </div>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '20px'
      }}>
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              width: index === activeIndex ? '32px' : '12px',
              height: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: index === activeIndex ? '#EF4444' : '#D1D5DB',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}`
    },
    {
      name: "advanced-styles.css",
      language: "css",
      code: `/* Advanced Product Carousel Styles */
.carousel-container {
  padding: 30px 20px;
  background: linear-gradient(135deg, rgb(250, 245, 235) 0%, rgb(255, 250, 240) 100%);
  border-radius: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.carousel-title {
  font-size: 28px;
  font-weight: bold;
  color: #374151;
  margin: 0;
  background: linear-gradient(135deg, #374151 0%, #1F2937 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cart-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-icon {
  position: relative;
  font-size: 24px;
  display: flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-total {
  background: #374151;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.playback-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
}

.playback-btn {
  background: white;
  border: 2px solid #E5E7EB;
  color: #374151;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.playback-btn:hover {
  border-color: #374151;
  background: #374151;
  color: white;
}

.product-card {
  position: relative;
  width: 280px;
  height: 380px;
  transition: all 0.5s ease;
  cursor: pointer;
}

.blobby-shape {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.category-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.circular-cutout {
  width: 80px;
  height: 80px;
  background-color: rgb(250, 245, 235);
  border-radius: 50%;
  margin: 16px auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease;
}

.product-title {
  font-size: 20px;
  font-weight: bold;
  color: #374151;
  margin-bottom: 12px;
  line-height: 1.2;
}

.product-description {
  color: #4B5563;
  margin-bottom: 20px;
  max-width: 200px;
  font-size: 13px;
  line-height: 1.4;
  min-height: 40px;
}

.product-price {
  font-size: 28px;
  font-weight: bold;
  color: #374151;
  margin-bottom: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.add-to-cart-btn {
  color: white;
  padding: 12px 28px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.add-to-cart-btn:disabled {
  cursor: default;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 420px;
  overflow: hidden;
  margin-bottom: 30px;
}

.carousel-slide {
  position: absolute;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 0 20px;
}

.carousel-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #E5E7EB;
  background: white;
  color: #374151;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-btn:hover {
  border-color: #374151;
  background: #374151;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.product-counter {
  font-size: 18px;
  font-weight: bold;
  color: #374151;
}

.product-category {
  font-size: 12px;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}

.dot {
  height: 12px;
  width: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #D1D5DB;
}

.dot-active {
  width: 32px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.dot:hover:not(.dot-active) {
  background-color: #F87171;
  transform: scale(1.1);
}

.cart-preview {
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #E5E7EB;
}

.cart-preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
  font-size: 14px;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item span:first-child {
  color: #374151;
  font-weight: 500;
}

.cart-item span:last-child {
  color: #6B7280;
  font-weight: 600;
}

/* Floating particles animation */
.floating-particle {
  position: absolute;
  font-size: 16px;
  animation: float 2s infinite ease-in-out;
  pointer-events: none;
  z-index: 3;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

/* Interactive hover effects */
.product-card:hover .circular-cutout {
  transform: rotate(180deg);
}

.product-card:hover .blobby-shape {
  transform: scale(1.02);
}

/* Responsive design */
@media (max-width: 768px) {
  .carousel-container {
    padding: 20px 15px;
  }
  
  .carousel-header {
    flex-direction: column;
    text-align: center;
  }
  
  .carousel-title {
    font-size: 24px;
  }
  
  .product-card {
    transform: scale(0.9);
  }
  
  .carousel-controls {
    padding: 0 10px;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .playback-controls {
    margin-bottom: 20px;
  }
}

/* Color variations for different categories */
.category-exterior { background-color: rgb(231, 111, 81); }
.category-interior { background-color: rgb(59, 130, 246); }
.category-industrial { background-color: rgb(147, 51, 234); }
.category-specialty { background-color: rgb(34, 197, 94); }

/* Animation for added to cart state */
@keyframes addedPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.added-to-cart {
  animation: addedPulse 0.6s ease;
}

/* Gradient backgrounds for different product types */
.bg-exterior { background: rgba(252, 165, 165, 1); }
.bg-interior { background: rgba(165, 243, 252, 1); }
.bg-industrial { background: rgba(196, 181, 253, 1); }
.bg-specialty { background: rgba(187, 247, 208, 1); }`
    },
    {
      name: "carousel-config.js", 
      language: "js",
      code: `// Advanced Product Carousel Configuration
export const productCategories = {
  exterior: {
    name: 'Exterior',
    icon: '🏠',
    color: 'rgb(231, 111, 81)',
    bgColor: 'rgba(252, 165, 165, 1)',
    description: 'Weather-resistant paints for outdoor applications'
  },
  interior: {
    name: 'Interior', 
    icon: '🛋️',
    color: 'rgb(59, 130, 246)',
    bgColor: 'rgba(165, 243, 252, 1)',
    description: 'Premium indoor paints for living spaces'
  },
  industrial: {
    name: 'Industrial',
    icon: '🏭', 
    color: 'rgb(147, 51, 234)',
    bgColor: 'rgba(196, 181, 253, 1)',
    description: 'Heavy-duty coatings for industrial use'
  },
  specialty: {
    name: 'Specialty',
    icon: '🎨',
    color: 'rgb(34, 197, 94)', 
    bgColor: 'rgba(187, 247, 208, 1)',
    description: 'Specialized paints for unique applications'
  }
};

export const carouselSettings = {
  autoPlay: true,
  autoPlayInterval: 3000,
  transitionDuration: 500,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  showDots: true,
  showArrows: true,
  showCounter: true,
  enableKeyboard: true,
  pauseOnHover: true
};

export const animationSettings = {
  cardScale: {
    active: 1.0,
    inactive: 0.9
  },
  cardOpacity: {
    active: 1.0,
    inactive: 0.7  
  },
  hoverScale: 1.02,
  buttonHoverScale: 1.1,
  particleFloatDuration: 2000,
  addToCartPulseDuration: 600
};

export const themeColors = {
  primary: '#374151',
  secondary: '#6B7280', 
  accent: '#EF4444',
  success: '#10B981',
  background: 'rgb(250, 245, 235)',
  backgroundGradient: 'linear-gradient(135deg, rgb(250, 245, 235) 0%, rgb(255, 250, 240) 100%)',
  cardBackground: 'white',
  shadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  border: '#E5E7EB'
};

export const responsiveBreakpoints = {
  mobile: '480px',
  tablet: '768px', 
  desktop: '1024px',
  large: '1200px'
};

// Advanced features configuration
export const features = {
  cart: {
    enabled: true,
    showTotal: true,
    showCount: true,
    persistItems: false // Set to true to use localStorage
  },
  autoPlay: {
    enabled: true,
    pauseOnHover: true,
    showControls: true
  },
  animations: {
    particles: true,
    hoverEffects: true,
    transitions: true,
    iconRotation: true
  },
  accessibility: {
    ariaLabels: true,
    keyboardNavigation: true,
    focusManagement: true,
    announcements: true
  }
};

// Sample product data with extended properties
export const sampleProducts = [
  {
    id: 1,
    title: 'Premium Exterior Paint',
    description: 'Weather-resistant formula with superior coverage and durability for all your exterior painting needs. Perfect for siding, trim, and outdoor surfaces.',
    price: 19.99,
    originalPrice: 24.99,
    category: 'exterior',
    features: ['Weather-resistant', 'Superior coverage', 'Long-lasting', 'UV protection'],
    coverage: '350 sq ft per gallon',
    dryTime: '2-4 hours',
    finish: 'Satin',
    colors: ['White', 'Beige', 'Gray', 'Blue'],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: 2,
    title: 'Interior Satin Finish',
    description: 'Smooth, washable finish ideal for living spaces and high-traffic areas in your home. Easy to clean and maintain.',
    price: 16.99,
    originalPrice: 19.99,
    category: 'interior',
    features: ['Washable', 'Smooth finish', 'High-traffic ready', 'Low odor'],
    coverage: '400 sq ft per gallon',
    dryTime: '1-2 hours',
    finish: 'Satin',
    colors: ['White', 'Cream', 'Light Gray', 'Beige'],
    rating: 4.6,
    reviews: 203,
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: 3,
    title: 'Industrial Epoxy Coating',
    description: 'Heavy-duty protection for concrete and metal surfaces in industrial environments. Exceptional durability and chemical resistance.',
    price: 24.99,
    originalPrice: 29.99,
    category: 'industrial',
    features: ['Heavy-duty', 'Chemical resistant', 'Multi-surface', 'Industrial grade'],
    coverage: '200 sq ft per gallon',
    dryTime: '4-6 hours',
    finish: 'High-gloss',
    colors: ['Gray', 'Clear', 'Green', 'Blue'],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: 4,
    title: 'Metal Primer & Paint',
    description: 'Anti-corrosive formula that bonds directly to metal surfaces for lasting protection. No separate primer needed.',
    price: 22.99,
    originalPrice: 26.99,
    category: 'specialty',
    features: ['Anti-corrosive', 'Direct bonding', 'Metal protection', '2-in-1 formula'],
    coverage: '300 sq ft per gallon',
    dryTime: '3-4 hours',
    finish: 'Semi-gloss',
    colors: ['Black', 'White', 'Red', 'Silver'],
    rating: 4.7,
    reviews: 124,
    inStock: false,
    isNew: true,
    isBestSeller: false
  }
];

// Utility functions for carousel functionality
export const carouselUtils = {
  // Calculate transform for carousel slides
  getSlideTransform: (index, activeIndex, totalSlides) => {
    const position = index - activeIndex;
    return \`translateX(\${position * 100}%)\`;
  },
  
  // Get next index with wrapping
  getNextIndex: (currentIndex, totalItems) => {
    return (currentIndex + 1) % totalItems;
  },
  
  // Get previous index with wrapping  
  getPreviousIndex: (currentIndex, totalItems) => {
    return (currentIndex - 1 + totalItems) % totalItems;
  },
  
  // Format price for display
  formatPrice: (price) => {
    return \`$\${price.toFixed(2)}\`;
  },
  
  // Calculate total cart value
  calculateCartTotal: (cartItems) => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  // Get cart item count
  getCartItemCount: (cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }
};`
    }
  ],
  defaultTab: "ProductCard.jsx"
};

function Header({ title, description }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span className={styles.logoText}>CodeLab</span>
          </div>
        </div>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>
            <span>⚙️</span>
          </button>
          <button className={styles.actionButton}>
            <span>📤</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Preview({ componentCode, previewHeight }) {
  return (
    <div className={styles.preview} style={{ height: previewHeight }}>
      <div className={styles.previewHeader}>
        <div className={styles.previewTitle}>
          <span className={styles.previewIcon}>👁️</span>
          Live Preview
        </div>
        <div className={styles.previewControls}>
          <button className={styles.previewControl}>
            <span>🔄</span>
          </button>
          <button className={styles.previewControl}>
            <span>📱</span>
          </button>
          <button className={styles.previewControl}>
            <span>🖥️</span>
          </button>
        </div>
      </div>
      <div className={styles.previewContent}>
        <div className={styles.demoContainer}>
          <Preview 
          componentCode={demoData.componentCode} 
          previewHeight={previewHeight}
        />
        </div>
      </div>
    </div>
  );
}

function CodePanel({ files, activeTab, onTabChange, onCopy, copiedTab }) {
  const tabsRef = useRef(null);

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowLeft' && index > 0) {
      onTabChange(files[index - 1].name);
    } else if (event.key === 'ArrowRight' && index < files.length - 1) {
      onTabChange(files[index + 1].name);
    }
  };

  const getLanguageForHighlighter = (language) => {
    switch (language) {
      case 'jsx': return 'jsx';
      case 'js': return 'javascript';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'html': return 'html';
      default: return 'javascript';
    }
  };

  const getFileIcon = (language) => {
    switch (language) {
      case 'jsx': return '⚛️';
      case 'js': return '📄';
      case 'css': return '🎨';
      case 'json': return '📋';
      case 'html': return '🌐';
      default: return '📄';
    }
  };

  return (
    <div className={styles.codePanel}>
      <div className={styles.codePanelHeader}>
        <div className={styles.codePanelTitle}>
          <span className={styles.codePanelIcon}>💻</span>
          Source Code
        </div>
        <div className={styles.codePanelStats}>
          <span className={styles.stat}>
            <span className={styles.statLabel}>Files:</span>
            <span className={styles.statValue}>{files.length}</span>
          </span>
          <span className={styles.stat}>
            <span className={styles.statLabel}>Lines:</span>
            <span className={styles.statValue}>
              {files.find(f => f.name === activeTab)?.code.split('\n').length || 0}
            </span>
          </span>
        </div>
      </div>
      
      <div className={styles.tabBar} ref={tabsRef}>
        {files.map((file, index) => (
          <button
            key={file.name}
            className={`${styles.tab} ${activeTab === file.name ? styles.tabActive : ''}`}
            onClick={() => onTabChange(file.name)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-selected={activeTab === file.name}
            role="tab"
          >
            <span className={styles.tabIcon}>{getFileIcon(file.language)}</span>
            <span className={styles.tabName}>{file.name}</span>
            {activeTab === file.name && <span className={styles.tabIndicator}></span>}
          </button>
        ))}
      </div>
      
      {files.map((file) => (
        <div
          key={file.name}
          className={`${styles.codeContent} ${activeTab === file.name ? styles.codeContentActive : ''}`}
          role="tabpanel"
          aria-hidden={activeTab !== file.name}
        >
          <div className={styles.codeHeader}>
            <div className={styles.fileInfo}>
              <span className={styles.fileIcon}>{getFileIcon(file.language)}</span>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileLanguage}>{file.language.toUpperCase()}</span>
            </div>
            <button
              className={styles.copyButton}
              onClick={() => onCopy(file.code, file.name)}
              aria-label={`Copy ${file.name} code`}
            >
              <span className={styles.copyIcon}>
                {copiedTab === file.name ? '✅' : '📋'}
              </span>
              {copiedTab === file.name ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className={styles.codeWrapper}>
            <SyntaxHighlighter
              language={getLanguageForHighlighter(file.language)}
              style={tomorrow}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: '#0a0f1c',
                fontSize: '14px',
                fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
              }}
              showLineNumbers={true}
              lineNumberStyle={{
                color: '#4a5568',
                backgroundColor: '#1a202c',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                borderRight: '1px solid #2d3748',
                minWidth: '3rem',
              }}
            >
              {file.code}
            </SyntaxHighlighter>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResizeHandle({ onResize }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartY(event.clientY);
    setStartHeight(parseInt(document.querySelector(`.${styles.preview}`).style.height) || 400);
    event.preventDefault();
  };

  const handleTouchStart = (event) => {
    setIsDragging(true);
    setStartY(event.touches[0].clientY);
    setStartHeight(parseInt(document.querySelector(`.${styles.preview}`).style.height) || 400);
    event.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isDragging) return;
      
      const deltaY = event.clientY - startY;
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.8, startHeight + deltaY));
      onResize(newHeight);
    };

    const handleTouchMove = (event) => {
      if (!isDragging) return;
      
      const deltaY = event.touches[0].clientY - startY;
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.8, startHeight + deltaY));
      onResize(newHeight);
      event.preventDefault();
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, startY, startHeight, onResize]);

  return (
    <div
      className={`${styles.resizeHandle} ${isDragging ? styles.resizeHandleActive : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="separator"
      aria-label="Resize preview area"
      aria-orientation="horizontal"
    >
      <div className={styles.resizeHandleContent}>
        <div className={styles.resizeHandleBar}></div>
        <span className={styles.resizeHandleText}>Drag to resize</span>
        <div className={styles.resizeHandleBar}></div>
      </div>
    </div>
  );
}

export default function CodePenPage() {
  const [activeTab, setActiveTab] = useState(demoData.defaultTab);
  const [copiedTab, setCopiedTab] = useState(null);
  const [previewHeight, setPreviewHeight] = useState(400);

  const handleCopy = async (code, fileName) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTab(fileName);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleResize = (newHeight) => {
    setPreviewHeight(newHeight);
  };

  return (
    <main className={styles.main}>
      <Header title={demoData.title} description={demoData.description} />
      
      <div className={styles.container}>
        <Preview 
          componentCode={demoData.componentCode} 
          previewHeight={previewHeight}
        />
        
        <ResizeHandle onResize={handleResize} />
        
        <CodePanel
          files={demoData.files}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCopy={handleCopy}
          copiedTab={copiedTab}
        />
      </div>
    </main>
  );
}