import { AlertTriangle, ChevronRight } from "lucide-react";
import { PortalCard } from "@/components/ui/PortalCard";
import { NOTICES_INBOX, REFUND_DISPLAY, SECTION_48_ACTIVE } from "@/data/portal";
import { HorizontalRefundStepper } from "./HorizontalRefundStepper";

type RefundTrackerCardProps = {
  onOpenNoticesCenter: (noticeId?: string) => void;
};

function primaryViolationNoticeId(): string | undefined {
  const row = NOTICES_INBOX.find(
    (n) => n.category === "Violation" && n.actionRequired,
  );
  return row?.id;
}

export function RefundTrackerCard({
  onOpenNoticesCenter,
}: RefundTrackerCardProps) {
  const hold = SECTION_48_ACTIVE;
  const linkNoticeId = primaryViolationNoticeId() ?? "L-123";

  return (
    <PortalCard
      title="Refund status"
      description={REFUND_DISPLAY.summaryLine}
      className={hold ? "ring-1 ring-amber-200/80" : ""}
    >
      {hold ? (
        <div
          role="alert"
          className="-mt-1 mb-4 rounded-xl border border-amber-400/90 bg-amber-50 px-4 py-3 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 gap-2.5">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
                aria-hidden
              />
              <div>
                <p className="text-sm font-semibold text-amber-950">
                  Refund on hold — compliance review
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-900/95 sm:text-sm">
                  Your expected refund cannot advance while{" "}
                  <strong className="font-semibold">Notice L-123</strong> and a
                  related <strong>Section 48 Violation</strong> remain open. Open
                  the <strong className="font-semibold">Notices Center</strong>{" "}
                  to review the income discrepancy and next steps.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenNoticesCenter(linkNoticeId)}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-amber-800/25 bg-white px-3 py-1.5 text-xs font-semibold text-amber-950 transition hover:bg-amber-100/80 sm:text-sm"
            >
              Notices Center
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Expected refund
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-portal-brown">
            {REFUND_DISPLAY.amount}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenNoticesCenter()}
          className="text-xs font-semibold text-portal-link hover:underline sm:text-sm"
        >
          Related notices
        </button>
      </div>

      <HorizontalRefundStepper refundOnHold={hold} />
    </PortalCard>
  );
}
