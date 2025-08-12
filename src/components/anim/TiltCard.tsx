"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

export default function TiltCard({
  className = "",
  children,
  glow = true,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useTransform(y, [-40, 40], [8, -8]);
  const rY = useTransform(x, [-40, 40], [-8, 8]);

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const posX = e.clientX - (r.left + r.width / 2);
    const posY = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-40, Math.min(40, posX)));
    y.set(Math.max(-40, Math.min(40, posY)));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX: rX, rotateY: rY }}
      className={`relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm transition will-change-transform ${className}`}
    >
      {glow && (
        <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-2xl" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
