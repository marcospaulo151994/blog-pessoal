import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';

const copy = {
  pt: {
    title: 'Agora',
    description: 'O que estou fazendo agora — TCC, leitura, estudos, vida.',
    updatedPrefix: 'atualizado em',
    cards: [
      {
        emoji: '🎓',
        label: 'TCC',
        body:
          'fechando o capítulo de pose estimation. baseline xgboost rodando, próximo passo é cnn+lstm e validação cruzada.',
      },
      {
        emoji: '📚',
        label: 'lendo',
        body:
          '"designing data-intensive applications" (martin kleppmann), "why nations fail" (acemoglu).',
      },
      {
        emoji: '🏃',
        label: 'estudando',
        body:
          'lgpd em profundidade, segurança de software (owasp top 10), design de api funcional.',
      },
      {
        emoji: '🎬',
        label: 'assistindo',
        body: 'the bear (s3), reportagens da vice news.',
      },
      {
        emoji: '☕',
        label: 'vivendo',
        body: 'café terceira onda, futebol no fim de semana, tentando manter rotina de sono.',
      },
    ],
    footerText: 'o que é uma /now page?',
  },
  en: {
    title: 'Now',
    description: 'What I am doing right now — thesis, reading, studies, life.',
    updatedPrefix: 'updated',
    cards: [
      {
        emoji: '🎓',
        label: 'thesis',
        body:
          'wrapping up the pose-estimation chapter. xgboost baseline running, cnn+lstm and cross-validation up next.',
      },
      {
        emoji: '📚',
        label: 'reading',
        body:
          '"designing data-intensive applications" (martin kleppmann), "why nations fail" (acemoglu).',
      },
      {
        emoji: '🏃',
        label: 'studying',
        body:
          'lgpd in depth, software security (owasp top 10), functional api design.',
      },
      {
        emoji: '🎬',
        label: 'watching',
        body: 'the bear (s3), vice news features.',
      },
      {
        emoji: '☕',
        label: 'living',
        body: 'third-wave coffee, weekend football, trying to keep a decent sleep schedule.',
      },
    ],
    footerText: "what's a /now page?",
  },
} as const;

const UPDATED_DATE = new Date('2026-04-23');

function formatUpdated(d: Date, lang: Locale): string {
  if (lang === 'pt') {
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = copy[lang];
  return buildMetadata({
    title: t.title,
    description: t.description,
    path: `/${lang}/${PATHS.now[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.now.pt}`,
      en: `/en/${PATHS.now.en}`,
    },
  });
}

export default async function NowPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];
  const updatedLabel = `${t.updatedPrefix} ${formatUpdated(UPDATED_DATE, l)}`;

  return (
    <main className="max-w-[760px] mx-auto px-8 py-16">
      <h1
        className="font-semibold tracking-tight"
        style={{ fontSize: 40, letterSpacing: '-1.5px' }}
      >
        {t.title}
      </h1>
      <p
        className="mt-3 italic font-mono text-[var(--text-muted)]"
        style={{ fontSize: 13 }}
      >
        {updatedLabel}
      </p>

      <div className="mt-12 flex flex-col gap-4">
        {t.cards.map((card) => (
          <div
            key={card.label}
            className="border border-[var(--border)] rounded-xl p-6 bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '1.5em' }} aria-hidden>
                {card.emoji}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
                {card.label}
              </span>
            </div>
            <p
              className="mt-3 text-[var(--text)]"
              style={{ fontSize: 15, lineHeight: 1.6 }}
            >
              {card.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <a
          href="https://nownownow.com"
          target="_blank"
          rel="noopener"
          className="dp-link font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]"
        >
          {t.footerText}
        </a>
      </div>
    </main>
  );
}
