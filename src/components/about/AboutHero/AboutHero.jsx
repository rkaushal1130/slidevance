import React from 'react';
import GeometricVisual from '../../home/GeometricVisual/GeometricVisual';
import styles from './AboutHero.module.css';

export default function AboutHero() {
  return (
    <section className={styles.heroSection} aria-label="About Slidevance Hero">
      <div className={`container ${styles.heroContainer}`}>
        {/* Left Column: Eyebrow, H1, Paragraph */}
        <div className={styles.contentCol}>
          <div className={styles.eyebrowBadge}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>
              CREATIVE PRESENTATION &amp; BUSINESS COMMUNICATION STUDIO
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            We Turn Complex Ideas
            <br />
            Into <span className="gradient-text">Clear, Decisive Communication.</span>
          </h1>

          <p className={styles.heroParagraph}>
            Slidevance is a creative business communication studio combining narrative strategy,
            research, and corporate visual design to build materials engineered for high-stakes decisions.
          </p>
        </div>

        {/* Right Column: Same Layered Geometric Visual from Home */}
        <div className={styles.visualCol}>
          <GeometricVisual />
        </div>
      </div>
    </section>
  );
}
