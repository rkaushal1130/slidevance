import React from 'react';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './ServicesCTA.module.css';

export default function ServicesCTA() {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Services Call to Action">
      <div className="container">
        <div className={styles.ctaBox}>
          {/* Ambient Glow */}
          <div className={styles.glow} />

          <div className={styles.eyebrowWrapper}>
            <Sparkles size={14} className={styles.sparkleIcon} />
            <span className={styles.eyebrowText}>INITIATE COLLABORATION</span>
          </div>

          <h2 className={styles.heading}>
            Tell Us What You’re Building.
          </h2>

          <p className={styles.paragraph}>
            “We’ll help shape the information, story and visual direction.”
          </p>

          <div className={styles.actionRow}>
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Start a Project
            </Button>
          </div>

          <div className={styles.directEmail}>
            <span className={styles.emailPrompt}>Direct studio correspondence:</span>
            <a href="mailto:hello@slidevance.com" className={styles.emailLink}>
              <Mail size={15} />
              <span>hello@slidevance.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
