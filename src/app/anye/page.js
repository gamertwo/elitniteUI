'use client';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 relative overflow-hidden">
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(140px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        
        @keyframes orbit-reverse {
          0% { transform: translate(-50%, -50%) rotate(360deg) translateX(140px) rotate(-360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg) translateX(140px) rotate(0deg); }
        }
        
        @keyframes orbit-slow {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        
        @keyframes orbit-slow-reverse {
          0% { transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 12s linear infinite;
        }
        
        .animate-orbit {
          animation: orbit 6s linear infinite;
        }
        
        .animate-orbit-reverse {
          animation: orbit-reverse 8s linear infinite;
        }
        
        .animate-orbit-slow {
          animation: orbit-slow 10s linear infinite;
        }
        
        .animate-orbit-slow-reverse {
          animation: orbit-slow-reverse 14s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle glowing accents */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      
      {/* Navigation */}
      <nav className="relative z-20 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-2xl">Anyify</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Solutions</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Services</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a>
          </div>
          
          <button className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all">
            Sign In
          </button>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-float">
                <span className="text-teal-300 text-sm font-medium">✨ Next-Generation Solutions</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Elevate Your
                <span className="block bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
                  Business Future
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
                Transform your enterprise with cutting-edge technology solutions. 
                Anyify delivers innovation that drives growth, efficiency, and competitive advantage.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1 hover:scale-105">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              </button>
              
              <button className="px-8 py-4 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/30">
                Learn More
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
                <div className="text-slate-400 text-xs md:text-sm">Clients Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">99.9%</div>
                <div className="text-slate-400 text-xs md:text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
                <div className="text-slate-400 text-xs md:text-sm">Support</div>
              </div>
            </div>

            {/* Client Logos */}
            <div className="pt-8">
              <p className="text-slate-400 text-sm mb-6">Trusted by industry leaders</p>
              <div className="flex items-center gap-8 opacity-60">
                <div className="w-20 h-8 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">TECH</span>
                </div>
                <div className="w-20 h-8 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">CORP</span>
                </div>
                <div className="w-20 h-8 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">INNOVATE</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Main illustration container */}
              <div className="relative w-full h-96 lg:h-[500px]">
                
                {/* Floating geometric shapes */}
                <div className="absolute top-12 left-12 w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg transform rotate-12 animate-pulse opacity-80 animate-glow"></div>
                <div className="absolute top-32 right-8 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce opacity-70"></div>
                <div className="absolute bottom-24 left-8 w-8 h-8 bg-gradient-to-br from-teal-300 to-cyan-400 rounded transform rotate-45 animate-pulse"></div>
                <div className="absolute top-20 right-20 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-float opacity-60"></div>
                
                {/* Central futuristic element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Outer ring */}
                    <div className="w-72 md:w-80 h-72 md:h-80 border-2 border-teal-400/30 rounded-full animate-spin-slow"></div>
                    
                    {/* Middle ring */}
                    <div className="absolute inset-6 md:inset-8 border border-blue-400/40 rounded-full animate-spin-reverse"></div>
                    
                    {/* Inner core */}
                    <div className="absolute inset-20 md:inset-24 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center animate-glow">
                      <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-teal-500/50"></div>
                    </div>
                    
                    {/* Orbiting elements */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal-400 rounded-full animate-orbit"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full animate-orbit-reverse"></div>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-orbit-slow"></div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-orbit-slow-reverse"></div>
                  </div>
                </div>
                
                {/* Data visualization elements */}
                <div className="absolute bottom-8 right-4 md:right-12 bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs">System Active</span>
                  </div>
                  <div className="w-16 md:w-20 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-to-r from-teal-400 to-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Additional floating elements */}
                <div className="absolute top-8 left-1/3 bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-teal-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-6 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      
      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-400 text-sm">
            © 2025 Anyify. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}