"use client";

import { useEffect, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { AlertTriangle, Inbox, Loader2, X } from "lucide-react";
import { buttonStyles, type ButtonSize as Size, type ButtonVariant as Variant } from "@/lib/styles";

export { buttonStyles };

export function Button({
  variant = "primary", size = "md", className = "", children, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={`${buttonStyles(variant, size)} ${className}`} {...props}>{children}</button>;
}

export function Card({ className = "", id, children }: { className?: string; id?: string; children: ReactNode }) {
  return <div id={id} className={`rounded-2xl border border-navy/8 bg-white p-5 card-shadow ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "navy" }: { children: ReactNode; tone?: "navy" | "red" | "green" | "gold" | "sakura" | "slate" }) {
  const tones = {
    navy: "bg-navy/10 text-navy", red: "bg-red/10 text-red-ink", green: "bg-success/10 text-success",
    gold: "bg-gold/20 text-[#8a6420]", sakura: "bg-sakura-light text-[#a03a63]", slate: "bg-slate-100 text-slate-600",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function ProgressBar({ value, color = "red", label }: { value: number; color?: "red" | "navy" | "green" | "gold"; label?: string }) {
  const colors = { red: "bg-red", navy: "bg-navy", green: "bg-success", gold: "bg-gold" };
  return (
    <div>
      {label && <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-600"><span>{label}</span><span>{value}%</span></div>}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy/8" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className={`progress-fill h-full rounded-full ${colors[color]}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function Skeleton({ variant = "block" }: { variant?: "block" | "card" | "page" }) {
  if (variant === "page") {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-6 p-6" aria-busy="true" aria-label="Memuat halaman">
        <div className="h-10 w-1/3 rounded-xl bg-navy/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="h-40 rounded-2xl bg-navy/8" />)}</div>
      </div>
    );
  }
  return <div className={`animate-pulse rounded-xl bg-navy/10 ${variant === "card" ? "h-40" : "h-5 w-full"}`} aria-busy="true" />;
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/20 bg-cream/50 px-6 py-12 text-center">
      <div className="mb-4 text-4xl" aria-hidden="true">{icon ?? <Inbox className="mx-auto h-10 w-10 text-navy/40" />}</div>
      <h3 className="text-lg">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-600">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-2xl border border-red/25 bg-red/5 p-5">
      <div className="flex items-center gap-2 font-semibold text-red-ink"><AlertTriangle className="h-5 w-5" /> Terjadi masalah</div>
      <p className="text-sm text-slate-700">{message}</p>
      {onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Coba lagi</Button>}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description, center = false, light = false }: { eyebrow?: string; title: string; description?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${light ? "text-gold" : "text-red-ink"}`}>{eyebrow}</p>}
      <h2 className={`text-balance text-3xl font-bold sm:text-4xl ${light ? "text-white" : ""}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/85" : "text-slate-600"}`}>{description}</p>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (tab: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab} role="tab" aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === tab ? "bg-navy text-white" : "bg-white text-slate-600 ring-1 ring-navy/10 hover:bg-cream"}`}
        >{tab}</button>
      ))}
    </div>
  );
}

export function Input({ label, hint, error, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }) {
  const id = props.id ?? props.name;
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">{label}</label>}
      <input id={id} className="min-h-11 w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-red focus:ring-2 focus:ring-red/20" aria-invalid={!!error} {...props} />
      {error ? <p className="mt-1.5 text-xs font-medium text-red-ink" role="alert">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-600">{hint}</p> : null}
    </div>
  );
}

export function Select({ label, className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-semibold text-navy">{label}</label>}
      <select className="min-h-11 w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20" {...props}>{children}</select>
    </div>
  );
}

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fade-up w-full max-w-md rounded-2xl bg-white p-6 card-shadow">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl">{title}</h2>
          <button onClick={onClose} aria-label="Tutup" className="rounded-lg p-2 text-slate-600 hover:bg-navy/5"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spinner({ label = "Memproses" }: { label?: string }) {
  return <span className="inline-flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> {label}</span>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-red-ink">{eyebrow}</p>}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
