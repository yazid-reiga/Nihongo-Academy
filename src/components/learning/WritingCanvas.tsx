"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eraser, Eye, EyeOff, RotateCcw, Undo2 } from "lucide-react";
import { useApp } from "@/app/providers";
import { buttonStyles, Badge, Card, PageHeader, Select } from "@/components/ui/Primitives";
import { getKana } from "@/lib/data/seed/kana";
import { KANJI } from "@/lib/data/seed/kanji";
import type { Script } from "@/lib/types";

type Point = { x: number; y: number };
type Target = { id: string; character: string; label: string };

export function WritingCanvas({ script, initialId }: { script: Script | "kanji"; initialId?: string }) {
  const { user, adapter, settings } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [message, setMessage] = useState("");

  const targets: Target[] = script === "kanji"
    ? KANJI.map((k) => ({ id: k.id, character: k.character, label: k.meaning }))
    : getKana(script).map((k) => ({ id: k.id, character: k.character, label: k.romaji }));

  const [index, setIndex] = useState(() => Math.max(0, targets.findIndex((t) => t.id === initialId)));
  const target = targets[index] ?? targets[0];

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(23, 38, 75, 0.10)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i += 1) {
      const pos = (size / 4) * i;
      ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(size, pos); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size, 0); ctx.lineTo(0, size); ctx.stroke();

    if (showGuide) {
      ctx.fillStyle = "rgba(23, 38, 75, 0.13)";
      ctx.font = `${Math.floor(size * 0.72)}px "Noto Sans JP", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(target.character, size / 2, size / 2 + size * 0.03);
    }

    ctx.strokeStyle = "#17264b";
    ctx.lineWidth = Math.max(5, size / 90);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const all = [...strokes, current];
    for (const stroke of all) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (const point of stroke.slice(1)) ctx.lineTo(point.x, point.y);
      if (stroke.length === 1) ctx.lineTo(stroke[0].x + 0.5, stroke[0].y + 0.5);
      ctx.stroke();
    }
  }, [strokes, current, showGuide, target.character]);

  useEffect(() => { redraw(); }, [redraw]);

  useEffect(() => {
    const onResize = () => redraw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [redraw]);

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    const scale = event.currentTarget.width / rect.width;
    return { x: (event.clientX - rect.left) * scale, y: (event.clientY - rect.top) * scale };
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setCurrent([pointFromEvent(event)]);
    setMessage("");
  }
  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (event.buttons === 0 && event.pointerType === "mouse") return;
    if (current.length === 0) return;
    setCurrent((points) => [...points, pointFromEvent(event)]);
  }
  function onPointerUp() {
    if (current.length > 0) setStrokes((prev) => [...prev, current]);
    setCurrent([]);
  }

  function undo() { setStrokes((prev) => prev.slice(0, -1)); setMessage("Goresan terakhir dihapus."); }
  function clear() { setStrokes([]); setCurrent([]); setMessage("Kanvas dibersihkan."); }
  function next() {
    setIndex((i) => (i + 1) % targets.length);
    clear();
    setMessage("Karakter berikutnya siap.");
  }
  function assess(quality: number) {
    if (!user) return;
    const contentType = script === "kanji" ? "kanji" : `kana-${script}`;
    adapter.recordReview(user.id, contentType, target.id, quality, `Latihan menulis ${target.character}`);
    setMessage(quality >= 3 ? "Ditandai sudah yakin. Materi ini akan muncul lagi sesuai jadwal." : "Ditandai perlu latihan. Materi ini akan segera muncul lagi.");
  }

  return (
    <div>
      <PageHeader eyebrow="Practice" title="Latihan Menulis" description="Tiru karakter di kanvas menggunakan mouse, layar sentuh, atau stylus. Kamu menilai sendiri hasil tulisanmu — tidak ada skor otomatis." action={<Link href="/learning/hiragana" className={buttonStyles("outline", "sm")}>Kembali ke materi</Link>} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="jp text-5xl font-bold text-navy">{target.character}</span>
              <div><Badge tone="red">{script === "kanji" ? "Kanji" : script === "hiragana" ? "Hiragana" : "Katakana"}</Badge><p className="mt-1 text-sm text-slate-600">{target.label}</p></div>
            </div>
            <Select aria-label="Pilih karakter" value={target.id} onChange={(e) => setIndex(Math.max(0, targets.findIndex((t) => t.id === e.target.value)))} className="w-56">
              {targets.map((t, i) => <option key={t.id} value={t.id}>{t.character} — {t.label} ({i + 1})</option>)}
            </Select>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl ring-2 ring-navy/15 touch-none">
            <canvas
              ref={canvasRef} width={600} height={600}
              className="h-full w-full touch-none"
              style={{ touchAction: "none" }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
              aria-label={`Kanvas menulis untuk ${target.character}`}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={undo} className={buttonStyles("outline", "sm")}><Undo2 className="h-4 w-4" /> Undo</button>
            <button onClick={clear} className={buttonStyles("outline", "sm")}><Eraser className="h-4 w-4" /> Hapus</button>
            <button onClick={() => { clear(); setIndex(0); }} className={buttonStyles("outline", "sm")}><RotateCcw className="h-4 w-4" /> Reset</button>
            <button onClick={() => setShowGuide((v) => !v)} className={buttonStyles("outline", "sm")}>{showGuide ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showGuide ? "Sembunyikan panduan" : "Tampilkan panduan"}</button>
            <button onClick={next} className={buttonStyles("primary", "sm")}>Karakter berikutnya →</button>
          </div>
          {message && <p role="status" className="mt-3 text-sm font-medium text-indigo">{message}</p>}
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold">Cara menggunakan</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li><strong>1.</strong> Perhatikan bentuk karakter di kanvas (panduan samar).</li>
              <li><strong>2.</strong> Gores dengan mouse atau jari mengikuti bentuknya.</li>
              <li><strong>3.</strong> Gunakan Undo atau Hapus jika perlu mengulang.</li>
              <li><strong>4.</strong> Sembunyikan panduan untuk menguji daya ingatmu.</li>
            </ol>
          </Card>
          <Card>
            <h2 className="text-lg font-bold">Nilai sendiri hasilmu</h2>
            <p className="mt-2 text-sm text-slate-600">Sistem belum memiliki pengenal tulisan tangan, jadi tidak ada nilai akurasi otomatis. Pilih penilaianmu sendiri untuk mengatur jadwal pengulangan.</p>
            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => assess(4)} className={buttonStyles("secondary", "sm")}>✅ Saya yakin sudah benar</button>
              <button onClick={() => assess(2)} className={buttonStyles("outline", "sm")}>🔁 Masih perlu latihan</button>
            </div>
            {!user && <p className="mt-3 text-xs text-slate-600">Masuk untuk menyimpan hasil penilaianmu.</p>}
            {settings.reducedMotion && <p className="mt-3 text-xs text-slate-600">Reduced motion aktif — animasi dekoratif dimatikan.</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
