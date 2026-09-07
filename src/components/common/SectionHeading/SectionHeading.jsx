import React from 'react';
import styles from './SectionHeading.module.css';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  dark = false,
  className = '',
  maxWidth = '720px'
}) {
  const containerClasses = [
    styles.container,
    styles[align],
    dark ? styles.dark : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={{ '--max-w': maxWidth }}>
      {eyebrow && (
        <div className={styles.eyebrowWrapper}>
          <span className={styles.eyebrowDot} />
          <span className={styles.eyebrowText}>{eyebrow}</span>
        </div>
      )}
      {title && (
        <h2 className={styles.title}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
