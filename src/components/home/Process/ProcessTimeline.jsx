import React from 'react';
import styles from './Process.module.css';

export default function ProcessTimeline({ steps }) {
  return (
    <div className={styles.timelineWrapper}>
      {/* Desktop Horizontal Line */}
      <div className={styles.horizontalLine} aria-hidden="true">
        <div className={styles.gradientLineTrack} />
      </div>

      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.stepItem}>
            {/* Step Node Marker */}
            <div className={styles.nodeWrapper}>
              <div className={styles.nodeRing}>
                <div className={styles.nodeCore} />
              </div>
              <span className={styles.stepBadge}>{step.number}</span>
            </div>

            {/* Mobile Connecting Line */}
            {index < steps.length - 1 && (
              <div className={styles.verticalConnectingLine} aria-hidden="true" />
            )}

            {/* Step Content */}
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              <div className={styles.stepFocus}>
                <span className={styles.focusLabel}>Deliverable focus:</span>
                <span className={styles.focusValue}>{step.focus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
