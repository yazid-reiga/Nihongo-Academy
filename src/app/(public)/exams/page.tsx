import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { EXAM_CATEGORIES } from "@/lib/data/seed/exams";
import { Badge, Card, SectionHeading } from "@/components/ui/Primitives";

export default function ExamsPage() {
  return (
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Exam Center" title="Pusat Ujian" description="Tujuh kategori persiapan ujian bahasa Jepang. Setiap kategori memiliki halaman informasi dan struktur materinya sendiri." center />
        <div className="mb-8 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-slate-700">
          <strong>Status fitur:</strong> bagian ini menyediakan informasi dan struktur materi. Simulasi ujian berskala penuh dengan timer, navigasi soal, dan penilaian per paket akan hadir pada fase berikutnya. Soal yang dibuat platform tidak pernah diberi label sebagai soal resmi.
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {EXAM_CATEGORIES.map((exam) => (
            <Link key={exam.code} href={`/exams/${exam.code}`} className="group rounded-2xl border border-navy/10 bg-white p-6 card-shadow transition-all hover:-translate-y-1 hover:border-red/40">
              <div className="flex items-center justify-between"><GraduationCap className="h-6 w-6 text-red-ink" /><Badge tone="slate">{exam.levels[0]}</Badge></div>
              <h2 className="mt-4 text-xl font-bold">{exam.name}</h2>
              <p className="mt-1 text-xs font-semibold text-indigo">{exam.fullName}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{exam.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-red-ink">Lihat detail <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
