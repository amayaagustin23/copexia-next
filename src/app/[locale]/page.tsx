"use client";

import AboutCards from "@/components/home/AboutCards";
import ContactForm from "@/components/home/ContactForm";
import HomeHero from "@/components/home/HomeHero";
import LearningGrid from "@/components/home/LearningGrid";
import ServicesGrid from "@/components/home/ServicesGrid";
import ValuesList from "@/components/home/ValuesList";
import Section from "@/components/Section";
import { useLocalizedPaths } from "@/lib/hooks/useLocalizedPaths";

export default function HomePage() {
  const rutas = useLocalizedPaths();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <Section id="inicio" title="Lo que hacemos">
        <HomeHero contactoHref={rutas.secciones.contacto} />
      </Section>

      <Section id="servicios" title="Nuestros servicios">
        <ServicesGrid rutas={rutas} />
      </Section>

      <Section id="sobre-nosotros" title="Sobre nosotros">
        <AboutCards />
      </Section>

      <Section id="learning" title="Learning">
        <LearningGrid rutas={rutas} />
      </Section>

      <Section id="valores" title="Valores">
        <ValuesList />
      </Section>

      <Section id="contacto" title="Contacto">
        <ContactForm />
      </Section>
    </main>
  );
}
