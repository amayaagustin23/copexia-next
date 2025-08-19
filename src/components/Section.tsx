"use client";

import { animate, createScope, createSpring } from "animejs";
import React, { useEffect, useRef } from "react";

type Props = {
  id: string;
  title: string;
  children: React.ReactNode;
  ariaLabel?: string;
  staggerChildren?: boolean;
  itemSelector?: string;
};

const Section = ({
  id,
  title,
  children,
  ariaLabel,
  staggerChildren = false,
  itemSelector, // <- NUEVO
}: Props) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const scopeRef = useRef<any>(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    // el contenedor debe ser visible
    root.style.opacity = "1";

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // --- NUEVO: selecciona items por selector; si no hay, usa hijos directos o el inner
    let items: HTMLElement[] = [];
    if (itemSelector) {
      items = Array.from(inner.querySelectorAll<HTMLElement>(itemSelector));
    } else if (staggerChildren) {
      items = Array.from(inner.children) as HTMLElement[];
    } else {
      items = [inner];
    }
    if (items.length === 0) items = [inner];

    // estado inicial
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

            items.forEach((el, i) => {
              animate(el, {
                opacity: [0, 1],
                translateY: [20, 0],
                delay: staggerChildren || itemSelector ? i * 120 : 0,
                duration: 800,
                ease: createSpring({ stiffness: 220, damping: 26 }),
                complete: () => (el.style.willChange = "auto"),
              });
            });

            io.disconnect();
          }
        },
        { threshold: 0.2 }
      );

      io.observe(root);
      self.add("cleanupIO", () => io.disconnect());
    });

    return () => {
      scopeRef.current?.methods?.cleanupIO?.();
      scopeRef.current?.revert?.();
    };
  }, [staggerChildren, itemSelector]);

  return (
    <section
      ref={rootRef}
      id={id}
      aria-label={ariaLabel ?? title}
      className="w-full mx-auto px-6 py-16 md:py-20"
      // style={{ opacity: 0 }}
    >
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        {title}
      </h2>
      <div ref={innerRef}>{children}</div>
    </section>
  );
};

export default Section;
