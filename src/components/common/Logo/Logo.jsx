import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ variant = 'default', className = '' }) {
  const isLight = variant === 'light';

  return (
    <Link to="/" className={`${styles.logoContainer} ${className}`} aria-label="Slidevance Home">
      <div className={styles.symbolWrapper}>
        <svg
          className={styles.symbolSvg}
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="slidevanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#075FE8" />
              <stop offset="30%" stopColor="#12C9E8" />
              <stop offset="65%" stopColor="#E52BB8" />
              <stop offset="100%" stopColor="#FF9D25" />
            </linearGradient>
          </defs>
          {/* Base slide layer - translucent navy/blue */}
          <rect
            x="3"
            y="9"
            width="22"
            height="20"
            rx="4"
            transform="rotate(-8 3 9)"
            fill={isLight ? 'rgba(255,255,255,0.2)' : 'rgba(7, 95, 232, 0.15)'}
            stroke={isLight ? 'rgba(255,255,255,0.4)' : 'rgba(7, 95, 232, 0.3)'}
            strokeWidth="1.5"
          />
          {/* Top advancing slide layer with signature gradient accent */}
          <rect
            x="11"
            y="7"
            width="22"
            height="22"
            rx="4"
            fill={isLight ? '#061B3F' : '#FFFFFF'}
            stroke="url(#slidevanceGrad)"
            strokeWidth="2"
          />
          {/* Internal slide dynamic vector bars */}
          <rect x="15" y="12" width="10" height="2" rx="1" fill="url(#slidevanceGrad)" />
          <rect x="15" y="16.5" width="14" height="2" rx="1" fill={isLight ? '#9CA3AF' : '#8E9DB5'} />
          <rect x="15" y="21" width="7" height="2" rx="1" fill={isLight ? '#9CA3AF' : '#8E9DB5'} />
          
          {/* Advancing dynamic arrow indicator */}
          <path
            d="M26 24L29 27L26 30"
            stroke="url(#slidevanceGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={styles.textWrapper}>
        <span className={`${styles.brandName} ${isLight ? styles.brandNameLight : ''}`}>
          SLIDEVANCE
        </span>
        <span className={`${styles.brandSubtitle} ${isLight ? styles.brandSubtitleLight : ''}`}>
          PRESENTATION STUDIO
        </span>
      </div>
    </Link>
  );
}
