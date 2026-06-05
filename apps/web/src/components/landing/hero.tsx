'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Orbit, Waypoints } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export function Hero() {
  return (
    <section className="story-section px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
      <div className="absolute inset-0 page-grid opacity-35" />
      <div className="absolute -right-20 top-8 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_68%)] blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-7">
          <Badge className="bg-accent-soft border-accent/20 text-accent font-semibold px-4 py-1.5">AI Resume Intelligence</Badge>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl font-display text-5xl leading-[0.92] tracking-[-0.05em] text-balance text-text-primary sm:text-6xl lg:text-7xl"
          >
            The operating system for recruiter-grade resume decisions.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="max-w-xl text-base leading-8 text-text-secondary sm:text-lg"
          >
            Parse every resume into structured intelligence, score ATS compatibility, and ship role-specific improvements through one elegant analysis flow.
          </motion.p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/analysis">
                Open analysis workspace <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/signup">Start free trial</Link>
            </Button>
            <Button variant="secondary">Watch cinematic demo</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-muted/70 px-4 py-3 text-sm text-text-secondary">
              <div className="mb-2 flex items-center gap-2 text-text-primary">
                <ShieldCheck size={15} className="text-[color:var(--accent)]" />
                Secure by default
              </div>
              JWT, rate limits, and scoped access across every endpoint.
            </div>
            <div className="rounded-2xl border border-border bg-surface-muted/70 px-4 py-3 text-sm text-text-secondary">
              <div className="mb-2 flex items-center gap-2 text-text-primary">
                <Sparkles size={15} className="text-[color:var(--accent-2)]" />
                AI grounded feedback
              </div>
              Improvement notes tuned for ATS, hiring managers, and recruiters.
            </div>
          </div>
        </div>
 
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="grid gap-4 self-end"
        >
          <Card className="relative overflow-hidden rounded-[30px] p-0">
            <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(59,130,246,0.1),transparent_35%,transparent_70%,var(--accent-soft))]" />
            <div className="relative grid gap-4 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-tertiary">Realtime scan</p>
                  <p className="mt-2 font-display text-4xl tracking-[-0.05em] text-text-primary">84</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface-muted p-3 text-sm text-text-secondary">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Target Role</p>
                  <p className="mt-1 font-medium text-text-primary">Senior AI Product Engineer</p>
                </div>
              </div>
              <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>ATS Alignment</span>
                  <span>84 / 100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border/20">
                  <div className="h-full w-[84%] rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]" />
                </div>
                <p className="text-sm leading-6 text-text-secondary">Structure is strong. Fill missing deployment and platform ownership keywords.</p>
              </div>
            </div>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-elevated px-4 py-4 text-sm text-text-secondary">
              <p className="mb-2 flex items-center gap-2 text-text-primary"><Orbit size={15} className="text-[color:var(--accent)]" />Analysis velocity</p>
              142 role checks this week.
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated px-4 py-4 text-sm text-text-secondary">
              <p className="mb-2 flex items-center gap-2 text-text-primary"><Waypoints size={15} className="text-[color:var(--accent-2)]" />Pipeline impact</p>
              +18% shortlist conversion.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}