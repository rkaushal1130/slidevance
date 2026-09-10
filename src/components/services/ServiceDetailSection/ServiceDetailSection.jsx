import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../common/Button/Button';
import SlideMockup from '../../portfolio/SlideMockup/SlideMockup';
import styles from './ServiceDetailSection.module.css';

export default function ServiceDetailSection({
  id,
  number,
  icon: Icon,
  title,
  tagline,
  description,
  deliverables,
  mockupType = 'investor',
  reverse = false,
  accentColor = 'blue'
}) {
  return (
    <section id={id} className={styles.serviceSection} aria-label={title}>
      <div className={`container ${styles.container} ${reverse ? styles.reverse : ''}`}>
        {/* Text Content Column */}
        <div className={styles.contentCol}>
          <div className={styles.headerRow}>
            <span className={`${styles.serviceNumber} ${styles[`num_${accentColor}`]}`}>
              {number}
            </span>
            <div className={`${styles.iconWrap} ${styles[`icon_${accentColor}`]}`}>
              {Icon && <Icon size={24} />}
            </div>
          </div>

          <span className={styles.serviceTag}>{tagline || 'STUDIO PRACTICE'}</span>
          <h2 className={styles.serviceTitle}>
            {title.includes('&') ? (
              <>
                {title.split('&')[0].trim()}
                <br />
                <span className="gradient-text">&amp; {title.split('&')[1].trim()}</span>
              </>
            ) : (
              title
            )}
          </h2>
          <p className={styles.serviceDescription}>{description}</p>

          {/* Deliverables List */}
          <div className={`${styles.deliverablesBox} ${styles[`box_${accentColor}`] || ''}`}>
            <h4 className={styles.deliverablesHeading}>Core Deliverables &amp; Scopes</h4>
            <ul className={styles.deliverablesList}>
              {deliverables.map((item) => (
                <li key={item} className={styles.deliverableItem}>
                  <div className={styles.checkWrap}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Action */}
          <div className={styles.ctaRow}>
            <Button
              to="/contact"
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
            >
              Discuss This Service
            </Button>
          </div>
        </div>

        {/* Visual Mockup Showcase Column */}
        <div className={styles.visualCol}>
          <div className={styles.mockupCard}>
            <div className={styles.cardCornerAccent} />
            <SlideMockup type={mockupType} />
            <div className={styles.mockupMeta}>
              <span className={styles.metaLabel}>EXECUTIVE SPECIFICATION</span>
              <span className={styles.metaValue}>PRACTICE {number} // DELIVERABLE SUITE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
