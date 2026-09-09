import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './ServicesHero.module.css';

export default function ServicesHero() {
  return (
    <section className={styles.heroSection} aria-label="Slidevance Services Hero">
      <div className={styles.ambientGlow} />
      <div className={`container ${styles.container}`}>
        <div className={styles.contentBox}>
          {/* Heading */}
          <h1 className={styles.heading}>
            End-to-End Visual Communication,
            <br />
            <span className="gradient-text">Narrative Strategy &amp; Intelligent Design.</span>
          </h1>

          {/* Paragraph */}
          <p className={styles.paragraph}>
            We translate complex business logic, raw financial data and technical
            specifications into boardroom-ready visual assets that drive decisions.
          </p>

          {/* CTA Button */}
          <div className={styles.ctaWrapper}>
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Start a Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
