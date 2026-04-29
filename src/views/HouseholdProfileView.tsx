import {
  HOUSEHOLD_DEPENDENTS,
  HOUSEHOLD_SPOUSE,
  PROFILE_CONTACT,
  PROFILE_DISABILITY_STATUSES,
  PROFILE_HEALTH_CHECK,
  TAXPAYER,
} from "@/data/portal";
import {
  BadgeCheck,
  Bot,
  ClipboardCheck,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react";
import { SectionCard } from "@/components/portal/SectionCard";

function VerificationBadge({
  status,
}: {
  status: "document-verified" | "self-attested";
}) {
  if (status === "document-verified") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/60">
        <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
        Document-verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200/70">
      <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
      Self-attested
    </span>
  );
}

function DefinitionRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </dt>
      <dd className="text-sm text-stone-900">{children}</dd>
    </div>
  );
}

export function HouseholdProfileView() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Profile & Household
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Your core record, household structure, and profile health — unified for
          Taxpayer 360. Employment, withholding, credits, and bank details are on
          the <strong>Income</strong> tab.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/90 to-white p-6 shadow-[var(--shadow-portal-card)] ring-1 ring-blue-100/80">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
            <Sparkles className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
              Agentforce · Profile Health Check
            </p>
            <p className="mt-1 text-base font-semibold text-portal-brown">
              {PROFILE_HEALTH_CHECK.headline}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              {PROFILE_HEALTH_CHECK.detail} On each login, Agentforce can
              compare this household snapshot to prior years and flag
              inconsistencies before you file.
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-600">
              <Bot className="h-4 w-4 shrink-0 text-blue-700" aria-hidden />
              <span>
                Open the assistant and ask:{" "}
                <span className="font-medium text-stone-800">
                  &quot;Run a profile health check on my household&quot;
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <SectionCard
        icon={UserCircle}
        title="Profile & Identity"
        description="Legal identity, primary identifiers, contact details, and registered disability statuses on your core record."
      >
        <dl className="divide-y divide-stone-100">
          <DefinitionRow label="Legal name">{TAXPAYER.name}</DefinitionRow>
          <DefinitionRow label="SSN">
            {TAXPAYER.tinMasked}
          </DefinitionRow>
          <DefinitionRow label="Email">{PROFILE_CONTACT.email}</DefinitionRow>
          <DefinitionRow label="Phone">{PROFILE_CONTACT.phone}</DefinitionRow>
          <DefinitionRow label="Mailing address">
            {PROFILE_CONTACT.mailingAddress}
          </DefinitionRow>
        </dl>
        <div className="mt-6 border-t border-stone-100 pt-6">
          <h3 className="text-sm font-semibold text-portal-brown">
            Disability & accessibility (on record)
          </h3>
          <ul className="mt-3 space-y-2">
            {PROFILE_DISABILITY_STATUSES.map((row) => (
              <li
                key={row.label}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-100 bg-stone-50/60 px-4 py-3"
              >
                <span className="text-sm font-medium text-stone-900">
                  {row.label}
                </span>
                <span className="text-xs text-stone-600">
                  {row.registered ? (
                    <span className="font-semibold text-emerald-800">
                      Registered · since {row.since}
                    </span>
                  ) : (
                    <span>Self-reported · {row.since}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>

      <SectionCard
        icon={Users}
        title="Household & Dependents"
        description="Spouse and dependents with verification path (self-attested vs. document-verified) and historical claimed-since dates."
      >
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Spouse
          </h3>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-100 bg-stone-50/40 px-4 py-4">
            <div>
              <p className="font-semibold text-portal-brown">
                {HOUSEHOLD_SPOUSE.name}
              </p>
              <p className="mt-0.5 text-sm text-stone-500">
                {HOUSEHOLD_SPOUSE.relationship} · Claimed since{" "}
                {HOUSEHOLD_SPOUSE.claimedSince}
              </p>
            </div>
            <VerificationBadge status={HOUSEHOLD_SPOUSE.verificationStatus} />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Dependents
          </h3>
          <ul className="mt-3 divide-y divide-stone-100 rounded-xl border border-stone-100">
            {HOUSEHOLD_DEPENDENTS.map((d) => (
              <li
                key={d.name}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 first:rounded-t-xl last:rounded-b-xl"
              >
                <div>
                  <p className="font-semibold text-portal-brown">{d.name}</p>
                  <p className="text-sm text-stone-500">
                    {d.relationship} · Claimed since {d.claimedSince}
                  </p>
                  <p className="mt-2">
                    {d.consistencyWithFiling ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-200/70">
                        Consistent with filings
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200/70">
                        Review suggested
                      </span>
                    )}
                  </p>
                </div>
                <VerificationBadge status={d.verificationStatus} />
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}
