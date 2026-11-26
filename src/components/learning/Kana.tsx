"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Play, Volume2 } from "lucide-react";
import { useApp } from "@/app/providers";
import { speakJapanese } from "@/lib/audio";
import { KANA_CATEGORIES, getKana } from "@/lib/data/seed/kana";
import { buttonStyles, Badge, Card, Input, PageHeader, Tabs } from "@/components/ui/Primitives";
import type { KanaChar, Script } from "@/lib/types";

function statusFor(contentType: string, id: string, state: ReturnType<typeof useApp>["state"], userId?: string) {
  return state?.progress.find((p) => p.userId === userId && p.contentType === contentType && p.contentId === id)?.status;
}

export function KanaLibrary({ script }: { script: Script }) {
  const { user, state, settings, adapter } = useApp();
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const all = getKana(script);
  const contentType = `kana-${script}`;
  const label = script === "hiragana" ? "Hiragana" : "Katakana";

  const filtered = useMemo(() => all.filter((char) => {
    const matchCategory = category === "Semua" || char.category === category;
    const term = search.trim().toLowerCase();
    const matchSearch = !term || char.character.includes(term) || char.romaji.toLowerCase().includes(term) || char.exampleMeaning.toLowerCase().includes(term);
    return matchCategory && matchSearch;
  }), [all, category, search]);

  return (
    <div>
      <PageHeader eyebrow="Belajar" title={`${label} Learning`} description={`Pelajari ${all.length} karakter ${label} dalam enam kelompok. Klik kartu untuk detail, dengarkan pelafalan, lalu tandai sebagai dikuasai.`} action={<Link href={`/learning/writing?script=${script}`} className={buttonStyles("outline")}>Latihan menulis</Link>} />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs tabs={["Semua", ...KANA_CATEGORIES]} active={category} onChange={setCategory} />
          <Input className="lg:w-64" placeholder="Cari karakter atau romaji..." aria-label="Cari karakter" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
        <span>Menampilkan <strong>{filtered.length}</strong> karakter</span>
        {user && <span className="font-semibold text-red-ink">{all.filter((c) => statusFor(contentType, c.id, state, user.id) === "mastered").length} dikuasai</span>}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((char) => {
          const status = statusFor(contentType, char.id, state, user?.id);
          return (
            <div key={char.id} className="group rounded-2xl border border-navy/10 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-red/40 hover:card-shadow">
              <Link href={`/learning/${script}/${char.id}`} className="block">
                <p className="jp text-4xl font-bold text-navy">{char.character}</p>
                {settings.romajiMode !== "hidden" && <p className="mt-2 text-sm font-bold text-red-ink">{char.romaji}</p>}
                <p className="mt-1 truncate text-[11px] text-slate-600">{char.character} · {char.category}</p>
              </Link>
              <div className="mt-3 flex items-center justify-center gap-1">
                <button onClick={() => speakJapanese(char.exampleWord, settings.audioEnabled)} className="rounded-lg p-2 text-indigo hover:bg-navy/5" aria-label={`Dengarkan ${char.character}`} title="Dengarkan">
                  {speakSupported() ? <Volume2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                {user && <button onClick={() => adapter.markLearned(user.id, contentType, char.id, char.character)} className="rounded-lg p-2 text-slate-400 hover:bg-success/10 hover:text-success" aria-label={`Tandai ${char.character} sebagai dikuasai`} title="Tandai dikuasai"><CheckCircle2 className={`h-4 w-4 ${status === "mastered" ? "text-success" : ""}`} /></button>}
              </div>
              {status === "mastered" && <Badge tone="green">Dikuasai</Badge>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function speakSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function KanaDetail({ script, char }: { script: Script; char: KanaChar }) {
  const { user, state, settings, adapter } = useApp();
  const [audioNote, setAudioNote] = useState("");
  const [mode, setMode] = useState<"recognize" | "listen">("recognize");
  const [choice, setChoice] = useState<number | null>(null);
  const contentType = `kana-${script}`;
  const status = statusFor(contentType, char.id, state, user?.id);
  const all = getKana(script);
  const options = useMemo(() => {
    const others = all.filter((c) => c.id !== char.id && c.category === char.category).slice(0, 3);
    const pool = others.length >= 3 ? others : all.filter((c) => c.id !== char.id).slice(0, 3);
    return [...pool, char].sort(() => Math.random() - 0.5);
  }, [all, char]);

  function playAudio() {
    const ok = speakJapanese(char.character, settings.audioEnabled);
    setAudioNote(ok ? "" : "Browser ini tidak menyediakan suara Jepang. Gunakan teks panduan di bawah.");
  }

  return (
    <div>
      <Link href={`/learning/${script}`} className="text-sm font-bold text-red-ink hover:underline">← Kembali ke {script === "hiragana" ? "Hiragana" : "Katakana"}</Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col items-center bg-gradient-to-br from-cream to-white p-8">
          <p className="jp text-[120px] font-bold leading-none text-navy">{char.character}</p>
          {settings.romajiMode !== "hidden" && <p className="mt-4 text-2xl font-extrabold text-red-ink">{char.romaji}</p>}
          <Badge tone="navy">{char.category}</Badge>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button onClick={playAudio} className={buttonStyles("primary", "sm")}><Volume2 className="h-4 w-4" /> Dengarkan</button>
            <Link href={`/learning/writing?script=${script}&char=${char.id}`} className={buttonStyles("outline", "sm")}>Latihan menulis</Link>
            {user && <button onClick={() => adapter.markLearned(user.id, contentType, char.id, char.character)} className={buttonStyles("secondary", "sm")}><CheckCircle2 className="h-4 w-4" /> {status === "mastered" ? "Sudah dikuasai" : "Tandai dikuasai"}</button>}
          </div>
          {audioNote && <p role="status" className="mt-3 text-center text-xs text-slate-600">{audioNote}</p>}
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold">Detail karakter</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-navy/5 pb-2"><dt className="text-slate-600">Cara pengucapan</dt><dd className="font-semibold">{char.pronunciation}</dd></div>
              <div className="flex justify-between gap-4 border-b border-navy/5 pb-2"><dt className="text-slate-600">Kelompok</dt><dd className="font-semibold">{char.category}</dd></div>
              <div className="flex justify-between gap-4 border-b border-navy/5 pb-2"><dt className="text-slate-600">Contoh kata</dt><dd className="jp font-semibold">{char.exampleWord || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-600">Arti</dt><dd className="font-semibold">{char.exampleMeaning}</dd></div>
            </dl>
            <div className="mt-5 rounded-xl bg-cream p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Panduan bentuk</p>
              <div className="jp mx-auto mt-3 flex h-32 w-32 items-center justify-center rounded-lg border border-navy/10 bg-white text-6xl text-navy/25" style={{ backgroundImage: "linear-gradient(to right, rgba(23,38,75,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,38,75,.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>{char.character}</div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">Aset animasi urutan goresan per karakter belum dibundling pada rilis ini. Gunakan latihan menulis untuk menyalin bentuk di atas.</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold">Mode pengenalan</h2>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setMode("recognize"); setChoice(null); }} className={`min-h-11 rounded-xl px-4 text-sm font-bold ${mode === "recognize" ? "bg-navy text-white" : "bg-navy/5 text-slate-600"}`}>Pengenalan</button>
              <button onClick={() => { setMode("listen"); setChoice(null); }} className={`min-h-11 rounded-xl px-4 text-sm font-bold ${mode === "listen" ? "bg-navy text-white" : "bg-navy/5 text-slate-600"}`}>Mendengar</button>
            </div>
            <p className="mt-4 text-sm text-slate-600">{mode === "recognize" ? `Pilih romaji yang sesuai untuk ${char.character}.` : "Dengarkan lalu pilih karakter yang benar."}</p>
            {mode === "listen" && <button onClick={() => speakJapanese(char.character, settings.audioEnabled)} className={`${buttonStyles("outline", "sm")} mt-3`}><Volume2 className="h-4 w-4" /> Putar ulang suara</button>}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {options.map((option, index) => {
                const correct = option.id === char.id;
                const revealed = choice !== null;
                return (
                  <button key={option.id} onClick={() => setChoice(index)}
                    className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${revealed && correct ? "border-success bg-success/10 text-success" : revealed && index === choice ? "border-red bg-red/10 text-red-ink" : "border-navy/10 bg-white hover:border-navy/30"}`}>
                    <span className="jp text-xl">{option.character}</span>{settings.romajiMode !== "hidden" && <span className="ml-2 text-xs text-slate-600">{option.romaji}</span>}
                  </button>
                );
              })}
            </div>
            {choice !== null && <p role="status" className="mt-3 text-sm font-semibold">{options[choice].id === char.id ? "✅ Benar! Pertahankan." : `❌ Belum tepat. Jawaban: ${char.character} (${char.romaji}).`}</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
