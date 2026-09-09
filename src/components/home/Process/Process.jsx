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
      color: '#0066FF',
      lightBg: 'rgba(0, 102, 255, 0.08)',
      bgColor: '#FFFFFF',
      borderColor: 'rgba(0, 102, 255, 0.18)',
    },
    {
      number: '02',
      title: 'Research & Structure',
      description: 'Narrative outline, content curation, and message sequencing.',
      icon: 'Search',
      color: '#0099FF',
      lightBg: 'rgba(0, 153, 255, 0.08)',
      bgColor: '#FFFFFF',
      borderColor: 'rgba(0, 153, 255, 0.18)',
    },
    {
      number: '03',
      title: 'Draft & Visual Direction',
      description: 'High-fidelity layout and signature brand styling.',
      icon: 'Pencil',
      color: '#B828E0',
      lightBg: 'rgba(184, 40, 224, 0.08)',
      bgColor: '#FFFFFF',
      borderColor: 'rgba(184, 40, 224, 0.18)',
    },
    {
      number: '04',
      title: 'Refinement & Polish',
      description: 'Structured revision cycles incorporated with real-time feedback.',
      icon: 'RotateCw',
      color: '#D926A9',
      lightBg: 'rgba(217, 38, 169, 0.08)',
      bgColor: '#FFFFFF',
      borderColor: 'rgba(217, 38, 169, 0.18)',
    },
    {
      number: '05',
      title: 'Final Sign-Off',
      description: 'Delivery of master editable PPTX and print/screen-optimized vector PDFs.',
      icon: 'CheckCircle2',
      color: '#FF6E00',
      lightBg: 'rgba(255, 110, 0, 0.08)',
      bgColor: '#FFFFFF',
      borderColor: 'rgba(255, 110, 0, 0.18)',
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
