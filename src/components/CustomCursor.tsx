// components/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only show on devices with a fine pointer
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let x = -1000, y = -1000; // start offscreen
    let rx = x, ry = y;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  // Fixed full-screen host with absurd z-index; pointer-events disabled.
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99999]"
      style={{ isolation: "isolate" }} // keep above any backdrop/mix-blend
      aria-hidden
    >
      {/* outer ring */}
      <div
        ref={ring}
        className="
          absolute -translate-x-1/2 -translate-y-1/2
          h-8 w-8 rounded-full
          border border-[color:var(--brand-600)]
          opacity-70
          will-change-transform
        "
        style={{ mixBlendMode: "normal" }}
      />
      {/* center dot */}
      <div
        ref={dot}
        className="
          absolute -translate-x-1/2 -translate-y-1/2
          h-2.5 w-2.5 rounded-full
          bg-[var(--brand)]
          shadow-[0_0_12px_rgba(0,0,0,0.25)]
          will-change-transform
        "
        style={{ mixBlendMode: "normal" }}
      />
    </div>
  );
}
