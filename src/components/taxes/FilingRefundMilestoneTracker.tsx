import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { HorizontalRefundStepper } from "@/components/dashboard/HorizontalRefundStepper";

type Step = {
  id: string;
  label: string;
  state: "done" | "hold" | "pending";
};

const HOLD_STEPS: Step[] = [
  { id: "filed", label: "Filed", state: "done" },
  { id: "processing", label: "Processing", state: "done" },
  { id: "on_hold", label: "On hold", state: "hold" },
  { id: "approved", label: "Approved", state: "pending" },
  { id: "sent", label: "Sent", state: "pending" },
];

type FilingRefundMilestoneTrackerProps = {
  /** When true, inserts an explicit On hold segment between Processing and Approved. */
  refundOnHold: boolean;
};

export function FilingRefundMilestoneTracker({
  refundOnHold,
}: FilingRefundMilestoneTrackerProps) {
  if (!refundOnHold) {
    return <HorizontalRefundStepper refundOnHold={false} />;
  }

  return (
    <div className="mt-2" role="group" aria-label="Refund progress with hold">
      <ol className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
        {HOLD_STEPS.map((m, i) => {
          const isHold = m.state === "hold";
          const done = m.state === "done";

          let circleClass =
            "border-stone-200 bg-white text-stone-400";
          if (isHold) {
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
              {i < HOLD_STEPS.length - 1 ? (
                <div
                  className={`absolute left-[calc(50%+1.25rem)] top-5 hidden h-0.5 w-[calc(100%-2.5rem)] sm:block ${
                    isHold ? "bg-amber-200" : "bg-stone-200"
                  }`}
                  aria-hidden
                />
              ) : null}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${circleClass}`}
              >
                {isHold ? (
                  <AlertTriangle className="h-5 w-5" aria-hidden />
                ) : done ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                ) : (
                  <Circle className="h-5 w-5" aria-hidden />
                )}
              </div>
              <p
                className={`mt-3 text-xs font-semibold sm:text-sm ${
                  isHold ? "text-amber-900" : "text-portal-brown"
                }`}
              >
                {m.label}
              </p>
              {isHold ? (
                <p className="mt-1 max-w-[9rem] text-[10px] font-medium leading-snug text-amber-800 sm:text-xs">
                  Refund paused — see Notice {`L-123`}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
