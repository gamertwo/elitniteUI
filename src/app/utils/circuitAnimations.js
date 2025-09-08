// utils/circuitAnimations.js
export const circuitAnimations = {
  // Enhanced CSS animations for circuit board effects
  getCircuitCSS: () => `
    @keyframes circuitPulse {
      0%, 100% { 
        opacity: 0.3; 
        transform: scale(1);
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
      }
      50% { 
        opacity: 0.9; 
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.4);
      }
    }
    
    @keyframes dataFlow {
      0% { 
        transform: translateX(-100%) scaleX(0); 
        opacity: 0; 
      }
      25% { 
        transform: translateX(-50%) scaleX(1); 
        opacity: 1; 
      }
      75% { 
        transform: translateX(50%) scaleX(1); 
        opacity: 1; 
      }
      100% { 
        transform: translateX(100%) scaleX(0); 
        opacity: 0; 
      }
    }
    
    @keyframes neuralPulse {
      0%, 100% { 
        background: linear-gradient(45deg, #3b82f6, #8b5cf6);
        transform: rotate(0deg);
      }
      25% { 
        background: linear-gradient(45deg, #8b5cf6, #06b6d4);
        transform: rotate(90deg);
      }
      50% { 
        background: linear-gradient(45deg, #06b6d4, #10b981);
        transform: rotate(180deg);
      }
      75% { 
        background: linear-gradient(45deg, #10b981, #f59e0b);
        transform: rotate(270deg);
      }
    }
    
    @keyframes matrixCode {
      0% { 
        content: '01010101';
        color: #3b82f6;
      }
      25% { 
        content: '11001100';
        color: #8b5cf6;
      }
      50% { 
        content: '10011001';
        color: #06b6d4;
      }
      75% { 
        content: '01100110';
        color: #10b981;
      }
      100% { 
        content: '11010011';
        color: #3b82f6;
      }
    }
    
    @keyframes hologramFlicker {
      0%, 100% { 
        text-shadow: 0 0 5px #3b82f6, 0 0 10px #8b5cf6;
        opacity: 1;
      }
      50% { 
        text-shadow: 0 0 2px #3b82f6, 0 0 5px #8b5cf6, 0 0 8px #06b6d4;
        opacity: 0.8;
      }
    }
    
    @keyframes circuitTrace {
      0% { 
        stroke-dashoffset: 100%;
        opacity: 0;
      }
      50% { 
        opacity: 1;
      }
      100% { 
        stroke-dashoffset: 0%;
        opacity: 0.7;
      }
    }
    
    .neural-glow {
      position: relative;
      overflow: hidden;
    }
    
    .neural-glow::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
      border-radius: inherit;
      z-index: -1;
      opacity: 0.7;
      animation: neuralPulse 3s ease-in-out infinite;
    }
    
    .circuit-board-bg {
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%);
    }
    
    .hologram-text {
      animation: hologramFlicker 2s ease-in-out infinite;
    }
    
    .matrix-bg::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 98px,
          rgba(59, 130, 246, 0.03) 100px
        ),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 98px,
          rgba(139, 92, 246, 0.03) 100px
        );
      pointer-events: none;
    }
  `,

  // JavaScript animation utilities
  animateNodeConnection: (fromElement, toElement) => {
    if (!fromElement || !toElement) return;
    
    const line = document.createElement('div');
    line.className = 'circuit-connection-line';
    line.style.cssText = `
      position: absolute;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transform-origin: left center;
      animation: dataFlow 1s ease-out forwards;
      z-index: 1000;
    `;
    
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    
    const distance = Math.sqrt(
      Math.pow(toRect.left - fromRect.right, 2) + 
      Math.pow(toRect.top - fromRect.top, 2)
    );
    
    const angle = Math.atan2(
      toRect.top - fromRect.top,
      toRect.left - fromRect.right
    );
    
    line.style.left = fromRect.right + 'px';
    line.style.top = fromRect.top + fromRect.height / 2 + 'px';
    line.style.width = distance + 'px';
    line.style.transform = `rotate(${angle}rad)`;
    
    document.body.appendChild(line);
    
    setTimeout(() => {
      document.body.removeChild(line);
    }, 1000);
  },

  pulseElement: (element, duration = 2000) => {
    if (!element) return;
    
    element.style.animation = `circuitPulse ${duration}ms ease-in-out`;
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  },

  createDataStream: (container) => {
    if (!container) return;
    
    const stream = document.createElement('div');
    stream.className = 'data-stream-particle';
    stream.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: #3b82f6;
      border-radius: 50%;
      animation: matrixRain 3s linear infinite;
      left: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 2}s;
    `;
    
    container.appendChild(stream);
    
    setTimeout(() => {
      if (container.contains(stream)) {
        container.removeChild(stream);
      }
    }, 3000);
  }
};