"use client";

import { useApp } from "@/app/providers";
import { Badge, Card, EmptyState, PageHeader, ProgressBar, Skeleton, buttonStyles } from "@/components/ui/Primitives";
import { Award, BarChart3, CheckCircle2, Clock3, Trophy } from "lucide-react";

export default function ProgressPage() {
  const { user, adapter, hydrated } = useApp();
  if (!hydrated || !user) return <Skeleton variant="page" />;

  const attempts = adapter.getQuizAttempts(user.id);
  const activities = adapter.getActivities(user.id);
  const reviews = adapter.getReviews(user.id).sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
  const achievements = adapter.getAchievements(user.id);
  const xp = adapter.getXp(user.id);
  const streak = adapter.getStreak(user.id);
  const progress = adapter.getAllProgress(user.id);

  const wrongCounts = new Map<string, number>();
  attempts.forEach((attempt) => attempt.answers.forEach((answer) => {
    if (!answer.correct) wrongCounts.set(answer.questionId, (wrongCounts.get(answer.questionId) ?? 0) + 1);
  }));
  const weakQuestions = [...wrongCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ question: adapter.getQuestions().find((q) => q.id === id), count }))
    .filter((entry) => entry.question)
    .slice(0, 5);

  return (
    <div>
      <PageHeader eyebrow="Progress" title="Statistik & Pencapaian" description="Semua angka di sini berasal dari aktivitas dan hasil kuis yang tersimpan, bukan data contoh." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><p className="text-xs text-slate-600">Total XP</p><p className="mt-2 text-3xl font-extrabold text-navy">{xp}</p></Card>
        <Card><p className="text-xs text-slate-600">Streak saat ini</p><p className="mt-2 text-3xl font-extrabold text-red-ink">{streak.current} hari</p></Card>
        <Card><p className="text-xs text-slate-600">Aktivitas</p><p className="mt-2 text-3xl font-extrabold text-indigo">{activities.length}</p></Card>
        <Card><p className="text-xs text-slate-600">Materi dikuasai</p><p className="mt-2 text-3xl font-extrabold text-success">{progress.filter((p) => p.status === "mastered").length}</p></Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card id="achievements">
          <div className="flex items-center gap-2"><Trophy className="h-5 w-5 text-gold" /><h2 className="text-lg font-bold">Pencapaian</h2></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {achievements.map(({ achievement, unlockedAt }) => (
              <div key={achievement.code} className={`rounded-xl border p-3 ${unlockedAt ? "border-gold/40 bg-gold/5" : "border-navy/8 bg-slate-50 opacity-70"}`}>
                <div className="flex items-center gap-2"><span className="text-xl" aria-hidden="true">{achievement.icon}</span><p className="text-sm font-bold text-navy">{achievement.title}</p></div>
                <p className="mt-1 text-xs text-slate-600">{achievement.description}</p>
                {unlockedAt && <p className="mt-2 text-[10px] font-bold text-success">✓ Diraih {new Date(unlockedAt).toLocaleDateString("id-ID")}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Card id="review">
          <div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-indigo" /><h2 className="text-lg font-bold">Jadwal pengulangan</h2></div>
          {reviews.length === 0 ? (
            <div className="mt-4"><EmptyState icon="📅" title="Belum ada jadwal" description="Jadwal muncul setelah kamu menandai materi sulit atau menyelesaikan latihan menulis." /></div>
          ) : (
            <ul className="mt-4 space-y-2">
              {reviews.map((review) => (
                <li key={`${review.contentType}-${review.contentId}`} className="flex items-center justify-between gap-3 rounded-xl bg-cream px-3 py-2.5">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-navy">{review.contentId}</p><p className="text-[11px] text-slate-600">Benar {review.correctCount} · salah {review.incorrectCount}</p></div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] text-slate-600">{new Date(review.nextReviewAt) <= new Date() ? "Jatuh tempo" : new Date(review.nextReviewAt).toLocaleDateString("id-ID")}</span>
                    <button onClick={() => adapter.recordReview(user.id, review.contentType, review.contentId, 3, `Review ${review.contentId}`)} className={buttonStyles("outline", "sm")}>Ulangi</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-red-ink" /><h2 className="text-lg font-bold">Riwayat kuis</h2></div>
          {attempts.length === 0 ? (
            <div className="mt-4"><EmptyState icon="📝" title="Belum ada riwayat" description="Selesaikan satu kuis untuk melihat skor dan waktu pengerjaannya di sini." action={<a href="/quiz" className={buttonStyles("primary", "sm")}>Ambil kuis</a>} /></div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-600"><tr><th className="pb-2">Kategori</th><th>Skor</th><th>Benar</th><th>Waktu</th></tr></thead>
                <tbody>{attempts.slice().reverse().map((attempt) => <tr key={attempt.id} className="border-t border-navy/5"><td className="py-2 font-semibold capitalize">{attempt.category}</td><td className="font-bold text-red-ink">{attempt.score}%</td><td>{attempt.correctCount}/{attempt.totalQuestions}</td><td>{attempt.durationSeconds}s</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2"><Award className="h-5 w-5 text-gold" /><h2 className="text-lg font-bold">Analisis kelemahan</h2></div>
          {weakQuestions.length === 0 ? (
            <div className="mt-4"><EmptyState icon="💪" title="Belum ada data" description="Analisis muncul setelah kamu mengerjakan kuis dan memiliki jawaban salah." /></div>
          ) : (
            <div className="mt-4 space-y-4">
              {weakQuestions.map(({ question, count }) => (
                <div key={question!.id}>
                  <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-navy">{question!.prompt}</p><Badge tone="red">{count}× salah</Badge></div>
                  <div className="mt-2"><ProgressBar value={Math.min(100, count * 25)} color="red" /></div>
                  <p className="mt-1 text-xs text-slate-600">{question!.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
