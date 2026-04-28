/** Shared mock data for Taxpayer 360 / Agentforce grounding */

export const TAXPAYER = {
  name: "Carlos Lopez",
  tinMasked: "XXX-XX-1234",
} as const;

/** Contact & mailing — Profile & Identity pillar */
export const PROFILE_CONTACT = {
  email: "carlos.lopez@email.example",
  phone: "+44 7700 900123",
  mailingAddress: "12 Parliament Row, London SW1A 1AA",
} as const;

/** Registered disability / accessibility flags on record */
export const PROFILE_DISABILITY_STATUSES = [
  {
    label: "Registered visual impairment",
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

/** Dependents with verification path and historical claim dates */
export const HOUSEHOLD_DEPENDENTS = [
  {
    name: "Sarah Lopez",
    relationship: "Dependent",
    verificationStatus: "document-verified" as const,
    claimedSince: "2018",
  },
  {
    name: "Thomas Lopez",
    relationship: "Dependent",
    verificationStatus: "self-attested" as const,
    claimedSince: "2021",
  },
] as const;

/** Agentforce Profile Health Check (login-time signal) */
export const PROFILE_HEALTH_CHECK = {
  status: "consistent" as const,
  headline: "Household structure matches prior-year filings",
  detail:
    "Spouse and two dependents align with your 2023–2024 returns. No structural conflicts detected.",
} as const;

/** Active PAYE tax codes (UK-style demo) */
export const PAYE_TAX_CODES = [
  {
    code: "1257L",
    employer: "Lopez Analytics Ltd",
    effectiveFrom: "6 Apr 2025",
    description: "Cumulative, standard personal allowance",
  },
] as const;

/** Approved exemptions / credits on file */
export const APPROVED_TAX_CREDITS = [
  {
    name: "Child Tax Credit",
    detail: "Two qualifying children",
    amount: "Up to £2,000 / year",
    status: "approved" as const,
  },
  {
    name: "Blind Person's Allowance",
    detail: "Registered blind",
    amount: "£3,070 / year",
    status: "approved" as const,
  },
] as const;

/** Saved bank details for refunds / direct deposit */
export const DIRECT_DEPOSIT_ACCOUNT = {
  institution: "Global Savings Bank",
  sortCodeMasked: "**-**-12",
  accountLast4: "8842",
  verified: true,
  verifiedAt: "2 Mar 2025",
} as const;

export const SECTION_48_ACTIVE = true;
export const ACTIVE_NOTICE_IDS = ["CP14", "L-123"] as const;

export const PAYMENT_HISTORY = [
  {
    id: "1",
    label: "Q4 Estimated Payment",
    date: "Dec 15, 2025",
    amount: "£2,400",
    status: "Success" as const,
  },
  {
    id: "2",
    label: "Q3 Estimated Payment",
    date: "Sep 15, 2025",
    amount: "£2,400",
    status: "Success" as const,
  },
  {
    id: "3",
    label: "Q2 Estimated Payment",
    date: "Jun 15, 2025",
    amount: "£2,200",
    status: "Success" as const,
  },
];

export const INCOME_ON_FILE = [
  { form: "W-2", employer: "Lopez Analytics Ltd", amount: "£75,000" },
  { form: "1099-NEC", payer: "SwiftRide Platform Ltd", amount: "£4,200" },
  { form: "1099-INT", payer: "Global Savings Bank", amount: "£500" },
];
