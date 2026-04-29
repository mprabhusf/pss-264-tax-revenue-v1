import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-portal-peach/80 text-portal-brown ring-1 ring-stone-200/60">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-portal-brown">{title}</h2>
          <p className="mt-1 text-sm text-stone-600">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
