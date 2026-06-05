export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-56 rounded-[32px] border border-border bg-surface-elevated animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="h-[540px] rounded-[28px] border border-border bg-surface-elevated animate-pulse" />
          <div className="h-[540px] rounded-[28px] border border-border bg-surface-elevated animate-pulse" />
        </div>
      </div>
    </main>
  );
}
