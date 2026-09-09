import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import GeometricVisual from '../../home/GeometricVisual/GeometricVisual';
import styles from './IndustriesVisualSection.module.css';

export default function IndustriesVisualSection() {
  const tenets = [
    { title: 'Complex Data', outcome: 'Intuitive quantitative charts & decision models' },
    { title: 'Corporate Strategy', outcome: 'Objective-first narrative & structured blueprints' },
    { title: 'Deep Research', outcome: 'Decisive market positioning & competitor matrices' },
    { title: 'Technical Architecture', outcome: 'Executive-grade system diagrams & clear RFPs' },
  ];

  return (
    <section className={styles.darkSection} aria-label="Strategic Translation Visual Section">
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.container}`}>
        {/* Left Column: Heading and narrative */}
        <div className={styles.contentCol}>
          <h2 className={styles.heading}>
            Complex Information.
            <br />
            <span className="gradient-text">Clear Direction.</span>
          </h2>

          <p className={styles.paragraph}>
            “Whether the challenge is data, strategy, research or technical information,
            the goal remains the same: make the message easier to understand and act upon.”
          </p>

          <div className={styles.tenetsGrid}>
            {tenets.map((tenet) => (
              <div key={tenet.title} className={styles.tenetItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <div className={styles.tenetText}>
                  <strong className={styles.tenetTitle}>{tenet.title}:</strong>{' '}
                  <span className={styles.tenetOutcome}>{tenet.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Layered Geometric Visual */}
        <div className={styles.visualCol}>
          <GeometricVisual />
        </div>
      </div>
    </section>
  );
}
