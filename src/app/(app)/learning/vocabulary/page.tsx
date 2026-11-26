"use client";

import { useMemo, useState } from "react";
import { Heart, RotateCcw, Volume2 } from "lucide-react";
import { useApp } from "@/app/providers";
import { speakJapanese } from "@/lib/audio";
import { VOCABULARY } from "@/lib/data/seed/content";
import { Badge, Button, Card, Input, PageHeader, Tabs, buttonStyles } from "@/components/ui/Primitives";

const categories = ["Semua", ...Array.from(new Set(VOCABULARY.map((v) => v.category)))];

export default function VocabularyPage() {
  const { user, state, settings, adapter } = useApp();
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [limit, setLimit] = useState(12);

  const filtered = useMemo(() => VOCABULARY.filter((word) => {
    const term = search.trim().toLowerCase();
    return (category === "Semua" || word.category === category)
      && (!term || word.kanjiForm.toLowerCase().includes(term) || word.romaji.toLowerCase().includes(term) || word.meaning.toLowerCase().includes(term));
  }), [category, search]);

  return (
    <div>
      <PageHeader eyebrow="Belajar" title="Pustaka Kosakata" description={`${VOCABULARY.length} kosakata dalam 15 kategori. Balik kartu untuk melihat arti, dengarkan pelafalannya, dan tandai yang sudah dikuasai.`} />
      <Card className="mb-6 space-y-4">
        <Tabs tabs={categories} active={category} onChange={(c) => { setCategory(c); setLimit(12); }} />
        <Input placeholder="Cari kosakata..." aria-label="Cari kosakata" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>
      <p className="mb-4 text-sm text-slate-600">Menampilkan {Math.min(limit, filtered.length)} dari {filtered.length} kosakata.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, limit).map((word) => {
          const isFlipped = flipped[word.id] ?? false;
          const mastered = state?.progress.some((p) => p.userId === user?.id && p.contentType === "vocabulary" && p.contentId === word.id && p.status === "mastered");
          const favorite = user ? adapter.isFavorite(user.id, "vocabulary", word.id) : false;
          return (
            <div key={word.id} className="rounded-2xl border border-navy/10 bg-white p-5 card-shadow">
              <div className="flex items-start justify-between gap-2">
                <Badge tone="slate">{word.category}</Badge><Badge tone="navy">{word.jlpt}</Badge>
              </div>
              <button onClick={() => setFlipped((f) => ({ ...f, [word.id]: !f[word.id] }))} className="mt-4 w-full text-left" aria-label={`Balik kartu ${word.kanjiForm}`}>
                <p className="jp text-3xl font-bold text-navy">{isFlipped ? word.meaning : word.kanjiForm}</p>
                <p className="mt-2 text-sm text-slate-600">{isFlipped ? word.kanjiForm : word.romaji}</p>
                {!isFlipped && <p className="mt-1 jp text-sm text-indigo">{word.kanaForm}</p>}
              </button>
              {word.exampleSentence && isFlipped && <p className="jp mt-3 rounded-lg bg-cream p-3 text-sm text-slate-700">{word.exampleSentence}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => speakJapanese(word.kanjiForm, settings.audioEnabled)} className={buttonStyles("outline", "sm")}><Volume2 className="h-4 w-4" /> Dengar</button>
                <button onClick={() => setFlipped((f) => ({ ...f, [word.id]: !f[word.id] }))} className={buttonStyles("ghost", "sm")}><RotateCcw className="h-4 w-4" /> Balik</button>
                {user && <button onClick={() => adapter.markLearned(user.id, "vocabulary", word.id, word.kanjiForm)} className={buttonStyles("ghost", "sm")}>{mastered ? "✓ Dikuasai" : "Tandai dikuasai"}</button>}
                {user && <button onClick={() => adapter.toggleFavorite(user.id, "vocabulary", word.id)} aria-label="Favorit" className={buttonStyles("ghost", "sm")}><Heart className={`h-4 w-4 ${favorite ? "fill-red text-red-ink" : ""}`} /></button>}
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length > limit && <div className="mt-6 text-center"><Button variant="outline" onClick={() => setLimit((l) => l + 12)}>Muat lebih banyak</Button></div>}
      {filtered.length === 0 && <div className="mt-6 text-center text-slate-600">Tidak ada kosakata yang cocok.</div>}
    </div>
  );
}
