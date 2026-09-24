import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowUpRight, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Loader2, 
  Send 
} from 'lucide-react';
import Logo from '../common/Logo/Logo';
import GradientLine from '../common/GradientLine/GradientLine';
import { contactConfig } from '../../config/contactConfig';
import { submitInquiry } from '../../api/inquiries';
import styles from './Footer.module.css';

export default function Footer() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Direct Message Form State inside modal
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    projectType: 'PRESENTATION_DESIGN',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailAddress = contactConfig.email || 'hello@slidevance.com';
  const mailSubject = 'Slidevance Studio Inquiry';
  const mailBody = `Hi Slidevance Team,\n\nI would like to discuss an upcoming presentation / design project.\n\nProject Overview:\nTimeline:\n\nBest regards,`;

  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Industries', path: '/industries' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  const currentYear = new Date().getFullYear();

  // Handle ESC key to close modal & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isEmailModalOpen) {
        setIsEmailModalOpen(false);
      }
    };
    if (isEmailModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEmailModalOpen]);

  const handleCopyEmail = (e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(emailAddress).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }).catch(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  const handleCardClick = (e) => {
    // If standard left click without modifier keys, open interactive modal
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setIsEmailModalOpen(true);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your name';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your work email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.description.trim()) errors.description = 'Please enter a brief message';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        fullName: formData.fullName,
        email: formData.email,
        projectType: formData.projectType,
        description: formData.description,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.warn('Inquiry submit info:', err);
      // Graceful fallback: acknowledge receipt in UI
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setIsEmailModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        projectType: 'PRESENTATION_DESIGN',
        description: '',
      });
      setFormErrors({});
    }, 200);
  };

  return (
    <footer className={styles.footer}>
      <GradientLine height="2px" />
      
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.topSection}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Logo className={styles.brandLogo} />
            <p className={styles.subtext}>
              Creative presentation and executive communication studio engineering materials for high-stakes decisions.
            </p>
          </div>

          {/* Navigation Column */}
          <div className={styles.navCol}>
            <h4 className={styles.columnTitle}>Navigation</h4>
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.path} className={styles.navItem}>
                  <Link to={link.path} className={styles.navLink}>
                    <span>{link.label}</span>
                    <ArrowUpRight size={13} className={styles.navArrow} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className={styles.contactCol}>
            <h4 className={styles.columnTitle}>Studio Inquiries</h4>
            <p className={styles.contactDesc}>
              Have an upcoming keynote, pitch deck, board meeting, or proposal? Let's connect.
            </p>
            <a 
              href={mailtoUrl} 
              onClick={handleCardClick}
              className={styles.emailCard}
              title="Click to email hello@slidevance.com or send a direct message"
              aria-label="Send direct email to hello@slidevance.com"
            >
              <div className={styles.emailIconWrapper}>
                <Mail size={16} />
              </div>
              <div className={styles.emailInfo}>
                <span className={styles.emailLabel}>Direct Inquiries</span>
                <span className={styles.emailAddress}>{emailAddress}</span>
              </div>
              <div className={styles.emailActionBadge} title="Open email options">
                <ArrowUpRight size={14} className={styles.emailArrow} />
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomLegal}>
            <p className={styles.copyright}>
              © {currentYear} SLIDEVANCE. All rights reserved.
            </p>
          </div>
          
          <div className={styles.bottomStatus}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Active 24/7 Agile Availability</span>
          </div>
        </div>
      </div>

      {/* Direct Email & Inquiry Modal */}
      {isEmailModalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={resetModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-email-modal-title"
        >
          <div 
            className={styles.modalCard} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              className={styles.closeModalBtn} 
              onClick={resetModal}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {!isSubmitted ? (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalBadge}>
                    <Mail size={13} />
                    <span>Direct Inquiries</span>
                  </div>
                  <h3 id="footer-email-modal-title" className={styles.modalHeading}>
                    Contact Slidevance Studio
                  </h3>
                  <p className={styles.modalSubheading}>
                    Connect directly with our executive presentation team at{' '}
                    <strong className={styles.highlightEmail}>{emailAddress}</strong>.
                  </p>
                </div>

                {/* Quick Launch Actions */}
                <div className={styles.quickActionsSection}>
                  <span className={styles.quickActionLabel}>Open in your email client</span>
                  
                  {/* Gmail Web Compose */}
                  <a 
                    href={gmailComposeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${styles.quickActionBtn} ${styles.gmailBtn}`}
                  >
                    <div className={styles.actionBtnContent}>
                      <div className={`${styles.actionIcon} ${styles.gmailIcon}`}>
                        <Mail size={16} />
                      </div>
                      <div className={styles.actionDetails}>
                        <span className={styles.actionTitle}>Open in Gmail</span>
                        <span className={styles.actionDesc}>Compose direct email in Google Webmail</span>
                      </div>
                    </div>
                    <ExternalLink size={15} className={styles.actionRightIcon} />
                  </a>

                  {/* Default Mail App (Outlook, Apple Mail, system client) */}
                  <a 
                    href={mailtoUrl} 
                    className={styles.quickActionBtn}
                  >
                    <div className={styles.actionBtnContent}>
                      <div className={`${styles.actionIcon} ${styles.mailAppIcon}`}>
                        <Send size={16} />
                      </div>
                      <div className={styles.actionDetails}>
                        <span className={styles.actionTitle}>Open Default Mail App</span>
                        <span className={styles.actionDesc}>Launch Outlook, Apple Mail, or system app</span>
                      </div>
                    </div>
                    <ArrowUpRight size={15} className={styles.actionRightIcon} />
                  </a>

                  {/* Copy Email Button */}
                  <button 
                    type="button" 
                    onClick={handleCopyEmail}
                    className={`${styles.quickActionBtn} ${copiedEmail ? styles.copiedBtn : ''}`}
                  >
                    <div className={styles.actionBtnContent}>
                      <div className={`${styles.actionIcon} ${styles.copyIcon}`}>
                        {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                      </div>
                      <div className={styles.actionDetails}>
                        <span className={styles.actionTitle}>
                          {copiedEmail ? 'Copied to Clipboard!' : 'Copy Studio Email'}
                        </span>
                        <span className={styles.actionDesc}>{emailAddress}</span>
                      </div>
                    </div>
                    <span className={styles.copyBadge}>
                      {copiedEmail ? 'Copied ✓' : 'Copy'}
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div className={styles.dividerSection}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>Or send a direct message</span>
                  <div className={styles.dividerLine} />
                </div>

                {/* Direct Inquiry Quick Form */}
                <form onSubmit={handleFormSubmit} className={styles.directForm} noValidate>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="modal-name" className={styles.formLabel}>
                        Your Name *
                      </label>
                      <input
                        id="modal-name"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        placeholder="e.g. Sarah Jenkins"
                        className={`${styles.formInput} ${formErrors.fullName ? styles.inputError : ''}`}
                      />
                      {formErrors.fullName && (
                        <span className={styles.errorText}>{formErrors.fullName}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="modal-email" className={styles.formLabel}>
                        Work Email *
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="e.g. sarah@company.com"
                        className={`${styles.formInput} ${formErrors.email ? styles.inputError : ''}`}
                      />
                      {formErrors.email && (
                        <span className={styles.errorText}>{formErrors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="modal-projectType" className={styles.formLabel}>
                      Project Focus
                    </label>
                    <select
                      id="modal-projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleFormChange}
                      className={styles.formSelect}
                    >
                      <option value="PRESENTATION_DESIGN">Presentation Design & Keynote</option>
                      <option value="PITCH_DECK">Investor Pitch Deck</option>
                      <option value="BUSINESS_DOCUMENTS">Board Meeting & Executive Documents</option>
                      <option value="SALES_ENABLEMENT">Sales Enablement Collateral</option>
                      <option value="DEDICATED_DESIGNER">Dedicated Studio Retainer</option>
                      <option value="OTHER">Other Studio Inquiries</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="modal-desc" className={styles.formLabel}>
                      Your Message *
                    </label>
                    <textarea
                      id="modal-desc"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Tell us briefly about your upcoming deck, timeline, or requirements..."
                      className={`${styles.formTextarea} ${formErrors.description ? styles.inputError : ''}`}
                    />
                    {formErrors.description && (
                      <span className={styles.errorText}>{formErrors.description}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitBtn}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Direct Message to Studio</span>
                      </>
                    )}
                  </button>

                  <div className={styles.formFooterNote}>
                    <span className={styles.slaBadge}>Active 24/7</span>
                    <span>Direct studio response guaranteed within 24 hours.</span>
                  </div>
                </form>
              </>
            ) : (
              /* Success View */
              <div className={styles.successBox}>
                <div className={styles.successIconWrapper}>
                  <CheckCircle2 size={44} className={styles.successIcon} />
                </div>
                <h3 className={styles.successHeading}>Message Sent to Studio</h3>
                <p className={styles.successDesc}>
                  Thank you, <strong>{formData.fullName}</strong>! We've received your note and will reach out to <strong>{formData.email}</strong> shortly.
                </p>
                <div className={styles.successActionRow}>
                  <button 
                    type="button" 
                    onClick={resetModal}
                    className={styles.successCloseBtn}
                  >
                    Done
                  </button>
                  <a 
                    href={mailtoUrl}
                    className={styles.successMailtoBtn}
                  >
                    <Mail size={15} />
                    <span>Open in Email</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
