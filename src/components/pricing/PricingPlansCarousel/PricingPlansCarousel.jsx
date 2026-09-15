import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MonitorPlay,
  Share2,
  FileText,
  BookOpen,
  FileCheck,
  FileSpreadsheet,
  FileType,
  Palette,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';
import styles from './PricingPlansCarousel.module.css';

export const PROJECT_CARDS = [
  {
    id: 'standard-slide',
    title: 'Standard Presentation Slide',
    rate: '$13',
    unit: '/ slide',
    subtext: 'Clean & professional design',
    icon: MonitorPlay,
    theme: 'blue',
    description: 'Perfect for regular team updates, corporate reports, and clean business presentations.',
  },
  {
    id: 'complex-slide',
    title: 'Complex Presentation Slide',
    rate: '$17',
    unit: '/ slide',
    subtext: 'Advanced layouts & infographics',
    icon: Share2,
    theme: 'purple',
    description: 'Bespoke infographics, complex data workflows, and high-impact investor narrative decks.',
  },
  {
    id: 'one-pager',
    title: 'One-Pager',
    rate: '$20',
    unit: '/ page',
    subtext: 'Impactful & concise design',
    icon: FileText,
    theme: 'cyan',
    description: 'High-density executive summaries, product briefs, and investor tear-sheets that hook readers.',
  },
  {
    id: 'brochure-trifold',
    title: 'Brochure / Trifold',
    rate: '$30',
    unit: '/ design',
    subtext: 'Creative & brand-aligned design',
    icon: BookOpen,
    theme: 'magenta',
    description: 'Marketing collateral, event hand-outs, and sales brochures prepared for digital & print.',
  },
  {
    id: 'proposal',
    title: 'Proposal',
    rate: '$50',
    unit: '/ proposal',
    subtext: 'High-quality & professional design',
    icon: FileCheck,
    theme: 'blue',
    description: 'Commercial client proposals and RFP responses formatted to establish credibility and win deals.',
  },
  {
    id: 'complex-proposal',
    title: 'Complex Detailed Proposal',
    rate: '$150',
    unit: '/ proposal',
    subtext: 'In-depth, multi-page design',
    icon: FileSpreadsheet,
    theme: 'purple',
    description: 'Multi-chapter enterprise bids, tender documentation, and technical consulting deliverables.',
  },
  {
    id: 'word-document',
    title: 'Word Document',
    rate: '$20',
    unit: '/ document',
    subtext: 'Clean & professional format',
    icon: FileType,
    theme: 'sky',
    description: 'Typography styling, brand-consistent headers, table formatting, and clear page layouts.',
  },
  {
    id: 'word-complex',
    title: 'Word Document + Complex Design',
    rate: '$35',
    unit: '/ document',
    subtext: 'Advanced layout & branding',
    icon: Palette,
    theme: 'teal',
    description: 'Advanced desktop publishing, custom vector charts, infographic figures, and whitepapers.',
  },
];

export default function PricingPlansCarousel() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activePage, setActivePage] = useState(0); // 0 or 1 on desktop
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' or 'grid'

  // Update navigation button states on scroll
  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Calculate active page based on scroll position
    const pageFraction = scrollLeft / (scrollWidth - clientWidth || 1);
    setActivePage(pageFraction > 0.4 ? 1 : 0);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || viewMode === 'grid') return;

    checkScroll();
    track.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      track.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, viewMode]);

  // Scroll handler for arrows
  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const scrollAmount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Direct page navigation
  const scrollToPage = (pageIdx) => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const targetScroll = pageIdx === 0 ? 0 : container.scrollWidth - container.clientWidth;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.section} aria-label="Project-Based Pricing Carousel">
      <div className="container">
        {/* Header Row: Eyebrow, Heading, Subtitle & Navigation Controls */}
        <div className={`${styles.headerRow} reveal-on-scroll`}>
          <div className={styles.titleCol}>
            <div className={styles.eyebrowWrapper}>
              <span className={styles.eyebrowText}>PROJECT-BASED DESIGN</span>
              <span className={styles.eyebrowLine} aria-hidden="true" />
            </div>

            <h2 className={styles.heading}>
              Choose the Plan That Fits{' '}
              <span className={styles.yourNeedsGradient}>Your Needs</span>
            </h2>

            <p className={styles.subtitle}>
              Flexible, transparent and designed to give you the best value — no hidden
              costs, just great designs.
            </p>
          </div>

          {/* Right Controls: View Toggle + Arrow Buttons */}
          <div className={styles.controlsCol}>
            {/* View mode toggle (Carousel vs Grid) */}
            <div className={styles.viewToggle} role="group" aria-label="Display mode">
              <button
                type="button"
                className={`${styles.toggleBtn} ${viewMode === 'carousel' ? styles.activeToggle : ''}`}
                onClick={() => setViewMode('carousel')}
                title="Carousel View"
                aria-pressed={viewMode === 'carousel'}
              >
                <SlidersHorizontal size={15} />
                <span>Carousel</span>
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid size={15} />
                <span>Grid</span>
              </button>
            </div>

            {/* Carousel Arrow Controls (Visible in carousel mode) */}
            {viewMode === 'carousel' && (
              <div className={styles.navArrows}>
                <button
                  type="button"
                  className={`${styles.navBtn} ${!canScrollLeft ? styles.navBtnDisabled : ''}`}
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous plans"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${!canScrollRight ? styles.navBtnDisabled : ''}`}
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next plans"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel or Grid Container */}
        {viewMode === 'carousel' ? (
          <div className={styles.carouselWrapper}>
            <div className={styles.track} ref={trackRef} tabIndex={0} aria-label="Plans carousel list">
              {PROJECT_CARDS.map((card, index) => {
                const IconComp = card.icon;
                return (
                  <div key={card.id} className={styles.cardItem}>
                    <div className={styles.cardInner}>
                      {/* Icon with theme background */}
                      <div className={`${styles.iconBox} ${styles[`theme_${card.theme}`]}`}>
                        <IconComp size={18} />
                      </div>

                      <h3 className={styles.cardTitle}>{card.title}</h3>

                      <div className={styles.priceRow}>
                        <span className={styles.priceAmount}>{card.rate}</span>
                        <span className={styles.priceUnit}>{card.unit}</span>
                      </div>

                      <p className={styles.cardSubtext}>{card.subtext}</p>

                      {/* Quick CTA */}
                      <div className={styles.cardAction}>
                        <Link
                          to={`/contact?service=${card.id}`}
                          className={styles.selectBtn}
                          aria-label={`Get started with ${card.title}`}
                        >
                          <span>Get Started</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination indicator dots below carousel */}
            <div className={styles.paginationDots} role="tablist" aria-label="Carousel pagination">
              <button
                type="button"
                className={`${styles.dot} ${activePage === 0 ? styles.activeDot : ''}`}
                onClick={() => scrollToPage(0)}
                aria-label="Slide 1: Presentation & Marketing Formats"
                aria-selected={activePage === 0}
              />
              <button
                type="button"
                className={`${styles.dot} ${activePage === 1 ? styles.activeDot : ''}`}
                onClick={() => scrollToPage(1)}
                aria-label="Slide 2: Proposals & Documents"
                aria-selected={activePage === 1}
              />
            </div>
          </div>
        ) : (
          /* Grid View (All 8 Cards in 4x2 Grid) */
          <div className={`${styles.gridContainer} reveal-on-scroll`}>
            {PROJECT_CARDS.map((card) => {
              const IconComp = card.icon;
              return (
                <div key={card.id} className={styles.gridCard}>
                  <div className={`${styles.iconBox} ${styles[`theme_${card.theme}`]}`}>
                    <IconComp size={18} />
                  </div>

                  <h3 className={styles.cardTitle}>{card.title}</h3>

                  <div className={styles.priceRow}>
                    <span className={styles.priceAmount}>{card.rate}</span>
                    <span className={styles.priceUnit}>{card.unit}</span>
                  </div>

                  <p className={styles.cardSubtext}>{card.subtext}</p>

                  <div className={styles.cardAction}>
                    <Link
                      to={`/contact?service=${card.id}`}
                      className={styles.selectBtn}
                    >
                      <span>Get Started</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
