import { PAYMENT_HISTORY } from "@/data/portal";

export function PaymentsLedgerView() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">
          Payments & Ledger
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Balance composition and recent payment activity.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)] lg:col-span-3">
          <h2 className="text-lg font-semibold text-portal-brown">
            Debt Breakdown
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Current balance due itemized by category.
          </p>
          <ul className="mt-6 divide-y divide-stone-100">
            <li className="flex items-center justify-between py-3 first:pt-0">
              <span className="text-sm text-stone-600">Principal Tax</span>
              <span className="text-sm font-semibold text-stone-900">£400</span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="text-sm text-stone-600">Penalties</span>
              <span className="text-sm font-semibold text-stone-900">£75</span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="text-sm text-stone-600">
                Real-time Interest
              </span>
              <span className="text-sm font-semibold text-stone-900">£25</span>
            </li>
            <li className="flex items-center justify-between border-t border-stone-200 pt-4">
              <span className="text-sm font-medium text-stone-900">Total</span>
              <span className="text-lg font-semibold text-portal-ochre">£500</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <button
            type="button"
            className="rounded-full bg-portal-ochre px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-portal-ochre-hover"
          >
            Pay Full Balance
          </button>
          <button
            type="button"
            className="rounded-full border-2 border-portal-brown/40 bg-white px-4 py-3.5 text-center text-sm font-semibold text-portal-brown shadow-sm transition hover:bg-portal-peach/50"
          >
            Setup Installment Plan
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[var(--shadow-portal-card)]">
        <div className="border-b border-stone-100 bg-portal-peach-muted/80 px-6 py-4">
          <h2 className="text-lg font-semibold text-portal-brown">
            Payment History
          </h2>
          <p className="mt-0.5 text-sm text-stone-600">
            Successful transactions on record.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-amber-200/50 bg-portal-peach text-xs font-semibold uppercase tracking-wide text-portal-brown">
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {PAYMENT_HISTORY.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 1 ? "bg-portal-peach/25" : "bg-white"}
                >
                  <td className="px-6 py-4 font-medium text-portal-link">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-stone-600">{row.date}</td>
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {row.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
