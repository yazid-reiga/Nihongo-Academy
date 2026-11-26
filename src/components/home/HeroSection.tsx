"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useApp } from "@/app/providers";
import { Sakura } from "./Sakura";
import { buttonStyles } from "@/lib/styles";

export function HeroSection() {
  const { user } = useApp();

  return (
    <section id="beranda" className="hero-glow relative overflow-hidden scroll-mt-[72px]">
      <Sakura count={16} />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-sakura/15 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">
            <Sparkles className="h-4 w-4" /> Platform Pembelajaran Bahasa Jepang
          </span>
          <h1 className="text-balance mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Belajar Bahasa Jepang,<br /><span className="text-gold">Mulai dari Satu Langkah Kecil.</span>
          </h1>
          <p className="jp-serif mt-5 inline-block rounded-xl bg-navy px-4 py-2 text-xl font-bold text-sakura sm:text-2xl">一歩ずつ、日本語を学ぼう</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
            Pelajari Hiragana, Katakana, Kanji, Kosakata, hingga persiapan ujian bahasa Jepang melalui satu platform pembelajaran yang interaktif dan terstruktur.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={user ? "/dashboard" : "/register"} className={buttonStyles("primary", "lg")}>Mulai Belajar <ArrowRight className="h-5 w-5" /></Link>
            <Link href="/#materi" className={`${buttonStyles("outline", "lg")} border-white/40 !bg-white/10 !text-white hover:!bg-white/20`}><BookOpen className="h-4 w-4" /> Jelajahi Materi</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/85">
            <span>✦ Materi N5–N1</span><span>✦ Antarmuka Bahasa Indonesia</span><span>✦ Cocok untuk pemula</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-b from-[#f6dfe4] via-[#f9eddb] to-[#dfe7f2] shadow-2xl sm:h-[460px]">
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#f3cdd7] to-transparent" />
            <div className="absolute right-10 top-8 h-14 w-14 rounded-full bg-gold/70 blur-[2px]" />

            {/* Gunung Fuji */}
            <div className="absolute bottom-14 left-1/2 h-52 w-[22rem] -translate-x-1/2">
              <div className="absolute inset-0 bg-indigo/85" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              <div className="absolute left-1/2 top-0 h-16 w-28 -translate-x-1/2 bg-white/95" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              <div className="absolute bottom-0 left-1/2 h-20 w-[26rem] -translate-x-1/2 rounded-t-full bg-navy/25" />
            </div>

            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-navy/45 to-transparent" />

            {/* Floating learning cards */}
            <div className="float-card absolute left-5 top-8 rounded-2xl bg-white/95 px-4 py-3 shadow-xl" style={{ ["--rot" as string]: "-6deg", animationDuration: "7s" }}>
              <p className="jp text-3xl font-bold text-red-ink">あ</p><p className="text-xs font-semibold text-slate-700">a · Hiragana</p>
            </div>
            <div className="float-card absolute right-5 top-20 rounded-2xl bg-white/95 px-4 py-3 shadow-xl" style={{ ["--rot" as string]: "5deg", animationDuration: "9s", animationDelay: "1s" }}>
              <p className="jp text-3xl font-bold text-navy">漢</p><p className="text-xs font-semibold text-slate-700">Kanji</p>
            </div>
            <div className="float-card absolute bottom-6 right-5 w-48 rounded-2xl bg-white/95 p-4 shadow-xl" style={{ animationDuration: "8s", animationDelay: "0.5s" }}>
              <p className="text-xs font-bold text-slate-700">Contoh Kartu Belajar</p>
              <p className="jp mt-2 text-3xl font-bold text-navy">水</p>
              <p className="text-xs text-slate-700">Mizu / Sui — Air</p>
            </div>
            <span className="absolute left-10 top-1/2 text-3xl opacity-80" aria-hidden="true">🌸</span>
            <span className="absolute right-12 top-1/3 text-2xl opacity-80" aria-hidden="true">🌸</span>
          </div>
        </div>
      </div>
    </section>
  );
}
