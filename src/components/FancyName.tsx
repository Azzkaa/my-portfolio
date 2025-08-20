"use client";

import { motion } from "framer-motion";

export default function FancyName({ text }: { text: string }) {
  return (
    <span className="inline-flex select-none">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          whileHover={{ y: -6, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="text-[var(--brand)] mx-[1px]"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
