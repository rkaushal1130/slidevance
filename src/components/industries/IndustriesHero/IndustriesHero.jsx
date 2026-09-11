import React from 'react';
import styles from './IndustriesHero.module.css';

export default function IndustriesHero() {
  return (
    <section className={styles.heroSection} aria-label="Industries Hero">
      <div className={styles.ambientGlow} />
      <div className={`container ${styles.container}`}>
        <div className={styles.contentBox}>
          {/* Heading */}
          <h1 className={`${styles.heading} reveal-on-scroll`}>
            Communication Built
            <br />
            for <span className="gradient-text">Complex Industries.</span>
          </h1>

          {/* Paragraph */}
          <p className={`${styles.paragraph} reveal-on-scroll reveal-delay-2`}>
            Strategic visual communication designed around your business, audience and decision-making environment.
          </p>
        </div>
      </div>
    </section>
  );
}
