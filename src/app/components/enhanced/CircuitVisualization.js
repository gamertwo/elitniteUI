import React, { useEffect, useRef } from 'react';

export const CircuitVisualization = ({ nodes, connections, activeNode }) => {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;
    
    drawCircuitConnections();
    animateDataFlow();
  }, [nodes, connections, activeNode]);
  
  const drawCircuitConnections = () => {
    const svg = svgRef.current;
    if (!svg) return;
    
    // Clear existing paths
    svg.innerHTML = '';
    
    // Create SVG definitions for gradients and patterns
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Circuit line gradient
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = 'circuitGradient';
    gradient.innerHTML = `
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0" />
    `;
    
    // Circuit pulse pattern
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.id = 'circuitPulse';
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', '20');
    pattern.setAttribute('height', '2');
    pattern.innerHTML = `
      <rect width="20" height="2" fill="url(#circuitGradient)">
        <animateTransform attributeName="transform" type="translate" 
          values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite" />
      </rect>
    `;
    
    defs.appendChild(gradient);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    
    // Draw connection paths
    connections.forEach(connection => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', generateCircuitPath(connection));
      path.setAttribute('stroke', 'url(#circuitPulse)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', connection.active ? '0.8' : '0.3');
      
      if (connection.active) {
        path.style.filter = 'drop-shadow(0 0 6px #3b82f6)';
      }
      
      svg.appendChild(path);
    });
  };
  
  const generateCircuitPath = (connection) => {
    const { from, to } = connection;
    const controlPoint1 = { x: from.x + (to.x - from.x) * 0.3, y: from.y };
    const controlPoint2 = { x: from.x + (to.x - from.x) * 0.7, y: to.y };
    
    return `M ${from.x} ${from.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${to.x} ${to.y}`;
  };
  
  const animateDataFlow = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    
    // Create data flow particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
        color: `hsl(${220 + Math.random() * 40}, 70%, 60%)`
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Reset particle if life is over
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = particle.maxLife;
        }
        
        // Draw particle
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1 + alpha * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Draw connections to nearby particles
        particles.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
              ctx.save();
              ctx.globalAlpha = (1 - distance / 80) * alpha * 0.2;
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};