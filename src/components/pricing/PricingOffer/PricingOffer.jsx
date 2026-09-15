import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import offerShowcase from '../../../assets/pricing-offer-showcase-feathered.png';
import styles from './PricingOffer.module.css';

export default function PricingOffer() {
  return (
    <section className={styles.section} aria-label="First Time Client Offer">
      <div className="container">
        <div className={`${styles.offerCard} reveal-on-scroll`}>
          {/* Ambient Glows */}
          <div className={styles.glowBlue} aria-hidden="true" />
          <div className={styles.glowPink} aria-hidden="true" />

          <div className={styles.gridContainer}>
            {/* Left Content */}
            <div className={styles.contentCol}>
              <div className={styles.offerBadge}>
                <span>EXCLUSIVE FIRST-TIME CLIENT OFFER</span>
                <span className={styles.badgeArrow}>›</span>
              </div>

              <div className={styles.titleWrapper}>
                <span className={styles.giantFive}>5</span>
                <h2 className={styles.giantText}>FREE SLIDES</h2>
              </div>

              <p className={styles.tagline}>
                See the SlideVance difference before you commit.
              </p>

              {/* Bullet points */}
              <ul className={styles.bulletsList}>
                <li className={styles.bulletItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Get your first 5 slides FREE with your first comprehensive deck project.</span>
                </li>
                <li className={styles.bulletItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>High-quality designs &amp; creative layouts.</span>
                </li>
                <li className={styles.bulletItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>No commitment required.</span>
                </li>
              </ul>

              {/* CTA Action */}
              <div className={styles.ctaWrapper}>
                <Link
                  to="/contact?offer=5-free-slides"
                  className={styles.claimBtn}
                >
                  <span>Claim Your 5 Free Slides</span>
                  <ArrowRight size={16} />
                </Link>

                <span className={styles.footnote}>
                  For your first 25+ slide comprehensive deck project.
                </span>
              </div>
            </div>

            {/* Right Visual 3D Showcase */}
            <div className={styles.visualCol}>
              <div className={styles.showcaseBox}>
                <img
                  src={offerShowcase}
                  alt="Slidevance 5 Free Slides sample deck including Transforming Ideas Into Reality, Business Growth, and Your Vision Our Design"
                  className={styles.showcaseImage}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
