import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans-loaded',
});
const mono = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-mono-loaded',
});

export const metadata: Metadata = {
  title: 'marcos.run',
  description: 'Posts, projetos e notas sobre ML e visão computacional — Marcos Medeiros.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable}`}
    >
      <head>
        {/* carrega o script de tema antes da hidratação para evitar FOUC */}
        <script src="/theme-init.js" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
