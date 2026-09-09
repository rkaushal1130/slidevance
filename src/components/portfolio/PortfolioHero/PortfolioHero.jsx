import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './PortfolioHero.module.css';

export default function PortfolioHero() {
  return (
    <section className={styles.heroSection} aria-label="Portfolio Hero">
      <div className={`container ${styles.container}`}>
        <div className={styles.contentBox}>
          {/* Heading */}
          <h1 className={styles.heading}>
            Work That Moves
            <br />
            <span className="gradient-text">Business Forward.</span>
          </h1>

          {/* Paragraph */}
          <p className={styles.paragraph}>
            Selected presentation, communication and visual storytelling work designed
            to make complex information clear, compelling and decision-ready.
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
