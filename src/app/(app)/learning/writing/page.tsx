"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WritingCanvas } from "@/components/learning/WritingCanvas";
import { Skeleton } from "@/components/ui/Primitives";
import type { Script } from "@/lib/types";

function WritingContent() {
  const params = useSearchParams();
  const raw = params.get("script");
  const script: Script | "kanji" = raw === "katakana" || raw === "kanji" ? raw : "hiragana";
  return <WritingCanvas script={script} initialId={params.get("char") ?? undefined} />;
}

export default function WritingPage() {
  return (
    <Suspense fallback={<Skeleton variant="page" />}>
      <WritingContent />
    </Suspense>
  );
}
