import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RotateCcw, Mail } from 'lucide-react';
import styles from './ErrorMessage.module.css';

/**
 * Friendly, reassurance-focused error display component
 * Prevents raw technical error leakage
 * @param {string} [title='Unable to load content']
 * @param {string} [message] - Friendly message
 * @param {Function} [onRetry] - Optional retry handler
 * @param {boolean} [compact=false]
 * @param {string} [className]
 */
export default function ErrorMessage({
  title = 'Unable to load content',
  message = 'We are currently unable to connect to the Slidevance servers. Please verify your connection or try again in a moment.',
  onRetry,
  compact = false,
  className = '',
}) {
  return (
    <div
      className={`${styles.errorContainer} ${compact ? styles.errorContainerCompact : ''} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.iconCircle}>
        <AlertCircle size={24} />
      </div>

      <h3 className={styles.errorTitle}>{title}</h3>
      <p className={styles.errorMessage}>{message}</p>

      <div className={styles.actionsRow}>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={styles.retryBtn}
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>
        )}

        <Link to="/contact" className={styles.contactLink}>
          <Mail size={15} />
          <span>Contact Studio</span>
        </Link>
      </div>
    </div>
  );
}
