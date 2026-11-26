"use client";

import { useParams } from "next/navigation";
import { KanaDetail } from "@/components/learning/Kana";
import { KATAKANA } from "@/lib/data/seed/kana";
import { Card, EmptyState } from "@/components/ui/Primitives";

export default function KatakanaDetailPage() {
  const params = useParams<{ id: string }>();
  const char = KATAKANA.find((item) => item.id === params.id);
  if (!char) return <Card><EmptyState icon="🔍" title="Karakter tidak ditemukan" description="Karakter Katakana yang kamu cari tidak tersedia." /></Card>;
  return <KanaDetail script="katakana" char={char} />;
}
