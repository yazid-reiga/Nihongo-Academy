"use client";

import Link from "next/link";
import {
  ArrowRight, BookOpen, FileText, Headphones,
  Library, PencilLine, Sparkles, Target, Trophy,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { Sakura } from "./Sakura";
import { Badge, SectionHeading } from "@/components/ui/Primitives";
import { buttonStyles } from "@/lib/styles";
import { EXAM_CATEGORIES } from "@/lib/data/seed/exams";

/* ---------------------------------- Statistics --------------------------------- */

export function StatisticsSection() {
  const items = [
    { value: "46", label: "Karakter dasar Hiragana", icon: "あ" },
    { value: "46", label: "Karakter dasar Katakana", icon: "ア" },
    { value: "2.136", label: "Jōyō Kanji", icon: "漢" },
    { value: "8", label: "Modul pembelajaran", icon: "八" },
    { value: "5", label: "Tingkat JLPT", icon: "級" },
  ];

  return (
    <section className="paper-texture bg-ivory py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="mb-9 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-700">Cakupan materi yang direncanakan</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <div key={item.label} className="rounded-2xl border border-softgray bg-white p-6 text-center card-shadow">
                <p className="jp text-2xl font-bold text-sakura">{item.icon}</p>
                <p className="mt-2 text-3xl font-extrabold text-navy">{item.value}</p>
                <p className="mt-1 text-xs font-medium leading-snug text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-slate-700">Angka di atas adalah target dan cakupan materi, bukan statistik pengguna atau klaim materi yang telah selesai diimplementasikan.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Learning path -------------------------------- */

const levels = [
  { code: "N5", name: "Beginner", difficulty: 1, description: "Fondasi kana, kosakata dasar, dan pola kalimat sederhana.", target: "Membaca あいうえお dan kalimat pendek." },
  { code: "N4", name: "Elementary", difficulty: 2, description: "Perluasan kosakata, Kanji dasar, dan bentuk kata kerja.", target: "Memahami percakapan sehari-hari." },
  { code: "N3", name: "Intermediate", difficulty: 3, description: "Kanji menengah, grammar kompleks, dan reading dasar.", target: "Membaca teks pendek dan mendengar dialog." },
  { code: "N2", name: "Upper Intermediate", difficulty: 4, description: "Kosakata luas, Kanji lanjutan, dan ekspresi bisnis.", target: "Mengikuti percakapan dan teks bertema." },
  { code: "N1", name: "Advanced", difficulty: 5, description: "Kanji tingkat lanjut, nuansa makna, dan bahasa akademik.", target: "Memahami materials kompleks secara akurat." },
];

export function LearningPathSection() {
  return (
    <section id="jalur" className="scroll-mt-[72px] bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Learning Path" title="Jalur Belajar Bahasa Jepang" description="Lima tingkat dari pemula hingga mahir. Setiap level membangun kemampuan dari level sebelumnya secara bertahap." center />
        </Reveal>
        <div className="relative mt-10">
          <div className="absolute left-0 right-0 top-9 hidden h-0.5 bg-softgray lg:block" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {levels.map((level, i) => (
              <Reveal key={level.code} delay={i * 70}>
                <div className="relative h-full rounded-2xl border border-softgray bg-ivory p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-red/40 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-lg font-extrabold text-white">{level.code}</span>
                    <span role="img" className="flex gap-1" aria-label={`Tingkat kesulitan ${level.difficulty} dari 5`}>
                      {[1, 2, 3, 4, 5].map((dot) => <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot <= level.difficulty ? "bg-red" : "bg-softgray"}`} />)}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold">{level.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{level.description}</p>
                  <div className="mt-4 rounded-lg bg-white p-3 text-xs text-slate-700"><strong className="text-navy">Target:</strong> {level.target}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="mt-7 text-center text-xs text-slate-700">Jalur ini adalah panduan belajar. Menyelesaikan materi di website tidak memberikan sertifikat JLPT resmi.</p>
      </div>
    </section>
  );
}

/* -------------------------------- Eight modules --------------------------------- */

type Module = { char: string; name: string; desc: string; level: string; accent: string; href: string };
const modules: Module[] = [
  { char: "あ", name: "Hiragana", desc: "46 karakter dasar, dakuten, handakuten, youon, romaji dan latihan menulis.", level: "Dasar", accent: "bg-[#fdeaf0] text-[#a84664]", href: "/learning/hiragana" },
  { char: "ア", name: "Katakana", desc: "46 karakter dasar, kata serapan, romaji, dan pelafalan.", level: "Dasar", accent: "bg-[#fdebdc] text-[#a75e27]", href: "/learning/katakana" },
  { char: "漢", name: "Kanji", desc: "Target 2.136 Jōyō Kanji, klasifikasi N5–N1, onyomi, kunyomi, stroke order.", level: "N5–N1", accent: "bg-[#efe8f7] text-[#62428f]", href: "/learning/kanji" },
  { char: "言葉", name: "Kotoba", desc: "Kosakata sehari-hari, arti Indonesia, romaji, contoh kalimat, dan level.", level: "N5–N1", accent: "bg-[#e4f2e6] text-[#356f47]", href: "/learning/vocabulary" },
  { char: "助詞", name: "Joshi / Partikel", desc: "は, が, を, に, で, と, へ — fungsi, contoh, dan latihan menyusun kalimat.", level: "N5–N4", accent: "bg-[#e3ecf8] text-[#365c93]", href: "/learning/grammar" },
  { char: "数", name: "Berhitung", desc: "Angka Jepang, bilangan besar, counter words, dan operasi matematika dasar.", level: "Dasar", accent: "bg-[#faf0d5] text-[#8a6a1c]", href: "/learning/vocabulary" },
  { char: "試験", name: "Exam Preparation", desc: "JLPT, J.TEST, NAT-TEST, JFT-Basic, BJT, JLCT, dan EJU.", level: "Bertingkat", accent: "bg-[#fbe4e6] text-[#a92f3c]", href: "/exams" },
  { char: "聴解", name: "Choukai", desc: "Listening, pemahaman audio, percakapan sehari-hari, dan latihan pertanyaan.", level: "N5–N1", accent: "bg-[#dff1f0] text-[#266e6a]", href: "/learning/hiragana" },
];

export function LearningModulesSection() {
  return (
    <section id="materi" className="scroll-mt-[72px] bg-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Learning Modules" title="Jelajahi Materi Pembelajaran" description="Pelajari berbagai aspek bahasa Jepang dalam satu platform." center />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, i) => (
            <Reveal key={module.name} delay={(i % 4) * 70}>
              <article className="group flex h-full flex-col rounded-2xl border border-softgray bg-white p-5 card-shadow transition-all duration-300 hover:-translate-y-1.5 hover:border-red/30 hover:shadow-xl">
                <div className={`jp flex h-24 items-center justify-center rounded-xl text-4xl font-bold ${module.accent}`}>{module.char}</div>
                <h3 className="mt-5 text-lg font-bold">{module.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{module.desc}</p>
                <div className="mt-4"><Badge tone="slate">{module.level}</Badge></div>
                <Link href={module.href} className={`${buttonStyles("outline", "sm")} mt-4 w-full`}>Pelajari <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Kanji showcase -------------------------------- */

const showcase = [
  { char: "火", romaji: "Hi / Ka", meaning: "Api", emoji: "🔥", color: "bg-[#fde4e6] text-[#a3323f]" },
  { char: "水", romaji: "Mizu / Sui", meaning: "Air", emoji: "💧", color: "bg-[#dff0e6] text-[#27684a]" },
  { char: "木", romaji: "Ki / Moku", meaning: "Pohon", emoji: "🌳", color: "bg-[#e4ecfa] text-[#2d4f8a]" },
  { char: "土", romaji: "Tsuchi / Do", meaning: "Tanah", emoji: "🌱", color: "bg-[#f7edd5] text-[#8a6420]" },
  { char: "人", romaji: "Hito / Jin", meaning: "Orang", emoji: "🧍", color: "bg-[#eee5f8] text-[#63458e]" },
  { char: "心", romaji: "Kokoro / Shin", meaning: "Hati", emoji: "❤️", color: "bg-[#fbe6d8] text-[#9a5426]" },
  { char: "日", romaji: "Hi / Nichi", meaning: "Matahari / Hari", emoji: "☀️", color: "bg-[#dff2f1] text-[#266b68]" },
  { char: "月", romaji: "Tsuki / Getsu", meaning: "Bulan", emoji: "🌙", color: "bg-[#fae2ec] text-[#9c3c63]" },
];

export function KanjiShowcaseSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Kanji Showcase" title="Kenali Kanji, Pahami Maknanya." description="Kartu pastel dengan karakter besar, romaji, arti, dan ilustrasi kecil — contoh tampilan flashcard Kanji." center />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {showcase.map((item, i) => (
            <Reveal key={item.char} delay={(i % 8) * 40}>
              <Link href={`/learning/kanji/kanji-${item.char}`} className={`group block rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${item.color}`}>
                <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                <p className="jp mt-2 text-4xl font-bold">{item.char}</p>
                <p className="mt-2 text-xs font-bold">{item.romaji}</p>
                <p className="mt-1 text-[11px]">{item.meaning}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center"><Link href="/learning/kanji" className={buttonStyles("outline", "md")}>Lihat pustaka Kanji <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}

/* ----------------------------- Examination section ------------------------------ */

const examTargets: Record<string, string> = {
  jlpt: "Pelajar yang ingin mengukur kemahiran bahasa Jepang secara umum.",
  jtest: "Pembelajar yang ingin mengasah bahasa Jepang praktis.",
  "nat-test": "Peserta yang mencari ujian berlevel sebagai alternatif.",
  "jft-basic": "Calon pekerja atau penutur bahasa Jepang dasar.",
  bjt: "Profesional dan pelamar kerja di lingkungan Jepang.",
  jlct: "Peserta yang ingin opsi penilaian bertingkat.",
  eju: "Calon mahasiswa universitas di Jepang.",
};

export function ExamPreparationSection() {
  return (
    <section id="ujian" className="scroll-mt-[72px] bg-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Exam Preparation" title="Persiapkan Dirimu Menghadapi Ujian Bahasa Jepang" description="Tujuh ujian dengan format dan tujuan yang berbeda. Setiap kategori memiliki informasi dan jalur persiapannya sendiri." center />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_CATEGORIES.map((exam, i) => (
            <Reveal key={exam.code} delay={(i % 4) * 60}>
              <article className="flex h-full flex-col rounded-2xl border border-softgray bg-white p-5 card-shadow transition-all duration-300 hover:-translate-y-1 hover:border-red/30">
                <span className="jp flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-lg font-bold text-navy">試</span>
                <h3 className="mt-4 text-lg font-bold">{exam.name}</h3>
                <p className="mt-1 text-xs font-semibold text-navy/75">{exam.fullName}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">{exam.objective}</p>
                <p className="mt-3 rounded-lg bg-cream p-3 text-xs text-slate-700"><strong>Target:</strong> {examTargets[exam.code]}</p>
                <Link href={`/exams/${exam.code}`} className={`${buttonStyles("outline", "sm")} mt-4 w-full`}>Informasi ujian <ArrowRight className="h-3.5 w-3.5" /></Link>
              </article>
            </Reveal>
          ))}
          <Reveal delay={240}>
            <div className="flex h-full flex-col justify-center rounded-2xl bg-navy p-6 text-white">
              <Trophy className="h-7 w-7 text-gold" />
              <h3 className="mt-4 text-lg font-bold">Belajar tanpa klaim resmi</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">Seluruh soal latihan dibuat oleh platform. Kami tidak menggunakan logo resmi atau menyalin soal ujian tanpa izin.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- Why us ------------------------------------- */

export function WhySection() {
  const items = [
    { icon: Target, title: "Materi terstruktur N5–N1", desc: "Jalur belajar bertingkat dari pemula hingga mahir." },
    { icon: BookOpen, title: "Hiragana & Katakana", desc: "Fondasi sistem tulisan Jepang sejak pelajaran pertama." },
    { icon: Library, title: "Target Kanji komprehensif", desc: "Cakupan Jōyō Kanji dengan arti, pembacaan, dan contoh." },
    { icon: PencilLine, title: "Kosakata & tata bahasa", desc: "Latihan nyata untuk memperkuat pemahaman dan penggunaan." },
    { icon: FileText, title: "Berbagai persiapan ujian", desc: "Tujuh kategori ujian dengan karakteristik yang berbeda." },
    { icon: Headphones, title: "Listening & evaluasi", desc: "Latihan mendengar dan pengukuran progres belajar." },
  ];
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><SectionHeading eyebrow="Keunggulan" title="Mengapa Memilih Nihongo Academy?" description="Dirancang untuk pembelajar Indonesia agar setiap langkah belajar terasa jelas dan terarah." center /></Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 70}>
              <div className="flex h-full gap-4 rounded-2xl border border-softgray bg-ivory p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red/10 text-red-ink"><item.icon className="h-5 w-5" /></span>
                <div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-700">{item.desc}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- About -------------------------------------- */

export function AboutSection() {
  return (
    <section id="tentang" className="scroll-mt-[72px] bg-ivory py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow="Tentang Kami" title="Tentang Nihongo Academy" />
          <p className="text-sm leading-relaxed text-slate-700">Nihongo Academy merupakan platform pembelajaran bahasa Jepang yang dirancang untuk membantu pelajar memahami bahasa Jepang secara bertahap. Mulai dari mengenal huruf Jepang, memahami kosakata dan tata bahasa, hingga meningkatkan kemampuan bahasa Jepang melalui latihan dan persiapan ujian.</p>
          <div className="mt-7 space-y-4">
            {[
              { label: "Visi", text: "Menjadi platform pembelajaran bahasa Jepang yang membantu pelajar Indonesia belajar secara mandiri dan terarah." },
              { label: "Misi", text: "Menyajikan materi yang akurat, interaktif, dan mudah dipahami dalam satu sistem pembelajaran." },
              { label: "Tujuan Pengembangan", text: "Menyediakan fondasi materi N5–N1, latihan yang nyata, serta struktur yang memungkinkan penambahan konten." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-softgray bg-white p-4">
                <p className="text-sm font-bold text-navy">{item.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-softgray bg-gradient-to-b from-[#f6dfe4] via-[#f9eddb] to-[#dfe7f2]">
            <Sakura count={10} />
            <div className="absolute bottom-16 left-1/2 h-48 w-80 -translate-x-1/2">
              <div className="absolute inset-0 bg-indigo/80" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              <div className="absolute left-1/2 top-0 h-14 w-24 -translate-x-1/2 bg-white/95" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
            </div>
            <div className="absolute left-6 top-6 rounded-xl bg-white/95 px-4 py-3 shadow-lg"><p className="jp text-2xl font-bold text-navy">日本語</p><p className="text-xs text-slate-700">Bahasa Jepang</p></div>
            <div className="absolute bottom-6 right-6 rounded-xl bg-white/95 px-4 py-3 shadow-lg"><p className="jp text-2xl font-bold text-red-ink">一歩ずつ</p><p className="text-xs text-slate-700">Selangkah demi selangkah</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Final CTA ------------------------------------ */

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-center text-white">
      <Sakura count={12} />
      <Reveal className="relative z-10 mx-auto max-w-3xl px-4">
        <Sparkles className="mx-auto h-7 w-7 text-gold" />
        <h2 className="text-balance mt-5 text-3xl font-extrabold sm:text-4xl">Mulai Perjalanan Belajar Bahasa Jepangmu!</h2>
        <p className="mt-4 text-white/85">Setiap langkah kecil membawamu lebih dekat untuk memahami bahasa Jepang.</p>
        <Link href="/#materi" className={`${buttonStyles("primary", "lg")} mt-8`}>Jelajahi Materi <ArrowRight className="h-5 w-5" /></Link>
        <p className="jp-serif mt-6 text-gold">一歩ずつ、日本語を学ぼう</p>
      </Reveal>
    </section>
  );
}
