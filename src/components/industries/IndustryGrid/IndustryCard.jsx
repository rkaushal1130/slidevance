import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './IndustryGrid.module.css';

export default function IndustryCard({
  number,
  icon: Icon,
  name,
  description,
  accentColor = 'blue',
  onExplore
}) {
  return (
    <div className={`${styles.card} ${styles[`card_${accentColor}`]}`}>
      <div className={styles.cardGradientAccent} />

      <div className={styles.cardTop}>
        <div className={`${styles.iconWrap} ${styles[`icon_${accentColor}`]}`}>
          {Icon && <Icon size={22} strokeWidth={1.8} />}
        </div>
        <span className={styles.cardNumber}>{number}</span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardDesc}>{description}</p>
      </div>

      <div className={styles.cardAction}>
        <button
          type="button"
          className={styles.exploreBtn}
          onClick={onExplore}
        >
          <span>Explore</span>
          <ArrowRight size={14} className={styles.arrowIcon} />
        </button>
      </div>
    </div>
  );
}
