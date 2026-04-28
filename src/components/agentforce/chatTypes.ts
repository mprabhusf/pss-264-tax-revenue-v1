import type { PaymentLedgerStatus } from "@/data/portal";

/** In-chat action: confirm a pending payment from Agentforce (updates shared ledger). */
export type ConfirmPendingPaymentAction = {
  id: string;
  kind: "confirm_pending_payment";
  label: string;
  paymentDate: string;
  dateDisplay: string;
  amount: string;
  taxYear: string;
  quarter: string;
  ledgerLabel: string;
  paymentType: string;
  status: PaymentLedgerStatus;
};

/** In-chat action: confirm Agent-proposed installment plan (Taxpayer 360 state). */
export type ConfirmInstallmentPlanAction = {
  id: string;
  kind: "confirm_installment_plan";
  label: string;
  monthlyPayment: number;
  months: number;
  totalDebt: number;
  bankLabel: string;
  bankAccountId: string;
};

export type ChatAssistantAction =
  | ConfirmPendingPaymentAction
  | ConfirmInstallmentPlanAction;

export type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ChatAssistantAction[];
};

export type AssistantReply = {
  text: string;
  actions?: ChatAssistantAction[];
};
