'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Hero Section */}
      

        {/* Services Section */}
        <div className={`transition-all duration-2000 delay-500 ease-out ${
          isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'
        }`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-wide">
              Our Services
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Elevating digital experiences through cutting-edge technology and innovative solutions
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            
            {/* AI Development */}
            <div className="group relative h-full">
              <div className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 h-full flex flex-col">
                {/* Icon */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center group-hover:from-white/30 group-hover:to-white/10 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                    </svg>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-white/5 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
                    AI Development
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                    Custom AI solutions and machine learning models tailored to transform your business operations.
                  </p>
                </div>
                
                {/* Hover line accent */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Web Development */}
            <div className="group relative h-full">
              <div className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 h-full flex flex-col">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center group-hover:from-white/30 group-hover:to-white/10 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-white/5 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
                    Web Development
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                    Modern, responsive web applications built with cutting-edge frameworks and optimal performance.
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Cloud Solutions */}
            <div className="group relative h-full">
              <div className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 h-full flex flex-col">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center group-hover:from-white/30 group-hover:to-white/10 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-white/5 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
                    Cloud Solutions
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                    Scalable cloud infrastructure and deployment strategies for seamless digital transformation.
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Digital Strategy */}
            <div className="group relative h-full">
              <div className="relative p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 h-full flex flex-col">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center group-hover:from-white/30 group-hover:to-white/10 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-white/5 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
                    Digital Strategy
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                    Strategic consulting and roadmap development to accelerate your digital innovation journey.
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Enhanced glow effect behind text */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-64 flex items-center justify-center -z-10"
          style={{
            background: 'radial-gradient(ellipse 900px 250px at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
          }}
        />
        
        {/* Additional text glow layers */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-64 flex items-center justify-center -z-20"
          style={{
            background: 'radial-gradient(ellipse 600px 150px at center, rgba(255,255,255,0.03) 0%, transparent 80%)',
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