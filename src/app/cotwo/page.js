"use client"
import React, { useState, useEffect } from 'react';

const AnimatedCodingVisual = () => {
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [typedCode, setTypedCode] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const [codeOutput, setCodeOutput] = useState([]);

  // Different code snippets to cycle through
  const codeSnippets = [
    {
      code: `// Creating a neural network
const network = new NeuralNetwork({
  layers: [784, 128, 64, 10],
  activation: 'relu'
});

// Training the model
network.train(trainingData, {
  epochs: 100,
  learningRate: 0.001
});

// Making predictions
const prediction = network.predict(inputData);
console.log('Prediction:', prediction);`,
      output: 'neural-network',
      description: 'AI Neural Network Training'
    },
    {
      code: `// Quantum computing simulation
const qubit = new QuantumBit();
qubit.hadamard(); // Superposition
qubit.cnot(targetQubit); // Entanglement

// Quantum circuit
const circuit = new QuantumCircuit(8);
circuit.h(0).cx(0, 1).measure();

// Run simulation
const result = circuit.run(1000);
console.log('Quantum result:', result);`,
      output: 'quantum',
      description: 'Quantum Computing Simulation'
    },
    {
      code: `// Data visualization magic
const data = generateRandomData(1000);
const visualization = d3.select('#chart')
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', d => d.value * 10)
  .attr('cx', (d, i) => i * 20)
  .attr('cy', d => 300 - d.value * 50)
  .style('fill', d => d.color);

// Animate the visualization
visualization.transition()
  .duration(2000)
  .ease(d3.easeBounce);`,
      output: 'data-viz',
      description: 'Interactive Data Visualization'
    }
  ];

  const currentSnippet = codeSnippets[currentCodeIndex];

  // Generate particles for background animation
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speed) % 100,
        y: particle.y + Math.sin(Date.now() * 0.001 + particle.id) * 0.1
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCode = currentSnippet.code;
      
      if (currentCharIndex < currentCode.length) {
        setTypedCode(currentCode.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(prev => prev + 1);
      } else {
        // Wait a bit then move to next snippet
        setTimeout(() => {
          setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
          setCurrentCharIndex(0);
          setTypedCode('');
        }, 1000);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentCharIndex, currentCodeIndex, currentSnippet.code]);

  // Generate output animation based on current snippet
  const renderOutput = () => {
    switch (currentSnippet.output) {
      case 'neural-network':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-4 gap-8">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"
                  style={{
                    left: `${20 + i * 10}%`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      case 'quantum':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-20 h-20 border-2 border-green-400 rounded-full animate-spin"
                  style={{
                    animationDuration: `${2 + i * 0.5}s`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                    transform: `scale(${1 + i * 0.2})`
                  }}
                />
              ))}
              <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>
        );
      
      case 'data-viz':
        return (
          <div className="relative w-full h-full flex items-end justify-center p-8">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-8 mx-1 bg-gradient-to-t from-pink-500 to-yellow-400 rounded-t animate-bounce"
                style={{
                  height: `${30 + Math.sin(Date.now() * 0.003 + i) * 20}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size})`
            }}
          />
        ))}
      </div>

      {/* Left Panel - Code Editor */}
      <div className="w-1/2 p-8 relative z-10">
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 h-full">
          {/* Editor Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-400 text-sm font-mono">
              {currentSnippet.description}
            </div>
          </div>
          
          {/* Code Area */}
          <div className="p-6 font-mono text-sm text-green-400 h-full overflow-hidden">
            <pre className="whitespace-pre-wrap">
              {typedCode}
              <span className="animate-pulse bg-green-400 w-2 h-5 inline-block ml-1"></span>
            </pre>
          </div>
        </div>
      </div>

      {/* Right Panel - Output Visualization */}
      <div className="w-1/2 p-8 relative z-10">
        <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 h-full relative overflow-hidden">
          {/* Output Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="text-gray-400 text-sm font-mono">Output Console</div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="text-gray-500 text-xs">Running...</div>
            </div>
          </div>
          
          {/* Visualization Area */}
          <div className="relative h-full">
            {renderOutput()}
            
            {/* Floating Stats */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-3">
              <div className="text-green-400 text-xs font-mono">
                <div>CPU: 67%</div>
                <div>Memory: 2.1GB</div>
                <div>FPS: 60</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-100"
          style={{
            width: `${(currentCharIndex / currentSnippet.code.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedCodingVisual;