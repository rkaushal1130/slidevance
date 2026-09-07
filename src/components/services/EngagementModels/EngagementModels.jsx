import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Layers, Users } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import Button from '../../common/Button/Button';
import styles from './EngagementModels.module.css';

export default function EngagementModels() {
  const models = [
    {
      badge: 'HIGH-STAKES PURSUITS',
      title: 'PROJECT-BASED',
      subtitle: 'Pay Per Slide',
      icon: Layers,
      description:
        'Designed for defined, deadline-driven milestones including investor pitch decks, board presentations, and competitive RFP bid submissions.',
      features: [
        'Transparent per-slide or milestone scope',
        'Turnkey native editable files (.pptx, Keynote)',
        'Active weekend and express turnaround available',
        'Rigorous executive narrative review & polish'
      ],
      highlight: false
    },
    {
      badge: 'MOST POPULAR FOR TEAMS',
      title: 'MONTHLY DESIGN PARTNERSHIP',
      subtitle: 'Fixed Monthly Fee',
      icon: Sparkles,
      description:
        'A predictable ongoing collaboration for leadership teams, marketing departments, and strategy groups requiring continuous agile visual communication.',
      features: [
        'Continuous agile design delivery under fixed fee',
        'Priority studio queue & accelerated turnaround',
        'Decks, RFPs, one-pagers & marketing collateral',
        'Direct collaborative communications channel'
      ],
      highlight: true
    },
    {
      badge: 'ENTERPRISE SCALE',
      title: 'DEDICATED DESIGNER',
      subtitle: 'Monthly Engagement',
      icon: Users,
      description:
        'A dedicated visual communication architect embedded directly into your workflow for high-volume, mission-critical corporate presentation pipelines.',
      features: [
        'Dedicated senior visual communication architect',
        'Deep organizational context & brand mastery',
        'Maximum daily throughput for executive demands',
        'Enterprise asset libraries & template governance'
      ],
      highlight: false
    }
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Investment & Flexible Engagement">
      <div className="container">
        <SectionHeading
          eyebrow="TRANSPARENT COLLABORATION"
          title="Investment &amp; Flexible Engagement"
          subtitle="Tailored collaboration structures designed to match your operational cadence, volume requirements, and internal workflow."
          align="center"
          maxWidth="780px"
        />

        <div className={styles.modelsGrid}>
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div
                key={model.title}
                className={`${styles.modelCard} ${model.highlight ? styles.highlightCard : ''}`}
              >
                {model.highlight && (
                  <div className={styles.cardGradientAccent} />
                )}

                <div className={styles.cardTop}>
                  <span className={styles.modelBadge}>{model.badge}</span>
                  <div className={styles.iconWrap}>
                    <Icon size={22} />
                  </div>
                </div>

                <div className={styles.modelHeader}>
                  <h3 className={styles.modelTitle}>{model.title}</h3>
                  <div className={styles.modelSubtitle}>{model.subtitle}</div>
                </div>

                <p className={styles.modelDesc}>{model.description}</p>

                <div className={styles.featuresList}>
                  <h4 className={styles.featuresHeading}>Included in Model:</h4>
                  {model.features.map((feature) => (
                    <div key={feature} className={styles.featureItem}>
                      <CheckCircle2 size={16} className={styles.checkIcon} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    to="/contact"
                    variant={model.highlight ? 'primary' : 'secondary'}
                    size="md"
                    icon={<ArrowRight size={16} />}
                    className={styles.modelBtn}
                  >
                    Discuss Your Requirements
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
