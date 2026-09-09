import React from 'react';
import slide01 from '../../../assets/slides/slide-01.png';
import slide02 from '../../../assets/slides/slide-02.png';
import slide03 from '../../../assets/slides/slide-03.png';
import slide04 from '../../../assets/slides/slide-04.png';
import slide05 from '../../../assets/slides/slide-05.png';
import slide06 from '../../../assets/slides/slide-06.png';
import slide07 from '../../../assets/slides/slide-07.png';
import slide08 from '../../../assets/slides/slide-08.png';
import slide09 from '../../../assets/slides/slide-09.png';
import slide10 from '../../../assets/slides/slide-10.png';
import slide11 from '../../../assets/slides/slide-11.png';
import slide12 from '../../../assets/slides/slide-12.png';
import styles from './HeroSlideShowcase.module.css';

const COLUMN_1 = [
  { img: slide01, title: 'Pitch Deck Cover' },
  { img: slide04, title: 'The Solution' },
  { img: slide06, title: 'Financial Performance' }
];

const COLUMN_2 = [
  { img: slide02, title: 'Company Introduction' },
  { img: slide03, title: 'The Problem' },
  { img: slide07, title: 'Business Model Canvas' }
];

const COLUMN_3 = [
  { img: slide05, title: 'Leadership Impact' },
  { img: slide08, title: 'USP & Competitive Moat' },
  { img: slide12, title: 'Funds Requirement' }
];

const COLUMN_4 = [
  { img: slide09, title: 'Industry & Market Insight' },
  { img: slide10, title: 'Competitive Landscape (01)' },
  { img: slide11, title: 'Competitive Landscape (02)' }
];

export default function HeroSlideShowcase() {
  return (
    <div className={styles.showcaseBackground} aria-hidden="true">
      {/* Ambient glow matching exact brand trio: Electric Blue, Vivid Purple, Radiant Orange */}
      <div className={styles.ambientGlow} />

      {/* 3D Tilted Perspective Stage with 4 Streams of Gunsberg Pitch Deck Slides */}
      <div className={styles.tiltedStage}>
        {/* Column 1 - Marquee Up */}
        <div className={`${styles.slideColumn} ${styles.columnUp}`}>
          <div className={styles.columnTrack}>
            {[...COLUMN_1, ...COLUMN_1, ...COLUMN_1].map((slide, idx) => (
              <div key={`c1-${idx}`} className={styles.slideCard}>
                <img
                  src={slide.img}
                  alt={slide.title}
                  className={styles.slideImg}
                  loading={idx < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Marquee Down */}
        <div className={`${styles.slideColumn} ${styles.columnDown}`}>
          <div className={styles.columnTrack}>
            {[...COLUMN_2, ...COLUMN_2, ...COLUMN_2].map((slide, idx) => (
              <div key={`c2-${idx}`} className={styles.slideCard}>
                <img
                  src={slide.img}
                  alt={slide.title}
                  className={styles.slideImg}
                  loading={idx < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 - Marquee Up */}
        <div className={`${styles.slideColumn} ${styles.columnUp}`}>
          <div className={styles.columnTrack}>
            {[...COLUMN_3, ...COLUMN_3, ...COLUMN_3].map((slide, idx) => (
              <div key={`c3-${idx}`} className={styles.slideCard}>
                <img
                  src={slide.img}
                  alt={slide.title}
                  className={styles.slideImg}
                  loading={idx < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 4 - Marquee Down */}
        <div className={`${styles.slideColumn} ${styles.columnDown} ${styles.columnExtra}`}>
          <div className={styles.columnTrack}>
            {[...COLUMN_4, ...COLUMN_4, ...COLUMN_4].map((slide, idx) => (
              <div key={`c4-${idx}`} className={styles.slideCard}>
                <img
                  src={slide.img}
                  alt={slide.title}
                  className={styles.slideImg}
                  loading={idx < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seamless Edge Gradient Overlays to keep hero text 100% legible */}
      <div className={styles.leftFadeOverlay} />
      <div className={styles.topFadeOverlay} />
      <div className={styles.bottomFadeOverlay} />
      <div className={styles.rightFadeOverlay} />
    </div>
  );
}
