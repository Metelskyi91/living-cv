import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ihor Metelskyi — Software QA Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0e1a',
          padding: 60,
          color: '#e2e8f0',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ color: '#00ff9c', fontSize: 28, display: 'flex' }}>{'>'} Ihor Metelskyi</div>
        <div style={{ color: '#00e5ff', fontSize: 48, fontWeight: 700, marginTop: 12, display: 'flex' }}>
          Software QA Engineer
        </div>
        <div style={{ color: '#94a3b8', fontSize: 24, marginTop: 24, display: 'flex' }}>
          7+ years • iGaming • IoT • E-Commerce
        </div>
      </div>
    ),
    { ...size }
  );
}
