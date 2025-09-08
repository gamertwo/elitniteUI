'use client'
import React, { useState } from 'react';

const GreenMotiveHero = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 'elitnite',
      title: 'Software Development',
      category: 'Resources',
      icon: '+',
      description: 'Custom software solutions and applications tailored to your business needs.',
      position: 'left'
    },
    {
      id: 'ai-bots',
      title: 'Automation Technology',
      category: 'Management',
      icon: '↻',
      description: 'AI-powered automation and intelligent bot solutions for streamlined operations.',
      position: 'center'
    },
    {
      id: 'web-development',
      title: 'Web Design',
      category: 'Development',
      icon: '✕',
      description: 'Modern, responsive web design and development services.',
      position: 'right'
    }
  ];

  return (
    /* Fixed container for screen recording */
    <div 
      className="relative overflow-hidden bg-gray-100 mx-auto"
      style={{
        width: '1400px',    // Fixed width
        height: '800px',    // Fixed height
        maxWidth: '1400px',
        maxHeight: '800px',
        minWidth: '1400px',
        minHeight: '800px',
        border: '2px solid #e5e7eb', // Visible border
        borderRadius: '12px',
        transform: 'scale(1)',
        transformOrigin: 'center'
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="3" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" fill="%23f5f5f5"/><path d="M200,400 Q400,200 600,400 T1000,400 L1000,800 L0,800 Z" fill="%23e8e8e8" opacity="0.7"/><path d="M0,500 Q300,300 600,500 T1200,500 L1200,800 L0,800 Z" fill="%23ddd" opacity="0.5"/></svg>')`,
          borderRadius: '10px'
        }}
      />
      
      {/* Organic overlay pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-12 left-8 w-24 h-24 bg-amber-200 rounded-full blur-xl"></div>
        <div className="absolute top-24 right-16 w-32 h-32 bg-stone-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-16 left-1/3 w-28 h-28 bg-neutral-300 rounded-full blur-xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4">
        <div className="text-lg font-medium text-gray-800">
          Elitnite
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 border border-gray-300 hover:bg-opacity-100 transition-all text-sm">
            ≡ Menu
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all text-sm">
            → Discover Innovations
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          <span className="text-xs text-gray-600">Renewable Software Solutions</span>
        </div>
      </nav>

      {/* Main Title */}
      <div className="relative z-40 text-center mt-8 mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Elitnite
        </h1>
      </div>

      {/* Services Grid */}
      <div className="relative z-40 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
            >
              {/* Hover Effect Background */}
              <div className={`absolute inset-0 -m-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg transition-all duration-300 ${
                activeService === service.id 
                  ? 'opacity-100 scale-105' 
                  : 'opacity-0 scale-100'
              }`}></div>

              {/* Category Tag */}
              <div className="relative z-10 mb-4">
                <span className="px-3 py-1 bg-white bg-opacity-70 backdrop-blur-sm rounded-full text-xs text-gray-700 border border-gray-200">
                  {service.category}
                </span>
              </div>

              {/* Service Icon */}
              <div className="relative z-10 mb-6 flex justify-center">
                <div className="w-12 h-12 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {service.icon}
                  </span>
                </div>
              </div>

              {/* Service Title */}
              <div className="relative z-10 text-center">
                <h3 className="text-base font-bold text-gray-900 tracking-wide leading-tight mb-2">
                  {service.title}
                </h3>
                
                {/* Description - shows on hover */}
                <div className={`transition-all duration-300 ${
                  activeService === service.id 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-stone-200 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-amber-100 to-transparent rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Bottom Organic Wave */}
      <div className="absolute bottom-0 w-full">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-20 text-stone-200 opacity-60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,90 600,30 900,60 C1050,75 1150,45 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-4 right-4 w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all z-50 flex items-center justify-center">
        <span className="text-sm">↑</span>
      </button>
    </div>
  );
};

export default GreenMotiveHero;