import React from 'react';
import GradientLine from '../../common/GradientLine/GradientLine';
import styles from './AboutIntro.module.css';

export default function AboutIntro() {
  return (
    <section className={`section-spacing ${styles.introSection}`} aria-label="Studio Philosophy">
      <div className={`container ${styles.container}`}>
        {/* Editorial Heading */}
        <div className={styles.headerBlock}>
          <h2 className={styles.heading}>
            Creative Thinking.
            <br />
            Strategic Structure.
            <br />
            <span className="gradient-text">Intelligent Design.</span>
          </h2>
        </div>

        <GradientLine width="140px" height="3px" align="left" className={styles.dividerLine} />

        {/* Two-Column Editorial Statement & Supporting Text */}
        <div className={styles.contentGrid}>
          <div className={styles.statementCol}>
            <p className={styles.largeStatement}>
              “Complex information deserves more than decoration.
              <br />
              <span className={styles.statementAccent}>It needs a clear story.”</span>
            </p>
          </div>

          <div className={styles.supportingCol}>
            <p className={styles.supportingText}>
              Slidevance combines narrative strategy, research and corporate visual design
              to transform complex business information into clear, decision-ready communication.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
