"use client";

import { useApp } from "@/app/providers";

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 5) % 100}%`,
  delay: `${(i * 1.7) % 11}s`,
  duration: `${9 + (i % 6) * 2.5}s`,
  drift: `${((i % 5) - 2) * 60}px`,
  size: `${9 + (i % 4) * 3}px`,
}));

export function Sakura({ count = 14 }: { count?: number }) {
  const { settings, hydrated } = useApp();
  if (!hydrated || settings.reducedMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" data-reduced-motion={settings.reducedMotion}>
      {PETALS.slice(0, count).map((petal, i) => (
        <span
          key={i}
          className="sakura-petal"
          style={{ left: petal.left, width: petal.size, height: petal.size, animationDelay: petal.delay, animationDuration: petal.duration, ["--drift" as string]: petal.drift }}
        />
      ))}
    </div>
  );
}
