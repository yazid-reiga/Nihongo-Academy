import Link from "next/link";
import { Logo } from "@/components/layout/Navbar";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-soft-blue/60 px-4 py-12">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-sakura/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
      <div className="fade-up relative z-10 w-full max-w-lg rounded-3xl border border-navy/10 bg-white p-7 card-shadow sm:p-9">
        <div className="mb-7 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-7 text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        </div>
        {children}
        {footer && <div className="mt-6 border-t border-navy/10 pt-5 text-center text-sm text-slate-600">{footer}</div>}
        <p className="mt-6 text-center text-[11px] text-slate-400">Mode lokal: data disimpan di browser ini. Bukan sistem autentikasi produksi.</p>
      </div>
    </div>
  );
}

export function AuthFooter({ prompt, href, label }: { prompt: string; href: string; label: string }) {
  return <>{prompt} <Link href={href} className="font-bold text-red-ink hover:underline">{label}</Link></>;
}
