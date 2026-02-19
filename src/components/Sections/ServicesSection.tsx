"use client";

import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    BarChart3,
    Laptop,
    Users2,
    Check,
    HelpCircle,
    Trophy,
    Plus
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type ServiceBlock = 'block1' | 'block2' | 'block3' | 'block4';

interface ServiceCardProps {
    blockKey: ServiceBlock;
    icon: React.ElementType;
    index: number;
}

const ServiceCard = ({ blockKey, icon: Icon, index }: ServiceCardProps) => {
    const t = useTranslations('home.services');
    const [isExpanded, setIsExpanded] = useState(false);

    const includes = t.raw(`${blockKey}.includes`) as string[];
    const needItems = t.raw(`${blockKey}.needItems`) as string[];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative group flex flex-col h-fit rounded-3xl border border-border/50 bg-card p-8 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}
        >
            {/* Icon & Title */}
            <div className="flex flex-col gap-6 mb-6 text-left">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                    <Icon className="w-8 h-8" />
                </div>
                <div className="text-left">
                    <h3 className="text-xl xs:text-2xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors duration-300 text-left">
                        {t(`${blockKey}.title`)}
                    </h3>
                    <p className="mt-4 text-xs xs:text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 text-left">
                        {t(`${blockKey}.desc`)}
                    </p>
                </div>
            </div>

            {/* Button to expand/collapse */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-auto flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:opacity-80 transition-opacity w-fit"
            >
                <Plus className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} />
                {isExpanded ? 'Ver menos' : 'Conocer más'}
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-8 space-y-8 text-left">
                            {/* Includes */}
                            <div className="text-left">
                                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-4 text-left">
                                    <Check className="w-4 h-4" />
                                    {t(`${blockKey}.includesTitle`)}
                                </h4>
                                <ul className="space-y-3 text-left">
                                    {includes.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-foreground/80 text-left">
                                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Result */}
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
                                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-2 text-left">
                                    <Trophy className="w-4 h-4" />
                                    {t(`${blockKey}.resultTitle`)}
                                </h4>
                                <p className="text-sm font-medium italic text-foreground/90 leading-relaxed text-left">
                                    {t(`${blockKey}.result`)}
                                </p>
                            </div>

                            {/* Need it? */}
                            <div className="pb-4 text-left">
                                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 text-left">
                                    <HelpCircle className="w-4 h-4" />
                                    {t(`${blockKey}.needServiceTitle`)}
                                </h4>
                                <ul className="space-y-2 text-left">
                                    {needItems.map((item, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex gap-2 text-left">
                                            <span className="text-primary/60">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hover Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 -z-10" />
        </motion.div>
    );
};

export default function ServicesSection() {
    const t = useTranslations('home.services');

    return (
        <section id="servicios" className="relative w-full py-12 xs:py-16 sm:py-20 lg:py-24 overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6">
                <header className="w-full mb-12 xs:mb-16 sm:mb-20 text-center">
                    <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-[11px] xs:text-xs sm:text-sm tracking-widest uppercase text-muted-foreground/80 font-medium mb-2 xs:mb-3 sm:mb-4"
                        >
                            {t('eyebrow')}
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] px-2"
                        >
                            Nuestras Soluciones Estratégicas
                        </motion.h2>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
                    <ServiceCard blockKey="block1" icon={Settings} index={0} />
                    <ServiceCard blockKey="block2" icon={BarChart3} index={1} />
                    <ServiceCard blockKey="block3" icon={Laptop} index={2} />
                    <ServiceCard blockKey="block4" icon={Users2} index={3} />
                </div>
            </div>
        </section>
    );
}
