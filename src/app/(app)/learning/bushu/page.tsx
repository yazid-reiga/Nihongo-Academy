"use client";

import { Badge, Card, PageHeader } from "@/components/ui/Primitives";
import { RADICALS } from "@/lib/data/seed/content";

export default function BushuPage() {
  return (
    <div>
      <PageHeader eyebrow="Kanji Learning Center" title="Bushu / Radikal" description="Pelajari komponen pembentuk kanji secara terpisah dari kanji dasar. Perhatikan bentuk mandiri, variasi posisi, dan contoh penggunaannya." />
      <div className="mb-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm leading-relaxed text-slate-700">
        <strong>Catatan data:</strong> label “radikal resmi terverifikasi” hanya diberikan pada bentuk kanonik yang memang diakui sebagai radikal. Bentuk turunan seperti 氵, 亻, 扌, 忄, 艹, dan 灬 ditandai sebagai <em>varian posisi</em>, bukan radikal resmi tersendiri.
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RADICALS.map((radical) => (
          <Card key={radical.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="jp flex h-16 w-16 items-center justify-center rounded-xl bg-cream text-3xl font-bold text-navy">{radical.symbol}</div>
              <Badge tone={radical.isOfficialRadical ? "green" : "slate"}>{radical.isOfficialRadical ? "Radikal resmi" : "Varian posisi"}</Badge>
            </div>
            <h2 className="mt-4 text-lg font-bold">{radical.name}</h2>
            <p className="mt-1 text-sm font-semibold text-red-ink">{radical.meaning}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-slate-600">Bentuk varian</dt><dd className="jp font-semibold">{radical.variants.join(", ") || "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-600">Posisi umum</dt><dd className="font-semibold">{radical.position}</dd></div>
            </dl>
            <div className="mt-4 border-t border-navy/8 pt-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Contoh</p>
              <div className="jp mt-2 flex flex-wrap gap-2 text-lg font-bold text-navy">{radical.examples.map((ex) => <span key={ex} className="rounded-lg bg-navy/5 px-2.5 py-1">{ex}</span>)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
