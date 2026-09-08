import React from 'react';
import IndustryCard from './IndustryCard';
import SkeletonCard from '../../common/SkeletonCard/SkeletonCard';
import styles from './IndustryGrid.module.css';

export default function IndustryGrid({ industries, onSelectIndustry, loading = false }) {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Industry Practice Sectors">
      <div className="container">
        <div className={styles.grid}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} variant="industry" />
            ))
          ) : (
            industries.map((ind) => (
              <IndustryCard
                key={ind.number + ind.name}
                number={ind.number}
                icon={ind.icon}
                name={ind.name}
                description={ind.description}
                accentColor={ind.accentColor}
                onExplore={() => onSelectIndustry && onSelectIndustry(ind)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
