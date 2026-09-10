import React from 'react';
import { Target, Search, Layers, Clock } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import FeatureCard from './FeatureCard';
import styles from './WhatSetsUsApart.module.css';

export default function WhatSetsUsApart() {
  const features = [
    {
      number: '01',
      icon: Target,
      title: 'Business-First Narrative',
      description:
        'Content organized around your core objective and executive audience—not generic visual decoration.',
      accentColor: 'blue',
    },
    {
      number: '02',
      icon: Search,
      title: 'Research-Backed Insight',
      description:
        'Deep industry, competitor and market research to strengthen the message behind your numbers.',
      accentColor: 'teal',
    },
    {
      number: '03',
      icon: Layers,
      title: 'Single Studio, Full Spectrum',
      description:
        'Decks, RFPs, one-pagers, brochures and visual marketing assets under one roof.',
      accentColor: 'magenta',
    },
    {
      number: '04',
      icon: Clock,
      title: '24/7 Agile Availability',
      description:
        'Around-the-clock responsiveness with active weekend coverage to meet mission-critical client deadlines.',
      accentColor: 'orange',
    },
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="What Sets Us Apart">
      <div className="container">
        <SectionHeading
          title="What Sets Us Apart"
          subtitle="Engineered from the ground up for high-stakes corporate communication where standard templates fail."
          align="center"
          singleLine={true}
        />

        <div className={styles.grid}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              number={feature.number}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
