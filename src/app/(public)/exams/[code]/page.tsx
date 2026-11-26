import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { EXAM_CATEGORIES } from "@/lib/data/seed/exams";
import { Badge, Card, SectionHeading } from "@/components/ui/Primitives";
import { buttonStyles } from "@/lib/styles";

export function generateStaticParams() {
  return EXAM_CATEGORIES.map((exam) => ({ code: exam.code }));
}

export default async function ExamDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const exam = EXAM_CATEGORIES.find((item) => item.code === code);
  if (!exam) notFound();

  return (
    <div className="bg-cream py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link href="/exams" className="inline-flex items-center gap-2 text-sm font-bold text-red-ink hover:underline"><ArrowLeft className="h-4 w-4" /> Semua ujian</Link>
        <div className="mt-6"><SectionHeading eyebrow="Exam Center" title={exam.fullName} description={exam.description} /></div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-bold">Informasi umum</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="font-semibold text-slate-600">Tujuan</dt><dd className="mt-1 text-slate-700">{exam.objective}</dd></div>
              <div><dt className="font-semibold text-slate-600">Level / grade</dt><dd className="mt-1 flex flex-wrap gap-2">{exam.levels.map((level) => <Badge key={level} tone="navy">{level}</Badge>)}</dd></div>
              <div><dt className="font-semibold text-slate-600">Fokus materi</dt><dd className="mt-1 text-slate-700">{exam.focus}</dd></div>
              <div><dt className="font-semibold text-slate-600">Referensi resmi</dt><dd className="mt-1"><a href={exam.reference} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-red-ink hover:underline">Situs resmi <ExternalLink className="h-3.5 w-3.5" /></a></dd></div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-lg font-bold">Struktur materi</h2>
            <ul className="mt-4 space-y-2">{exam.sections.map((section) => <li key={section} className="flex items-center gap-2 rounded-lg bg-cream px-3 py-2.5 text-sm font-medium text-navy"><span className="h-1.5 w-1.5 rounded-full bg-red" />{section}</li>)}</ul>
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="text-lg font-bold">Paket latihan & simulasi</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Paket latihan dan simulasi ujian dengan timer, navigasi soal, serta aturan penilaian per paket belum tersedia pada rilis ini. Saat tersedia, durasi, jumlah soal, dan kriteria kelulusan hanya akan ditampilkan jika bersumber dari data resmi terverifikasi — bukan perkiraan.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/quiz" className={buttonStyles("primary", "sm")}>Latihan dengan kuis umum</Link>
            <Link href="/learning/kanji" className={buttonStyles("outline", "sm")}>Pelajari materi terkait</Link>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-600">Simulasi buatan Nihongo Academy tidak merupakan ujian resmi dan tidak menghasilkan sertifikat resmi.</p>
      </div>
    </div>
  );
}
