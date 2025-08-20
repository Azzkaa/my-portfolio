import React from "react";
import { motion, type Variants, type TargetAndTransition } from "framer-motion";

type CodeGremlinProps = {
  className?: string;
  delay?: number; // when to start the entrance
};

export default function CodeGremlin({
  className = "",
  delay = 0,
}: CodeGremlinProps) {
  // Entrance: fall/bounce/settle (starts after your hero text)
  const enterVariants: Variants = {
    hidden: { x: -18, y: -42, rotate: -12, scale: 0.9, opacity: 0 },
    show: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { type: "spring", bounce: 0.55, duration: 0.9, delay },
    },
  };

  // Gentle idle bob
  const idleBob: TargetAndTransition = {
    y: [0, -2, 0],
    transition: {
      delay: delay + 0.6,
      duration: 2.2,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  };

  // Little arm wiggle
  const armWiggle: TargetAndTransition = {
    rotate: [0, -6, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: delay + 1.1,
    },
  };

  // 👀 Blink: start OPEN, blink briefly, then repeat occasionally
  const blinkAnim: TargetAndTransition = {
    scaleY: [1, 1, 0.1, 1, 1],
    transition: {
      duration: 3.2,
      times: [0, 0.82, 0.88, 0.94, 1],
      ease: "easeInOut",
      delay: delay + 1.0, // first blink after entrance
      repeat: Infinity,
      repeatDelay: 2.2,
    },
    transformOrigin: "center",
  };

  /**
   * 😈 Mischief timeline (fangs + horns)
   * - Immediately visible on spawn (so the gremlin appears with horns/fangs)
   * - Quickly hides to the cute default
   * - Later, it pops back in briefly every so often.
   *
   * You can tune:
   *  - duration: total length of the timeline
   *  - times: where the "visible window(s)" live
   *  - repeatDelay: pause between loops
   */
  const mischief: TargetAndTransition = {
    //           0     0.12  0.20  0.60  0.78  0.86  0.92  1
    opacity:    [1,    1,    0,    0,    1,    1,    0,    0],
    scale:      [1.06, 1,    1,    1,    1.05, 1,    1,    1],
    transition: {
      duration: 10,              // whole cycle length
      times:    [0,   0.12, 0.20, 0.60, 0.78, 0.86, 0.92, 1],
      ease: "easeInOut",
      delay,                     // start right away with the entrance
      repeat: Infinity,
      repeatDelay: 1.0,
    },
    transformOrigin: "center",
  };

  return (
    <motion.div
      variants={enterVariants}
      initial="hidden"
      animate="show"
      className={["relative select-none pointer-events-none", className]
        .filter(Boolean)
        .join(" ")}
      style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.55))" }}
      aria-hidden
    >
      {/* Pixel-ish teal lizard gremlin (SVG) */}
      <motion.svg
        viewBox="0 0 96 96"
        className="h-full w-full"
        animate={idleBob}
        role="img"
      >
        <defs>
          <radialGradient id="g" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#34d5ee" />
            <stop offset="100%" stopColor="#14b8a6" />
          </radialGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="48" cy="82" rx="18" ry="5.2" fill="rgba(0,0,0,0.25)" />

        {/* body */}
        <circle cx="48" cy="50" r="22" fill="url(#g)" />
        {/* tummy highlight */}
        <ellipse cx="48" cy="57" rx="12" ry="10" fill="rgba(255,255,255,0.14)" />

        {/* left arm */}
        <motion.rect
          x="27"
          y="56"
          width="6"
          height="10"
          rx="2"
          fill="#14b8a6"
          animate={armWiggle}
        />
        {/* right arm */}
        <rect x="63" y="56" width="6" height="10" rx="2" fill="#14b8a6" />
        {/* feet */}
        <rect x="38" y="74" width="8" height="4" rx="2" fill="#0ea5a3" />
        <rect x="50" y="74" width="8" height="4" rx="2" fill="#0ea5a3" />

        {/* Eyes group (blink) */}
        <g>
          {/* eye whites */}
          <motion.ellipse
            cx="40"
            cy="46"
            rx="6"
            ry="6"
            fill="#fff"
            initial={{ scaleY: 1 }}
            animate={blinkAnim}
          />
          <motion.ellipse
            cx="56"
            cy="46"
            rx="6"
            ry="6"
            fill="#fff"
            initial={{ scaleY: 1 }}
            animate={blinkAnim}
          />
          {/* pupils */}
          <circle cx="41.5" cy="46.5" r="2.6" fill="#0f172a" />
          <circle cx="57.5" cy="46.5" r="2.6" fill="#0f172a" />
          {/* sparkle */}
          <circle cx="39.8" cy="44.6" r="1.1" fill="#ffffff" />
          <circle cx="55.8" cy="44.6" r="1.1" fill="#ffffff" />
        </g>

        {/* default little smile (always visible) */}
        <path
          d="M42 60 q6 5 12 0"
          fill="none"
          stroke="#083344"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Mischief layer: bigger grin + fangs + tiny horns */}
        <motion.g animate={mischief}>
          {/* Bigger grin */}
          <path
            d="M40 60 q8 8 16 0"
            fill="none"
            stroke="#083344"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Fangs */}
          <path
            d="M45 58 L43.6 62 L46.4 62 Z"
            fill="#ffffff"
            stroke="#083344"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <path
            d="M51 58 L49.6 62 L52.4 62 Z"
            fill="#ffffff"
            stroke="#083344"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />

          {/* Tiny horns */}
          <path
            d="M38 31 L35 26 L41 30 Z"
            fill="#14b8a6"
            stroke="#0e6e6b"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <path
            d="M58 31 L61 26 L55 30 Z"
            fill="#14b8a6"
            stroke="#0e6e6b"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
