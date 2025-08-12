"use client";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

// Usar los props que espera motion.button
type Props = Omit<HTMLMotionProps<"button">, "ref">;

const MagneticButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, onMouseMove, onMouseLeave, style, ...rest }, ref) => {
    const localRef = useRef<HTMLButtonElement>(null);

    // Exponer el nodo al padre
    useImperativeHandle(ref, () => localRef.current as HTMLButtonElement);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 300, damping: 20, mass: 0.4 });
    const sy = useSpring(my, { stiffness: 300, damping: 20, mass: 0.4 });

    const rotateX = useTransform(sy, [-20, 20], [8, -8]);
    const rotateY = useTransform(sx, [-20, 20], [-8, 8]);

    const handleMove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      const r = localRef.current?.getBoundingClientRect();
      if (r) {
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        mx.set(Math.max(-20, Math.min(20, x)));
        my.set(Math.max(-20, Math.min(20, y)));
      }
      onMouseMove?.(e);
    };

    const handleLeave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      mx.set(0);
      my.set(0);
      onMouseLeave?.(e);
    };

    return (
      <motion.button
        ref={localRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: sx, y: sy, rotateX, rotateY, ...style }}
        className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring will-change-transform"
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
export default MagneticButton;
