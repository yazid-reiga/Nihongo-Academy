"use client";

import { useParams } from "next/navigation";
import { QuizRunner } from "@/components/quiz/Quiz";
import type { QuizCategory } from "@/lib/types";
import { Card, EmptyState } from "@/components/ui/Primitives";

export default function QuizCategoryPage() {
  const params = useParams<{ category: string }>();
  const valid: QuizCategory[] = ["hiragana", "katakana", "kana-reading", "kanji-meaning", "kanji-reading", "bushu", "vocabulary", "grammar", "mixed"];
  if (!valid.includes(params.category as QuizCategory)) {
    return <Card><EmptyState icon="🔍" title="Kategori tidak ditemukan" description="Kategori kuis yang kamu cari tidak tersedia." /></Card>;
  }
  return <QuizRunner category={params.category as QuizCategory} />;
}
