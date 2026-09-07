import React from 'react';
import { Target, Search, Layers, Clock } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import FeatureCard from '../../home/WhatSetsUsApart/FeatureCard';
import styles from './AboutSetsUsApart.module.css';

export default function AboutSetsUsApart() {
  const cards = [
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
      accentColor: 'cyan',
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
          eyebrow="STRATEGIC ADVANTAGE"
          title={
            <>
              Built Around Your Business.
              <br />
              <span className="gradient-text">Designed Around Your Objective.</span>
            </>
          }
          subtitle="We discard one-size-fits-all aesthetics in favor of deeply aligned communication systems tailored to high-stakes decisions."
          align="center"
          maxWidth="820px"
        />

        <div className={styles.grid}>
          {cards.map((card) => (
            <FeatureCard
              key={card.title}
              number={card.number}
              icon={card.icon}
              title={card.title}
              description={card.description}
              accentColor={card.accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
