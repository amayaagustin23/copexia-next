"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "./anim/motion";

export default function Section({
  id,
  title,
  children,
  ariaLabel,
}: {
  readonly id: string;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly ariaLabel?: string;
}) {
  return (
    <motion.section
      id={id}
      aria-label={ariaLabel ?? title}
      className="w-full max-w-6xl mx-auto px-6 py-16 md:py-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger(0.12)}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-semibold tracking-tight mb-6"
        variants={fadeUp}
      >
        {title}
      </motion.h2>
      {children}
    </motion.section>
  );
}
