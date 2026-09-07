import React from 'react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import ProcessTimeline from './ProcessTimeline';
import styles from './Process.module.css';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Brief & Intake',
      description:
        'Alignment on core executive objective, target audience expectations, key message hierarchy, and delivery deadlines.',
      focus: 'Objective scoping & asset ingestion'
    },
    {
      number: '02',
      title: 'Research & Structure',
      description:
        'Market intelligence extraction, competitive landscape review, and structured narrative wireframing.',
      focus: 'Storyline blueprint & outline logic'
    },
    {
      number: '03',
      title: 'Draft & Visual Direction',
      description:
        'Design of custom visual architecture, bespoke vector systems, and high-impact quantitative chart transformations.',
      focus: 'Initial deck prototype & style lock'
    },
    {
      number: '04',
      title: 'Refinement & Polish',
      description:
        'Meticulous typography calibration, clarity pressure testing, and collaborative executive review iterations.',
      focus: 'High-stakes finesse & narrative flow'
    },
    {
      number: '05',
      title: 'Final Sign-Off',
      description:
        'Full boardroom-ready deliverable packaging across all required native formats (PowerPoint, Keynote, Interactive PDF).',
      focus: 'Flawless presentation readiness'
    },
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Slidevance Process">
      <div className="container">
        <SectionHeading
          eyebrow="PROVEN 5-PHASE METHODOLOGY"
          title="From Brief to Boardroom"
          subtitle="A disciplined creative framework designed to eliminate friction and deliver high-stakes certainty on schedule."
          align="center"
        />

        <ProcessTimeline steps={steps} />
      </div>
    </section>
  );
}
