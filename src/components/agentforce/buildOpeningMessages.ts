import type { ChatMsg } from "./chatTypes";
import {
  HOUSEHOLD_DEPENDENTS,
  INITIAL_LINKED_BANK_ACCOUNTS,
  PROFILE_HEALTH_CHECK,
  TAXPAYER,
} from "@/data/portal";

const WELCOME =
  "Hi! I'm your Tax Assistant. I can provide real-time updates on your tax records and help resolve account issues. Select from these options or ask a question.";

export function buildAgentOpeningMessages(): ChatMsg[] {
  const sarah = HOUSEHOLD_DEPENDENTS.find((d) => d.name.includes("Sarah"));
  const thomas = HOUSEHOLD_DEPENDENTS.find((d) => d.name.includes("Thomas"));
  const sarahFirst = sarah?.name.split(" ")[0] ?? "Sarah";
  const thomasFirst = thomas?.name.split(" ")[0] ?? "Thomas";
  const year = PROFILE_HEALTH_CHECK.filingReferenceYear;
  const refund = INITIAL_LINKED_BANK_ACCOUNTS.find((a) => a.isRefundDestination);

  const profile = [
    `Hi **${TAXPAYER.preferredFirstName}**, I've verified your two dependents (**${sarahFirst}** and **${thomasFirst}**). Everything looks consistent with your **${year}** California and federal filing snapshot.`,
  ].join("\n");

  const bank = refund
    ? [
        `I see you're using your **${refund.institution}** account for your refund — **${refund.displayLabel}**. Is this still the correct account? Reply **yes** to confirm, or say **update refund bank** if you'd like to change it.`,
      ].join("\n")
    : "I don't see a refund destination on file. Open **Profile & Household** to add a linked account.";

  const now = Date.now();
  return [
    { id: `welcome-${now}`, role: "assistant", text: WELCOME },
    { id: `profile-${now}`, role: "assistant", text: profile },
    { id: `bank-${now}`, role: "assistant", text: bank },
  ];
}
