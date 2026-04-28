import {
  APPROVED_TAX_CREDITS,
  DIRECT_DEPOSIT_ACCOUNT,
  HOUSEHOLD_DEPENDENTS,
  HOUSEHOLD_SPOUSE,
  INCOME_ON_FILE,
  PAYE_TAX_CODES,
  PROFILE_CONTACT,
  PROFILE_DISABILITY_STATUSES,
  PROFILE_HEALTH_CHECK,
  TAXPAYER,
} from "@/data/portal";
import {
  BadgeCheck,
  Bot,
  Briefcase,
  Building2,
  ClipboardCheck,
  Landmark,
  Shield,
  Sparkles,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

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

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-portal-peach/80 text-portal-brown ring-1 ring-stone-200/60">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-portal-brown">{title}</h2>
          <p className="mt-1 text-sm text-stone-600">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function HouseholdProfileView() {
  const w2And1099 = INCOME_ON_FILE;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Household & Profile
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Your core record, household structure, income on file, PAYE codes, and
          financial settings — unified for Taxpayer 360.
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
          <DefinitionRow label="Primary identifier (TIN/SSN)">
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
                </div>
                <VerificationBadge status={d.verificationStatus} />
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>

      <SectionCard
        icon={Briefcase}
        title="Employment & Income Data"
        description="Real-time summary of information returns: W-2 (employer) and 1099 (gig, interest, and other). PAYE tax codes show how pay is taxed at source."
      >
        <div className="overflow-hidden rounded-xl border border-stone-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Form</th>
                <th className="px-4 py-3">Employer / payer</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {w2And1099.map((row) => (
                <tr key={`${row.form}-${"employer" in row ? row.employer : row.payer}`}>
                  <td className="px-4 py-3 font-medium text-portal-brown">
                    {row.form}
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {"employer" in row ? row.employer : row.payer}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-900">
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-500">
          W-2 reflects employment; 1099-NEC reflects gig/freelance platform income;
          1099-INT reflects interest paid to you.
        </p>

        <div className="mt-8 border-t border-stone-100 pt-8">
          <div className="flex flex-wrap items-center gap-2">
            <Building2 className="h-5 w-5 text-portal-brown" strokeWidth={1.75} />
            <h3 className="text-sm font-semibold text-portal-brown">
              Active PAYE tax codes
            </h3>
          </div>
          <ul className="mt-4 space-y-4">
            {PAYE_TAX_CODES.map((row) => (
              <li
                key={row.code}
                className="rounded-xl border border-stone-100 bg-stone-50/50 px-4 py-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-lg font-semibold text-portal-brown">
                    {row.code}
                  </span>
                  <span className="text-xs text-stone-500">
                    Effective {row.effectiveFrom}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-700">{row.employer}</p>
                <p className="mt-2 text-sm text-stone-600">{row.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm text-stone-700">
            <Bot className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden />
            <p>
              <span className="font-semibold text-portal-brown">Agentforce</span>{" "}
              can explain how code <span className="font-mono">1257L</span> and
              your allowances affect monthly take-home. Try:{" "}
              <span className="font-medium text-stone-900">
                &quot;How does my PAYE code affect my pay?&quot;
              </span>
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={Landmark}
        title="Financial Settings & Credits"
        description="Approved credits and allowances on file, plus saved bank details for upcoming direct deposits — verify before refund season."
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Approved credits & allowances
        </h3>
        <ul className="mt-3 space-y-3">
          {APPROVED_TAX_CREDITS.map((c) => (
            <li
              key={c.name}
              className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-stone-100 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-portal-brown">{c.name}</p>
                <p className="text-sm text-stone-600">{c.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-stone-900">{c.amount}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {c.status}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-stone-100 pt-8">
          <div className="flex flex-wrap items-center gap-2">
            <Shield className="h-5 w-5 text-portal-brown" strokeWidth={1.75} />
            <h3 className="text-sm font-semibold text-portal-brown">
              Direct deposit bank account
            </h3>
          </div>
          <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/50 px-4 py-4">
            <p className="font-medium text-stone-900">
              {DIRECT_DEPOSIT_ACCOUNT.institution}
            </p>
            <p className="mt-2 font-mono text-sm text-stone-700">
              Sort code {DIRECT_DEPOSIT_ACCOUNT.sortCodeMasked} · Account ending{" "}
              {DIRECT_DEPOSIT_ACCOUNT.accountLast4}
            </p>
            {DIRECT_DEPOSIT_ACCOUNT.verified ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
                <BadgeCheck className="h-4 w-4" />
                Verified for payouts · {DIRECT_DEPOSIT_ACCOUNT.verifiedAt}
              </p>
            ) : (
              <p className="mt-3 text-sm text-amber-800">
                Verification required before the next deposit.
              </p>
            )}
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Review this account before filing to avoid refund delays. Update
            details if your institution or account has changed.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
