import { FileUp, FileDown } from "lucide-react";

const notices = [
  {
    id: "CP14",
    title: "CP14 — Balance Due",
    date: "Mar 2, 2026",
    summary:
      "We calculated a balance due on your account based on your filed return and payments received.",
    actionRequired: false,
  },
  {
    id: "L-123",
    title: "L-123 — Information Request",
    date: "Mar 28, 2026",
    summary:
      "Supporting documentation is needed to reconcile foreign interest reporting with third-party data.",
    actionRequired: true,
    discrepancySummary:
      "Our records show £500 in reportable foreign interest (Form 1099-INT equivalent) that does not match the amount declared on your return. Please review Notice L-123 and upload substantiation or amend your filing.",
  },
] as const;

export function NoticesView() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Notices Center
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Correspondence and compliance actions in one place.
        </p>
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <article
            key={n.id}
            className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  {n.date}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-portal-brown">
                  {n.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">
                  {n.summary}
                </p>
              </div>
              {n.actionRequired ? (
                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  Action Required
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                  Informational
                </span>
              )}
            </div>

            {n.actionRequired && "discrepancySummary" in n ? (
              <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
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
        ))}
      </div>
    </div>
  );
}
