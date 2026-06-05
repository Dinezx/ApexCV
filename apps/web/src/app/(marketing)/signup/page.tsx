'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authenticate } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    <div className="relative min-h-screen flex flex-col bg-surface overflow-hidden justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background grids */}
      <div className="pointer-events-none absolute inset-0 page-grid opacity-20" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_70%)] blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4">
        {/* Navigation link back */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors group mb-2">
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to homepage
        </Link>

        <Card className="w-full space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-display text-white text-base font-bold shadow-sm shadow-[var(--accent)]/30 mb-2">
              A
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-text-tertiary">Create account</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">Build analysis workspace</h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Full name</label>
              <Input name="name" type="text" placeholder="John Doe" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Email address</label>
              <Input name="email" type="email" placeholder="john@example.com" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Password</label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>

            <Button className="w-full mt-2" type="submit" disabled={pending}>
              {pending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {status && (
            <div className={`rounded-xl border p-4 flex items-start gap-3 text-sm leading-normal ${isError ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-green-500/20 bg-green-500/5 text-green-400'}`}>
              {isError ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
              <span>{status}</span>
            </div>
          )}

          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-[color:var(--accent)] hover:underline font-medium">
                Sign in instead
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
