import React from 'react';

export interface OgCardProps {
  eyebrow?: string;
  badge?: string;
  title: string;
  description: string;
  pills?: string[];
}

export function OgCard({
  eyebrow = 'STEPPAL PROTOCOL',
  badge = 'OPEN SOURCE',
  title,
  description,
  pills = ['Soroban Escrow · Stellar', 'Health Connect', 'MIT Licensed'],
}: OgCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: '#0C0A08',
        border: '14px solid #FF4A1C',
        padding: '52px 64px',
        color: '#F7F2E9',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {/* Flame Brand Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#FF4A1C',
              marginRight: '16px',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: '#FFFFFF',
                borderRadius: '3px',
              }}
            />
          </div>

          <span
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#F7F2E9',
              marginRight: '20px',
            }}
          >
            StepPal
          </span>

          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#FF4A1C',
              textTransform: 'uppercase',
            }}
          >
            ▪ Steps ▪ Stakes ▪ Settled
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#16130F',
            border: '1px solid #262019',
            borderRadius: '9999px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#C4DE18',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </div>
      </div>

      {/* Center Copy */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '16px',
          marginBottom: '16px',
        }}
      >
        {eyebrow ? (
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#8A847A',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            {eyebrow}
          </span>
        ) : null}

        <h1
          style={{
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#F7F2E9',
            margin: '0 0 16px 0',
            maxWidth: '1020px',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: '23px',
            fontWeight: 400,
            lineHeight: 1.45,
            color: '#A9A093',
            margin: 0,
            maxWidth: '960px',
          }}
        >
          {description}
        </p>
      </div>

      {/* Bottom Footer Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderTop: '1px solid #262019',
          paddingTop: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {pills.map((pill, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#16130F',
                border: '1px solid #262019',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#F7F2E9',
                fontFamily: 'monospace',
                marginRight: '12px',
              }}
            >
              {pill}
            </div>
          ))}
        </div>

        <span
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#6B6459',
            fontFamily: 'monospace',
          }}
        >
          steppal-web.vercel.app
        </span>
      </div>
    </div>
  );
}
