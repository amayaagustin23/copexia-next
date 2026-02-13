"use client";

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function PainPointsSection() {
    const t = useTranslations('home.painPoints');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    // Explicitly getting the points from translation
    const points = t.raw('points') as string[];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <section
            id="identificacion"
            ref={ref}
            className="relative w-full py-12 xs:py-16 sm:py-20 lg:py-24 overflow-hidden bg-muted/5"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="container relative mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="w-full mb-12 xs:mb-16 sm:mb-20 text-center"
                    >
                        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
                            <p className="text-[11px] xs:text-xs sm:text-sm tracking-widest uppercase text-muted-foreground/80 font-medium mb-2 xs:mb-3 sm:mb-4">
                                {t('eyebrow')}
                            </p>
                            <h2 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                                {t('heading')}
                            </h2>
                            <p className="mt-4 text-xs xs:text-sm sm:text-base md:text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed px-4">
                                {t('intro')}
                            </p>
                        </div>
                    </motion.header>

                    {/* Points Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 lg:gap-6 mb-12"
                    >
                        {points.map((point, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <AlertCircle className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                                </div>
                                <p className="text-sm md:text-base text-foreground/80 leading-snug">
                                    {point}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Outro / Call to Action area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                            <p className="text-xl md:text-2xl font-semibold italic text-foreground/90">
                                {t('outro')}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
