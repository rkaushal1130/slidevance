import React from 'react';
import { Lightbulb, ShieldCheck, Zap, Headphones, Star, Info } from 'lucide-react';
import styles from './PricingWhyChoose.module.css';

const WHY_CHOOSE_PILLARS = [
  {
    icon: Lightbulb,
    label: 'Creative & Professional Designs',
    theme: 'blue',
  },
  {
    icon: ShieldCheck,
    label: 'Tailored to Your Brand',
    theme: 'purple',
  },
  {
    icon: Zap,
    label: 'Fast Turnaround Time',
    theme: 'blue',
  },
  {
    icon: Headphones,
    label: 'Dedicated Project Support',
    theme: 'magenta',
  },
  {
    icon: Star,
    label: '100% Client Satisfaction',
    theme: 'blue',
  },
];

export default function PricingWhyChoose() {
  return (
    <section className={styles.section} aria-label="Why Choose Slidevance">
      <div className="container">
        {/* Upper Strip: Header on Left + 5 Pillars on Right */}
        <div className={`${styles.trustStrip} reveal-on-scroll`}>
          <div className={styles.brandCol}>
            <span className={styles.eyebrow}>WHY CHOOSE</span>
            <h2 className={styles.brandName}>SLIDEVANCE</h2>
            <p className={styles.brandDesc}>
              More than just slides. We’re your creative presentation partner.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {WHY_CHOOSE_PILLARS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className={styles.pillarCell}>
                  {idx > 0 && <div className={styles.dividerLine} aria-hidden="true" />}
                  <div className={styles.pillarContent}>
                    <div className={`${styles.iconWrap} ${styles[`theme_${item.theme}`]}`}>
                      <IconComp size={18} />
                    </div>
                    <span className={styles.pillarLabel}>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer Info Banner */}
        <div className={`${styles.disclaimerWrapper} reveal-on-scroll reveal-delay-1`}>
          <div className={styles.disclaimerBox}>
            <div className={styles.infoIconCircle}>
              <Info size={16} />
            </div>
            <p className={styles.disclaimerText}>
              Final pricing may vary based on project complexity, content volume, design requirements, and turnaround time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
