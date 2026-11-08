"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Studio3D from "./Studio3D";

type P = { progress: { current: { value: number } } };

const gold = { color: "#e8bd4f", metalness: 1, roughness: 0.2, envMapIntensity: 1.6 } as const;

function starShape(outer = 0.42, inner = 0.18) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? inner : outer, a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i) s.lineTo(x, y); else s.moveTo(x, y);
  }
  s.closePath();
  return s;
}

function Trophy({ progress }: P) {
  const g = useRef<THREE.Group>(null);
  const k = useThree((st) => (st.viewport.aspect < 1 ? 0.62 : 1));
  const cup = useMemo(() => {
    const pts = [[0, 0], [0.18, 0.02], [0.2, 0.25], [0.12, 0.55], [0.1, 0.9], [0.35, 1.1], [0.72, 1.45], [0.92, 1.95], [0.98, 2.45], [1.02, 2.55], [0.94, 2.55], [0.88, 2.2]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 96);
  }, []);
  const star = useMemo(() => new THREE.ExtrudeGeometry(starShape(), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3 }), []);

  useFrame(({ clock, pointer }, dt) => {
    if (!g.current) return;
    const p = progress.current.value;
    const target = p * Math.PI * 4 + clock.elapsedTime * 0.25;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, target, 4, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, pointer.y * 0.15, 3, dt);
    g.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.08 + (k < 1 ? 0.5 : -0.05);
    const s = (0.72 + Math.min(p * 1.4, 1) * 0.12) * k;
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, s, 4, dt));
  });

  return (
    <group ref={g}>
      {/* plinth */}
      <mesh position={[0, -1.55, 0]}><cylinderGeometry args={[0.95, 1.05, 0.5, 64]} /><meshStandardMaterial color="#120203" metalness={0.4} roughness={0.35} /></mesh>
      <mesh position={[0, -1.27, 0]}><cylinderGeometry args={[0.96, 0.96, 0.06, 64]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, -1.83, 0]}><cylinderGeometry args={[1.06, 1.06, 0.06, 64]} /><meshStandardMaterial {...gold} /></mesh>
      {/* cup */}
      <mesh geometry={cup} position={[0, -1.25, 0]}><meshStandardMaterial {...gold} side={THREE.DoubleSide} /></mesh>
      {/* red enamel band */}
      <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.83, 0.75, 0.22, 96, 1, true]} /><meshStandardMaterial color="#b0121a" metalness={0.5} roughness={0.25} side={THREE.DoubleSide} /></mesh>
      {/* handles */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * 0.98, 0.55, 0]} rotation={[0, 0, d * -0.2]}>
          <torusGeometry args={[0.42, 0.06, 16, 48, Math.PI * 1.2]} />
          <meshStandardMaterial {...gold} />
        </mesh>
      ))}
      {/* star finial */}
      <mesh geometry={star} position={[0, 1.75, -0.08]}><meshStandardMaterial {...gold} /></mesh>
    </group>
  );
}

function Confetti({ progress }: P) {
  const n = 600;
  const { pos, col, vel } = useMemo(() => {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), vel = new Float32Array(n);
    const c = [new THREE.Color("#d71920"), new THREE.Color("#e5c96a"), new THREE.Color("#ffffff")];
    for (let i = 0; i < n; i++) {
      pos.set([(Math.random() - 0.5) * 14, Math.random() * 12 - 4, (Math.random() - 0.5) * 6 - 1], i * 3);
      const k = c[i % 3]; col.set([k.r, k.g, k.b], i * 3); vel[i] = 0.5 + Math.random();
    }
    return { pos, col, vel };
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    const pts = ref.current; if (!pts) return;
    const a = pts.geometry.attributes.position as THREE.BufferAttribute;
    const speed = 0.3 + progress.current.value * 2.5;
    for (let i = 0; i < n; i++) { let y = a.getY(i) - vel[i] * dt * speed; if (y < -5) y = 7; a.setY(i, y); }
    a.needsUpdate = true;
    (pts.material as THREE.PointsMaterial).opacity = 0.25 + progress.current.value * 0.75;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent depthWrite={false} />
    </points>
  );
}

export default function TrophyScene({ progress }: P) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.3, 8.5], fov: 36 }} gl={{ antialias: true, alpha: true }} aria-hidden>
      <Studio3D />
      <Trophy progress={progress} />
      <Confetti progress={progress} />
    </Canvas>
  );
}
