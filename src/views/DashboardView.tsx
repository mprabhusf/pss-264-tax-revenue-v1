import {
  ActiveNoticesListCard,
  ObligationAndPaymentCard,
  RefundTrackerCard,
  WelcomeBannerAndAgenticSummary,
} from "@/components/dashboard";

export type DashboardHomeProps = {
  onMakePayment: () => void;
  onViewDebtBreakdown: () => void;
  onOpenNoticesCenter: (noticeId?: string) => void;
};

export function DashboardView({
  onMakePayment,
  onViewDebtBreakdown,
  onOpenNoticesCenter,
}: DashboardHomeProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-4">
      <WelcomeBannerAndAgenticSummary
        onOpenNoticesCenter={() => onOpenNoticesCenter()}
      />

      <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className="space-y-5 lg:col-span-7">
          <RefundTrackerCard onOpenNoticesCenter={onOpenNoticesCenter} />
        </div>
        <div className="space-y-5 lg:col-span-5">
          <ObligationAndPaymentCard
            onMakePayment={onMakePayment}
            onViewDebtBreakdown={onViewDebtBreakdown}
          />
        </div>
      </div>

      <ActiveNoticesListCard
        onOpenNotice={(id) => onOpenNoticesCenter(id)}
        onViewAllNotices={() => onOpenNoticesCenter()}
      />
    </div>
  );
}