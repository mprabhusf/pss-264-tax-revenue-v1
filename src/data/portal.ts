/** Shared mock data for Taxpayer 360 / Agentforce grounding — California, USA */

import { MOCK_TAX_FILING } from "./taxFiling";

export type IncomeFormType = "W-2" | "1099-NEC" | "1099-INT";
export type NoticeCategory = "Confirmation" | "Violation";

export const TAXPAYER = {
  /** Greeting name for Agentforce / UX copy */
  preferredFirstName: "Carlos",
  /** Legal name on record */
  name: "Carlos Lopez",
  tinMasked: "XXX-XX-1234",
} as const;

/** Contact & mailing — Profile & Identity pillar */
export const PROFILE_CONTACT = {
  email: "carlos.lopez@email.example",
  phone: "+1 (916) 555-0142",
  mailingAddress: "455 Capitol Mall, Suite 1200, Sacramento, CA 95814",
} as const;

/** Registered disability / accessibility flags on record */
export const PROFILE_DISABILITY_STATUSES = [
  {
    label: "Blindness (federal / California standard deduction basis)",
    registered: true,
    since: "2019",
  },
  {
    label: "Mobility support (self-reported)",
    registered: false,
    since: "—",
  },
] as const;

/** Spouse row for household mapping */
export const HOUSEHOLD_SPOUSE = {
  name: "Maria Lopez",
  relationship: "Spouse",
  verificationStatus: "document-verified" as const,
  claimedSince: "2015",
} as const;

/** Dependents: name, claimed since, consistency vs filings */
export const HOUSEHOLD_DEPENDENTS = [
  {
    name: "Sarah Lopez",
    relationship: "Dependent",
    verificationStatus: "document-verified" as const,
    claimedSince: "2018",
    consistencyWithFiling: true as const,
  },
  {
    name: "Thomas Lopez",
    relationship: "Dependent",
    verificationStatus: "self-attested" as const,
    claimedSince: "2021",
    consistencyWithFiling: true as const,
  },
] as const;

/** Agentforce Profile Health Check (login-time signal) */
export const PROFILE_HEALTH_CHECK = {
  status: "consistent" as const,
  headline: "Household structure matches prior-year filings",
  detail:
    "Spouse and two dependents align with your 2023 California Form 540 and federal Form 1040. No structural conflicts detected.",
  /** Reference filing year for Agentforce onboarding copy */
  filingReferenceYear: "2022",
} as const;

/**
 * Federal Form W-4 and California Form DE-4 withholding on file (demo).
 * Kept export name `PAYE_TAX_CODES` for stable imports — content is U.S. payroll.
 */
export const PAYE_TAX_CODES = [
  {
    code: "Federal — Form W-4 (2024)",
    employer: "Lopez Analytics LLC",
    effectiveFrom: "Jan 1, 2026",
    description:
      "Single filing status; Step 3 dependents credit $4,000; no extra withholding (IRS Pub. 15-T, California wage tables).",
  },
  {
    code: "California — Form DE-4",
    employer: "Lopez Analytics LLC",
    effectiveFrom: "Jan 1, 2026",
    description:
      "CA PIT withholding: standard allowances; aligns with Franchise Tax Board withholding schedules.",
  },
] as const;

/** Income summary: employer/payer, form type, amount, withholding crosswalk */
export const INCOME_RECORDS = [
  {
    id: "w2-1",
    form: "W-2" as const,
    employerOrPayer: "Lopez Analytics LLC",
    amount: "$95,000",
    taxCode: "Matches W-4 on file",
  },
  {
    id: "nec-1",
    form: "1099-NEC" as const,
    employerOrPayer: "SwiftRide Technologies Inc.",
    amount: "$4,200",
    taxCode: null,
  },
  {
    id: "int-1",
    form: "1099-INT" as const,
    employerOrPayer: "Wells Fargo Bank, N.A.",
    amount: "$500",
    taxCode: null,
  },
] as const;

/** Legacy shape for older imports — derived from INCOME_RECORDS */
export const INCOME_ON_FILE = INCOME_RECORDS.map((row) =>
  row.form === "W-2"
    ? { form: "W-2" as const, employer: row.employerOrPayer, amount: row.amount }
    : {
        form: row.form,
        payer: row.employerOrPayer,
        amount: row.amount,
      },
);

/** Approved credits / deductions on file (federal + CA framing) */
export const APPROVED_TAX_CREDITS = [
  {
    name: "Child Tax Credit (federal)",
    detail: "Two qualifying children (IRS rules)",
    amount: "Up to $2,000 / year",
    status: "approved" as const,
  },
  {
    name: "Additional standard deduction (blind)",
    detail: "Federal Schedule A basis on file",
    amount: "$1,950 / year",
    status: "approved" as const,
  },
] as const;

/** Linked bank accounts — initial seed for Taxpayer360Context */
export const INITIAL_LINKED_BANK_ACCOUNTS = [
  {
    id: "chase-1",
    institution: "JPMorgan Chase Bank, N.A.",
    displayLabel: "Chase checking ending in 4492",
    last4: "4492",
    sortCodeMasked: "***021000021",
    isRefundDestination: true,
    verified: true,
    verifiedAt: "Jan 12, 2026",
  },
  {
    id: "wells-1",
    institution: "Wells Fargo Bank, N.A.",
    displayLabel: "Wells Fargo ending in 8842",
    last4: "8842",
    sortCodeMasked: "***121000248",
    isRefundDestination: false,
    verified: true,
    verifiedAt: "Mar 2, 2025",
  },
] as const;

/** @deprecated Use INITIAL_LINKED_BANK_ACCOUNTS + Taxpayer360Context */
export const DIRECT_DEPOSIT_ACCOUNT = {
  institution: INITIAL_LINKED_BANK_ACCOUNTS[0].institution,
  sortCodeMasked: INITIAL_LINKED_BANK_ACCOUNTS[0].sortCodeMasked,
  accountLast4: INITIAL_LINKED_BANK_ACCOUNTS[0].last4,
  verified: INITIAL_LINKED_BANK_ACCOUNTS[0].verified,
  verifiedAt: INITIAL_LINKED_BANK_ACCOUNTS[0].verifiedAt,
} as const;

/** True when return/refund is blocked for compliance (Section 48 / notice hold). */
export const SECTION_48_ACTIVE = MOCK_TAX_FILING.status === "On-Hold";

/** Home / refund tracker — expected refund per return (USD; demo). */
export const REFUND_DISPLAY = {
  amount: "$2,500.00",
  summaryLine: "Federal refund — tax year 2024 (your calculation)",
} as const;
export const ACTIVE_NOTICE_IDS = ["L-123", "CP2000", "CP14"] as const;

export type PaymentLedgerStatus = "Success" | "Pending" | "Failed";

/** US tax payment ledger row — amounts in USD; dates ISO (YYYY-MM-DD). */
export type PaymentLedgerRow = {
  id: string;
  label: string;
  date: string;
  /** Display as MM/DD/YYYY (en-US) */
  dateDisplay: string;
  amount: string;
  quarter: string;
  taxYear: string;
  status: PaymentLedgerStatus;
  /** e.g. Estimated Tax, Balance Due, Extension, Amended Return */
  paymentType: string;
};

/** Tax years available for estimated / balance workflows (US). */
export const US_TAX_FILING_YEARS = ["2026", "2025", "2024", "2023"] as const;

/** Payment types for Make a Payment (Taxes & Filing / portal). */
export const US_TAX_FILING_PAYMENT_TYPES = [
  "Estimated Tax",
  "Balance Due",
  "Extension",
  "Amended Return",
  "Installment",
] as const;

/**
 * Historical tax payments (USD). Most recent first for reconciliation demos.
 * Quarters follow IRS federal estimated calendar (Q1–Q4).
 */
export const PAYMENT_LEDGER_ROWS: PaymentLedgerRow[] = [
  {
    id: "pay-2025-01-15-q4-24",
    label: "Q4 2024 estimated tax (federal + California)",
    date: "2025-01-15",
    dateDisplay: "01/15/2025",
    amount: "$1,200.00",
    quarter: "Q4",
    taxYear: "2024",
    status: "Success",
    paymentType: "Estimated Tax",
  },
  {
    id: "pay-2024-10-15-q3-24",
    label: "Q3 2024 estimated tax (federal + California)",
    date: "2024-10-15",
    dateDisplay: "10/15/2024",
    amount: "$1,200.00",
    quarter: "Q3",
    taxYear: "2024",
    status: "Success",
    paymentType: "Estimated Tax",
  },
  {
    id: "pay-2024-07-15-q2-24",
    label: "Q2 2024 estimated tax (federal + California)",
    date: "2024-07-15",
    dateDisplay: "07/15/2024",
    amount: "$1,200.00",
    quarter: "Q2",
    taxYear: "2024",
    status: "Success",
    paymentType: "Estimated Tax",
  },
  {
    id: "pay-2024-04-15-q1-24",
    label: "Q1 2024 estimated tax (federal + California)",
    date: "2024-04-15",
    dateDisplay: "04/15/2024",
    amount: "$1,100.00",
    quarter: "Q1",
    taxYear: "2024",
    status: "Success",
    paymentType: "Estimated Tax",
  },
];

/** Legacy — aligned with PAYMENT_LEDGER_ROWS for chips / older replies */
export const PAYMENT_HISTORY = PAYMENT_LEDGER_ROWS.map((r) => ({
  id: r.id,
  label: r.label,
  date: r.dateDisplay,
  amount: r.amount,
  status: r.status as "Success" | "Pending",
}));

/** Current outstanding liability (USD) — Taxpayer 360 ledger totals. */
export const CURRENT_BALANCE = {
  total: "$500.00",
  principal: "$400.00",
  penalties: "$75.00",
  interest: "$25.00",
} as const;

/** Numeric ledger totals (USD) for calculations in portal + Agentforce. */
export const LEDGER_BALANCE_USD = {
  total: 500,
  principal: 400,
  penalties: 75,
  interest: 25,
} as const;

/** Granular balance lines for Payments & Ledger + Agentforce (US terminology). */
export const BALANCE_LINE_ITEMS = [
  {
    id: "principal",
    category: "Principal tax",
    amount: "$400.00",
    detail:
      "Original tax owed on the assessed balance (return as filed, net of credits).",
  },
  {
    id: "penalties",
    category: "Penalties",
    amount: "$75.00",
    detail:
      "Late filing / late payment — includes Failure to File and Failure to Pay (Internal Revenue Code sections 6651(a)(1) and 6651(a)(2)) on this account.",
  },
  {
    id: "interest",
    category: "Interest",
    amount: "$25.00",
    detail:
      "Underpayment interest accrued to the statement date (compounded per IRS rules).",
  },
] as const;

/** Whether the taxpayer may apply for an IRS/FTB-style installment agreement (demo). */
export const PAYMENT_PLAN_ELIGIBLE = true as const;

/** Notices inbox — read/unread + category (IRS / CA-style demo) */
export const NOTICES_INBOX = [
  {
    id: "L-123",
    title: "Notice L-123 — Income Reporting Discrepancy",
    date: "2026-03-20",
    category: "Violation" as const,
    read: false,
    summary:
      "Legal notice: agency records do not match the interest income reported on your filed return. A refund hold applies until the matter is resolved.",
    actionRequired: true,
    resolutionStatus: "Action required" as const,
    discrepancySummary:
      "We identified approximately **$500** in interest income (Form 1099-INT) that was not included on your return. This adjustment is classified as a **Section 48 Violation** and affects your refund calculation until you respond or amend your filing.",
  },
  {
    id: "CP2000",
    title: "CP2000 — IRS Underreported Income",
    date: "2026-03-28",
    category: "Violation" as const,
    read: false,
    summary:
      "The IRS proposes changes to your return based on third-party information (e.g., Form 1099-INT). Review the notice and respond by the due date.",
    actionRequired: true,
    resolutionStatus: "Action required" as const,
    discrepancySummary:
      "Our records show $500 in reportable interest (Form 1099-INT) that does not match the amount on your federal return. Please review Notice CP2000 and submit an explanation, amended return (Form 1040-X), or agree to the changes in IRS Online Account.",
  },
  {
    id: "CP14",
    title: "CP14 — Balance Due (IRS)",
    date: "2026-03-02",
    category: "Confirmation" as const,
    read: true,
    summary:
      "The IRS calculated a balance due on your account based on your filed return and payments received.",
    actionRequired: false,
    resolutionStatus: "Under review" as const,
  },
  {
    id: "ACK-881",
    title: "Acknowledgement — e-file accepted",
    date: "2026-02-14",
    category: "Confirmation" as const,
    read: true,
    summary:
      "Your California Form 540 and federal Form 1040 for tax year 2024 were accepted for processing.",
    actionRequired: false,
    resolutionStatus: "Accepted" as const,
  },
] as const;
