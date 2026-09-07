import React from 'react';
import { ArrowRight, AlertCircle, Compass, Award } from 'lucide-react';
import Button from '../../common/Button/Button';
import SlideMockup from '../SlideMockup/SlideMockup';
import styles from './FeaturedProject.module.css';

export default function FeaturedProject({ onOpenCaseStudy }) {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Featured Portfolio Project">
      <div className="container">
        <div className={styles.featuredCard}>
          {/* Left Column: Large Visual Mockup */}
          <div className={styles.visualCol}>
            <SlideMockup type="featured" className={styles.featuredMockup} />
          </div>

          {/* Right Column: Content */}
          <div className={styles.contentCol}>
            <div className={styles.labelBadge}>
              <span className={styles.labelDot} />
              <span className={styles.labelText}>FEATURED WORK</span>
            </div>

            <h2 className={styles.heading}>
              Turning Complex Information
              <br />
              <span className="gradient-text">Into Executive Communication.</span>
            </h2>

            <div className={styles.caseDetails}>
              {/* Challenge */}
              <div className={styles.caseItem}>
                <div className={styles.caseItemHeader}>
                  <div className={`${styles.iconWrap} ${styles.iconChallenge}`}>
                    <AlertCircle size={16} />
                  </div>
                  <h3 className={styles.caseItemTitle}>Challenge</h3>
                </div>
                <p className={styles.caseItemText}>
                  A cross-functional corporate initiative required communicating dense technical,
                  operational, and financial data to an executive decision committee under strict time constraints,
                  where previous unformatted drafts caused narrative fragmentation.
                </p>
              </div>

              {/* Approach */}
              <div className={styles.caseItem}>
                <div className={styles.caseItemHeader}>
                  <div className={`${styles.iconWrap} ${styles.iconApproach}`}>
                    <Compass size={16} />
                  </div>
                  <h3 className={styles.caseItemTitle}>Approach</h3>
                </div>
                <p className={styles.caseItemText}>
                  Slidevance restructured the content into an objective-first executive storyline,
                  synthesized multi-stream operational data into intuitive visual frameworks, and engineered
                  a bespoke presentation deck with rigorous typographic hierarchy.
                </p>
              </div>

              {/* Outcome */}
              <div className={styles.caseItem}>
                <div className={styles.caseItemHeader}>
                  <div className={`${styles.iconWrap} ${styles.iconOutcome}`}>
                    <Award size={16} />
                  </div>
                  <h3 className={styles.caseItemTitle}>Outcome</h3>
                </div>
                <p className={styles.caseItemText}>
                  The executive committee achieved immediate consensus and unanimous approval on the
                  strategic roadmap, advancing the deliverable to board execution without friction.
                </p>
              </div>
            </div>

            <div className={styles.actionRow}>
              <Button
                onClick={() => onOpenCaseStudy && onOpenCaseStudy({
                  title: 'Executive Transformation & Board Deck',
                  category: 'Corporate Strategy & Executive Communication',
                  mockupType: 'featured',
                  challenge: 'A cross-functional corporate initiative required communicating dense technical, operational, and financial data to an executive decision committee under strict time constraints, where previous unformatted drafts caused narrative fragmentation.',
                  approach: 'Slidevance restructured the content into an objective-first executive storyline, synthesized multi-stream operational data into intuitive visual frameworks, and engineered a bespoke presentation deck with rigorous typographic hierarchy.',
                  outcome: 'The executive committee achieved immediate consensus and unanimous approval on the strategic roadmap, advancing the deliverable to board execution without friction.',
                  deliverables: ['Boardroom Keynote Deck', 'Executive Summary One-Pager', 'Multi-Stream Visual Frameworks']
                })}
                variant="primary"
                size="md"
                icon={<ArrowRight size={16} />}
              >
                View Case Study
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
