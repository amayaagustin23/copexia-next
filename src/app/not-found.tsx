"use client";

import './globals.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export default function GlobalNotFound() {
    const codeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Initial State
        const elements = [
            codeRef.current,
            titleRef.current,
            descRef.current,
            buttonRef.current
        ].filter(Boolean);

        elements.forEach((el) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
            }
        });

        if (prefersReduced) {
            elements.forEach((el) => {
                if (el) {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                }
            });
            return;
        }

        // Animate In
        animate(elements, {
            opacity: [0, 1],
            translateY: [30, 0],
            delay: stagger(100),
            duration: 1200,
            easing: 'easeOutElastic(1, .8)'
        });

        // Floating Loop for 404
        if (codeRef.current) {
            animate(codeRef.current, {
                translateY: [0, -15],
                direction: 'alternate',
                loop: true,
                duration: 3000,
                easing: 'easeInOutQuad',
                delay: 800
            });
        }
    }, []);

    return (
        <html lang="es">
            <body className="min-h-screen bg-[#0f1c2e] text-[#e3e8f0] font-sans overflow-hidden">
                <div className="relative flex min-h-screen flex-col items-center justify-center p-4 text-center">
                    {/* Background Effects (Matching globals.css vars manually just in case) */}
                    <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.8]"
                        style={{
                            background: 'radial-gradient(1000px 1000px at 50% 0%, rgba(15, 28, 46, 0.05), transparent 70%), #0f1c2e'
                        }}
                    />

                    {/* 404 Code */}
                    <div ref={codeRef} className="mb-8 select-none">
                        <span
                            className="text-[8rem] sm:text-[12rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text"
                            style={{
                                // Fallback to explicit gradient if var missing
                                backgroundImage: 'linear-gradient(135deg, #dfcd81 0%, #b79653 45%, #ac7400 100%)',
                                textShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                        >
                            404
                        </span>
                    </div>

                    <h1 ref={titleRef} className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                        Página no encontrada
                    </h1>

                    <p ref={descRef} className="text-xl text-[#d7deea] mb-10 max-w-md mx-auto">
                        La página que buscas no existe.
                    </p>

                    <div className="pt-2">
                        <Link
                            ref={buttonRef}
                            href="/"
                            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-[#dfcd81] px-8 font-medium text-[#0f0f0f] transition-all hover:bg-[#c9b870] hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span>Volver al inicio</span>
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
