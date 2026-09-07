import React from 'react';
import PortfolioCard from './PortfolioCard';
import styles from './PortfolioGrid.module.css';

export default function PortfolioGrid({ projects, onOpenCaseStudy }) {
  if (!projects || projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No case studies found for this category.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <PortfolioCard
          key={project.number + project.title}
          project={project}
          onOpenCaseStudy={onOpenCaseStudy}
        />
      ))}
    </div>
  );
}
