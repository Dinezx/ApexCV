export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-32 rounded-[28px] border border-border bg-surface-elevated animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-40 rounded-[28px] border border-border bg-surface-elevated animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}