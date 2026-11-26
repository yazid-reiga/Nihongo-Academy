"use client";

import { useParams } from "next/navigation";
import { KanaDetail } from "@/components/learning/Kana";
import { HIRAGANA } from "@/lib/data/seed/kana";
import { Card, EmptyState } from "@/components/ui/Primitives";

export default function HiraganaDetailPage() {
  const params = useParams<{ id: string }>();
  const char = HIRAGANA.find((item) => item.id === params.id);
  if (!char) return <Card><EmptyState icon="🔍" title="Karakter tidak ditemukan" description="Karakter Hiragana yang kamu cari tidak tersedia." /></Card>;
  return <KanaDetail script="hiragana" char={char} />;
}
