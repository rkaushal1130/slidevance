import React, { useState } from 'react';
import { Lock, ShieldCheck, Zap, Users, Mail, Calendar, ArrowRight, Check, X } from 'lucide-react';
import bottomRibbon from '../../../assets/contact-bottom-accent.png';
import { contactConfig } from '../../../config/contactConfig';
import styles from './ContactTrustSection.module.css';

const TRUST_POINTS = [
  {
    id: 'confidential',
    title: 'Confidential by Default',
    description: 'Your business information remains private.',
    icon: Lock,
    theme: 'blue',
  },
  {
    id: 'nda',
    title: 'NDA Friendly',
    description: 'Happy to work under your existing NDA.',
    icon: ShieldCheck,
    theme: 'purple',
  },
  {
    id: 'turnaround',
    title: 'Fast Turnaround',
    description: 'Built for time-sensitive business needs.',
    icon: Zap,
    theme: 'orange',
  },
  {
    id: 'dedicated',
    title: 'Dedicated Design Support',
    description: 'From one-off projects to ongoing monthly requirements.',
    icon: Users,
    theme: 'magenta',
  },
];

export default function ContactTrustSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactConfig.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <section className={styles.section} aria-label="Why clients trust Slidevance">
      {/* Upper Container: Why Clients Trust Slidevance + 2x2 Grid */}
      <div className={`container ${styles.topContainer}`}>
        {/* Left Column: Heading & Trust Guarantee */}
        <div className={`${styles.leftCol} reveal-on-scroll`}>
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrowText}>WHY CLIENTS TRUST SLIDEVANCE</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          <h2 className={styles.heading}>
            Your vision is<br />
            <span className={styles.safeGradient}>safe with us.</span>
          </h2>

          <p className={styles.description}>
            We value your trust and ensure complete confidentiality in every project we take on.
          </p>
        </div>

        {/* Right Column: 2x2 Grid of Trust Features */}
        <div className={`${styles.rightCol} reveal-on-scroll reveal-delay-2`}>
          <div className={styles.trustGrid}>
            {TRUST_POINTS.map((pt) => {
              const IconComp = pt.icon;
              return (
                <div key={pt.id} className={styles.trustCard}>
                  <div className={`${styles.iconCircle} ${styles[`theme_${pt.theme}`]}`}>
                    <IconComp size={18} />
                  </div>
                  <div className={styles.trustCardContent}>
                    <h3 className={`${styles.trustCardTitle} ${styles[`title_${pt.theme}`]}`}>{pt.title}</h3>
                    <p className={styles.trustCardDesc}>{pt.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Strip with Glowing Ribbon Wave Accent */}
      <div className={styles.bottomStripWrapper}>
        {/* Abstract glowing ribbon accent in bottom-left */}
        <div className={styles.ribbonWrapper} aria-hidden="true">
          <img
            src={bottomRibbon}
            alt=""
            className={styles.ribbonImage}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={`container ${styles.stripContainer}`}>
          {/* Direct Email Action */}
          <div className={styles.emailBlock}>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={styles.stripIconBtn}
              title="Copy direct email"
              aria-label="Copy direct email"
            >
              {copiedEmail ? <Check size={18} className={styles.copiedIcon} /> : <Mail size={18} />}
            </button>
            <div className={styles.stripTextBlock}>
              <span className={styles.stripLabel}>Prefer a direct conversation?</span>
              <a href={`mailto:${contactConfig.email}`} className={styles.stripLink}>
                {contactConfig.email}
              </a>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className={styles.stripDivider} aria-hidden="true" />

          {/* Book a Call Action */}
          <div className={styles.bookingBlock}>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={styles.stripIconBtn}
              aria-label="Book a 15-min discovery call"
            >
              <Calendar size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={styles.bookCallBtn}
            >
              <span>Book a 15-min Call</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Slogan on the Far Right */}
          <div className={styles.sloganBlock}>
            <span className={styles.sloganTop}>Better Ideas.</span>
            <span className={styles.sloganBottom}>Bigger Impact.</span>
          </div>
        </div>
      </div>

      {/* Quick 15-min Discovery Call Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalCalendarIcon}>
                <Calendar size={28} />
              </div>
              <h3 id="modal-title" className={styles.modalHeading}>
                Book a 15-Minute Discovery Call
              </h3>
              <p className={styles.modalSubheading}>
                Discuss your project scope, turnaround timeline, and confidential deliverables directly with our lead strategist.
              </p>
            </div>

            <div className={styles.modalActions}>
              <a
                href={`mailto:${contactConfig.email}?subject=15-min%20Project%20Discovery%20Call%20Request&body=Hi%20Slidevance%20Team,%0D%0A%0D%0AI%20would%20like%20to%20schedule%20a%2015-minute%20introductory%20call%20to%20discuss%20our%20project%20needs.%0D%0A%0D%0APreferred%20Time:%20%0D%0AProject%20Type:%20%0D%0A`}
                className={styles.modalPrimaryBtn}
              >
                Schedule via Email Invitation
                <ArrowRight size={16} />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={styles.modalSecondaryBtn}
              >
                {copiedEmail ? 'Copied hello@slidevance.com' : 'Copy Direct Studio Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
