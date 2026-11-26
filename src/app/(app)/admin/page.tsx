"use client";

import Link from "next/link";
import { FileText, Library, Shield, Sparkles, Users } from "lucide-react";
import { useApp } from "@/app/providers";
import { RequireAdmin } from "@/components/guards";
import { Badge, Card, PageHeader, Skeleton, buttonStyles } from "@/components/ui/Primitives";
import { KANJI } from "@/lib/data/seed/kanji";
import { VOCABULARY, GRAMMAR } from "@/lib/data/seed/content";
import { HIRAGANA, KATAKANA } from "@/lib/data/seed/kana";

function AdminOverview() {
  const { adapter, state } = useApp();
  if (!state) return <Skeleton variant="page" />;
  const users = adapter.getUsers();
  const activeUsers = new Set(state.activities.map((a) => a.userId)).size;
  const cards = [
    { label: "Total pengguna", value: users.length, icon: Users, tone: "bg-soft-blue text-indigo" },
    { label: "Pengguna aktif", value: activeUsers, icon: Users, tone: "bg-soft-green text-success" },
    { label: "Materi Kanji", value: KANJI.length, icon: Library, tone: "bg-soft-yellow text-[#8a6420]" },
    { label: "Kosakata", value: VOCABULARY.length, icon: Sparkles, tone: "bg-soft-purple text-[#63458e]" },
    { label: "Soal kuis", value: state.questions.length, icon: FileText, tone: "bg-red/10 text-red-ink" },
    { label: "Paket konten", value: state.content.length, icon: Shield, tone: "bg-navy/5 text-navy" },
  ];
  return (
    <div>
      <PageHeader eyebrow="Admin" title="Dashboard Admin" description="Ringkasan data dari lokal adapter. Akses hanya untuk peran admin." action={<Badge tone="red">Peran: admin</Badge>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => <Card key={card.label} className="flex items-center gap-4"><span className={`rounded-xl p-3 ${card.tone}`}><card.icon className="h-6 w-6" /></span><div><p className="text-2xl font-extrabold text-navy">{card.value}</p><p className="text-xs text-slate-600">{card.label}</p></div></Card>)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card><h2 className="text-lg font-bold">Manajemen konten</h2><p className="mt-2 text-sm text-slate-600">Kelola materi dengan alur Draft → Review → Approved → Published.</p><Link href="/admin/content" className={`${buttonStyles("primary", "sm")} mt-4`}>Buka pengelola konten</Link></Card>
        <Card><h2 className="text-lg font-bold">Manajemen soal</h2><p className="mt-2 text-sm text-slate-600">Buat, sunting, dan tentukan status publikasi soal kuis.</p><Link href="/admin/questions" className={`${buttonStyles("outline", "sm")} mt-4`}>Buka pengelola soal</Link></Card>
      </div>
      <div className="mt-6"><Card><h2 className="text-lg font-bold">Ringkasan katalog</h2><p className="mt-2 text-sm text-slate-600">Hiragana: {HIRAGANA.length} · Katakana: {KATAKANA.length} · Kanji: {KANJI.length} · Grammar: {GRAMMAR.length} · Kosakata: {VOCABULARY.length}</p></Card></div>
    </div>
  );
}

export default function AdminPage() {
  return <RequireAdmin><AdminOverview /></RequireAdmin>;
}
