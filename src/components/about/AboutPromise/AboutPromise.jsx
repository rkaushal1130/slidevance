import React from 'react';
import { ArrowRight, Presentation, FileText, Layers, BarChart2, FileEdit, Palette } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './AboutPromise.module.css';

const DELIVERABLE_TYPES = [
  {
    id: 'presentations',
    title: 'Presentations',
    subtitle: '(PowerPoint / Keynote)',
    icon: Presentation,
    badgeColor: 'badge_orange'
  },
  {
    id: 'proposals',
    title: 'Proposals',
    subtitle: '(Business & Sales)',
    icon: FileText,
    badgeColor: 'badge_blue'
  },
  {
    id: 'one-pagers',
    title: 'One-Pagers',
    subtitle: '(Quick, Focused, Impactful)',
    icon: Layers,
    badgeColor: 'badge_cyan'
  },
  {
    id: 'reports',
    title: 'Reports',
    subtitle: '(Research & Analysis)',
    icon: BarChart2,
    badgeColor: 'badge_teal'
  },
  {
    id: 'word-documents',
    title: 'Word Documents',
    subtitle: '(Designed & Structured)',
    icon: FileEdit,
    badgeColor: 'badge_purple'
  },
  {
    id: 'branded-documents',
    title: 'Branded Documents',
    subtitle: '(Company & Marketing)',
    icon: Palette,
    badgeColor: 'badge_pink'
  }
];

export default function AboutPromise() {
  return (
    <section id="what-we-do" className={styles.promiseSection} aria-label="Our Promise and Deliverables">
      <div className={`container ${styles.container}`}>
        {/* Left Column: Heading & CTA */}
        <div className={`${styles.introCol} reveal-on-scroll`}>
          <div className={styles.tagWrap}>
            <span className={styles.sectionTag}>OUR PROMISE</span>
            <span className={styles.tagLine} />
          </div>

          <h2 className={styles.heading}>
            More than just slides.<br />
            We design what <span className={styles.needGradient}>you need.</span>
          </h2>

          <p className={styles.description}>
            From pitch decks to proposals, we create business documents that communicate, persuade and perform.
          </p>

          <div className={styles.btnWrap}>
            <Button
              to="/services"
              variant="outline"
              size="md"
              icon={<ArrowRight size={16} />}
            >
              Explore Services
            </Button>
          </div>
        </div>

        {/* Right Column: 6 Document Cards */}
        <div className={`${styles.cardsCol} reveal-on-scroll`}>
          <div className={styles.documentsGrid}>
            {DELIVERABLE_TYPES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={styles.docCard}>
                  <div className={`${styles.iconBadge} ${styles[item.badgeColor]}`}>
                    <Icon size={20} className={styles.badgeIcon} />
                  </div>
                  <div className={styles.docInfo}>
                    <h3 className={styles.docTitle}>{item.title}</h3>
                    <span className={styles.docSubtitle}>{item.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
