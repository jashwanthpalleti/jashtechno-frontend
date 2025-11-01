"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bounds,
  ContactShadows,
  Environment,
  Html,
  Image,
  OrbitControls,
  Text,
  useBounds,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

/* ========= Look & Feel ========= */
const BG_COL = "#FAF6F1";
const DPR_MIN = 1.0;
const DPR_MAX = 2.0;

/* Furniture sizes */
const TABLE_WIDTH = 0.9;
const CHAIR_HEIGHT = 0.85;
const ROSE_HEIGHT = 0.18;
const CUP_HEIGHT = 0.12;
const CARD_HEIGHT = 0.14;

/* Seating grid */
const COLS = 3;
const ROWS = 2;
const COL_SPACING = 2.5; // grid spacing between tables (x)
const ROW_SPACING = 2.2; // grid spacing between tables (z)

/* Room proportions */
const ROOM_MARGIN = 1.6;
const ROOM_HEIGHT = 2.4;
const FLOOR_EXTRA = 6.0;

/* Palette */
const WALL_BASE = "#EAE0D6";
const TRIM_COLOR = "#B08968";
const FLOOR_COLOR = "#9C6B4A";
const STRIPE_COLOR = "#8FB9B7";

/* Typography / spacing */
const WALL_TEXT_GUTTER = 0.22; // widened so text stays inside walls
const SURFACE_EPS = 0.00012;

/* Overlay tabs */
type OverlayTab = "menu" | "story" | "achievements" | "visit" | null;

/* Small Z offset to float wall content off the plane (no z-fighting) */
const Z_PAD = 0.02;

/* ============== Helpers ============== */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);
  return mobile;
}

function normalizeScene(
  scene: THREE.Object3D,
  target: number,
  mode: "width" | "height" | "depth"
) {
  const clone = scene.clone(true);
  const box = new THREE.Box3().setFromObject(clone);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const root = new THREE.Group();
  root.add(clone);

  const minY = box.min.y;
  clone.position.set(
    clone.position.x - center.x,
    clone.position.y - minY,
    clone.position.z - center.z
  );

  const sized = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  sized.getSize(size);
  const current =
    mode === "width" ? size.x : mode === "height" ? size.y : size.z;
  root.scale.setScalar(current > 0 ? target / current : 1);

  return root;
}

/* ============== Models ============== */
function TableNorm(
  p: React.JSX.IntrinsicElements["group"] & { width?: number }
) {
  const { scene } = useGLTF("/models/table.glb");
  const root = useMemo(
    () => normalizeScene(scene, p.width ?? TABLE_WIDTH, "width"),
    [scene, p.width]
  );
  return <primitive object={root} {...p} />;
}
function ChairNorm(
  p: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/chair.glb");
  const root = useMemo(
    () => normalizeScene(scene, p.height ?? CHAIR_HEIGHT, "height"),
    [scene, p.height]
  );
  return <primitive object={root} {...p} />;
}
function RoseNorm(
  p: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/rose.glb");
  const root = useMemo(
    () => normalizeScene(scene, p.height ?? ROSE_HEIGHT, "height"),
    [scene, p.height]
  );
  return <primitive object={root} {...p} />;
}
function CupNorm(
  p: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/coffees.glb");
  const root = useMemo(
    () => normalizeScene(scene, p.height ?? CUP_HEIGHT, "height"),
    [scene, p.height]
  );
  return <primitive object={root} {...p} />;
}
function MenuCardNorm(
  p: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/menucard.glb");
  const root = useMemo(
    () => normalizeScene(scene, p.height ?? CARD_HEIGHT, "height"),
    [scene, p.height]
  );
  return <primitive object={root} {...p} />;
}

useGLTF.preload("/models/chair.glb");
useGLTF.preload("/models/table.glb");
useGLTF.preload("/models/rose.glb");
useGLTF.preload("/models/coffees.glb");
useGLTF.preload("/models/menucard.glb");

/* ============== Table Set ============== */
function TableSet({
  position = [0, 0, 0] as [number, number, number],
}) {
  // --- Measure the real chair bounds after normalization ---
  const { scene: chairScene } = useGLTF("/models/chair.glb");

  const chairRoot = useMemo(
    () => normalizeScene(chairScene, CHAIR_HEIGHT, "height"),
    [chairScene]
  );

  const { chairW, chairD } = useMemo(() => {
    // Use a cloned, invisible root to compute bounds
    const rootClone = chairRoot.clone(true);
    const box = new THREE.Box3().setFromObject(rootClone);
    const size = new THREE.Vector3();
    box.getSize(size);
    return { chairW: size.x, chairD: size.z };
  }, [chairRoot]);

  // --- Spacing math (based on real bounds) ---
  const halfTable = TABLE_WIDTH / 2;

  // Clearances you can tweak
  const TABLE_CLEARANCE = 0.18; // free space between table edge and chair edge
  const CHAIR_CLEARANCE = 0.08; // free space between chairs themselves
  const CORNER_CLEAR = 0.06;    // extra guard so corners never kiss

  // Chairs at the ends (±X): distance from table center
  const endX =
    halfTable + TABLE_CLEARANCE + chairD / 2 + CORNER_CLEAR;

  // Chairs at the sides (±Z): distance from table center
  const sideZ =
    halfTable + TABLE_CLEARANCE + chairW / 2 + CORNER_CLEAR;

  // Tiny outward splay to look natural (keeps faces toward table)
  const ROT_SPLAY = 0.0; // set to e.g. 0.08 if you want a subtle angle

  // --- Surface ray for items on table ---
  const containerRef = useRef<THREE.Group>(null);
  const tableRef = useRef<THREE.Group>(null);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const down = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const getSurfaceLocalY = (lx: number, lz: number) => {
    if (!tableRef.current || !containerRef.current) return 0;
    const originLocal = new THREE.Vector3(lx, 5, lz);
    const originWorld = tmp.set(originLocal.x, originLocal.y, originLocal.z);
    containerRef.current.localToWorld(originWorld);

    const dirWorld = down.clone();
    const q = new THREE.Quaternion();
    containerRef.current.getWorldQuaternion(q);
    dirWorld.applyQuaternion(q).normalize();

    raycaster.set(originWorld, dirWorld);
    const hits = raycaster.intersectObject(tableRef.current, true);
    if (!hits.length) return 0;

    const hitLocal = hits[0].point.clone();
    containerRef.current.worldToLocal(hitLocal);
    return hitLocal.y;
  };

  const [ys, setYs] = useState<{ rose: number; cup: number; card: number } | null>(null);

  useFrame(() => {
    if (!tableRef.current || !containerRef.current || ys) return;
    const yRose = getSurfaceLocalY(0, 0);
    const yCup = getSurfaceLocalY(0.12, 0.08);
    const yCard = getSurfaceLocalY(-0.14, -0.06);
    if ([yRose, yCup, yCard].every(Number.isFinite)) setYs({ rose: yRose, cup: yCup, card: yCard });
  });

  // Hover cursor (leave in case you add interactivity later)
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group ref={containerRef} position={position}>
      {/* Table */}
      <group ref={tableRef}>
        <TableNorm width={TABLE_WIDTH} />
      </group>

      {/* Items on table (auto-dropped to surface) */}
      {ys && (
        <>
          <RoseNorm position={[0, ys.rose + SURFACE_EPS, 0]} height={ROSE_HEIGHT} />
          <CupNorm position={[0.12, ys.cup + SURFACE_EPS, 0.08]} height={CUP_HEIGHT} />
          <group position={[-0.14, ys.card + SURFACE_EPS, -0.06]} rotation={[-0.06, 0.15, 0.02]}>
            <MenuCardNorm height={CARD_HEIGHT} />
          </group>
        </>
      )}

      {/* Chairs — auto-spaced so they don't touch table or each other */}
      {/* Left end */}
      <ChairNorm
        position={[-endX, 0, 0]}
        rotation={[0, Math.PI / 2 + ROT_SPLAY, 0]}
      />
      {/* Right end */}
      <ChairNorm
        position={[endX, 0, 0]}
        rotation={[0, -Math.PI / 2 - ROT_SPLAY, 0]}
      />
      {/* Back side (facing table) */}
      <ChairNorm
        position={[0, 0, -sideZ]}
        rotation={[0, 0 + ROT_SPLAY, 0]}
      />
      {/* Front side (facing table) */}
      <ChairNorm
        position={[0, 0, sideZ]}
        rotation={[0, Math.PI - ROT_SPLAY, 0]}
      />
    </group>
  );
}

/* ============== Room ============== */
function RoomShell({
  totalWidth,
  totalDepth,
}: {
  totalWidth: number;
  totalDepth: number;
}) {
  const wallW = totalWidth + ROOM_MARGIN * 2;
  const wallD = totalDepth + ROOM_MARGIN * 2;

  const halfW = wallW / 2;
  const halfD = wallD / 2;

  const baseMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: WALL_BASE, roughness: 0.96 }),
    []
  );
  const trimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: TRIM_COLOR, roughness: 0.9 }),
    []
  );
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: FLOOR_COLOR,
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  );
  const stripeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: STRIPE_COLOR, roughness: 0.95 }),
    []
  );

  const STRIPE_H = 0.18;
  const stripeY = ROOM_HEIGHT - STRIPE_H / 2 - 0.04;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[wallW + FLOOR_EXTRA, wallD + FLOOR_EXTRA]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, ROOM_HEIGHT / 2, -halfD]} receiveShadow castShadow>
        <planeGeometry args={[wallW, ROOM_HEIGHT]} />
        <primitive object={baseMat} attach="material" />
      </mesh>
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-halfW, ROOM_HEIGHT / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[wallD, ROOM_HEIGHT]} />
        <primitive object={baseMat} attach="material" />
      </mesh>
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[halfW, ROOM_HEIGHT / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[wallD, ROOM_HEIGHT]} />
        <primitive object={baseMat} attach="material" />
      </mesh>

      {/* Accent stripe */}
      <mesh position={[0, stripeY, -halfD + 0.001]}>
        <planeGeometry args={[wallW, STRIPE_H]} />
        <primitive object={stripeMat} attach="material" />
      </mesh>
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-halfW + 0.001, stripeY, 0]}
      >
        <planeGeometry args={[wallD, STRIPE_H]} />
        <primitive object={stripeMat} attach="material" />
      </mesh>
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[halfW - 0.001, stripeY, 0]}
      >
        <planeGeometry args={[wallD, STRIPE_H]} />
        <primitive object={stripeMat} attach="material" />
      </mesh>

      {/* Baseboard */}
      <mesh position={[0, 0.06, -halfD + 0.001]}>
        <planeGeometry args={[wallW, 0.12]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[-halfW + 0.001, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[wallD, 0.12]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[halfW - 0.001, 0.06, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[wallD, 0.12]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
    </group>
  );
}

/* ============== Wall Copy + Nav + Logo + Sconce ============== */
function WallCopy({
  wallW,
  wallD,
  showNav,
  onOpenTab,
}: {
  wallW: number;
  wallD: number;
  showNav: boolean;
  onOpenTab: (tab: Exclude<OverlayTab, null>) => void;
}) {
  const isMobile = useIsMobile();

  const halfW = wallW / 2;
  const halfD = wallD / 2;

  const heroMaxWidth = wallW - WALL_TEXT_GUTTER * 2.4;
  const sideMaxWidth = wallD - WALL_TEXT_GUTTER * 2.4;

  // Responsive sizes
  const fsHero = isMobile ? 0.18 : 0.24;
  const fsBody = isMobile ? 0.085 : 0.1;
  const navDF = isMobile ? 10 : 10;

  const logoW = isMobile ? 0.55 : 0.7;
  const logoH = isMobile ? 0.36 : 0.46;

  // positions on front wall
  const navY = 0.25;
  const logoY = -0.09;
  const tagY = -0.48;

  const logoRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (spotRef.current && logoRef.current) {
      const t = new THREE.Object3D();
      logoRef.current.add(t);
      spotRef.current.target = t;
      spotRef.current.target.updateMatrixWorld();
    }
  }, []);

  const photoW = isMobile ? 0.72 : 0.9;
  const photoH = isMobile ? 0.48 : 0.6;
  const photoGap = 0.16;

  return (
    <group>
      {/* FRONT wall: nav + logo + tagline */}
      <group position={[0, ROOM_HEIGHT * 0.66, -halfD + Z_PAD]}>
        {showNav && (
          <Html
            transform
            distanceFactor={navDF}
            position={[0, navY, Z_PAD]}
            style={{
              pointerEvents: "auto",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
            }}
          >
            <nav
              className={`flex justify-center items-center gap-0.3 ${
                isMobile ? "text-[8px]" : "text-[6px]"
              } font-semibold text-stone-850`}
            >
              {["Menu", "Story", "Achievements", "Visit"].map((label) => (
                <button
                  key={label}
                  onClick={() =>
                    onOpenTab(label.toLowerCase() as any)
                  }
                  className="relative px-3 py-1 hover:underline hover:text-amber-700 transition"
                >
                  {label}
                </button>
              ))}
            </nav>
          </Html>
        )}

        {/* Logo between nav and tagline */}
        <group ref={logoRef} position={[0, logoY, Z_PAD]}>
          <mesh position={[0, 0, -0.001]}>
            <planeGeometry args={[logoW + 0.05, logoH + 0.05]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <Image
            url="/images/logocoffee.png"
            position={[0, 0, 0]}
            scale={[logoW, logoH]}
            toneMapped={false}
          />
        </group>

        {/* Sconce above the logo */}
        <group position={[0, logoY + logoH / 2 + 0.22, Z_PAD + 0.05]}>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
            <meshStandardMaterial
              color="#6b6156"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffd7a1"
              emissiveIntensity={1.0}
              roughness={0.4}
            />
          </mesh>
          <spotLight
            ref={spotRef}
            position={[0, 0.12, 0.6]}
            intensity={1.8}
            color={"#ffd7a1"}
            angle={0.55}
            penumbra={0.6}
            distance={3.5}
            castShadow
          />
          <pointLight
            position={[0, 0.06, 0.08]}
            intensity={0.6}
            distance={1.6}
            decay={2.0}
            color={"#ffd7a1"}
          />
        </group>

        {/* Tagline */}
        <Text
          fontSize={fsHero}
          position={[0, tagY, Z_PAD]}
          color="#2B1E16"
          maxWidth={heroMaxWidth}
          anchorX="center"
          anchorY="top"
        >
          Every cup tells a story
        </Text>
        <Text
          position={[0, tagY - 0.3, Z_PAD]}
          fontSize={fsBody}
          color="#5B4636"
          maxWidth={heroMaxWidth * 0.78}
          anchorX="center"
          anchorY="top"
          lineHeight={1.25}
        >
          A cozy room for slow mornings, long talks, and balanced roasts.
        </Text>
      </group>

      {/* LEFT wall: photos + quotes */}
      <group
        rotation={[0, Math.PI / 2, 0]}
        position={[-halfW + Z_PAD, ROOM_HEIGHT * 0.65, 0]}
      >
        <Text
          fontSize={isMobile ? 0.16 : 0.2}
          color="#2B1E16"
          maxWidth={sideMaxWidth}
          anchorX="left"
          anchorY="top"
          position={[0.3, 0.3, Z_PAD]}
        >
          Coffee Vibes
        </Text>

        <group position={[-1.3, -0.28, Z_PAD] as [number, number, number]}>
          <Image
            url="/images/coffee1.jpg"
            position={[
              -(photoW / 2 + photoGap / 2),
              0,
              Z_PAD,
            ] as [number, number, number]}
            scale={[photoW, photoH] as [number, number]}
          />
          <Image
            url="/images/coffee2.jpg"
            position={[
              photoW / 2 + photoGap / 2,
              0,
              Z_PAD,
            ] as [number, number, number]}
            scale={[photoW, photoH] as [number, number]}
          />
          {/* frames */}
          <mesh
            position={[
              -(photoW / 2 + photoGap / 2),
              0,
              Z_PAD - 0.001,
            ] as [number, number, number]}
          >
            <planeGeometry args={[photoW + 0.02, photoH + 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh
            position={[
              photoW / 2 + photoGap / 2,
              0,
              Z_PAD - 0.001,
            ] as [number, number, number]}
          >
            <planeGeometry args={[photoW + 0.02, photoH + 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        <group position={[0, -0.95, Z_PAD]}>
          <Text
            fontSize={isMobile ? 0.095 : 0.11}
            color="#2B1E16"
            anchorX="left"
            anchorY="top"
            maxWidth={sideMaxWidth}
            lineHeight={1.25}
            position={[0, 0.9, Z_PAD]}
          >
            “First sip, deep breath, new chapter.”
          </Text>
          <Text
            position={[0, 0.7, Z_PAD]}
            fontSize={isMobile ? 0.095 : 0.11}
            color="#2B1E16"
            anchorX="left"
            anchorY="top"
            maxWidth={sideMaxWidth}
            lineHeight={1.25}
          >
            “Espresso yourself — the world will catch up.”
          </Text>
          <Text
            position={[0, 0.5, Z_PAD]}
            fontSize={isMobile ? 0.095 : 0.11}
            color="#2B1E16"
            anchorX="left"
            anchorY="top"
            maxWidth={sideMaxWidth}
            lineHeight={1.25}
          >
            “Brewed for kindness. Served with patience.”
          </Text>
          <Text
            position={[0, -0.6, Z_PAD]}
            fontSize={isMobile ? 0.095 : 0.11}
            color="#2B1E16"
            anchorX="left"
            anchorY="top"
            maxWidth={sideMaxWidth}
            lineHeight={1.25}
          >
            “Small cups. Big conversations.”
          </Text>
        </group>
      </group>

      {/* RIGHT wall: story */}
      <group
        rotation={[0, -Math.PI / 2, 0]}
        position={[halfW - Z_PAD, ROOM_HEIGHT * 0.70, 0]}
      >
        <Text
          fontSize={isMobile ? 0.10: 0.2}
          color="#2B1E16"
          maxWidth={sideMaxWidth}
          anchorX="left"
          anchorY="top"
          position={[-1, 0.2, Z_PAD]}
        >
          Our Story
        </Text>
        <Text
          position={[-2, -0.2, Z_PAD]}
          fontSize={isMobile ? 0.09 : 0.105}
          color="#5B4636"
          maxWidth={sideMaxWidth * 0.88}
          anchorX="left"
          anchorY="top"
          lineHeight={1.25}
        >
          We began with a tiny roaster, a borrowed bar, and a belief: coffee is
          hospitality. Farmers first, flavors second, trends last. Today we
          still hand-tune each batch and pull every shot with care.
        </Text>
        <Text
          position={[-2, -0.62, Z_PAD]}
          fontSize={isMobile ? 0.09 : 0.1}
          color="#2B1E16"
          maxWidth={sideMaxWidth}
          anchorX="left"
          anchorY="top"
        >
          • Traceable sourcing   • Third-place community   • Sustainable steps
        </Text>
      </group>

      {/* BACK wall: feel-good line */}
      <group
        rotation={[0, Math.PI, 0]}
        position={[0, ROOM_HEIGHT * 0.62, halfD - Z_PAD]}
      >
        <Text
          fontSize={isMobile ? 0.16 : 0.2}
          color="#2B1E16"
          maxWidth={heroMaxWidth}
          anchorX="center"
          anchorY="top"
          position={[0, 0, Z_PAD]}
        >
          Brew kindness daily
        </Text>
        <Text
          position={[0, -0.22, Z_PAD]}
          fontSize={isMobile ? 0.09 : 0.11}
          color="#5B4636"
          maxWidth={heroMaxWidth * 0.82}
          anchorX="center"
          anchorY="top"
          lineHeight={1.25}
        >
          Good coffee. Good company. Good day.
        </Text>
      </group>
    </group>
  );
}

/* ============== Camera snap helpers ============== */
function RefitShortcuts({
  refs,
}: {
  refs: React.MutableRefObject<(THREE.Object3D | null)[]>;
}) {
  const bounds = useBounds();
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "1" || k === "2" || k === "3" || k === "4") {
        const idx = Number(k) - 1;
        const t = refs.current[idx];
        if (t) bounds.refresh(t).fit();
      }
      if (k.toLowerCase() === "r") bounds.refresh().fit();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [bounds, refs]);
  return null;
}

/* ============== Static room + walls ============== */
function StaticRoomAndText({
  totalWidth,
  totalDepth,
  showNav,
  onOpenTab,
}: {
  totalWidth: number;
  totalDepth: number;
  showNav: boolean;
  onOpenTab: (tab: Exclude<OverlayTab, null>) => void;
}) {
  return (
    <>
      <RoomShell totalWidth={totalWidth} totalDepth={totalDepth} />
      <WallCopy
        wallW={totalWidth + ROOM_MARGIN * 2}
        wallD={totalDepth + ROOM_MARGIN * 2}
        showNav={showNav}
        onOpenTab={onOpenTab}
      />
    </>
  );
}

function SeatingGrid({
  positions,
}: {
  positions: [number, number, number][];
}) {
  return (
    <>
      {positions.map((pos, i) => (
        <TableSet key={i} position={pos} />
      ))}
    </>
  );
}

/* ============== Big room ============== */
function BigRoom({
  onOpenTab,
  showNav,
}: {
  onOpenTab: (tab: Exclude<OverlayTab, null>) => void;
  showNav: boolean;
}) {
  const positions: [number, number, number][] = [];
  const totalWidth = (COLS - 1) * COL_SPACING;
  const totalDepth = (ROWS - 1) * ROW_SPACING;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      positions.push([
        c * COL_SPACING - totalWidth / 2,
        0,
        r * ROW_SPACING - totalDepth / 2,
      ]);
    }
  }

  // Snap targets
  const anchorHero = useRef<THREE.Group>(null);
  const anchorStory = useRef<THREE.Group>(null);
  const anchorBack = useRef<THREE.Group>(null);
  const snapRefs = useRef<(THREE.Object3D | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const bounds = useBounds();

  useEffect(() => {
    snapRefs.current = [
      anchorHero.current,
      anchorHero.current,
      anchorStory.current,
      anchorBack.current,
    ];
  }, []);

  const wallW = totalWidth + ROOM_MARGIN * 2;
  const wallD = totalDepth + ROOM_MARGIN * 2;
  const halfW = wallW / 2;
  const halfD = wallD / 2;

  return (
    <group>
      <group ref={anchorHero} position={[0, 0, -halfD + 0.01]} />
      <group ref={anchorStory} position={[halfW - 0.01, 0, 0]} />
      <group ref={anchorBack} position={[0, 0, halfD - 0.01]} />

      <hemisphereLight intensity={0.65} groundColor={"#7a6c5f"} />
      <directionalLight position={[5, 4.4, 5]} intensity={1.05} castShadow />

      <StaticRoomAndText
        totalWidth={totalWidth}
        totalDepth={totalDepth}
        showNav={showNav}
        onOpenTab={onOpenTab}
      />

      <Suspense fallback={null}>
        <SeatingGrid positions={positions} />
      </Suspense>

      <ContactShadows
        position={[0, -0.001, 0]}
        opacity={0.33}
        scale={Math.max(totalWidth, totalDepth) + 12}
        blur={2.4}
        far={6.8}
      />

      <RefitShortcuts refs={snapRefs} />
    </group>
  );
}

/* ============== Overlay (pages) ============== */
function OverlayShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/30 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="text-lg font-bold text-stone-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-stone-800"
            >
              Close
            </button>
          </div>
          <div className="max-h-[72vh] overflow-auto p-5">{children}</div>
        </div>
      </div>
    </>
  );
}

function MenuContent() {
  const items = [
    { title: "Sage Latte", price: "$5.50", note: "Honey-sage syrup, velvety milk, espresso balance." },
    { title: "Mocha Noir", price: "$5.75", note: "Dark cacao, hint of orange zest, thick crema." },
    { title: "Oat Vanilla Cold Brew", price: "$5.25", note: "24-hour steep, Madagascar vanilla, oat silk." },
    { title: "Cardamom Cappuccino", price: "$5.60", note: "Spiced foam, silky micro-texture, warm finish." },
    { title: "Maple Cortado", price: "$4.95", note: "Real maple, equal parts espresso and milk." },
    { title: "Affogato", price: "$6.50", note: "Vanilla gelato drowned in hot espresso." },
  ];
  return (
    <div className="grid gap-3">
      {items.map((d) => (
        <article key={d.title} className="rounded-2xl border border-[#E7DCCD] bg-white p-4 shadow-sm">
          <div className="mb-1 flex items-start justify-between">
            <h4 className="text-base font-semibold text-stone-900">{d.title}</h4>
            <span className="rounded-full bg-stone-900 px-2.5 py-0.5 text-xs font-semibold text-white">{d.price}</span>
          </div>
          <p className="text-sm text-stone-600">{d.note}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["House favorite", "Seasonal", "Single-origin"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/30"
              >
                {t}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
function StoryContent() {
  return (
    <div className="space-y-3 text-stone-700">
      <p>
        We began with a tiny roaster, a borrowed bar, and a belief: coffee is hospitality. Farmers first,
        flavors second, trends last. We’ve stuck to that, growing on conversations and community.
      </p>
      <p>
        Today, our team still hand-tunes each batch and pulls every shot with patience. We partner directly
        with producers, pay above-fair prices, and keep the menu focused on balance and clarity.
      </p>
      <ul className="mt-2 grid gap-2 md:grid-cols-2">
        {["Traceable sourcing", "Third-place community", "Sustainable steps", "Small-batch roasting"].map(
          (t) => (
            <li key={t} className="rounded-lg bg-stone-100 px-3 py-2 text-sm">
              {t}
            </li>
          )
        )}
      </ul>
    </div>
  );
}
function AchievementsContent() {
  return (
    <div className="space-y-3 text-stone-700">
      <ul className="space-y-2">
        <li className="rounded-lg bg-stone-100 px-3 py-2 text-sm">2023 — Local Roaster of the Year (Reader’s Choice)</li>
        <li className="rounded-lg bg-stone-100 px-3 py-2 text-sm">2024 — 100% compostable to-go program completed</li>
        <li className="rounded-lg bg-stone-100 px-3 py-2 text-sm">2024 — Partnership expansion with two new origin co-ops</li>
      </ul>
    </div>
  );
}
function VisitContent() {
  return (
    <div className="space-y-3 text-stone-700">
      <p>13 Roastery Lane, Glassboro, NJ • Mon–Sat 7a–6p • Sun 8a–3p</p>
      <div className="rounded-xl border bg-stone-50 p-4 text-sm">Map placeholder — embed your map here.</div>
      <div className="flex gap-3">
        <a className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">Get Directions</a>
        <a className="rounded-2xl border border-stone-900 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-stone-900 hover:text-white">
          Order Ahead
        </a>
      </div>
    </div>
  );
}

/* ============== Page ============== */
export default function CoffeeHouseWallWritten() {
  const isMobile = useIsMobile();
  const [overlayTab, setOverlayTab] = useState<OverlayTab>(null);

  const cameraPos: [number, number, number] = isMobile
    ? [4.2, 2.2, 6.4]
    : [5.2, 2.4, 7.0];
  const fov = isMobile ? 55 : 45;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF6F1] text-[#2B1E16]">
      {overlayTab && (
        <OverlayShell
          title={
            overlayTab === "menu"
              ? "Coffee House • Menu"
              : overlayTab === "story"
              ? "Coffee House • Story"
              : overlayTab === "achievements"
              ? "Coffee House • Achievements"
              : "Coffee House • Visit"
          }
          onClose={() => setOverlayTab(null)}
        >
          {overlayTab === "menu" && <MenuContent />}
          {overlayTab === "story" && <StoryContent />}
          {overlayTab === "achievements" && <AchievementsContent />}
          {overlayTab === "visit" && <VisitContent />}
        </OverlayShell>
      )}

      <section className="relative w-screen" style={{ height: "100vh" }}>
        <Canvas
          dpr={[DPR_MIN, DPR_MAX]}
          camera={{ position: cameraPos, fov, near: 0.05, far: 200 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <color attach="background" args={[BG_COL]} />
          <Bounds fit observe clip margin={isMobile ? 0.1 : 0.06}>
            <BigRoom onOpenTab={(tab) => setOverlayTab(tab)} showNav={!overlayTab} />
          </Bounds>
          <Environment preset="city" />
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={!isMobile}
            enableRotate
            zoomSpeed={0.9}
            rotateSpeed={0.7}
            dampingFactor={0.08}
            enableDamping
            minDistance={isMobile ? 3.0 : 3.6}
            maxDistance={isMobile ? 9 : 12}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 0.9, 0]}
          />
        </Canvas>

        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white backdrop-blur">
          Press R to reset
        </div>
      </section>

      <footer className="border-t border-[#E7DCCD] py-10 text-center text-sm text-[#5B4636]">
        © {new Date().getFullYear()} Coffee House — brewed with patience.
      </footer>
    </main>
  );
}
