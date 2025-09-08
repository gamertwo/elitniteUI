import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Check, Eye, EyeOff, Mail, User, Building, MessageSquare, ChevronDown, History, Sparkles, Zap, Phone, Calendar, Lock, AlertCircle } from 'lucide-react';

// Validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validatePassword = (password) => {
  return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

export const validateWebsite = (website) => {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlRegex.test(website);
};

// Enhanced Floating Label Input Component
export const FloatingLabelInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  icon: Icon, 
  maxLength,
  required = false,
  placeholder = '',
  autoComplete = 'off',
  showPasswordToggle = false,
  formData = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [showLocalPassword, setShowLocalPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    setFocusedField(name);
  };

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setFocusedField(null);
    
    // Validation logic
    let valid = true;
    let errorMessage = '';

    if (required && !value.trim()) {
      valid = false;
      errorMessage = 'This field is required';
    } else if (value.trim()) {
      switch (type) {
        case 'email':
          if (!validateEmail(value)) {
            valid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'tel':
          if (!validatePhone(value)) {
            valid = false;
            errorMessage = 'Please enter a valid phone number';
          }
          break;
        case 'password':
          if (name === 'password' && !validatePassword(value)) {
            valid = false;
            errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, and number';
          } else if (name === 'confirmPassword' && value !== formData.password) {
            valid = false;
            errorMessage = 'Passwords do not match';
          }
          break;
        case 'url':
          if (!validateWebsite(value)) {
            valid = false;
            errorMessage = 'Please enter a valid website URL';
          }
          break;
      }
    }

    setIsValid(valid);
    
    if (valid && value.trim()) {
      setValidFields(prev => ({ ...prev, [name]: true }));
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    } else if (!valid) {
      setValidFields(prev => ({ ...prev, [name]: false }));
      setValidationErrors(prev => ({ ...prev, [name]: errorMessage }));
    }
  }, [value, name, type, required, formData.password]);

  const getInputType = () => {
    if (showPasswordToggle) {
      return showLocalPassword ? 'text' : 'password';
    }
    return type;
  };

  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div 
        className={`absolute inset-0 rounded-xl transition-all duration-700 ease-out ${
          isFocused ? 'bg-gradient-to-r from-white/5 via-white/10 to-white/5 shadow-2xl shadow-white/20 scale-105' : 'bg-transparent'
        }`}
      />
      
      {/* Input container */}
      <div className="relative">
        <input
          ref={inputRef}
          type={getInputType()}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-4 ${showPasswordToggle ? 'pr-12' : ''} bg-transparent text-white font-medium rounded-xl border-2 transition-all duration-500 ease-out placeholder-transparent peer focus:outline-none ${
            isValid === true
              ? 'border-green-400 shadow-xl shadow-green-400/30 bg-green-400/5'
              : isValid === false
                ? 'border-red-400 shadow-xl shadow-red-400/30 bg-red-400/5 animate-shake'
                : isFocused
                  ? 'border-white shadow-xl shadow-white/40 bg-white/5'
                  : 'border-white/30 hover:border-white/60 hover:bg-white/5'
          }`}
          style={{
            backdropFilter: 'blur(10px)',
            animation: focusedField === name ? 'fieldGlow 2s ease-in-out infinite' : 'none'
          }}
        />
        
        {/* Floating label */}
        <label
          className={`absolute left-4 transition-all duration-300 ease-out cursor-text flex items-center gap-2 select-none ${
            value || isFocused
              ? '-top-3 left-3 text-sm bg-gradient-to-r from-black via-black to-black px-3 py-1 rounded-full text-white border border-white/20'
              : 'top-4 text-white/70'
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {Icon && <Icon className="w-4 h-4" />}
          {label}
          {required && <span className="text-red-400 animate-pulse">*</span>}
        </label>

        {/* Character counter */}
        {maxLength && (
          <div className={`absolute right-3 -bottom-6 text-xs transition-all duration-300 ${
            value.length > maxLength * 0.8 ? 'text-orange-400' : 'text-white/50'
          }`}>
            <span className={value.length > maxLength * 0.9 ? 'animate-pulse text-red-400' : ''}>{value.length}</span>
            <span>/{maxLength}</span>
          </div>
        )}

        {/* Password toggle button */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowLocalPassword(!showLocalPassword)}
            className="absolute right-3 top-4 text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
          >
            {showLocalPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Success/Error icons */}
        <div className="absolute right-3 top-4">
          {isValid === true && !showPasswordToggle && (
            <Check className="w-5 h-5 text-green-400 animate-bounce" />
          )}
          {isValid === false && !showPasswordToggle && (
            <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
          )}
        </div>

        {/* Morphing border animation */}
        <div 
          className={`absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-700 ease-out pointer-events-none ${
            isFocused ? 'scale-105 border-white/20' : 'scale-100'
          }`}
          style={{
            backgroundImage: isFocused 
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              : 'none',
            backgroundSize: '200% 100%',
            animation: isFocused ? 'borderShimmer 2s ease-in-out infinite' : 'none'
          }}
        />
      </div>

      {/* Error message */}
      {validationErrors[name] && (
        <p className="mt-2 text-sm text-red-400 animate-fadeIn flex items-center gap-2 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
          <AlertCircle className="w-4 h-4 animate-pulse" />
          {validationErrors[name]}
        </p>
      )}
    </div>
  );
};

// Enhanced Expanding Search Field Component
export const ExpandingSearchField = ({ 
  placeholder = "Search the Elitnite universe...",
  searchHistory = [],
  setSearchHistory,
  searchSuggestions = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (localQuery) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(localQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
    } else {
      setFilteredSuggestions([]);
    }
  }, [localQuery, searchSuggestions]);

  const handleFocus = () => {
    setIsExpanded(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsExpanded(!!localQuery);
      setShowSuggestions(false);
    }, 200);
  };

  const handleSearch = (query) => {
    setLocalQuery(query);
    if (query && !searchHistory.includes(query) && setSearchHistory) {
      setSearchHistory(prev => [query, ...prev.slice(0, 6)]);
    }
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setLocalQuery('');
    searchRef.current?.focus();
  };

  return (
    <div className="relative group">
      {/* Search container */}
      <div 
        className={`relative flex items-center transition-all duration-700 ease-out ${
          isExpanded ? 'w-full' : 'w-80'
        }`}
      >
        {/* Search icon */}
        <div 
          className={`absolute left-4 z-10 transition-all duration-500 ease-out ${
            isExpanded ? 'rotate-90 scale-110 text-white' : 'rotate-0 scale-100 text-white/70'
          }`}
        >
          <Search className="w-5 h-5" />
        </div>

        {/* Input field */}
        <input
          ref={searchRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-4 bg-transparent text-white font-medium rounded-xl border-2 transition-all duration-700 ease-out focus:outline-none ${
            isExpanded
              ? 'border-white shadow-2xl shadow-white/40 bg-white/10 scale-105'
              : 'border-white/30 hover:border-white/60 hover:bg-white/5'
          }`}
          style={{
            backdropFilter: 'blur(10px)',
            animation: isExpanded ? 'searchPulse 3s ease-in-out infinite' : 'none'
          }}
        />

        {/* Clear button */}
        {localQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 text-white/70 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl shadow-white/20 z-50 animate-slideDown">
          {/* Search history */}
          {!localQuery && searchHistory.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <History className="w-4 h-4" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="block w-full text-left px-3 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 hover:text-white border border-transparent hover:border-white/20"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-white/50" />
                      {item}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live suggestions */}
          {localQuery && filteredSuggestions.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <Sparkles className="w-4 h-4" />
                Suggestions
              </div>
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="block w-full text-left px-3 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 hover:text-white border border-transparent hover:border-white/20"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-white/50" />
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Success Modal Component
export const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-gradient-to-br from-green-400/10 to-blue-400/10 border border-green-400/30 rounded-2xl p-8 text-center max-w-md mx-4 animate-bounce">
      <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Check className="w-8 h-8 text-black" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
      <p className="text-white/70">Your form has been submitted successfully.</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-300 transition-all duration-300"
        >
          Close
        </button>
      )}
    </div>
  </div>
);

// Loading Overlay Component
export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
    <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-xl border border-white/20">
      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      <span className="text-white font-medium">Submitting...</span>
    </div>
  </div>
);

// Background Effects Component - FIXED
export const BackgroundEffects = ({ particles = [] }) => (
  <>
    {/* Floating particles background */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `pulse ${particle.pulseSpeed}s ease-in-out infinite`
          }}
        />
      ))}
    </div>

    {/* Animated grid background - FIXED: separated properties */}
    <div 
      className="fixed inset-0 opacity-5 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'gridMove 25s linear infinite'
      }}
    />
  </>
);

// Custom Animations Styles
export const CustomStyles = () => (
  <style jsx>{`
    @keyframes titleGlow {
      0%, 100% { text-shadow: 0 0 30px rgba(255,255,255,0.4); }
      50% { text-shadow: 0 0 60px rgba(255,255,255,0.8); }
    }

    @keyframes fieldGlow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(255,255,255,0.2);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 40px rgba(255,255,255,0.4);
        transform: scale(1.02);
      }
    }

    @keyframes borderShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes searchPulse {
      0%, 100% { 
        transform: scale(1); 
        box-shadow: 0 0 20px rgba(255,255,255,0.2); 
      }
      50% { 
        transform: scale(1.02); 
        box-shadow: 0 0 40px rgba(255,255,255,0.4); 
      }
    }

    @keyframes gradientMove {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
      20%, 40%, 60%, 80% { transform: translateX(3px); }
    }

    @keyframes slideDown {
      from { 
        opacity: 0; 
        transform: translateY(-20px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-8px) rotate(1deg); }
      50% { transform: translateY(-12px) rotate(0deg); }
      75% { transform: translateY(-8px) rotate(-1deg); }
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.4; }
    }

    .animate-shake {
      animation: shake 0.6s ease-in-out;
    }

    .animate-slideDown {
      animation: slideDown 0.4s ease-out;
    }

    .animate-fadeIn {
      animation: fadeIn 0.4s ease-out;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    /* Input autofill styles */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px rgba(0,0,0,0.8) inset;
      -webkit-text-fill-color: white;
      transition: background-color 5000s ease-in-out 0s;
    }

    /* Enhanced focus states */
    input:focus,
    textarea:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
    }

    /* Responsive text scaling */
    @media (max-width: 768px) {
      .text-8xl { font-size: 4rem; }
      .text-9xl { font-size: 5rem; }
      .text-6xl { font-size: 3rem; }
      .text-5xl { font-size: 2.5rem; }
    }

    @media (max-width: 640px) {
      .text-8xl { font-size: 3rem; }
      .text-9xl { font-size: 3.5rem; }
      .text-6xl { font-size: 2.5rem; }
      .text-5xl { font-size: 2rem; }
    }
  `}</style>
);