"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useApp } from "@/app/providers";
import { GRAMMAR } from "@/lib/data/seed/content";
import { Badge, Card, PageHeader, Tabs, buttonStyles } from "@/components/ui/Primitives";

const levels = ["Semua", "N5", "N4", "N3", "N2", "N1"];

export default function GrammarPage() {
  const { user, adapter, state } = useApp();
  const [level, setLevel] = useState("Semua");
  const [open, setOpen] = useState<string | null>(GRAMMAR[0]?.id ?? null);
  const lessons = GRAMMAR.filter((g) => level === "Semua" || g.jlpt === level);

  return (
    <div>
      <PageHeader eyebrow="Belajar" title="Pelajaran Grammar" description="Pola tata bahasa dari N5 hingga N1 dengan penjelasan bahasa Indonesia dan contoh kalimat." />
      <div className="mb-6"><Tabs tabs={levels} active={level} onChange={setLevel} /></div>
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const completed = state?.progress.some((p) => p.userId === user?.id && p.contentType === "grammar" && p.contentId === lesson.id && p.status === "mastered");
          const expanded = open === lesson.id;
          return (
            <Card key={lesson.id} className="p-0">
              <button onClick={() => setOpen(expanded ? null : lesson.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left" aria-expanded={expanded}>
                <div><div className="flex flex-wrap items-center gap-2"><Badge tone="navy">{lesson.jlpt}</Badge><span className="jp text-xl font-bold text-navy">{lesson.pattern}</span></div><p className="mt-2 font-bold">{lesson.title}</p><p className="mt-1 text-sm text-slate-600">{lesson.meaning}</p></div>
                <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              {expanded && (
                <div className="fade-up border-t border-navy/8 px-5 py-5">
                  <h3 className="text-sm font-bold text-navy">Penjelasan</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{lesson.explanation}</p>
                  <h3 className="mt-5 text-sm font-bold text-navy">Contoh</h3>
                  <div className="mt-2 rounded-xl bg-cream p-4">
                    <p className="jp text-xl font-bold text-navy">{lesson.example.jp}</p>
                    <p className="jp mt-1 text-sm text-indigo">{lesson.example.furigana}</p>
                    <p className="mt-1 text-sm text-slate-600">{lesson.example.romaji}</p>
                    <p className="mt-1 text-sm font-semibold text-red-ink">{lesson.example.meaning}</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {user && <button onClick={() => adapter.markLearned(user.id, "grammar", lesson.id, lesson.title)} className={buttonStyles("primary", "sm")}><CheckCircle2 className="h-4 w-4" /> {completed ? "Sudah selesai" : "Tandai selesai"}</button>}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
