import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  return (
    <section className={`section-spacing ${styles.ctaSection}`} aria-label="Call to Action">
      <div className="container">
        <div className={styles.ctaBox}>
          {/* Subtle background ambient glow */}
          <div className={styles.glowAccent} />

          <h2 className={styles.heading}>
            Let’s Advance Your Next Deliverable.
          </h2>

          <p className={styles.paragraph}>
            Ready to turn complex information into boardroom-ready communication?
          </p>

          <div className={styles.btnGroup}>
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Start Your Project
            </Button>
            <Button
              to="/contact"
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Contact Us
            </Button>
          </div>

          {/* Direct email quick link */}
          <div className={styles.directEmail}>
            <span className={styles.emailPrompt}>Prefer direct correspondence?</span>
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
