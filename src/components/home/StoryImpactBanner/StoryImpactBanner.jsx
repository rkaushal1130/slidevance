import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../../../assets/story-impact-banner.png';
import styles from './StoryImpactBanner.module.css';

export default function StoryImpactBanner() {
  return (
    <section className={styles.section} aria-label="Elevate Your Story with Stunning Presentations">
      <Link
        to="/contact"
        className={styles.bannerLink}
        aria-label="Let's Create Together - Contact Slidevance"
      >
        <img
          src={bannerImg}
          alt="Elevate Your Story with Stunning Presentations - Slidevance"
          className={styles.bannerImg}
          loading="lazy"
        />
      </Link>
    </section>
  );
}
