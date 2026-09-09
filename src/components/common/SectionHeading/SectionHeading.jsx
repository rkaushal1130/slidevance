import React from 'react';
import styles from './SectionHeading.module.css';

export default function SectionHeading({
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
