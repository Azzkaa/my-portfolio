"use client";

import React, { useEffect, useRef, useState } from "react";

type Dot = { a: number; r: number; s: number; j: number };

type Props = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
  blend?: React.CSSProperties["mixBlendMode"]; // "screen" | "multiply" | "normal"
  delayMs?: number;
  visible?: boolean;
};

export default function CanvasHero({
  className = "",
  style,
  blend = "screen",
  delayMs = 0,
  visible = true,
  ...rest
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);
  const [show, setShow] = useState(false);

  // Fade-in gating
  useEffect(() => {
    if (!visible) return setShow(false);
    const t = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(t);
  }, [visible, delayMs]);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = c.offsetWidth * devicePixelRatio);
    let h = (c.height = c.offsetHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const root = document.documentElement;
    const theme = root.getAttribute("data-theme") || "dark";

    // Dark = teal from CSS vars. Light = pure black.
    let brand =
      getComputedStyle(root).getPropertyValue("--brand").trim() || "#22d3ee";
    let brand600 =
      getComputedStyle(root).getPropertyValue("--brand-600").trim() || "#06b6d4";
    if (theme === "light") {
      brand = "#000000";
      brand600 = "#000000";
    }

    const cx = w / devicePixelRatio / 2;
    const cy = h / devicePixelRatio / 2;

    const COUNT = 64;
    const dots: Dot[] = Array.from({ length: COUNT }, (_, i) => ({
      a: Math.random() * Math.PI * 2,
      r: 60 + (i % 16) * 10 + Math.random() * 12,
      s: 0.0007 + Math.random() * 0.0016,
      j: Math.random() * 1000,
    }));

    function pos(d: Dot, t: number) {
      const jr = Math.sin((t + d.j) * 0.002) * 2.2;
      return { x: cx + Math.cos(d.a) * (d.r + jr), y: cy + Math.sin(d.a) * (d.r + jr) };
    }

    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function hexToRgba(hex: string, a = 1) {
      const m = hex.replace("#", "");
      const n = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
      const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      return `rgba(${r},${g},${b},${a})`;
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      if (!reduced) for (const d of dots) d.a += d.s;

      const P = dots.map(d => pos(d, t));
      const maxDist = 130;

      // lines
      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const dx = P[i].x - P[j].x;
          const dy = P[i].y - P[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const a = 1 - dist / maxDist;
            ctx.strokeStyle = hexToRgba(brand600, Math.max(0.05, a * 0.35));
            ctx.lineWidth = Math.max(0.4, a * 1.1);
            ctx.beginPath();
            ctx.moveTo(P[i].x, P[i].y);
            ctx.lineTo(P[j].x, P[j].y);
            ctx.stroke();
          }
        }
      }

      // dots
      ctx.fillStyle = brand;
      for (const p of P) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    }

    const onResize = () => {
      w = (c.width = c.offsetWidth * devicePixelRatio);
      h = (c.height = c.offsetHeight * devicePixelRatio);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    window.addEventListener("resize", onResize);
    raf.current = requestAnimationFrame(draw);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
    // 👇 re-init when blend changes (theme toggle path)
  }, [visible, delayMs, blend]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        mixBlendMode: blend,
        opacity: show ? 0.9 : 0,
        transition: "opacity .6s ease",
        ...style,
      }}
      aria-hidden
      {...rest}
    />
  );
}
