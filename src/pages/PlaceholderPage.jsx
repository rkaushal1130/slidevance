import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/common/Button/Button';
import GradientLine from '../components/common/GradientLine/GradientLine';

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <main style={{ padding: '6rem 0', minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          backgroundColor: 'var(--blue-soft)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid rgba(7, 95, 232, 0.15)',
          marginBottom: '1.5rem',
          color: 'var(--blue)',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>
          <Sparkles size={14} />
          <span>UPCOMING SECTION</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 4.5vw, 3.5rem)',
          fontWeight: 800,
          color: 'var(--navy)',
          marginBottom: '1rem',
          lineHeight: 1.15
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--muted)',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          {subtitle || 'This dedicated section is queued for development. Explore our comprehensive studio overview on the Home page.'}
        </p>

        <GradientLine width="180px" height="2px" align="center" style={{ marginBottom: '2.5rem' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Button to="/" variant="primary" size="lg" icon={<ArrowLeft size={18} style={{ transform: 'rotate(0deg)' }} />}>
            Back to Home
          </Button>
          <Button href="mailto:hello@slidevance.com" variant="secondary" size="lg" icon={<ArrowRight size={18} />}>
            Contact Studio
          </Button>
        </div>
      </div>
    </main>
  );
}
