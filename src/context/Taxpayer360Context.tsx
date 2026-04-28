import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BALANCE_LINE_ITEMS,
  CURRENT_BALANCE,
  HOUSEHOLD_DEPENDENTS,
  INCOME_RECORDS,
  INITIAL_LINKED_BANK_ACCOUNTS,
  NOTICES_INBOX,
  PAYE_TAX_CODES,
  PAYMENT_LEDGER_ROWS,
  PAYMENT_PLAN_ELIGIBLE,
  PROFILE_HEALTH_CHECK,
  SECTION_48_ACTIVE,
  TAXPAYER,
  type PaymentLedgerRow,
} from "@/data/portal";
import { MOCK_TAX_FILING } from "@/data/taxFiling";

export type LinkedBankAccount = {
  id: string;
  institution: string;
  displayLabel: string;
  last4: string;
  sortCodeMasked: string;
  isRefundDestination: boolean;
  verified: boolean;
  verifiedAt?: string;
};

export type InstallmentPlanSource = "portal_wizard" | "agentforce";

export type InstallmentPlanRecord = {
  status: "pending_agency_review" | "active";
  source: InstallmentPlanSource;
  totalDebt: number;
  months: number;
  monthlyPayment: number;
  bankLabel: string;
  bankAccountId: string;
  submittedAtDisplay: string;
};

export type Taxpayer360Snapshot = {
  preferredFirstName: string;
  legalName: string;
  tinMasked: string;
  dependents: {
    name: string;
    claimedSince: string;
    consistencyWithFiling: boolean;
  }[];
  incomeRecords: typeof INCOME_RECORDS;
  payeCodes: typeof PAYE_TAX_CODES;
  linkedBankAccounts: LinkedBankAccount[];
  paymentLedger: PaymentLedgerRow[];
  currentBalance: typeof CURRENT_BALANCE;
  balanceLineItems: typeof BALANCE_LINE_ITEMS;
  paymentPlanEligible: typeof PAYMENT_PLAN_ELIGIBLE;
  installmentPlan: InstallmentPlanRecord | null;
  notices: typeof NOTICES_INBOX;
  profileHealth: typeof PROFILE_HEALTH_CHECK;
  section48Active: boolean;
  taxFiling: typeof MOCK_TAX_FILING;
};

function cloneAccounts(): LinkedBankAccount[] {
  return INITIAL_LINKED_BANK_ACCOUNTS.map((a) => ({ ...a }));
}

function cloneLedger(): PaymentLedgerRow[] {
  return PAYMENT_LEDGER_ROWS.map((r) => ({ ...r }));
}

type Taxpayer360ContextValue = {
  linkedBankAccounts: LinkedBankAccount[];
  paymentLedger: PaymentLedgerRow[];
  installmentPlan: InstallmentPlanRecord | null;
  setRefundDestination: (accountId: string) => void;
  confirmRefundBankUnchanged: () => void;
  appendLedgerPayment: (row: Omit<PaymentLedgerRow, "id"> & { id?: string }) => void;
  submitInstallmentPlanApplication: (params: {
    totalDebt: number;
    months: number;
    monthlyPayment: number;
    bankAccountId: string;
    bankLabel: string;
  }) => void;
  activateInstallmentPlanFromAgent: (params: {
    totalDebt: number;
    months: number;
    monthlyPayment: number;
    bankAccountId: string;
    bankLabel: string;
  }) => void;
  getSnapshot: () => Taxpayer360Snapshot;
};

const Taxpayer360Context = createContext<Taxpayer360ContextValue | null>(null);

function stampSubmittedAt(): string {
  return new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Taxpayer360Provider({ children }: { children: ReactNode }) {
  const [linkedBankAccounts, setLinkedBankAccounts] =
    useState<LinkedBankAccount[]>(cloneAccounts);
  const [paymentLedger, setPaymentLedger] =
    useState<PaymentLedgerRow[]>(cloneLedger);
  const [installmentPlan, setInstallmentPlan] =
    useState<InstallmentPlanRecord | null>(null);

  const setRefundDestination = useCallback((accountId: string) => {
    setLinkedBankAccounts((prev) =>
      prev.map((a) => ({
        ...a,
        isRefundDestination: a.id === accountId,
      })),
    );
  }, []);

  const confirmRefundBankUnchanged = useCallback(() => {
    setLinkedBankAccounts((prev) => {
      const refund = prev.find((a) => a.isRefundDestination);
      if (!refund) return prev;
      const stamp = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return prev.map((a) =>
        a.id === refund.id ? { ...a, verified: true, verifiedAt: stamp } : a,
      );
    });
  }, []);

  const appendLedgerPayment = useCallback(
    (row: Omit<PaymentLedgerRow, "id"> & { id?: string }) => {
      const id = row.id ?? `pay-${Date.now()}`;
      setPaymentLedger((prev) => [{ ...row, id } as PaymentLedgerRow, ...prev]);
    },
    [],
  );

  const submitInstallmentPlanApplication = useCallback(
    (params: {
      totalDebt: number;
      months: number;
      monthlyPayment: number;
      bankAccountId: string;
      bankLabel: string;
    }) => {
      setInstallmentPlan({
        status: "pending_agency_review",
        source: "portal_wizard",
        totalDebt: params.totalDebt,
        months: params.months,
        monthlyPayment: params.monthlyPayment,
        bankLabel: params.bankLabel,
        bankAccountId: params.bankAccountId,
        submittedAtDisplay: stampSubmittedAt(),
      });
    },
    [],
  );

  const activateInstallmentPlanFromAgent = useCallback(
    (params: {
      totalDebt: number;
      months: number;
      monthlyPayment: number;
      bankAccountId: string;
      bankLabel: string;
    }) => {
      setInstallmentPlan({
        status: "active",
        source: "agentforce",
        totalDebt: params.totalDebt,
        months: params.months,
        monthlyPayment: params.monthlyPayment,
        bankLabel: params.bankLabel,
        bankAccountId: params.bankAccountId,
        submittedAtDisplay: stampSubmittedAt(),
      });
    },
    [],
  );

  const getSnapshot = useCallback((): Taxpayer360Snapshot => {
    return {
      preferredFirstName: TAXPAYER.preferredFirstName,
      legalName: TAXPAYER.name,
      tinMasked: TAXPAYER.tinMasked,
      dependents: HOUSEHOLD_DEPENDENTS.map((d) => ({
        name: d.name,
        claimedSince: d.claimedSince,
        consistencyWithFiling: d.consistencyWithFiling,
      })),
      incomeRecords: INCOME_RECORDS,
      payeCodes: PAYE_TAX_CODES,
      linkedBankAccounts,
      paymentLedger,
      currentBalance: CURRENT_BALANCE,
      balanceLineItems: BALANCE_LINE_ITEMS,
      paymentPlanEligible: PAYMENT_PLAN_ELIGIBLE,
      installmentPlan,
      notices: NOTICES_INBOX,
      profileHealth: PROFILE_HEALTH_CHECK,
      section48Active: SECTION_48_ACTIVE,
      taxFiling: MOCK_TAX_FILING,
    };
  }, [linkedBankAccounts, paymentLedger, installmentPlan]);

  const value = useMemo(
    () => ({
      linkedBankAccounts,
      paymentLedger,
      installmentPlan,
      setRefundDestination,
      confirmRefundBankUnchanged,
      appendLedgerPayment,
      submitInstallmentPlanApplication,
      activateInstallmentPlanFromAgent,
      getSnapshot,
    }),
    [
      linkedBankAccounts,
      paymentLedger,
      installmentPlan,
      setRefundDestination,
      confirmRefundBankUnchanged,
      appendLedgerPayment,
      submitInstallmentPlanApplication,
      activateInstallmentPlanFromAgent,
      getSnapshot,
    ],
  );

  return (
    <Taxpayer360Context.Provider value={value}>
      {children}
    </Taxpayer360Context.Provider>
  );
}

export function useTaxpayer360() {
  const ctx = useContext(Taxpayer360Context);
  if (!ctx) {
    throw new Error("useTaxpayer360 must be used within Taxpayer360Provider");
  }
  return ctx;
}
