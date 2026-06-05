'use client';

import { useMemo } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { mockInsight } from '@/lib/mock-data';

export function AtsDemo() {
  const progress = useMemo(() => mockInsight.atsScore, []);

  return (
    <Card className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
      <div className="space-y-5">
        <Badge>Interactive ATS Demo</Badge>
        <h2 className="font-display text-3xl tracking-[-0.04em] text-text-primary">See hiring friction before recruiters do.</h2>
        <p className="text-sm leading-7 text-text-secondary">
          Simulate ATS interpretation with keyword coverage, structure confidence, and section-level improvement prompts tuned for role outcomes.
        </p>
        <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-4 text-sm text-text-secondary">
          <p className="font-medium text-text-primary">Demo scenario</p>
          <p>Role: Senior AI Platform Engineer</p>
          <p>Priority signals: FastAPI, deployment ownership, measurable impact.</p>
        </div>
      </div>
      <div className="space-y-5 rounded-[24px] border border-border bg-surface-muted p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text-tertiary">ATS confidence</p>
            <p className="mt-2 font-display text-5xl tracking-[-0.06em] text-text-primary">{progress}</p>
          </div>
          <div className="text-right text-sm text-text-secondary">
            <p className="font-medium text-text-primary">Missing keywords</p>
            <p>{mockInsight.missingKeywords.join(' · ')}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-2 rounded-full bg-border/20">
            <div className="h-2 rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {mockInsight.skillGap.map((skill) => (
              <div key={skill} className="rounded-2xl border border-border bg-surface-elevated px-3 py-4 text-sm text-text-secondary">
                <div className="mb-3 h-1.5 rounded-full bg-border/20">
                  <div className="h-1.5 rounded-full bg-[color:var(--accent)]" style={{ width: `${40 + skill.length * 8}%` }} />
                </div>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}