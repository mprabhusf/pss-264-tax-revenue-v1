import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";

export const REFUND_MILESTONES = [
  { id: "filed", label: "Filed" },
  { id: "processing", label: "Processing" },
  { id: "approved", label: "Approved" },
  { id: "sent", label: "Sent" },
] as const;

type HorizontalRefundStepperProps = {
  /** When true, Approved shows warning hold (compliance / refund pause). */
  refundOnHold: boolean;
};

export function HorizontalRefundStepper({
  refundOnHold,
}: HorizontalRefundStepperProps) {
  return (
    <div
      className="mt-2"
      role="group"
      aria-label="Refund progress"
    >
      <ol className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
        {REFUND_MILESTONES.map((m, i) => {
          const isApprovedStep = m.id === "approved";
          const warningHold = refundOnHold && isApprovedStep;
          const done: boolean =
            m.id === "filed" ||
            m.id === "processing" ||
            (!refundOnHold && m.id === "approved");

          let circleClass =
            "border-stone-200 bg-white text-stone-400";
          if (warningHold) {
            circleClass =
              "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-200/90";
          } else if (done) {
            circleClass =
              "border-portal-link bg-portal-link text-white";
          }

          return (
            <li
              key={m.id}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {i < REFUND_MILESTONES.length - 1 ? (
                <div
                  className="absolute left-[calc(50%+1.25rem)] top-5 hidden h-0.5 w-[calc(100%-2.5rem)] bg-stone-200 sm:block"
                  aria-hidden
                />
              ) : null}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${circleClass}`}
              >
                {warningHold ? (
                  <AlertTriangle className="h-5 w-5" aria-hidden />
                ) : done ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                ) : (
                  <Circle className="h-5 w-5" aria-hidden />
                )}
              </div>
              <p
                className={`mt-3 text-xs font-semibold sm:text-sm ${
                  warningHold ? "text-amber-900" : "text-portal-brown"
                }`}
              >
                {m.label}
              </p>
              {warningHold ? (
                <p className="mt-1 max-w-[10rem] text-[10px] font-medium leading-snug text-amber-800 sm:text-xs">
                  On hold
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
