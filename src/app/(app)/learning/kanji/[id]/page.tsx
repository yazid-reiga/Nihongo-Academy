"use client";

import { useParams } from "next/navigation";
import { KanjiDetail } from "@/components/learning/Kanji";
import { KANJI } from "@/lib/data/seed/kanji";
import { Card, EmptyState } from "@/components/ui/Primitives";

export default function KanjiDetailPage() {
  const params = useParams<{ id: string }>();
  const kanji = KANJI.find((item) => item.id === params.id);
  if (!kanji) return <Card><EmptyState icon="🔍" title="Kanji tidak ditemukan" description="Kanji yang kamu cari tidak tersedia dalam katalog." /></Card>;
  return <KanjiDetail kanji={kanji} />;
}
