"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ISiteSettings } from "@/domain/interfaces/siteSettingsInterface";
import { siteSettingsService } from "@/domain/services/siteSettingsService";

interface SiteSettingsContextValue {
  settings: ISiteSettings | null;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: null,
  loading: true,
});

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    siteSettingsService
      .getSiteSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
