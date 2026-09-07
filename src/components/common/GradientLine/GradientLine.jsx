import React from 'react';
import styles from './GradientLine.module.css';

export default function GradientLine({
  width = '100%',
  height = '2px',
  align = 'center', // 'center' | 'left' | 'right' | 'full'
  className = '',
  opacity = 1
}) {
  const lineStyles = {
    maxWidth: width,
    height: height,
    opacity: opacity
  };

  return (
    <div className={`${styles.wrapper} ${styles[align]} ${className}`}>
      <div className={styles.line} style={lineStyles} />
    </div>
  );
}
