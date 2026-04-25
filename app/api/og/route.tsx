import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'marcos.run';
  const tag = searchParams.get('tag') ?? '';

  // Dev Premium dark palette
  // bg: #0a0a0c, text: #ededed, muted: rgba(237,237,237,0.55), accent: #a78bfa
  // Subtle purple glow at top-right via single linear-gradient (Satori-friendly).
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0c',
          backgroundImage:
            'linear-gradient(225deg, rgba(120,80,180,0.18) 0%, rgba(120,80,180,0.00) 55%)',
          padding: 80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: 'rgba(237,237,237,0.55)',
          }}
        >
          marcos.run
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#ededed',
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {tag ? (
          <div style={{ display: 'flex', fontSize: 24, color: '#a78bfa' }}>
            {`#${tag}`}
          </div>
        ) : (
          <div style={{ display: 'flex' }} />
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
