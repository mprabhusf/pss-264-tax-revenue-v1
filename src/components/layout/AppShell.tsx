import { useState } from "react";
import type { ReactNode } from "react";
import { AppFooter } from "./AppFooter";
import { MobileSidebar } from "./MobileSidebar";
import type { NavKey } from "./navConfig";
import { SiteHeader } from "./SiteHeader";

type AppShellProps = {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  children: ReactNode;
};

export function AppShell({ active, onNavigate, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-stone-100/80">
      <SiteHeader
        active={active}
        onNavigate={onNavigate}
        onOpenMobileNav={() => setMobileOpen(true)}
      />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        active={active}
        onNavigate={onNavigate}
      />
      <main className="flex flex-1 flex-col px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl flex-1">{children}</div>
      </main>
      <AppFooter />
    </div>
  );
}
