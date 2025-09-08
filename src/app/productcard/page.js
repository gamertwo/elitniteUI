
// import ProductsSection from './ProductSection';
// import CodePenShowcase from './CodePenShowcase';
// import ElitniteCodePenShowcase from './CodePenShowcaseHero';
// import GreenMotiveHero from './ecocard';
// export default function Home() {
//   return (
//     <main className="relative">
//    <div className="w-full max-w-none" style={{ 
//         transform: 'scale(1)', 
//         transformOrigin: 'top left',
//         width: '100vw',
//         minHeight: '100vh'
//       }}>
//       <ProductsSection />
//       {/* <GreenMotiveHero /> */}
//       {/* <ElitniteCodePenShowcase/> */}
//       <CodePenShowcase /></div>

//     </main>
//   );
// }

// import BlackRubiksCube from "./BlackCube";

// export default function Page() {
//   return (
//     <main style={{ margin: 0, padding: 0 }}>
//       <h1 style={{ margin: "16px", fontFamily: "system-ui, sans-serif" }}>
//         Animated Black Rubik&apos;s Cube
//       </h1>
//       {/* Change the sequence to anything like "R U R' U' F F' L D' B" */}
//       <BlackRubiksCube sequence={"R U R' U'"} />
//     </main>
//   );
// }


// import StreetLampScene from "./StreetLampScene";

// export default function Page() {
//   return (
//     <main style={{ margin: 0, padding: 0 }}>
//       <h1 style={{ margin: "16px", fontFamily: "system-ui, sans-serif", color: "#e6e6e6" }}>
//         Street Lamp View
//       </h1>
//       <StreetLampScene height="80vh" />
//     </main>
//   );
// }

"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* Lightning Effect Component */
function Lightning({
  skyPos = [0, 12, -10],
  minDelay = 3.5,
  maxDelay = 8.0,
  flashIntensity = 9.0,
  ambientBoost = 0.6,
}) {
  const lightRef = useRef(null);
  const ambientRef = useRef(null);
  const [timer, setTimer] = useState(() => Math.random() * (maxDelay - minDelay) + minDelay);
  const [phase, setPhase] = useState("idle");
  const burstRef = useRef(0);
  const coolRef = useRef(0);

  useFrame((_, dt) => {
    if (!lightRef.current || !ambientRef.current) return;

    if (phase === "idle") {
      const t = timer - dt;
      if (t <= 0) {
        burstRef.current = 1 + Math.floor(Math.random() * 3);
        setPhase("firing");
        setTimer(0);
      } else {
        setTimer(t);
      }
      return;
    }

    if (phase === "firing") {
      const pulse = Math.random() * 0.05 + 0.04;
      lightRef.current.intensity = flashIntensity;
      ambientRef.current.intensity = 0.15 + ambientBoost;
      coolRef.current = pulse;
      setPhase("cooling");
      return;
    }

    if (phase === "cooling") {
      coolRef.current -= dt;
      lightRef.current.intensity *= Math.pow(0.01, dt / Math.max(0.02, coolRef.current + 0.02));
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        0.15,
        0.35
      );

      if (coolRef.current <= 0) {
        burstRef.current -= 1;
        if (burstRef.current > 0) {
          setPhase("firing");
        } else {
          setPhase("idle");
          setTimer(Math.random() * (maxDelay - minDelay) + minDelay);
          lightRef.current.intensity = 0;
          ambientRef.current.intensity = 0.15;
        }
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.15} />
      <directionalLight
        ref={lightRef}
        position={skyPos}
        intensity={0}
        color="#cfe8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}

/* Snow Particle System */
function Snow({
  count = 3000,
  area = [12, 12, 120],
  speed = [0.6, 1.2],
  size = 0.05,
}) {
  const [w, h, d] = area;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * w;
      arr[i * 3 + 1] = Math.random() * h + 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * d;
    }
    return arr;
  }, [count, w, h, d]);

  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = speed[0] + Math.random() * (speed[1] - speed[0]);
    }
    return arr;
  }, [count, speed]);

  const ref = useRef();

  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      pos[ix + 0] += Math.sin((pos[ix + 2] + i) * 0.05) * 0.02;
      pos[ix + 1] -= speeds[i] * dt;
      if (pos[ix + 1] < -1) {
        pos[ix + 1] = h + Math.random() * 2;
        pos[ix + 0] = (Math.random() - 0.5) * w;
        pos[ix + 2] = (Math.random() - 0.5) * d;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={size} 
        sizeAttenuation 
        transparent 
        opacity={0.9} 
        color="#ffffff" 
      />
    </points>
  );
}

/* Street Lamp Component */
function StreetLamp({ position = [0, 0, 0], flicker = true }) {
  const spotRef = useRef();
  const pointRef = useRef();
  const targetRef = useRef();

  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.07, 0.09, 3.2, 24), []);
  const baseGeom = useMemo(() => new THREE.CylinderGeometry(0.25, 0.35, 0.3, 24), []);
  const armGeom = useMemo(() => new THREE.BoxGeometry(1.0, 0.06, 0.06), []);
  const headGeom = useMemo(() => new THREE.BoxGeometry(0.35, 0.2, 0.35), []);
  const bulbGeom = useMemo(() => new THREE.SphereGeometry(0.1, 24, 24), []);

  const metalMat = useMemo(
    () => ({
      color: "#1b1b1c",
      metalness: 0.9,
      roughness: 0.4,
    }),
    []
  );

  const headMat = useMemo(
    () => ({
      color: "#1e1e1f",
      metalness: 0.6,
      roughness: 0.55,
    }),
    []
  );

  const bulbMat = useMemo(
    () => ({
      color: "#ffffcc",
      emissive: "#ffffcc",
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.0,
    }),
    []
  );

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current;
    }
  }, []);

  useFrame((state) => {
    if (!flicker) return;
    const t = state.clock.getElapsedTime();
    const n =
      0.88 +
      0.08 * Math.sin(t * 7.3) +
      0.03 * Math.sin(t * 17.1) +
      0.02 * Math.sin(t * 31.7 + 1.3);
    if (spotRef.current) spotRef.current.intensity = 8.0 * n;
    if (pointRef.current) pointRef.current.intensity = 1.2 * n;
  });

  return (
    <group position={position}>
      <mesh geometry={baseGeom} position={[0, 0.15, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...metalMat} />
      </mesh>
      <mesh geometry={poleGeom} position={[0, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...metalMat} />
      </mesh>
      <mesh geometry={armGeom} position={[0.55, 3.2, 0]} castShadow>
        <meshStandardMaterial {...metalMat} />
      </mesh>
      <mesh geometry={headGeom} position={[1.0, 3.2, 0]} castShadow>
        <meshStandardMaterial {...headMat} />
      </mesh>
      <mesh geometry={bulbGeom} position={[1.0, 3.13, 0]}>
        <meshStandardMaterial {...bulbMat} />
      </mesh>

      <spotLight
        ref={spotRef}
        position={[1.0, 3.15, 0]}
        angle={0.55}
        penumbra={0.7}
        distance={22}
        intensity={8.0}
        color="#ffdca8"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <object3D ref={targetRef} position={[1.0, 0.0, 0]} />
      <pointLight 
        ref={pointRef} 
        position={[1.0, 3.15, 0]} 
        intensity={1.2} 
        distance={5} 
        decay={2} 
        color="#ffefc4" 
      />
    </group>
  );
}

/* Road Component */
function Road({
  width = 6.2,
  length = 140,
  stripeLen = 1.6,
  stripeGap = 1.2,
}) {
  const asphaltMat = useMemo(
    () => ({
      color: "#171717",
      roughness: 0.95,
      metalness: 0.0,
    }),
    []
  );

  const curbMat = useMemo(
    () => ({
      color: "#2a2a2a",
      roughness: 0.9,
    }),
    []
  );

  const stripeMatProps = useMemo(
    () => ({
      color: "#e6e6a8",
      emissive: "#2a2a00",
      emissiveIntensity: 0.2,
      roughness: 0.6,
      metalness: 0.0,
    }),
    []
  );

  const stripes = [];
  let z = -length / 2;
  while (z < length / 2) {
    stripes.push(
      <mesh key={`stripe-${z.toFixed(2)}`} position={[0, 0.011, z + stripeLen / 2]}>
        <boxGeometry args={[0.2, 0.002, stripeLen]} />
        <meshStandardMaterial {...stripeMatProps} />
      </mesh>
    );
    z += stripeLen + stripeGap;
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial {...asphaltMat} />
      </mesh>

      <mesh position={[width / 2 + 0.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1, length]} />
        <meshStandardMaterial {...curbMat} />
      </mesh>
      <mesh position={[-width / 2 - 0.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1, length]} />
        <meshStandardMaterial {...curbMat} />
      </mesh>

      {stripes}
    </group>
  );
}

/* Background Street Lamp - Larger, more distant */
function BackgroundStreetLamp({ position = [0, 0, 0] }) {
  const spotRef = useRef();
  const pointRef = useRef();
  const targetRef = useRef();

  // Larger geometry for background lamp
  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.12, 0.15, 5.5, 24), []);
  const baseGeom = useMemo(() => new THREE.CylinderGeometry(0.4, 0.55, 0.5, 24), []);
  const armGeom = useMemo(() => new THREE.BoxGeometry(1.8, 0.1, 0.1), []);
  const headGeom = useMemo(() => new THREE.BoxGeometry(0.6, 0.35, 0.6), []);
  const bulbGeom = useMemo(() => new THREE.SphereGeometry(0.18, 24, 24), []);

  const metalMat = useMemo(
    () => ({
      color: "#1a1a1b",
      metalness: 0.85,
      roughness: 0.45,
    }),
    []
  );

  const headMat = useMemo(
    () => ({
      color: "#1d1d1e",
      metalness: 0.65,
      roughness: 0.5,
    }),
    []
  );

  const bulbMat = useMemo(
    () => ({
      color: "#fff8dc",
      emissive: "#fff8dc",
      emissiveIntensity: 2.2,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
      metalness: 0.0,
    }),
    []
  );

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current;
    }
  }, []);

  // Gentle flickering for background lamp
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const n = 0.92 + 0.05 * Math.sin(t * 4.2) + 0.02 * Math.sin(t * 12.1) + 0.01 * Math.sin(t * 23.7);
    if (spotRef.current) spotRef.current.intensity = 15.0 * n;
    if (pointRef.current) pointRef.current.intensity = 3.5 * n;
  });

  return (
    <group position={position}>
      <mesh geometry={baseGeom} position={[0, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...metalMat} />
      </mesh>
      <mesh geometry={poleGeom} position={[0, 3.0, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...metalMat} />
      </mesh>
      <mesh geometry={armGeom} position={[0.95, 5.5, 0]} castShadow>
        <meshStandardMaterial {...metalMat} />
      </mesh>
      <mesh geometry={headGeom} position={[1.8, 5.5, 0]} castShadow>
        <meshStandardMaterial {...headMat} />
      </mesh>
      <mesh geometry={bulbGeom} position={[1.8, 5.35, 0]}>
        <meshStandardMaterial {...bulbMat} />
      </mesh>

      {/* Brighter lights for background lamp */}
      <spotLight
        ref={spotRef}
        position={[1.8, 5.4, 0]}
        angle={0.6}
        penumbra={0.8}
        distance={35}
        intensity={15.0}
        color="#fff2d4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <object3D ref={targetRef} position={[1.8, 0.0, 0]} />
      <pointLight 
        ref={pointRef} 
        position={[1.8, 5.4, 0]} 
        intensity={3.5} 
        distance={12} 
        decay={2} 
        color="#fff8dc" 
      />
      
      {/* Additional ambient glow around the lamp */}
      <pointLight 
        position={[1.8, 5.4, 0]} 
        intensity={1.8} 
        distance={8} 
        decay={1.5} 
        color="#ffeaa7" 
      />
    </group>
  );
}

/* Lamp Rows Component */
function LampRows({
  countPerSide = 10,
  spacing = 10,
  offsetX = 2.6,
  startZ = -45,
  flicker = true,
}) {
  const lamps = [];
  for (let i = 0; i < countPerSide; i++) {
    const z = startZ + i * spacing;
    lamps.push(<StreetLamp key={`L-${i}`} position={[-offsetX, 0, z]} flicker={flicker} />);
    lamps.push(<StreetLamp key={`R-${i}`} position={[offsetX, 0, z + spacing / 2]} flicker={flicker} />);
  }
  return <group>{lamps}</group>;
}

/* Hero Overlay Component */
function GreenMotiveHeroOverlay() {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: "elitnite",
      title: "Software Development",
      category: "Resources",
      icon: "+",
      description: "Custom software solutions and applications tailored to your business needs.",
    },
    {
      id: "ai-bots",
      title: "Automation Technology",
      category: "Management",
      icon: "↻",
      description: "AI-powered automation and intelligent bot solutions for streamlined operations.",
    },
    {
      id: "web-development",
      title: "Web Design",
      category: "Development",
      icon: "✕",
      description: "Modern, responsive web design and development services.",
    },
  ];

  return (
    <>
      {/* Ambient light effects */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-12 left-8 w-24 h-24 bg-amber-200 rounded-full blur-xl"></div>
        <div className="absolute top-24 right-16 w-32 h-32 bg-stone-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-16 left-1/3 w-28 h-28 bg-neutral-300 rounded-full blur-xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4">
        <div className="text-lg font-medium text-gray-100 drop-shadow">
          Elitnite
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gray-100 border border-white/20 hover:bg-white/20 transition-all text-sm">
            ≡ Menu
          </button>
          <button className="px-4 py-2 bg-gray-900/80 text-white rounded-full hover:bg-gray-900 transition-all text-sm border border-white/10">
            → Discover Innovations
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-xs text-gray-200">Renewable Software Solutions</span>
        </div>
      </nav>

      {/* Title */}
      <div className="relative z-40 text-center mt-6 mb-6">
        <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow">
          Elitnite
        </h1>
        <p className="mt-2 text-sm text-gray-200 opacity-80">Urban night • Lightning • Snow</p>
      </div>

      {/* Services Grid */}
      <div className="relative z-40 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
            >
              <div
                className={`absolute inset-0 -m-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg transition-all duration-300 ${
                  activeService === service.id ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
              />
              <div className="relative z-10 mb-4">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-100 border border-white/20">
                  {service.category}
                </span>
              </div>
              <div className="relative z-10 mb-6 flex justify-center">
                <div className="w-12 h-12 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow">{service.icon}</span>
                </div>
              </div>
              <div className="relative z-10 text-center">
                <h3 className="text-base font-bold text-white tracking-wide leading-tight mb-2">
                  {service.title}
                </h3>
                <div
                  className={`transition-all duration-300 ${
                    activeService === service.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <p className="text-xs text-gray-100/90 max-w-xs mx-auto leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave & FAB */}
      <div className="absolute bottom-0 w-full pointer-events-none">
        <svg viewBox="0 0 1200 120" className="w-full h-20 text-stone-200/40" preserveAspectRatio="none">
          <path d="M0,60 C300,90 600,30 900,60 C1050,75 1150,45 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
      <button className="absolute bottom-4 right-4 w-10 h-10 bg-gray-900/80 text-white rounded-full shadow-lg hover:bg-gray-900 transition-all z-50 flex items-center justify-center">
        <span className="text-sm">↑</span>
      </button>
    </>
  );
}

/* Main Scene Component */
function StreetLampScene({
  height = "800px",
  lampsPerSide = 10,
  snow = true,
}) {
  const bg = "#0a0d12";
  
  return (
    <div 
      className="relative overflow-hidden bg-gray-100 mx-auto border-2 border-gray-300 rounded-xl"
      style={{
        width: "100%",
        maxWidth: "1400px",
        height,
        minHeight: height,
      }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas 
          shadows 
          dpr={[1, 2]} 
          camera={{ position: [6.5, 3.5, 12.5], fov: 45 }}
        >
          <color attach="background" args={[bg]} />
          <fog attach="fog" args={[bg, 7, 40]} />

          <hemisphereLight args={["#3c4b6b", "#0a0a0a", 0.22]} />
          <Lightning />

          <group position={[0, 0, 0]}>
            <Road length={160} />
            <LampRows countPerSide={lampsPerSide} />
            
            {/* Background street lamps for depth */}
            <BackgroundStreetLamp position={[-8, 0, -25]} />
            <BackgroundStreetLamp position={[9, 0, -35]} />
            <BackgroundStreetLamp position={[-7, 0, -55]} />
            <BackgroundStreetLamp position={[8, 0, -65]} />
          </group>

          {snow && <Snow count={3500} area={[14, 10, 180]} speed={[0.7, 1.6]} size={0.06} />}

          <directionalLight position={[-6, 6, 6]} intensity={0.12} castShadow />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
            <planeGeometry args={[40, 40]} />
            <shadowMaterial opacity={0.25} />
          </mesh>

          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={3}
            maxDistance={26}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <GreenMotiveHeroOverlay />
    </div>
  );
}

/* Main Page Component */
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4">
      <StreetLampScene height="800px" lampsPerSide={12} snow />
    </main>
  );
}