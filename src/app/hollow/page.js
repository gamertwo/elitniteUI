"use client"
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ElectricEnergyOrb() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const coreOrbRef = useRef(null);
  const glowOrbRef = useRef(null);
  const lightningGroupRef = useRef(null);
  const materialRef = useRef(null);
  const glowMaterialRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const cameraRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with dark space background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // High-quality renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Electric core shader - brighter white center
    const coreVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      uniform float uTime;
      uniform float uScale;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        vec3 pos = position;
        
        // Subtle electric energy pulsing
        float pulse = sin(uTime * 0.006) * 0.01 + sin(uTime * 0.009) * 0.008;
        pos += normal * pulse * uScale;
        
        vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const coreFragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      uniform float uTime;
      uniform float uScale;
      
      void main() {
        // Pure bright white core
        vec3 coreColor = vec3(1.0, 1.0, 1.0);
        
        // Slight pulsing
        float pulse = sin(uTime * 0.008) * 0.1 + 0.9;
        vec3 finalColor = coreColor * pulse;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Solid purple energy sphere shader
    const energyVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      uniform float uTime;
      uniform float uScale;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        vec3 pos = position;
        
        // Energy field fluctuations
        float fluctuation = sin(uTime * 0.005) * 0.02 + cos(uTime * 0.007) * 0.015;
        pos += normal * fluctuation * uScale;
        
        vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const energyFragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      uniform float uTime;
      uniform float uScale;
      
      void main() {
        vec2 uv = vUv;
        float time = uTime * 0.003;
        
        // Electric patterns within the energy field
        float pattern1 = sin(uv.x * 15.0 + time * 10.0) * cos(uv.y * 12.0 + time * 8.0);
        float pattern2 = cos(uv.x * 18.0 + time * 12.0) * sin(uv.y * 16.0 + time * 14.0);
        float electric = (pattern1 + pattern2) * 0.3 + 0.7;
        
        // Solid purple energy color
        vec3 energyColor = vec3(0.6, 0.2, 0.8); // Rich purple
        
        // Fresnel for edge intensity
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
        fresnel = pow(fresnel, 1.5);
        
        // Combine for final color
        vec3 finalColor = energyColor * (electric * 0.7 + 0.8);
        finalColor += fresnel * vec3(0.8, 0.4, 1.0) * 0.5;
        
        // Pulsing intensity
        float pulse = sin(time * 15.0) * 0.2 + 0.8;
        finalColor *= pulse;
        
        gl_FragColor = vec4(finalColor, 0.95); // Almost opaque
      }
    `;

    // Outer glow shader
    const glowVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const glowFragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      uniform float uTime;
      
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
        fresnel = pow(fresnel, 3.0);
        
        vec3 glowColor = vec3(0.7, 0.3, 1.0);
        float alpha = fresnel * 0.6;
        
        gl_FragColor = vec4(glowColor, alpha);
      }
    `;

    // Create bright white core
    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1.0 }
      }
    });
    materialRef.current = coreMaterial;

    const coreGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const coreOrb = new THREE.Mesh(coreGeometry, coreMaterial);
    coreOrbRef.current = coreOrb;
    scene.add(coreOrb);

    // Create solid purple energy sphere
    const energyMaterial = new THREE.ShaderMaterial({
      vertexShader: energyVertexShader,
      fragmentShader: energyFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1.0 }
      },
      transparent: true
    });

    const energyGeometry = new THREE.SphereGeometry(0.6, 64, 64);
    const energySphere = new THREE.Mesh(energyGeometry, energyMaterial);
    scene.add(energySphere);

    // Create outer glow
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    glowMaterialRef.current = glowMaterial;

    const glowGeometry = new THREE.SphereGeometry(1.0, 32, 32);
    const glowOrb = new THREE.Mesh(glowGeometry, glowMaterial);
    glowOrbRef.current = glowOrb;
    scene.add(glowOrb);

    // Create lightning bolts group
    const lightningGroup = new THREE.Group();
    lightningGroupRef.current = lightningGroup;
    scene.add(lightningGroup);

    // Function to create thicker lightning bolts
    const createLightningBolt = (startRadius, endRadius, angle, elevation) => {
      const points = [];
      const segments = 25;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const radius = startRadius + (endRadius - startRadius) * t;
        
        // More dramatic zigzag for lightning
        const zigzag = (Math.random() - 0.5) * 0.5 * Math.sin(t * Math.PI * 6);
        const x = Math.cos(angle) * radius + zigzag * Math.sin(angle);
        const z = Math.sin(angle) * radius + zigzag * Math.cos(angle);
        const y = Math.sin(elevation) * radius + (Math.random() - 0.5) * 0.3;
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Thicker lightning material
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(0.9, 0.7, 1.0),
        transparent: true,
        opacity: 0.9,
        linewidth: 3 // Thicker lines
      });
      
      const line = new THREE.Line(geometry, material);
      
      // Create multiple overlapping lines for thickness effect
      const thickGroup = new THREE.Group();
      thickGroup.add(line);
      
      // Add 2 more slightly offset lines for thickness
      for (let i = 0; i < 2; i++) {
        const offsetPoints = points.map(point => {
          const offset = (Math.random() - 0.5) * 0.02;
          return new THREE.Vector3(
            point.x + offset,
            point.y + offset,
            point.z + offset
          );
        });
        const offsetGeometry = new THREE.BufferGeometry().setFromPoints(offsetPoints);
        const offsetMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(0.8, 0.5, 1.0),
          transparent: true,
          opacity: 0.6,
          linewidth: 2
        });
        thickGroup.add(new THREE.Line(offsetGeometry, offsetMaterial));
      }
      
      return thickGroup;
    };

    // Create more lightning bolts
    const createLightningBolts = () => {
      // Clear existing bolts
      while (lightningGroup.children.length > 0) {
        const child = lightningGroup.children[0];
        if (child.children) {
          child.children.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
          });
        }
        lightningGroup.remove(child);
      }
      
      const numBolts = 12 + Math.floor(Math.random() * 6); // More bolts
      
      for (let i = 0; i < numBolts; i++) {
        const angle = (i / numBolts) * Math.PI * 2 + Math.random() * 0.8;
        const elevation = (Math.random() - 0.5) * Math.PI * 0.6;
        const startRadius = 0.6 + Math.random() * 0.2; // Start from energy sphere edge
        const endRadius = 2.5 + Math.random() * 2.5; // Longer bolts
        
        const bolt = createLightningBolt(startRadius, endRadius, angle, elevation);
        lightningGroup.add(bolt);
      }
    };

    // Initial lightning creation
    createLightningBolts();

    // Recreate lightning more frequently for more dynamic effect
    const lightningInterval = setInterval(() => {
      createLightningBolts();
    }, 100 + Math.random() * 150);

    // Dramatic lighting
    const ambientLight = new THREE.AmbientLight(0x220044, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8844ff, 3, 20);
    pointLight1.position.set(0, 0, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff44ff, 1.5, 15);
    pointLight2.position.set(2, 2, 2);
    scene.add(pointLight2);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const elapsedTime = clockRef.current.getElapsedTime() * 1000;
      
      // Update shader uniforms
      if (materialRef.current && materialRef.current.uniforms) {
        materialRef.current.uniforms.uTime.value = elapsedTime;
        materialRef.current.uniforms.uScale.value = scale;
      }
      
      if (glowMaterialRef.current && glowMaterialRef.current.uniforms) {
        glowMaterialRef.current.uniforms.uTime.value = elapsedTime;
      }
      
      // Rotate the energy orb
      if (coreOrbRef.current) {
        coreOrbRef.current.rotation.x = elapsedTime * 0.0005;
        coreOrbRef.current.rotation.y = elapsedTime * 0.0008;
      }
      
      if (glowOrbRef.current) {
        glowOrbRef.current.rotation.x = elapsedTime * -0.0003;
        glowOrbRef.current.rotation.y = elapsedTime * -0.0006;
      }
      
      // Animate lightning opacity for flickering effect
      if (lightningGroupRef.current) {
        lightningGroupRef.current.children.forEach((boltGroup, index) => {
          const flickerSpeed = 0.015 + index * 0.003;
          const opacity = 0.6 + Math.sin(elapsedTime * flickerSpeed + index) * 0.3;
          
          boltGroup.children.forEach(line => {
            line.material.opacity = Math.max(0.3, opacity);
          });
        });
      }
      
      // Dynamic lighting
      const lightTime = elapsedTime * 0.008;
      pointLight1.intensity = 2.5 + Math.sin(lightTime * 2.5) * 0.8;
      pointLight2.intensity = 1.2 + Math.cos(lightTime * 1.8) * 0.5;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(lightningInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      coreGeometry.dispose();
      glowGeometry.dispose();
      coreMaterial.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Update scale
  useEffect(() => {
    if (coreOrbRef.current && glowOrbRef.current && lightningGroupRef.current) {
      const targetScale = scale;
      
      // Animate scale change
      const animate = () => {
        const currentScale = coreOrbRef.current.scale.x;
        const newScale = currentScale + (targetScale - currentScale) * 0.1;
        
        coreOrbRef.current.scale.setScalar(newScale);
        glowOrbRef.current.scale.setScalar(newScale * 1.2);
        lightningGroupRef.current.scale.setScalar(newScale);
        
        if (Math.abs(targetScale - newScale) > 0.01) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [scale]);

  const handleGrow = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleShrink = () => {
    setScale(prev => Math.max(prev - 0.2, 0.3));
  };

  const handleReset = () => {
    setScale(1.0);
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Electric Control Panel */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        background: 'rgba(20, 0, 30, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(160, 80, 255, 0.4)',
        borderRadius: '16px',
        padding: '25px',
        color: 'white',
        minWidth: '200px',
        boxShadow: '0 8px 32px rgba(160, 80, 255, 0.3)',
        background: 'linear-gradient(135deg, rgba(20, 0, 30, 0.95), rgba(40, 0, 60, 0.9))'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '20px', 
          fontWeight: '600',
          background: 'linear-gradient(135deg, #a050ff, #ff50ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(160, 80, 255, 0.5)'
        }}>
          ⚡ Electric Energy Orb
        </h2>
        
        <div style={{ 
          fontSize: '14px', 
          marginBottom: '20px',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          Power Level: {scale.toFixed(1)}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleGrow}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #8040ff, #a060ff)',
              color: 'white',
              border: '1px solid rgba(160, 80, 255, 0.5)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(160, 80, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(160, 80, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(160, 80, 255, 0.3)';
            }}
          >
            ⚡ Amplify Energy
          </button>
          
          <button
            onClick={handleShrink}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #ff4080, #ff6040)',
              color: 'white',
              border: '1px solid rgba(255, 80, 120, 0.5)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(255, 80, 120, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 80, 120, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 80, 120, 0.3)';
            }}
          >
            ⚡ Discharge Energy
          </button>
          
          <button
            onClick={handleReset}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #666666, #888888)',
              color: 'white',
              border: '1px solid rgba(120, 120, 120, 0.5)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(120, 120, 120, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(120, 120, 120, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(120, 120, 120, 0.3)';
            }}
          >
            ⟲ Reset Power
          </button>
        </div>
      </div>

      {/* Electric Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        background: 'linear-gradient(135deg, rgba(20, 0, 30, 0.95), rgba(40, 0, 60, 0.9))',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(160, 80, 255, 0.4)',
        borderRadius: '16px',
        padding: '20px',
        color: 'rgba(255, 255, 255, 0.9)',
        maxWidth: '250px',
        fontSize: '13px',
        lineHeight: '1.5',
        boxShadow: '0 8px 32px rgba(160, 80, 255, 0.3)'
      }}>
        <div style={{ 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#a060ff'
        }}>
          ⚡ High-Voltage Energy Core
        </div>
        <div>
          Dynamic electric orb with animated lightning bolts that randomly regenerate. 
          Features pulsing energy core, electric glow halo, and realistic voltage discharge patterns.
        </div>
      </div>
    </div>
  );
}