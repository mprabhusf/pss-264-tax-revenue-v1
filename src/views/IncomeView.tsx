import {
  APPROVED_TAX_CREDITS,
  INCOME_ON_FILE,
  INCOME_RECORDS,
  PAYE_TAX_CODES,
} from "@/data/portal";
import { SectionCard } from "@/components/portal/SectionCard";
import { useTaxpayer360 } from "@/context/Taxpayer360Context";
import {
  BadgeCheck,
  Bot,
  Briefcase,
  Building2,
  Landmark,
  Shield,
} from "lucide-react";

export function IncomeView() {
  const { linkedBankAccounts } = useTaxpayer360();
  const w2And1099 = INCOME_ON_FILE;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">Income</h1>
        <p className="mt-1 text-sm text-stone-600">
          Information returns, withholding elections, credits, and linked accounts
          on your Taxpayer 360 record.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
        <h2 className="text-lg font-semibold text-portal-brown">
          Income on file (withholding crosswalk)
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Employer or payer, form type, amount, and withholding codes where
          applicable.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-stone-100">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Employer / payer</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Withholding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {INCOME_RECORDS.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium text-portal-brown">
                    {row.form}
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {row.employerOrPayer}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-900">
                    {row.amount}
                  </td>
                  <td className="px-4 py-3 font-mono text-stone-800">
                    {row.taxCode ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionCard
        icon={Briefcase}
        title="Employment & Income Data"
        description="Real-time summary of information returns: W-2 (employer) and 1099 (gig, interest, and other). Withholding elections (Form W-4 and California DE-4) show how pay is taxed at source."
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
                <tr
                  key={`${row.form}-${"employer" in row ? row.employer : row.payer}`}
                >
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
              Active withholding elections
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
              can explain how your <strong>W-4</strong> and{" "}
              <strong>DE-4</strong> settings affect take-home pay. Try:{" "}
              <span className="font-medium text-stone-900">
                &quot;How does my withholding affect my pay?&quot;
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
          <ul className="mt-4 space-y-3">
            {linkedBankAccounts.map((acct) => (
              <li
                key={acct.id}
                className={`rounded-xl border bg-stone-50/50 px-4 py-4 ${
                  acct.isRefundDestination
                    ? "border-portal-ochre/50 ring-1 ring-portal-ochre/25"
                    : "border-stone-100"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-stone-900">{acct.displayLabel}</p>
                  {acct.isRefundDestination ? (
                    <span className="rounded-full bg-portal-ochre/15 px-2.5 py-0.5 text-xs font-semibold text-portal-brown">
                      Refund destination
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                      Linked account
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-stone-600">{acct.institution}</p>
                <p className="mt-2 font-mono text-sm text-stone-700">
                  Routing {acct.sortCodeMasked} · Ending {acct.last4}
                </p>
                {acct.verified ? (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
                    <BadgeCheck className="h-4 w-4" />
                    Verified · {acct.verifiedAt ?? "—"}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-amber-800">
                    Verification required before the next deposit.
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-stone-600">
            Review this account before filing to avoid refund delays. Update
            details if your institution or account has changed.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
