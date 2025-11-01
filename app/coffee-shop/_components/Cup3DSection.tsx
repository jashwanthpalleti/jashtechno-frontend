"use client";

import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ⬅️ Put your real scene here (or import it). Example minimal stub:
export default function Cup3DSection() {
  return (
    <Canvas camera={{ position: [0, 1.2, 3], fov: 50 }}>
      <color attach="background" args={["#FAF6F1"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 2]} intensity={1} />
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </mesh>
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  );
}
