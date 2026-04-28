import { useEffect, useMemo, useState } from "react";
import { Landmark, Receipt } from "lucide-react";
import { FilingRefundMilestoneTracker } from "@/components/taxes/FilingRefundMilestoneTracker";
import { PortalCard } from "@/components/ui/PortalCard";
import { useTaxpayer360 } from "@/context/Taxpayer360Context";
import {
  CURRENT_BALANCE,
  SECTION_48_ACTIVE,
  US_TAX_FILING_PAYMENT_TYPES,
  US_TAX_FILING_YEARS,
} from "@/data/portal";
import { humanReadableBackendStatus, MOCK_TAX_FILING } from "@/data/taxFiling";
import { formatIsoDateEnUS, formatUsd } from "@/lib/usTaxFormat";

export function TaxesFilingView() {
  const { paymentLedger, linkedBankAccounts, appendLedgerPayment } =
    useTaxpayer360();
  const [taxYear, setTaxYear] =
    useState<(typeof US_TAX_FILING_YEARS)[number]>("2025");
  const [paymentType, setPaymentType] =
    useState<(typeof US_TAX_FILING_PAYMENT_TYPES)[number]>("Estimated Tax");
  const [amount, setAmount] = useState("500");
  const [bankId, setBankId] = useState<string>(
    () => linkedBankAccounts[0]?.id ?? "",
  );
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    if (
      bankId &&
      !linkedBankAccounts.some((a) => a.id === bankId) &&
      linkedBankAccounts[0]
    ) {
      setBankId(linkedBankAccounts[0].id);
    }
  }, [bankId, linkedBankAccounts]);

  const sortedHistory = useMemo(
    () =>
      [...paymentLedger].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    [paymentLedger],
  );

  const primaryBank = linkedBankAccounts.find((a) => a.id === bankId);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Taxes & Filing
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-stone-600">
          US federal and California filing context (demo). Amounts are in{" "}
          <strong className="font-medium text-portal-brown">USD</strong>;
          estimated tax follows standard federal quarters (Q1–Q4). This view
          reflects a <strong>return submitted</strong> state with refund tracking
          and agency reconciliation.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <PortalCard
          title="Filing status"
          description={`Tax year ${MOCK_TAX_FILING.taxYear} — return processed; refund path subject to compliance review.`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950">
              {MOCK_TAX_FILING.status}
            </span>
            <span className="text-xs text-stone-600">
              Notice <span className="font-mono font-semibold">{MOCK_TAX_FILING.noticeReference}</span> ·{" "}
              {MOCK_TAX_FILING.holdReason}
            </span>
          </div>
          <p className="mt-4 text-sm text-stone-700">
            <span className="font-semibold text-portal-brown">Backend status:</span>{" "}
            <span className="font-mono text-stone-800">{MOCK_TAX_FILING.backendStatusCode}</span>
            <span className="text-stone-500"> — </span>
            {humanReadableBackendStatus(MOCK_TAX_FILING.backendStatusCode)}
          </p>
          <p className="mt-3 text-xs text-stone-500">
            Open <strong className="text-stone-700">Notices Center</strong> for the
            full legal text of Notice L-123 and response options.
          </p>
        </PortalCard>

        <PortalCard
          title="Refund discrepancy"
          description="Expected refund (your calculation) vs. agency accepted amount after reconciliation."
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-100 bg-stone-50/80 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Expected refund
              </dt>
              <dd className="mt-1 text-xl font-semibold text-portal-brown">
                {formatUsd(MOCK_TAX_FILING.expectedAmount)}
              </dd>
              <dd className="mt-1 text-xs text-stone-500">Your filed calculation</dd>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                Accepted amount
              </dt>
              <dd className="mt-1 text-xl font-semibold text-amber-950">
                {formatUsd(MOCK_TAX_FILING.acceptedAmount)}
              </dd>
              <dd className="mt-1 text-xs text-amber-900/90">
                Agency recalculation (after L-123 adjustment)
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-stone-700">
            <span className="font-semibold text-portal-brown">Difference:</span>{" "}
            {formatUsd(MOCK_TAX_FILING.expectedAmount - MOCK_TAX_FILING.acceptedAmount)}{" "}
            — primarily attributable to the{" "}
            <strong>income reporting discrepancy</strong> flagged on Notice L-123.
          </p>
        </PortalCard>
      </div>

      <PortalCard
        title="Refund tracker"
        description="Milestone progress for your refund. When a compliance hold applies, an On hold state appears between Processing and Approved."
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
          Stages: Filed → Processing → Approved → Sent
        </p>
        <FilingRefundMilestoneTracker refundOnHold={SECTION_48_ACTIVE} />
      </PortalCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <PortalCard
          title="Current outstanding liability"
          description="Consolidated balance due on your account (principal, penalties, and interest)."
        >
          <p className="text-3xl font-semibold tracking-tight text-portal-ochre">
            {CURRENT_BALANCE.total}
          </p>
          <p className="mt-2 text-sm text-stone-600">
            Principal {CURRENT_BALANCE.principal} · Penalties{" "}
            {CURRENT_BALANCE.penalties} · Interest {CURRENT_BALANCE.interest}
          </p>
        </PortalCard>

        <PortalCard
          title="Bank accounts on file"
          description="Verified US accounts available for tax payments and refunds."
        >
          <ul className="space-y-3">
            {linkedBankAccounts.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-100 bg-stone-50/60 px-4 py-3 text-sm"
              >
                <span className="font-medium text-portal-brown">
                  {a.displayLabel}
                </span>
                <span className="text-xs text-stone-500">{a.institution}</span>
              </li>
            ))}
          </ul>
        </PortalCard>
      </div>

      <PortalCard
        title="Taxes paid history (Release 264)"
        description="All historical tax payments from your Taxpayer 360 ledger (updates when you pay from this page or via Agentforce)."
      >
        <div className="overflow-x-auto rounded-xl border border-stone-100">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-amber-200/50 bg-portal-peach text-xs font-semibold uppercase tracking-wide text-portal-brown">
                <th className="px-4 py-3">Payment date</th>
                <th className="px-4 py-3">Tax year</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedHistory.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 1 ? "bg-portal-peach/20" : "bg-white"}
                >
                  <td className="px-4 py-3 font-mono text-stone-800">
                    {row.dateDisplay}
                  </td>
                  <td className="px-4 py-3 text-stone-700">{row.taxYear}</td>
                  <td className="px-4 py-3 text-stone-700">{row.paymentType}</td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-900">
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>

      <PortalCard
        title="Make a payment (Release 266+)"
        description="Schedule a tax payment (demo — no funds move). Entries post to the shared ledger immediately."
        footer={
          <p className="flex items-center gap-2 text-xs text-stone-500">
            <Receipt className="h-4 w-4 shrink-0 text-portal-link" aria-hidden />
            Payments also appear under <strong>Payments & Ledger</strong> and in
            Agentforce reconciliation.
          </p>
        }
      >
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const raw = amount.replace(/[^\d.]/g, "");
            const num = Number.parseFloat(raw);
            if (!Number.isFinite(num) || num <= 0) {
              setFormMessage("Enter a valid amount.");
              return;
            }
            const usd = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(num);
            const iso = new Date().toISOString().slice(0, 10);
            const quarter = "—";
            const label = `${taxYear} ${paymentType} (${primaryBank?.displayLabel ?? "linked account"})`;
            appendLedgerPayment({
              label,
              date: iso,
              dateDisplay: formatIsoDateEnUS(iso),
              amount: usd,
              quarter,
              taxYear,
              status: "Success",
              paymentType,
            });
            setFormMessage(`Scheduled **${usd}** as **${paymentType}** for **${taxYear}** (demo).`);
          }}
        >
          <label className="block text-sm sm:col-span-1">
            <span className="font-medium text-stone-700">Tax year</span>
            <select
              value={taxYear}
              onChange={(e) =>
                setTaxYear(e.target.value as (typeof US_TAX_FILING_YEARS)[number])
              }
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-portal-link focus:bg-white focus:ring-2 focus:ring-portal-link/20"
            >
              {US_TAX_FILING_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm sm:col-span-1">
            <span className="font-medium text-stone-700">Payment type</span>
            <select
              value={paymentType}
              onChange={(e) =>
                setPaymentType(
                  e.target.value as (typeof US_TAX_FILING_PAYMENT_TYPES)[number],
                )
              }
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-portal-link focus:bg-white focus:ring-2 focus:ring-portal-link/20"
            >
              {US_TAX_FILING_PAYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm sm:col-span-1">
            <span className="font-medium text-stone-700">Amount (USD)</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-portal-link focus:bg-white focus:ring-2 focus:ring-portal-link/20"
            />
          </label>
          <label className="block text-sm sm:col-span-1">
            <span className="flex items-center gap-1.5 font-medium text-stone-700">
              <Landmark className="h-4 w-4 text-portal-brown" aria-hidden />
              Bank account
            </span>
            <select
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-portal-link focus:bg-white focus:ring-2 focus:ring-portal-link/20"
            >
              {linkedBankAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.displayLabel}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-portal-ochre px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-portal-ochre-hover"
            >
              Submit payment (demo)
            </button>
          </div>
        </form>
        {formMessage ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950">
            {formMessage.replace(/\*\*/g, "")}
          </p>
        ) : null}
      </PortalCard>
    </div>
  );
}
