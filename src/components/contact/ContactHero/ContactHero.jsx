import React from 'react';
import styles from './ContactHero.module.css';

export default function ContactHero() {
  return (
    <section className={styles.heroSection} aria-label="Contact Slidevance Hero">
      {/* Background ambient glow */}
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.eyebrowBadge}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>LET'S TALK</span>
          </div>

          <h1 className={styles.heroTitle}>
            Let’s Advance
            <br />
            <span className="gradient-text">Your Next Deliverable.</span>
          </h1>

          <p className={styles.heroParagraph}>
            Tell us what you're building. We'll help turn the information into a powerful business story.
          </p>
        </div>
      </div>
    </section>
  );
}
