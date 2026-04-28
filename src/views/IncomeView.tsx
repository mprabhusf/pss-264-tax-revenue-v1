import { INCOME_RECORDS, PAYE_TAX_CODES } from "@/data/portal";

export function IncomeView() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-portal-brown">Income</h1>
        <p className="mt-1 text-sm text-stone-600">
          W-2 / 1099 retrieval summary and federal & California withholding on
          your Taxpayer 360 record.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
        <h2 className="text-lg font-semibold text-portal-brown">
          Income on file (W-2 / 1099)
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Employer or payer, form type, amount, and withholding crosswalk where
          applicable.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-stone-100">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Employer / payer</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Withholding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {INCOME_RECORDS.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium text-portal-brown">
                    {row.form}
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {row.employerOrPayer}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-900">
                    {row.amount}
                  </td>
                  <td className="px-4 py-3 font-mono text-stone-800">
                    {row.taxCode ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-portal-card)]">
        <h2 className="text-lg font-semibold text-portal-brown">
          Withholding (federal & California)
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Elections in effect for employment income (federal Form W-4 and
          California Form DE-4 pattern).
        </p>
        <ul className="mt-6 space-y-4">
          {PAYE_TAX_CODES.map((row) => (
            <li
              key={row.code}
              className="rounded-xl border border-stone-100 bg-stone-50/50 px-4 py-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-lg font-semibold text-portal-brown">
                  {row.code}
                </span>
                <span className="text-xs text-stone-500">
                  Effective {row.effectiveFrom}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-700">{row.employer}</p>
              <p className="mt-2 text-sm text-stone-600">{row.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
