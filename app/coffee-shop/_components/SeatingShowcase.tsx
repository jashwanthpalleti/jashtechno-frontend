"use client";

import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  useGLTF,
  Bounds,
  useCursor,
  useBounds,
} from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";

/** Scene tunables */
const DPR_MIN = 0.9;
const DPR_MAX = 1.6;
const BG_COL = "#FAF6F1";

/** Seating proportions */
const TABLE_WIDTH = 0.9;
const CHAIR_HEIGHT = 0.85;
const ROSE_HEIGHT = 0.18;
const CUP_HEIGHT = 0.12;
const CARD_HEIGHT = 0.14;

/** Grid layout (3 columns x 2 rows) */
const COLS = 3;
const ROWS = 2;
const COL_SPACING = 2.4;
const ROW_SPACING = 2.0;

/** Room sizing */
const ROOM_MARGIN = 1.6;
const ROOM_HEIGHT = 2.2;
const FLOOR_EXTRA = 2.0;

/** Palette */
const WALL_COLOR = "#EFE3D6";
const TRIM_COLOR = "#B08968";
const FLOOR_COLOR = "#9C6B4A";

/** Tiny lift to avoid z-fighting without a visible gap */
const SURFACE_EPS = 0.0002;

/* ---------------- helpers ---------------- */
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

  // center X/Z; rest base at y=0
  const minY = box.min.y;
  clone.position.set(
    clone.position.x - center.x,
    clone.position.y - minY,
    clone.position.z - center.z
  );

  // scale uniformly
  const sized = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  sized.getSize(size);
  const current =
    mode === "width" ? size.x : mode === "height" ? size.y : size.z;
  root.scale.setScalar(current > 0 ? target / current : 1);

  return root;
}

/* ---------------- assets ---------------- */
function TableNorm(
  props: React.JSX.IntrinsicElements["group"] & { width?: number }
) {
  const { scene } = useGLTF("/models/table.glb");
  const width = props.width ?? TABLE_WIDTH;
  const root = useMemo(
    () => normalizeScene(scene, width, "width"),
    [scene, width]
  );
  return <primitive object={root} {...props} />;
}

function ChairNorm(
  props: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/chair.glb");
  const height = props.height ?? CHAIR_HEIGHT;
  const root = useMemo(
    () => normalizeScene(scene, height, "height"),
    [scene, height]
  );
  return <primitive object={root} {...props} />;
}

function RoseNorm(
  props: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/rose.glb");
  const height = props.height ?? ROSE_HEIGHT;
  const root = useMemo(
    () => normalizeScene(scene, height, "height"),
    [scene, height]
  );
  return <primitive object={root} {...props} />;
}

function CupNorm(
  props: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/coffees.glb");
  const height = props.height ?? CUP_HEIGHT;
  const root = useMemo(
    () => normalizeScene(scene, height, "height"),
    [scene, height]
  );
  return <primitive object={root} {...props} />;
}

function MenuCardNorm(
  props: React.JSX.IntrinsicElements["group"] & { height?: number }
) {
  const { scene } = useGLTF("/models/menucard.glb");
  const height = props.height ?? CARD_HEIGHT;
  const root = useMemo(
    () => normalizeScene(scene, height, "height"),
    [scene, height]
  );
  return <primitive object={root} {...props} />;
}

/* ---------------- table set with exact surface placement ---------------- */
function TableSet({
  position = [0, 0, 0] as [number, number, number],
}) {
  const halfTable = TABLE_WIDTH / 2;
  const endGap = 0.24;
  const sideGap = 0.24;
  const chairDepthApprox = 0.45;
  const chairWidthApprox = 0.45;

  const endX = halfTable + endGap + chairDepthApprox / 2;
  const sideZ = TABLE_WIDTH * 0.55 + sideGap + chairWidthApprox / 2;

  // Root group (local space for props)
  const containerRef = useRef<THREE.Group>(null);
  // Table-only group (clean ray targets)
  const tableRef = useRef<THREE.Group>(null);

  // Raycaster + helpers
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const down = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Get tabletop Y under a given local X/Z (return in *container-local* space)
  const getSurfaceLocalY = (localX: number, localZ: number) => {
    if (!tableRef.current || !containerRef.current) return 0;

    // Cast from above in container-local space, then convert to world
    const originLocal = new THREE.Vector3(localX, 5, localZ);
    const originWorld = tmp.set(originLocal.x, originLocal.y, originLocal.z);
    containerRef.current.localToWorld(originWorld);

    // Direction “down” in container's world orientation
    const dirWorld = down.clone();
    const q = new THREE.Quaternion();
    containerRef.current.getWorldQuaternion(q);
    dirWorld.applyQuaternion(q).normalize();

    raycaster.set(originWorld, dirWorld);
    const hits = raycaster.intersectObject(tableRef.current, true);
    if (!hits.length) return 0;

    // Convert hit to container-local space so placements ignore ancestor scaling
    const hitLocal = hits[0].point.clone();
    containerRef.current.worldToLocal(hitLocal);
    return hitLocal.y;
  };

  // Compute local Y for each prop once ready/stable
  const [ys, setYs] = useState<{ rose: number; cup: number; card: number } | null>(null);

  useFrame(() => {
    if (!tableRef.current || !containerRef.current || ys) return;

    const yRose = getSurfaceLocalY(0, 0);
    const yCup  = getSurfaceLocalY(0.12, 0.08);
    const yCard = getSurfaceLocalY(-0.14, -0.06);

    if (
      Number.isFinite(yRose) &&
      Number.isFinite(yCup) &&
      Number.isFinite(yCard)
    ) {
      setYs({ rose: yRose, cup: yCup, card: yCard });
    }
  });

  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group ref={containerRef} position={position}>
      {/* Table only */}
      <group ref={tableRef}>
        <TableNorm width={TABLE_WIDTH} />
      </group>

      {/* Props appear once we know exact tabletop Y in local space */}
      {ys && (
        <>
          <RoseNorm position={[0, ys.rose + SURFACE_EPS, 0]} height={ROSE_HEIGHT} />

          <CupNorm position={[0.12, ys.cup + SURFACE_EPS, 0.08]} height={CUP_HEIGHT} />

          <group
            position={[-0.14, ys.card + SURFACE_EPS, -0.06]}
            rotation={[-0.06, 0.15, 0.02]}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
            onClick={(e) => { e.stopPropagation(); router.push("/coffee-shop/menu"); }}
          >
            <MenuCardNorm height={CARD_HEIGHT} />
          </group>
        </>
      )}

      {/* Chairs */}
      <ChairNorm position={[-endX, 0, 0]} rotation={[0,  Math.PI / 2, 0]} />
      <ChairNorm position={[ endX, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <ChairNorm position={[0, 0,  sideZ]} rotation={[0, Math.PI, 0]} />
      <ChairNorm position={[0, 0, -sideZ]} rotation={[0, 0, 0]} />
    </group>
  );
}

/* ---------------- room ---------------- */
function RoomShell({
  totalWidth,
  totalDepth,
}: {
  totalWidth: number;
  totalDepth: number;
}) {
  const halfW = totalWidth / 2 + ROOM_MARGIN;
  const halfD = totalDepth / 2 + ROOM_MARGIN;

  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: WALL_COLOR, roughness: 0.95 }),
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

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[totalWidth + FLOOR_EXTRA, totalDepth + FLOOR_EXTRA]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, ROOM_HEIGHT / 2, -halfD]} receiveShadow castShadow>
        <planeGeometry args={[totalWidth + ROOM_MARGIN * 2, ROOM_HEIGHT]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-halfW, ROOM_HEIGHT / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[totalDepth + ROOM_MARGIN * 2, ROOM_HEIGHT]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[halfW, ROOM_HEIGHT / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[totalDepth + ROOM_MARGIN * 2, ROOM_HEIGHT]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Baseboard trim */}
      <mesh position={[0, 0.06, -halfD + 0.001]}>
        <planeGeometry args={[totalWidth + ROOM_MARGIN * 2, 0.12]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[-halfW + 0.001, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[totalDepth + ROOM_MARGIN * 2, 0.12]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[halfW - 0.001, 0.06, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[totalDepth + ROOM_MARGIN * 2, 0.12]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
    </group>
  );
}

/* ---------------- rig ---------------- */
function SeatingRig({ sceneScale = 1.25 }: { sceneScale?: number }) {
  const positions: [number, number, number][] = [];
  const totalWidth = (COLS - 1) * COL_SPACING;
  const totalDepth = (ROWS - 1) * ROW_SPACING;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * COL_SPACING - totalWidth / 2;
      const z = r * ROW_SPACING - totalDepth / 2;
      positions.push([x, 0, z]);
    }
  }

  return (
    <group scale={sceneScale}>
      <RoomShell totalWidth={totalWidth} totalDepth={totalDepth} />

      {/* Ambient + key lighting */}
      <hemisphereLight intensity={0.5} groundColor={"#7a6c5f"} />
      <directionalLight
        position={[6, 6.2, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {positions.map((pos, i) => (
        <TableSet key={i} position={pos} />
      ))}

      <ContactShadows
        position={[0, -0.001, 0]}
        opacity={0.5}
        scale={Math.max(totalWidth, totalDepth) + 14}
        blur={2.6}
        far={8}
      />
    </group>
  );
}

/** Press "R" to re-fit the camera to the whole scene */
function RefitShortcut() {
  const bounds = useBounds();
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") bounds.refresh().fit();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [bounds]);
  return null;
}

/**
 * SeatingShowcase
 * - wide: full-bleed (w-screen)
 * - heightVh: viewport height in vh
 */
export default function SeatingShowcase({
  wide = true,
  heightVh = 90,
}: {
  wide?: boolean;
  heightVh?: number;
}) {
  const wrapperStyle = { height: `${heightVh}vh` };

  return (
 <div
  className={[
    wide ? "w-screen" : "w-full",
    "overflow-hidden",
    wide ? "" : "rounded-xl ring-1 ring-[#E7DCCD]",
  ].join(" ")}
  style={{ height: `${(heightVh ?? 90)}vh` }}   // make section full height
>
  <Canvas
    dpr={[DPR_MIN, DPR_MAX]}
    // Closer camera so the room fills the section better
    camera={{ position: [3.0, 1.8, 5.4], fov: 60, near: 0.8, far: 200 }}
    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
  >
    <color attach="background" args={[BG_COL]} />
    <Suspense fallback={null}>
      {/* IMPORTANT: remove 'fit' so it doesn't auto-shrink the scene. 
         Use a tiny margin so the room nearly touches the edges. */}
      <Bounds observe margin={0.08}>
        <SeatingRig sceneScale={1.5} />  {/* slightly larger */}
      </Bounds>
      <Environment preset="city" />
      <RefitShortcut />
    </Suspense>

    <OrbitControls
      makeDefault
      enablePan={false}
      enableZoom
      enableRotate
      zoomSpeed={0.9}
      rotateSpeed={0.7}
      dampingFactor={0.08}
      enableDamping
      minDistance={3}
      maxDistance={9}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 0.9, 0]}
    />
  </Canvas>
</div>

  );
}

/* Preload assets */
useGLTF.preload("/models/chair.glb");
useGLTF.preload("/models/table.glb");
useGLTF.preload("/models/rose.glb");
useGLTF.preload("/models/coffees.glb");
useGLTF.preload("/models/menucard.glb");
