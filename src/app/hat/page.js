"use client"
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function JotaroHat() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const hatGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const cameraRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const [rotationSpeed, setRotationSpeed] = useState(1.0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 2, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create hat group
    const hatGroup = new THREE.Group();
    hatGroupRef.current = hatGroup;
    scene.add(hatGroup);

    // Materials
    const blackMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x0d0d0d,
      side: THREE.DoubleSide
    });
    
    const chainMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd4af37,
      shininess: 100
    });

    const badgeMaterial = new THREE.MeshPhongMaterial({
      color: 0x4169e1,
      shininess: 80
    });

    // Create hat crown (main cylindrical part)
    const crownGeometry = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 32);
    const crown = new THREE.Mesh(crownGeometry, blackMaterial);
    crown.position.y = 0.6;
    crown.castShadow = true;
    crown.receiveShadow = true;
    hatGroup.add(crown);

    // Create hat brim
    const brimGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
    
    // Create brim with hole using shape extrusion
    const brimShape = new THREE.Shape();
    brimShape.arc(0, 0, 1.8, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.arc(0, 0, 0.95, 0, Math.PI * 2, true);
    brimShape.holes.push(holePath);
    
    const brimGeometry2 = new THREE.ExtrudeGeometry(brimShape, {
      depth: 0.1,
      bevelEnabled: false
    });
    
    const brim = new THREE.Mesh(brimGeometry2, blackMaterial);
    brim.rotation.x = -Math.PI / 2;
    brim.position.y = 0.05;
    brim.castShadow = true;
    brim.receiveShadow = true;
    hatGroup.add(brim);

    // Create the torn/ripped effect on the back
    const tornGeometry = new THREE.PlaneGeometry(0.6, 0.8);
    const vertices = tornGeometry.attributes.position.array;
    
    // Create jagged torn pattern
    for (let i = 0; i < vertices.length; i += 3) {
      if (vertices[i] > 0.1) { // Right side of the plane
        vertices[i] += Math.random() * 0.1 - 0.05;
        vertices[i + 1] += Math.random() * 0.1 - 0.05;
      }
    }
    
    tornGeometry.attributes.position.needsUpdate = true;
    tornGeometry.computeVertexNormals();
    
    const torn = new THREE.Mesh(tornGeometry, blackMaterial);
    torn.position.set(0, 0.6, -0.92);
    torn.rotation.y = Math.PI;
    hatGroup.add(torn);

    // Create chain around the hat
    const chainGroup = new THREE.Group();
    const chainLinkGeometry = new THREE.TorusGeometry(0.03, 0.01, 8, 16);
    
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const chainLink = new THREE.Mesh(chainLinkGeometry, chainMaterial);
      chainLink.position.x = Math.cos(angle) * 0.95;
      chainLink.position.z = Math.sin(angle) * 0.95;
      chainLink.position.y = 0.2;
      chainLink.rotation.y = angle;
      chainLink.castShadow = true;
      chainGroup.add(chainLink);
    }
    hatGroup.add(chainGroup);

    // Create hat badges/pins
    const badgeGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8);
    
    // Star badge
    const starBadge = new THREE.Mesh(badgeGeometry, badgeMaterial);
    starBadge.position.set(0.6, 0.8, 0.6);
    starBadge.rotation.x = Math.PI / 2;
    starBadge.castShadow = true;
    hatGroup.add(starBadge);

    // Anchor badge
    const anchorBadge = new THREE.Mesh(badgeGeometry, chainMaterial);
    anchorBadge.position.set(-0.5, 0.9, 0.7);
    anchorBadge.rotation.x = Math.PI / 2;
    anchorBadge.castShadow = true;
    hatGroup.add(anchorBadge);

    // Create the hat's signature fold/crease
    const creaseGeometry = new THREE.BoxGeometry(0.05, 0.8, 0.02);
    const crease = new THREE.Mesh(creaseGeometry, blackMaterial);
    crease.position.set(0.85, 0.6, 0.1);
    crease.rotation.z = Math.PI / 12;
    hatGroup.add(crease);

    // Add some wear details
    const wearGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    for (let i = 0; i < 5; i++) {
      const wear = new THREE.Mesh(wearGeometry, blackMaterial);
      wear.position.set(
        (Math.random() - 0.5) * 1.6,
        0.05 + Math.random() * 0.1,
        (Math.random() - 0.5) * 1.6
      );
      wear.scale.set(1, 0.1, 1);
      hatGroup.add(wear);
    }

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x6699ff, 0.8, 20);
    pointLight.position.set(-3, 3, 3);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.6, 15);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Add ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x333333,
      transparent: true,
      opacity: 0.5
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const elapsedTime = clockRef.current.getElapsedTime();
      
      // Rotate the hat
      if (hatGroupRef.current) {
        hatGroupRef.current.rotation.y = elapsedTime * 0.3 * rotationSpeed;
        
        // Subtle floating animation
        hatGroupRef.current.position.y = Math.sin(elapsedTime * 0.8) * 0.05;
      }
      
      // Animate chain links
      chainGroup.children.forEach((link, index) => {
        link.rotation.x = elapsedTime * 0.5 + index * 0.1;
      });
      
      // Subtle light animation
      pointLight.intensity = 0.6 + Math.sin(elapsedTime * 1.2) * 0.2;
      
      renderer.render(scene, camera);
    };
    animate();

    // Mouse controls
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      if (hatGroupRef.current) {
        hatGroupRef.current.rotation.x = mouseY * 0.3;
        hatGroupRef.current.rotation.z = mouseX * 0.1;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

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
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  const handleSpeedUp = () => {
    setRotationSpeed(prev => Math.min(prev + 0.5, 3.0));
  };

  const handleSlowDown = () => {
    setRotationSpeed(prev => Math.max(prev - 0.5, 0.1));
  };

  const handleReset = () => {
    setRotationSpeed(1.0);
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
      
      {/* JoJo Style Control Panel */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.95), rgba(40, 40, 70, 0.9))',
        backdropFilter: 'blur(20px)',
        border: '3px solid #d4af37',
        borderRadius: '12px',
        padding: '25px',
        color: 'white',
        minWidth: '220px',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
        fontWeight: 'bold'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #d4af37, #ffd700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
          letterSpacing: '1px'
        }}>
          ★ JOTARO'S HAT ★
        </h2>
        
        <div style={{ 
          fontSize: '14px', 
          marginBottom: '20px',
          color: 'rgba(255, 255, 255, 0.9)',
          letterSpacing: '0.5px'
        }}>
          Rotation Speed: {rotationSpeed.toFixed(1)}x
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleSpeedUp}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #4169e1, #6495ed)',
              color: 'white',
              border: '2px solid #4169e1',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(65, 105, 225, 0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(65, 105, 225, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(65, 105, 225, 0.3)';
            }}
          >
            ⚡ ORA ORA! (Speed Up)
          </button>
          
          <button
            onClick={handleSlowDown}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #2f4f4f, #708090)',
              color: 'white',
              border: '2px solid #2f4f4f',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(47, 79, 79, 0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(47, 79, 79, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(47, 79, 79, 0.3)';
            }}
          >
            🛑 Slow Down
          </button>
          
          <button
            onClick={handleReset}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #d4af37, #ffd700)',
              color: 'black',
              border: '2px solid #d4af37',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
            }}
          >
            ⭐ Reset
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.95), rgba(40, 40, 70, 0.9))',
        backdropFilter: 'blur(20px)',
        border: '3px solid #d4af37',
        borderRadius: '12px',
        padding: '20px',
        color: 'rgba(255, 255, 255, 0.9)',
        maxWidth: '280px',
        fontSize: '13px',
        lineHeight: '1.5',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)'
      }}>
        <div style={{ 
          fontWeight: '700', 
          marginBottom: '8px',
          color: '#d4af37',
          letterSpacing: '1px'
        }}>
          🎩 JOTARO KUJO'S ICONIC HAT
        </div>
        <div>
          The legendary hat from JoJo's Bizarre Adventure: Stardust Crusaders. 
          Features the signature torn back, golden chain, marine badges, and that mysterious 
          hat-hair connection. Move your mouse to examine from different angles!
        </div>
      </div>
    </div>
  );
}