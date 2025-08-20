// src/components/Section.tsx
"use client";

import { animate, createScope, createSpring, stagger } from "animejs";
import React, { useEffect, useRef } from "react";

type Props = {
  id?: string;
  title?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  staggerChildren?: boolean;
  itemSelector?: string;
  className?: string; // <- NUEVO: clases para el wrapper
  titleClassName?: string; // <- NUEVO: clases para el h2
  threshold?: number; // <- NUEVO: umbral IO
};

const Section = ({
  id,
  title,
  children,
  ariaLabel,
  staggerChildren = false,
  itemSelector,
  className = "w-full mx-auto",
  titleClassName = "text-3xl md:text-4xl font-semibold tracking-tight mb-6",
  threshold = 0.2,
}: Props) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const scopeRef = useRef<any>(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    root.style.opacity = "1";

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let items: HTMLElement[] = [];
    if (itemSelector) {
      items = Array.from(inner.querySelectorAll<HTMLElement>(itemSelector));
    } else if (staggerChildren) {
      items = Array.from(inner.children) as HTMLElement[];
    } else {
      items = [inner];
    }
    if (items.length === 0) items = [inner];

    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.willChange = "opacity, transform";
    });

    scopeRef.current = createScope({ root }).add((self: any) => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;

            if (prefersReduced) {
              items.forEach((el) => {
                el.style.opacity = "1";
                el.style.transform = "none";
                el.style.willChange = "auto";
              });
              io.disconnect();
              return;
            }

            animate(items, {
              opacity: [0, 1],
              translateY: [20, 0],
              delay: staggerChildren || itemSelector ? stagger(100) : 0,
              duration: 800,
              ease: createSpring({ stiffness: 220, damping: 26 }),
              complete: () =>
                items.forEach((el) => (el.style.willChange = "auto")),
            });

            io.disconnect();
          }
        },
        { threshold }
      );

      io.observe(root);
      self.add("cleanupIO", () => io.disconnect());
    });

    return () => {
      scopeRef.current?.methods?.cleanupIO?.();
      scopeRef.current?.revert?.();
    };
  }, [staggerChildren, itemSelector, threshold]);

  return (
    <section
      ref={rootRef}
      id={id}
      aria-label={ariaLabel ?? title}
      className={className}
    >
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      <div ref={innerRef}>{children}</div>
    </section>
  );
};

export default Section;
