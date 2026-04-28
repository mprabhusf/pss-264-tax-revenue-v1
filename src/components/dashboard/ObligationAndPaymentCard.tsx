import { ExternalLink } from "lucide-react";
import { PortalCard } from "@/components/ui/PortalCard";
import { CURRENT_BALANCE } from "@/data/portal";

export const PORTAL_DEBT_BREAKDOWN_ANCHOR_ID = "portal-debt-breakdown";

/** Set `sessionStorage` to `"1"` before navigating to Payments & Ledger to scroll to debt breakdown. */
export const PORTAL_DEBT_SCROLL_SESSION_KEY = "portal-scroll-debt-breakdown";

type ObligationAndPaymentCardProps = {
  onMakePayment: () => void;
  onViewDebtBreakdown: () => void;
};

export function ObligationAndPaymentCard({
  onMakePayment,
  onViewDebtBreakdown,
}: ObligationAndPaymentCardProps) {
  return (
    <PortalCard
      title="Balance & payments"
      description="Live consolidated liability on your account (principal, penalties, and interest)."
    >
      <div className="rounded-xl border border-stone-100 bg-portal-peach-muted/50 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Balance due (summary)
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-portal-ochre">
          {CURRENT_BALANCE.total}
        </p>
        <p className="mt-2 text-xs text-stone-600 sm:text-sm">
          Principal {CURRENT_BALANCE.principal} · Penalties{" "}
          {CURRENT_BALANCE.penalties} · Interest {CURRENT_BALANCE.interest}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onMakePayment}
          className="inline-flex w-full items-center justify-center rounded-full bg-portal-ochre px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-portal-ochre-hover sm:w-auto sm:min-w-[11rem]"
        >
          Make a Payment
        </button>
        <button
          type="button"
          onClick={onViewDebtBreakdown}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-portal-link hover:underline"
        >
          <span>Debt breakdown (itemized)</span>
          <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
        </button>
      </div>
    </PortalCard>
  );
}
