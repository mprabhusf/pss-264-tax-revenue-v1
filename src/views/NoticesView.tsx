import { FileUp, FileDown, Mail, MailOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NOTICES_INBOX } from "@/data/portal";
import { useBreadcrumb } from "@/context/BreadcrumbContext";

type InboxRow = (typeof NOTICES_INBOX)[number];

export type NoticesViewProps = {
  /** When set, scroll to this notice and show secondary breadcrumb (resolution job entry). */
  focusNoticeId?: string | null;
  /** Called after scroll/highlight handoff so the parent can clear focus state. */
  onFocusConsumed?: () => void;
};

export function NoticesView({
  focusNoticeId,
  onFocusConsumed,
}: NoticesViewProps) {
  const { setSecondaryLabel, clearSecondary } = useBreadcrumb();
  const [readOverride, setReadOverride] = useState<Record<string, boolean>>({});
  const [spotlightNoticeId, setSpotlightNoticeId] = useState<string | null>(
    null,
  );

  const sorted = useMemo(() => {
    return [...NOTICES_INBOX].sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
    );
  }, []);

  const isRead = (n: InboxRow) => readOverride[n.id] ?? n.read;

  useEffect(() => {
    if (spotlightNoticeId) {
      setSecondaryLabel(`Resolve notice ${spotlightNoticeId}`);
    } else {
      clearSecondary();
    }
  }, [spotlightNoticeId, setSecondaryLabel, clearSecondary]);

  useEffect(() => {
    if (!focusNoticeId) return;
    setSpotlightNoticeId(focusNoticeId);
    const id = focusNoticeId;
    const t = window.setTimeout(() => {
      const safe =
        typeof CSS !== "undefined" && "escape" in CSS
          ? CSS.escape(id)
          : id.replace(/"/g, "");
      document
        .querySelector(`[data-notice-id="${safe}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocusConsumed?.();
    }, 100);
    return () => window.clearTimeout(t);
  }, [focusNoticeId, onFocusConsumed]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Notices Center
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Chronological inbox — read/unread status and category for each item.
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((n) => {
          const read = isRead(n);
          const isFocused = spotlightNoticeId === n.id;
          return (
            <article
              key={n.id}
              data-notice-id={n.id}
              className={`rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[var(--shadow-portal-card)] ${
                read ? "opacity-95" : "ring-1 ring-blue-200/60"
              } ${isFocused ? "ring-2 ring-portal-link ring-offset-2 ring-offset-stone-100" : ""}`}
            >
              <button
                type="button"
                onClick={() => setReadOverride((o) => ({ ...o, [n.id]: true }))}
                className="flex w-full flex-wrap items-start justify-between gap-3 text-left"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      read ? "bg-stone-100 text-stone-500" : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {read ? (
                      <MailOpen className="h-4 w-4" aria-hidden />
                    ) : (
                      <Mail className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                        {n.date}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          n.category === "Violation"
                            ? "bg-rose-100 text-rose-900"
                            : "bg-emerald-50 text-emerald-900"
                        }`}
                      >
                        {n.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          read ? "bg-stone-100 text-stone-600" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {read ? "Read" : "Unread"}
                      </span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-700">
                        {n.resolutionStatus}
                      </span>
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-portal-brown">
                      {n.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">
                      {n.summary}
                    </p>
                  </div>
                </div>
                {n.actionRequired ? (
                  <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                    Action Required
                  </span>
                ) : null}
              </button>

              {n.actionRequired && "discrepancySummary" in n ? (
                <div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                    Response Required
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
                    {n.discrepancySummary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-portal-brown/45 bg-white px-4 py-2 text-sm font-semibold text-portal-brown transition hover:bg-portal-peach/60"
                    >
                      <FileDown className="h-4 w-4" />
                      View PDF
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-portal-ochre px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-portal-ochre-hover"
                    >
                      <FileUp className="h-4 w-4" />
                      Upload Documentation
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
