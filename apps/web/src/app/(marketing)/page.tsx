'use client';

import { LandingHeader } from '@/components/landing/landing-header';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { AtsDemo } from '@/components/landing/ats-demo';
import { BentoGrid } from '@/components/landing/bento-grid';
import { FloatingPreview } from '@/components/landing/floating-preview';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-surface">
      <LandingHeader />
      
      {/* Full-bleed geometric hero */}
      <HeroGeometric
        badge="AI Resume Intelligence"
        title1="Transform Your Resume"
        title2="Into Your Dream Career"
      />

      <main className="flex-1 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 page-grid opacity-20" />
        
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">

          {/* ATS Scoring Demo & Preview Flow */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <AtsDemo />
            <FloatingPreview />
          </motion.section>

          {/* Story Platform Pitch */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="story-section p-8 sm:p-10"
          >
            <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="space-y-4">
                <Badge className="bg-accent-soft border-accent/25 text-accent font-semibold px-4 py-1">Platform Vision</Badge>
                <h2 className="font-display text-4xl tracking-[-0.04em] text-text-primary leading-tight">From upload to shortlist in one coherent workflow.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-text-secondary">
                Candidate mode, recruiter mode, and AI coaching live in a single, high-fidelity environment. Every panel is engineered to minimize noise, accelerate shortlist validation, and elevate resumes into high-impact profiles.
              </p>
            </div>
          </motion.section>

          {/* Bento Features Grid */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BentoGrid />
          </motion.section>
        </div>
      </main>

      {/* Landing Footer */}
      <footer className="border-t border-border bg-surface-elevated/40 py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[var(--accent)] flex items-center justify-center font-display text-white text-xs font-bold">
              A
            </div>
            <span className="font-display font-semibold text-text-secondary">Resume AI</span>
          </div>
          <p>© 2026 Resume AI Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}