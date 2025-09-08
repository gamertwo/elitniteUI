"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/** --- Helpers for cube logic --- */
const LAYERS = [-1, 0, 1];
const SPACING = 1.05;
const geomSize = 0.95;

/** Round to nearest grid step to avoid drift after animations */
function snap(v, step = 0.0001) {
  return Math.abs(v) < step ? 0 : v;
}

/** Map Singmaster-ish moves to axis + layer + direction */
const MOVE_MAP = {
  // Right / Left (x axis)
  "R":  { axis: "x", layer:  1, dir:  1 },
  "R'": { axis: "x", layer:  1, dir: -1 },
  "L":  { axis: "x", layer: -1, dir: -1 }, // standard notation: L is opposite direction wrt +x
  "L'": { axis: "x", layer: -1, dir:  1 },

  // Up / Down (y axis)
  "U":  { axis: "y", layer:  1, dir:  1 },
  "U'": { axis: "y", layer:  1, dir: -1 },
  "D":  { axis: "y", layer: -1, dir: -1 },
  "D'": { axis: "y", layer: -1, dir:  1 },

  // Front / Back (z axis)
  "F":  { axis: "z", layer:  1, dir:  1 },
  "F'": { axis: "z", layer:  1, dir: -1 },
  "B":  { axis: "z", layer: -1, dir: -1 },
  "B'": { axis: "z", layer: -1, dir:  1 },
};

function parseMoves(seq) {
  return seq
    .trim()
    .split(/\s+/)
    .map((m) => MOVE_MAP[m])
    .filter(Boolean);
}

/** --- Cubie component reused for all 27 pieces --- */
function Cubie({ geometry, material, position, edgeColor = "#f6f6f6" }, ref) {
  return (
    <group ref={ref} position={position}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={edgeColor} />
      </lineSegments>
    </group>
  );
}
const CubieWithRef = React.forwardRef(Cubie);

/** --- Main animated group --- */
function RubiksAnimated({ moveSequence = "R U R' U'", moveDuration = 0.35, pauseBetween = 0.1 }) {
  const root = useRef();
  const pivot = useRef(new THREE.Group()); // temporary parent for rotating a layer
  const cubieRefs = useRef([]);            // refs to the 27 cubies
  const [anim, setAnim] = useState(null);  // current move state
  const [queue, setQueue] = useState([]);
  const clockRef = useRef(0);              // progress for the current move

  // Build geometry/material once
  const geom = useMemo(() => new THREE.BoxGeometry(geomSize, geomSize, geomSize), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0a0a",
        metalness: 0.75,
        roughness: 0.32,
      }),
    []
  );

  // Positions for 27 cubies, saved as grid coordinates and world positions
  const model = useMemo(() => {
    const items = [];
    let idx = 0;
    for (let xi of LAYERS) {
      for (let yi of LAYERS) {
        for (let zi of LAYERS) {
          items.push({
            id: idx++,
            grid: new THREE.Vector3(xi, yi, zi),
            pos: new THREE.Vector3(xi * SPACING, yi * SPACING, zi * SPACING),
          });
        }
      }
    }
    return items;
  }, []);

  // Initialize refs array length
  if (cubieRefs.current.length !== model.length) {
    cubieRefs.current = Array(model.length).fill().map(() => React.createRef());
  }

  // Prepare the move queue from a sequence (loops forever)
  useEffect(() => {
    const base = parseMoves(moveSequence);
    const loop = [];
    for (let i = 0; i < 9999; i++) loop.push(...base);
    setQueue(loop);
  }, [moveSequence]);

  // Helper: select cubies that belong to a layer
  const selectLayer = (axis, layer) => {
    const i = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    return model
      .map((m, idx) => ({ m, idx }))
      .filter(({ m }) => m.grid.getComponent(i) === layer);
  };

  // Start next move
 const startNext = () => {
  if (!queue.length || !root.current) return;
  const [next, ...rest] = queue;
  setQueue(rest);

  // Ensure pivot is under root
  if (!root.current.children.includes(pivot.current)) {
    root.current.add(pivot.current);
  }
  pivot.current.rotation.set(0, 0, 0);
  pivot.current.position.set(0, 0, 0);

  // Reparent layer’s cubies to pivot
  const layerSet = selectLayer(next.axis, next.layer);
  layerSet.forEach(({ idx }) => {
    const g = cubieRefs.current[idx].current;
    if (g) pivot.current.attach(g);   // ✅ modern attach
  });

  clockRef.current = 0;
  setAnim({
    axis: next.axis,
    dir: next.dir,
    targetAngle: next.dir * (Math.PI / 2),
    duration: moveDuration,
    settling: false,
  });
};

  // Bake the pivot’s rotation back into each cubie’s transform and update their logical grid coords
  const finalizeMove = (axis, dir) => {
    // Detach children back to root and snap positions/rotations to grid
    const childList = [...pivot.current.children];
    childList.forEach((child) => {
      root.current.attach(child);
      // Snap transforms
      child.position.set(
        snap(child.position.x),
        snap(child.position.y),
        snap(child.position.z)
      );
      child.rotation.set(
        snap(child.rotation.x),
        snap(child.rotation.y),
        snap(child.rotation.z)
      );
    });

    // Update logical grid coordinates
    const rot = dir; // +1 or -1
    model.forEach((m, idx) => {
      const g = cubieRefs.current[idx].current;
      if (!g) return;
      // If this cubie was in the rotated layer, rotate its grid coords
      const layerIndex =
        axis === "x" ? 0 : axis === "y" ? 1 : 2;
      if (m.grid.getComponent(layerIndex) === (axis === "x" ? m.grid.x : axis === "y" ? m.grid.y : m.grid.z)) {
        // apply 90-deg rotation to (y,z) or (x,z) or (x,y)
        const { x, y, z } = m.grid;
        if (axis === "x") {
          // (y, z) -> (±z, ∓y)
          m.grid.set(x, rot > 0 ? -z : z, rot > 0 ? y : -y);
        } else if (axis === "y") {
          // (x, z) -> (∓z, ±x)
          m.grid.set(rot > 0 ? z : -z, y, rot > 0 ? -x : x);
        } else if (axis === "z") {
          // (x, y) -> (±y, ∓x)
          m.grid.set(rot > 0 ? -y : y, rot > 0 ? x : -x, z);
        }
      }
      // After updating grid, also make sure world position is exactly on lattice
      g.position.set(m.grid.x * SPACING, m.grid.y * SPACING, m.grid.z * SPACING);
      g.rotation.set(0, 0, 0); // we keep cubies axis-aligned after each face turn
    });

    // Reset pivot
    pivot.current.rotation.set(0, 0, 0);
  };

  // Drive animation
  useFrame((_, dt) => {
    if (!anim) {
      startNext();
      return;
    }

    // Still rotating
    if (!anim.settling) {
      const t = Math.min(1, (clockRef.current + dt) / anim.duration);
      clockRef.current += dt;
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      const angle = eased * anim.targetAngle;
      if (anim.axis === "x") pivot.current.rotation.x = angle;
      if (anim.axis === "y") pivot.current.rotation.y = angle;
      if (anim.axis === "z") pivot.current.rotation.z = angle;

      if (t >= 1) {
        // finalize, then brief pause before next move
        finalizeMove(anim.axis, anim.dir);
        setAnim({ ...anim, settling: true });
        clockRef.current = -pauseBetween; // reuse as pause timer (negative = waiting)
      }
      return;
    }

    // Pause between moves
    clockRef.current += dt;
    if (clockRef.current >= 0) {
      setAnim(null);
    }
  });

  return (
    <group ref={root}>
      {/* Pivot is added to root at runtime when needed */}
      {model.map((entry, i) => (
        <CubieWithRef
          key={entry.id}
          ref={cubieRefs.current[i]}
          geometry={geom}
          material={mat}
          position={[entry.pos.x, entry.pos.y, entry.pos.z]}
          edgeColor="#ffffff"
        />
      ))}
    </group>
  );
}

/** --- Exported component (canvas + lights + controls) --- */
export default function BlackRubiksCube({ height = "75vh", sequence = "R U R' U'" }) {
  return (
    <div style={{ width: "100%", height }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [7.5, 7.5, 7.5], fov: 45 }}
      >
        {/* Strong lighting so black reads well */}
        <ambientLight intensity={1.0} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={1.7}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[-10, 12, -6]}
          intensity={1.3}
          angle={0.4}
          penumbra={0.85}
          castShadow
        />
        <RubiksAnimated moveSequence={sequence} />
        <OrbitControls enableDamping dampingFactor={0.08} />
        {/* Soft ground shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <shadowMaterial opacity={0.22} />
        </mesh>
      </Canvas>
    </div>
  );
}
