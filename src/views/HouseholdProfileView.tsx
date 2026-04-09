import { BadgeCheck } from "lucide-react";

const dependents = [
  {
    name: "Sarah Thompson",
    verifiedSince: "2018",
    relationship: "Dependent",
  },
  {
    name: "Thomas Thompson",
    verifiedSince: "2021",
    relationship: "Dependent",
  },
] as const;

export function HouseholdProfileView() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Household & Profile
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Profile integrity — keep household data accurate and verified.
        </p>
      </div>

      <section className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
        <h2 className="text-lg font-semibold text-portal-brown">
          Household & Dependents
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Verified dependents associated with your account support credits and
          filing consistency.
        </p>
        <ul className="mt-6 divide-y divide-stone-100">
          {dependents.map((d) => (
            <li
              key={d.name}
              className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0"
            >
              <div>
                <p className="font-semibold text-portal-brown">{d.name}</p>
                <p className="text-sm text-stone-500">
                  {d.relationship} · Verified since {d.verifiedSince}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/60">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
