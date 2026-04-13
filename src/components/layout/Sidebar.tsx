import {
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { TAXPAYER } from "@/data/portal";
import { PRIMARY_NAV, type NavKey } from "./navConfig";

const ICONS = {
  dashboard: LayoutDashboard,
  household: Users,
  taxes: FileText,
  payments: CreditCard,
  notices: Inbox,
} as const;

type SidebarProps = {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  className?: string;
};

/** Mobile drawer navigation — vertical list with left-bar active state (form-sidebar reference). */
export function Sidebar({ active, onNavigate, className = "" }: SidebarProps) {
  return (
    <aside
      className={`flex h-full w-full flex-col bg-white ${className}`}
    >
      <div className="flex items-center gap-2.5 border-b border-stone-100 px-4 py-4">
        <img
          src="/portal-logo.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 object-contain"
          decoding="async"
        />
        <p className="min-w-0 truncate font-sans text-base font-semibold text-portal-brown">
          Taxpayer Portal
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Main sections
        </p>
        {PRIMARY_NAV.map(({ key, label }) => {
          const isActive = active === key;
          const Icon = ICONS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              className={`flex w-full items-center gap-3 rounded-r-lg border-l-4 py-2.5 pr-3 pl-2 text-left text-sm font-medium transition ${
                isActive
                  ? "border-portal-ochre bg-portal-peach text-portal-brown"
                  : "border-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? "text-portal-ochre" : "text-stone-400"}`}
              />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-stone-100 p-3">
        <div className="rounded-xl border border-stone-200/80 bg-portal-peach/50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
            Signed in
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-stone-900">
            {TAXPAYER.name}
          </p>
          <p className="truncate text-xs text-stone-500">
            TIN: {TAXPAYER.tinMasked}
          </p>
        </div>
      </div>
    </aside>
  );
}
