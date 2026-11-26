"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers";
import { Skeleton } from "@/components/ui/Primitives";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { hydrated, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated) return <Skeleton variant="page" />;
  if (!user) return <Skeleton variant="page" />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { hydrated, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && (!user || user.role !== "admin")) router.replace(user ? "/dashboard" : "/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <Skeleton variant="page" />;
  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl">Akses ditolak</h1>
        <p className="mt-2 text-slate-600">Halaman admin hanya untuk pengguna dengan peran admin.</p>
      </div>
    );
  }
  return <>{children}</>;
}
