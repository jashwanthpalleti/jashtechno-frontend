"use client";

import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  useGLTF,
  Bounds,
} from "@react-three/drei";
import * as THREE from "three";

/* ---------- Tunables ---------- */
const CUP_SCALE = 0.3;
const LIFT_GAP = 0.01;

const CAMERA_DESKTOP: [number, number, number] = [2.8, 1.8, 3.6];
const CAMERA_MOBILE: [number, number, number] = [2.4, 1.5, 3.0];

const ROT_DEFAULT = 0;
const ROT_OPEN = -Math.PI / 6; // ~30° left

type GroupRef = React.MutableRefObject<THREE.Group | null>;

/* ---------- Utilities ---------- */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    const set = () => setDesktop(mql.matches);
    set();
    mql.addEventListener?.("change", set);
    return () => mql.removeEventListener?.("change", set);
  }, []);
  return desktop;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mql.matches);
    set();
    mql.addEventListener?.("change", set);
    return () => mql.removeEventListener?.("change", set);
  }, []);
  return reduced;
}

/* ---------- Models ---------- */
function CupModel({ cupRef }: { cupRef: GroupRef }) {
  const { scene } = useGLTF("/models/cup.glb");
  return <primitive ref={cupRef} object={scene} dispose={null} />;
}
useGLTF.preload("/models/cup.glb");

/* ---------- Smooth rotation ---------- */
function CupRotator({
  groupRef,
  targetRotY,
  reducedMotion,
}: {
  groupRef: React.MutableRefObject<THREE.Group | null>;
  targetRotY: number;
  reducedMotion: boolean;
}) {
  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    if (reducedMotion) {
      g.rotation.y = targetRotY;
      return;
    }
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 5, dt);
  });
  return null;
}

/* ---------- Handle projector ---------- */
function HandleProjector({
  anchorRef,
  onChange,
}: {
  anchorRef: React.MutableRefObject<THREE.Object3D | null>;
  onChange: (xy: { x: number; y: number } | null) => void;
}) {
  useFrame(({ camera, size }) => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const world = new THREE.Vector3();
    anchor.getWorldPosition(world);

    const ndc = world.clone().project(camera);
    if (ndc.z > 1) {
      onChange(null);
      return;
    }

    const x = (ndc.x * 0.5 + 0.5) * size.width;
    const y = (-ndc.y * 0.5 + 0.5) * size.height;
    onChange({ x, y });
  });
  return null;
}

/* ---------- Main ---------- */
export default function Cup3D() {
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  const cupRef = useRef<THREE.Group>(null);
  const cupGroupRef = useRef<THREE.Group>(null);
  const anchorRef = useRef<THREE.Object3D | null>(null);

  const [groundY, setGroundY] = useState(0);
  const [cupPos, setCupPos] = useState(() => new THREE.Vector3(0, 0, 0));
  const [menuXY, setMenuXY] = useState<{ x: number; y: number } | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const targetRotY = navOpen ? ROT_OPEN : ROT_DEFAULT;

  const closeNav = useCallback(() => setNavOpen(false), []);
  const toggleNav = useCallback(() => setNavOpen((v) => !v), []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeNav]);

  // Cup placement & handle anchor
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const cup = cupRef.current;
      if (!cup) return;

      cup.scale.setScalar(CUP_SCALE);

      const raf2 = requestAnimationFrame(() => {
        const box = new THREE.Box3().setFromObject(cup);
        const bottomY = box.min.y;
        const finalY = 0 - bottomY + LIFT_GAP;

        setGroundY(0);
        setCupPos(new THREE.Vector3(0, finalY, 0));

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const worldAnchor = new THREE.Vector3(
          center.x + size.x * 0.55,
          center.y + size.y * 0.05,
          center.z + size.z * 0.02
        );

        if (!anchorRef.current) {
          anchorRef.current = new THREE.Object3D();
          cupGroupRef.current?.add(anchorRef.current);
        }
        if (cupGroupRef.current && anchorRef.current) {
          const local = cupGroupRef.current.worldToLocal(worldAnchor.clone());
          anchorRef.current.position.copy(local);
        }
      });

      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const cupGroupProps = useMemo(
    () => ({ position: [cupPos.x, cupPos.y, cupPos.z] as [number, number, number] }),
    [cupPos]
  );

  return (
    <div
      className={`relative ${isDesktop ? "h-[80vh]" : "h-[65vh]"} w-full overflow-hidden`}
      aria-label="Coffee House interactive hero"
    >
      {/* ===== BACKGROUND PHOTO (behind everything) ===== */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/coffee-shop.jpg')",
        }}
        aria-hidden
      />

      {/* Subtle top-to-bottom black gradient for depth & readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      />

      {/* Soft floor vignette so the cup shadow blends with the photo */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none h-1/3"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.0) 70%)",
        }}
        aria-hidden
      />

      {/* ===== BACKDROP BLUR WHEN NAV OPENS ===== */}
      <button
        aria-hidden={!navOpen}
        onClick={closeNav}
        className={[
          "absolute inset-0 z-[15] transition-opacity duration-500 ease-out backdrop-blur-md bg-white/30",
          navOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* ===== NAVIGATION SHEET/BAR ===== */}
      <nav
        aria-label="Coffee navigation"
        className={[
          "absolute inset-x-0 z-[20] mx-auto transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          isDesktop
            ? navOpen
              ? "top-20 opacity-100 scale-100"
              : "-top-40 opacity-0 scale-95"
            : navOpen
              ? "bottom-2 opacity-100"
              : "-bottom-64 opacity-0",
          isDesktop
            ? "max-w-5xl rounded-xl bg-white/92 backdrop-blur-xl shadow-2xl border border-white/60"
            : "mx-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/60",
        ].join(" ")}
      >
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-stone-800 font-medium">
          <div className="text-xl font-extrabold tracking-tight text-stone-900">
            Coffee&nbsp;House
          </div>
          <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <li><a href="#menu" className="hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded px-1">Menu</a></li>
            <li><a href="#story" className="hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded px-1">Our Story</a></li>
            <li><a href="#visit" className="hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded px-1">Visit</a></li>
          </ul>
          <button
            onClick={closeNav}
            className="rounded-md bg-stone-900 text-white px-4 py-2 text-sm shadow-md hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
          >
            Close
          </button>
        </div>
      </nav>

      {/* ===== 3D SCENE ===== */}
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{
          position: isDesktop ? CAMERA_DESKTOP : CAMERA_MOBILE,
          fov: isDesktop ? 40 : 45,
          near: 0.1,
          far: 100,
        }}
        className="absolute inset-0 z-[10]"
      >
        <Suspense fallback={null}>
          {/* Slightly warmer lighting so the cup “sits” into the photo */}
          <hemisphereLight intensity={0.6} groundColor="#6b7280" />
          <directionalLight position={[5, 6, 4]} intensity={1.05} />

          <Bounds fit clip observe margin={isDesktop ? 1.1 : 1.05}>
            <group ref={cupGroupRef} position={cupPos}>
              <CupModel cupRef={cupRef} />
            </group>
          </Bounds>

          <CupRotator
            groupRef={cupGroupRef}
            targetRotY={targetRotY}
            reducedMotion={usePrefersReducedMotion()}
          />

          {/* Keep the contact shadow subtle so it blends with the ground in the photo */}
          <ContactShadows
            position={[0, groundY, 0]}
            opacity={0.22}
            scale={isDesktop ? 8 : 7}
            blur={2.6}
            far={3.6}
            frames={1}
          />

          <Environment preset="city" />

          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={isDesktop}
            target={[0, groundY + 0.25, 0]}
            minPolarAngle={Math.PI * 0.3}
            maxPolarAngle={Math.PI * 0.75}
            minDistance={isDesktop ? 1.4 : 1.2}
            maxDistance={isDesktop ? 8 : 6.5}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
          />

          <HandleProjector anchorRef={anchorRef} onChange={setMenuXY} />
        </Suspense>
      </Canvas>

      {/* ===== FLOATING MENU BUTTON ===== */}
      <button
        onClick={toggleNav}
        aria-label="Open cafe navigation"
        aria-expanded={navOpen}
        className={[
          "fixed z-[50] rounded-full bg-amber-400 text-black font-semibold shadow-xl select-none",
          "transition-all duration-300 ease-in-out hover:scale-[1.05] active:scale-[0.97]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400",
          isDesktop ? "px-4 py-2 text-sm" : "px-5 py-3 text-base",
        ].join(" ")}
        style={{
          left: menuXY ? `${menuXY.x}px` : "50%",
          top: menuXY ? `${menuXY.y}px` : (isDesktop ? "65%" : "70%"),
          transform: "translate(-50%, -50%)",
          pointerEvents: "auto",
          touchAction: "manipulation",
        }}
      >
        Menu
      </button>
    </div>
  );
}
