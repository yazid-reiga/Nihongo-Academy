"use client";

import Link from "next/link";
import { MailWarning } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button, ErrorState } from "@/components/ui/Primitives";

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Lupa kata sandi" subtitle="Kami bantu kamu masuk kembali ke akunmu."
      footer={<Link href="/login" className="font-bold text-red-ink hover:underline">Kembali ke halaman masuk</Link>}>
      <ErrorState message="Pada mode lokal ini, pengiriman tautan reset kata sandi melalui email belum tersedia karena belum terhubung ke layanan email. Untuk mencoba aplikasi, gunakan akun demo pada halaman masuk atau buat akun baru." />
      <div className="mt-5 rounded-xl bg-cream p-4 text-sm text-slate-600">
        <p className="flex items-center gap-2 font-bold text-navy"><MailWarning className="h-4 w-4" /> Akun demo</p>
        <p className="mt-2 font-mono text-xs">demo@nihongo.ac.id / demo1234</p>
        <p className="font-mono text-xs">admin@nihongo.ac.id / admin1234</p>
      </div>
      <Link href="/register" className="mt-5 block"><Button className="w-full">Buat akun baru</Button></Link>
    </AuthCard>
  );
}
