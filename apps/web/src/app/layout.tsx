import type { Metadata } from 'next';
import { Manrope, Sora } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' });
const displayFont = Sora({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'AI Resume Analyser',
  description: 'Premium AI resume analysis platform for ATS, role matching, and recruiter-ready insights.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} font-body antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
