// src/app/[locale]/page.tsx
"use client";

import ValuesCompact from "@/components/home/about/ValuesCompact";
import HeroIntro from "@/components/home/hero/HeroIntro";
import LearningOverview from "@/components/home/learning/LearningOverview";
import ServicesOverview from "@/components/home/services/ServicesOverview";
import Section from "@/components/Section";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Section
        id="inicio"
        title=""
        itemSelector="[data-animate]"
        staggerChildren
      >
        <HeroIntro />
      </Section>

      <Section
        id="valores"
        title="Valores de Copexia"
        itemSelector="[data-animate]"
        staggerChildren
      >
        <ValuesCompact />
      </Section>

      <Section
        id="servicios"
        title="Nuestros servicios"
        itemSelector="[data-animate]"
        staggerChildren
      >
        <ServicesOverview />
      </Section>

      <Section
        id="learning"
        title="Copexia Learning"
        itemSelector="[data-animate]"
        staggerChildren
      >
        <LearningOverview />
      </Section>
    </main>
  );
}
