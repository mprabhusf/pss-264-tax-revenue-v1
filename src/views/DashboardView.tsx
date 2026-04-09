import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { SECTION_48_ACTIVE } from "@/data/portal";

const milestones = [
  { id: "filed", label: "Filed" },
  { id: "processing", label: "Processing" },
  { id: "approved", label: "Approved" },
  { id: "sent", label: "Sent" },
] as const;

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[var(--shadow-portal-card)]">
      <p className="text-sm font-medium text-stone-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-portal-brown">
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-stone-500">{sub}</p> : null}
    </div>
  );
}

export function DashboardView() {
  const hold = SECTION_48_ACTIVE;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Taxpayer 360 Dashboard
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Unified view of balance, refunds, and compliance signals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Current Balance Due" value="£500" />
        <StatCard title="Expected Refund" value="£1,450" />
        <StatCard title="Active Notices" value="2" sub="Includes action-required items" />
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
        <h2 className="text-lg font-semibold text-portal-brown">
          Refund Progress Tracker
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Estimated refund timeline for your latest return.
        </p>
        <div className="mt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {milestones.map((m, i) => {
              const isApprovedStep = m.id === "approved";
              const warningHold = hold && isApprovedStep;
              const done =
                m.id === "filed" ||
                m.id === "processing" ||
                (!hold && m.id === "approved");

              let circleClass =
                "border-stone-200 bg-white text-stone-400";
              if (warningHold) {
                circleClass =
                  "border-amber-400 bg-amber-50 text-amber-600 ring-2 ring-amber-200";
              } else if (done) {
                circleClass =
                  "border-portal-link bg-portal-link text-white";
              }

              return (
                <div
                  key={m.id}
                  className="relative flex flex-1 flex-col items-center text-center"
                >
                  {i < milestones.length - 1 ? (
                    <div
                      className="absolute left-[calc(50%+1.25rem)] top-5 hidden h-0.5 w-[calc(100%-2.5rem)] bg-stone-200 sm:block"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${circleClass}`}
                  >
                    {warningHold ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : done ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      warningHold ? "text-amber-800" : "text-portal-brown"
                    }`}
                  >
                    {m.label}
                  </p>
                  {warningHold ? (
                    <p className="mt-1 text-xs font-medium text-amber-700">
                      On hold — review required
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {hold ? (
        <div
          role="alert"
          className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm"
        >
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-950">
                Section 48 violation — Notice L-123
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
                Your refund cannot proceed to final approval while Notice{" "}
                <strong>L-123</strong> remains open. The agency has identified a
                discrepancy related to foreign interest reporting versus amounts
                on file (£500). Resolve this notice in the Notices Center to
                clear the hold on the <strong>Approved</strong> milestone.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
