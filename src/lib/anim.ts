// lib/anim.ts
"use client";

import { animate, createSpring } from "animejs";

export type RevealVariant = "fade-up" | "fade-in" | "scale-in";

export function revealOnScroll(
  root: HTMLElement,
  selector = "[data-animate]",
  variant: RevealVariant = "fade-up",
  baseDelay = 90
) {
  const prefersReduced = matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
  if (!items.length) return () => {};

  // estado inicial
  items.forEach((el) => {
    el.style.opacity = "0";
    if (variant === "fade-up") el.style.transform = "translateY(16px)";
    if (variant === "scale-in") el.style.transform = "scale(0.96)";
    el.style.willChange = "opacity, transform";
  });

  const run = () => {
    if (prefersReduced) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      });
      return;
    }
    items.forEach((el, i) => {
      const anim: Record<string, any> = {
        opacity: [0, 1],
        duration: 650,
        easing: "easeOutQuad",
        delay: i * baseDelay,
        complete: () => (el.style.willChange = "auto"),
      };
      if (variant === "fade-up") anim.translateY = [16, 0];
      if (variant === "scale-in") anim.scale = [0.96, 1];
      animate(el, anim);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        run();
        io.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  io.observe(root);
  return () => io.disconnect();
}

export function hoverLift(el: HTMLElement) {
  const enter = () => {
    el.getAnimations?.().forEach((a) => a.cancel());
    animate(el, {
      translateY: -2,
      scale: 1.02,
      duration: 160,
      easing: "easeOutQuad",
    });
  };
  const leave = () => {
    el.getAnimations?.().forEach((a) => a.cancel());
    animate(el, {
      translateY: 0,
      scale: 1,
      duration: 220,
      ease: createSpring({ stiffness: 220, damping: 20 }),
    });
  };
  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);
  return () => {
    el.removeEventListener("mouseenter", enter);
    el.removeEventListener("mouseleave", leave);
  };
}

export function bobLoop(el: HTMLElement, delay = 0) {
  const prefersReduced = matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return () => {};
  const anim = animate(el, {
    translateY: [-2, 2],
    opacity: [0.8, 1],
    duration: 1800,
    delay,
    direction: "alternate",
    loop: true,
    ease: createSpring({ stiffness: 120, damping: 18 }),
  });
  return () => anim?.cancel?.();
}
