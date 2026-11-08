"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Studio3D from "./Studio3D";

/**
 * Procedural fan jersey (club's own design — not RCB's official kit artwork).
 * Front: club crest + "NAMMA RCB HQ". Back: "12" — the 12th man.
 */

const HALF_W = 2.35, HALF_H = 2.35;

function jerseyShape() {
  const right: [number, number][] = [[0.62, 2.28], [1.5, 2.12], [2.35, 1.2], [1.78, 0.62], [1.42, 0.98], [1.46, -2.2]];
  const s = new THREE.Shape();
  s.moveTo(-0.62, 2.28);
  s.quadraticCurveTo(0, 1.72, 0.62, 2.28);
  right.slice(1).forEach(([x, y]) => s.lineTo(x, y));
  s.quadraticCurveTo(0, -2.38, -1.46, -2.2);
  [...right].reverse().slice(1, -1).forEach(([x, y]) => s.lineTo(-x, y));
  s.lineTo(-1.5, 2.12);
  s.closePath();
  return s;
}

/** ShapeGeometry with UVs normalised to the jersey bounding box. */
function faceGeometry(shape: THREE.Shape) {
  const g = new THREE.ShapeGeometry(shape, 24);
  const p = g.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { uv[i * 2] = (p.getX(i) + HALF_W) / (HALF_W * 2); uv[i * 2 + 1] = (p.getY(i) + HALF_H) / (HALF_H * 2); }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

function paintBase(ctx: CanvasRenderingContext2D, S: number) {
  const g = ctx.createLinearGradient(0, 0, 0, S);
  g.addColorStop(0, "#d71920"); g.addColorStop(0.55, "#a5121a"); g.addColorStop(1, "#1a0304");
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  // diagonal gold pinstripes
  ctx.save(); ctx.globalAlpha = 0.09; ctx.strokeStyle = "#e5c96a"; ctx.lineWidth = 3;
  for (let x = -S; x < S * 2; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + S, S); ctx.stroke(); }
  ctx.restore();
  // black lower sweep with gold edge
  ctx.beginPath(); ctx.moveTo(0, S * 0.78); ctx.quadraticCurveTo(S * 0.5, S * 0.64, S, S * 0.78); ctx.lineTo(S, S); ctx.lineTo(0, S); ctx.closePath();
  ctx.fillStyle = "#0b0b0b"; ctx.fill();
  ctx.strokeStyle = "#c9a227"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, S * 0.78); ctx.quadraticCurveTo(S * 0.5, S * 0.64, S, S * 0.78); ctx.stroke();
  // collar
  ctx.strokeStyle = "#c9a227"; ctx.lineWidth = 22; ctx.beginPath();
  const cx = (x: number) => ((x + HALF_W) / (HALF_W * 2)) * S, cy = (y: number) => (1 - (y + HALF_H) / (HALF_H * 2)) * S;
  ctx.moveTo(cx(-0.62), cy(2.28)); ctx.quadraticCurveTo(cx(0), cy(1.72), cx(0.62), cy(2.28)); ctx.stroke();
  // sleeve cuffs
  ctx.lineWidth = 18;
  ctx.beginPath(); ctx.moveTo(cx(2.35), cy(1.2)); ctx.lineTo(cx(1.78), cy(0.62)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx(-2.35), cy(1.2)); ctx.lineTo(cx(-1.78), cy(0.62)); ctx.stroke();
  return { cx, cy };
}

function makeTextures(onUpdate: () => void) {
  const S = 1024;
  // next/font renames families; read the real names from the CSS variables
  const css = getComputedStyle(document.documentElement);
  const anton = css.getPropertyValue("--font-anton").trim() || "Impact, sans-serif";
  const inter = css.getPropertyValue("--font-inter").trim() || "sans-serif";
  const mk = () => { const c = document.createElement("canvas"); c.width = c.height = S; return c; };
  const front = mk(), back = mk();
  const f = front.getContext("2d")!, b = back.getContext("2d")!;
  const img = new Image();
  const paint = () => {
  paintBase(f, S);
  f.fillStyle = "#f3efe6"; f.font = `46px ${anton}`; f.textAlign = "center";
  f.fillText("NAMMA RCB HQ", S / 2, S * 0.6);
  const { cy } = paintBase(b, S);
  b.textAlign = "center"; b.fillStyle = "#e5c96a"; b.font = `70px ${anton}`;
  b.fillText("NAMMA HQ", S / 2, cy(1.45));
  b.font = `330px ${anton}`; b.lineWidth = 14; b.strokeStyle = "#8e0f14";
  b.strokeText("12", S / 2, S * 0.62); b.fillText("12", S / 2, S * 0.62);
  b.font = `600 34px ${inter}`; b.fillStyle = "#f3efe6"; b.fillText("THE 12TH MAN", S / 2, S * 0.69);

    if (img.complete && img.naturalWidth) { const h = 300, w = h * (img.width / img.height); f.drawImage(img, S / 2 - w / 2, S * 0.2, w, h); }
  };
  paint();
  const tf = new THREE.CanvasTexture(front), tb = new THREE.CanvasTexture(back);
  [tf, tb].forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; });
  const refresh = () => { paint(); tf.needsUpdate = tb.needsUpdate = true; onUpdate(); };
  img.onload = refresh;
  img.src = "/brand/logo-600.png";
  document.fonts?.ready.then(refresh);
  return { tf, tb };
}

function Jersey({ progress }: { progress: { current: { value: number } } }) {
  const g = useRef<THREE.Group>(null);
  const shape = useMemo(jerseyShape, []);
  const face = useMemo(() => faceGeometry(shape), [shape]);
  const body = useMemo(() => new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 6, curveSegments: 24 }), [shape]);
  const { viewport } = useThree();
  const wide = viewport.aspect > 1;
  const baseX = wide ? viewport.width * 0.16 : 0;
  const tex = useMemo(() => (typeof document === "undefined" ? null : makeTextures(() => {})), []);
  useEffect(() => () => { tex?.tf.dispose(); tex?.tb.dispose(); }, [tex]);

  useFrame(({ clock, pointer }, dt) => {
    if (!g.current) return;
    const p = progress.current.value, t = clock.elapsedTime;
    // front → back (p≈0.5) → front, with a tilt and a gentle float
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, p * Math.PI * 2 + pointer.x * 0.25, 4, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, Math.sin(p * Math.PI) * -0.25 + pointer.y * 0.1, 4, dt);
    g.current.rotation.z = Math.sin(t * 0.8) * 0.03 + Math.sin(p * Math.PI * 2) * 0.12;
    g.current.position.y = Math.sin(t * 1.1) * 0.08;
    g.current.position.x = THREE.MathUtils.damp(g.current.position.x, baseX + Math.sin(p * Math.PI * 2) * 0.4, 3, dt);
    g.current.position.y += wide ? 0 : 0.55;
  });

  if (!tex) return null;
  const zf = 0.22 + 0.08 + 0.003, zb = -0.08 - 0.003;
  return (
    <group ref={g} scale={wide ? 0.62 : 0.4}>
      <mesh geometry={body}><meshStandardMaterial color="#7a0d12" roughness={0.6} metalness={0.1} /></mesh>
      <mesh geometry={face} position-z={zf}><meshStandardMaterial map={tex.tf} roughness={0.55} metalness={0.05} /></mesh>
      <mesh geometry={face} position-z={zb} rotation-y={Math.PI}><meshStandardMaterial map={tex.tb} roughness={0.55} metalness={0.05} /></mesh>
    </group>
  );
}

export default function JerseyScene({ progress }: { progress: { current: { value: number } } }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }} aria-hidden>
      <Studio3D />
      <Jersey progress={progress} />
    </Canvas>
  );
}
