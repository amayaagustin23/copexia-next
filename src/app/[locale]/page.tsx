// src/app/[locale]/page.tsx
"use client";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import LearningOverview from "@/components/home/learning/LearningOverview";
import Section from "@/components/Section";
import AboutSection from "@/components/Sections/AboutSection";
import HeroSection from "@/components/Sections/HeroSection";
import ValuesSection from "@/components/Sections/ValuesSection";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Section
        id="inicio"
        title=""
        itemSelector="[data-animate]"
        staggerChildren
      >
        <HeroSection />
      </Section>

      <Section
        id="valores"
        title=""
        itemSelector="[data-animate]"
        staggerChildren
      >
        <AboutSection />
      </Section>

      <Section
        id="servicios"
        title=""
        itemSelector="[data-animate]"
        staggerChildren
      >
        <ValuesSection />
      </Section>

      <Section
        id="learning"
        title="Copexia Learning"
        itemSelector="[data-animate]"
        staggerChildren
      >
        <LearningOverview />
      </Section>

      <FloatingWhatsApp />
    </main>
  );
}
