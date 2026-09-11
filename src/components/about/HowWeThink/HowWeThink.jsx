import React from 'react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import styles from './HowWeThink.module.css';

export default function HowWeThink() {
  const stages = [
    {
      number: '01',
      title: 'UNDERSTAND',
      description: 'Start with the business objective, audience and information.',
      focus: 'Discovery & Objective Clarity'
    },
    {
      number: '02',
      title: 'STRUCTURE',
      description: 'Shape research, data and content into a clear narrative.',
      focus: 'Narrative Logic & Blueprint'
    },
    {
      number: '03',
      title: 'COMMUNICATE',
      description: 'Turn the narrative into polished, decision-ready visual communication.',
      focus: 'Boardroom-Ready Polish'
    }
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="How We Think">
      <div className="container">
        <SectionHeading
          title="How We Think"
          subtitle="Three continuous phases bridging analytical business strategy with executive design excellence."
          align="center"
        />

        <div className={styles.stagesWrapper}>
          {/* Desktop Horizontal Gradient Connector */}
          <div className={styles.desktopLine} aria-hidden="true">
            <div className={styles.gradientTrack} />
          </div>

          <div className={styles.stagesGrid}>
            {stages.map((stage, index) => (
              <div key={stage.title} className={`${styles.stageItem} reveal-on-scroll reveal-delay-${index + 1}`}>
                {/* Node Ring Indicator */}
                <div className={styles.nodeWrapper}>
                  <div className={styles.nodeRing}>
                    <div className={styles.nodeCore} />
                  </div>
                  <span className={styles.stageNumber}>{stage.number}</span>
                </div>

                {/* Mobile Connecting Line */}
                {index < stages.length - 1 && (
                  <div className={styles.mobileLine} aria-hidden="true" />
                )}

                {/* Stage Content Card */}
                <div className={styles.stageCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.tag}>STAGE {stage.number}</span>
                  </div>
                  <h3 className={styles.stageTitle}>{stage.title}</h3>
                  <p className={styles.stageDesc}>“{stage.description}”</p>
                  <div className={styles.stageFooter}>
                    <span className={styles.footerLabel}>Operational Focus</span>
                    <span className={styles.footerValue}>{stage.focus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
