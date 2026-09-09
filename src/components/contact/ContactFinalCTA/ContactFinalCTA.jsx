import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Button from '../../common/Button/Button';
import { contactConfig } from '../../../config/contactConfig';
import styles from './ContactFinalCTA.module.css';

export default function ContactFinalCTA() {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Final Call to Action">
      <div className="container">
        <div className={styles.ctaBox}>
          {/* Ambient Glows */}
          <div className={styles.glow} />
          <div className={styles.groundReflection} aria-hidden="true" />

          <h2 className={styles.heading}>
            Your Information. Your Design.
            <br />
            <span className="gradient-text">One Powerful Story.</span>
          </h2>

          <p className={styles.paragraph}>
            Explore our full suite of presentation design, business communication, RFP proposals and data storytelling capabilities.
          </p>

          <div className={styles.actionRow}>
            <Button
              to="/services"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Explore Services
            </Button>
          </div>

          <div className={styles.directEmail}>
            <span className={styles.emailPrompt}>Direct studio correspondence:</span>
            <a href={`mailto:${contactConfig.email}`} className={styles.emailLink}>
              <Mail size={15} />
              <span>{contactConfig.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
