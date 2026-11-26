"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Flag, Timer, XCircle } from "lucide-react";
import { useApp } from "@/app/providers";
import { buttonStyles, Badge, Card, Modal, PageHeader, ProgressBar, Select } from "@/components/ui/Primitives";
import type { Difficulty, QuizCategory, QuizAttempt } from "@/lib/types";

export const QUIZ_CATEGORIES: { code: QuizCategory; label: string; desc: string }[] = [
  { code: "hiragana", label: "Hiragana", desc: "Karakter dan pembacaannya" },
  { code: "katakana", label: "Katakana", desc: "Kata serapan dan pembacaan" },
  { code: "kana-reading", label: "Kana Reading", desc: "Membaca rangkaian kana" },
  { code: "kanji-meaning", label: "Kanji Meaning", desc: "Arti karakter Kanji" },
  { code: "kanji-reading", label: "Kanji Reading", desc: "On'yomi dan kun'yomi dalam konteks" },
  { code: "bushu", label: "Bushu Recognition", desc: "Radikal dan komponen" },
  { code: "vocabulary", label: "Vocabulary", desc: "Arti dan pembacaan kosakata" },
  { code: "grammar", label: "Grammar", desc: "Partikel dan pola kalimat" },
  { code: "mixed", label: "Mixed Quiz", desc: "Campuran semua kategori" },
];

export function QuizCenter() {
  return (
    <div>
      <PageHeader eyebrow="Practice" title="Pusat Kuis" description="Pilih kategori, lalu atur tingkat kesulitan dan jumlah soal. Skor dihitung ulang oleh sistem penyimpanan, bukan dipercaya dari browser." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUIZ_CATEGORIES.map((category) => (
          <Link key={category.code} href={`/quiz/${category.code}`} className="group rounded-2xl border border-navy/10 bg-white p-6 card-shadow transition-all hover:-translate-y-1 hover:border-red/40">
            <Badge tone="red">Kuis</Badge>
            <h2 className="mt-4 text-lg font-bold">{category.label}</h2>
            <p className="mt-2 text-sm text-slate-600">{category.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-red-ink">Mulai kuis <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function QuizRunner({ category }: { category: QuizCategory }) {
  const { user, adapter, state } = useApp();
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [count, setCount] = useState(5);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [flagged, setFlagged] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [startTime, setStartTime] = useState(0);

  const pool = useMemo(() => {
    const filtered = adapter.getQuestions().filter((q) => q.status === "published" && (category === "mixed" || q.category === category) && (difficulty === "all" || q.difficulty === difficulty));
    return filtered.slice(0, count);
  }, [adapter, state, category, difficulty, count]);

  function begin() {
    setChoices(Array(pool.length).fill(-1));
    setCurrent(0);
    setFlagged([]);
    setStartTime(Date.now());
    setStarted(true);
  }

  function submit() {
    if (!user) return;
    const duration = Math.round((Date.now() - startTime) / 1000);
    setAttempt(adapter.submitQuiz(user.id, category, pool, choices, duration));
    setConfirmOpen(false);
  }

  if (!user) {
    return <Card><PageHeader title="Masuk untuk mengerjakan kuis" description="Progres dan hasil kuis disimpan pada akunmu." action={<Link href="/login" className={buttonStyles("primary")}>Masuk</Link>} /></Card>;
  }

  if (attempt) {
    const correct = attempt.correctCount;
    return (
      <div>
        <PageHeader eyebrow="Hasil Kuis" title="Kuis selesai!" description="Berikut hasil dan pembahasan dari setiap soal." action={<Link href="/quiz" className={buttonStyles("outline")}>Kembali ke pusat kuis</Link>} />
        <Card className="mb-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div><p className="text-xs text-slate-600">Skor</p><p className="text-3xl font-extrabold text-red-ink">{attempt.score}%</p></div>
            <div><p className="text-xs text-slate-600">Benar</p><p className="text-3xl font-extrabold text-success">{correct}</p></div>
            <div><p className="text-xs text-slate-600">Salah</p><p className="text-3xl font-extrabold text-red-ink">{attempt.totalQuestions - correct}</p></div>
            <div><p className="text-xs text-slate-600">Waktu</p><p className="text-3xl font-extrabold text-navy">{attempt.durationSeconds}s</p></div>
          </div>
          <div className="mt-5"><ProgressBar value={attempt.score} color="red" label="Skor akhir" /></div>
        </Card>
        <div className="space-y-3">
          {pool.map((question, i) => {
            const answer = attempt.answers[i];
            const isCorrect = answer?.correct;
            return (
              <Card key={question.id}>
                <div className="flex items-start gap-3">
                  {isCorrect ? <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-success" /> : <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-ink" />}
                  <div className="w-full">
                    <p className="font-bold text-navy">{i + 1}. {question.prompt}</p>
                    <p className="mt-2 text-sm text-slate-600">Jawabanmu: <strong>{choices[i] >= 0 ? question.options[choices[i]] : "tidak dijawab"}</strong></p>
                    <p className="text-sm text-slate-600">Kunci: <strong className="text-success">{question.options[question.answerIndex]}</strong></p>
                    <p className="mt-2 rounded-lg bg-cream p-3 text-sm text-slate-700">{question.explanation}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/progress#review" className={buttonStyles("primary")}>Lihat materi yang perlu diulang</Link>
          <button onClick={() => { setAttempt(null); setStarted(false); }} className={buttonStyles("outline")}>Ulangi kuis</button>
        </div>
      </div>
    );
  }

  if (!started) {
    const label = QUIZ_CATEGORIES.find((c) => c.code === category)?.label ?? category;
    return (
      <div>
        <Link href="/quiz" className="text-sm font-bold text-red-ink hover:underline">← Pusat kuis</Link>
        <PageHeader eyebrow={label} title={`Kuis ${label}`} description={`Tersedia ${adapter.getQuestions().filter((q) => category === "mixed" || q.category === category).length} soal untuk kategori ini.`} />
        <Card className="max-w-xl">
          <div className="space-y-4">
            <Select label="Tingkat kesulitan" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}>
              <option value="all">Semua tingkat</option><option value="easy">Mudah</option><option value="normal">Normal</option><option value="hard">Sulit</option>
            </Select>
            <Select label="Jumlah soal" value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))}>
              {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} soal</option>)}
            </Select>
            <p className="text-sm text-slate-600">Paket soal yang tersedia: <strong>{pool.length}</strong>. Sistem akan membuat paket dari soal dengan status publikasi aktif.</p>
            <button onClick={begin} disabled={pool.length === 0} className={`${buttonStyles("primary")} w-full`}>Mulai kuis <ArrowRight className="h-4 w-4" /></button>
            {pool.length === 0 && <p className="text-sm text-red-ink">Belum ada soal yang cocok dengan pengaturan ini. Coba ubah filter.</p>}
          </div>
        </Card>
      </div>
    );
  }

  const question = pool[current];
  if (!question) return null;
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link href="/quiz" className="text-sm font-bold text-red-ink hover:underline">← Keluar kuis</Link>
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Timer className="h-4 w-4" /> Soal {current + 1} dari {pool.length}</span>
      </div>
      <ProgressBar value={Math.round(((current + 1) / pool.length) * 100)} color="navy" />
      <Card className="mt-6">
        <p className="text-lg font-bold text-navy">{question.prompt}</p>
        <div className="mt-5 space-y-2.5">
          {question.options.map((option, i) => (
            <button key={i} onClick={() => setChoices((prev) => prev.map((c, idx) => idx === current ? i : c))}
              className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${choices[current] === i ? "border-red bg-red/5 text-red-ink" : "border-navy/10 bg-white hover:border-navy/30"}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${choices[current] === i ? "bg-red text-white" : "bg-navy/5 text-navy"}`}>{String.fromCharCode(65 + i)}</span>{option}
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className={buttonStyles("outline", "sm")}>Sebelumnya</button>
            <button onClick={() => setFlagged((f) => f.includes(current) ? f.filter((n) => n !== current) : [...f, current])} className={buttonStyles("outline", "sm")}><Flag className={`h-4 w-4 ${flagged.includes(current) ? "fill-gold text-gold" : ""}`} /> Tandai</button>
          </div>
          {current < pool.length - 1
            ? <button onClick={() => setCurrent((c) => c + 1)} className={buttonStyles("primary", "sm")}>Berikutnya</button>
            : <button onClick={() => setConfirmOpen(true)} className={buttonStyles("primary", "sm")}>Selesaikan kuis</button>}
        </div>
        {flagged.length > 0 && <p className="mt-3 text-xs text-slate-600">{flagged.length} soal ditandai untuk ditinjau.</p>}
      </Card>
      <Modal open={confirmOpen} title="Kirim jawaban?" onClose={() => setConfirmOpen(false)}>
        <p className="text-sm text-slate-600">Kamu telah menjawab {choices.filter((c) => c >= 0).length} dari {pool.length} soal. Setelah dikirim, jawaban tidak bisa diubah.</p>
        <div className="mt-5 flex justify-end gap-2"><button onClick={() => setConfirmOpen(false)} className={buttonStyles("outline", "sm")}>Periksa lagi</button><button onClick={submit} className={buttonStyles("primary", "sm")}>Kirim jawaban</button></div>
      </Modal>
    </div>
  );
}
