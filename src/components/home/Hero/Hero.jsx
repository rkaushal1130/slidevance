import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.heroSection} aria-label="Slidevance Hero">
      <div className={`container ${styles.heroContainer}`}>
        {/* Centered Content Column: Text, CTAs & Trust Strip */}
        <div className={styles.contentCol}>
          {/* H1 Heading */}
          <h1 className={styles.heroTitle}>
            Ideas That <span className="gradient-text">Slide.</span>
            <br />
            Solutions That <span className="gradient-text">Advance.</span>
          </h1>

          {/* Secondary Heading */}
          <h2 className={styles.secondaryTitle}>
            “We Turn Complex Ideas Into Clear, Decisive Communication.”
          </h2>

          {/* Paragraph */}
          <p className={styles.heroParagraph}>
            Slidevance combines narrative strategy, research, and corporate visual design
            to build materials engineered for high-stakes decisions.
          </p>

          {/* Action Buttons */}
          <div className={styles.ctaGroup}>
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Start a Project
            </Button>
            <Button
              to="/portfolio"
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Explore Our Work
            </Button>
          </div>

          {/* Trust Indicators / Credentials Strip */}
          <div className={styles.trustStrip}>
            <div className={styles.trustItem}>
              <span className={styles.trustValue}>100%</span>
              <span className={styles.trustLabel}>Bespoke Visual Systems</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustValue}>24/7</span>
              <span className={styles.trustLabel}>Agile Weekend Coverage</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustValue}>C-Suite</span>
              <span className={styles.trustLabel}>Decision Grade Decks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
