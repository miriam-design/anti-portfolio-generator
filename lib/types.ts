export interface HeroSection {
  headline: string;
  subheadline: string;
}

export interface AboutSection {
  story: string;
  anti_traits: string[];
}

export interface MethodologyStep {
  title: string;
  description: string;
}

export interface MethodologySection {
  name: string;
  steps: MethodologyStep[];
}

export interface FailureStory {
  failure: string;
  lesson: string;
}

export interface FailuresSection {
  title: string;
  stories: FailureStory[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  tech_or_tools: string[];
}

export interface PersonalSide {
  loves: string[];
  hates: string[];
}

export interface VisualDNA {
  geometry_type: 'sphere' | 'torus' | 'icosahedron' | 'capsule' | 'pyramid' | 'cluster' | 'dna-helix' | 'fluid-orb' | 'organic-bulb' | 'tech-pill' | 'matrix-cloud';
  material_type: 'glass' | 'wireframe' | 'metal' | 'stone' | 'hologram' | 'liquid' | 'ceramic' | 'matte' | 'iridescent';
  texture_style: 'clean' | 'distorted' | 'rough';
  movement_speed: 'slow' | 'medium' | 'fast';
  colors: {
    primary: string;
    secondary: string;
    bg: string;
  };
}

export interface IdentityManifest {
  name: string;
  hero: HeroSection;
  about: AboutSection;
  methodology: MethodologySection;
  failures: FailuresSection;
  projects: Project[];
  personal_side: PersonalSide;
  visual_dna: VisualDNA;
}
