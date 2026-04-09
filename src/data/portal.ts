/** Shared mock data for Taxpayer 360 / Agentforce grounding */

export const TAXPAYER = {
  name: "Alex Thompson",
  tinMasked: "XXX-XX-1234",
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
  { form: "W-2", employer: "Thompson Analytics Ltd", amount: "£75,000" },
  { form: "1099-INT", payer: "Global Savings Bank", amount: "£500" },
];
