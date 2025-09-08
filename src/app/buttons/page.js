'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, Check, Eye, EyeOff, Mail, User, Building, MessageSquare, ChevronDown, History, Sparkles, Zap, Phone, Calendar, Lock, AlertCircle } from 'lucide-react';
import { 
  FloatingLabelInput, 
  ExpandingSearchField, 
  SuccessModal, 
  LoadingOverlay, 
  BackgroundEffects, 
  CustomStyles 
} from './UIComponents';

const ElitniteFieldsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    website: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    message: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([
    'AI Solutions', 
    'Premium Components', 
    'Next.js Templates',
    'Interactive Design',
    'Animation Effects'
  ]);
  const [focusedField, setFocusedField] = useState(null);
  const [particles, setParticles] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSuggestions] = useState([
    'React Components',
    'TypeScript Templates',
    'Animation Libraries',
    'UI/UX Design',
    'Frontend Development',
    'Modern CSS Techniques',
    'JavaScript Frameworks',
    'Responsive Design'
  ]);

  // Generate and animate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 60; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          pulseSpeed: Math.random() * 2 + 1
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + 100) % 100,
        y: (particle.y + particle.speedY + 100) % 100
      })));
    };

    const interval = setInterval(animateParticles, 80);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setFormSubmitted(true);
      console.log('Form submitted:', formData);
      
      // Reset after success
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Loading and Success Overlays */}
      {isLoading && <LoadingOverlay />}
      {formSubmitted && <SuccessModal />}

      {/* Background Effects */}
      <BackgroundEffects particles={particles} />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="relative inline-block">
            <h1 
              className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent mb-4"
              style={{ animation: 'titleGlow 4s ease-in-out infinite' }}
            >
              ELITNITE
            </h1>
            <div className="absolute -inset-8 bg-white/5 rounded-2xl blur-2xl animate-pulse"></div>
          </div>
          <p className="text-3xl text-white/70 mt-6 font-light tracking-wide">
            Premium Interactive Fields Experience
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {[
              '✨ 60fps Animations',
              '🎯 Real-time Validation', 
              '⚡ Smart Suggestions',
              '🌟 Particle Effects',
              '💫 Morphing Borders',
              '🔥 Premium Design'
            ].map((feature, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-white/10 rounded-full text-sm border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </header>

        {/* Hero Search */}
        <section className="mb-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Search the Universe
            </h2>
            <ExpandingSearchField 
              placeholder="Discover the infinite possibilities..." 
              searchHistory={searchHistory}
              setSearchHistory={setSearchHistory}
              searchSuggestions={searchSuggestions}
            />
          </div>
        </section>

        {/* Main Form Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Interactive Form Fields
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Experience the future of form interaction with floating labels, real-time validation, 
              and mesmerizing animations that respond to your every touch.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            {/* Personal Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingLabelInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                icon={User}
                maxLength={30}
                required
                autoComplete="given-name"
                formData={formData}
              />
              
              <FloatingLabelInput
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                icon={User}
                maxLength={30}
                required
                autoComplete="family-name"
                formData={formData}
              />
            </div>

            {/* Contact Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingLabelInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                icon={Mail}
                maxLength={100}
                required
                autoComplete="email"
                formData={formData}
              />
              
              <FloatingLabelInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                icon={Phone}
                maxLength={20}
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
                formData={formData}
              />
            </div>

            {/* Professional Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingLabelInput
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                icon={Building}
                maxLength={100}
                autoComplete="organization"
                formData={formData}
              />
              
              <FloatingLabelInput
                label="Position/Title"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                icon={Building}
                maxLength={100}
                autoComplete="organization-title"
                formData={formData}
              />
            </div>

            {/* Additional Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingLabelInput
                label="Website URL"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                icon={Search}
                maxLength={200}
                placeholder="https://example.com"
                autoComplete="url"
                formData={formData}
              />
              
              <FloatingLabelInput
                label=""
                name=""
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
                // icon={Calendar}
                autoComplete="bday"
                formData={formData}
              />
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FloatingLabelInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                icon={Lock}
                maxLength={50}
                required
                showPasswordToggle={true}
                autoComplete="new-password"
                formData={formData}
              />
              
              <FloatingLabelInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                icon={Lock}
                maxLength={50}
                required
                showPasswordToggle={true}
                autoComplete="new-password"
                formData={formData}
              />
            </div>

            {/* Message Field */}
            <div className="relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                maxLength={1000}
                rows={6}
                className={`w-full px-4 py-4 bg-transparent text-white font-medium rounded-xl border-2 transition-all duration-500 ease-out resize-none focus:outline-none ${
                  focusedField === 'message'
                    ? 'border-white shadow-2xl shadow-white/40 bg-white/5 scale-105'
                    : 'border-white/30 hover:border-white/60 hover:bg-white/5'
                }`}
                placeholder="Share your thoughts..."
                style={{ backdropFilter: 'blur(10px)' }}
              />
              <label
                className={`absolute left-4 transition-all duration-300 ease-out cursor-text flex items-center gap-2 select-none ${
                  formData.message || focusedField === 'message'
                    ? '-top-3 left-3 text-sm bg-gradient-to-r from-black via-black to-black px-3 py-1 rounded-full text-white border border-white/20'
                    : 'top-4 text-white/70'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Your Message
              </label>
              <div className="absolute right-3 -bottom-6 text-xs text-white/50">
                <span className={formData.message.length > 800 ? 'animate-pulse text-orange-400' : ''}>{formData.message.length}</span>/1000
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-12">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative px-16 py-5 bg-gradient-to-r from-white to-white/90 text-black font-bold text-xl rounded-xl border-2 border-white overflow-hidden transition-all duration-700 ease-out hover:scale-110 hover:shadow-2xl hover:shadow-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                <span className="relative z-10 flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Launch Experience
                      <Sparkles className="w-6 h-6 group-hover:animate-spin transition-transform duration-500" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </section>

        {/* Advanced Search Showcase */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Advanced Search Fields
            </h2>
            <p className="text-lg text-white/60">Multiple search variants with intelligent suggestions</p>
          </div>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Primary expanding search */}
            <div className="flex justify-center">
              <ExpandingSearchField 
                placeholder="Explore infinite possibilities..." 
                searchHistory={searchHistory}
                setSearchHistory={setSearchHistory}
                searchSuggestions={searchSuggestions}
              />
            </div>
            
            {/* Search variations grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Compact search */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Quick Search..."
                  className="w-full px-12 py-4 bg-white/5 text-white rounded-xl border border-white/20 focus:border-white focus:outline-none focus:bg-white/10 focus:shadow-xl focus:shadow-white/20 transition-all duration-500 backdrop-blur-lg"
                />
                <Search className="absolute left-4 top-4 w-5 h-5 text-white/60 group-focus-within:text-white group-focus-within:rotate-90 transition-all duration-500" />
              </div>
              
              {/* Filter search */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Filter results..."
                  className="w-full px-4 py-4 bg-transparent text-white rounded-xl border border-white/30 focus:border-white focus:outline-none focus:shadow-xl focus:shadow-white/20 focus:bg-white/5 transition-all duration-500 backdrop-blur-lg"
                />
                <div className="absolute right-4 top-4">
                  <ChevronDown className="w-5 h-5 text-white/60 group-focus-within:text-white group-focus-within:rotate-180 transition-all duration-500" />
                </div>
              </div>

              {/* Category search */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full px-4 py-4 bg-gradient-to-r from-white/5 to-white/10 text-white rounded-xl border border-white/20 focus:border-white focus:outline-none focus:shadow-xl focus:shadow-white/30 transition-all duration-500 backdrop-blur-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Live Interactive Demo
            </h2>
            <p className="text-lg text-white/60">Experience real-time validation and dynamic feedback</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Demo container */}
            <div className="relative p-8 bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl shadow-white/10">
              {/* Floating elements */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabelInput
                    label="Demo Field 1"
                    name="demo1"
                    value=""
                    onChange={() => {}}
                    icon={User}
                    placeholder="Try typing here..."
                    formData={{}}
                  />
                  <FloatingLabelInput
                    label="Demo Field 2"
                    name="demo2"
                    type="email"
                    value=""
                    onChange={() => {}}
                    icon={Mail}
                    placeholder="test@example.com"
                    formData={{}}
                  />
                </div>
                
                <ExpandingSearchField 
                  placeholder="Demo search field..." 
                  searchHistory={[]}
                  searchSuggestions={searchSuggestions}
                />
                
                {/* Feature highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                  {[
                    { icon: Sparkles, label: 'Animations', desc: '60fps smooth' },
                    { icon: Check, label: 'Validation', desc: 'Real-time' },
                    { icon: Zap, label: 'Performance', desc: 'Optimized' },
                    { icon: Eye, label: 'Feedback', desc: 'Instant' }
                  ].map((feature, index) => (
                    <div key={index} className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      <feature.icon className="w-8 h-8 mx-auto mb-2 text-white animate-pulse" />
                      <h4 className="font-semibold text-white text-sm">{feature.label}</h4>
                      <p className="text-white/60 text-xs mt-1">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Technical Specifications
            </h2>
            <p className="text-lg text-white/60">Built with cutting-edge technology for optimal performance</p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Performance',
                icon: Zap,
                features: [
                  '60fps animations',
                  'Hardware acceleration',
                  'Optimized rendering',
                  'Minimal reflows',
                  'Efficient event handling'
                ]
              },
              {
                title: 'Accessibility',
                icon: Eye,
                features: [
                  'WCAG 2.1 AA compliant',
                  'Keyboard navigation',
                  'Screen reader support',
                  'High contrast mode',
                  'Focus management'
                ]
              },
              {
                title: 'Features',
                icon: Sparkles,
                features: [
                  'Real-time validation',
                  'Smart suggestions',
                  'Floating labels',
                  'Morphing borders',
                  'Particle effects'
                ]
              }
            ].map((spec, index) => (
              <div key={index} className="p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 backdrop-blur-lg hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/10 rounded-full">
                    <spec.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{spec.title}</h3>
                </div>
                <ul className="space-y-3">
                  {spec.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-white/80">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10">
          <div className="mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-4">
              ELITNITE
            </h3>
            <p className="text-white/60 max-w-2xl mx-auto">
              Crafted with precision and passion for developers who demand excellence. 
              Experience the future of interactive form elements.
            </p>
          </div>
          
          <div className="flex justify-center gap-8 text-sm text-white/50">
            <span>© 2025 Elitnite</span>
            <span>•</span>
            <span>Premium Components</span>
            <span>•</span>
            <span>Built with React</span>
          </div>
        </footer>
      </div>

      {/* Custom CSS animations */}
      <CustomStyles />
    </div>
  );
};

export default ElitniteFieldsPage;