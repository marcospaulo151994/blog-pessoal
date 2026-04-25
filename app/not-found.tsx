import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-[760px] mx-auto py-32 text-center px-8">
      <h1
        className="font-bold leading-none"
        style={{
          fontSize: 'clamp(120px, 22vw, 200px)',
          fontWeight: 700,
          letterSpacing: '-8px',
          background: 'linear-gradient(135deg, var(--accent), var(--text))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
      >
        404
      </h1>

      <p
        className="text-[var(--text-muted)] mt-6"
        style={{ fontSize: 17, lineHeight: 1.5 }}
      >
        página não encontrada
      </p>

      <div className="mt-10">
        <Link
          href="/pt"
          className="inline-flex items-center font-medium transition-opacity hover:opacity-85"
          style={{
            background: 'var(--text)',
            color: 'var(--bg)',
            padding: '12px 24px',
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          voltar pra home
        </Link>
      </div>
    </main>
  );
}
