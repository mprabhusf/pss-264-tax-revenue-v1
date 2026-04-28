import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PORTAL_DEBT_BREAKDOWN_ANCHOR_ID,
  PORTAL_DEBT_SCROLL_SESSION_KEY,
} from "@/components/dashboard";
import { useTaxpayer360 } from "@/context/Taxpayer360Context";
import {
  CURRENT_BALANCE,
  LEDGER_BALANCE_USD,
  US_TAX_FILING_PAYMENT_TYPES,
  US_TAX_FILING_YEARS,
} from "@/data/portal";
import { formatIsoDateEnUS, formatUsd } from "@/lib/usTaxFormat";

const INSTALLMENT_SECTION_ANCHOR_ID = "portal-payments-installment-plan";

const INSTALLMENT_DURATIONS = [3, 6, 12] as const;

export function PaymentsLedgerView() {
  const {
    paymentLedger,
    appendLedgerPayment,
    getSnapshot,
    installmentPlan,
    submitInstallmentPlanApplication,
    linkedBankAccounts,
  } = useTaxpayer360();

  const snapshot = getSnapshot();
  const [taxYear, setTaxYear] =
    useState<(typeof US_TAX_FILING_YEARS)[number]>("2025");
  const [payType, setPayType] =
    useState<(typeof US_TAX_FILING_PAYMENT_TYPES)[number]>("Estimated Tax");
  const [amount, setAmount] = useState("500");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [wizardMonths, setWizardMonths] =
    useState<(typeof INSTALLMENT_DURATIONS)[number]>(12);

  const defaultDraftAccount = useMemo(() => {
    return (
      linkedBankAccounts.find((a) => a.last4 === "4492") ??
      linkedBankAccounts.find((a) => a.isRefundDestination) ??
      linkedBankAccounts[0]
    );
  }, [linkedBankAccounts]);

  const wizardMonthly = useMemo(() => {
    const cents = Math.ceil(
      (LEDGER_BALANCE_USD.total * 100) / wizardMonths,
    );
    return cents / 100;
  }, [wizardMonths]);

  const scrollToInstallment = useCallback(() => {
    document.getElementById(INSTALLMENT_SECTION_ANCHOR_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const sortedLedger = useMemo(
    () =>
      [...paymentLedger].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    [paymentLedger],
  );

  useEffect(() => {
    if (sessionStorage.getItem(PORTAL_DEBT_SCROLL_SESSION_KEY) !== "1") return;
    sessionStorage.removeItem(PORTAL_DEBT_SCROLL_SESSION_KEY);
    const id = PORTAL_DEBT_BREAKDOWN_ANCHOR_ID;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const showInstallmentWizard = installmentPlan === null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Payments & Ledger
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Current balance, tax paid history, and payment workflow.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-portal-peach-muted/40 p-5 shadow-[var(--shadow-portal-card)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Current outstanding liability
        </p>
        <p className="mt-1 text-3xl font-semibold text-portal-ochre">
          {snapshot.currentBalance.total}
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Principal {snapshot.currentBalance.principal} · Penalties{" "}
          {snapshot.currentBalance.penalties} · Interest{" "}
          {snapshot.currentBalance.interest}
        </p>
        {installmentPlan?.status === "active" ? (
          <p className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-sm font-medium text-emerald-950">
            Active installment plan: {formatUsd(installmentPlan.monthlyPayment)}
            /month × {installmentPlan.months} months via{" "}
            {installmentPlan.bankLabel}.
          </p>
        ) : installmentPlan?.status === "pending_agency_review" ? (
          <p className="mt-3 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-sm font-medium text-amber-950">
            Installment application submitted for agency review (
            {installmentPlan.submittedAtDisplay}).
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div
          id={PORTAL_DEBT_BREAKDOWN_ANCHOR_ID}
          className="scroll-mt-28 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)] lg:col-span-3"
        >
          <h2 className="text-lg font-semibold text-portal-brown">
            Balance breakdown
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Outstanding obligations in USD — principal, penalties, and accrued
            interest (Taxpayer 360 ledger).
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-stone-100">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-amber-200/50 bg-portal-peach text-xs font-semibold uppercase tracking-wide text-portal-brown">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description (US)</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {snapshot.balanceLineItems.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 1 ? "bg-portal-peach/20" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {row.category}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{row.detail}</td>
                    <td className="px-4 py-3 text-right font-semibold text-stone-900">
                      {row.amount}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-stone-200 bg-stone-50/80">
                  <td
                    colSpan={2}
                    className="px-4 py-3 font-semibold text-portal-brown"
                  >
                    Total balance
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-semibold text-portal-ochre">
                    {snapshot.currentBalance.total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-stone-500">
            {snapshot.paymentPlanEligible
              ? "Installment agreement: you are flagged as eligible to apply online in this demo."
              : "Installment agreement: not currently eligible in this demo — contact the agency using the number on your notice."}
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <button
            type="button"
            className="rounded-full bg-portal-ochre px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-portal-ochre-hover"
          >
            Pay full balance
          </button>
          <button
            type="button"
            onClick={scrollToInstallment}
            className="rounded-full border-2 border-portal-brown/40 bg-white px-4 py-3.5 text-center text-sm font-semibold text-portal-brown shadow-sm transition hover:bg-portal-peach/50"
          >
            Set up installment plan
          </button>
        </div>
      </div>

      <div
        id={INSTALLMENT_SECTION_ANCHOR_ID}
        className="scroll-mt-28 space-y-6 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]"
      >
        <h2 className="text-lg font-semibold text-portal-brown">
          Installment plan
        </h2>

        {installmentPlan?.status === "active" ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Plan active
            </p>
            <p className="mt-2 text-sm text-emerald-950">
              Your balance is enrolled in an installment agreement. Auto-drafts
              are scheduled from{" "}
              <strong className="font-semibold">{installmentPlan.bankLabel}</strong>
              .
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-500">Monthly draft</dt>
                <dd className="font-semibold text-stone-900">
                  {formatUsd(installmentPlan.monthlyPayment)}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Term</dt>
                <dd className="font-semibold text-stone-900">
                  {installmentPlan.months} months
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Total covered</dt>
                <dd className="font-semibold text-stone-900">
                  {formatUsd(installmentPlan.totalDebt)}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Source</dt>
                <dd className="font-semibold text-stone-900">
                  {installmentPlan.source === "agentforce"
                    ? "Agentforce (confirmed in chat)"
                    : "Portal application"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-stone-500">Activated</dt>
                <dd className="font-semibold text-stone-900">
                  {installmentPlan.submittedAtDisplay}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-stone-600">
              Demo: the manual installment application is disabled while a plan
              is active. Next draft date would appear here in production.
            </p>
          </div>
        ) : installmentPlan?.status === "pending_agency_review" ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
              Agency review
            </p>
            <p className="mt-2 text-sm text-amber-950">
              We received your installment plan application on{" "}
              <strong>{installmentPlan.submittedAtDisplay}</strong>. No further
              action is needed until the agency posts a decision.
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-600">Proposed monthly</dt>
                <dd className="font-semibold text-stone-900">
                  {formatUsd(installmentPlan.monthlyPayment)}
                </dd>
              </div>
              <div>
                <dt className="text-stone-600">Duration</dt>
                <dd className="font-semibold text-stone-900">
                  {installmentPlan.months} months
                </dd>
              </div>
              <div>
                <dt className="text-stone-600">Draft account</dt>
                <dd className="font-semibold text-stone-900">
                  {installmentPlan.bankLabel}
                </dd>
              </div>
              <div>
                <dt className="text-stone-600">Debt amount</dt>
                <dd className="font-semibold text-stone-900">
                  {formatUsd(installmentPlan.totalDebt)}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

        {showInstallmentWizard ? (
          <div className="rounded-xl border border-stone-100 bg-portal-peach-muted/30 p-5">
            <p className="text-sm font-medium text-portal-brown">
              Installment plan application
            </p>
            <ol className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
              <li
                className={`rounded-full px-3 py-1 ${wizardStep === 1 ? "bg-portal-ochre text-white" : "bg-white ring-1 ring-stone-200"}`}
              >
                1 · Select debt
              </li>
              <li
                className={`rounded-full px-3 py-1 ${wizardStep === 2 ? "bg-portal-ochre text-white" : "bg-white ring-1 ring-stone-200"}`}
              >
                2 · Duration
              </li>
              <li
                className={`rounded-full px-3 py-1 ${wizardStep === 3 ? "bg-portal-ochre text-white" : "bg-white ring-1 ring-stone-200"}`}
              >
                3 · Review & submit
              </li>
            </ol>

            {wizardStep === 1 ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm text-stone-600">
                  Choose which balance to include in this application.
                </p>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-white p-4 ring-portal-ochre/30 has-[:checked]:ring-2">
                  <input
                    type="radio"
                    name="debt-scope"
                    defaultChecked
                    className="mt-1"
                  />
                  <span>
                    <span className="font-semibold text-stone-900">
                      Full outstanding balance
                    </span>
                    <span className="mt-0.5 block text-sm text-stone-600">
                      {CURRENT_BALANCE.total} (principal + penalties + interest)
                    </span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="mt-2 rounded-full bg-portal-ochre px-5 py-2.5 text-sm font-semibold text-white hover:bg-portal-ochre-hover"
                >
                  Continue
                </button>
              </div>
            ) : null}

            {wizardStep === 2 ? (
              <div className="mt-5 space-y-4">
                <p className="text-sm text-stone-600">
                  Select a repayment duration. Monthly amounts are estimated for
                  this demo (rounded up to the next cent bucket).
                </p>
                <div className="flex flex-wrap gap-2">
                  {INSTALLMENT_DURATIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWizardMonths(m)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        wizardMonths === m
                          ? "bg-portal-brown text-white"
                          : "bg-white text-portal-brown ring-1 ring-stone-200 hover:bg-portal-peach"
                      }`}
                    >
                      {m} months
                    </button>
                  ))}
                </div>
                <p className="text-sm text-stone-700">
                  Estimated monthly payment:{" "}
                  <strong>{formatUsd(wizardMonthly)}</strong> for{" "}
                  <strong>{wizardMonths}</strong> months on{" "}
                  <strong>
                    {defaultDraftAccount?.displayLabel ?? "your linked account"}
                  </strong>
                  .
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="rounded-full bg-portal-ochre px-5 py-2.5 text-sm font-semibold text-white hover:bg-portal-ochre-hover"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : null}

            {wizardStep === 3 ? (
              <div className="mt-5 space-y-4">
                <p className="text-sm text-stone-600">
                  Review your installment request before sending it for{" "}
                  <strong>agency review</strong> (demo — no funds move).
                </p>
                <ul className="space-y-2 rounded-xl border border-stone-100 bg-white p-4 text-sm text-stone-800">
                  <li className="flex justify-between gap-4">
                    <span className="text-stone-500">Total debt</span>
                    <span className="font-semibold">
                      {formatUsd(LEDGER_BALANCE_USD.total)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-stone-500">Duration</span>
                    <span className="font-semibold">{wizardMonths} months</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-stone-500">Monthly payment</span>
                    <span className="font-semibold">
                      {formatUsd(wizardMonthly)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-stone-500">Draft account</span>
                    <span className="text-right font-semibold">
                      {defaultDraftAccount?.displayLabel ?? "—"}
                    </span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!defaultDraftAccount) return;
                      submitInstallmentPlanApplication({
                        totalDebt: LEDGER_BALANCE_USD.total,
                        months: wizardMonths,
                        monthlyPayment: wizardMonthly,
                        bankAccountId: defaultDraftAccount.id,
                        bankLabel: defaultDraftAccount.displayLabel,
                      });
                      setWizardStep(1);
                    }}
                    className="rounded-full bg-portal-ochre px-5 py-2.5 text-sm font-semibold text-white hover:bg-portal-ochre-hover"
                  >
                    Submit for agency review
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
        <h2 className="text-lg font-semibold text-portal-brown">
          Make a payment
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Select tax year and payment type, enter an amount, then continue
          (demo — no funds move).
        </p>
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const raw = amount.replace(/[^\d.]/g, "");
            const num = Number.parseFloat(raw);
            if (!Number.isFinite(num) || num <= 0) {
              setSubmitted("Enter a valid amount.");
              return;
            }
            const usd = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(num);
            const iso = new Date().toISOString().slice(0, 10);
            appendLedgerPayment({
              label: `${taxYear} ${payType} (Payments & Ledger)`,
              date: iso,
              dateDisplay: formatIsoDateEnUS(iso),
              amount: usd,
              quarter: "—",
              taxYear,
              status: "Pending",
              paymentType: payType,
            });
            setSubmitted(
              `Scheduled **${usd}** toward **${payType}** for **${taxYear}** (demo).`,
            );
          }}
        >
          <label className="block text-sm">
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
          <label className="block text-sm">
            <span className="font-medium text-stone-700">Payment type</span>
            <select
              value={payType}
              onChange={(e) =>
                setPayType(
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
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-stone-700">Amount (USD)</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              className="mt-1 w-full max-w-xs rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-portal-link focus:bg-white focus:ring-2 focus:ring-portal-link/20"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-portal-ochre px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-portal-ochre-hover"
            >
              Continue to pay
            </button>
          </div>
        </form>
        {submitted ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950">
            {submitted.replace(/\*\*/g, "")}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[var(--shadow-portal-card)]">
        <div className="border-b border-stone-100 bg-portal-peach-muted/80 px-6 py-4">
          <h2 className="text-lg font-semibold text-portal-brown">
            Tax paid history
          </h2>
          <p className="mt-0.5 text-sm text-stone-600">
            Ledger from Taxpayer 360 (includes agent-initiated demo rows when
            present).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-amber-200/50 bg-portal-peach text-xs font-semibold uppercase tracking-wide text-portal-brown">
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Payment date</th>
                <th className="px-6 py-3">Tax year</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Quarter</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedLedger.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 1 ? "bg-portal-peach/25" : "bg-white"}
                >
                  <td className="px-6 py-4 font-medium text-portal-link">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 font-mono text-stone-600">
                    {row.dateDisplay}
                  </td>
                  <td className="px-6 py-4 text-stone-700">{row.taxYear}</td>
                  <td className="px-6 py-4 text-stone-700">{row.paymentType}</td>
                  <td className="px-6 py-4 text-stone-700">{row.quarter}</td>
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {row.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === "Success"
                          ? "bg-emerald-50 text-emerald-800"
                          : row.status === "Pending"
                            ? "bg-amber-50 text-amber-900"
                            : "bg-rose-50 text-rose-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
