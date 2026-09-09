import React from 'react';
import styles from './WhatSetsUsApart.module.css';

export default function FeatureCard({
  number,
  icon: Icon,
  title,
  description,
  accentColor = 'blue',
}) {
  return (
    <div className={`${styles.card} ${styles[`card_${accentColor}`] || ''}`}>
      <div className={styles.cardHeader}>
        <div className={`${styles.iconContainer} ${styles[`icon_${accentColor}`] || ''}`}>
          {Icon && <Icon size={24} strokeWidth={2} />}
        </div>
        <span className={styles.cardNumber}>{number}</span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>

      <div className={styles.cardFooter}>
        <div className={`${styles.cardIndicator} ${styles[`indicator_${accentColor}`] || ''}`} />
      </div>
    </div>
  );
}
