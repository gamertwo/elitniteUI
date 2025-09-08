'use client';

import { useEffect, useState, useRef } from 'react';

export default function Page() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    setIsLoaded(true);
    
    // Initialize particles
    const initialParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.8 + 0.3,
      size: Math.random() * 3 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));
    setParticles(initialParticles);
    
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let newVx = particle.vx;
          let newVy = particle.vy;
          let newOpacity = particle.opacity;
          
          // Attraction to cursor when close
          if (distance < 200) {
            const force = (200 - distance) / 200 * 0.015;
            newVx += dx * force;
            newVy += dy * force;
            newOpacity = Math.min(1.0, particle.opacity + 0.03);
          } else {
            newOpacity = Math.max(0.3, particle.opacity - 0.008);
          }
          
          // Add subtle pulsing effect
          const pulseEffect = Math.sin(Date.now() * 0.002 + particle.pulse) * 0.1 + 1;
          
          // Apply some friction
          newVx *= 0.98;
          newVy *= 0.98;
          
          // Update position
          let newX = particle.x + newVx;
          let newY = particle.y + newVy;
          
          // Bounce off edges
          if (newX < 0 || newX > window.innerWidth) newVx *= -0.5;
          if (newY < 0 || newY > window.innerHeight) newVy *= -0.5;
          
          newX = Math.max(0, Math.min(window.innerWidth, newX));
          newY = Math.max(0, Math.min(window.innerHeight, newY));
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            opacity: newOpacity,
            currentSize: particle.size * pulseEffect,
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Particle Web System */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-5"
        style={{ filter: 'blur(0.3px)' }}
      >
        {/* Connection lines between particles and cursor */}
        {particles.map(particle => {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 160) {
            const opacity = (160 - distance) / 160 * 0.5;
            return (
              <line
                key={`line-${particle.id}`}
                x1={particle.x}
                y1={particle.y}
                x2={mouseRef.current.x}
                y2={mouseRef.current.y}
                stroke="white"
                strokeWidth="0.8"
                opacity={opacity}
                style={{
                  strokeDasharray: '3,4',
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))',
                }}
              />
            );
          }
          return null;
        })}
        
        {/* Connection lines between nearby particles */}
        {particles.map((particle, i) => 
          particles.slice(i + 1).map((otherParticle, j) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const opacity = (100 - distance) / 100 * 0.25;
              return (
                <line
                  key={`connection-${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={otherParticle.x}
                  y2={otherParticle.y}
                  stroke="white"
                  strokeWidth="0.5"
                  opacity={opacity}
                  style={{ 
                    strokeDasharray: '2,3',
                    filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4))',
                  }}
                />
              );
            }
            return null;
          })
        )}
        
        {/* Particles */}
        {particles.map(particle => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.currentSize || particle.size}
            fill="white"
            opacity={particle.opacity}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8)) drop-shadow(0 0 12px rgba(255,255,255,0.4))',
            }}
          />
        ))}
        
        {/* Additional glow particles around cursor */}
        <circle
          cx={mouseRef.current.x}
          cy={mouseRef.current.y}
          r="8"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.3"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
          }}
        />
        <circle
          cx={mouseRef.current.x}
          cy={mouseRef.current.y}
          r="15"
          fill="none"
          stroke="white"
          strokeWidth="0.3"
          opacity="0.2"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.3))',
            strokeDasharray: '5,5',
          }}
        />
      </svg>

      {/* Enhanced spotlight background */}
      <div 
        className="absolute inset-0 opacity-40 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 20%, transparent 50%)`,
        }}
      />
      
      {/* Additional cursor glow */}
      <div 
        className="absolute inset-0 opacity-25 transition-all duration-500 ease-out"
        style={{
          background: `radial-gradient(300px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />
      
      {/* Floating spotlight animation */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 opacity-25 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
            top: '20%',
            left: '10%',
          }}
        />
        <div 
          className="absolute w-80 h-80 opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite reverse',
            bottom: '30%',
            right: '15%',
          }}
        />
        <div 
          className="absolute w-64 h-64 opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 15s ease-in-out infinite',
            top: '60%',
            left: '70%',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <h1 
          className={`text-8xl md:text-9xl lg:text-[12rem] font-thin tracking-wider text-white transition-all duration-2000 ease-out ${
            isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
          style={{
            fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
            textShadow: '0 0 40px rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
          }}
        >
          ELITNITE
        </h1>
        
        {/* Subtle glow effect behind text */}
        <div 
          className="absolute inset-0 flex items-center justify-center -z-10"
          style={{
            background: 'radial-gradient(ellipse 800px 200px at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}