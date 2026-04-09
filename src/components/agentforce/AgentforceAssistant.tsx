import { Transition } from "@headlessui/react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAssistantReply } from "./getAssistantReply";

const SUGGESTED_CHIPS = [
  "What income do you have on file?",
  "Confirm my last payments",
  "Explain notice L-123",
  "Check Refund Status",
] as const;

type Msg = { id: string; role: "user" | "assistant"; text: string };

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
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi — I'm your Agentforce assistant. Ask about income on file, payments, notices, or refund status. Answers are mocked for this demo but follow PRD triggers.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    const reply = getAssistantReply(trimmed);
    const botMsg: Msg = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: reply,
    };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  }, []);

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

      <Transition show={open}>
        <div className="fixed inset-0 z-40 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto">
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <button
              type="button"
              className="fixed inset-0 bg-stone-900/25 sm:hidden"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
            />
          </Transition>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="translate-y-4 opacity-0 sm:translate-y-4 sm:scale-95"
            enterTo="translate-y-0 opacity-100 sm:scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="translate-y-0 opacity-100 sm:scale-100"
            leaveTo="translate-y-4 opacity-0 sm:translate-y-4 sm:scale-95"
          >
            <div className="fixed inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl border border-stone-200 bg-white shadow-2xl sm:absolute sm:inset-auto sm:h-[min(32rem,70vh)] sm:w-[min(100vw-3rem,26rem)] sm:rounded-2xl">
              <div className="flex items-center justify-between border-b border-stone-100 bg-portal-peach-muted/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-portal-ochre ring-1 ring-amber-200/80">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-portal-brown">
                      Agentforce
                    </p>
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
                        <p className="whitespace-pre-wrap">
                          {formatAssistantText(m.text)}
                        </p>
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
            </div>
          </Transition>
        </div>
      </Transition>
    </>
  );
}
