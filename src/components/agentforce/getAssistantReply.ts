import {
  INCOME_ON_FILE,
  PAYMENT_HISTORY,
  PAYE_TAX_CODES,
  PROFILE_HEALTH_CHECK,
} from "@/data/portal";

export function getAssistantReply(userText: string): string {
  const q = userText.toLowerCase().trim();

  if (
    q.includes("income") &&
    (q.includes("file") || q.includes("record") || q.includes("on file"))
  ) {
    const lines = INCOME_ON_FILE.map((row) => {
      if ("employer" in row) {
        return `• **${row.form}** — ${row.employer}: **${row.amount}**`;
      }
      return `• **${row.form}** — ${row.payer}: **${row.amount}**`;
    });
    return [
      "Here is the income we currently have on file for your account:",
      "",
      ...lines,
      "",
      "_Grounded from taxpayer master + information returns._",
    ].join("\n");
  }

  if (
    q.includes("payment") &&
    (q.includes("confirm") || q.includes("last") || q.includes("recent"))
  ) {
    const lines = PAYMENT_HISTORY.map(
      (p) => `• **${p.label}** — ${p.amount} on ${p.date} (${p.status})`,
    );
    return [
      "Your recent successful payments on record:",
      "",
      ...lines,
    ].join("\n");
  }

  if (q.includes("l-123") || q.includes("l123") || q.includes("notice l")) {
    return [
      "**Notice L-123 (RAG interpretation)**",
      "",
      "Source documents: Notice L-123, Section 48 compliance rules, and third-party 1099-INT-equivalent data.",
      "",
      "This notice flags a **£500 foreign interest discrepancy**: the amount reported to the agency by your financial institution does not match what was declared on your return. Until you respond with documentation or an amended filing, the matter remains open and can place a **hold** on refund approval under Section 48.",
      "",
      "_Suggested next step: use Notices Center → Upload Documentation or View PDF._",
    ].join("\n");
  }

  if (q.includes("refund") && q.includes("status")) {
    return [
      "Your expected refund is **£1,450**, but progress is **on hold** at the **Approved** step while **Notice L-123** remains open (Section 48).",
      "",
      "Clear the notice to allow the refund to move to **Sent**.",
    ].join("\n");
  }

  if (
    (q.includes("profile") && q.includes("health")) ||
    (q.includes("household") &&
      (q.includes("prior") ||
        q.includes("consistent") ||
        q.includes("check") ||
        q.includes("years")))
  ) {
    return [
      "**Profile Health Check (grounded)**",
      "",
      `**${PROFILE_HEALTH_CHECK.headline}**`,
      "",
      PROFILE_HEALTH_CHECK.detail,
      "",
      "This compares your current **spouse and dependents** (with verification status and claimed-since dates) to prior-year filings. If something drifts — for example a dependent aged out or a duplicate claim — you would see a warning here before filing.",
      "",
      "_Source: taxpayer master + household history._",
    ].join("\n");
  }

  if (
    q.includes("paye") ||
    q.includes("tax code") ||
    q.includes("1257l") ||
    (q.includes("take-home") || q.includes("take home")) ||
    (q.includes("code") && q.includes("pay"))
  ) {
    const lines = PAYE_TAX_CODES.map(
      (row) =>
        `• **${row.code}** (${row.employer}) — effective **${row.effectiveFrom}**. ${row.description}.`,
    );
    return [
      "**How your PAYE code affects take-home pay**",
      "",
      ...lines,
      "",
      "Code **1257L** is a common cumulative code: your employer applies the **standard personal allowance** through payroll, so tax is spread across the year. A **lower** tax code means less allowance per pay period — **more tax withheld** and lower net pay until reconciled. A **higher** code does the opposite.",
      "",
      "Exact monthly impact depends on your **gross pay frequency**, pension contributions, and any other payroll deductions — your payslip is the authoritative breakdown.",
      "",
      "_Grounded from PAYE coding notices on file._",
    ].join("\n");
  }

  return [
    "I can help with grounded answers about income on file, payment history, refund status, Notice L-123, **profile health**, and **PAYE tax codes**.",
    "",
    "Try one of the suggested prompts below, or rephrase your question.",
  ].join("\n");
}
