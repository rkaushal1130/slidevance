import React from 'react';
import styles from './ContactHero.module.css';

export default function ContactHero() {
  return (
    <section className={styles.heroSection} aria-label="Contact Slidevance Hero">
      {/* Background ambient glow */}
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.contentWrapper}>
          <h1 className={`${styles.heroTitle} reveal-on-scroll`}>
            Let’s Advance
            <br />
            <span className="gradient-text">Your Next Deliverable.</span>
          </h1>

          <p className={`${styles.heroParagraph} reveal-on-scroll reveal-delay-2`}>
            Tell us what you're building. We'll help turn the information into a powerful business story.
          </p>
        </div>
      </div>
    </section>
  );
}
