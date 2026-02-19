"use client";

import { AlertTriangle, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

export default function PainPointsSection() {
    const t = useTranslations('home.painPoints');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const points = t.raw('points') as string[];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 10 }
        },
    };

    const floatAnimation = {
        y: [0, -20, 0],
        scale: [1, 1.05, 1],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    };
    
    const floatAnimationDelayed = {
        y: [0, 20, 0],
        scale: [1, 1.1, 1],
        transition: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1
        }
    };

    return (
        <section
            id="identificacion"
            ref={ref}
            className="relative w-full py-20 lg:py-32 overflow-hidden bg-background"
        >
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                    animate={floatAnimation}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-40 mix-blend-screen" 
                />
                <motion.div 
                    animate={floatAnimationDelayed}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] opacity-20 mix-blend-screen" 
                />
            </div>

            <div className="container relative mx-auto px-6 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Heading */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={{
                            hidden: { opacity: 0, x: -30 },
                            visible: { 
                                opacity: 1, 
                                x: 0,
                                transition: { 
                                    staggerChildren: 0.15,
                                    duration: 0.8,
                                    ease: "easeOut"
                                }
                            }
                        }}
                    >
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-black tracking-wider text-primary uppercase">
                                    {t('eyebrow')}
                                </span>
                            </div>
                        </motion.div>

                        <motion.h2 
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                            className="text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]"
                        >
                            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                                {t('heading')}
                            </span>
                        </motion.h2>

                        <motion.p 
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                            className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground/90 leading-relaxed mb-8 max-w-2xl mx-auto border-l-2 border-primary/30 pl-6 font-medium"
                        >
                            {t('intro')}
                        </motion.p>

                        <motion.div 
                            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md transition-shadow hover:shadow-lg hover:shadow-primary/5"
                        >
                            <p className="text-xl xs:text-2xl font-bold tracking-tight leading-snug text-primary text-center">
                                {t('outro')}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Glass Cards Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid sm:grid-cols-2 gap-4"
                    >
                        {points.map((point, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.03, 
                                    borderColor: "rgba(var(--primary), 0.4)",
                                    backgroundColor: "rgba(var(--card), 0.6)"
                                }}
                                className="group relative p-6 rounded-2xl bg-card/20 border border-border/30 transition-all duration-300 backdrop-blur-sm cursor-default"
                            >
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                                <div className="relative">
                                    <AlertTriangle className="w-6 h-6 text-primary mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                                    <p className="text-sm xs:text-base font-bold text-foreground/90 leading-snug">
                                        {point}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
