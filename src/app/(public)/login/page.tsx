"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "@/app/providers";
import { AuthCard, AuthFooter } from "@/components/auth/AuthCard";
import { Button, ErrorState, Input } from "@/components/ui/Primitives";

export default function LoginPage() {
  const { adapter, hydrated } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = adapter.login(email, password, remember);
    setLoading(false);
    if (!result.ok || !result.data) { setError(result.error ?? "Gagal masuk."); return; }
    router.push(result.data.onboardingComplete ? "/dashboard" : "/onboarding");
  }

  return (
    <AuthCard title="Selamat datang kembali" subtitle="Lanjutkan perjalanan belajar bahasa Jepangmu."
      footer={<AuthFooter prompt="Belum punya akun?" href="/register" label="Daftar gratis" />}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <ErrorState message={error} />}
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div>
          <Input label="Kata sandi" name="password" type={show ? "text" : "password"} autoComplete="current-password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShow((v) => !v)} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo hover:underline" aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{show ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#d94250]" /> Ingat saya</label>
          <Link href="/forgot-password" className="text-sm font-semibold text-red-ink hover:underline">Lupa kata sandi?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading || !hydrated}>{loading ? "Memeriksa..." : "Masuk"}</Button>
      </form>
      <div className="mt-6 rounded-xl bg-cream p-4 text-xs text-slate-600">
        <p className="font-bold text-navy">Akun demo untuk mencoba:</p>
        <p className="mt-1">Siswa: <code className="font-mono">demo@nihongo.ac.id</code> / <code className="font-mono">demo1234</code></p>
        <p>Admin: <code className="font-mono">admin@nihongo.ac.id</code> / <code className="font-mono">admin1234</code></p>
      </div>
    </AuthCard>
  );
}
