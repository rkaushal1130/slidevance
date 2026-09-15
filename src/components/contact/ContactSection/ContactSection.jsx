import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MonitorPlay,
  FileText,
  Megaphone,
  BarChart3,
  RotateCw,
  MoreHorizontal,
  Infinity as InfinityIcon,
  ArrowRight,
  Check,
} from 'lucide-react';
import ContactForm from '../ContactForm/ContactForm';
import styles from './ContactSection.module.css';

const SERVICE_CARDS = [
  {
    id: 'PRESENTATION_DESIGN',
    title: 'Presentation Design',
    icon: MonitorPlay,
    theme: 'purple',
    line1: 'Pitch decks • Investor decks',
    line2: 'Sales decks • Corporate presentations',
  },
  {
    id: 'BUSINESS_DOCUMENTS',
    title: 'Business Documents',
    icon: FileText,
    theme: 'green',
    line1: 'Proposals • Reports',
    line2: 'Whitepapers • Company profiles',
  },
  {
    id: 'SALES_ENABLEMENT',
    title: 'Marketing Collateral',
    icon: Megaphone,
    theme: 'cyan',
    line1: 'One-pagers • Brochures',
    line2: 'Case studies • Infographics',
  },
  {
    id: 'RESEARCH',
    title: 'Research & Data',
    icon: BarChart3,
    theme: 'violet',
    line1: 'Market research • Data visualization',
    line2: 'Competitive analysis',
  },
  {
    id: 'DEDICATED_DESIGNER',
    title: 'Ongoing Design Support',
    icon: RotateCw,
    theme: 'blue',
    line1: 'Monthly support • Recurring decks',
    line2: 'Design subscription',
  },
  {
    id: 'OTHER',
    title: 'Something Else',
    icon: MoreHorizontal,
    theme: 'lightCyan',
    line1: 'Tell us what you have in mind',
    line2: '',
  },
];

export default function ContactSection() {
  const [selectedProjectType, setSelectedProjectType] = useState('PRESENTATION_DESIGN');

  const handleCardClick = (id) => {
    setSelectedProjectType(id);
    // Smooth scroll to form on mobile/smaller screens
    if (window.innerWidth < 960) {
      const formEl = document.getElementById('inquiry-form-card');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="project-inquiry-section"
      className={styles.section}
      aria-label="What can we help you with"
    >
      <div className={`container ${styles.gridContainer}`}>
        {/* Left Column: Choose what you need help with + 6 Service Cards */}
        <div className={`${styles.leftCol} reveal-on-scroll`}>
          {/* Eyebrow badge */}
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrowText}>WHAT CAN WE HELP YOU WITH?</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          <h2 className={styles.heading}>
            Choose what
            <br />
            you need help with.
          </h2>

          <p className={styles.description}>
            Select the type of project you’re working on. This helps us understand
            your requirements better and give you the right support, faster.
          </p>

          {/* 6 Selectable Service Cards in 2-column grid */}
          <div className={styles.cardsGrid} role="radiogroup" aria-label="Project Type Selection">
            {SERVICE_CARDS.map((card) => {
              const isSelected = selectedProjectType === card.id;
              const IconComp = card.icon;

              return (
                <div
                  key={card.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => handleCardClick(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(card.id);
                    }
                  }}
                  className={`${styles.serviceCard} ${
                    isSelected ? styles.cardSelected : ''
                  }`}
                >
                  {/* Selected checkmark indicator */}
                  {isSelected && (
                    <div className={styles.selectedBadge} aria-hidden="true">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  {/* Icon box */}
                  <div className={`${styles.iconBox} ${styles[`theme_${card.theme}`]}`}>
                    <IconComp size={20} />
                  </div>

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardLine}>{card.line1}</p>
                    {card.line2 && <p className={styles.cardLine}>{card.line2}</p>}
                  </div>

                  {/* Arrow indicator */}
                  <div className={`${styles.cardArrow} ${isSelected ? styles.cardArrowActive : ''}`}>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Ongoing Design Support Subscription Banner */}
          <div className={styles.supportBanner}>
            <div className={styles.bannerLeft}>
              <div className={styles.infinityIconBox}>
                <InfinityIcon size={20} />
              </div>
              <div className={styles.bannerText}>
                <h3 className={styles.bannerTitle}>Need ongoing design support?</h3>
                <p className={styles.bannerSubtitle}>
                  Explore our subscription plans for consistent, high-quality design, every month.
                </p>
              </div>
            </div>

            <Link to="/pricing" className={styles.bannerLink}>
              <span>Learn More</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className={`${styles.rightCol} reveal-on-scroll reveal-delay-2`}>
          <ContactForm
            selectedProjectType={selectedProjectType}
            onSelectProjectType={setSelectedProjectType}
          />
        </div>
      </div>
    </section>
  );
}
