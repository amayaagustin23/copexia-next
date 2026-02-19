"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Step = ({ letter, index }: { letter: 'F' | 'A' | 'R' | 'O'; index: number }) => {
    const t = useTranslations('home.faro');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: index * 0.2 }}
            className="relative flex flex-col items-center group"
        >
            {/* Ambient hover glow - consistent with other sections */}
            <div className="absolute -inset-4 xs:-inset-8 bg-primary/15 rounded-full blur-[40px] xs:blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10 pointer-events-none" />

            <div className="relative w-32 h-32 rounded-full border border-border/40 bg-card/30 backdrop-blur-md flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.2)] group-hover:border-primary/50 transition-all duration-500 z-10">
                <div className="absolute inset-2 rounded-full border border-primary/20 border-dashed animate-spin-slow" />
                <span className="text-4xl xs:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                    {letter}
                </span>
            </div>

            <div className="relative z-10 text-center px-4">
                <h3 className="text-xl xs:text-2xl font-bold tracking-tight leading-snug text-foreground mb-2 group-hover:text-primary transition-colors duration-300 drop-shadow-md">
                    {t(`${letter}.name`)}
                </h3>
                <p className="text-[10px] xs:text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-widest mb-4">
                    {t(`${letter}.subtitle`)}
                </p>
                <div className="p-4 rounded-xl bg-card/20 border border-border/30 backdrop-blur-sm">
                    <p className="text-sm xs:text-base text-foreground/80 leading-relaxed font-bold">
                        {t(`${letter}.desc`)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default function FaroMethodSection() {
    const t = useTranslations('home.faro');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <section id="metodo-faro" ref={ref} className="w-full py-32 bg-transparent relative">

            <div className="container relative z-10 mx-auto px-6">
                <header className="mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-7xl lg:text-6xl font-black text-foreground mb-8 leading-[1.1]">
                            Método <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Faro</span>
                        </h2>
                        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground/90 leading-relaxed max-w-7xl mx-auto font-medium px-4">
                            {t('intro')}
                        </p>
                    </motion.div>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connecting Beam */}
                    <div className="hidden lg:block absolute top-[64px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[2px]" />

                    <Step letter="F" index={0} />
                    <Step letter="A" index={1} />
                    <Step letter="R" index={2} />
                    <Step letter="O" index={3} />
                </div>
            </div>
        </section>
    );
}
