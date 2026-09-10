import React from 'react';
import overviewImg from '../../../assets/overview-showcase.png';
import styles from './OverviewBanner.module.css';

export default function OverviewBanner() {
  return (
    <section className={styles.section} aria-label="Slidevance Capabilities Overview">
      <div className="container">
        <div className={styles.bannerWrapper}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.imageCard}>
            <img
              src={overviewImg}
              alt="Slidevance Presentation Design, Strategy, Storytelling and Brand Solutions Overview"
              className={styles.bannerImage}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
