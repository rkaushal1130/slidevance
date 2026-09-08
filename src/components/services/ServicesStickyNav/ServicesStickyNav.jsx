import React, { useState, useEffect } from 'react';
import styles from './ServicesStickyNav.module.css';

const DEFAULT_NAV_ITEMS = [
  { label: 'Presentation Design', id: 'service-01' },
  { label: 'Proposal & RFP', id: 'service-02' },
  { label: 'Business Documents', id: 'service-03' },
  { label: 'Data Storytelling', id: 'service-04' },
  { label: 'Sales Enablement', id: 'service-05' },
  { label: 'Research', id: 'service-06' },
];

export default function ServicesStickyNav({ items }) {
  const navList = items && items.length > 0 ? items : DEFAULT_NAV_ITEMS;
  const [activeSection, setActiveSection] = useState(navList[0]?.id || 'service-01');

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = navList.length - 1; i >= 0; i--) {
        const item = navList[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navList]);

  return (
    <div className={styles.stickyNavWrapper}>
      <div className={`container ${styles.container}`}>
        <nav className={styles.navBar} aria-label="Services Practice Navigation">
          <div className={styles.navTrack}>
            {navList.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
                  onClick={() => handleScrollTo(item.id)}
                >
                  <span>{item.label}</span>
                  {isActive && <span className={styles.activePill} />}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
