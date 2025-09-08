'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BlobbyPlantCard = ({ plant, isActive }) => {
  const { title, image, href, description } = plant;
  
  // Colors adjusted for plant theme
  const bgColor = isActive ? 'rgba(134, 239, 172, 1)' : 'rgba(134, 239, 172, 0.6)'; // Light green
  const btnColor = 'rgb(34, 197, 94)'; // Emerald green
  
  return (
    <div 
      className={`relative transition-all duration-500 ${
        isActive ? 'opacity-100 z-30' : 'opacity-70 z-10'
      }`}
      style={{
        width: '300px',
        height: '420px',
      }}
    >
      {/* Blobby/leafy background shape */}
      <div 
        className="absolute inset-0 flex flex-col items-center text-center p-6"
        style={{
          background: bgColor,
          borderRadius: '50% 50% 48% 52% / 50% 50% 52% 50%',
          boxShadow: isActive ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none',
          
          // These clip paths create the natural dripping effect
          clipPath: `
            polygon(
              0% 0%, 
              100% 0%, 
              100% 85%, 
              94% 85%, 
              94% 93%, 
              89% 93%, 
              89% 89%, 
              85% 89%, 
              85% 96%, 
              80% 96%, 
              80% 91%, 
              75% 91%, 
              75% 95%, 
              70% 95%, 
              70% 91%, 
              65% 91%, 
              65% 87%, 
              60% 87%, 
              60% 96%, 
              55% 96%, 
              55% 86%, 
              50% 86%, 
              50% 92%, 
              45% 92%, 
              45% 89%, 
              40% 89%, 
              40% 95%, 
              35% 95%, 
              35% 91%, 
              30% 91%, 
              30% 94%, 
              25% 94%, 
              25% 89%, 
              20% 89%, 
              20% 97%, 
              15% 97%, 
              15% 92%, 
              10% 92%, 
              10% 89%, 
              5% 89%, 
              5% 85%, 
              0% 85%
            )
          `,
        }}
      >
        {/* Circular cutout at top (like a pot) */}
        <div 
          className="w-20 h-20 bg-amber-50 rounded-full mt-4 mb-6 flex items-center justify-center"
          style={{
            backgroundColor: 'rgb(254, 243, 199)', // Warm cream background
          }}
        >
          {/* Small plant icon in the circle */}
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Plant content */}
        <h3 className="text-3xl font-bold text-gray-800 mb-3">{title}</h3>
        
        <p className="text-gray-700 mb-8 max-w-xs">
          {isActive ? description : description.substring(0, 60) + '...'}
        </p>
        
        <div className="text-3xl font-bold text-gray-800 mb-6">$24.99</div>
        
        <Link 
          href={href} 
          className="text-white px-8 py-4 rounded-full text-lg font-medium transition-colors hover:opacity-90"
          style={{
            backgroundColor: btnColor,
          }}
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
};

export default function BlobbyPlantsCarousel() {
  const [plants] = useState([
    {
      title: 'Monstera Deliciosa',
      image: '/api/placeholder/400/320',
      description: 'Large, glossy leaves with natural splits make this tropical beauty perfect for bright indoor spaces.',
      href: '/plants/monstera-deliciosa',
    },
    {
      title: 'Snake Plant',
      image: '/api/placeholder/400/320',
      description: 'Hardy succulent with striking upright leaves, perfect for beginners and low-light conditions.',
      href: '/plants/snake-plant',
    },
    {
      title: 'Fiddle Leaf Fig',
      image: '/api/placeholder/400/320',
      description: 'Dramatic broad leaves create a stunning focal point in any room with bright, indirect light.',
      href: '/plants/fiddle-leaf-fig',
    },
    {
      title: 'Peace Lily',
      image: '/api/placeholder/400/320',
      description: 'Elegant white blooms and dark green foliage thrive in medium to low light environments.',
      href: '/plants/peace-lily',
    },
    {
      title: 'Rubber Tree',
      image: '/api/placeholder/400/320',
      description: 'Glossy, thick leaves and easy care make this classic houseplant perfect for any home.',
      href: '/plants/rubber-tree',
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
        transform: 'translateX(-85%) scale(0.85)',
        opacity: 0.7,
      };
    }
    // Right card (next)
    else if (normalizedPosition === 1) {
      return {
        zIndex: 20,
        transform: 'translateX(85%) scale(0.85)',
        opacity: 0.7,
      };
    }
    // Far left card
    else if (normalizedPosition === -2) {
      return {
        zIndex: 10,
        transform: 'translateX(-150%) scale(0.7)',
        opacity: 0.4,
      };
    }
    // Far right card
    else if (normalizedPosition === 2) {
      return {
        zIndex: 10,
        transform: 'translateX(150%) scale(0.7)',
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
    <div className="py-20 overflow-hidden" style={{ backgroundColor: 'rgb(254, 243, 199)' }}>
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Premium Plant Collection</h2>
        <p className="text-gray-700 max-w-lg mx-auto text-center mb-16">
          Discover our beautiful selection of houseplants designed to bring life and freshness to your space.
        </p>
        
        <div className="relative max-w-6xl mx-auto h-[500px] mb-12">
          {/* Carousel display area */}
          <div className="absolute inset-0 flex justify-center items-center">
            {isClient && plants.map((plant, index) => (
              <div 
                key={plant.title}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={getCardStyle(index)}
              >
                <BlobbyPlantCard 
                  plant={plant} 
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-xl w-14 h-14 flex items-center justify-center z-40 focus:outline-none hover:bg-gray-100 transition-all border border-gray-200"
            aria-label="Previous plant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-xl w-14 h-14 flex items-center justify-center z-40 focus:outline-none hover:bg-gray-100 transition-all border border-gray-200"
            aria-label="Next plant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Plant indicator dots */}
        <div className="flex justify-center space-x-2 mt-2">
          {plants.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex 
                  ? 'bg-green-400 w-8' 
                  : 'bg-gray-300 w-2 hover:bg-green-200'
              }`}
              aria-label={`Go to plant ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}