import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'marcos.run';
  const tag = searchParams.get('tag') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fdf4e8',
          padding: 80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#6e6253' }}>
          marcos.run
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#332b21',
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {tag && (
          <div style={{ display: 'flex', fontSize: 24, color: '#d96a4a' }}>
            {`#${tag}`}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
