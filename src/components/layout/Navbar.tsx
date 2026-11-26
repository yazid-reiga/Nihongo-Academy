"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/app/providers";
import { buttonStyles } from "@/lib/styles";

const links = [
  { id: "beranda", label: "Beranda" },
  { id: "materi", label: "Materi Pembelajaran" },
  { id: "jalur", label: "Jalur Belajar" },
  { id: "ujian", label: "Persiapan Ujian" },
  { id: "tentang", label: "Tentang Kami" },
];

function useActiveSection(enabled: boolean): string {
  const [active, setActive] = useState("beranda");
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className={`jp-serif flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${light ? "bg-white/15 text-white" : "bg-navy text-white"}`}>日</span>
      <span className="leading-tight">
        <span className={`block text-sm font-extrabold tracking-tight ${light ? "text-white" : "text-navy"}`}>NIHONGO ACADEMY</span>
        <span className={`block text-[10px] font-medium ${light ? "text-white/80" : "text-slate-600"}`}>一歩ずつ、日本語を学ぼう</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, hydrated } = useApp();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);

  return (
    <header className="sticky top-0 z-40 border-b border-softgray bg-white/95 backdrop-blur-lg">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Navigasi utama">
        <Logo />
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive = isHome && active === link.id;
            return (
              <Link key={link.id} href={`/#${link.id}`} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-navy/5 text-red-ink" : "text-slate-700 hover:bg-navy/5 hover:text-navy"}`} aria-current={isActive ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          {!hydrated ? <div className="h-11 w-28 animate-pulse rounded-xl bg-navy/10" />
            : user ? <Link href="/dashboard" className={buttonStyles("primary", "sm")}>Dashboard</Link>
            : <Link href="/register" className={buttonStyles("primary", "sm")}>Mulai Belajar</Link>}
        </div>
        <button className="rounded-lg p-2.5 text-navy lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-softgray bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.id} href={`/#${link.id}`} onClick={() => setOpen(false)} className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${isHome && active === link.id ? "bg-navy/5 text-red-ink" : "text-slate-700 hover:bg-cream"}`}>
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className={buttonStyles("outline", "sm")}>Masuk</Link>
              <Link href={user ? "/dashboard" : "/register"} onClick={() => setOpen(false)} className={buttonStyles("primary", "sm")}>{user ? "Dashboard" : "Mulai Belajar"}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
