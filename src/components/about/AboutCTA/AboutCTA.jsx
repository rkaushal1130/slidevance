import React from 'react';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './AboutCTA.module.css';

export default function AboutCTA() {
  return (
    <section className={`section-spacing ${styles.ctaSection}`} aria-label="About Us Call to Action">
      <div className="container">
        <div className={styles.ctaBox}>
          {/* Subtle background glow */}
          <div className={styles.glowAccent} />

          <div className={styles.eyebrowWrapper}>
            <Sparkles size={14} className={styles.sparkleIcon} />
            <span className={styles.eyebrowText}>LET'S COLLABORATE</span>
          </div>

          <h2 className={styles.heading}>
            Ready to Turn Information
            <br />
            <span className="gradient-text">Into a Powerful Story?</span>
          </h2>

          <p className={styles.paragraph}>
            Partner with Slidevance to transform complex models, dense proposals, and critical executive presentations into decisive business outcomes.
          </p>

          <div className={styles.btnGroup}>
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Start a Project
            </Button>
            <Button
              to="/services"
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Explore Our Services
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
