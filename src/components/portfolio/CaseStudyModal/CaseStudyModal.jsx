import React, { useEffect } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../common/Button/Button';
import SlideMockup from '../SlideMockup/SlideMockup';
import styles from './CaseStudyModal.module.css';

export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close Case Study Modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.categoryBadge}>{project.category}</div>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <p className={styles.modalOverview}>{project.description}</p>
        </div>

        {/* Large Mockup Showcase */}
        <div className={styles.mockupShowcase}>
          <SlideMockup type={project.mockupType || 'investor'} />
        </div>

        {/* Structured Case Sections */}
        <div className={styles.caseGrid}>
          <div className={styles.caseCard}>
            <h3 className={styles.caseHeading}>Challenge</h3>
            <p className={styles.caseText}>
              {project.challenge ||
                'Unstructured operational inputs and disparate data streams created narrative confusion, making it difficult for executive decision-makers to reach alignment quickly.'}
            </p>
          </div>

          <div className={styles.caseCard}>
            <h3 className={styles.caseHeading}>Approach</h3>
            <p className={styles.caseText}>
              {project.approach ||
                'Slidevance established a rigorous storyline hierarchy, restructured quantitative models into intuitive vector charts, and designed a boardroom-ready presentation system.'}
            </p>
          </div>

          <div className={styles.caseCard}>
            <h3 className={styles.caseHeading}>Outcome</h3>
            <p className={styles.caseText}>
              {project.outcome ||
                'Achieved decisive executive consensus, total clarity across stakeholders, and a reusable high-impact communication asset for future strategic discussions.'}
            </p>
          </div>
        </div>

        {/* Deliverables List */}
        {project.deliverables && project.deliverables.length > 0 && (
          <div className={styles.deliverablesSection}>
            <h4 className={styles.deliverablesTitle}>Key Project Deliverables</h4>
            <div className={styles.deliverablesTags}>
              {project.deliverables.map((item) => (
                <div key={item} className={styles.deliverableTag}>
                  <CheckCircle2 size={14} className={styles.tagIcon} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer CTA */}
        <div className={styles.modalFooter}>
          <Button
            to="/contact"
            variant="primary"
            size="md"
            icon={<ArrowRight size={16} />}
            onClick={onClose}
          >
            Start a Similar Project
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
          >
            Close Case Study
          </Button>
        </div>
      </div>
    </div>
  );
}
