import React from 'react';
import styles from './SkeletonCard.module.css';

/**
 * Reusable Skeleton placeholder matching exact card geometries
 * @param {'portfolio'|'service'|'industry'|'default'} [variant='default']
 * @param {string} [className]
 */
export default function SkeletonCard({ variant = 'default', className = '' }) {
  if (variant === 'portfolio') {
    return (
      <div
        className={`${styles.skeletonCard} ${styles.portfolioCard} ${className}`}
        aria-hidden="true"
      >
        <div className={`${styles.portfolioImageArea} ${styles.shimmer}`} />
        <div className={styles.portfolioContent}>
          <div className={styles.portfolioMeta}>
            <div className={`${styles.badgePill} ${styles.shimmer}`} />
            <div className={`${styles.projectNumber} ${styles.shimmer}`} />
          </div>
          <div className={`${styles.titleLine} ${styles.shimmer}`} />
          <div className={`${styles.descLine1} ${styles.shimmer}`} />
          <div className={`${styles.descLine2} ${styles.shimmer}`} />
          <div className={`${styles.actionButton} ${styles.shimmer}`} />
        </div>
      </div>
    );
  }

  if (variant === 'service') {
    return (
      <div
        className={`${styles.skeletonCard} ${styles.serviceCard} ${className}`}
        aria-hidden="true"
      >
        <div className={styles.serviceHeader}>
          <div className={`${styles.serviceIconBox} ${styles.shimmer}`} />
          <div className={`${styles.projectNumber} ${styles.shimmer}`} />
        </div>
        <div className={styles.serviceBody}>
          <div className={`${styles.serviceTitle} ${styles.shimmer}`} />
          <div className={`${styles.descLine1} ${styles.shimmer}`} />
          <div className={`${styles.descLine2} ${styles.shimmer}`} />
        </div>
        <div className={`${styles.actionButton} ${styles.shimmer}`} />
      </div>
    );
  }

  if (variant === 'industry') {
    return (
      <div
        className={`${styles.skeletonCard} ${styles.industryCard} ${className}`}
        aria-hidden="true"
      >
        <div className={styles.industryTop}>
          <div className={`${styles.industryIcon} ${styles.shimmer}`} />
          <div className={`${styles.projectNumber} ${styles.shimmer}`} />
        </div>
        <div className={`${styles.industryTitle} ${styles.shimmer}`} />
        <div className={`${styles.descLine1} ${styles.shimmer}`} />
        <div className={`${styles.descLine2} ${styles.shimmer}`} />
        <div className={`${styles.industryExplore} ${styles.shimmer}`} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeletonCard} ${styles.serviceCard} ${className}`}
      aria-hidden="true"
    >
      <div className={`${styles.titleLine} ${styles.shimmer}`} />
      <div className={`${styles.descLine1} ${styles.shimmer}`} />
      <div className={`${styles.descLine2} ${styles.shimmer}`} />
    </div>
  );
}

/**
 * Helper to render a group of skeleton cards
 */
export function SkeletonGrid({ count = 6, variant = 'portfolio', className = '' }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} variant={variant} className={className} />
      ))}
    </>
  );
}
