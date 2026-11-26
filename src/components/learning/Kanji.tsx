"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Heart, Volume2 } from "lucide-react";
import { useApp } from "@/app/providers";
import { speakJapanese } from "@/lib/audio";
import { KANJI } from "@/lib/data/seed/kanji";
import { buttonStyles, Badge, Card, Input, PageHeader, Select, Tabs } from "@/components/ui/Primitives";
import type { KanjiEntry, LearningStatus } from "@/lib/types";

const pastels = [
  "bg-[#fde4e6] text-[#a3323f]", "bg-[#dff0e6] text-[#27684a]",
  "bg-[#e4ecfa] text-[#2d4f8a]", "bg-[#f7edd5] text-[#8a6420]",
  "bg-[#eee5f8] text-[#63458e]", "bg-[#fbe6d8] text-[#9a5426]",
  "bg-[#dff2f1] text-[#266b68]", "bg-[#fae2ec] text-[#9c3c63]",
];

const statuses: LearningStatus[] = ["not_started", "learning", "reviewing", "mastered"];
const statusLabels: Record<LearningStatus, string> = {
  not_started: "Belum dimulai", learning: "Sedang belajar", reviewing: "Sedang diulang", mastered: "Dikuasai",
};

export function KanjiLibrary() {
  const { user, state, settings, adapter } = useApp();
  const [search, setSearch] = useState("");
  const [jlpt, setJlpt] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [category, setCategory] = useState("Semua");

  const filtered = useMemo(() => KANJI.filter((kanji) => {
    const term = search.trim().toLowerCase();
    const searchMatch = !term || kanji.character.includes(term) || kanji.romajiHint.toLowerCase().includes(term) || kanji.meaning.toLowerCase().includes(term) || kanji.exampleWords.some((w) => w.word.toLowerCase().includes(term));
    const status = state?.progress.find((p) => p.userId === user?.id && p.contentType === "kanji" && p.contentId === kanji.id)?.status ?? "not_started";
    return searchMatch
      && (jlpt === "Semua" || kanji.jlpt === jlpt)
      && (category === "Semua" || kanji.category === category)
      && (statusFilter === "Semua" || status === statusFilter);
  }), [search, jlpt, statusFilter, category, state, user]);

  return (
    <div>
      <PageHeader eyebrow="Kanji Learning Center" title="Jelajahi Kanji" description={`${KANJI.length} kanji dasar dengan arti, pembacaan yang terikat konteks, contoh kata, dan komponen.`} action={<Link href="/learning/writing?script=kanji" className={buttonStyles("outline")}>Latihan menulis Kanji</Link>} />

      <Card className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input className="flex-1" placeholder="Cari kanji, romaji, atau arti..." aria-label="Cari kanji" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select aria-label="Filter JLPT" value={jlpt} onChange={(e) => setJlpt(e.target.value)} className="md:w-40"><option>Semua</option>{["N5", "N4", "N3", "N2", "N1"].map((l) => <option key={l}>{l}</option>)}</Select>
          <Select aria-label="Filter status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="md:w-48"><option>Semua</option>{statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}</Select>
        </div>
        <Tabs tabs={["Semua", "Dasar"]} active={category} onChange={setCategory} />
      </Card>

      <p className="mb-4 text-sm text-slate-600">Menampilkan <strong>{filtered.length}</strong> kanji.</p>
      {filtered.length === 0 ? (
        <Card><div className="py-10 text-center text-slate-600">Tidak ada kanji yang cocok dengan filter ini.</div></Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((kanji, i) => {
            const status = state?.progress.find((p) => p.userId === user?.id && p.contentType === "kanji" && p.contentId === kanji.id)?.status;
            const favorite = user ? adapter.isFavorite(user.id, "kanji", kanji.id) : false;
            return (
              <div key={kanji.id} className={`group relative overflow-hidden rounded-2xl p-4 text-center transition-all hover:-translate-y-1.5 hover:shadow-lg ${pastels[i % pastels.length]}`}>
                <div className="absolute right-2 top-2 flex gap-1">
                  {user && <button onClick={() => adapter.toggleFavorite(user.id, "kanji", kanji.id)} aria-label={favorite ? "Hapus favorit" : "Tambah favorit"} className="rounded-full p-1.5 hover:bg-white/40"><Heart className={`h-4 w-4 ${favorite ? "fill-red text-red-ink" : ""}`} /></button>}
                </div>
                <Link href={`/learning/kanji/${kanji.id}`} className="block">
                  <span className="text-2xl" aria-hidden="true">{kanji.illustration}</span>
                  <p className="jp mt-2 text-4xl font-bold">{kanji.character}</p>
                  <p className="mt-2 text-xs font-bold">{kanji.meaning}</p>
                  <p className="mt-1 text-[10px] opacity-70">{kanji.romajiHint}</p>
                </Link>
                <div className="mt-2 flex justify-center gap-1">
                  <button onClick={() => speakJapanese(kanji.character, settings.audioEnabled)} aria-label={`Dengarkan ${kanji.character}`} className="rounded-full p-1.5 hover:bg-white/40"><Volume2 className="h-3.5 w-3.5" /></button>
                  {user && <button onClick={() => adapter.markLearned(user.id, "kanji", kanji.id, kanji.character)} aria-label="Tandai dikuasai" className="rounded-full p-1.5 hover:bg-white/40"><CheckCircle2 className={`h-3.5 w-3.5 ${status === "mastered" ? "text-success" : ""}`} /></button>}
                </div>
                {status === "mastered" && <Badge tone="green">Dikuasai</Badge>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function KanjiDetail({ kanji }: { kanji: KanjiEntry }) {
  const { user, state, settings, adapter } = useApp();
  const [audioNote, setAudioNote] = useState("");
  const status = state?.progress.find((p) => p.userId === user?.id && p.contentType === "kanji" && p.contentId === kanji.id)?.status ?? "not_started";
  const nextStatus = statuses[(statuses.indexOf(status) + 1) % statuses.length];
  const favorite = user ? adapter.isFavorite(user.id, "kanji", kanji.id) : false;

  function playAudio() {
    const ok = speakJapanese(kanji.character, settings.audioEnabled);
    setAudioNote(ok ? "" : "Browser tidak menyediakan suara Jepang — gunakan teks pembacaan di bawah.");
  }

  return (
    <div>
      <Link href="/learning/kanji" className="text-sm font-bold text-red-ink hover:underline">← Kembali ke daftar Kanji</Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col items-center bg-gradient-to-br from-cream to-white p-8">
          <span className="text-5xl" aria-hidden="true">{kanji.illustration}</span>
          <p className="jp mt-3 text-[110px] font-bold leading-none text-navy">{kanji.character}</p>
          <p className="mt-3 text-xl font-extrabold text-red-ink">{kanji.meaning}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2"><Badge tone="navy">JLPT {kanji.jlpt}</Badge><Badge tone="gold">{kanji.strokeCount} goresan</Badge><Badge tone="slate">{kanji.category}</Badge></div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button onClick={playAudio} className={buttonStyles("outline", "sm")}><Volume2 className="h-4 w-4" /> Dengarkan</button>
            <Link href={`/learning/writing?script=kanji&char=${kanji.id}`} className={buttonStyles("secondary", "sm")}>Latihan menulis</Link>
            {user && <button onClick={() => adapter.setProgress(user.id, "kanji", kanji.id, nextStatus)} className={buttonStyles("primary", "sm")}>Ubah status → {statusLabels[nextStatus]}</button>}
            {user && <button onClick={() => adapter.toggleFavorite(user.id, "kanji", kanji.id)} className={buttonStyles("ghost", "sm")}><Heart className={`h-4 w-4 ${favorite ? "fill-red text-red-ink" : ""}`} /> {favorite ? "Favorit" : "Simpan"}</button>}
          </div>
          {audioNote && <p role="status" className="mt-3 text-center text-xs text-slate-600">{audioNote}</p>}
          {user && <p className="mt-3 text-xs text-slate-600">Status saat ini: <strong>{statusLabels[status]}</strong></p>}
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold">Pembacaan</h2>
            <p className="mt-2 text-xs text-slate-600">Pembacaan selalu terikat konteks kata. Pilih on'yomi atau kun'yomi sesuai kata, bukan keduanya secara bebas.</p>
            <div className="mt-4 space-y-3">
              {kanji.readings.map((reading, i) => (
                <div key={i} className="rounded-xl border border-navy/8 p-3">
                  <div className="flex items-center justify-between gap-2"><Badge tone={reading.type === "onyomi" ? "red" : "navy"}>{reading.type === "onyomi" ? "On'yomi" : "Kun'yomi"}</Badge><span className="jp text-lg font-bold text-navy">{reading.kana}</span></div>
                  <p className="mt-2 text-xs text-slate-600">{reading.context}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold">Contoh kosakata</h2>
            <div className="mt-4 space-y-2">
              {kanji.exampleWords.map((word) => (
                <div key={word.word} className="flex items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3">
                  <div><p className="jp text-lg font-bold text-navy">{word.word}</p><p className={`text-xs text-slate-600 ${settings.furiganaMode === "hover" ? "opacity-40 hover:opacity-100" : ""} ${settings.furiganaMode === "hidden" ? "hidden" : ""}`}>{word.kana}</p></div>
                  <p className="text-sm font-semibold text-red-ink">{word.meaning}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-navy/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Contoh kalimat</p>
              <p className="jp mt-2 text-xl font-bold text-navy">{kanji.exampleSentence.jp}</p>
              <p className="mt-1 text-sm text-indigo">{kanji.exampleSentence.romaji}</p>
              <p className="mt-1 text-sm text-slate-600">{kanji.exampleSentence.meaning}</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold">Komponen & terkait</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {kanji.components.length === 0 ? <p className="text-sm text-slate-600">Belum ada komponen yang tercatat untuk kanji ini.</p> : kanji.components.map((c) => <span key={c} className="jp rounded-lg bg-navy/5 px-3 py-2 text-lg font-bold text-navy">{c}</span>)}
            </div>
            <h3 className="mt-4 text-sm font-bold text-navy">Kanji terkait</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {kanji.related.length === 0 ? <p className="text-sm text-slate-600">Belum ada data terkait.</p> : kanji.related.map((c) => <span key={c} className="jp rounded-lg bg-red/5 px-3 py-2 text-lg font-bold text-red-ink">{c}</span>)}
            </div>
            {user && <button onClick={() => adapter.recordReview(user.id, "kanji", kanji.id, 2, `Kanji sulit: ${kanji.character}`)} className={`${buttonStyles("outline", "sm")} mt-4`}>Tandai sulit & jadwalkan ulang</button>}
          </Card>
        </div>
      </div>
    </div>
  );
}
