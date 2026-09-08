import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * Reusable Loading Spinner matching Slidevance gradient aesthetic
 * @param {'sm'|'md'|'lg'} size - Spinner size
 * @param {string} [message] - Optional descriptive label
 * @param {boolean} [inline] - Whether to render inline or centered block
 * @param {string} [className] - Additional CSS class
 */
export default function LoadingSpinner({
  size = 'md',
  message = '',
  inline = false,
  className = '',
}) {
  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const wrapperClass = inline ? styles.spinnerWrapperInline : styles.spinnerWrapper;

  return (
    <div
      className={`${wrapperClass} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`${styles.spinner} ${sizeClass}`} aria-hidden="true" />
      {message ? (
        <span className={styles.spinnerText}>{message}</span>
      ) : (
        <span className={styles.srOnly}>Loading...</span>
      )}
    </div>
  );
}
