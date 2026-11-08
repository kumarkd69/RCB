"use client";
import { Environment, Lightformer } from "@react-three/drei";

/** Offline studio lighting (no HDR download) for metallic gold. */
export default function Studio3D({ rim = "#d71920" }: { rim?: string }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 8, 6]} angle={0.4} penumbra={1} intensity={60} color="#fff3d6" />
      <pointLight position={[-5, 2, -3]} intensity={40} color={rim} />
      <pointLight position={[5, -1, -4]} intensity={25} color={rim} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -6]} scale={[10, 3, 1]} color="#fff6dc" />
        <Lightformer form="rect" intensity={2.5} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#ffe2a8" />
        <Lightformer form="rect" intensity={2} position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color={rim} />
        <Lightformer form="ring" intensity={3} position={[0, 0, 6]} scale={4} color="#ffffff" />
      </Environment>
    </>
  );
}
