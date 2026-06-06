'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { authenticate } from '@/lib/api';
import { ApexCVLogo } from '@/components/ui/logo';

export default function SignupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsError(false);
    setStatus(null);

    try {
      setPending(true);
      const formData = new FormData(event.currentTarget);
      await authenticate('/api/v1/auth/register', {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
      });
      setIsError(false);
      setStatus('Account created. Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (error) {
      setIsError(true);
      setStatus(error instanceof Error ? error.message : 'Unable to create account. Please retry.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030303] overflow-hidden px-4 py-12">
      {/* Ambient background */}
      <div className="pointer-events-none absolute top-[-20%] right-1/4 w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="w-full max-w-md relative z-10 space-y-5"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-white/35 hover:text-white/60 transition-colors group">
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to homepage
        </Link>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10 space-y-7 backdrop-blur-sm">
          <div className="space-y-3">
            <ApexCVLogo iconOnly />
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <Sparkles className="h-3 w-3 text-violet-400/60" />
              <span className="text-[10px] text-white/40 tracking-wider uppercase">Create Account</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Build your workspace
            </h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/40">Full name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/40 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/40">Email address</label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/40 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/40">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/40 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
            >
              {pending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {status && (
            <div className={`rounded-xl border p-4 flex items-start gap-3 text-sm leading-normal ${isError ? 'border-red-500/15 bg-red-500/5 text-red-400/80' : 'border-emerald-500/15 bg-emerald-500/5 text-emerald-400/80'}`}>
              {isError ? <AlertCircle size={16} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={16} className="shrink-0 mt-0.5" />}
              <span>{status}</span>
            </div>
          )}

          <div className="border-t border-white/[0.06] pt-5 text-center">
            <p className="text-xs text-white/30">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400/80 hover:text-indigo-400 font-medium transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
