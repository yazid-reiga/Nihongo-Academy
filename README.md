# Nihongo Academy

> Web untuk belajar bahasa jepang

Landing page Nihongo Academy — platform pembelajaran bahasa Jepang untuk
pembelajar Indonesia. Fokus rilis ini adalah **kualitas UI/UX landing page**
dengan identitas Japanese Modern Aesthetic, sebagai demonstrasi proyek kepada guru.
Rute aplikasi yang sudah dibangun sebelumnya tetap dipertahankan.

## Menjalankan

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build produksi
npm run test    # tes logika bisnis (Vitest)
```

Butuh Node.js 20+. Tidak perlu Supabase atau database untuk menjalankan proyek ini.

## Struktur landing page

1. Navbar sticky: Beranda, Materi Pembelajaran, Jalur Belajar, Persiapan Ujian,
   Tentang Kami, dan tombol Mulai Belajar. Menggunakan anchor + smooth scrolling
   dengan active state dan menu hamburger di mobile.
2. Hero: headline “Belajar Bahasa Jepang, Mulai dari Satu Langkah Kecil.”,
   subheadline sesuai PRD, visual Gunung Fuji, sakura, floating learning cards.
3. Statistik: 46 Hiragana, 46 Katakana, 2.136 Jōyō Kanji, 8 modul, 5 tingkat JLPT —
   **label eksplisit sebagai target cakupan materi**, bukan statistik pengguna.
4. Jalur belajar N5–N1 dengan badge, indikator kesulitan, dan contoh target.
   Tidak ada klaim sertifikat JLPT.
5. Delapan modul: Hiragana あ, Katakana ア, Kanji 漢, Kotoba 言葉, Joshi 助詞,
   Berhitung 数, Exam Preparation 試験, Choukai 聴解 — masing-masing dengan aksen
   warna, deskripsi, level, dan tombol Pelajari yang mengarah ke rute nyata.
6. Kanji showcase: 8 flashcard pastel (火 水 木 土 人 心 日 月) dengan romaji,
   arti, dan ilustrasi kecil.
7. Persiapan ujian: 7 kartu (JLPT, J.TEST, NAT-TEST, JFT-Basic, BJT, JLCT, EJU)
   dengan kepanjangan, tujuan, target pembelajar, dan tombol informasi. Tanpa logo resmi.
8. Mengapa Nihongo Academy: enam keunggulan.
9. Tentang Nihongo Academy: visi, misi, tujuan pengembangan, ilustrasi Jepang.
10. Final CTA + footer lengkap (navigasi, delapan modul, informasi proyek, copyright).

## Komponen reusable

- Layout: `Navbar`, `Footer`, `ScrollToHash`, `AppShell`.
- Landing: `HeroSection`, `Sakura`, `Reveal`, `StatisticsSection`,
  `LearningPathSection`, `LearningModulesSection`, `KanjiShowcaseSection`,
  `ExamPreparationSection`, `WhySection`, `AboutSection`, `FinalCTA`.
- UI dasar: `Button`, `Card`, `Badge`, `ProgressBar`, `SectionHeading`, `Tabs`,
  `Input`, `Select`, `Modal`, `EmptyState`, `ErrorState`.

`Reveal` hanya menambahkan animasi saat seksi masuk viewport — konten tidak pernah
disembunyikan, sehingga tetap tampil saat halaman dilompat, dicetak, atau animasi
dinonaktifkan.

## Identitas visual

Navy `#17264B`, Japanese Red `#D93645`, Ivory `#F7F3E9`, Gold `#D9AD55`,
Soft Gray `#EAE8E2`, Sakura Pink `#F3B7C8`. Font: Inter (UI), Poppins (heading),
Noto Sans JP / Noto Serif JP (karakter Jepang) dengan fallback sistem.

## Rute aplikasi yang tetap tersedia

`/dashboard`, `/learning/*`, `/quiz`, `/exams/*`, `/progress`, `/profile`, `/admin`.
Akun demo: `demo@nihongo.ac.id` / `demo1234` dan `admin@nihongo.ac.id` / `admin1234`.
Data disimpan di localStorage; mode ini bukan sistem autentikasi produksi.

## Verifikasi

- `npm run test` — 9/9 tes lulus.
- `npm run build` — 30 rute berhasil dibangun.
- Lighthouse homepage: Accessibility 100, Best Practices 100, SEO 100.
- Console browser bersih; tidak ada tautan `href="#"` atau tombol tanpa aksi.
- Breakpoint responsif: grid 1 kolom di mobile, 2 di tablet, 4/5/8 di desktop;
  navbar berubah menjadi hamburger di bawah 1024px; tidak ada horizontal scroll
  pada viewport yang diuji.

## Batasan yang disengaja

- Landing page adalah fokus utama; tidak ada backend, database, atau statistik pengguna.
- Angka Kanji 2.136 adalah target cakupan, bukan materi yang sudah selesai diimplementasikan.
- Soal latihan buatan platform, bukan soal resmi lembaga ujian; tanpa logo resmi.
- Simulasi ujian penuh belum tersedia — halaman ujian berisi informasi dan struktur materi.
