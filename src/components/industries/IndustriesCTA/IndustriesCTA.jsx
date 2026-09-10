import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './IndustriesCTA.module.css';

export default function IndustriesCTA() {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Industries Call to Action">
      <div className="container">
        <div className={styles.ctaBox}>
          {/* Ambient Glow */}
          <div className={styles.glow} />

          <h2 className={styles.heading}>
            Have a Complex
            <br />
            <span className="gradient-text">Communication Challenge?</span>
          </h2>

          <p className={styles.paragraph}>
            Whether navigating technical complexity, market data density, or high-stakes investor scrutiny,
            Slidevance structures your communication for decisive outcomes.
          </p>

          <div className={styles.actionRow}>
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Talk to Slidevance
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
