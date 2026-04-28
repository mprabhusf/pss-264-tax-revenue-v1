/**
 * Tax return submitted — refund / hold / discrepancy mock (USD).
 * Backend codes are mapped to human-readable reasons for Agentforce.
 */

export const BACKEND_STATUS_MESSAGES: Record<string, string> = {
  ERR_CODE_48: "Section 48 Violation (Missing Income).",
} as const;

export function humanReadableBackendStatus(code: string): string {
  return BACKEND_STATUS_MESSAGES[code] ?? code;
}

export const MOCK_TAX_FILING = {
  status: "On-Hold" as const,
  expectedAmount: 2500.0,
  acceptedAmount: 2000.0,
  noticeReference: "L-123",
  holdReason: "Section 48 Violation",
  backendStatusCode: "ERR_CODE_48" as const,
  taxYear: "2024",
} as const;

export const TAX_FILING_PROACTIVE_AGENT_MESSAGE =
  "Your return has been processed, but we identified a discrepancy in your income reporting. I've flagged the details for you in the Notices Center and I'm here to explain the math if you need help.";
