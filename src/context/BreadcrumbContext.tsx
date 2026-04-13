import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NavKey } from "@/components/layout/navConfig";

type BreadcrumbContextValue = {
  /** When set, user is below a primary tab (secondary level) — show breadcrumbs. */
  secondaryLabel: string | null;
  setSecondaryLabel: (label: string | null) => void;
  clearSecondary: () => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({
  navKey,
  children,
}: {
  navKey: NavKey;
  children: ReactNode;
}) {
  const [secondaryLabel, setSecondaryLabel] = useState<string | null>(null);

  useEffect(() => {
    setSecondaryLabel(null);
  }, [navKey]);

  const clearSecondary = useCallback(() => {
    setSecondaryLabel(null);
  }, []);

  const value = useMemo(
    () => ({
      secondaryLabel,
      setSecondaryLabel,
      clearSecondary,
    }),
    [secondaryLabel, clearSecondary],
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return ctx;
}
