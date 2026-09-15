import React from 'react';
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
  Calendar,
  ChevronRight,
  Rocket,
  Infinity as InfinityIcon,
  RefreshCw,
  Zap,
  CalendarCheck,
} from 'lucide-react';
import styles from './PricingMain.module.css';

const PROJECT_CARDS = [
  {
    id: 'standard-slide',
    title: 'Standard Presentation Slide',
    rate: '$13',
    unit: '/ slide',
    subtext: 'Clean & professional design',
    icon: MonitorPlay,
    theme: 'blue',
  },
  {
    id: 'complex-slide',
    title: 'Complex Presentation Slide',
    rate: '$17',
    unit: '/ slide',
    subtext: 'Advanced layouts & infographics',
    icon: Share2,
    theme: 'purple',
  },
  {
    id: 'one-pager',
    title: 'One-Pager',
    rate: '$20',
    unit: '/ page',
    subtext: 'Impactful & concise design',
    icon: FileText,
    theme: 'blue',
  },
  {
    id: 'brochure-trifold',
    title: 'Brochure / Trifold',
    rate: '$30',
    unit: '/ design',
    subtext: 'Creative & brand-aligned design',
    icon: BookOpen,
    theme: 'magenta',
  },
  {
    id: 'proposal',
    title: 'Proposal',
    rate: '$50',
    unit: '/ proposal',
    subtext: 'High-quality & professional design',
    icon: FileCheck,
    theme: 'blue',
  },
  {
    id: 'complex-proposal',
    title: 'Complex Detailed Proposal',
    rate: '$150',
    unit: '/ proposal',
    subtext: 'In-depth, multi-page design',
    icon: FileSpreadsheet,
    theme: 'purple',
  },
  {
    id: 'word-document',
    title: 'Word Document',
    rate: '$20',
    unit: '/ document',
    subtext: 'Clean & professional format',
    icon: FileType,
    theme: 'blue',
  },
  {
    id: 'word-complex',
    title: 'Word Document + Complex Design',
    rate: '$35',
    unit: '/ document',
    subtext: 'Advanced layout & branding',
    icon: Palette,
    theme: 'teal',
  },
];

const SUBSCRIPTION_TIERS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$210',
    unit: '/ month',
    note: '$10.50 per slide • No slide cap',
  },
  {
    id: 'six-months',
    name: '6 Months',
    price: '$799',
    unit: '/ 6 months',
    note: '$10.50 per slide • No slide cap',
  },
  {
    id: 'twelve-months',
    name: '12 Months',
    price: '$1,399',
    unit: '/ year',
    note: '$10.50 per slide • No slide cap',
  },
];

const SUBSCRIBER_PERKS = [
  {
    icon: Rocket,
    label: 'Up to 10 slides delivered per day',
  },
  {
    icon: InfinityIcon,
    label: 'Unlimited slide volume',
  },
  {
    icon: RefreshCw,
    label: 'Revision support included',
  },
  {
    icon: Zap,
    label: 'Priority queue for subscribers',
  },
  {
    icon: CalendarCheck,
    label: 'Predictable subscription billing',
  },
];

export default function PricingMain() {
  return (
    <section className={styles.section} aria-label="Plans and Pricing Grid">
      <div className={`container ${styles.mainGrid}`}>
        {/* LEFT COLUMN: Project-Based Design (8 Cards) */}
        <div className={`${styles.projectCol} reveal-on-scroll`}>
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrowText}>PROJECT-BASED DESIGN</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          <h2 className={styles.projectHeading}>
            Choose the Plan That Fits{' '}
            <span className={styles.yourNeedsGradient}>Your Needs</span>
          </h2>

          <p className={styles.projectSubtitle}>
            Flexible, transparent and designed to give you the best value — no
            hidden costs, just great designs.
          </p>

          {/* 4x2 Cards Grid */}
          <div className={styles.cardsGrid}>
            {PROJECT_CARDS.map((card) => {
              const IconComp = card.icon;
              return (
                <div key={card.id} className={styles.projectCard}>
                  <div className={`${styles.iconBox} ${styles[`theme_${card.theme}`]}`}>
                    <IconComp size={18} />
                  </div>

                  <h3 className={styles.cardTitle}>{card.title}</h3>

                  <div className={styles.priceRow}>
                    <span className={styles.priceAmount}>{card.rate}</span>
                    <span className={styles.priceUnit}>{card.unit}</span>
                  </div>

                  <p className={styles.cardSubtext}>{card.subtext}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Subscription Plans (Gradient Card) */}
        <div className={`${styles.subscriptionCol} reveal-on-scroll reveal-delay-1`}>
          <div className={styles.subscriptionCard}>
            {/* Header */}
            <div className={styles.subCardHeader}>
              <span className={styles.subCardBadge}>SUBSCRIPTION PLANS</span>
              <h2 className={styles.subCardTitle}>Scale Your Creativity</h2>
              <p className={styles.subCardSubtitle}>
                Get unlimited requests, priority delivery and more — with our flexible
                subscription plans.
              </p>
            </div>

            {/* 3 Tier Rows */}
            <div className={styles.tiersStack}>
              {SUBSCRIPTION_TIERS.map((tier) => (
                <Link
                  key={tier.id}
                  to={`/contact?plan=${tier.id}`}
                  className={styles.tierItem}
                >
                  <div className={styles.tierIconCircle}>
                    <Calendar size={18} />
                  </div>

                  <div className={styles.tierInfo}>
                    <div className={styles.tierName}>{tier.name}</div>
                    <div className={styles.tierPricing}>
                      <span className={styles.tierAmount}>{tier.price}</span>
                      <span className={styles.tierUnit}>{tier.unit}</span>
                    </div>
                    <div className={styles.tierNote}>{tier.note}</div>
                  </div>

                  <div className={styles.tierArrow}>
                    <ChevronRight size={18} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom 5 Subscriber Perks */}
            <div className={styles.perksRow}>
              {SUBSCRIBER_PERKS.map((perk, i) => {
                const PerkIcon = perk.icon;
                return (
                  <div key={i} className={styles.perkItem}>
                    <div className={styles.perkIconBox}>
                      <PerkIcon size={14} />
                    </div>
                    <span className={styles.perkLabel}>{perk.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
