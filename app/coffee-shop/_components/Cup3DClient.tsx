"use client";

import Cup3D from "./Cup3D";

/**
 * Client-only wrapper to render the 3D scene.
 * Prevents SSR/hydration conflicts and recursion errors.
 */
export default function Cup3DClient() {
  return <Cup3D />;
}
