import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marcos Medeiros',
  description: 'Posts, projetos e notas sobre ML e visão computacional.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* carrega o script de tema antes da hidratação para evitar FOUC */}
        <script src="/theme-init.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
