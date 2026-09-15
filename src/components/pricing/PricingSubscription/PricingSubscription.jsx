import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Rocket,
  Infinity as InfinityIcon,
  RefreshCw,
  Zap,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import styles from './PricingSubscription.module.css';

const SUBSCRIPTION_TIERS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$210',
    unit: '/ month',
    note: '$10.50 per slide • No slide cap',
    badge: null,
    isPopular: false,
    features: [
      'Dedicated presentation designer',
      'Continuous workflow & active queue',
      'Daily progress delivery',
      'Standard turnarounds',
    ],
  },
  {
    id: 'six-months',
    name: '6 Months',
    price: '$799',
    unit: '/ 6 months',
    note: '$10.50 per slide • No slide cap',
    badge: 'MOST POPULAR',
    isPopular: true,
    features: [
      'Dedicated senior presentation designer',
      'Priority queue & faster turnaround',
      'Unlimited revisions included',
      'Bi-weekly design review syncs',
    ],
  },
  {
    id: 'twelve-months',
    name: '12 Months',
    price: '$1,399',
    unit: '/ year',
    note: '$10.50 per slide • No slide cap',
    badge: 'BEST VALUE',
    isPopular: false,
    features: [
      'Executive-level design lead',
      'Highest VIP queue priority',
      'Custom brand design library curation',
      'Dedicated account manager',
    ],
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

export default function PricingSubscription() {
  return (
    <section className={styles.section} aria-label="Subscription Plans">
      {/* Background ambient accents */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className="container">
        {/* Header Block */}
        <div className={`${styles.headerBlock} reveal-on-scroll`}>
          <div className={styles.eyebrowWrapper}>
            <Sparkles size={16} className={styles.eyebrowIcon} />
            <span className={styles.eyebrowText}>SUBSCRIPTION PLANS</span>
          </div>

          <h2 className={styles.title}>
            Scale Your <span className={styles.creativityGradient}>Creativity</span>
          </h2>

          <p className={styles.subtitle}>
            Get unlimited requests, priority delivery and more — with our flexible
            subscription plans built for ongoing presentation needs.
          </p>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className={`${styles.tiersGrid} reveal-on-scroll reveal-delay-1`}>
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`${styles.tierCard} ${tier.isPopular ? styles.tierCardPopular : ''}`}
            >
              {tier.badge && (
                <div className={styles.popularBadge}>
                  <span>{tier.badge}</span>
                </div>
              )}

              <div className={styles.cardHeader}>
                <div className={styles.tierIconCircle}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className={styles.tierName}>{tier.name}</h3>
                  <div className={styles.tierNote}>{tier.note}</div>
                </div>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceAmount}>{tier.price}</span>
                <span className={styles.priceUnit}>{tier.unit}</span>
              </div>

              {/* Feature checkmarks */}
              <ul className={styles.featureList}>
                {tier.features.map((feat, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <CheckCircle2 size={16} className={styles.featureIcon} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to={`/contact?plan=${tier.id}`}
                className={`${styles.tierBtn} ${tier.isPopular ? styles.tierBtnPopular : ''}`}
              >
                <span>Choose Plan</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom 5 Subscriber Perks Banner */}
        <div className={`${styles.perksBanner} reveal-on-scroll reveal-delay-2`}>
          <div className={styles.perksGrid}>
            {SUBSCRIBER_PERKS.map((perk, i) => {
              const PerkIcon = perk.icon;
              return (
                <div key={i} className={styles.perkItem}>
                  <div className={styles.perkIconBox}>
                    <PerkIcon size={16} />
                  </div>
                  <span className={styles.perkLabel}>{perk.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
