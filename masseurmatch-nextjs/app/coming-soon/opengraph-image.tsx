import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MasseurMatch - Coming Soon';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Purple Gradient Orb */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Pink Gradient Orb */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: '96px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #8b5cf6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
              padding: 0,
            }}
          >
            Coming Soon
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#cbd5e1',
              marginTop: '20px',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            The future of wellness connections
          </p>
          <div
            style={{
              marginTop: '40px',
              fontSize: '24px',
              color: '#94a3b8',
              letterSpacing: '2px',
            }}
          >
            MASSEURMATCH.COM
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
