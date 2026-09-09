import React from 'react';
import { ArrowRight, Database, GitMerge, Palette, Award } from 'lucide-react';
import styles from './PromiseSection.module.css';

export default function PromiseSection() {
  const pipelineStages = [
    {
      step: '01',
      icon: Database,
      title: 'Raw Data',
      desc: 'Financials, technical specs, spreadsheets & unrefined research.',
      color: '#12C9E8'
    },
    {
      step: '02',
      icon: GitMerge,
      title: 'Business Logic',
      desc: 'Strategic synthesis, core message hierarchy & executive framing.',
      color: '#075FE8'
    },
    {
      step: '03',
      icon: Palette,
      title: 'Visual Narrative',
      desc: 'Bespoke information design, custom vectors & cognitive flow.',
      color: '#E52BB8'
    },
    {
      step: '04',
      icon: Award,
      title: 'Boardroom Deliverable',
      desc: 'Decisive, high-stakes presentation materials built to win consensus.',
      color: '#FF9D25'
    }
  ];

  return (
    <section className={styles.promiseSection} aria-label="Our Studio Promise">
      {/* Background ambient lighting effects */}
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.promiseContainer}`}>
        {/* Heading */}
        <h2 className={styles.promiseHeading}>
          Your Information.
          <br />
          Your Design.
          <br />
          <span className="gradient-text">One Powerful Story.</span>
        </h2>

        {/* Supporting Line with gradient highlighted keywords */}
        <p className={styles.supportingLine}>
          From <span className={styles.highlightCyan}>raw data</span>
          {' '}→{' '}
          <span className={styles.highlightBlue}>business logic</span>
          {' '}→{' '}
          <span className={styles.highlightMagenta}>visual narrative</span>
          {' '}→{' '}
          <span className={styles.highlightOrange}>boardroom-ready deliverable</span>.
        </p>

        {/* Interactive 4-Stage Visual Transformation Pipeline */}
        <div className={styles.pipelineGrid}>
          {pipelineStages.map((stage, idx) => (
            <React.Fragment key={stage.title}>
              <div className={styles.pipelineCard}>
                <div className={styles.stageHeader}>
                  <span className={styles.stageNumber}>{stage.step}</span>
                  <div
                    className={styles.stageIconBox}
                    style={{ color: stage.color, borderColor: `${stage.color}33` }}
                  >
                    <stage.icon size={20} />
                  </div>
                </div>
                <h3 className={styles.stageTitle}>{stage.title}</h3>
                <p className={styles.stageDesc}>{stage.desc}</p>
              </div>

              {idx < pipelineStages.length - 1 && (
                <div className={styles.pipelineArrow} aria-hidden="true">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
