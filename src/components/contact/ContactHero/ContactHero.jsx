import React from 'react';
import { ArrowRight, Mail, Lock, Zap, Globe, Users } from 'lucide-react';
import deskArtwork from '../../../assets/contact-hero-desk-feathered.png';
import { contactConfig } from '../../../config/contactConfig';
import styles from './ContactHero.module.css';

export default function ContactHero() {
  const handleScrollToForm = () => {
    const el = document.getElementById('project-inquiry-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.heroSection} aria-label="Contact Slidevance Hero">
      {/* Background ambient lighting */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={`container ${styles.heroContainer}`}>
        {/* Left Column: Typography, CTAs & Trust Badges */}
        <div className={`${styles.contentCol} reveal-on-scroll`}>
          {/* Eyebrow badge with horizontal rule */}
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrowText}>GET IN TOUCH</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          <h1 className={styles.heroTitle}>
            Let’s create
            <br />
            something
            <br />
            <span className={styles.extraordinaryGradient}>extraordinary.</span>
          </h1>

          <p className={styles.heroParagraph}>
            Share your project details, files or just an idea — we’ll take it from there.
            Our team will get back to you with the right solution, tailored to your needs.
          </p>

          {/* Action Buttons */}
          <div className={styles.actionsRow}>
            <button
              type="button"
              onClick={handleScrollToForm}
              className={styles.primaryCta}
            >
              <span>Start a Project</span>
              <ArrowRight size={16} />
            </button>

            <a
              href={`mailto:${contactConfig.email}`}
              className={styles.secondaryCta}
            >
              <Mail size={16} />
              <span>Email Us</span>
            </a>
          </div>

          {/* 4 Trust Feature Indicators */}
          <div className={styles.trustStrip}>
            <div className={styles.trustItem}>
              <div className={styles.trustIconBox}>
                <Lock size={15} />
              </div>
              <span className={styles.trustLabel}>Confidential &amp; NDA Friendly</span>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconBox}>
                <Zap size={15} />
              </div>
              <span className={styles.trustLabel}>Fast Turnaround</span>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconBox}>
                <Globe size={15} />
              </div>
              <span className={styles.trustLabel}>Global Clients</span>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconBox}>
                <Users size={15} />
              </div>
              <span className={styles.trustLabel}>Dedicated Design Support</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Desk Scene */}
        <div className={`${styles.visualCol} reveal-on-scroll reveal-delay-2`}>
          <div className={styles.visualWrapper}>
            <img
              src={deskArtwork}
              alt="Slidevance executive desk workspace with laptop and Better Ideas Together mug"
              className={styles.deskImage}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
