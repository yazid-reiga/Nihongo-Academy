"use client";

import Link from "next/link";
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3,
  FileText, Flame, GraduationCap, Library, Play, Sparkles, Star, Trophy,
} from "lucide-react";
import { useApp } from "@/app/providers";
import { HIRAGANA, KATAKANA } from "@/lib/data/seed/kana";
import { KANJI } from "@/lib/data/seed/kanji";
import { VOCABULARY, GRAMMAR } from "@/lib/data/seed/content";
import { buttonStyles, Card, EmptyState, PageHeader, ProgressBar, Skeleton } from "@/components/ui/Primitives";

export default function DashboardPage() {
  const { user, adapter, hydrated } = useApp();
  if (!hydrated || !user) return <Skeleton variant="page" />;

  const state = adapter.getState();
  const progress = adapter.getAllProgress(user.id);
  const activities = adapter.getActivities(user.id);
  const reviews = adapter.getReviews(user.id).filter((r) => new Date(r.nextReviewAt) <= new Date());
  const xp = adapter.getXp(user.id);
  const streak = adapter.getStreak(user.id);
  const attempts = adapter.getQuizAttempts(user.id);
  const masteredKana = progress.filter((p) => p.contentType.startsWith("kana") && p.status === "mastered").length;
  const masteredKanji = progress.filter((p) => p.contentType === "kanji" && p.status === "mastered").length;
  const masteredVocab = progress.filter((p) => p.contentType === "vocabulary" && p.status === "mastered").length;
  const masteredGrammar = progress.filter((p) => p.contentType === "grammar" && p.status === "mastered").length;
  const totalContent = HIRAGANA.length + KATAKANA.length + KANJI.length + VOCABULARY.length + GRAMMAR.length;
  const percent = Math.round((progress.filter((p) => p.status === "mastered").length / totalContent) * 100);
  const nextLesson = progress.find((p) => p.status !== "mastered") ?? null;
  const continueHref = nextLesson
    ? nextLesson.contentType.startsWith("kana")
      ? `/learning/${nextLesson.contentType === "kana-hiragana" ? "hiragana" : "katakana"}/${nextLesson.contentId}`
      : nextLesson.contentType === "kanji" ? `/learning/kanji/${nextLesson.contentId}` : "/learning/hiragana"
    : "/learning/hiragana";
  const unlockedCount = state.unlocked.filter((u) => u.startsWith(`${user.id}:`)).length;

  const stats = [
    { label: "Kana dikuasai", value: `${masteredKana}/${HIRAGANA.length + KATAKANA.length}`, icon: BookOpen, tone: "bg-sakura-light text-red-ink" },
    { label: "Kanji dikuasai", value: `${masteredKanji}/${KANJI.length}`, icon: Library, tone: "bg-soft-blue text-indigo" },
    { label: "Kosakata dikuasai", value: `${masteredVocab}/${VOCABULARY.length}`, icon: Sparkles, tone: "bg-soft-yellow text-[#8a6420]" },
    { label: "Grammar selesai", value: `${masteredGrammar}/${GRAMMAR.length}`, icon: FileText, tone: "bg-soft-purple text-[#63458e]" },
    { label: "Kuis selesai", value: attempts.length, icon: CheckCircle2, tone: "bg-soft-green text-success" },
    { label: "Ujian selesai", value: 0, icon: GraduationCap, tone: "bg-soft-orange text-[#9a5426]" },
  ];

  return (
    <div>
      <PageHeader eyebrow="Dashboard" title={`Halo, ${user.fullName}! 👋`} description="Semua progres di halaman ini dihitung dari aktivitas yang benar-benar kamu lakukan." action={<Link href="/learning/hiragana" className={buttonStyles("primary")}><Play className="h-4 w-4" /> Lanjut belajar</Link>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-navy to-indigo text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">Level belajar</p>
          <p className="jp mt-3 text-4xl font-extrabold text-gold">{user.learningLevel}</p>
          <p className="mt-2 text-xs text-white/85">{user.learningGoal || "Target belum diatur"}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Total XP</p><Star className="h-5 w-5 text-gold" /></div>
          <p className="mt-3 text-4xl font-extrabold text-navy">{xp}</p>
          <p className="mt-2 text-xs text-slate-600">Dari {activities.length} aktivitas tervalidasi</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Streak harian</p><Flame className="h-5 w-5 text-red-ink" /></div>
          <p className="mt-3 text-4xl font-extrabold text-navy">{streak.current} <span className="text-base font-semibold text-slate-600">hari</span></p>
          <p className="mt-2 text-xs text-slate-600">Terbaik: {streak.longest} hari</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Pencapaian</p><Trophy className="h-5 w-5 text-gold" /></div>
          <p className="mt-3 text-4xl font-extrabold text-navy">{unlockedCount}</p>
          <Link href="/progress#achievements" className="mt-2 inline-block text-xs font-bold text-red-ink hover:underline">Lihat pencapaian →</Link>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Progres belajar</h2><span className="text-sm font-bold text-red-ink">{percent}%</span></div>
            <div className="mt-4"><ProgressBar value={percent} color="red" label="Penyelesaian seluruh materi" /></div>
            <p className="mt-3 text-xs text-slate-600">{progress.filter((p) => p.status === "mastered").length} dari {totalContent} materi dikuasai.</p>
          </Card>

          <Card>
            <h2 className="text-lg font-bold">Statistik belajar</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-navy/8 p-3">
                  <span className={`rounded-lg p-2 ${stat.tone}`}><stat.icon className="h-5 w-5" /></span>
                  <div><p className="text-lg font-extrabold text-navy">{stat.value}</p><p className="text-[11px] text-slate-600">{stat.label}</p></div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold">Lanjutkan belajar</h2>
            <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl bg-cream p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="jp flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl font-bold text-red-ink ring-1 ring-navy/10">{nextLesson ? "続" : "あ"}</span>
                <div><p className="font-bold text-navy">{nextLesson ? "Lanjutkan materi terakhir" : "Mulai dari Hiragana"}</p><p className="text-sm text-slate-600">{nextLesson ? `Status: ${nextLesson.status.replace("_", " ")}` : "Pelajaran pertama menunggumu."}</p></div>
              </div>
              <Link href={continueHref} className={buttonStyles("primary", "sm")}>Buka pelajaran <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-red-ink" /><h2 className="text-lg font-bold">Review hari ini</h2></div>
            {reviews.length === 0 ? (
              <div className="mt-4"><EmptyState icon="✨" title="Semua sudah tertata" description="Belum ada materi yang jatuh tempo untuk diulang. Materi yang sulit akan muncul di sini." /></div>
            ) : (
              <ul className="mt-4 space-y-2">
                {reviews.slice(0, 5).map((review) => (
                  <li key={`${review.contentType}-${review.contentId}`} className="flex items-center justify-between gap-2 rounded-xl bg-cream px-3 py-2.5">
                    <span className="truncate text-sm font-medium text-navy">{review.contentId}</span>
                    <Link href="/progress#review" className="shrink-0 text-xs font-bold text-red-ink hover:underline">Ulangi</Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-indigo" /><h2 className="text-lg font-bold">Aktivitas terbaru</h2></div>
            {activities.length === 0 ? (
              <div className="mt-4"><EmptyState icon="🌱" title="Belum ada aktivitas" description="Mulai pelajaran pertama untuk melihat riwayat belajarmu di sini." action={<Link href="/learning/hiragana" className={buttonStyles("primary", "sm")}>Mulai belajar</Link>} /></div>
            ) : (
              <ul className="mt-4 space-y-3">
                {activities.slice(-6).reverse().map((activity) => (
                  <li key={activity.id} className="flex items-start justify-between gap-3 border-b border-navy/5 pb-2.5 last:border-0">
                    <div><p className="text-sm font-medium text-navy">{activity.label.startsWith("mastery:") ? `Menguasai ${activity.label.split(":")[2]}` : activity.label.startsWith("quiz:") ? "Menyelesaikan kuis" : activity.label}</p><p className="text-[11px] text-slate-600">{new Date(activity.at).toLocaleString("id-ID")}</p></div>
                    {activity.xp > 0 && <span className="shrink-0 text-xs font-bold text-gold">+{activity.xp} XP</span>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
