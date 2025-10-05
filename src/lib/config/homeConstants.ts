// Constants for Home page and sections
export const HOME_CONFIG = {
  // Animation constants
  animations: {
    section: {
      threshold: 0.2,
      duration: 800,
      delay: 100,
      spring: { stiffness: 220, damping: 26 }
    },
    hero: {
      spring: { stiffness: 320, damping: 18 },
      scale: [1, 1.03, 1],
      scaleDuration: 260,
      progressDuration: { enter: 900, leave: 300 }
    },
    values: {
      initialActiveIndex: 0,
      baseDelayMs: 28,
      animationDuration: 520
    }
  },

  // Grid constants for AboutSection
  crossword: {
    anchor: "COPEXIA",
    crosses: [
      { word: "COLABORACION", letter: "C", occurrence: 2 },
      { word: "ORGANIZACION", letter: "O" },
      { word: "PERSONALIZACION", letter: "P" },
      { word: "ESTRATEGIA", letter: "E", occurrence: 2 },
      { word: "EXCELENCIA", letter: "X" },
      { word: "INNOVACION", letter: "I", occurrence: 2 },
      { word: "ACOMPANAMIENTO", letter: "A" }
    ]
  },


} as const;

// Types
export interface SectionConfig {
  id: string;
  title: string;
  className?: string;
}

export interface CopexiaItem {
  k: string;
  title: string;
  desc: string;
}

export interface ValueItem {
  n: number;
  title: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface LearningModule {
  key: string;
  title: string;
  icon: React.ReactNode;
  text: string;
}
