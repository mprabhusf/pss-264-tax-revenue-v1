import type { Taxpayer360Snapshot } from "@/context/Taxpayer360Context";
import { LEDGER_BALANCE_USD, REFUND_DISPLAY } from "@/data/portal";
import {
  humanReadableBackendStatus,
  MOCK_TAX_FILING,
} from "@/data/taxFiling";
import { formatIsoDateEnUS, formatUsd, monthNameLongEnUS } from "@/lib/usTaxFormat";
import type {
  AssistantReply,
  ConfirmInstallmentPlanAction,
  ConfirmPendingPaymentAction,
} from "./chatTypes";

function lastThreePayments(s: Taxpayer360Snapshot) {
  return [...s.paymentLedger]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 3);
}

function refundAccount(s: Taxpayer360Snapshot) {
  return s.linkedBankAccounts.find((a) => a.isRefundDestination);
}

function chaseCheckingAccount(s: Taxpayer360Snapshot) {
  return (
    s.linkedBankAccounts.find((a) => a.last4 === "4492") ??
    s.linkedBankAccounts[0]
  );
}

function looksLikeEstimatedTaxPaymentIntent(q: string): boolean {
  return (
    (q.includes("estimated") || q.includes("estimate")) &&
    (q.includes("$") || q.includes("1,000") || q.includes("1000"))
  );
}

function looksLikeInstallmentIntent(q: string): boolean {
  if (looksLikeEstimatedTaxPaymentIntent(q)) return false;
  return (
    q.includes("installment") ||
    q.includes("installments") ||
    q.includes("payment plan") ||
    q.includes("pay in installments") ||
    q.includes("pay over time") ||
    q.includes("can't pay") ||
    q.includes("cannot pay") ||
    q.includes("cant pay") ||
    q.includes("all at once") ||
    q.includes("at once")
  );
}

/** Scenario A: granular debt breakdown (principal / penalties / interest). */
function replyDebtBreakdown(snapshot: Taxpayer360Snapshot): AssistantReply {
  const t = snapshot.currentBalance.total;
  const p = snapshot.currentBalance.principal;
  const pen = snapshot.currentBalance.penalties;
  const i = snapshot.currentBalance.interest;
  return {
    text: [
      `The **${t}** balance consists of **${p}** in principal tax, **${pen}** in late reporting and Failure to Pay penalties, and **${i}** in real-time accrued interest (through the statement date).`,
      "",
      "Would you like to see the **due dates** for these charges?",
    ].join("\n"),
  };
}

/** Follow-up: assessment-style due dates (demo). */
function replyChargeDueDates(): AssistantReply {
  return {
    text: [
      "**Due dates (demo)**",
      "",
      "• **Principal tax** — tied to the original return due date (**April 15, 2025**); any extension on file applies to **filing** only.",
      "• **Failure to File / Failure to Pay penalties** — penalty accrual generally begins the day after the return due date (here from **April 16, 2025** onward for this stack).",
      "• **Interest** — accrues daily from the **due date of the underlying tax** until the balance is paid in full.",
    ].join("\n"),
  };
}

/** Scenario B: conversational installment plan with in-chat confirmation. */
function replyInstallmentPlanProposal(
  snapshot: Taxpayer360Snapshot,
): AssistantReply {
  const acct = chaseCheckingAccount(snapshot);
  const label = acct?.displayLabel ?? "your Chase account on file";
  const total = LEDGER_BALANCE_USD.total;
  const monthly = 50;
  const months = 10;
  const action: ConfirmInstallmentPlanAction = {
    id: "confirm-installment-plan-agent-demo",
    kind: "confirm_installment_plan",
    label: "Confirm Plan",
    monthlyPayment: monthly,
    months,
    totalDebt: total,
    bankLabel: label,
    bankAccountId: acct?.id ?? "chase-1",
  };

  return {
    text: [
      "I can help with that.",
      "",
      `Based on your **${formatUsd(total)}** balance, I can set up an **installment plan** of **${formatUsd(monthly)}**/month for **${months} months**. I'll use **${label}** for the auto-drafts.`,
      "",
      "Should I finalize this setup for you now? Tap **Confirm Plan** below to activate it in your Taxpayer 360 record (demo).",
    ].join("\n"),
    actions: [action],
  };
}

function amountWordsForProse(amountStr: string): string {
  const n = amountStr.replace(/[$,]/g, "");
  const num = Number.parseFloat(n);
  if (!Number.isFinite(num)) return amountStr;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/** Notice L-123 / Section 48 — legal-style interpretation (RAG simulation). */
function replyNoticeL123AndRefundHold(snapshot: Taxpayer360Snapshot): AssistantReply {
  const bal = snapshot.currentBalance.total;
  const exp = formatUsd(snapshot.taxFiling.expectedAmount);
  const acc = formatUsd(snapshot.taxFiling.acceptedAmount);
  return {
    text: [
      "Your refund is on hold because **Notice L-123** identifies **$500** of interest income from a **1099-INT** that was missing from your return. This resulted in a **Section 48 Violation.**",
      "",
      `Would you like me to show you how this affects your total balance? Right now your **expected refund** is **${exp}** (your calculation) versus the **accepted amount** of **${acc}** after the agency adjustment, and your **current outstanding liability** is **${bal}**.`,
      "",
      `_Backend code **${snapshot.taxFiling.backendStatusCode}** maps to **${humanReadableBackendStatus(snapshot.taxFiling.backendStatusCode)}**_`,
    ].join("\n"),
  };
}

function replyDiscrepancyMath(snapshot: Taxpayer360Snapshot): AssistantReply {
  const tf = snapshot.taxFiling;
  const diff = tf.expectedAmount - tf.acceptedAmount;
  return {
    text: [
      "**Refund & liability math (grounded)**",
      "",
      `• **Expected refund (your calculation):** ${formatUsd(tf.expectedAmount)}`,
      `• **Accepted amount (agency):** ${formatUsd(tf.acceptedAmount)}`,
      `• **Difference:** ${formatUsd(diff)} — tied to **${tf.noticeReference}** (${tf.holdReason}).`,
      `• **Outstanding liability:** ${snapshot.currentBalance.total}`,
      "",
      `Status code **${tf.backendStatusCode}** → **${humanReadableBackendStatus(tf.backendStatusCode)}**`,
    ].join("\n"),
  };
}

/** Scenario A: last three tax payments + 2024 liability + current balance. */
function replyLastThreeTaxPayments(snapshot: Taxpayer360Snapshot): AssistantReply {
  const rows = lastThreePayments(snapshot);
  const [q4, q3, q2] = [rows[0], rows[1], rows[2]];
  const ty = q4?.taxYear ?? "2024";
  const q4Amt = q4 ? amountWordsForProse(q4.amount) : "$1,200";
  const q4Month = q4 ? monthNameLongEnUS(q4.date) : "January";
  const q3Month = q3 ? monthNameLongEnUS(q3.date) : "October";
  const q2Month = q2 ? monthNameLongEnUS(q2.date) : "July";

  const text = [
    `I see your Q4 estimated payment of ${q4Amt} in ${q4Month}, your Q3 payment in ${q3Month}, and your Q2 payment in ${q2Month}. All were applied to your **${ty}** liability. Your current balance is **${snapshot.currentBalance.total}**.`,
    "",
    "_Grounded from your Taxes Paid History (Taxpayer 360 ledger)._",
  ].join("\n");

  return { text };
}

/** Scenario B: pay $1,000 estimated for Q1 — offer Confirm Payment in chat. */
function replyConversationalQ1Estimated1000(
  snapshot: Taxpayer360Snapshot,
): AssistantReply {
  const acct = chaseCheckingAccount(snapshot);
  const label = acct?.displayLabel ?? "your verified Chase account";
  const iso = new Date().toISOString().slice(0, 10);
  const dateDisplay = formatIsoDateEnUS(iso);
  const action: ConfirmPendingPaymentAction = {
    id: "confirm-q1-2025-est-1000",
    kind: "confirm_pending_payment",
    label: "Confirm Payment",
    paymentDate: iso,
    dateDisplay,
    amount: "$1,000.00",
    taxYear: "2025",
    quarter: "Q1",
    ledgerLabel: "Q1 2025 estimated tax (federal + California)",
    paymentType: "Estimated Tax",
    status: "Success",
  };

  return {
    text: [
      "I can help with that. I'll use your **verified " +
        label +
        "**. Should I process this **$1,000.00** tax payment for your **2025 Q1** obligation now?",
      "",
      "_Tap **Confirm Payment** below to post this row to your ledger (demo)._",
    ].join("\n"),
    actions: [action],
  };
}

export function getAssistantReply(
  userText: string,
  snapshot: Taxpayer360Snapshot,
): AssistantReply {
  const q = userText.toLowerCase().trim();

  if (
    q === "yes" ||
    q === "y" ||
    q === "yes." ||
    q.includes("yes that's correct") ||
    q.includes("yes, that's correct") ||
    q.includes("still correct") ||
    q.includes("confirm that's correct")
  ) {
    return {
      text: [
        "Thanks — I've **recorded your confirmation** that your **refund destination** is still correct.",
        "",
        "Your **Profile & Household** tab now reflects the same linked account for California and federal refund deposits.",
        "",
        "_Demo: this updates shared Taxpayer 360 state when you confirm in chat._",
      ].join("\n"),
    };
  }

  const installmentIntent = looksLikeInstallmentIntent(q);

  if (installmentIntent && snapshot.installmentPlan?.status === "active") {
    const p = snapshot.installmentPlan;
    return {
      text: [
        `You already have an **active installment agreement**: **${formatUsd(p.monthlyPayment)}**/month for **${p.months} months**, with auto-drafts from **${p.bankLabel}** (Taxpayer 360).`,
        "",
        "Open **Payments & Ledger** for the plan dashboard and payoff summary (demo).",
      ].join("\n"),
    };
  }

  if (
    installmentIntent &&
    snapshot.installmentPlan?.status === "pending_agency_review"
  ) {
    return {
      text: [
        "You already have an **installment plan application** submitted for **agency review** through the portal.",
        "",
        "Watch your **Notices Center** and **Payments & Ledger** for status updates (demo).",
      ].join("\n"),
    };
  }

  if (
    installmentIntent &&
    !snapshot.installmentPlan &&
    !snapshot.paymentPlanEligible
  ) {
    return {
      text: [
        "Installment agreements are not shown as available on this account in the current demo snapshot.",
        "",
        "You can still **make a partial payment** from **Payments & Ledger** or use the phone number on your notice for payment options.",
      ].join("\n"),
    };
  }

  if (
    installmentIntent &&
    !snapshot.installmentPlan &&
    snapshot.paymentPlanEligible
  ) {
    return replyInstallmentPlanProposal(snapshot);
  }

  if (q.includes("update refund bank") || q.includes("switch refund")) {
    return {
      text: [
        "I can move your refund to another linked account. On file you also have **Wells Fargo ending in 8842**.",
        "",
        "Say **use wells fargo for refunds** to switch in this demo (updates your Taxpayer 360 state), or open **Profile & Household** to review all linked accounts.",
      ].join("\n"),
    };
  }

  if (q.includes("err_code_48") || q.includes("err code 48")) {
    const tf = snapshot.taxFiling;
    return {
      text: [
        `**${tf.backendStatusCode}** (backend) translates to:`,
        "",
        "**" + humanReadableBackendStatus(tf.backendStatusCode) + "**",
        "",
        "It is tied to **Notice L-123** and the **$500** Form **1099-INT** income adjustment on your account.",
      ].join("\n"),
    };
  }

  if (
    (q.includes("refund") && q.includes("hold")) ||
    q.includes("why is my refund on hold")
  ) {
    return replyNoticeL123AndRefundHold(snapshot);
  }

  if (
    q.includes("l-123") ||
    q.includes("l123") ||
    (q.includes("explain") && q.includes("notice") && q.includes("l"))
  ) {
    return replyNoticeL123AndRefundHold(snapshot);
  }

  const wantsDebtBreakdown =
    (q.includes("why") && q.includes("owe")) ||
    q.includes("break down my balance") ||
    q.includes("breakdown my balance") ||
    (q.includes("break down") && q.includes("balance"));

  if (wantsDebtBreakdown) {
    return replyDebtBreakdown(snapshot);
  }

  if (
    (q.includes("due date") || q.includes("due dates")) &&
    (q.includes("charge") ||
      q.includes("penalt") ||
      q.includes("interest") ||
      q.includes("principal") ||
      q.includes("these") ||
      (q.includes("balance") && q.includes("due")))
  ) {
    return replyChargeDueDates();
  }

  if (
    (q.includes("balance") || q.includes("discrepancy")) &&
    (q.includes("affect") ||
      q.includes("affects") ||
      q.includes("math") ||
      (q.includes("show") && q.includes("how")))
  ) {
    return replyDiscrepancyMath(snapshot);
  }

  if (
    (q.includes("last three") || q.includes("last 3")) &&
    q.includes("payment") &&
    (q.includes("tax") || q.includes("reconcil"))
  ) {
    return replyLastThreeTaxPayments(snapshot);
  }

  if (
    q.includes("pay") &&
    (q.includes("estimated") || q.includes("estimate")) &&
    (q.includes("$") || q.includes("1,000") || q.includes("1000")) &&
    q.includes("q1")
  ) {
    return replyConversationalQ1Estimated1000(snapshot);
  }

  if (
    q.includes("pay") &&
    (q.includes("estimated") || q.includes("estimate")) &&
    (q.includes("$") || q.includes("1,000") || q.includes("1000")) &&
    !q.includes("q1")
  ) {
    const acct = refundAccount(snapshot);
    const label = acct?.displayLabel ?? "your linked bank account";
    return {
      text: [
        "I can schedule **$1,000** toward **2025 Q1 estimated tax** (federal **Form 1040-ES** + California **FTB 3519** pattern) using **" +
          label +
          "**.",
        "",
        "Say **I'd like to pay my $1,000 estimated tax for Q1** for the in-chat **Confirm Payment** flow, or reply **confirm payment** to post a demo row.",
        "",
        "_Grounded from your payment preferences and ledger._",
      ].join("\n"),
    };
  }

  if (q.includes("confirm payment")) {
    return {
      text: [
        "**Payment intent acknowledged (demo)**",
        "",
        "I would submit **$1,000.00** as **2025 Q1 estimated tax** from **" +
          (refundAccount(snapshot)?.displayLabel ?? "your refund bank") +
          "** after you completed IRS / FTB identity verification.",
        "",
        "Reply again with **confirm payment** from the input, or use the **Confirm Payment** button when offered after the Q1 payment prompt.",
      ].join("\n"),
    };
  }

  if (
    q.includes("income") &&
    (q.includes("file") || q.includes("record") || q.includes("on file"))
  ) {
    const lines = snapshot.incomeRecords.map((row) => {
      const code = row.taxCode ? ` · Withholding: **${row.taxCode}**` : "";
      return `• **${row.form}** — ${row.employerOrPayer}: **${row.amount}**${code}`;
    });
    return {
      text: [
        "Here is the income we currently have on file for your account (California / federal):",
        "",
        ...lines,
        "",
        "_Grounded from Forms W-2 and 1099 on your Taxpayer 360 record._",
      ].join("\n"),
    };
  }

  if (
    q.includes("payment") &&
    (q.includes("confirm") ||
      q.includes("last") ||
      q.includes("recent") ||
      q.includes("three") ||
      q.includes("last 3") ||
      q.includes("3 payments")) &&
    !(q.includes("last three") || q.includes("last 3"))
  ) {
    const rows = lastThreePayments(snapshot);
    const lines = rows.map(
      (p) =>
        `• **${p.paymentType}** — **${p.amount}** on ${p.dateDisplay} (${p.taxYear} **${p.quarter}**, ${p.status})`,
    );
    return {
      text: [
        "Here are your **last three** ledger entries (most recent first):",
        "",
        ...lines,
        "",
        `Current outstanding liability: **${snapshot.currentBalance.total}** (principal ${snapshot.currentBalance.principal}, penalties ${snapshot.currentBalance.penalties}, interest ${snapshot.currentBalance.interest}).`,
        "",
        "_Grounded from Taxes & Filing / Payments ledger._",
      ].join("\n"),
    };
  }

  if (q.includes("cp2000") || q.includes("notice cp")) {
    return {
      text: [
        "**Notice CP2000 — IRS proposed changes (RAG interpretation)**",
        "",
        "Source documents: IRS Notice CP2000, federal Form 1099-INT from your financial institution, and your filed Form 1040.",
        "",
        "This notice proposes a **$500 interest income adjustment**: the amount reported to the IRS does not match what was declared on your return. Until you respond (agree, disagree with explanation, or file **Form 1040-X**), the matter can keep your **federal refund** on hold.",
        "",
        "_For the active **Section 48** / **L-123** hold on your account, see **Notice L-123** in Notices Center._",
      ].join("\n"),
    };
  }

  if (
    (q.includes("notices") || q.includes("notice")) &&
    (q.includes("check") ||
      q.includes("for notices") ||
      q.includes("list") ||
      q.includes("open") ||
      q.includes("show") ||
      q.includes("what") ||
      q.includes("any"))
  ) {
    const lines = snapshot.notices.map(
      (n) =>
        `• **${n.id}** (${n.category}, ${n.read ? "Read" : "Unread"}) — ${n.title}`,
    );
    return {
      text: [
        "**Notices on your account**",
        "",
        ...lines,
        "",
        "Open **Notices Center** for full text and actions. **Notice L-123** (Section 48) is currently driving your **refund hold**.",
        "",
        "_Grounded from the notices inbox on your Taxpayer 360 record._",
      ].join("\n"),
    };
  }

  if (q.includes("refund") && q.includes("status")) {
    return {
      text: [
        `Your expected refund is **${REFUND_DISPLAY.amount}**, but progress is **on hold** between **Processing** and **Approved** while **Notice ${MOCK_TAX_FILING.noticeReference}** (${MOCK_TAX_FILING.holdReason}) remains open.`,
        "",
        "Resolve the notice or submit the requested documentation to allow the refund to move to **Sent**.",
      ].join("\n"),
    };
  }

  if (
    (q.includes("profile") && q.includes("health")) ||
    (q.includes("household") &&
      (q.includes("prior") ||
        q.includes("consistent") ||
        q.includes("check") ||
        q.includes("years")))
  ) {
    return {
      text: [
        "**Profile Health Check (grounded)**",
        "",
        `**${snapshot.profileHealth.headline}**`,
        "",
        snapshot.profileHealth.detail,
        "",
        "This compares your current **dependents** (with claimed-since dates and consistency flags) to prior **California Form 540** and **federal Form 1040** filings.",
        "",
        "_Source: taxpayer master + household history._",
      ].join("\n"),
    };
  }

  if (
    q.includes("paye") ||
    q.includes("w-4") ||
    q.includes("w4") ||
    q.includes("de-4") ||
    q.includes("withholding") ||
    q.includes("tax code") ||
    q.includes("1257l") ||
    (q.includes("take-home") || q.includes("take home")) ||
    (q.includes("code") && q.includes("pay"))
  ) {
    const lines = snapshot.payeCodes.map(
      (row) =>
        `• **${row.code}** — ${row.employer}, effective **${row.effectiveFrom}**. ${row.description}`,
    );
    return {
      text: [
        "**How federal and California withholding affects take-home pay**",
        "",
        ...lines,
        "",
        "Your **Form W-4** drives federal withholding; your **California Form DE-4** adjusts state (PIT) withholding. More allowances or lower “extra withholding” generally **increases** take-home; fewer allowances or more extra withholding **decreases** it.",
        "",
        "Exact paystub impact depends on gross wages, pre-tax deductions, and local taxes — your employer’s payroll system is authoritative.",
        "",
        "_Grounded from withholding elections on file._",
      ].join("\n"),
    };
  }

  return {
    text: [
      "I can help with **refund holds**, **Notice L-123** / **Section 48**, **ERR_CODE_48**, **refund vs accepted amounts**, **last three tax payments**, **balance breakdown** (principal / penalties / interest), **installment plans**, **notices**, and **payments** — grounded in your Taxpayer 360 data.",
      "",
      "Try the suggested prompts, or rephrase your question.",
    ].join("\n"),
  };
}
