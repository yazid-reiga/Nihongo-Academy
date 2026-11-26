"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useApp } from "@/app/providers";
import { RequireAuth } from "@/components/guards";
import { Button, Card, ProgressBar } from "@/components/ui/Primitives";

const abilities = ["Pemula total — belum pernah belajar", "Pernah belajar dasar", "Sudah menengah", "Sudah lanjut"];
const goals = [
  "Learn Japanese from Zero", "Prepare for JLPT", "Prepare for JFT-Basic",
  "Prepare for Work in Japan", "Prepare for Study in Japan", "Improve Daily Conversation",
];
const levels = ["N5", "N4", "N3", "N2", "N1"];
const times = ["5 menit", "10 menit", "15 menit", "30 menit", "60 menit"];

function StepOption({ value, active, onClick }: { value: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${active ? "border-red bg-red/5 text-red-ink" : "border-navy/10 bg-white text-slate-700 hover:border-navy/30"}`}>
      {value}{active && <Check className="h-4 w-4 shrink-0" />}
    </button>
  );
}

function OnboardingContent() {
  const { user, adapter, settings } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ ability: abilities[0], goal: goals[0], level: "N5", time: "15 menit", romaji: "always", furigana: "always", motion: false });

  function finish(skip = false) {
    if (!user) return;
    if (!skip) {
      adapter.updateUser(user.id, {
        learningLevel: values.level,
        learningGoal: values.goal,
        dailyGoalMinutes: parseInt(values.time, 10),
        onboardingComplete: true,
      });
      adapter.setSettings(user.id, {
        romajiMode: values.romaji as typeof settings.romajiMode,
        furiganaMode: values.furigana as typeof settings.furiganaMode,
        reducedMotion: values.motion,
      });
    } else {
      adapter.updateUser(user.id, { onboardingComplete: true });
    }
    router.push("/dashboard");
  }

  const total = 6;
  const questions = [
    { title: "Seberapa besar kemampuan bahasa Jepangmu saat ini?", options: abilities, field: "ability" as const },
    { title: "Apa tujuan utamamu belajar?", options: goals, field: "goal" as const },
    { title: "Level mana yang ingin kamu capai?", options: levels, field: "level" as const },
    { title: "Berapa lama kamu bisa belajar setiap hari?", options: times, field: "time" as const },
  ];
  const current = questions[step];

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gradient-to-br from-cream to-soft-blue/50 px-4 py-10">
      <Card className="w-full max-w-2xl p-7 sm:p-9">
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600"><span>LANGKAH {Math.min(step + 1, total)} DARI {total}</span><span>{Math.round((Math.min(step, total - 1) / (total - 1)) * 100)}%</span></div>
          <div className="mt-2"><ProgressBar value={Math.round((Math.min(step, total - 1) / (total - 1)) * 100)} color="navy" /></div>
        </div>

        {step < 4 && current && (
          <div className="fade-up">
            <h1 className="text-2xl font-bold">{current.title}</h1>
            <p className="mt-2 text-sm text-slate-600">Pilih satu yang paling sesuai. Kamu bisa mengubahnya nanti di pengaturan.</p>
            <div className="mt-6 space-y-2.5">
              {current.options.map((option) => <StepOption key={option} value={option} active={values[current.field] === option} onClick={() => setValues((v) => ({ ...v, [current.field]: option }))} />)}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-up">
            <h1 className="text-2xl font-bold">Preferensi tampilan</h1>
            <p className="mt-2 text-sm text-slate-600">Pengaturan ini berlaku di seluruh materi pelajaran.</p>
            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-2 text-sm font-bold text-navy">Tampilan Romaji</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[["always", "Selalu tampil"], ["after-answer", "Setelah menjawab"], ["hidden", "Sembunyikan"]].map(([value, label]) => <StepOption key={value} value={label} active={values.romaji === value} onClick={() => setValues((v) => ({ ...v, romaji: value }))} />)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-navy">Tampilan Furigana</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[["always", "Selalu tampil"], ["hover", "Saat disorong"], ["hidden", "Sembunyikan"]].map(([value, label]) => <StepOption key={value} value={label} active={values.furigana === value} onClick={() => setValues((v) => ({ ...v, furigana: value }))} />)}
                </div>
              </div>
              <StepOption value="Kurangi animasi (reduced motion)" active={values.motion} onClick={() => setValues((v) => ({ ...v, motion: !v.motion }))} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="fade-up text-center">
            <div className="text-5xl">🌸</div>
            <h1 className="mt-4 text-2xl font-bold">Siap untuk mulai?</h1>
            <p className="mt-2 text-sm text-slate-600">Targetmu: <strong>{values.goal}</strong> · Level <strong>{values.level}</strong> · {values.time}/hari.</p>
            <p className="mt-1 text-xs text-slate-600">Semua bisa diubah lagi lewat halaman Profil.</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-5">
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}><ArrowLeft className="h-4 w-4" /> Kembali</Button>}
            <Button variant="ghost" size="sm" onClick={() => finish(true)}>Lewati</Button>
          </div>
          {step < 5 ? <Button onClick={() => setStep((s) => s + 1)}>Lanjut <ArrowRight className="h-4 w-4" /></Button>
            : <Button onClick={() => finish(false)}>Selesai & Buka Dashboard <Check className="h-4 w-4" /></Button>}
        </div>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return <RequireAuth><OnboardingContent /></RequireAuth>;
}
