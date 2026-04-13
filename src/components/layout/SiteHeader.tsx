import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { TAXPAYER } from "@/data/portal";
import { labelForNav, PRIMARY_NAV, type NavKey } from "./navConfig";

type SiteHeaderProps = {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onOpenMobileNav: () => void;
};

export function SiteHeader({
  active,
  onNavigate,
  onOpenMobileNav,
}: SiteHeaderProps) {
  const currentLabel = labelForNav(active);
  const { secondaryLabel, clearSecondary } = useBreadcrumb();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/90 bg-white shadow-[0_1px_0_rgb(0_0_0/0.03)]">
      {/* Utility row: logo, centered search, profile + bell (National Benefits pattern) */}
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
          <img
            src="/portal-logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 object-contain"
            decoding="async"
          />
          <p className="min-w-0 truncate font-sans text-lg font-semibold tracking-tight text-portal-brown sm:text-xl">
            Taxpayer Portal
          </p>
        </div>

        <div className="mx-auto hidden min-w-0 max-w-md flex-1 px-4 md:block">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search…"
              className="h-11 w-full rounded-full border border-transparent bg-stone-100 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-portal-link/15 transition focus:bg-white focus:ring-2"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <HeadlessMenu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-left hover:bg-stone-50 sm:pr-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-portal-peach text-sm font-semibold text-portal-brown ring-2 ring-white"
                aria-hidden
              >
                {TAXPAYER.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              <span className="hidden min-w-0 max-w-[10rem] lg:block">
                <span className="block truncate text-sm font-semibold text-stone-900">
                  {TAXPAYER.name}
                </span>
                <span className="block truncate text-xs text-stone-500">
                  TIN {TAXPAYER.tinMasked}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom end"
              className="z-50 mt-2 w-56 origin-top-right rounded-xl border border-stone-200/90 bg-white p-1 shadow-lg [--anchor-gap:0.25rem] data-closed:scale-95 data-closed:opacity-0"
            >
              <div className="border-b border-stone-100 px-3 py-2 lg:hidden">
                <p className="text-sm font-semibold text-stone-900">
                  {TAXPAYER.name}
                </p>
                <p className="text-xs text-stone-500">TIN {TAXPAYER.tinMasked}</p>
              </div>
              <MenuItem>
                <button
                  type="button"
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-stone-700 data-focus:bg-stone-50 data-focus:outline-none"
                >
                  Account settings
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-stone-700 data-focus:bg-stone-50 data-focus:outline-none"
                >
                  Sign out
                </button>
              </MenuItem>
            </MenuItems>
          </HeadlessMenu>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-portal-ochre ring-2 ring-white" />
          </button>
        </div>
      </div>

      <div className="border-t border-stone-100 px-4 py-2.5 md:hidden">
        <div className="relative mx-auto max-w-lg">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search…"
            className="h-10 w-full rounded-full border border-transparent bg-stone-100 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-portal-link/15 focus:bg-white focus:ring-2"
          />
        </div>
      </div>

      {/* Primary navigation — horizontal tabs with ochre active underline */}
      <div className="border-t border-stone-100 bg-white">
        <nav
          className="mx-auto hidden max-w-7xl items-stretch gap-1 px-4 sm:px-6 lg:flex lg:gap-2 lg:px-8"
          aria-label="Primary"
        >
          {PRIMARY_NAV.map(({ key, label }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                className={`relative px-1 py-3 text-sm font-medium transition sm:px-2 ${
                  isActive
                    ? "font-semibold text-portal-ochre"
                    : "text-amber-900/55 hover:text-portal-brown"
                }`}
              >
                {label}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-portal-ochre" />
                ) : null}
              </button>
            );
          })}
        </nav>

        <nav
          className="flex gap-1 overflow-x-auto border-t border-stone-100 px-3 py-2 lg:hidden"
          aria-label="Primary mobile"
        >
          {PRIMARY_NAV.map(({ key, label, shortLabel }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-portal-peach text-portal-ochre ring-1 ring-amber-200/80"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                <span className="sm:hidden">{shortLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Breadcrumbs only below primary tabs (secondary navigation depth) */}
      {secondaryLabel ? (
        <div className="border-t border-stone-100 bg-stone-50/90">
          <div className="mx-auto max-w-7xl px-4 py-2.5 text-sm sm:px-6 lg:px-8">
            <nav className="text-portal-link" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={() => {
                  onNavigate("dashboard");
                  clearSecondary();
                }}
                className="font-medium hover:underline"
              >
                Portal
              </button>
              <span className="mx-2 text-stone-400" aria-hidden>
                ›
              </span>
              <button
                type="button"
                onClick={() => clearSecondary()}
                className="font-medium hover:underline"
              >
                {currentLabel}
              </button>
              <span className="mx-2 text-stone-400" aria-hidden>
                ›
              </span>
              <span className="font-medium text-stone-700">{secondaryLabel}</span>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
