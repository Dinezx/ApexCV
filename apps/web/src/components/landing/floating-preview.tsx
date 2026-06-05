import { Card } from '../ui/card';

export function FloatingPreview() {
  return (
    <div className="relative">
      <div className="absolute inset-0 translate-x-8 translate-y-6 rounded-[32px] border border-border bg-accent-soft/30 blur-2xl" />
      <Card className="relative animate-float overflow-hidden p-0">
        <div className="border-b border-border px-6 py-4 text-xs uppercase tracking-[0.24em] text-text-tertiary">
          Live analysis storyboard
        </div>
        <div className="grid gap-4 p-6">
          <div className="rounded-2xl border border-border bg-surface-muted p-4">
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>ATS alignment</span>
              <span>84%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-border/20">
              <div className="h-full w-[84%] rounded-full bg-[color:var(--accent)]" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Missing cluster</p>
              <p className="mt-2 text-sm text-text-primary">Cloud ownership, observability, CI/CD depth</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Narrative fit</p>
              <p className="mt-2 text-sm text-text-primary">Strong foundation, refine delivery outcomes per role.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}