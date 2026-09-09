import React from 'react';
import { Maximize2, FileCode2, Layers, ShieldCheck } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import styles from './DeliveryStandards.module.css';

export default function DeliveryStandards() {
  const standards = [
    {
      icon: Maximize2,
      title: '100% Vector & Scalable',
      description: 'Every chart, diagram, and custom graphic is built in pure scalable vector geometry for ultra-crisp display across executive monitors and print.'
    },
    {
      icon: FileCode2,
      title: 'Fully Editable Source Files',
      description: 'Zero proprietary lock-in. We deliver full turnkey master decks, clean typography hierarchies, and native vector layers for ongoing internal updates.'
    },
    {
      icon: Layers,
      title: 'Multi-Platform Native',
      description: 'Natively formatted and calibrated for Microsoft PowerPoint (.pptx), Apple Keynote, Google Slides, and interactive executive PDFs.'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Confidentiality',
      description: 'Protected production workflows, strict non-disclosure agreement compliance, and institutional-grade data security for proprietary corporate assets.'
    }
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Delivery Standards">
      <div className="container">
        <SectionHeading
          title="Built for Professional Delivery."
          subtitle="Enterprise-grade asset standards engineered for executive presentation software and mission-critical workflows."
          align="center"
        />

        <div className={styles.grid}>
          {standards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={styles.card}>
                <div className={styles.iconWrap}>
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
                <div className={styles.accentLine} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
