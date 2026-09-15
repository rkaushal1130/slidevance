import React from 'react';
import { Link } from 'react-router-dom';
import ctaGlow from '../../../assets/about/cta-glow-accent.png';
import styles from './AboutCTA.module.css';

export default function AboutCTA() {
  return (
    <section className={styles.ctaSection} aria-label="About Us Call to Action">
      <div className={`container ${styles.container}`}>
        {/* Left Column: Heading */}
        <div className={`${styles.leftCol} reveal-on-scroll`}>
          <div className={styles.tagWrap}>
            <span className={styles.sectionTag}>OUR PROMISE</span>
            <span className={styles.tagLine} />
          </div>

          <h2 className={styles.heading}>
            Your idea deserves<br />
            <span className={styles.bulletGradient}>more than a bullet point.</span>
          </h2>
          <div className={styles.underDecoration}>
            <svg viewBox="0 0 140 10" fill="none" className={styles.squiggleSvg}>
              <path d="M2 6C25 1 50 9 75 5C100 1 120 7 138 4" stroke="#00D2FF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Middle Column: Prompt & Get in Touch Button */}
        <div className={`${styles.middleCol} reveal-on-scroll`}>
          <p className={styles.promptText}>
            Let’s turn your information<br />
            into something unforgettable.
          </p>
          <Link to="/contact" className={styles.getInTouchBtn}>
            Get in Touch
          </Link>
        </div>

        {/* Right Column: Luminous Glow & Better Slides. Bigger Impact. */}
        <div className={`${styles.rightCol} reveal-on-scroll`}>
          <img
            src={ctaGlow}
            alt="Better Slides. Bigger Impact."
            className={styles.glowImg}
            loading="lazy"
          />
        </div>
      </div>

      {/* Sub-Footer Tags */}
      <div className={styles.subFooter}>
        <div className={`container ${styles.subFooterContainer}`}>
          <span className={styles.subLink}>Presentations</span>
          <span className={styles.subDivider}>/</span>
          <span className={styles.subLink}>Proposals</span>
          <span className={styles.subDivider}>/</span>
          <span className={styles.subLink}>Documents</span>
        </div>
      </div>
    </section>
  );
}
