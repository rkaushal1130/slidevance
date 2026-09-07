import React from 'react';
import GradientLine from '../../common/GradientLine/GradientLine';
import styles from './PositioningStrip.module.css';

export default function PositioningStrip() {
  return (
    <section className={styles.stripSection} aria-label="Brand Core Capabilities">
      {/* Thin gradient line above */}
      <GradientLine height="2px" width="100%" />

      <div className={`container ${styles.stripContainer}`}>
        <div className={styles.stripContent}>
          <span className={styles.pillarText}>PRESENTATION</span>
          <span className={styles.bullet}>•</span>
          <span className={styles.pillarText}>RESEARCH</span>
          <span className={styles.bullet}>•</span>
          <span className={styles.pillarText}>BUSINESS COMMUNICATION</span>
        </div>
      </div>

      {/* Thin gradient line below for crisp visual enclosure */}
      <GradientLine height="1.5px" width="100%" opacity={0.6} />
    </section>
  );
}
