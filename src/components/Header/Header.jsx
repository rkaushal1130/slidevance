import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../common/Logo/Logo';
import Button from '../common/Button/Button';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Industries', path: '/industries' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsMobileMenuOpen(false);
  }

  // Track scroll state for enhanced subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={`container ${styles.headerContainer}`}>
        {/* Brand Logo */}
        <Logo className={styles.logo} />

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path} className={styles.navItem}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {link.label}
                  <span className={styles.linkIndicator} />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA Action */}
        <div className={styles.desktopCta}>
          <Button
            to="/contact"
            variant="primary"
            size="sm"
            icon={<ArrowRight size={15} />}
          >
            Start a Project
          </Button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`${styles.mobileDrawer} ${
          isMobileMenuOpen ? styles.mobileDrawerOpen : ''
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileDrawerInner}>
          <div className={styles.mobileDrawerHeader}>
            <Logo />
            <button
              type="button"
              className={styles.mobileCloseBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className={styles.mobileDrawerDivider} />

          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link, idx) => (
                <li
                  key={link.path}
                  className={styles.mobileNavItem}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `${styles.mobileNavLink} ${
                        isActive ? styles.mobileNavLinkActive : ''
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} className={styles.mobileNavArrow} />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.mobileCtaWrapper}>
            <Button
              to="/contact"
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
              className={styles.mobileCtaButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start a Project
            </Button>
            <p className={styles.mobileContactNote}>
              hello@slidevance.com
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
