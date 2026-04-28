import { useCallback, useState } from "react";
import { AgentforceAssistant } from "@/components/agentforce/AgentforceAssistant";
import { AppShell } from "@/components/layout/AppShell";
import type { NavKey } from "@/components/layout/navConfig";
import { PORTAL_DEBT_SCROLL_SESSION_KEY } from "@/components/dashboard";
import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import { PortalNavProvider } from "@/context/PortalNavigationContext";
import { Taxpayer360Provider } from "@/context/Taxpayer360Context";
import { DashboardView } from "@/views/DashboardView";
import { HouseholdProfileView } from "@/views/HouseholdProfileView";
import { IncomeView } from "@/views/IncomeView";
import { NoticesView } from "@/views/NoticesView";
import { PaymentsLedgerView } from "@/views/PaymentsLedgerView";
import { TaxesFilingView } from "@/views/TaxesFilingView";

export default function App() {
  const [nav, setNav] = useState<NavKey>("home");
  const [noticesFocusId, setNoticesFocusId] = useState<string | null>(null);

  const onViewDebtBreakdown = useCallback(() => {
    sessionStorage.setItem(PORTAL_DEBT_SCROLL_SESSION_KEY, "1");
    setNav("payments");
  }, []);

  const onOpenNoticesCenter = useCallback((noticeId?: string) => {
    setNoticesFocusId(noticeId ?? null);
    setNav("notices");
  }, []);

  const content =
    nav === "home" ? (
      <DashboardView
        onMakePayment={() => setNav("payments")}
        onViewDebtBreakdown={onViewDebtBreakdown}
        onOpenNoticesCenter={onOpenNoticesCenter}
      />
    ) : nav === "household" ? (
      <HouseholdProfileView />
    ) : nav === "income" ? (
      <IncomeView />
    ) : nav === "taxes" ? (
      <TaxesFilingView />
    ) : nav === "payments" ? (
      <PaymentsLedgerView />
    ) : (
      <NoticesView
        focusNoticeId={noticesFocusId}
        onFocusConsumed={() => setNoticesFocusId(null)}
      />
    );

  return (
    <Taxpayer360Provider>
      <PortalNavProvider activeNav={nav}>
        <BreadcrumbProvider navKey={nav}>
          <AppShell active={nav} onNavigate={setNav}>
            {content}
          </AppShell>
          <AgentforceAssistant />
        </BreadcrumbProvider>
      </PortalNavProvider>
    </Taxpayer360Provider>
  );
}
