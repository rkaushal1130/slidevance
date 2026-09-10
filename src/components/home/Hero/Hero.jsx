import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Button from '../../common/Button/Button';
import HeroSlideShowcase from './HeroSlideShowcase';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.heroSection} aria-label="Slidevance Hero">
      {/* Moving 3D Presentation Slides Animation in Background */}
      <HeroSlideShowcase />

      {/* Hero Content in Foreground */}
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.contentCol}>
          {/* H1 Heading */}
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>
              Ideas That <span className="gradient-text">Slide.</span>
            </span>
            <span className={styles.heroLine}>
              Solutions That <span className="gradient-text">Advance.</span>
            </span>
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

          {/* Value Checklist - Exactly like reference screenshot */}
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <div className={styles.checkIcon}>
                <Check size={14} strokeWidth={3} />
              </div>
              <span>100% in-house narrative &amp; visual designers</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.checkIcon}>
                <Check size={14} strokeWidth={3} />
              </div>
              <span>Enterprise-ready C-suite &amp; boardroom visual platform</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.checkIcon}>
                <Check size={14} strokeWidth={3} />
              </div>
              <span>Rapid turnaround &amp; agile weekend sprint coverage</span>
            </div>
          </div>

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
              <span className={styles.trustLabel}>Bespoke Systems</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustValue}>24/7</span>
              <span className={styles.trustLabel}>Agile Coverage</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustValue}>C-Suite</span>
              <span className={styles.trustLabel}>Decision Decks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
