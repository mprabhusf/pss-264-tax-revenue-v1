import { ChevronRight, Mail } from "lucide-react";
import { useMemo } from "react";
import { PortalCard } from "@/components/ui/PortalCard";
import { NOTICES_INBOX } from "@/data/portal";

type InboxRow = (typeof NOTICES_INBOX)[number];

function noticePriority(n: InboxRow): number {
  let p = 0;
  if (!n.read) p += 10;
  if (n.actionRequired) p += 5;
  if (n.category === "Violation") p += 3;
  return p;
}

function sortActiveNotices(rows: readonly InboxRow[]): InboxRow[] {
  return [...rows].sort((a, b) => {
    const pa = noticePriority(a);
    const pb = noticePriority(b);
    if (pa !== pb) return pb - pa;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
}

type ActiveNoticesListCardProps = {
  onOpenNotice: (noticeId: string) => void;
  onViewAllNotices: () => void;
};

export function ActiveNoticesListCard({
  onOpenNotice,
  onViewAllNotices,
}: ActiveNoticesListCardProps) {
  const top = useMemo(
    () => sortActiveNotices(NOTICES_INBOX).slice(0, 5),
    [],
  );

  return (
    <PortalCard
      title="Active notices"
      description="Most recent correspondence that may need your attention."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onViewAllNotices}
            className="text-sm font-semibold text-portal-link hover:underline"
          >
            View all notices
          </button>
        </div>
      }
    >
      <ul className="divide-y divide-stone-100 rounded-xl border border-stone-100">
        {top.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => onOpenNotice(n.id)}
              className="flex w-full items-start gap-3 px-3 py-3 text-left transition hover:bg-stone-50 sm:px-4 sm:py-3.5"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  n.read ? "bg-stone-100 text-stone-500" : "bg-blue-50 text-blue-700"
                }`}
              >
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
                    {n.id}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      n.category === "Violation"
                        ? "bg-amber-100 text-amber-950"
                        : "bg-emerald-50 text-emerald-900"
                    }`}
                  >
                    {n.category}
                  </span>
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-700">
                    {n.resolutionStatus}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-portal-brown">
                  {n.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">
                  {n.date} · {n.read ? "Read" : "Unread"}
                </p>
              </div>
              <ChevronRight
                className="mt-1 h-4 w-4 shrink-0 text-stone-400"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}
