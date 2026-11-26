"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  Award, BarChart3, BookOpen, ChevronLeft, ChevronRight, FileText,
  GraduationCap, Home, LayoutDashboard, Library, Menu, PencilLine,
  Settings, Shield, Sparkles, Trophy, User, X,
} from "lucide-react";
import { useApp } from "@/app/providers";
import { Logo } from "./Navbar";

const navGroups = [
  { title: "Utama", items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Belajar", items: [
      { href: "/learning/hiragana", label: "Hiragana", icon: BookOpen },
      { href: "/learning/katakana", label: "Katakana", icon: BookOpen },
      { href: "/learning/kanji", label: "Kanji", icon: Library },
      { href: "/learning/bushu", label: "Bushu", icon: Sparkles },
      { href: "/learning/composition", label: "Komposisi Kanji", icon: Sparkles },
      { href: "/learning/writing", label: "Latihan Menulis", icon: PencilLine },
    ],
  },
  {
    title: "Latihan & Ujian", items: [
      { href: "/quiz", label: "Pusat Kuis", icon: FileText },
      { href: "/exams", label: "Pusat Ujian", icon: GraduationCap },
    ],
  },
  {
    title: "Progres", items: [
      { href: "/progress", label: "Statistik", icon: BarChart3 },
      { href: "/progress#achievements", label: "Pencapaian", icon: Trophy },
      { href: "/progress#review", label: "Jadwal Ulang", icon: Award },
    ],
  },
  { title: "Akun", items: [{ href: "/profile", label: "Profil & Preferensi", icon: Settings }] },
];

const mobileNav = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/learning/hiragana", label: "Belajar", icon: BookOpen },
  { href: "/quiz", label: "Kuis", icon: FileText },
  { href: "/progress", label: "Progres", icon: BarChart3 },
  { href: "/profile", label: "Profil", icon: User },
];

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useApp();
  return (
    <>
      <div className={`flex h-[72px] items-center border-b border-white/10 ${collapsed ? "justify-center px-2" : "px-5"}`}>
        {collapsed ? <Link href="/" className="jp-serif flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white" aria-label="Nihongo Academy">日</Link> : <Logo light />}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Navigasi aplikasi">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/80">{group.title}</p>}
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
                return (
                  <Link key={href} href={href} onClick={onNavigate} title={collapsed ? label : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"} ${collapsed ? "justify-center" : ""}`}
                    aria-current={active ? "page" : undefined}>
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {user?.role === "admin" && (
          <div className="mb-5">
            {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/80">Admin</p>}
            <Link href="/admin" onClick={onNavigate} title={collapsed ? "Admin" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith("/admin") ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"} ${collapsed ? "justify-center" : ""}`}>
              <Shield className="h-5 w-5 shrink-0" />{!collapsed && <span>Dashboard Admin</span>}
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { adapter, user } = useApp();

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-navy transition-all duration-300 lg:flex ${collapsed ? "w-[76px]" : "w-[260px]"}`}>
        <SidebarContent collapsed={collapsed} />
        <button onClick={() => setCollapsed((v) => !v)} className="m-3 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm text-white/80 hover:bg-white/20" aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}>
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <><ChevronLeft className="h-5 w-5" /> Ciutkan</>}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="flex h-full w-[270px] flex-col bg-navy" onClick={(e) => e.stopPropagation()}>
            <button className="absolute right-3 top-5 rounded-lg p-2 text-white" onClick={() => setMobileOpen(false)} aria-label="Tutup menu"><X className="h-5 w-5" /></button>
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy/10 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 text-navy lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Buka menu navigasi"><Menu className="h-6 w-6" /></button>
          <div className="hidden text-sm font-medium text-slate-600 lg:block">Nihongo Academy / {pathname.split("/").filter(Boolean).join(" / ")}</div>
          <div className="flex items-center gap-3">
            <span className="hidden jp text-sm text-slate-600 sm:block">日本語を学ぼう</span>
            {user && <button onClick={() => { adapter.logout(); router.push("/"); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-navy/5 hover:text-red-ink" aria-label="Keluar dari akun"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Keluar</span></button>}
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[68px] items-center justify-around border-t border-navy/10 bg-white/95 backdrop-blur lg:hidden" aria-label="Navigasi bawah">
        {mobileNav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold ${active ? "text-red-ink" : "text-slate-600"}`} aria-current={active ? "page" : undefined}>
              <Icon className="h-5 w-5" /><span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
