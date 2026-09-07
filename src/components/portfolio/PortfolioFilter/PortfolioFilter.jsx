import React from 'react';
import styles from './PortfolioFilter.module.css';

export default function PortfolioFilter({
  categories,
  activeCategory,
  onSelectCategory
}) {
  return (
    <div className={styles.filterWrapper}>
      <div className={styles.scrollTrack} role="tablist" aria-label="Portfolio Category Filter">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.filterBtn} ${isActive ? styles.activeBtn : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              <span className={styles.btnText}>{category}</span>
              {isActive && <span className={styles.activeIndicator} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
