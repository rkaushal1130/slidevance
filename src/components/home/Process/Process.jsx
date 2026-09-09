import React from 'react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import ProcessTimeline from './ProcessTimeline';
import styles from './Process.module.css';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Brief & Intake',
      description: 'Scope alignment, objective definition, and asset handover.',
      icon: 'FileText',
    },
    {
      number: '02',
      title: 'Research & Structure',
      description: 'Narrative outline, content curation, and message sequencing.',
      icon: 'Search',
    },
    {
      number: '03',
      title: 'Draft & Visual Direction',
      description: 'High-fidelity layout and signature brand styling.',
      icon: 'Pencil',
    },
    {
      number: '04',
      title: 'Refinement & Polish',
      description: 'Structured revision cycles incorporated with real-time feedback.',
      icon: 'RotateCw',
    },
    {
      number: '05',
      title: 'Final Sign-Off',
      description: 'Delivery of master editable PPTX and print/screen-optimized vector PDFs.',
      icon: 'CheckCircle2',
    },
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Slidevance Process">
      <div className="container">
        <SectionHeading
          title="From Brief to Boardroom"
          subtitle="A disciplined creative framework designed to eliminate friction and deliver high-stakes certainty on schedule."
          align="center"
        />

        <ProcessTimeline steps={steps} />
      </div>
    </section>
  );
}
