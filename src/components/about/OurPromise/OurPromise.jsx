import React from 'react';
import GradientLine from '../../common/GradientLine/GradientLine';
import styles from './OurPromise.module.css';

export default function OurPromise() {
  return (
    <section className={`section-spacing ${styles.promiseSection}`} aria-label="Our Promise">
      <div className="container">
        <div className={styles.promiseCard}>
          {/* Subtle Geometric Corner Decorations */}
          <div className={`${styles.cornerDecoration} ${styles.cornerTopLeft}`} aria-hidden="true">
            <span className={styles.cornerDotCyan} />
            <div className={styles.cornerLines} />
          </div>
          <div className={`${styles.cornerDecoration} ${styles.cornerTopRight}`} aria-hidden="true">
            <span className={styles.cornerDotBlue} />
            <div className={styles.cornerLines} />
          </div>
          <div className={`${styles.cornerDecoration} ${styles.cornerBottomLeft}`} aria-hidden="true">
            <span className={styles.cornerDotMagenta} />
            <div className={styles.cornerLines} />
          </div>
          <div className={`${styles.cornerDecoration} ${styles.cornerBottomRight}`} aria-hidden="true">
            <span className={styles.cornerDotOrange} />
            <div className={styles.cornerLines} />
          </div>

          {/* Heading */}
          <h2 className={styles.heading}>
            Your Information.
            <br />
            Your Design.
            <br />
            <span className="gradient-text">One Powerful Story.</span>
          </h2>

          <div className={styles.gradientLineWrapper}>
            <GradientLine width="160px" height="3px" align="center" />
          </div>

          {/* Paragraph */}
          <p className={styles.paragraph}>
            “We bring together business logic, research, narrative structure and visual
            design to create communication that is clear, purposeful and ready for the boardroom.”
          </p>

          {/* Four Core Pillars Strip */}
          <div className={styles.pillarsStrip}>
            <div className={styles.pillar}>
              <span className={styles.pillarNumber}>01</span>
              <span className={styles.pillarName}>Business Logic</span>
            </div>
            <div className={styles.pillarDivider}>•</div>
            <div className={styles.pillar}>
              <span className={styles.pillarNumber}>02</span>
              <span className={styles.pillarName}>Research</span>
            </div>
            <div className={styles.pillarDivider}>•</div>
            <div className={styles.pillar}>
              <span className={styles.pillarNumber}>03</span>
              <span className={styles.pillarName}>Narrative Structure</span>
            </div>
            <div className={styles.pillarDivider}>•</div>
            <div className={styles.pillar}>
              <span className={styles.pillarNumber}>04</span>
              <span className={styles.pillarName}>Visual Design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
