import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';
import Logo from '../common/Logo/Logo';
import GradientLine from '../common/GradientLine/GradientLine';
import styles from './Footer.module.css';

export default function Footer() {
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Industries', path: '/industries' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  const currentYear = new Date().getFullYear();

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
                    <ArrowUpRight size={14} className={styles.navArrow} />
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
            <a href="mailto:hello@slidevance.com" className={styles.emailCard}>
              <div className={styles.emailIconWrapper}>
                <Mail size={18} />
              </div>
              <div className={styles.emailInfo}>
                <span className={styles.emailLabel}>Direct Inquiries</span>
                <span className={styles.emailAddress}>hello@slidevance.com</span>
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
    </footer>
  );
}
