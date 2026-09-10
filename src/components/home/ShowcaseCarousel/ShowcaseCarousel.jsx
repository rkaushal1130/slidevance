import React, { useRef, useState, useEffect, useCallback } from 'react';
import slide01 from '../../../assets/showcase/showcase-01.jpeg';
import slide02 from '../../../assets/showcase/showcase-02.jpeg';
import slide03 from '../../../assets/showcase/showcase-03.jpeg';
import slide04 from '../../../assets/showcase/showcase-04.jpeg';
import slide05 from '../../../assets/showcase/showcase-05.jpeg';
import slide06 from '../../../assets/showcase/showcase-06.jpeg';
import slide07 from '../../../assets/showcase/showcase-07.jpeg';
import slide08 from '../../../assets/showcase/showcase-08.jpeg';
import slide09 from '../../../assets/showcase/showcase-09.jpeg';
import slide10 from '../../../assets/showcase/showcase-10.jpeg';
import slide11 from '../../../assets/showcase/showcase-11.jpeg';
import slide12 from '../../../assets/showcase/showcase-12.jpeg';
import slide13 from '../../../assets/showcase/showcase-13.jpeg';
import slide14 from '../../../assets/showcase/showcase-14.jpeg';
import slide15 from '../../../assets/showcase/showcase-15.jpeg';
import slide16 from '../../../assets/showcase/showcase-16.jpeg';
import slide17 from '../../../assets/showcase/showcase-17.jpeg';
import slide18 from '../../../assets/showcase/showcase-18.jpeg';
import styles from './ShowcaseCarousel.module.css';

const SHOWCASE_SLIDES = [
  { id: 1, img: slide01, alt: 'Presentation Slide 1' },
  { id: 2, img: slide02, alt: 'Presentation Slide 2' },
  { id: 3, img: slide03, alt: 'Presentation Slide 3' },
  { id: 4, img: slide04, alt: 'Presentation Slide 4' },
  { id: 5, img: slide05, alt: 'Presentation Slide 5' },
  { id: 6, img: slide06, alt: 'Presentation Slide 6' },
  { id: 7, img: slide07, alt: 'Presentation Slide 7' },
  { id: 8, img: slide08, alt: 'Presentation Slide 8' },
  { id: 9, img: slide09, alt: 'Presentation Slide 9' },
  { id: 10, img: slide10, alt: 'Presentation Slide 10' },
  { id: 11, img: slide11, alt: 'Presentation Slide 11' },
  { id: 12, img: slide12, alt: 'Presentation Slide 12' },
  { id: 13, img: slide13, alt: 'Presentation Slide 13' },
  { id: 14, img: slide14, alt: 'Presentation Slide 14' },
  { id: 15, img: slide15, alt: 'Presentation Slide 15' },
  { id: 16, img: slide16, alt: 'Presentation Slide 16' },
  { id: 17, img: slide17, alt: 'Presentation Slide 17' },
  { id: 18, img: slide18, alt: 'Presentation Slide 18' },
];

export default function ShowcaseCarousel() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    checkScroll();
    track.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      track.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector(`.${styles.card}`);
    const cardWidth = card ? card.offsetWidth + 24 : 450;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className={styles.showcaseSection} aria-label="Work Showcase Cards">
      <div className={styles.carouselWrapper}>
        {/* Left Arrow Button */}
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonLeft} ${!canScrollLeft ? styles.navButtonDisabled : ''}`}
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Previous slides"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonRight} ${!canScrollRight ? styles.navButtonDisabled : ''}`}
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Next slides"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Scrolling Cards Track */}
        <div className={styles.track} ref={trackRef}>
          {SHOWCASE_SLIDES.map((slide) => (
            <div key={slide.id} className={styles.card}>
              <img
                src={slide.img}
                alt={slide.alt}
                className={styles.cardImage}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
