import type { Metadata } from 'next';
import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const serif = IBM_Plex_Serif({
  weight: ['600', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-serif-loaded',
});
const sans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans-loaded',
});
const mono = IBM_Plex_Mono({
  weight: ['400', '600'],
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
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
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
