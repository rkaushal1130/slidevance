import React from 'react';
import styles from './PositioningStrip.module.css';

const PILLARS = [
  { text: 'PRESENTATION', bulletColor: 'blue' },
  { text: 'RESEARCH', bulletColor: 'purple' },
  { text: 'BUSINESS COMMUNICATION', bulletColor: 'orange' },
  { text: 'EXECUTIVE ONE-PAGER / SERVICE SHEET', bulletColor: 'blue' },
  { text: 'PRESENTATION DECK', bulletColor: 'purple' },
  { text: 'COMPREHENSIVE DECK', bulletColor: 'orange' },
  { text: 'INTERACTIVE DECKS & MASTER TEMPLATE', bulletColor: 'blue' },
  { text: 'PROPOSAL, BID & RFP DOCUMENT', bulletColor: 'purple' },
  { text: 'DESK RESEARCH & MARKET BENCHMARKING', bulletColor: 'orange' },
];

export default function PositioningStrip() {
  return (
    <section className={styles.ribbonSection} aria-label="Brand Core Capabilities Ribbon">
      <div className={styles.ribbonContainer}>
        <div className={styles.ribbonTrack}>
          {/* Group 1 */}
          <div className={styles.ribbonGroup}>
            {PILLARS.map((pillar, idx) => (
              <span key={`p1-${idx}`} className={styles.pillarItem}>
                <span className={styles.pillarText}>{pillar.text}</span>
                <span className={`${styles.bullet} ${styles[`bullet_${pillar.bulletColor}`]}`}>
                  •
                </span>
              </span>
            ))}
          </div>

          {/* Group 2 (Clone for infinite seamless loop) */}
          <div className={styles.ribbonGroup} aria-hidden="true">
            {PILLARS.map((pillar, idx) => (
              <span key={`p2-${idx}`} className={styles.pillarItem}>
                <span className={styles.pillarText}>{pillar.text}</span>
                <span className={`${styles.bullet} ${styles[`bullet_${pillar.bulletColor}`]}`}>
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
