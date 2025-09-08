"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// Project data
const projects = {
  businessWebsites: [
    {
      id: 1,
      title: "Whitegold",
      category: "Luxury Brand",
      description: "Premium luxury brand website with elegant design and sophisticated user experience",
      fullDescription: "Sophisticated business website for Whitegold featuring premium product showcases, brand storytelling, and elegant user experience designed to reflect luxury and exclusivity.",
      tech: ["Next.js", "Tailwind", "Framer Motion", "Sanity CMS"],
      features: ["Premium catalog", "Brand storytelling", "Elegant animations", "Contact management"],
      status: "Live",
      year: "2024"
    },
    {
      id: 2,
      title: "Doha Paints",
      category: "Corporate",
      description: "Professional paint company website with comprehensive product catalog",
      fullDescription: "Comprehensive business website for Doha Paints featuring extensive product catalogs, color visualization tools, project galleries, and professional consultation booking.",
      tech: ["React", "Next.js", "CSS3", "Node.js"],
      features: ["Color visualization", "Product catalog", "Project gallery", "Consultation booking"],
      status: "Live",
      year: "2024"
    }
  ],
  ecommerce: [
    {
      id: 3,
      title: "Elitnite",
      category: "E-commerce Platform",
      description: "Modern e-commerce platform with advanced management features",
      fullDescription: "Full-featured e-commerce platform for Elitnite with advanced product management, secure payment processing, inventory tracking, and customer management system.",
      tech: ["Next.js", "Stripe", "MongoDB", "Tailwind"],
      features: ["Product management", "Secure payments", "Inventory tracking", "Order management"],
      status: "Live",
      year: "2024"
    },
    {
      id: 4,
      title: "WellFit",
      category: "Health & Fitness",
      description: "Specialized fitness e-commerce with workout plans and nutrition guides",
      fullDescription: "Specialized e-commerce platform for WellFit focusing on health and fitness products with workout plans, nutrition guides, and personalized recommendations.",
      tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
      features: ["Fitness products", "Workout plans", "Nutrition guides", "Recommendations"],
      status: "Live",
      year: "2024"
    },
    {
      id: 5,
      title: "RegioJewels",
      category: "Luxury Jewelry",
      description: "Elegant jewelry e-commerce with virtual try-on features",
      fullDescription: "Elegant e-commerce solution for RegioJewels featuring high-quality jewelry collections, custom design options, virtual try-on, and secure luxury shipping.",
      tech: ["Next.js", "Tailwind", "Strapi", "PayPal"],
      features: ["Jewelry catalog", "Virtual try-on", "Custom designs", "Secure shipping"],
      status: "Live",
      year: "2024"
    },
    {
      id: 6,
      title: "BellaMontre",
      category: "Premium Watches",
      description: "Premium timepiece store with authenticity certificates",
      fullDescription: "Sophisticated e-commerce platform for BellaMontre specializing in premium timepieces with detailed views, authenticity certificates, and luxury packaging.",
      tech: ["Vue.js", "Nuxt.js", "MongoDB", "Stripe"],
      features: ["Watch catalog", "Authenticity certificates", "Detailed views", "Luxury packaging"],
      status: "Live",
      year: "2024"
    }
  ],
  aiBots: [
    {
      id: 7,
      title: "Whatify",
      category: "WhatsApp Bot",
      description: "Intelligent WhatsApp automation for customer support",
      fullDescription: "Advanced WhatsApp chatbot solution providing automated customer support, order processing, appointment scheduling, and intelligent conversation management.",
      tech: ["Node.js", "WhatsApp API", "OpenAI", "MongoDB"],
      features: ["Auto responses", "Order processing", "Scheduling", "Smart conversations"],
      status: "Live",
      year: "2024"
    },
    {
      id: 8,
      title: "Xyro",
      category: "Instagram Bot",
      description: "Instagram automation with engagement and analytics",
      fullDescription: "Comprehensive Instagram automation solution featuring content scheduling, engagement automation, follower management, and analytics dashboard for social media growth.",
      tech: ["Python", "Instagram API", "React", "PostgreSQL"],
      features: ["Content scheduling", "Auto engagement", "Follower management", "Analytics"],
      status: "Live",
      year: "2024"
    }
  ]
};

// Artistic components
const InkBlot = ({ size = "w-3 h-3", delay = 0, className = "" }) => (
  <motion.div
    className={`absolute bg-gray-800 rounded-full ${size} ${className}`}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 0.3 }}
    transition={{ 
      duration: 0.6, 
      delay,
      type: "spring",
      stiffness: 200,
      damping: 10
    }}
    style={{ 
      filter: 'blur(0.5px)',
      clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
    }}
  />
);

const InkStroke = ({ path, delay = 0, duration = 2, className = "" }) => (
  <motion.svg 
    className={`absolute pointer-events-none ${className}`} 
    viewBox="0 0 100 100"
    style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.1))' }}
  >
    <motion.path
      d={path}
      stroke="#2d3748"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ 
        duration, 
        delay, 
        ease: "easeInOut",
        opacity: { duration: 0.3, delay }
      }}
      style={{ strokeDasharray: '3,2' }}
    />
  </motion.svg>
);

const PaperTexture = ({ className = "" }) => (
  <div 
    className={`absolute inset-0 opacity-20 pointer-events-none ${className}`}
    style={{
      backgroundImage: `
        radial-gradient(circle at 15% 25%, #8b5cf6 1px, transparent 1px),
        radial-gradient(circle at 85% 75%, #3b82f6 1px, transparent 1px),
        radial-gradient(circle at 45% 85%, #ef4444 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px, 45px 45px, 35px 35px'
    }}
  />
);

// Header Component
const Header = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 30%, #f0f9ff 70%, #fef3c7 100%)'
      }}
    >
      {/* Background ink washes */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute top-20 right-32 w-96 h-96 bg-blue-900 rounded-full"
          style={{ filter: 'blur(40px)' }}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 4, delay: 1, ease: "easeOut" }}
          className="absolute bottom-32 left-24 w-80 h-80 bg-purple-900 rounded-full"
          style={{ filter: 'blur(50px)' }}
        />
      </div>

      {/* Decorative ink elements */}
      <InkStroke 
        path="M10,20 Q30,5 50,20 Q70,35 90,20 M15,80 Q35,65 55,80 Q75,95 95,80" 
        className="top-16 left-16 w-32 h-32 text-gray-600"
        delay={2}
      />
      <InkBlot size="w-4 h-4" className="top-32 left-1/3" delay={2.5} />
      <InkBlot size="w-2 h-2" className="top-48 right-1/4" delay={3} />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-2xl relative"
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,252,232,0.9) 100%)'
          }}
        >
          <PaperTexture />
          
          <InkBlot size="w-6 h-6" className="top-4 right-8" delay={4} />
          <InkBlot size="w-4 h-4" className="bottom-6 left-6" delay={4.5} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-gray-800 mb-8 relative"
              style={{ 
                fontFamily: 'Georgia, serif',
                textShadow: '3px 3px 0px rgba(0,0,0,0.05)'
              }}
            >
              PORTFOLIO
              <motion.svg
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-8"
                viewBox="0 0 600 30"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 3, delay: 2 }}
              >
                <path
                  d="M50 20 Q150 8 300 15 Q450 22 550 12"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  style={{ strokeDasharray: '6,4' }}
                />
              </motion.svg>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="bg-blue-100 px-6 py-3 rounded-2xl relative">
                  <span className="text-lg font-semibold text-blue-800">2023</span>
                  <InkBlot size="w-2 h-2" className="-top-1 -right-1" delay={5} />
                </div>
                
                <InkStroke 
                  path="M10,50 Q30,30 50,50 Q70,30 90,50" 
                  className="w-24 h-12"
                  delay={5.5}
                />
                
                <div className="bg-green-100 px-6 py-3 rounded-2xl relative">
                  <span className="text-lg font-semibold text-green-800">2025</span>
                  <InkBlot size="w-2 h-2" className="-top-1 -left-1" delay={6} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl relative">
                <InkStroke 
                  path="M5,5 Q15,2 25,5 Q35,8 45,5 M5,45 Q15,42 25,45 Q35,48 45,45" 
                  className="top-2 left-4 w-16 h-16 opacity-30"
                  delay={6.5}
                />
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Elitnite
                </h2>
                <p className="text-xl text-gray-700 mb-2">Full Stack Development</p>
                <p className="text-lg text-gray-600 mb-2">info@elitnite.com</p>
                <p className="text-lg text-gray-600">2+ Years Experience • Modern Web Applications</p>
                
                <InkBlot size="w-5 h-5" className="bottom-4 right-6" delay={7} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ project, index, onClick, categoryColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 12
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -15, 
        rotate: index % 2 === 0 ? 1 : -1,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group relative h-[600px]"
    >
      <div 
        className="h-full bg-white rounded-3xl shadow-xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fdfdfd 100%)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.2)'
        }}
      >
        <PaperTexture />

        {/* Header section */}
        <div className={`h-48 relative ${categoryColor} overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {[...Array(8)].map((_, i) => (
                <g key={i}>
                  <motion.line
                    x1={i * 50}
                    y1="0"
                    x2={i * 50}
                    y2="200"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2, delay: i * 0.1 + 2 }}
                    style={{ strokeDasharray: '4,8' }}
                  />
                  <motion.line
                    x1="0"
                    y1={i * 25}
                    x2="400"
                    y2={i * 25}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2, delay: i * 0.1 + 2.5 }}
                    style={{ strokeDasharray: '4,8' }}
                  />
                </g>
              ))}
            </svg>
          </div>

          <div className="absolute top-8 left-8 text-white z-10">
            <div className="text-6xl font-black opacity-50 relative" style={{ fontFamily: 'Georgia, serif' }}>
              0{index + 1}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                <motion.circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 2, delay: index * 0.5 + 3 }}
                  style={{ 
                    strokeDasharray: '8,6',
                    transform: 'rotate(-15deg)',
                    transformOrigin: 'center'
                  }}
                />
              </svg>
            </div>
          </div>

          <div className="absolute top-8 right-8 text-white/30 font-mono text-lg z-10">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 4, duration: 1 }}
            >
              <div>&lt;/&gt;</div>
              <div>{ }</div>
              <div>[ ]</div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-8 flex items-center gap-3 text-white z-10">
            <motion.div 
              className="w-3 h-3 bg-green-400 rounded-full relative"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0.7)',
                  '0 0 0 10px rgba(34, 197, 94, 0)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
            </motion.div>
            <span className="text-sm font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              {project.status}
            </span>
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center p-6 text-white z-30"
              >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-2xl font-bold mb-4 relative" style={{ fontFamily: 'Georgia, serif' }}>
                    {project.title}
                    <motion.svg
                      className="absolute -bottom-2 left-0 w-full h-2"
                      viewBox="0 0 200 8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <path
                        d="M10 4 Q50 2 100 5 Q150 8 190 4"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        style={{ strokeDasharray: '3,2' }}
                      />
                    </motion.svg>
                  </h3>
                  <p className="text-sm opacity-90 mb-4 leading-relaxed bg-white/10 p-3 rounded-lg">
                    {project.fullDescription}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {project.tech.slice(0, 3).map((tech, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs rounded-full font-semibold relative"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white text-black rounded-xl text-sm font-bold shadow-xl relative overflow-hidden"
                  >
                    Explore →
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-transparent border border-white/60 text-white rounded-xl text-sm font-bold backdrop-blur-sm"
                  >
                    Demo
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content section */}
        <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 300 400">
              {[...Array(12)].map((_, i) => (
                <motion.line
                  key={i}
                  x1="25"
                  y1={25 + i * 30}
                  x2="275"
                  y2={25 + i * 30}
                  stroke="#4a5568"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 2, delay: i * 0.05 + 3 }}
                  style={{ strokeDasharray: '6,12' }}
                />
              ))}
              <motion.line
                x1="60"
                y1="15"
                x2="60"
                y2="385"
                stroke="#ef4444"
                strokeWidth="0.8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, delay: 4 }}
              />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 relative" style={{ fontFamily: 'Georgia, serif' }}>
                {project.title}
                <motion.div
                  className="absolute -inset-1 bg-yellow-300 opacity-30 rounded-lg -z-10"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.3 }}
                  transition={{ duration: 1.2, delay: 5 }}
                  style={{ transformOrigin: 'left' }}
                />
              </h3>
              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                {project.year}
              </div>
            </div>

            <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-xl text-sm font-semibold mb-4 relative">
              {project.category}
              <InkBlot size="w-1 h-1" className="-top-0.5 -right-0.5" delay={6} />
            </div>
            
            <div className="text-gray-700 text-base leading-relaxed mb-6 bg-amber-50/50 p-4 rounded-2xl relative">
              {project.description}
              <div className="absolute bottom-3 right-4 w-6 h-6 border border-amber-400 rounded-full opacity-20" />
              <div className="absolute bottom-4 right-5 w-4 h-4 border border-amber-500 rounded-full opacity-15" />
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h4>
              {project.features.slice(0, 3).map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 + 6 }}
                  className="flex items-center gap-3 text-gray-600 text-sm"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20">
                    <motion.circle
                      cx="10"
                      cy="10"
                      r="6"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.7 }}
                      transition={{ duration: 1, delay: i * 0.3 + 6.5 }}
                      style={{ strokeDasharray: '4,2' }}
                    />
                    <motion.path
                      d="M6 10 L8 12 L14 8"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 0.8, delay: i * 0.3 + 7 }}
                    />
                  </svg>
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-4">
            <svg className="absolute top-0 left-0 right-0 h-6" viewBox="0 0 300 12">
              <motion.path
                d="M20 6 Q75 3 150 8 Q225 11 280 5"
                stroke="#d1d5db"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, delay: 7 }}
                style={{ strokeDasharray: '5,4' }}
              />
            </svg>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tech.slice(0, 3).map((tech, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 + 7.5 }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold relative"
                >
                  {tech}
                  <InkBlot size="w-0.5 h-0.5" className="-top-0.5 -right-0.5" delay={i * 0.2 + 8} />
                </motion.span>
              ))}
              {project.tech.length > 3 && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 8.5 }}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold relative"
                >
                  +{project.tech.length - 3}
                </motion.span>
              )}
            </div>
          </div>

          <InkBlot size="w-2 h-2" className="bottom-4 right-6 opacity-20" delay={9.5} />
        </div>
      </div>

      <InkBlot size="w-1 h-1" className="-top-2 -left-2" delay={index * 0.5 + 10.5} />
      <InkBlot size="w-2 h-2" className="-bottom-3 -right-3" delay={index * 0.5 + 11} />
    </motion.div>
  );
};

// Project Modal Component
const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotate: 3 }}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #fefefe 50%, #fdfdfd 100%)',
              boxShadow: '0 30px 80px -12px rgba(0, 0, 0, 0.4)'
            }}
          >
            <PaperTexture />
            
            <InkBlot size="w-6 h-6" className="top-8 right-16 opacity-10" delay={0.5} />
            <InkBlot size="w-4 h-4" className="bottom-24 left-12 opacity-15" delay={1} />

            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b px-8 py-6 flex justify-between items-center rounded-t-3xl relative z-20">
              <h2 className="text-3xl font-bold text-gray-800 relative" style={{ fontFamily: 'Georgia, serif' }}>
                {project.title}
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 300 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                >
                  <path
                    d="M10 6 Q75 3 150 8 Q225 10 290 5"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    style={{ strokeDasharray: '4,3' }}
                  />
                </motion.svg>
              </h2>
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors relative"
              >
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <InkBlot size="w-1 h-1" className="-top-1 -right-1" delay={1.5} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 relative z-10">
              {/* Project images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((imageNum, index) => (
                  <motion.div 
                    key={imageNum}
                    initial={{ opacity: 0, y: 30, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.3 }}
                    className="aspect-video bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                  >
                    <span className="text-gray-500 text-lg font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                      Project Screenshot {imageNum}
                    </span>
                    
                    <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-gray-400 opacity-60" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-gray-400 opacity-60" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-gray-400 opacity-60" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-gray-400 opacity-60" />
                    
                    <div className="absolute -top-1 left-1/4 w-12 h-6 bg-yellow-200 opacity-60 rotate-12 rounded-sm" />
                    <div className="absolute -top-1 right-1/4 w-12 h-6 bg-yellow-200 opacity-60 -rotate-12 rounded-sm" />
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 relative" style={{ fontFamily: 'Georgia, serif' }}>
                  Project Description
                  <motion.div
                    className="absolute -inset-1 bg-yellow-200 opacity-25 rounded-lg -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1.2 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </h3>
                <div className="text-gray-700 leading-relaxed text-lg bg-blue-50/50 p-6 rounded-2xl relative">
                  {project.fullDescription}
                  <div className="absolute bottom-4 right-6 w-8 h-8 border-2 border-amber-300 rounded-full opacity-20" />
                  <div className="absolute bottom-5 right-7 w-6 h-6 border-2 border-amber-400 rounded-full opacity-15" />
                  <div className="absolute bottom-6 right-8 w-4 h-4 border-2 border-amber-500 rounded-full opacity-10" />
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech, index) => (
                    <motion.span 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 1 }}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-base font-semibold relative"
                      style={{
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        boxShadow: '2px 2px 4px rgba(59, 130, 246, 0.1)'
                      }}
                    >
                      {tech}
                      <InkBlot size="w-1 h-1" className="-top-1 -right-1 opacity-60" delay={index * 0.2 + 1.5} />
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 + 1.2 }}
                      className="flex items-center text-gray-700 text-base bg-green-50/50 p-3 rounded-xl relative"
                    >
                      <svg className="w-8 h-8 mr-3 flex-shrink-0" viewBox="0 0 32 32">
                        <motion.circle
                          cx="16"
                          cy="16"
                          r="10"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="1.5"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.7 }}
                          transition={{ duration: 1, delay: index * 0.2 + 1.5 }}
                          style={{ strokeDasharray: '5,3' }}
                        />
                        <motion.path
                          d="M10 16 L14 20 L22 12"
                          stroke="#22c55e"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.9 }}
                          transition={{ duration: 0.8, delay: index * 0.2 + 1.8 }}
                        />
                      </svg>
                      <span className="font-medium">{feature}</span>
                      <InkBlot size="w-0.5 h-0.5" className="top-2 right-3 opacity-40" delay={index * 0.3 + 2} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex gap-4 pt-6 border-t relative"
              >
                <svg className="absolute top-0 left-0 right-0 h-6" viewBox="0 0 400 12">
                  <motion.path
                    d="M25 6 Q100 3 200 8 Q300 11 375 5"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2, delay: 1.4 }}
                    style={{ strokeDasharray: '6,4' }}
                  />
                </svg>

                <motion.button
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-bold text-lg relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  View Live Demo
                  <InkBlot size="w-2 h-2" className="top-2 right-3 opacity-30" delay={2} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-lg relative"
                  style={{
                    background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  View Source Code
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Category Section Component
const CategorySection = ({ title, number, description, projects, categoryColor, onProjectClick }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-black rounded-full" style={{ filter: 'blur(60px)' }} />
        <div className="absolute bottom-48 right-1/3 w-80 h-80 bg-blue-600 rounded-full" style={{ filter: 'blur(70px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-8 mb-8">
            <div className="text-6xl font-black text-gray-200 relative" style={{ fontFamily: 'Georgia, serif' }}>
              .{number}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  style={{ 
                    strokeDasharray: '10,6',
                    transform: 'rotate(20deg)',
                    transformOrigin: 'center'
                  }}
                />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3 relative" style={{ fontFamily: 'Georgia, serif' }}>
                {title}
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full h-4"
                  viewBox="0 0 300 16"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 2.5, delay: 1 }}
                >
                  <path
                    d="M20 10 Q75 5 150 12 Q225 16 280 8"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    style={{ strokeDasharray: '8,5' }}
                  />
                </motion.svg>
              </h2>
              <p className="text-gray-600 text-lg bg-white/60 px-4 py-2 rounded-2xl inline-block">
                {description}
              </p>
            </div>
          </div>
          
          <InkBlot size="w-4 h-4" className="absolute top-8 right-16 opacity-20" delay={2} />
          <InkStroke 
            path="M10,10 Q30,30 50,10 Q70,30 90,10" 
            className="absolute top-4 right-32 w-16 h-12 opacity-30"
            delay={2.5}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => onProjectClick(project)}
              categoryColor={categoryColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Contents Overview Component
const ContentsOverview = () => {
  return (
    <section className="py-20 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 40%, #f0f9ff 100%)'
      }}
    >
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-40 left-20 w-40 h-40 bg-black rounded-full" style={{ filter: 'blur(25px)' }} />
        <div className="absolute bottom-32 right-32 w-32 h-32 bg-purple-600 rounded-full" style={{ filter: 'blur(30px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-5xl font-bold text-gray-800 mb-3 relative" style={{ fontFamily: 'Georgia, serif' }}>
              Contents
              <div className="absolute -top-3 -right-10 w-6 h-6 bg-black opacity-15 rounded-full"
                style={{ clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 85% 65%, 75% 90%, 50% 100%, 25% 90%, 15% 65%, 0% 35%, 20% 10%)' }}
              />
            </h2>
            <p className="text-gray-600 text-lg bg-white/70 px-4 py-2 rounded-2xl inline-block">
              Portfolio Overview
            </p>
          </div>
          
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 text-gray-400 relative"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                style={{ strokeDasharray: '4,3' }}
              />
            </svg>
            <InkBlot size="w-1 h-1" className="-top-1 -right-1" delay={1} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Business Websites */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden"
              style={{
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <PaperTexture className="opacity-20" />

              <div className="relative z-10">
                <div className="text-6xl font-black opacity-30 mb-6" style={{ fontFamily: 'Georgia, serif' }}>01</div>
                <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Business Websites
                </h3>
                <p className="text-blue-100 mb-6 text-base bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
                  Professional Solutions
                </p>
                <div className="space-y-2 text-base text-blue-100">
                  <div className="flex items-center gap-2">
                    <InkBlot size="w-1 h-1" className="relative opacity-60" />
                    <span>Premium Brand Websites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <InkBlot size="w-1 h-1" className="relative opacity-60" />
                    <span>Corporate Solutions</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-6 w-8 h-8 bg-white opacity-15 rounded-full" style={{ filter: 'blur(4px)' }} />
              <InkBlot size="w-3 h-3" className="bottom-6 left-6 opacity-40" delay={2} />
            </div>
          </motion.div>

          {/* E-commerce */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fdfdfd 100%)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}
            >
              <PaperTexture />

              <div className="relative z-10">
                <div className="text-6xl font-black text-gray-200 mb-6" style={{ fontFamily: 'Georgia, serif' }}>02</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  E-commerce
                </h3>
                <p className="text-gray-600 mb-6 text-base bg-purple-50 px-3 py-2 rounded-xl">
                  Online Stores
                </p>
                <div className="space-y-2 text-base text-gray-600">
                  <div className="flex items-center gap-2">
                    <InkBlot size="w-1 h-1" className="relative opacity-60" />
                    <span>Full-featured Stores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <InkBlot size="w-1 h-1" className="relative opacity-60" />
                    <span>Payment Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <InkBlot size="w-1 h-1" className="relative opacity-60" />
                    <span>Inventory Management</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-6 right-8 w-8 h-8 border-2 border-amber-300 rounded-full opacity-20" />
              <div className="absolute top-7 right-9 w-6 h-6 border-2 border-amber-400 rounded-full opacity-15" />
              <InkBlot size="w-2 h-2" className="bottom-8 left-6 opacity-30" delay={2.5} />
            </div>
          </motion.div>

          {/* AI Bots */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group"
          >
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden"
              style={{
                boxShadow: '0 20px 40px rgba(251, 146, 60, 0.3)'
              }}
            >
              <PaperTexture className="opacity-20" />

              <div className="relative z-10">
                <div className="text-6xl font-black opacity-30 mb-6" style={{ fontFamily: 'Georgia, serif' }}>03</div>
                <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  AI Bots
                </h3>
                <p className="text-orange-100 mb-6 text-base bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
                  Chat Automation
                </p>
                <div className="space-y-2 text-base text-orange-100">
                  <div className="flex items-center gap-2">
                    <InkBlot size="w-1 h-1" className="relative opacity-60" />
                    <span>WhatsApp Automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <InkBlot size="w-1 h-1" className="relative opacity-60" />
                    <span>Social Media Bots</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-3 right-6 w-4 h-4 bg-white opacity-25 rounded-full" />
              <div className="absolute top-5 right-4 w-2 h-2 bg-white opacity-35 rounded-full" />
              <div className="absolute bottom-6 left-4 w-6 h-6 bg-white opacity-20"
                style={{ clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 85% 65%, 75% 90%, 50% 100%, 25% 90%, 15% 65%, 0% 35%, 20% 10%)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
// Artistic footer
const ArtisticFooter = () => {
  return (
    <footer className="py-32 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 30%, #f0f9ff 70%, #fef3c7 100%)'
      }}
    >
      {/* Background ink washes */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-32 left-1/4 w-64 h-64 bg-black rounded-full" style={{ filter: 'blur(40px)' }} />
        <div className="absolute bottom-40 right-1/3 w-48 h-48 bg-blue-600 rounded-full" style={{ filter: 'blur(50px)' }} />
      </div>

      <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
        {/* Signature logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="relative inline-block mb-16"
        >
          <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto flex items-center justify-center relative"
            style={{
              boxShadow: '0 15px 35px rgba(0,0,0,0.2), 5px 5px 0px rgba(0,0,0,0.1)'
            }}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative">
              <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>JD</span>
            </div>
            
            {/* Decorative ink drops around logo */}
            <InkBlot size="w-4 h-4" className="-top-2 -right-2 opacity-60" delay={1} />
            <InkBlot size="w-3 h-3" className="-bottom-1 -left-3 opacity-70" delay={1.5} />
          </div>
          
          {/* Hand-drawn circle around logo */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 130 130">
            <motion.circle
              cx="65"
              cy="65"
              r="55"
              stroke="#4a5568"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 3, delay: 0.5 }}
              style={{ 
                strokeDasharray: '8,5',
                transform: 'rotate(-10deg)',
                transformOrigin: 'center'
              }}
            />
          </svg>
        </motion.div>
        
        {/* Thank you message */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-7xl font-bold text-gray-800 mb-16 relative" style={{ fontFamily: 'Georgia, serif' }}
        >
          THANK YOU
          {/* Hand-drawn flourish */}
          <motion.svg
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-64 h-12"
            viewBox="0 0 250 48"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 4, delay: 1.5 }}
          >
            <path
              d="M20 24 Q60 8 125 28 Q190 48 230 24 M30 35 Q70 20 125 38 Q180 56 220 35"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              style={{ strokeDasharray: '6,4' }}
            />
          </motion.svg>
        </motion.h2>
        
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16"
        >
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border-2 border-gray-200 shadow-lg relative">
            <PaperTexture className="opacity-10" />
            <p className="text-xl text-black font-bold mb-3">Full Stack Development | Portfolio 2025</p>
            <p className="text-lg text-black">info@elitnite.com</p>
            <InkBlot size="w-3 h-3 text-black" className="top-4 right-6 opacity-30" delay={2} />
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border-2 border-gray-200 shadow-lg text-right relative">
            <PaperTexture className="opacity-10" />
            <p className="text-xl font-bold mb-3 text-black">Modern Web Development and Ecommerce</p>
            <p className="text-lg text-black">3+ Years Experience</p>
            {/* Coffee ring stains */}
            <div className="absolute bottom-6 left-6 w-6 h-6 border-2 border-amber-300 rounded-full opacity-15" />
            <div className="absolute bottom-7 left-7 w-4 h-4 border-2 border-amber-400 rounded-full opacity-20" />
          </div>
        </motion.div>
        
        {/* Final signature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative inline-block"
        >
          <div className="text-5xl font-bold text-gray-800 relative" style={{ fontFamily: 'Georgia, serif' }}>
            DONE
            {/* Stamp effect */}
            <motion.svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 120 60"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <rect
                x="10"
                y="10"
                width="100"
                height="40"
                stroke="#dc2626"
                strokeWidth="3"
                fill="none"
                rx="6"
                style={{ 
                  strokeDasharray: '6,4',
                  transform: 'rotate(-8deg)',
                  transformOrigin: 'center'
                }}
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Final decorative elements */}
        <InkStroke 
          path="M10,30 Q30,10 50,30 Q70,50 90,30" 
          className="absolute top-20 left-20 w-20 h-16 opacity-20"
          delay={3}
        />
        <InkStroke 
          path="M20,50 Q50,20 80,50 M10,10 Q40,40 70,10" 
          className="absolute bottom-24 right-24 w-16 h-16 opacity-20"
          delay={3.5}
        />
      </div>
    </footer>
  );
};

// Main Portfolio Component
export default function InkPortfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <Head>
        <title>Developer Portfolio - Ink & Code Artistry</title>
        <meta name="description" content="Artistic developer portfolio with hand-drawn ink aesthetics, showcasing business websites, e-commerce platforms, and AI-powered applications." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <Header/>

        {/* Contents */}
        <ContentsOverview/>

        {/* Portfolio Sections */}
        <CategorySection
          title="Business Websites"
          number="01"
          description="Professional Solutions"
          projects={projects.businessWebsites}
          categoryColor="bg-gradient-to-br from-blue-500 to-blue-600"
          onProjectClick={handleProjectClick}
        />

        <CategorySection
          title="E-commerce"
          number="02"
          description="Online Stores"
          projects={projects.ecommerce}
          categoryColor="bg-gradient-to-br from-purple-400 to-pink-500"
          onProjectClick={handleProjectClick}
        />

        <CategorySection
          title="AI Bots"
          number="03"
          description="Chat Automation"
          projects={projects.aiBots}
          categoryColor="bg-gradient-to-br from-orange-400 to-red-500"
          onProjectClick={handleProjectClick}
        />

        {/* Footer */}
        <ArtisticFooter />

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
}