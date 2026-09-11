import React from 'react';
import {
  FileText,
  Search,
  Pencil,
  RotateCw,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import styles from './Process.module.css';

const iconMap = {
  FileText,
  Search,
  Pencil,
  RotateCw,
  CheckCircle2,
};

export default function ProcessTimeline({ steps }) {
  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => {
          const IconComponent = iconMap[step.icon] || FileText;
          return (
            <React.Fragment key={step.number}>
              <div
                className={`${styles.stepCard} reveal-on-scroll reveal-delay-${Math.min(index + 1, 5)}`}
                style={{
                  '--card-accent': step.color,
                  '--card-bg': step.bgColor,
                  '--card-border': step.borderColor,
                  '--card-light-bg': step.lightBg,
                }}
              >
                {/* Header: Rounded Icon Box + Step Number */}
                <div className={styles.cardHeader}>
                  <div
                    className={styles.iconBox}
                    style={{
                      backgroundColor: step.lightBg,
                      color: step.color,
                    }}
                  >
                    <IconComponent size={24} strokeWidth={2.1} />
                  </div>
                  <span
                    className={styles.stepNumber}
                    style={{ color: step.color }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className={styles.cardTitle}>{step.title}</h3>

                {/* Card Description */}
                <p className={styles.cardDescription}>{step.description}</p>

                {/* Bottom-right angled accent tab */}
                <div
                  className={styles.cornerAccent}
                  style={{ backgroundColor: step.color }}
                />
              </div>

              {/* Chevron arrow connector between cards */}
              {index < steps.length - 1 && (
                <div className={styles.chevronWrapper} aria-hidden="true">
                  <ChevronRight size={22} className={styles.chevronIcon} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
