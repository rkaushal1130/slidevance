import React from 'react';
import { Gem, Zap, ShieldCheck } from 'lucide-react';
import heroShowcase from '../../../assets/pricing-hero-showcase-feathered.png';
import styles from './PricingHero.module.css';

export default function PricingHero() {
  return (
    <section className={styles.heroSection} aria-label="Pricing and Engagement Hero">
      {/* Background ambient aurora glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={`container ${styles.heroContainer}`}>
        {/* Left Column: Heading, Subtitle & 3 Value Pillars */}
        <div className={`${styles.contentCol} reveal-on-scroll`}>
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrowText}>PRICING &amp; ENGAGEMENT</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          <h1 className={styles.heroTitle}>
            Investment &amp;
            <br />
            <span className={styles.flexibleGradient}>Flexible Engagement</span>
          </h1>

          <p className={styles.heroParagraph}>
            Transparent pricing and flexible engagement models to match your needs —
            whether it’s a one-off project, ongoing support, or a dedicated resource.
          </p>

          {/* 3 Core Value Pillars */}
          <div className={styles.pillarsRow}>
            <div className={styles.pillarItem}>
              <div className={styles.pillarIconBox}>
                <Gem size={18} />
              </div>
              <span className={styles.pillarLabel}>High Quality Designs</span>
            </div>

            <div className={styles.pillarItem}>
              <div className={styles.pillarIconBox}>
                <Zap size={18} />
              </div>
              <span className={styles.pillarLabel}>On-Time Delivery</span>
            </div>

            <div className={styles.pillarItem}>
              <div className={styles.pillarIconBox}>
                <ShieldCheck size={18} />
              </div>
              <span className={styles.pillarLabel}>Dedicated Support</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Presentation Deck Visual */}
        <div className={`${styles.visualCol} reveal-on-scroll reveal-delay-2`}>
          <div className={styles.showcaseWrapper}>
            <img
              src={heroShowcase}
              alt="Slidevance presentation designs showcase including Strategy and Growth, Creative Designs, and Data Driven visual models"
              className={styles.showcaseImage}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
