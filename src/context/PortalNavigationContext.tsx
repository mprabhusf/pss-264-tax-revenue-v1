import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { NavKey } from "@/components/layout/navConfig";

type PortalNavContextValue = {
  activeNav: NavKey;
};

const PortalNavContext = createContext<PortalNavContextValue>({
  activeNav: "home",
});

export function PortalNavProvider({
  activeNav,
  children,
}: {
  activeNav: NavKey;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ activeNav }), [activeNav]);
  return (
    <PortalNavContext.Provider value={value}>
      {children}
    </PortalNavContext.Provider>
  );
}

export function usePortalNav() {
  return useContext(PortalNavContext);
}
