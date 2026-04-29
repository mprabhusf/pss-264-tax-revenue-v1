import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useTaxpayer360 } from "@/context/Taxpayer360Context";
import { usePortalNav } from "@/context/PortalNavigationContext";
import { TAX_FILING_PROACTIVE_AGENT_MESSAGE } from "@/data/taxFiling";
import { buildAgentOpeningMessages } from "./buildOpeningMessages";
import type {
  ChatMsg,
  ConfirmInstallmentPlanAction,
  ConfirmPendingPaymentAction,
} from "./chatTypes";
import { getAssistantReply } from "./getAssistantReply";

const SUGGESTED_CHIPS = [
  "Break down my balance",
  "Check refund status",
  "Check for notices",
] as const;

function formatAssistantText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-portal-brown">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AgentforceAssistant() {
  const { activeNav } = usePortalNav();
  const {
    getSnapshot,
    confirmRefundBankUnchanged,
    setRefundDestination,
    appendLedgerPayment,
    installmentPlan,
    activateInstallmentPlanFromAgent,
  } = useTaxpayer360();

  const opening = useMemo(() => buildAgentOpeningMessages(), []);
  const [messages, setMessages] = useState<ChatMsg[]>(opening);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const completedPaymentActionIds = useRef(new Set<string>());
  const completedInstallmentActionIds = useRef(new Set<string>());
  const [, refreshActionUi] = useReducer((n: number) => n + 1, 0);
  const prevNavRef = useRef<typeof activeNav | null>(null);

  useEffect(() => {
    const prev = prevNavRef.current;
    prevNavRef.current = activeNav;
    if (activeNav !== "taxes") return;
    if (prev === "taxes") return;
    setMessages((m) => [
      ...m,
      {
        id: `a-proactive-taxes-${Date.now()}`,
        role: "assistant",
        text: TAX_FILING_PROACTIVE_AGENT_MESSAGE,
      },
    ]);
  }, [activeNav]);

  const handleConfirmPendingPayment = useCallback(
    (action: ConfirmPendingPaymentAction) => {
      if (completedPaymentActionIds.current.has(action.id)) return;
      completedPaymentActionIds.current.add(action.id);
      appendLedgerPayment({
        label: action.ledgerLabel,
        date: action.paymentDate,
        dateDisplay: action.dateDisplay,
        amount: action.amount,
        quarter: action.quarter,
        taxYear: action.taxYear,
        status: action.status,
        paymentType: action.paymentType,
      });
      setMessages((m) => [
        ...m,
        {
          id: `a-post-${Date.now()}`,
          role: "assistant",
          text: "**Payment recorded.** Your **Taxes & Filing** history and **Payments & Ledger** now include this payment (demo).",
        },
      ]);
      refreshActionUi();
    },
    [appendLedgerPayment],
  );

  const handleConfirmInstallmentPlan = useCallback(
    (action: ConfirmInstallmentPlanAction) => {
      if (completedInstallmentActionIds.current.has(action.id)) return;
      completedInstallmentActionIds.current.add(action.id);
      activateInstallmentPlanFromAgent({
        totalDebt: action.totalDebt,
        months: action.months,
        monthlyPayment: action.monthlyPayment,
        bankAccountId: action.bankAccountId,
        bankLabel: action.bankLabel,
      });
      setMessages((m) => [
        ...m,
        {
          id: `a-installment-${Date.now()}`,
          role: "assistant",
          text: "**Installment plan activated.** Your **Payments & Ledger** tab now shows an **active plan**, and the manual installment application path is closed for this session (demo).",
        },
      ]);
      refreshActionUi();
    },
    [activateInstallmentPlanFromAgent],
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const q = trimmed.toLowerCase();
      const ts = Date.now();
      const userMsg: ChatMsg = {
        id: `u-${ts}`,
        role: "user",
        text: trimmed,
      };

      if (
        q.includes("use wells fargo") ||
        q.includes("wells fargo for refund") ||
        q.includes("use global savings") ||
        q.includes("global savings for refund")
      ) {
        setRefundDestination("wells-1");
        const botMsg: ChatMsg = {
          id: `a-${ts + 1}`,
          role: "assistant",
          text: "**Refund destination updated.** Your refund will now go to **Wells Fargo ending in 8842**. **Profile & Household** reflects this immediately in Taxpayer 360.",
        };
        setMessages((m) => [...m, userMsg, botMsg]);
        setInput("");
        return;
      }

      if (
        q === "yes" ||
        q === "y" ||
        q === "yes." ||
        q.includes("yes that's correct") ||
        q.includes("yes, that's correct") ||
        q.includes("still correct") ||
        q.includes("confirm that's correct")
      ) {
        confirmRefundBankUnchanged();
      }

      const reply = getAssistantReply(trimmed, getSnapshot());
      const botMsg: ChatMsg = {
        id: `a-${ts + 1}`,
        role: "assistant",
        text: reply.text,
        actions: reply.actions,
      };
      setMessages((m) => [...m, userMsg, botMsg]);
      setInput("");
    },
    [getSnapshot, confirmRefundBankUnchanged, setRefundDestination],
  );

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-portal-ochre text-white shadow-lg shadow-portal-ochre/35 transition hover:bg-portal-ochre-hover hover:scale-105 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label="Open Agentforce assistant"
      >
        <Bot className="h-7 w-7" strokeWidth={1.75} />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-stone-900/25 transition duration-200 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex w-screen items-end justify-center sm:items-end sm:justify-end sm:p-6">
          <DialogPanel
            transition
            className="flex max-h-[85vh] w-full max-w-full flex-col rounded-t-2xl border border-stone-200 bg-white shadow-2xl transition duration-200 ease-out data-closed:translate-y-4 data-closed:opacity-0 sm:mb-0 sm:max-h-[min(70vh,32rem)] sm:w-[min(100vw-3rem,26rem)] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 bg-portal-peach-muted/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-portal-ochre ring-1 ring-amber-200/80">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <DialogTitle className="text-sm font-semibold text-portal-brown">
                    Agentforce
                  </DialogTitle>
                  <p className="text-xs text-stone-500">Grounded assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-portal-ochre text-white"
                        : "bg-stone-100 text-stone-800"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="space-y-3">
                        <p className="whitespace-pre-wrap">
                          {formatAssistantText(m.text)}
                        </p>
                        {m.actions?.map((action) => (
                          <div key={action.id}>
                            {action.kind === "confirm_pending_payment" ? (
                              <button
                                type="button"
                                disabled={completedPaymentActionIds.current.has(
                                  action.id,
                                )}
                                onClick={() =>
                                  handleConfirmPendingPayment(action)
                                }
                                className="w-full rounded-full bg-portal-ochre px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-portal-ochre-hover disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {action.label}
                              </button>
                            ) : action.kind === "confirm_installment_plan" ? (
                              <button
                                type="button"
                                disabled={
                                  completedInstallmentActionIds.current.has(
                                    action.id,
                                  ) || installmentPlan != null
                                }
                                onClick={() =>
                                  handleConfirmInstallmentPlan(action)
                                }
                                className="w-full rounded-full bg-portal-brown px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-portal-brown/90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {action.label}
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 bg-portal-peach-muted/30 px-3 pb-2 pt-2">
              <div className="mb-2 flex flex-wrap gap-2">
                {SUGGESTED_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-portal-brown ring-1 ring-stone-200/80 transition hover:bg-portal-peach"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send(input);
                  }}
                  placeholder="Ask a question…"
                  className="min-h-10 flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none ring-portal-link/20 focus:border-portal-link focus:bg-white focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => send(input)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-portal-ochre text-white hover:bg-portal-ochre-hover"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-stone-400">
                Powered by Agentforce
              </p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
