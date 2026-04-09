import { useState } from "react";
import { AgentforceAssistant } from "@/components/agentforce/AgentforceAssistant";
import { AppShell } from "@/components/layout/AppShell";
import type { NavKey } from "@/components/layout/navConfig";
import { DashboardView } from "@/views/DashboardView";
import { HouseholdProfileView } from "@/views/HouseholdProfileView";
import { NoticesView } from "@/views/NoticesView";
import { PaymentsLedgerView } from "@/views/PaymentsLedgerView";
import { TaxesFilingView } from "@/views/TaxesFilingView";

export default function App() {
  const [nav, setNav] = useState<NavKey>("dashboard");

  const content =
    nav === "dashboard" ? (
      <DashboardView />
    ) : nav === "household" ? (
      <HouseholdProfileView />
    ) : nav === "taxes" ? (
      <TaxesFilingView />
    ) : nav === "payments" ? (
      <PaymentsLedgerView />
    ) : (
      <NoticesView />
    );

  return (
    <>
      <AppShell active={nav} onNavigate={setNav}>
        {content}
      </AppShell>
      <AgentforceAssistant />
    </>
  );
}
