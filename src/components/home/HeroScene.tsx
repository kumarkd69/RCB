"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Night stadium: floodlight towers, light cones, crowd sparkles and floating particles. */

function Floodlight({ position, color = "#fff4d6" }: { position: [number, number, number]; color?: string }) {
  const cone = useRef<THREE.Mesh>(null);
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(({ clock }) => {
    if (cone.current) (cone.current.material as THREE.MeshBasicMaterial).opacity = 0.035 + Math.sin(clock.elapsedTime * 1.3 + position[0]) * 0.012;
  });
  const dir = new THREE.Vector3().subVectors(target, new THREE.Vector3(...position));
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().normalize());
  const mid = new THREE.Vector3(...position).add(dir.clone().multiplyScalar(0.5));
  return (
    <group>
      {/* tower */}
      <mesh position={[position[0], position[1] / 2, position[2]]}>
        <boxGeometry args={[0.15, position[1], 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* volumetric cone */}
      <mesh ref={cone} position={mid} quaternion={quat}>
        <coneGeometry args={[3.2, len, 32, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.035} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Crowd() {
  // stadium bowl ring of tiny lights (phone torches / flashes) in red & gold
  const { positions, colors } = useMemo(() => {
    const n = 2600, positions = new Float32Array(n * 3), colors = new Float32Array(n * 3);
    const red = new THREE.Color("#d71920"), gold = new THREE.Color("#c9a227"), white = new THREE.Color("#ffffff");
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const tier = Math.random();
      const r = 9 + tier * 5;
      positions.set([Math.cos(a) * r, 0.3 + tier * 3.2, Math.sin(a) * r * 0.75], i * 3);
      const c = Math.random() < 0.6 ? red : Math.random() < 0.7 ? gold : white;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors };
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.02; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Particles() {
  const positions = useMemo(() => {
    const n = 500, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) p.set([(Math.random() - 0.5) * 30, Math.random() * 12, (Math.random() - 0.5) * 20], i * 3);
    return p;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    const g = ref.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!g) return;
    for (let i = 0; i < g.count; i++) {
      let y = g.getY(i) + dt * 0.4;
      if (y > 12) y = 0;
      g.setY(i, y);
    }
    g.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.05} color="#e5c96a" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.05;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t) * 3 + pointer.x * 1.5, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 4.5 + pointer.y * 0.8, 0.03);
    camera.lookAt(0, 1.5, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 4.5, 16], fov: 50 }} gl={{ antialias: false, powerPreference: "high-performance" }} aria-hidden>
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 12, 34]} />
      <ambientLight intensity={0.15} />
      {/* pitch */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[8.5, 64]} />
        <meshStandardMaterial color="#0f2a14" roughness={1} emissive="#0b1f0f" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <planeGeometry args={[1, 4.5]} />
        <meshStandardMaterial color="#6b5a3a" roughness={1} />
      </mesh>
      <pointLight position={[0, 6, 0]} intensity={30} color="#fff4d6" distance={20} />
      <Floodlight position={[-11, 9, -6]} />
      <Floodlight position={[11, 9, -6]} />
      <Floodlight position={[-10, 8, 6]} color="#ffe2b0" />
      <Floodlight position={[10, 8, 6]} color="#ffe2b0" />
      <Crowd />
      <Particles />
      <Rig />
    </Canvas>
  );
}
