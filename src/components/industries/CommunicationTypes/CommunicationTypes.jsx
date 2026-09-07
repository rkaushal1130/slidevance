import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileCheck2, 
  Compass, 
  Layers
} from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import styles from './CommunicationTypes.module.css';

export default function CommunicationTypes() {
  const commTypes = [
    {
      icon: TrendingUp,
      title: 'Investor Communication',
      description: 'Capital raises, pitch decks, LP quarterly updates, and investment memorandums built to secure funding conviction.',
      tag: 'CAPITAL & VALUATION'
    },
    {
      icon: Users,
      title: 'Executive Presentations',
      description: 'Board of directors decks, leadership summits, all-hands addresses, and high-stakes corporate roadmaps.',
      tag: 'LEADERSHIP & BOARD'
    },
    {
      icon: Briefcase,
      title: 'Sales Communication',
      description: 'High-conversion enterprise pitch decks, client capability overviews, and commercial field sales playbooks.',
      tag: 'REVENUE & CLIENTS'
    },
    {
      icon: FileCheck2,
      title: 'Proposal & RFP Communication',
      description: 'Competitive bids, multi-million dollar technical proposals, compliance rubrics, and procurement presentations.',
      tag: 'PURSUIT & BIDS'
    },
    {
      icon: Compass,
      title: 'Research & Intelligence',
      description: 'Competitor benchmarking, market landscape matrices, threat assessments, and strategic industry syntheses.',
      tag: 'INSIGHT & STRATEGY'
    },
    {
      icon: Layers,
      title: 'Corporate Communication',
      description: 'Boardroom one-pagers, executive tearsheets, cross-department alignment materials, and institutional collateral.',
      tag: 'ORGANIZATION & TEAMS'
    }
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="High-Stakes Communication Types">
      <div className="container">
        <SectionHeading
          eyebrow="DECISION MOMENTS"
          title="Built Around the Moment That Matters."
          subtitle="Whether presenting to an investment committee, procurement panel, or board of directors, each communication moment demands tailored visual architecture."
          align="center"
          maxWidth="820px"
        />

        <div className={styles.grid}>
          {commTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.title} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrap}>
                    <Icon size={22} />
                  </div>
                  <span className={styles.cardTag}>{type.tag}</span>
                </div>

                <h3 className={styles.cardTitle}>{type.title}</h3>
                <p className={styles.cardDesc}>{type.description}</p>
                <div className={styles.cardAccent} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
