export type NavKey =
  | "home"
  | "household"
  | "income"
  | "taxes"
  | "payments"
  | "notices";

export const PRIMARY_NAV: {
  key: NavKey;
  label: string;
  shortLabel: string;
}[] = [
  { key: "home", label: "Home", shortLabel: "Home" },
  { key: "household", label: "Profile & Household", shortLabel: "Profile" },
  { key: "income", label: "Income", shortLabel: "Income" },
  { key: "taxes", label: "Taxes & Filing", shortLabel: "Taxes" },
  { key: "payments", label: "Payments & Ledger", shortLabel: "Payments" },
  { key: "notices", label: "Notices Center", shortLabel: "Notices" },
];

export function labelForNav(key: NavKey): string {
  return PRIMARY_NAV.find((n) => n.key === key)?.label ?? key;
}
