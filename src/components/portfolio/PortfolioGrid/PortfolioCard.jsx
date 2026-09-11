import React from 'react';
import { ArrowRight } from 'lucide-react';
import SlideMockup from '../SlideMockup/SlideMockup';
import styles from './PortfolioGrid.module.css';

export default function PortfolioCard({ project, onOpenCaseStudy, index = 0 }) {
  const delayClass = `reveal-delay-${(index % 3) + 1}`;
  return (
    <article className={`${styles.card} reveal-on-scroll ${delayClass}`}>
      {/* Large Visual Area */}
      <div className={styles.imageArea} onClick={() => onOpenCaseStudy(project)}>
        <div className={styles.mockupWrapper}>
          <SlideMockup type={project.mockupType} />
        </div>
        <div className={styles.visualOverlay}>
          <span className={styles.overlayPill}>View Case Study</span>
        </div>
      </div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>{project.category}</span>
          <span className={styles.projectNumber}>{project.number}</span>
        </div>

        <h3 className={styles.projectTitle}>
          <button
            type="button"
            className={styles.titleButton}
            onClick={() => onOpenCaseStudy(project)}
          >
            {project.title}
          </button>
        </h3>

        <p className={styles.projectDesc}>{project.description}</p>

        <div className={styles.cardAction}>
          <button
            type="button"
            className={styles.caseStudyLink}
            onClick={() => onOpenCaseStudy(project)}
          >
            <span>View Case Study</span>
            <ArrowRight size={15} className={styles.arrowIcon} />
          </button>
        </div>
      </div>
    </article>
  );
}
