'use client';

import { LandingHeader } from '@/components/landing/landing-header';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import {
  FileSearch,
  Sparkles,
  BarChart3,
  MessageSquareText,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Upload,
  Brain,
  TrendingUp,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import Link from 'next/link';
import { ApexCVLogo } from '@/components/ui/logo';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const features = [
  {
    icon: FileSearch,
    title: 'Precision Resume Parsing',
    description: 'Extract structured data from PDF and DOCX — skills, experience, education, and projects mapped into actionable intelligence.',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: MessageSquareText,
    title: 'AI-Powered Coaching',
    description: 'Generate role-specific improvement plans, missing keyword actions, and rewrite prompts calibrated for each position.',
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: BarChart3,
    title: 'Executive Analytics',
    description: 'Monitor ATS trajectories, resume revisions, recruiter signals, and decision timelines from a unified dashboard.',
    gradient: 'from-emerald-500/20 to-green-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Target,
    title: 'Job-Role Matching',
    description: 'Match your resume against live job descriptions with keyword-level accuracy scores and actionable gap analysis.',
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
  },
];

const steps = [
  { icon: Upload, number: '01', title: 'Upload Your Resume', description: 'Drop your PDF or DOCX file and our AI parser extracts every detail in seconds.' },
  { icon: Brain, number: '02', title: 'AI Analyzes & Scores', description: 'Our engine evaluates ATS compatibility, keyword coverage, structure, and role fit.' },
  { icon: TrendingUp, number: '03', title: 'Get Actionable Insights', description: 'Receive personalized coaching, skill gap analysis, and matched job opportunities.' },
];

const stats = [
  { value: '10,000+', label: 'Resumes Analyzed' },
  { value: '94%', label: 'User Satisfaction' },
  { value: '+23%', label: 'Shortlist Rate Boost' },
  { value: '<3s', label: 'Analysis Time' },
];

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#030303]">
      <LandingHeader />

      {/* === HERO === */}
      <HeroGeometric
        badge="AI Resume Intelligence"
        title1="Transform Your Resume"
        title2="Into Your Dream Career"
      />

      {/* === TRUSTED BY / STATS === */}
      <section className="relative py-20 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-indigo-950/[0.03] to-[#030303]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeInUp}
                className="text-center space-y-2"
              >
                <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                  {stat.value}
                </p>
                <p className="text-sm text-white/35 tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === FEATURES GRID === */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
          >
            <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
              <Circle className="h-1.5 w-1.5 fill-indigo-400" />
              <span className="text-xs text-white/50 tracking-wider uppercase">Core Capabilities</span>
            </motion.div>
            <motion.h2 custom={1} variants={fadeInUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Everything you need to
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-300">
                land the perfect role
              </span>
            </motion.h2>
            <motion.p custom={2} variants={fadeInUp} className="text-white/35 text-base sm:text-lg leading-relaxed">
              Our AI-powered platform transforms raw resumes into recruiter-ready profiles with precision scoring and actionable intelligence.
            </motion.p>
          </motion.div>

          {/* Features cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 md:grid-cols-2"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  variants={fadeInUp}
                  className="group relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03]"
                >
                  {/* Ambient glow */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                  <div className="relative space-y-5">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] ${feature.iconColor}`}>
                      <Icon size={22} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-white">
                        {feature.title}
                      </h3>
                      <p className="text-white/35 text-sm leading-relaxed max-w-md">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how-it-works" className="relative py-24 sm:py-32 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/[0.03] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
          >
            <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
              <Circle className="h-1.5 w-1.5 fill-violet-400" />
              <span className="text-xs text-white/50 tracking-wider uppercase">How It Works</span>
            </motion.div>
            <motion.h2 custom={1} variants={fadeInUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Three steps to your
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-indigo-300">
                optimized resume
              </span>
            </motion.h2>
            <motion.p custom={2} variants={fadeInUp} className="text-white/35 text-base sm:text-lg leading-relaxed">
              From upload to actionable insights in under 30 seconds. No complex setup required.
            </motion.p>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  custom={i}
                  variants={fadeInUp}
                  className="relative group"
                >
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] right-[-calc(50%-40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-white/[0.08] to-transparent z-0 translate-x-[40px]" />
                  )}

                  <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 text-center space-y-5 transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03]">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-indigo-400 mx-auto">
                      <Icon size={24} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-indigo-400/60">{step.number}</span>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-white/30 text-sm leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* === LIVE DEMO PREVIEW === */}
      <section className="relative py-24 sm:py-32 border-t border-white/[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs text-white/50 tracking-wider uppercase">Live Preview</span>
            </motion.div>
            <motion.h2 custom={1} variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              See it in action
            </motion.h2>
            <motion.p custom={2} variants={fadeInUp} className="text-white/35 text-base leading-relaxed">
              A real-time preview of what your analysis workspace looks like.
            </motion.p>
          </motion.div>

          {/* Simulated analysis card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                  <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                  <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-display">Analysis Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium tracking-wider uppercase">Live</span>
              </div>
            </div>

            {/* Content grid */}
            <div className="grid md:grid-cols-[1fr_1.4fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              {/* Left - Score */}
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 font-display">ATS Confidence</p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">84</span>
                    <span className="text-sm text-white/25">/100</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '84%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                    />
                  </div>
                  <p className="text-xs text-white/30">Strong structure. Add deployment and platform ownership keywords.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-display">Target Role</p>
                  <p className="text-sm text-white/70 font-medium">Senior AI Product Engineer</p>
                </div>
              </div>

              {/* Right - Insights */}
              <div className="p-8 space-y-5">
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-display">Matched Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Docker', 'PostgreSQL', 'OpenAI'].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-emerald-400/80 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-display">Missing Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {['FastAPI', 'Cloud Deployment', 'MLOps'].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-full bg-amber-500/8 border border-amber-500/15 text-amber-400/80 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-display">AI Suggestions</p>
                  <div className="space-y-2">
                    {[
                      'Move measurable impact into the first 120 words.',
                      'Add a dedicated skills cluster for stack-specific keywords.',
                      'Make the summary role-targeted instead of generic.',
                    ].map((suggestion) => (
                      <div key={suggestion} className="flex items-start gap-2.5 text-sm text-white/35 leading-relaxed">
                        <CheckCircle2 size={14} className="text-indigo-400/50 shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === CTA === */}
      <section id="pricing" className="relative py-24 sm:py-32 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/[0.05] to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <motion.h2 custom={0} variants={fadeInUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Ready to transform
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-blue-300">
                your career trajectory?
              </span>
            </motion.h2>
            <motion.p custom={1} variants={fadeInUp} className="text-white/35 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Join thousands of professionals who've elevated their resumes with AI-powered analysis. Start your free analysis today.
            </motion.p>
            <motion.div custom={2} variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/analysis"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] transition-all duration-300"
              >
                Start Free Analysis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/[0.12] bg-white/[0.04] text-white/80 font-medium text-sm tracking-wide hover:bg-white/[0.08] hover:text-white transition-all duration-300"
              >
                Create Free Account
              </Link>
            </motion.div>
            <motion.div custom={3} variants={fadeInUp} className="flex items-center justify-center gap-6 text-xs text-white/25">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400/50" />
                <span>No credit card required</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400/50" />
                <span>Results in seconds</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <ApexCVLogo />
            </div>
            <nav className="flex items-center gap-6 text-xs text-white/25">
              <a href="#features" className="hover:text-white/50 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white/50 transition-colors">How it Works</a>
              <Link href="/login" className="hover:text-white/50 transition-colors">Sign in</Link>
              <Link href="/signup" className="hover:text-white/50 transition-colors">Get Started</Link>
            </nav>
            <p className="text-xs text-white/15">© 2026 ApexCV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}