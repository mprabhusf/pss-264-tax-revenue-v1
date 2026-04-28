import { Sparkles } from "lucide-react";
import { NOTICES_INBOX, PROFILE_HEALTH_CHECK, TAXPAYER } from "@/data/portal";

type WelcomeBannerAndAgenticSummaryProps = {
  onOpenNoticesCenter: () => void;
};

export function WelcomeBannerAndAgenticSummary({
  onOpenNoticesCenter,
}: WelcomeBannerAndAgenticSummaryProps) {
  const unreadCount = NOTICES_INBOX.filter((n) => !n.read).length;
  const actionRequiredCount = NOTICES_INBOX.filter(
    (n) => n.actionRequired && !n.read,
  ).length;

  const agenticLine =
    unreadCount > 0 ? (
      <>
        You have{" "}
        <span className="font-semibold text-portal-brown">{unreadCount}</span>{" "}
        new item{unreadCount === 1 ? "" : "s"} in your{" "}
        <button
          type="button"
          onClick={onOpenNoticesCenter}
          className="font-semibold text-portal-link underline decoration-portal-link/30 underline-offset-2 hover:text-blue-800"
        >
          Notices Center
        </button>
        {actionRequiredCount > 0 ? (
          <>
            .{" "}
            <span className="font-medium text-amber-900">
              {actionRequiredCount} require{actionRequiredCount === 1 ? "s" : ""}{" "}
              a response.
            </span>
          </>
        ) : null}
      </>
    ) : (
      <>
        <span className="font-medium text-portal-brown">
          {PROFILE_HEALTH_CHECK.headline}
        </span>
        — {PROFILE_HEALTH_CHECK.detail}
      </>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-br from-portal-peach-muted via-white to-portal-peach/40 shadow-[var(--shadow-portal-card)] ring-1 ring-amber-100/50">
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Home
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-portal-brown sm:text-2xl">
            Welcome back, {TAXPAYER.preferredFirstName}
          </h1>
        </div>
      </div>
      <div className="border-t border-amber-200/40 bg-blue-50/50 px-5 py-4 sm:px-6">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-portal-link ring-1 ring-blue-200/70">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-900/80">
              Agentforce summary
            </p>
            <p className="mt-1 text-sm leading-relaxed text-stone-800">
              {agenticLine}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
