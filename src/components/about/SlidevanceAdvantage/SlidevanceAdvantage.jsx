import React from 'react';
import { Target, Clock, FolderCheck, Shield, Sliders } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import styles from './SlidevanceAdvantage.module.css';

export default function SlidevanceAdvantage() {
  const advantageBlocks = [
    {
      icon: Target,
      title: 'Business-First Thinking',
      description:
        'Content organized strictly around your strategic objective and executive audience, eliminating generic visual decoration.',
      tag: 'STRATEGY'
    },
    {
      icon: Clock,
      title: '24/7 Availability & Weekend Support',
      description:
        'Around-the-clock responsiveness with active weekend coverage to safeguard mission-critical deadlines and high-stakes deliverables.',
      tag: 'RESPONSIVENESS'
    },
    {
      icon: FolderCheck,
      title: 'Turnkey File Ownership',
      description:
        'Complete client ownership with 100% editable native presentation decks, source vectors, and modular master design files.',
      tag: 'OWNERSHIP'
    },
    {
      icon: Shield,
      title: 'Strict Enterprise Confidentiality',
      description:
        'Rigorous institutional confidentiality standards, binding NDAs, and secure data-handling protocols for proprietary corporate intelligence.',
      tag: 'SECURITY'
    },
    {
      icon: Sliders,
      title: 'Flexible Scale',
      description:
        'Dynamic studio capacity that expands seamlessly from rapid turnaround executive slides to multi-workstream enterprise campaigns.',
      tag: 'AGILITY'
    },
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="The Slidevance Advantage">
      <div className="container">
        <SectionHeading
          title={
            <>
              More Than Design.
              <br />
              <span className="gradient-text">A Complete Communication Partner.</span>
            </>
          }
          subtitle="Engineered to meet the rigorous demands of leadership teams, investment committees, and corporate strategists."
          align="center"
          maxWidth="780px"
        />

        <div className={styles.blocksGrid}>
          {advantageBlocks.map((block, idx) => {
            const Icon = block.icon;
            return (
              <div key={block.title} className={`${styles.advantageBlock} reveal-on-scroll reveal-delay-${idx + 1}`}>
                <div className={styles.blockTop}>
                  <div className={styles.iconWrapper}>
                    <Icon size={22} />
                  </div>
                  <span className={styles.blockTag}>{block.tag}</span>
                </div>

                <div className={styles.blockBody}>
                  <h3 className={styles.blockTitle}>{block.title}</h3>
                  <p className={styles.blockDesc}>{block.description}</p>
                </div>

                <div className={styles.blockNumber}>0{idx + 1}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
