"use client";

import { animate, createSpring } from "animejs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

export default function HeroSection() {
  const t = useTranslations("home.hero");
  const ctasRef = useRef<HTMLDivElement | null>(null);

  const spring = useMemo(
    () => createSpring({ stiffness: 320, damping: 18 }),
    []
  );

  useEffect(() => {
    const root = ctasRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const buttons = Array.from(
      root.querySelectorAll<HTMLAnchorElement>("[data-cta]")
    );
    if (!buttons.length) return;

    const cleanups: Array<() => void> = [];

    for (const anchor of buttons) {
      let bar = anchor.querySelector<HTMLElement>("[data-progress]");
      if (!bar) {
        bar = document.createElement("span");
        bar.setAttribute("data-progress", "true");
        Object.assign(bar.style, {
          position: "absolute",
          insetInlineStart: "0",
          insetBlockEnd: "0",
          height: "2px",
          width: "0%",
          background: "var(--ring)",
          transformOrigin: "left center",
          transition: "opacity .18s ease",
          opacity: "0.95",
        } as Partial<CSSStyleDeclaration>);
        anchor.style.position = "relative";
        anchor.appendChild(bar);
      }

      const onEnter = () => {
        animate(anchor, { scale: [1, 1.03, 1], duration: 260, ease: spring });
        animate(bar!, {
          width: ["0%", "100%"],
          duration: 900,
          easing: "easeInOutQuad",
        });
      };
      const onLeave = () => {
        animate(bar!, {
          width: ["100%", "0%"],
          duration: 300,
          easing: "easeOutQuad",
        });
      };

      anchor.addEventListener("mouseenter", onEnter);
      anchor.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        anchor.removeEventListener("mouseenter", onEnter);
        anchor.removeEventListener("mouseleave", onLeave);
      });
    }

    return () => cleanups.forEach((off) => off());
  }, [spring]);

  return (
    <div className="relative isolate flex flex-col items-center justify-center text-center px-6 text-foreground overflow-hidden rounded-[var(--radius)]">
      <div
        aria-hidden
        className="hero-bg pointer-events-none absolute inset-0 -z-10 opacity-[0.95]"
      />
      <div
        aria-hidden
        className="gold-layer pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light"
      />

      <div className="my-10">
        <Image
          src="/images/logo-copexia.png"
          alt={t("brandAlt")}
          width={500} // medida de referencia del asset
          height={200} // mantiene aspecto
          priority // mejora LCP del hero
          quality={90}
          sizes="(min-width: 1024px) 144px, (min-width: 768px) 120px, 96px"
          className="w-auto h-24 md:h-28 lg:h-36 object-contain"
        />
      </div>

      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
          <span
            className="bg-clip-text text-transparent inline-block"
            style={{ backgroundImage: "var(--gold-gradient)" }}
          >
            {t("title")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          {t("subtitle")}
        </p>

        <div ref={ctasRef} className="flex flex-wrap justify-center gap-4">
          {/* CTA principal con sheen + progress bar */}
          <Link
            href="#servicios"
            data-cta
            className="relative overflow-hidden rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <span
              aria-hidden
              className="sheen pointer-events-none absolute inset-y-0 left-[-140%] w-[140%] skew-x-[-20deg] opacity-0"
            />
            <span className="relative z-10">{t("cta.services")}</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .hero-bg {
          background: radial-gradient(
              1200px 600px at 90% -10%,
              rgba(15, 28, 46, 0.08),
              transparent 60%
            ),
            radial-gradient(
              900px 520px at 0% 110%,
              rgba(15, 28, 46, 0.07),
              transparent 55%
            ),
            var(--background);
          -webkit-mask-image: radial-gradient(
            1200px 1200px at 50% 0%,
            rgba(0, 0, 0, 0.75),
            rgba(0, 0, 0, 0.92)
          );
          mask-image: radial-gradient(
            1200px 1200px at 50% 0%,
            rgba(0, 0, 0, 0.75),
            rgba(0, 0, 0, 0.92)
          );
        }

        .gold-layer {
          background: linear-gradient(
            115deg,
            rgba(223, 205, 129, 0.12),
            rgba(183, 150, 83, 0.08) 40%,
            rgba(172, 116, 0, 0.06) 70%,
            transparent 90%
          );
          background-size: 200% 200%;
          animation: bg-pan 9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .gold-layer {
            animation: none;
          }
        }

        @keyframes bg-pan {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .sheen {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.25) 35%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0.25) 65%,
            transparent 100%
          );
          transition: opacity 0.15s ease;
        }

        a[data-cta]:hover > .sheen,
        a[data-cta]:focus-visible > .sheen {
          opacity: 1;
          animation: sheen-slide 900ms ease-in-out forwards;
        }

        @keyframes sheen-slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
