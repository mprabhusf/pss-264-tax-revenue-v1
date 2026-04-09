export type NavKey =
  | "dashboard"
  | "household"
  | "taxes"
  | "payments"
  | "notices";

export const PRIMARY_NAV: {
  key: NavKey;
  label: string;
  shortLabel: string;
}[] = [
  { key: "dashboard", label: "Dashboard", shortLabel: "Dashboard" },
  { key: "household", label: "Household & Profile", shortLabel: "Household" },
  { key: "taxes", label: "Taxes & Filing", shortLabel: "Taxes" },
  { key: "payments", label: "Payments & Ledger", shortLabel: "Payments" },
  { key: "notices", label: "Notices Center", shortLabel: "Notices" },
];

export function labelForNav(key: NavKey): string {
  return PRIMARY_NAV.find((n) => n.key === key)?.label ?? key;
}
