"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const Step = ({ letter, index }: { letter: 'F' | 'A' | 'R' | 'O'; index: number }) => {
    const t = useTranslations('home.faro');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative flex flex-col items-center text-center p-6 group"
        >
            {/* Decorative Line (Desktop) */}
            {index < 3 && (
                <div className="hidden lg:block absolute top-16 left-[70%] w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent -z-10" />
            )}

            {/* Circle Icon/Letter */}
            <div className="w-24 h-24 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mb-8 relative group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all duration-500 bg-gradient-to-br from-card to-muted/30">
                <span className="text-4xl font-black text-primary group-hover:scale-110 transition-transform duration-500">
                    {letter}
                </span>
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                {t(`${letter}.name`)}
            </h3>
            <p className="text-sm font-semibold text-primary/70 uppercase tracking-widest mb-4">
                {t(`${letter}.subtitle`)}
            </p>
            <div className="relative">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {t(`${letter}.desc`)}
                </p>
                <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-primary/10 rounded-full lg:hidden" />
            </div>
        </motion.div>
    );
};

export default function FaroMethodSection() {
    const t = useTranslations('home.faro');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <section id="metodo-faro" ref={ref} className="w-full py-12 xs:py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none -z-10 opacity-40">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            </div>

            <div className="container mx-auto px-6">
                <header className="w-full mx-auto text-center mb-12 xs:mb-16 sm:mb-20">
                    <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            className="text-[11px] xs:text-xs sm:text-sm tracking-widest uppercase text-muted-foreground/80 font-medium mb-2 xs:mb-3 sm:mb-4"
                        >
                            {t('eyebrow')}
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                        >
                            {t('heading')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 }}
                            className="mt-4 text-xs xs:text-sm sm:text-base md:text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed px-4"
                        >
                            {t('intro')}
                        </motion.p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative">
                    <Step letter="F" index={0} />
                    <Step letter="A" index={1} />
                    <Step letter="R" index={2} />
                    <Step letter="O" index={3} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted/30 border border-border/50 text-muted-foreground text-sm font-medium italic">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {t('outro')}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
