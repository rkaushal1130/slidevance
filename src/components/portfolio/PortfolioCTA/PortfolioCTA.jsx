import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './PortfolioCTA.module.css';

export default function PortfolioCTA() {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Portfolio Call to Action">
      <div className="container">
        <div className={styles.ctaBox}>
          {/* Ambient Glow */}
          <div className={styles.glow} />

          <h2 className={styles.heading}>
            Have a Complex Story to Tell?
          </h2>

          <p className={styles.paragraph}>
            “Let’s turn your information into communication built for the people who need to act on it.”
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
            <span className={styles.emailPrompt}>Direct confidential inquiry:</span>
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
