import React, { useRef, useState, useEffect, useCallback } from 'react';
import slide01 from '../../../assets/showcase/carousel-01-gaming.png';
import slide02 from '../../../assets/showcase/carousel-02-shipping-esg.png';
import slide03 from '../../../assets/showcase/carousel-03-maritime-logistics.png';
import slide04 from '../../../assets/showcase/carousel-04-business-performance.png';
import slide05 from '../../../assets/showcase/carousel-05-ai-robotics.png';
import slide06 from '../../../assets/showcase/carousel-06-modern-banking.png';
import slide07 from '../../../assets/showcase/carousel-07-healthcare-solutions.png';
import slide08 from '../../../assets/showcase/carousel-08-food-performance.png';
import slide09 from '../../../assets/showcase/carousel-09-saas-cloud-future.png';
import slide10 from '../../../assets/showcase/carousel-10-smarter-banking.png';
import styles from './ShowcaseCarousel.module.css';

const SHOWCASE_SLIDES = [
  {
    id: 1,
    title: 'Gaming for a Bigger Tomorrow',
    category: 'Gaming & Interactive Entertainment',
    img: slide01,
    alt: 'Gaming industry executive overview and investor pitch slide',
  },
  {
    id: 2,
    title: 'Corporate Responsibility & ESG Report',
    category: 'Global Shipping & Sustainability',
    img: slide02,
    alt: 'Global shipping corporate responsibility presentation slide',
  },
  {
    id: 3,
    title: 'Global Maritime Logistics Progress Report',
    category: 'Maritime Operations & Scale',
    img: slide03,
    alt: 'Global maritime logistics operations and metrics presentation slide',
  },
  {
    id: 4,
    title: 'Strategic Business Performance Report',
    category: 'Executive Strategy & Growth',
    img: slide04,
    alt: 'Strategic business performance review presentation slide',
  },
  {
    id: 5,
    title: 'AI & Robotics: Smarter Automated Future',
    category: 'Artificial Intelligence & Robotics',
    img: slide05,
    alt: 'AI and intelligent robotics automation presentation slide',
  },
  {
    id: 6,
    title: 'Modern Banking for a Brighter Tomorrow',
    category: 'Digital Banking & Fintech',
    img: slide06,
    alt: 'Modern digital banking and customer insights presentation slide',
  },
  {
    id: 7,
    title: 'Better Care for a Healthier Tomorrow',
    category: 'Healthcare & MedTech Solutions',
    img: slide07,
    alt: 'Healthcare solutions and clinical patient journey presentation slide',
  },
  {
    id: 8,
    title: 'Food Brands Business Performance Report',
    category: 'QSR & Franchise Hospitality',
    img: slide08,
    alt: 'Food franchise performance and brand overview presentation slide',
  },
  {
    id: 9,
    title: 'Building the Future Together: SaaS Platform',
    category: 'Enterprise Cloud & SaaS',
    img: slide09,
    alt: 'B2B SaaS cloud platform investment pitch presentation slide',
  },
  {
    id: 10,
    title: 'Smarter Banking for a Brighter Future',
    category: 'Next-Gen Digital Banking',
    img: slide10,
    alt: 'Smarter banking and financial technology presentation slide',
  },
];

export default function ShowcaseCarousel() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeModalSlide, setActiveModalSlide] = useState(null);

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
    const cardWidth = card ? card.offsetWidth + 20 : 340;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!activeModalSlide) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalSlide(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalSlide]);

  return (
    <section className={styles.showcaseSection} aria-label="Featured Work Showcase">
      <div className={styles.container}>
        <div className={styles.showcaseBox}>
          {/* Left Column: Heading, Description & Navigation */}
          <div className={styles.leftColumn}>
            <div className={styles.leftHeader}>
              <h2 className={styles.heading}>What's new on Slidevance</h2>
              <p className={styles.description}>
                See the latest website updates, new features and tools and make the most of your Slidevance experience.
              </p>
            </div>

            {/* Navigation Arrow Controls */}
            <div className={styles.navControls} aria-label="Carousel navigation">
              <button
                type="button"
                className={`${styles.navButton} ${!canScrollLeft ? styles.navButtonDisabled : ''}`}
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous slides"
              >
                <svg
                  width="20"
                  height="20"
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

              <button
                type="button"
                className={`${styles.navButton} ${!canScrollRight ? styles.navButtonDisabled : ''}`}
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next slides"
              >
                <svg
                  width="20"
                  height="20"
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
            </div>
          </div>

          {/* Right Column: Horizontal Cards Carousel */}
          <div className={styles.rightColumn}>
            <div className={styles.track} ref={trackRef}>
              {SHOWCASE_SLIDES.map((slide) => (
                <article
                  key={slide.id}
                  className={styles.card}
                  onClick={() => setActiveModalSlide(slide)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveModalSlide(slide);
                    }
                  }}
                  aria-label={`View ${slide.title}`}
                >
                  {/* Card Slide Image Preview */}
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={slide.img}
                      alt={slide.alt}
                      className={styles.cardImage}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{slide.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal Preview */}
      {activeModalSlide && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveModalSlide(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalCategory}>{activeModalSlide.category}</span>
                <h3 id="modal-title" className={styles.modalTitle}>{activeModalSlide.title}</h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveModalSlide(null)}
                aria-label="Close preview"
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
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.modalImageWrapper}>
              <img
                src={activeModalSlide.img}
                alt={activeModalSlide.alt}
                className={styles.modalImage}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
