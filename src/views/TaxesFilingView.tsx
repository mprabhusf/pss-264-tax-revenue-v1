export function TaxesFilingView() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <h1 className="text-2xl font-semibold text-portal-brown">Taxes & Filing</h1>
      <p className="text-sm text-stone-600 max-w-2xl">
        This area will host return status, estimated tax vouchers, and filing
        workflows. Connect your upstream filing systems to surface live
        obligations here.
      </p>
      <div className="rounded-2xl border border-dashed border-stone-200 bg-white/80 p-10 text-center text-sm text-stone-500">
        No additional filing tasks to display in this demo.
      </div>
    </div>
  );
}
