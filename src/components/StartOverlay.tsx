"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StartOverlay({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  // fake loader (eases, has a tiny stall ~70–85% so it feels real)
  useEffect(() => {
    let raf: number;
    const start = performance.now();

    const tick = (t: number) => {
      const dt = (t - start) / 1500; // ~1.2s
      // easeOutCubic + slight stall band
      let p = Math.min(1, dt);
      p = 1 - Math.pow(1 - p, 3);
      const stall = progress < 0.85 ? 0 : (Math.sin((t / 200) % Math.PI) * 0.02);
      const value = Math.min(1, p - stall);
      setProgress(value);
      if (value < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // allow skip by any key/mouse/touch
  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      // small timeout to let the wipe animation run
      setTimeout(onFinish, 550);
    };
    const key = (e: KeyboardEvent) => finish();
    const click = (e: MouseEvent) => finish();
    const touch = (e: TouchEvent) => finish();

    window.addEventListener("keydown", key);
    window.addEventListener("mousedown", click);
    window.addEventListener("touchstart", touch);

    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("mousedown", click);
      window.removeEventListener("touchstart", touch);
    };
  }, [onFinish]);

  // auto-finish when progress hits 100
  useEffect(() => {
    if (progress >= 1 && !doneRef.current) {
      doneRef.current = true;
      setTimeout(onFinish, 550);
    }
  }, [progress, onFinish]);

  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 3 }}
        animate={{ opacity: 3 }}
        exit={{ opacity: 0, transition: { duration: 0.35 } }}
        className="fixed inset-0 z-[100] overflow-hidden"
      >
        {/* background: teal-ish radial + very subtle scanlines */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 800px at 50% 55%, rgba(34,211,238,0.10), rgba(2,6,23,0.96))",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* center content */}
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="text-center select-none">
            <div className="mb-3 font-mono tracking-[0.35em] text-xs text-[var(--brand)]/80">
              AZKA.DEV
            </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-2xl md:text-3xl font-semibold text-[var(--text)]"
            >
              Loading<span className="text-[var(--brand)]">_</span> {pct}%
            </motion.div>

            {/* progress bar */}
            <div className="mt-5 w-[240px] md:w-[300px] h-2 rounded-full bg-white/10 overflow-hidden mx-auto">
              <div
                className="h-full bg-[var(--brand)]"
                style={{ width: `${pct}%`, transition: "width 140ms linear" }}
              />
            </div>

            <div className="mt-4 font-mono text-xs text-[var(--muted)]/80">
              press any key to skip
            </div>
          </div>
        </div>

        {/* teal wipe curtain (reveals page) */}
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: progress >= 1 ? 0 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 origin-top bg-[var(--brand)]/40 pointer-events-none"
        />
      </motion.div>
    </AnimatePresence>
  );
}
