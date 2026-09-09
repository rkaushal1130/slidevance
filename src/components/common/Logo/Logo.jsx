import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../../assets/logo.png';
import styles from './Logo.module.css';

export default function Logo({ className = '', height, alt = 'Slidevance - Ideas That Slide. Solutions That Advance.' }) {
  return (
    <Link to="/" className={`${styles.logoContainer} ${className}`} aria-label="Slidevance - Home">
      <img
        src={logoImg}
        alt={alt}
        className={styles.logoImage}
        style={height ? { height: `${height}px` } : undefined}
      />
    </Link>
  );
}
