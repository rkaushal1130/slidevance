import React, { useState } from 'react';
import { Mail, Clock, ShieldCheck, Check, Copy } from 'lucide-react';
import { contactConfig } from '../../../config/contactConfig';
import styles from './ContactSidebar.module.css';

export default function ContactSidebar() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className={styles.sidebarWrapper} aria-label="Contact Information and Studio Commitments">
      <div className={styles.introHeader}>
        <h2 className={styles.heading}>Start the Conversation.</h2>
        <p className={styles.description}>
          Whether you need a presentation, proposal, business document, research asset or ongoing design support, share your requirements with us.
        </p>
      </div>

      {/* Official Studio Email Card */}
      <div className={styles.emailCard}>
        <div className={styles.emailHeader}>
          <div className={styles.iconCircle}>
            <Mail size={20} className={styles.mailIcon} />
          </div>
          <div>
            <span className={styles.cardLabel}>Direct Studio Email</span>
            <a href={`mailto:${contactConfig.email}`} className={styles.emailLink}>
              {contactConfig.email}
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className={styles.copyBtn}
          title="Copy email address"
          aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
        >
          {copied ? (
            <>
              <Check size={14} className={styles.checkIcon} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Studio Value & Operational Pillars */}
      <div className={styles.pillarsList}>
        {/* Pillar 1: 24/7 Agile Availability */}
        <div className={styles.pillarItem}>
          <div className={`${styles.pillarIconBox} ${styles.pillarIconBlue}`}>
            <Clock size={18} />
          </div>
          <div className={styles.pillarContent}>
            <h3 className={styles.pillarTitle}>24/7 Agile Availability</h3>
            <p className={styles.pillarText}>
              Active around-the-clock operating rhythm with dedicated weekend coverage for time-critical executive milestones.
            </p>
          </div>
        </div>

        {/* Pillar 2: Enterprise Confidentiality */}
        <div className={styles.pillarItem}>
          <div className={`${styles.pillarIconBox} ${styles.pillarIconCyan}`}>
            <ShieldCheck size={18} />
          </div>
          <div className={styles.pillarContent}>
            <h3 className={styles.pillarTitle}>Enterprise Confidentiality</h3>
            <p className={styles.pillarText}>
              {contactConfig.confidentiality}. We protect unannounced financial figures, pitch materials, and strategic roadmaps.
            </p>
          </div>
        </div>
      </div>

      {/* Layered Geometric Visual Accent */}
      <div className={styles.accentGraphic}>
        <div className={styles.accentLayerBlue} />
        <div className={styles.accentLayerCyan} />
        <div className={styles.accentLayerMagenta} />
        <div className={styles.accentLayerOrange} />
        <div className={styles.accentInner}>
          <span className={styles.accentTag}>SLIDEVANCE DESIGN SYSTEM</span>
          <span className={styles.accentSlogan}>Precision Architecture • Boardroom Ready</span>
        </div>
      </div>
    </aside>
  );
}
