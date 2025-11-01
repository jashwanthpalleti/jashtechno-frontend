"use client";

import Cup3DSection from "./Cup3DSection";
console.log('tableBox.max.y =', tableBox.max.y, 'cupBottomY =', cupBottomY);

/**
 * Client wrapper to render the 3D scene from a Server Component page.
 * Keeps page.tsx clean and avoids `next/dynamic` + `ssr:false` errors.
 */
export default function Cup3DClient() {
  
  return <Cup3DSection />;
}
