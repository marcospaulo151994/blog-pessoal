import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';

const copy = {
  pt: {
    title: 'Sobre',
    description: 'Sobre Marcos Paulo de Medeiros — UPF, ML e visão computacional.',
    paragraphs: [
      'marcos paulo de medeiros. estudante de ciência da computação na upf, terminando o tcc sobre predição de direção de pênaltis com mediapipe pose + ml clássico/profundo.',
      'interesses giram em torno de visão computacional, machine learning aplicado a esportes e segurança de software. escrevo aqui pra fixar o que estudo e abrir conversa sobre o que faço.',
      'fora do código: futebol (claro), café e tentativa eterna de manter um sono decente.',
    ],
    cards: [
      {
        label: 'Stack atual',
        body: 'python, typescript, mediapipe pose, xgboost, next.js',
      },
      {
        label: 'Onde me achar',
        body: null,
        links: [
          { href: 'https://github.com/marcospaulo151994', text: 'github' },
          { href: 'https://www.linkedin.com/', text: 'linkedin' },
          { href: 'mailto:marcospaulo_medeiros@hotmail.com', text: 'email' },
        ],
      },
      {
        label: 'O que escrevo aqui',
        body: 'ml, visão computacional, segurança, design de api, e o que mais tiver vontade de matutar.',
      },
      {
        label: 'Disponibilidade',
        body: 'estágio na área de ml/dados a partir de 2027. dm aberto.',
      },
    ],
  },
  en: {
    title: 'About',
    description: 'About Marcos Paulo de Medeiros — UPF, ML, and computer vision.',
    paragraphs: [
      'marcos paulo de medeiros. computer science undergrad at upf, wrapping up my thesis on penalty-direction prediction using mediapipe pose + classical/deep ml.',
      'interests revolve around computer vision, machine learning applied to sports, and software security. i write here to crystallize what i study and start conversations about what i build.',
      'outside code: football (of course), coffee, and the eternal attempt to keep a decent sleep schedule.',
    ],
    cards: [
      {
        label: 'Current stack',
        body: 'python, typescript, mediapipe pose, xgboost, next.js',
      },
      {
        label: 'Where to find me',
        body: null,
        links: [
          { href: 'https://github.com/marcospaulo151994', text: 'github' },
          { href: 'https://www.linkedin.com/', text: 'linkedin' },
          { href: 'mailto:marcospaulo_medeiros@hotmail.com', text: 'email' },
        ],
      },
      {
        label: 'What I write here',
        body: 'ml, computer vision, security, api design, and anything else worth mulling over.',
      },
      {
        label: 'Availability',
        body: 'ml/data internship starting 2027. dms open.',
      },
    ],
  },
} as const;

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
    path: `/${lang}/${PATHS.sobre[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.sobre.pt}`,
      en: `/en/${PATHS.sobre.en}`,
    },
  });
}

export default async function Sobre({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];

  return (
    <main className="max-w-[760px] mx-auto px-8 py-16">
      <h1
        className="font-semibold tracking-tight"
        style={{ fontSize: 40, letterSpacing: '-1.5px' }}
      >
        {t.title}
      </h1>

      <div className="mt-10 space-y-5">
        {t.paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[var(--text)]/90"
            style={{ fontSize: 17, lineHeight: 1.75 }}
          >
            {p}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        {t.cards.map((card) => (
          <div
            key={card.label}
            className="border border-[var(--border)] rounded-xl p-6 bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] transition-colors"
          >
            <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
              {card.label}
            </div>
            <div className="mt-3 text-[14px] text-[var(--text)]">
              {card.body ? (
                card.body
              ) : 'links' in card && card.links ? (
                <span className="space-x-2">
                  {card.links.map((l, idx) => (
                    <span key={l.href}>
                      <a
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : undefined}
                        rel={l.href.startsWith('http') ? 'noopener' : undefined}
                        className="dp-link text-[var(--text)]"
                      >
                        {l.text}
                      </a>
                      {idx < card.links.length - 1 && (
                        <span className="text-[var(--text-muted)]"> · </span>
                      )}
                    </span>
                  ))}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
