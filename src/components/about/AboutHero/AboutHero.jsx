import React from 'react';
import { Link } from 'react-router-dom';
import heroArtwork from '../../../assets/about/about-hero-artwork.png';
import styles from './AboutHero.module.css';

export default function AboutHero({ settings }) {
  const companyName = settings?.companyName || 'SlideVance';

  return (
    <section className={styles.heroSection} aria-label={`About ${companyName}`}>
      {/* Top Anchor Navigation */}
      <div className={`container ${styles.topNavContainer}`}>
        <nav className={styles.topNav} aria-label="About page sub-navigation">
          <a href="#our-process" className={styles.navLink}>Our Process</a>
          <span className={styles.navDivider}>|</span>
          <a href="#our-dna" className={styles.navLink}>Our DNA</a>
          <span className={styles.navDivider}>|</span>
          <a href="#the-team" className={styles.navLink}>Our Team</a>
          <span className={styles.navDivider}>|</span>
          <Link to="/contact" className={styles.navLink}>Get in Touch</Link>
        </nav>
      </div>

      <div className={`container ${styles.heroContainer}`}>
        {/* Left Column: Typography & Story */}
        <div className={`${styles.contentCol} reveal-on-scroll`}>
          <div className={styles.tagWrap}>
            <span className={styles.sectionTag}>ABOUT US</span>
            <span className={styles.tagLine} />
          </div>

          <h1 className={styles.heroTitle}>
            We don’t make<br />
            slides. We make<br />
            <span className={styles.ideasWord}>ideas</span>{' '}
            <span className={styles.visibleWord}>visible.</span>
          </h1>

          <p className={styles.heroParagraph}>
            <strong>{companyName}</strong> is a creative presentation and document design studio
            that transforms complex information into clear, compelling and visually powerful stories.
          </p>

          <div className={styles.calloutBox}>
            <p className={styles.calloutLine}>Better design. Clearer thinking.</p>
            <p className={styles.calloutLine}>Bigger impact.</p>
          </div>
        </div>

        {/* Right Column: Hero Graphic Artwork */}
        <div className={`${styles.visualCol} reveal-on-scroll`}>
          <div className={styles.artworkWrapper}>
            <img
              src={heroArtwork}
              alt="Slidevance ideas visible artistic presentation mockup and strategy story"
              className={styles.artworkImage}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
