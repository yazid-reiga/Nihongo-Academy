"use client";

import { HeroSection } from "@/components/home/HeroSection";
import {
  AboutSection,
  ExamPreparationSection,
  FinalCTA,
  KanjiShowcaseSection,
  LearningModulesSection,
  LearningPathSection,
  StatisticsSection,
  WhySection,
} from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatisticsSection />
      <LearningPathSection />
      <LearningModulesSection />
      <KanjiShowcaseSection />
      <ExamPreparationSection />
      <WhySection />
      <AboutSection />
      <FinalCTA />
    </>
  );
}
