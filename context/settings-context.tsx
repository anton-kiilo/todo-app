import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "@todo-app/settings";

export type AppearancePreference = "system" | "light" | "dark";

export type AppSettings = {
  appearance: AppearancePreference;
  hideCompletedTodos: boolean;
  hapticsEnabled: boolean;
};

const defaultSettings: AppSettings = {
  appearance: "system",
  hideCompletedTodos: false,
  hapticsEnabled: true,
};

type SettingsContextValue = {
  settings: AppSettings;
  hydrated: boolean;
  setAppearance: (appearance: AppearancePreference) => void;
  setHideCompletedTodos: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function parseSettings(raw: string | null): AppSettings {
  if (!raw) return defaultSettings;
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      appearance:
        parsed.appearance === "light" ||
        parsed.appearance === "dark" ||
        parsed.appearance === "system"
          ? parsed.appearance
          : defaultSettings.appearance,
      hideCompletedTodos:
        typeof parsed.hideCompletedTodos === "boolean"
          ? parsed.hideCompletedTodos
          : defaultSettings.hideCompletedTodos,
      hapticsEnabled:
        typeof parsed.hapticsEnabled === "boolean"
          ? parsed.hapticsEnabled
          : defaultSettings.hapticsEnabled,
    };
  } catch {
    return defaultSettings;
  }
}

async function saveSettings(next: AppSettings) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore persistence errors
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled) {
          setSettings(parseSettings(raw));
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const patchSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const setAppearance = useCallback(
    (appearance: AppearancePreference) => {
      patchSettings({ appearance });
    },
    [patchSettings],
  );

  const setHideCompletedTodos = useCallback(
    (hideCompletedTodos: boolean) => {
      patchSettings({ hideCompletedTodos });
    },
    [patchSettings],
  );

  const setHapticsEnabled = useCallback(
    (hapticsEnabled: boolean) => {
      patchSettings({ hapticsEnabled });
    },
    [patchSettings],
  );

  const resetSettings = useCallback(() => {
    setSettings(() => {
      void saveSettings(defaultSettings);
      return defaultSettings;
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      hydrated,
      setAppearance,
      setHideCompletedTodos,
      setHapticsEnabled,
      resetSettings,
    }),
    [
      settings,
      hydrated,
      setAppearance,
      setHideCompletedTodos,
      setHapticsEnabled,
      resetSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
