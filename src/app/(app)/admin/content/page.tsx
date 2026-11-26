"use client";

import { useState } from "react";
import { useApp } from "@/app/providers";
import { RequireAdmin } from "@/components/guards";
import { Badge, Button, Card, Input, PageHeader, Select, buttonStyles } from "@/components/ui/Primitives";
import type { ContentItem } from "@/lib/types";

const workflow: ContentItem["status"][] = ["draft", "review", "approved", "published"];
const types = ["Hiragana", "Katakana", "Kanji", "Bushu", "Vocabulary", "Grammar", "Listening", "Lessons"];

function ContentManager() {
  const { adapter, state } = useApp();
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("Kanji");
  const [editing, setEditing] = useState<string | null>(null);
  const items = state?.content ?? [];

  function save() {
    if (!title.trim()) return;
    const item: ContentItem = {
      id: editing ?? `content-${Date.now().toString(36)}`,
      contentType, title: title.trim(), status: "draft", updatedAt: new Date().toISOString(),
    };
    adapter.saveContent(item);
    setTitle(""); setEditing(null);
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Manajemen Konten" description="Buat dan kelola materi. Materi belum terverifikasi tidak boleh ditandai published." />
      <Card className="mb-6">
        <h2 className="text-lg font-bold">{editing ? "Sunting konten" : "Tambah konten baru"}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Judul materi" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Kanji N5 dasar" />
          <Select label="Kategori" value={contentType} onChange={(e) => setContentType(e.target.value)}>{types.map((t) => <option key={t}>{t}</option>)}</Select>
        </div>
        <div className="mt-4 flex gap-2"><Button onClick={save} disabled={!title.trim()}>{editing ? "Simpan perubahan" : "Tambah sebagai draft"}</Button>{editing && <Button variant="outline" onClick={() => { setEditing(null); setTitle(""); }}>Batal</Button>}</div>
      </Card>
      <Card>
        <h2 className="text-lg font-bold">Daftar konten ({items.length})</h2>
        {items.length === 0 ? <p className="mt-4 text-sm text-slate-600">Belum ada konten buatan admin. Mulai dengan menambahkan materi baru di atas.</p> : (
          <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-600"><tr><th className="pb-2">Judul</th><th>Kategori</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>{items.map((item) => <tr key={item.id} className="border-t border-navy/5">
              <td className="py-3 font-semibold">{item.title}</td><td>{item.contentType}</td>
              <td><select value={item.status} onChange={(e) => adapter.saveContent({ ...item, status: e.target.value as ContentItem["status"], updatedAt: new Date().toISOString() })} className="min-h-10 rounded-lg border border-navy/15 px-2 text-xs" aria-label={`Status ${item.title}`}>{workflow.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
              <td><div className="flex gap-1"><button onClick={() => { setEditing(item.id); setTitle(item.title); setContentType(item.contentType); }} className={buttonStyles("ghost", "sm")}>Sunting</button><button onClick={() => adapter.deleteContent(item.id)} className={buttonStyles("danger", "sm")}>Hapus</button></div></td>
            </tr>)}</tbody></table></div>
        )}
        <p className="mt-4 text-xs text-slate-600">Status published hanya boleh dipilih setelah materi diverifikasi. Simpan metadata sumber dan tanggal verifikasi secara terpisah pada implementasi produksi.</p>
      </Card>
    </div>
  );
}

export default function AdminContentPage() {
  return <RequireAdmin><ContentManager /></RequireAdmin>;
}
