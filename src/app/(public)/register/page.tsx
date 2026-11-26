"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/app/providers";
import { AuthCard, AuthFooter } from "@/components/auth/AuthCard";
import { Button, ErrorState, Input } from "@/components/ui/Primitives";

export default function RegisterPage() {
  const { adapter, hydrated } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Nama lengkap wajib diisi.";
    if (!form.username.trim()) next.username = "Username wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email tidak valid.";
    if (form.password.length < 8) next.password = "Kata sandi minimal 8 karakter.";
    if (form.password !== form.confirm) next.confirm = "Konfirmasi kata sandi tidak cocok.";
    setErrors(next);
    setGeneralError("");
    if (Object.keys(next).length > 0) return;

    const result = adapter.register({ fullName: form.fullName, username: form.username, email: form.email, password: form.password });
    if (!result.ok) { setGeneralError(result.error ?? "Gagal mendaftar."); return; }
    router.push("/onboarding");
  }

  return (
    <AuthCard title="Buat akun gratis" subtitle="Mulai belajar bahasa Jepang dari hari ini."
      footer={<AuthFooter prompt="Sudah punya akun?" href="/login" label="Masuk" />}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {generalError && <ErrorState message={generalError} />}
        <Input label="Nama lengkap" name="fullName" autoComplete="name" placeholder="Nama kamu" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} error={errors.fullName} required />
        <Input label="Username" name="username" autoComplete="username" placeholder="username_unik" value={form.username} onChange={(e) => update("username", e.target.value)} error={errors.username} required />
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} required />
        <Input label="Kata sandi" name="password" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" value={form.password} onChange={(e) => update("password", e.target.value)} error={errors.password} hint="Gunakan kombinasi huruf dan angka." required />
        <Input label="Konfirmasi kata sandi" name="confirm" type="password" autoComplete="new-password" placeholder="Ulangi kata sandi" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} error={errors.confirm} required />
        <Button type="submit" className="w-full" disabled={!hydrated}>Daftar & Lanjutkan</Button>
      </form>
    </AuthCard>
  );
}
