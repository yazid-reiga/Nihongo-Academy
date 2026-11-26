import Link from "next/link";
import { Logo } from "./Navbar";

const navigation = [
  ["/#beranda", "Beranda"], ["/#materi", "Materi Pembelajaran"],
  ["/#jalur", "Jalur Belajar"], ["/#ujian", "Persiapan Ujian"], ["/#tentang", "Tentang Kami"],
];

const modules = [
  ["/learning/hiragana", "Hiragana"], ["/learning/katakana", "Katakana"],
  ["/learning/kanji", "Kanji"], ["/learning/vocabulary", "Kotoba"],
  ["/learning/grammar", "Joshi / Partikel"], ["/learning/vocabulary", "Berhitung"],
  ["/exams", "Exam Preparation"], ["/learning/hiragana", "Choukai"],
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-white/80">Belajar bahasa Jepang selangkah demi selangkah, dari Hiragana hingga persiapan ujian.</p>
          <p className="jp-serif mt-4 text-sm text-gold">一歩ずつ、日本語を学ぼう</p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">Navigasi</h2>
          <ul className="space-y-3">
            {navigation.map(([href, label]) => <li key={href}><Link href={href} className="text-sm text-white/80 transition-colors hover:text-gold">{label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">Delapan Modul</h2>
          <ul className="space-y-3">
            {modules.map(([href, label], i) => <li key={`${label}-${i}`}><Link href={href} className="text-sm text-white/80 transition-colors hover:text-gold">{label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">Informasi Proyek</h2>
          <p className="text-sm leading-relaxed text-white/80">Platform demonstrasi pembelajaran bahasa Jepang, disiapkan untuk keperluan presentasi dan evaluasi. Materi latihan dibuat oleh platform dan bukan soal resmi lembaga ujian.</p>
          <p className="mt-4 text-xs text-white/70">Nihongo Academy · Versi 1.0</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Nihongo Academy. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
