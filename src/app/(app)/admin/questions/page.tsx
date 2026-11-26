"use client";

import { useState } from "react";
import { useApp } from "@/app/providers";
import { RequireAdmin } from "@/components/guards";
import { Badge, Button, Card, Input, PageHeader, Select, buttonStyles } from "@/components/ui/Primitives";
import { QUIZ_CATEGORIES } from "@/components/quiz/Quiz";
import type { Difficulty, QuizQuestion } from "@/lib/types";

function QuestionManager() {
  const { adapter, state } = useApp();
  const questions = state?.questions ?? [];
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [category, setCategory] = useState<QuizQuestion["category"]>("mixed");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  function save() {
    if (!prompt.trim() || options.some((o) => !o.trim()) || !explanation.trim()) {
      setError("Isi pertanyaan, semua pilihan, dan pembahasan."); return;
    }
    setError("");
    const question: QuizQuestion = {
      id: `q-custom-${Date.now().toString(36)}`, category, difficulty,
      prompt: prompt.trim(), options: options.map((o) => o.trim()), answerIndex,
      explanation: explanation.trim(), status: "draft",
    };
    adapter.saveQuestion(question);
    setPrompt(""); setOptions(["", "", "", ""]); setAnswerIndex(0); setExplanation("");
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Manajemen Soal" description="Buat soal kuis dengan kunci jawaban dan pembahasan. Soal baru berstatus draft sampai ditinjau." />
      <Card className="mb-6">
        <h2 className="text-lg font-bold">Buat soal baru</h2>
        {error && <p role="alert" className="mt-3 rounded-lg bg-red/10 p-3 text-sm text-red-ink">{error}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Input className="sm:col-span-3" label="Pertanyaan" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Contoh: Apa arti 水?" />
          {options.map((option, i) => <Input key={i} label={`Pilihan ${String.fromCharCode(65 + i)}`} value={option} onChange={(e) => setOptions((prev) => prev.map((o, idx) => idx === i ? e.target.value : o))} />)}
          <Select label="Kunci jawaban" value={answerIndex} onChange={(e) => setAnswerIndex(parseInt(e.target.value, 10))}>{options.map((_, i) => <option key={i} value={i}>{String.fromCharCode(65 + i)}</option>)}</Select>
          <Select label="Kategori" value={category} onChange={(e) => setCategory(e.target.value as QuizQuestion["category"])}>{QUIZ_CATEGORIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}</Select>
          <Select label="Kesulitan" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}><option value="easy">Mudah</option><option value="normal">Normal</option><option value="hard">Sulit</option></Select>
        </div>
        <div className="mt-3"><Input label="Pembahasan" value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Jelaskan mengapa jawaban itu benar" /></div>
        <div className="mt-4"><Button onClick={save}>Simpan sebagai draft</Button></div>
      </Card>
      <Card>
        <h2 className="text-lg font-bold">Bank soal ({questions.length})</h2>
        <div className="mt-4 space-y-2">
          {questions.slice(0, 40).map((question) => (
            <div key={question.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/8 p-3">
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{question.prompt}</p><p className="text-[11px] text-slate-600">{question.category} · {question.difficulty} · {question.options.length} pilihan</p></div>
              <div className="flex items-center gap-2">
                <Badge tone={question.status === "published" ? "green" : "slate"}>{question.status}</Badge>
                <select value={question.status} onChange={(e) => adapter.saveQuestion({ ...question, status: e.target.value as QuizQuestion["status"] })} className="min-h-10 rounded-lg border border-navy/15 px-2 text-xs" aria-label={`Status soal ${question.id}`}>
                  {["draft", "review", "approved", "published"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => adapter.deleteQuestion(question.id)} className={buttonStyles("danger", "sm")}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function AdminQuestionsPage() {
  return <RequireAdmin><QuestionManager /></RequireAdmin>;
}
