"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/ui/Primitives";
import { COMPOSITIONS, KANJI } from "@/lib/data/seed/kanji";

export default function CompositionPage() {
  return (
    <div>
      <PageHeader eyebrow="Kanji Learning Center" title="Komposisi Kanji" description="Hubungkan kanji berdasarkan komponen yang sama agar lebih mudah dikenali. Gunakan sebagai bantuan belajar, bukan sebagai aturan makna yang pasti." />
      <div className="mb-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-slate-700">
        <strong>Disclaimer:</strong> komponen tidak selalu menentukan makna kanji. Rantai di bawah adalah bantuan visual untuk mengingat bentuk dan hubungan, bukan penjelasan etimologi yang berlaku untuk semua kasus.
      </div>
      <div className="space-y-5">
        {COMPOSITIONS.map((chain) => (
          <Card key={chain.id}>
            <Badge tone="navy">Rantai belajar</Badge>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {chain.chars.map((char, i) => (
                <div key={`${char}-${i}`} className="flex items-center gap-3">
                  {KANJI.some((k) => k.character === char)
                    ? <Link href={`/learning/kanji/kanji-${char}`} className="jp flex h-20 w-20 items-center justify-center rounded-2xl bg-cream text-4xl font-bold text-navy ring-1 ring-navy/10 transition-transform hover:-translate-y-1 hover:ring-red/40">{char}</Link>
                    : <span className="jp flex h-20 w-20 items-center justify-center rounded-2xl bg-cream text-4xl font-bold text-navy ring-1 ring-navy/10">{char}</span>}
                  {i < chain.chars.length - 1 && <ArrowRight className="h-5 w-5 text-slate-400" />}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">{chain.explanation}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
