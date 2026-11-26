"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/app/providers";
import { Badge, Button, Card, Input, PageHeader, Select, Skeleton, buttonStyles } from "@/components/ui/Primitives";

export default function ProfilePage() {
  const { user, adapter, settings, hydrated } = useApp();
  const [saved, setSaved] = useState("");
  const [profile, setProfile] = useState({ fullName: "", username: "", email: "", learningLevel: "N5", learningGoal: "" });

  useEffect(() => {
    if (user) setProfile({ fullName: user.fullName, username: user.username, email: user.email, learningLevel: user.learningLevel, learningGoal: user.learningGoal });
  }, [user]);

  if (!hydrated || !user) return <Skeleton variant="page" />;

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    adapter.updateUser(user!.id, { fullName: profile.fullName, username: profile.username, learningLevel: profile.learningLevel, learningGoal: profile.learningGoal });
    setSaved("Profil berhasil disimpan.");
  }

  return (
    <div>
      <PageHeader eyebrow="Akun" title="Profil & Preferensi" description="Atur data pribadi dan preferensi tampilan materi. Perubahan disimpan di perangkat ini." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-4">
            <div className="jp flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-2xl font-bold text-white">日</div>
            <div><h2 className="text-lg font-bold">{user.fullName}</h2><p className="text-sm text-slate-600">@{user.username} · <Badge tone={user.role === "admin" ? "red" : "navy"}>{user.role}</Badge></p></div>
          </div>
          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            {saved && <p role="status" className="rounded-lg bg-success/10 p-3 text-sm text-success">{saved}</p>}
            <Input label="Nama lengkap" value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} />
            <Input label="Username" value={profile.username} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} />
            <Input label="Email" value={profile.email} disabled hint="Email tidak dapat diubah pada mode lokal." />
            <Select label="Level belajar" value={profile.learningLevel} onChange={(e) => setProfile((p) => ({ ...p, learningLevel: e.target.value }))}>{["N5", "N4", "N3", "N2", "N1"].map((l) => <option key={l}>{l}</option>)}</Select>
            <Select label="Tujuan belajar" value={profile.learningGoal} onChange={(e) => setProfile((p) => ({ ...p, learningGoal: e.target.value }))}>
              <option value="">Pilih tujuan</option>
              {["Learn Japanese from Zero", "Prepare for JLPT", "Prepare for JFT-Basic", "Prepare for Work in Japan", "Prepare for Study in Japan", "Improve Daily Conversation"].map((g) => <option key={g}>{g}</option>)}
            </Select>
            <Button type="submit">Simpan profil</Button>
          </form>
          <p className="mt-4 text-xs text-slate-600">Bergabung sejak {new Date(user.createdAt).toLocaleDateString("id-ID")} · Zona waktu {user.timezone}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Preferensi tampilan</h2>
          <p className="mt-1 text-sm text-slate-600">Pengaturan ini diterapkan secara konsisten pada kana, kanji, dan kuis.</p>
          <div className="mt-6 space-y-4">
            <Select label="Tampilan Romaji" value={settings.romajiMode} onChange={(e) => adapter.setSettings(user.id, { romajiMode: e.target.value as typeof settings.romajiMode })}>
              <option value="always">Selalu tampil</option><option value="after-answer">Setelah menjawab</option><option value="hidden">Sembunyikan</option>
            </Select>
            <Select label="Tampilan Furigana" value={settings.furiganaMode} onChange={(e) => adapter.setSettings(user.id, { furiganaMode: e.target.value as typeof settings.furiganaMode })}>
              <option value="always">Selalu tampil</option><option value="hover">Saat disorong</option><option value="hidden">Sembunyikan</option>
            </Select>
            <Select label="Target waktu belajar harian" value={settings.dailyGoalMinutes} onChange={(e) => adapter.setSettings(user.id, { dailyGoalMinutes: parseInt(e.target.value, 10) })}>
              {[5, 10, 15, 30, 60].map((n) => <option key={n} value={n}>{n} menit</option>)}
            </Select>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-navy/10 p-4 text-sm font-semibold">
              <span>Audio pelafalan (browser TTS)</span>
              <input type="checkbox" checked={settings.audioEnabled} onChange={(e) => adapter.setSettings(user.id, { audioEnabled: e.target.checked })} className="h-5 w-5 accent-[#d94250]" />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-navy/10 p-4 text-sm font-semibold">
              <span>Kurangi animasi (reduced motion)</span>
              <input type="checkbox" checked={settings.reducedMotion} onChange={(e) => adapter.setSettings(user.id, { reducedMotion: e.target.checked })} className="h-5 w-5 accent-[#d94250]" />
            </label>
          </div>
          <div className="mt-6 border-t border-navy/10 pt-5">
            <button onClick={() => { if (confirm("Hapus akun dan semua data lokalmu? Tindakan ini tidak dapat dibatalkan.")) { adapter.deleteAccount(user.id); window.location.href = "/"; } }} className={buttonStyles("danger", "sm")}>Hapus akun & data lokal</button>
            <p className="mt-2 text-xs text-slate-600">Pada mode lokal, penghapusan menghapus data aplikasi dari browser ini. Implementasi produksi perlu endpoint penghapusan resmi.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
