'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ModernPlantCard = ({ plant, isActive }) => {
  const { title, image, href, description, careLevel, lightRequirement } = plant;
  
  return (
    <div 
      className={`flex flex-col bg-white overflow-hidden transition-all duration-300 ${
        isActive 
          ? 'shadow-xl transform scale-105' 
          : 'shadow-md filter blur-[1px]'
      }`}
      style={{
        width: '280px',
        height: '400px',
        boxShadow: isActive ? '0 10px 25px rgba(0, 0, 0, 0.1)' : '0 5px 15px rgba(0, 0, 0, 0.05)',
        borderRadius: '24px',
      }}
    >
      {/* Plant Image */}
      <div 
        className="relative h-64 w-full bg-gradient-to-br from-green-50 to-emerald-100"
        style={{
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden'
        }}
      >
        <Image 
          src={image} 
          alt={title}
          fill
          style={{ 
            objectFit: 'contain', 
            transition: 'transform 0.5s ease-in-out'
          }}
          className={isActive ? 'scale-105' : 'scale-100'}
          sizes="(max-width: 768px) 100vw, 280px"
        />
        
        {/* Care level badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            careLevel === 'Easy' 
              ? 'bg-green-100 text-green-800' 
              : careLevel === 'Medium' 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {careLevel} Care
          </span>
        </div>
      </div>
      
      {/* Plant Info */}
      <div className="px-6 pt-4 pb-6 flex flex-col flex-grow z-10 relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        
        {isActive && (
          <>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L8.5 6H4l3.5 3-1 4 3.5-2 3.5 2-1-4L16 6h-4.5L10 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-500">{lightRequirement} light</span>
            </div>
          </>
        )}
        
        <div className="mt-auto">
          <Link 
            href={href} 
            className="text-green-700 font-medium flex items-center group"
          >
            View Details
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Decorative leaf elements only on active card */}
      {isActive && (
        <>
          <div 
            className="absolute -bottom-3 right-8 w-2 h-6 bg-green-600 opacity-20"
            style={{ 
              borderRadius: '50% 50% 0 0',
              transform: 'rotate(15deg)'
            }}
          ></div>
          <div 
            className="absolute -bottom-5 right-14 w-3 h-10 bg-green-500 opacity-15"
            style={{ 
              borderRadius: '50% 50% 0 0',
              transform: 'rotate(-10deg)'
            }}
          ></div>
          <div 
            className="absolute -bottom-2 right-20 w-2 h-5 bg-emerald-600 opacity-10"
            style={{ 
              borderRadius: '50% 50% 0 0',
              transform: 'rotate(25deg)'
            }}
          ></div>
        </>
      )}
    </div>
  );
};

export default function ModernPlantsCarousel() {
  const [plants] = useState([
    {
      title: 'Monstera Deliciosa',
      image: '/plants/monstera-deliciosa.png',
      description: 'Large, glossy leaves with natural splits make this tropical beauty perfect for bright spaces.',
      href: '/plants',
      careLevel: 'Easy',
      lightRequirement: 'Bright indirect'
    },
    {
      title: 'Snake Plant',
      image: '/plants/snake-plant.png',
      description: 'Hardy succulent with striking upright leaves, perfect for beginners and low-light areas.',
      href: '/plants',
      careLevel: 'Easy',
      lightRequirement: 'Low to bright'
    },
    {
      title: 'Fiddle Leaf Fig',
      image: '/plants/fiddle-leaf-fig.png',
      description: 'Dramatic broad leaves create a stunning focal point in bright, indirect light.',
      href: '/plants',
      careLevel: 'Medium',
      lightRequirement: 'Bright indirect'
    },
    {
      title: 'Peace Lily',
      image: '/plants/peace-lily.png',
      description: 'Elegant white blooms and dark green foliage thrive in medium light.',
      href: '/plants',
      careLevel: 'Easy',
      lightRequirement: 'Medium'
    },
    {
      title: 'Rubber Tree',
      image: '/plants/rubber-tree.png',
      description: 'Glossy, thick leaves and easy care make this classic houseplant perfect.',
      href: '/plants',
      careLevel: 'Easy',
      lightRequirement: 'Bright indirect'
    },
    {
      title: 'Pothos',
      image: '/plants/pothos.png',
      description: 'Trailing vine with heart-shaped leaves, perfect for hanging baskets.',
      href: '/plants',
      careLevel: 'Easy',
      lightRequirement: 'Low to medium'
    },
    {
      title: 'ZZ Plant',
      image: '/plants/zz-plant.png',
      description: 'Glossy, waxy leaves on upright stems, extremely drought tolerant.',
      href: '/plants',
      careLevel: 'Easy',
      lightRequirement: 'Low to bright'
    },
    {
      title: 'Bird of Paradise',
      image: '/plants/bird-of-paradise.png',
      description: 'Large paddle-shaped leaves create a tropical statement piece.',
      href: '/plants',
      careLevel: 'Medium',
      lightRequirement: 'Bright direct'
    },
    {
      title: 'Calathea',
      image: '/plants/calathea.png',
      description: 'Beautifully patterned leaves that fold up at night like praying hands.',
      href: '/plants',
      careLevel: 'Hard',
      lightRequirement: 'Medium indirect'
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + plants.length) % plants.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % plants.length);
  };
  
  // Calculate positions for each card
  const getCardStyle = (index) => {
    const position = index - activeIndex;
    
    // Handle wrapping for edge cases
    const normalizedPosition = 
      position < -Math.floor(plants.length / 2) 
        ? position + plants.length 
        : position > Math.floor(plants.length / 2) 
          ? position - plants.length 
          : position;
    
    // Active card
    if (normalizedPosition === 0) {
      return {
        zIndex: 30,
        transform: 'translateX(0) scale(1)',
        opacity: 1,
      };
    }
    // Left card (previous)
    else if (normalizedPosition === -1) {
      return {
        zIndex: 20,
        transform: 'translateX(-90%) scale(0.85)',
        opacity: 0.7,
      };
    }
    // Right card (next)
    else if (normalizedPosition === 1) {
      return {
        zIndex: 20,
        transform: 'translateX(90%) scale(0.85)',
        opacity: 0.7,
      };
    }
    // Far left card
    else if (normalizedPosition === -2) {
      return {
        zIndex: 10,
        transform: 'translateX(-160%) scale(0.7)',
        opacity: 0.4,
      };
    }
    // Far right card
    else if (normalizedPosition === 2) {
      return {
        zIndex: 10,
        transform: 'translateX(160%) scale(0.7)',
        opacity: 0.4,
      };
    }
    // Hidden cards
    else {
      return {
        zIndex: 0,
        transform: 'translateX(0) scale(0)',
        opacity: 0,
      };
    }
  };

  return (
    <div className="py-20 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Premium Plant Collection</h2>
        <p className="text-gray-700 max-w-lg mx-auto text-center mb-16">
          Discover our beautiful selection of houseplants designed to bring life and freshness to your space.
        </p>
        
        <div className="relative max-w-6xl mx-auto h-[450px] mb-12">
          {/* Carousel display area */}
          <div className="absolute inset-0 flex justify-center items-center">
            {isClient && plants.map((plant, index) => (
              <div 
                key={plant.title}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={getCardStyle(index)}
              >
                <ModernPlantCard 
                  plant={plant} 
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Navigation arrows - plant themed */}
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center z-40 focus:outline-none hover:bg-green-50 transition-all border border-green-100"
            aria-label="Previous plant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center z-40 focus:outline-none hover:bg-green-50 transition-all border border-green-100"
            aria-label="Next plant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Plant indicator dots - green themed */}
        <div className="flex justify-center space-x-3 mt-2">
          {plants.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all ${
                index === activeIndex 
                  ? 'bg-green-600 w-8 h-3 rounded-full' 
                  : 'bg-gray-300 w-3 h-3 rounded-full hover:bg-green-300'
              }`}
              aria-label={`Go to plant ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}