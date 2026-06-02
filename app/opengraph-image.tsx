import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ihor Metelskyi — Software QA Engineer | Living CV';
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
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 100%)',
          padding: 60,
          fontFamily: 'monospace',
          color: '#e2e8f0',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#00ff9c',
            fontSize: 20,
          }}
        >
          <span style={{ color: '#00e5ff' }}>$</span> cat /etc/ihor.conf
        </div>

        <div
          style={{
            color: '#00ff9c',
            fontSize: 28,
            marginBottom: 20,
            display: 'flex',
          }}
        >
          {'> loading profile...'}
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #00ff9c 0%, #00e5ff 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1.1,
            display: 'flex',
            marginBottom: 16,
          }}
        >
          Ihor Metelskyi
        </div>

        <div
          style={{
            fontSize: 44,
            color: '#00e5ff',
            fontWeight: 600,
            display: 'flex',
            marginBottom: 32,
          }}
        >
          Software QA Engineer
        </div>

        <div
          style={{
            fontSize: 26,
            color: '#94a3b8',
            display: 'flex',
            marginBottom: 16,
          }}
        >
          While others submit PDFs... I ship experiences.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 'auto',
            fontSize: 22,
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex' }}>
            <span style={{ color: '#00ff9c' }}>7+</span>&nbsp;years in IT
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ color: '#00ff9c' }}>3</span>&nbsp;domains
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ color: '#00ff9c' }}>3</span>&nbsp;platforms
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ color: '#00ff9c' }}>iGaming</span>&nbsp;•&nbsp;IoT&nbsp;•&nbsp;E-Commerce
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 60,
            fontSize: 22,
            color: '#00ff9c',
            display: 'flex',
          }}
        >
          github.com/IgorMet
        </div>
      </div>
    ),
    { ...size }
  );
}
