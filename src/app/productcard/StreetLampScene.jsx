"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* ------------------- Lightning effect (as you had it) ------------------- */
function Lightning({
  skyPos = [0, 12, -10],
  minDelay = 3.5,
  maxDelay = 8.0,
  flashIntensity = 9.0,
  ambientBoost = 0.6,
}) {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const [timer, setTimer] = useState(() => Math.random() * (maxDelay - minDelay) + minDelay);
  const [phase, setPhase] = useState<"idle" | "firing" | "cooling">("idle");
  const burstRef = useRef(0);
  const coolRef = useRef(0);

  const ambient = <ambientLight ref={ambientRef} intensity={0.15} />;

  useFrame((_, dt) => {
    if (!lightRef.current || !ambientRef.current) return;

    if (phase === "idle") {
      const t = timer - dt;
      if (t <= 0) {
        burstRef.current = 1 + Math.floor(Math.random() * 3);
        setPhase("firing");
        setTimer(0);
      } else setTimer(t);
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
      {ambient}
      <directionalLight
        ref={lightRef}
        position={skyPos as any}
        intensity={0}
        color="#cfe8ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}

/* ------------------- Snow system (GPU-friendly Points) ------------------- */
function Snow({
  count = 3000,
  area = [12, 12, 120], // x, y, z extents
  speed = [0.6, 1.2],   // min/max fall speed
  size = 0.05,          // point size
}) {
  const [w, h, d] = area;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * w;
      arr[i * 3 + 1] = Math.random() * h + 2; // start slightly above top
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

  const ref = useRef<THREE.Points>(null!);

  useFrame((_, dt) => {
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // gentle sideways drift
      pos[ix + 0] += Math.sin((pos[ix + 2] + i) * 0.05) * 0.02;
      // fall
      pos[ix + 1] -= speeds[i] * dt;
      // wrap if below
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
      <pointsMaterial size={size} sizeAttenuation transparent opacity={0.9} color="#ffffff" />
    </points>
  );
}

/* ------------------- Procedural street lamp (tidied) ------------------- */
function StreetLamp({ position = [0, 0, 0], flicker = true }) {
  const spotRef = useRef<THREE.SpotLight>(null!);
  const pointRef = useRef<THREE.PointLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);

  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.07, 0.09, 3.2, 24), []);
  const baseGeom = useMemo(() => new THREE.CylinderGeometry(0.25, 0.35, 0.3, 24), []);
  const armGeom = useMemo(() => new THREE.BoxGeometry(1.0, 0.06, 0.06), []);
  const headGeom = useMemo(() => new THREE.BoxGeometry(0.35, 0.2, 0.35), []);
  const bulbGeom = useMemo(() => new THREE.SphereGeometry(0.1, 24, 24), []);

  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1b1b1c",
        metalness: 0.9,
        roughness: 0.4,
      }),
    []
  );

  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e1e1f",
        metalness: 0.6,
        roughness: 0.55,
      }),
    []
  );

  const bulbMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffcc",
        emissive: "#ffffcc",
        emissiveIntensity: 1.6,
        transmission: 0.6,
        thickness: 0.2,
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
    <group position={position as any}>
      <mesh geometry={baseGeom} material={metalMat} position={[0, 0.15, 0]} castShadow receiveShadow />
      <mesh geometry={poleGeom} material={metalMat} position={[0, 1.75, 0]} castShadow receiveShadow />
      <mesh geometry={armGeom} material={metalMat} position={[0.55, 3.2, 0]} castShadow />
      <mesh geometry={headGeom} material={headMat} position={[1.0, 3.2, 0]} castShadow />
      <mesh geometry={bulbGeom} material={bulbMat} position={[1.0, 3.13, 0]} />

      {/* Lights */}
      <spotLight
        ref={spotRef}
        position={[1.0, 3.15, 0]}
        angle={0.55}
        penumbra={0.7}
        distance={22}
        intensity={8.0}
        color={"#ffdca8"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <object3D ref={targetRef} position={[1.0, 0.0, 0]} />
      <pointLight ref={pointRef} position={[1.0, 3.15, 0]} intensity={1.2} distance={5} decay={2} color={"#ffefc4"} />
    </group>
  );
}

/* ------------------- Procedural road + markings ------------------- */
function Road({
  width = 6.2,
  length = 140,
  stripeLen = 1.6,
  stripeGap = 1.2,
}) {
  const asphaltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#171717",
        roughness: 0.95,
        metalness: 0.0,
      }),
    []
  );

  const curbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
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
        {/* Avoid spreading a material object via props: create a fresh material instance */}
        <meshStandardMaterial {...stripeMatProps} />
      </mesh>
    );
    z += stripeLen + stripeGap;
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial {...(asphaltMat as any)} />
      </mesh>

      <mesh position={[width / 2 + 0.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1, length]} />
        <meshStandardMaterial {...(curbMat as any)} />
      </mesh>
      <mesh position={[-width / 2 - 0.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1, length]} />
        <meshStandardMaterial {...(curbMat as any)} />
      </mesh>

      {stripes}
    </group>
  );
}

/* ------------------- Rows of lamps (both sides) ------------------- */
function LampRows({
  countPerSide = 10,
  spacing = 10,           // distance between lamps along Z
  offsetX = 2.6,          // how far from center of road (±)
  startZ = -45,           // where the first lamp starts
  flicker = true,
}) {
  const lamps: JSX.Element[] = [];
  for (let i = 0; i < countPerSide; i++) {
    const z = startZ + i * spacing;
    lamps.push(<StreetLamp key={`L-${i}`} position={[-offsetX, 0, z]} flicker={flicker} />);
    lamps.push(<StreetLamp key={`R-${i}`} position={[ offsetX, 0, z + spacing / 2]} flicker={flicker} />);
  }
  return <group>{lamps}</group>;
}

/* ------------------- The mixed Scene + Hero wrapper ------------------- */
function StreetLampScene({
  height = "800px",
  lampsPerSide = 10,
  snow = true,
}) {
  const bg = "#0a0d12";
  return (
    <div className="relative overflow-hidden bg-gray-100 mx-auto"
      style={{
        width: "1400px",
        height,
        maxWidth: "1400px",
        maxHeight: height,
        minWidth: "1400px",
        minHeight: height,
        border: "2px solid #e5e7eb",
        borderRadius: "12px",
      }}
    >
      {/* === The 3D Canvas sits as the BACKGROUND layer === */}
      <div className="absolute inset-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [6.5, 3.5, 12.5], fov: 45 }}>
          <color attach="background" args={[bg]} />
          <fog attach="fog" args={[bg, 7, 40]} />

          <hemisphereLight args={["#3c4b6b", "#0a0a0a", 0.22]} />
          <Lightning />

          <group position={[0, 0, 0]}>
            <Road length={160} />
            <LampRows countPerSide={lampsPerSide} />
          </group>

          {/* Snow field—covers the whole visible stretch */}
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

      {/* === Your GreenMotiveHero UI sits ABOVE as an overlay === */}
      <GreenMotiveHeroOverlay />
    </div>
  );
}

/* ------------------- The (lightly tweaked) GreenMotiveHero overlay ------------------- */
function GreenMotiveHeroOverlay() {
  const [activeService, setActiveService] = useState<string | null>(null);

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
      {/* subtle organic lights to tie with scene */}
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

/* ------------------- Page ------------------- */
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <StreetLampScene height="800px" lampsPerSide={12} snow />
    </main>
  );
}
