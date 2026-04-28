import type { ReactNode } from "react";

type PortalCardProps = {
  title: string;
  description?: string;
  /** Extra classes on the outer shell (e.g. ring for emphasis) */
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Standard portal surface: white card, stone border, soft shadow.
 * Matches established views (Profile & Household, Payments, Notices).
 */
export function PortalCard({
  title,
  description,
  className = "",
  children,
  footer,
}: PortalCardProps) {
  return (
    <section
      className={`rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[var(--shadow-portal-card)] sm:p-6 ${className}`}
    >
      <header className="border-b border-stone-100 pb-4">
        <h2 className="text-base font-semibold text-portal-brown sm:text-lg">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-stone-600">{description}</p>
        ) : null}
      </header>
      <div className="pt-4">{children}</div>
      {footer ? (
        <div className="mt-4 border-t border-stone-100 pt-4">{footer}</div>
      ) : null}
    </section>
  );
}
