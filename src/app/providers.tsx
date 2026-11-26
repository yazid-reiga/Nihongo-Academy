"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_SETTINGS, type AppState, type DataAdapter } from "@/lib/data/adapter";
import { adapter } from "@/lib/data/local-adapter";
import type { Settings, User } from "@/lib/types";

interface AppContextValue {
  state: AppState | null;
  user: User | null;
  hydrated: boolean;
  settings: Settings;
  adapter: DataAdapter;
}

const AppContext = createContext<AppContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const sync = () => setState({ ...adapter.getState() });
    sync();
    return adapter.subscribe(sync);
  }, []);

  const user = state?.users.find((u) => u.id === state.session?.userId) ?? null;
  const settings: Settings = {
    ...DEFAULT_SETTINGS,
    ...(user ? (state?.settings[user.id] ?? {}) : {}),
  };

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(settings.reducedMotion);
  }, [settings.reducedMotion]);

  return (
    <AppContext.Provider value={{ state, user, hydrated: state !== null, settings, adapter }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside Providers");
  return context;
}
