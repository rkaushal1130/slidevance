import React from 'react';
import { Maximize2, FileCode2, Layers, ShieldCheck } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import styles from './DeliveryCapabilities.module.css';

export default function DeliveryCapabilities() {
  const capabilities = [
    {
      icon: Maximize2,
      title: '100% Vector & Scalable',
      description:
        'Infographics, charts, and diagrams crafted as infinitely scalable vectors for immaculate high-resolution display on any screen or print medium.'
    },
    {
      icon: FileCode2,
      title: 'Fully Editable Source Files',
      description:
        'Complete native files provided with cleanly organized layers, master slide templates, and typographic hierarchies for seamless internal editing.'
    },
    {
      icon: Layers,
      title: 'Multi-Platform Native',
      description:
        'Delivered in Microsoft PowerPoint (.pptx), Apple Keynote, Google Slides, and interactive executive PDFs calibrated for flawless presentation playback.'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Confidentiality',
      description:
        'Secure file transfer, non-disclosure compliance, and strict institutional privacy procedures to protect sensitive financial and strategic information.'
    }
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Delivery Capabilities">
      <div className="container">
        <SectionHeading
          eyebrow="TECHNICAL EXCELLENCE"
          title="Delivery Capabilities"
          subtitle="Precision engineering and universal compatibility across enterprise presentation environments."
          align="center"
        />

        <div className={styles.columnsGrid}>
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div key={cap.title} className={styles.columnCard}>
                <div className={styles.iconBox}>
                  <Icon size={24} strokeWidth={1.75} />
                </div>
                <h3 className={styles.cardTitle}>{cap.title}</h3>
                <p className={styles.cardDesc}>{cap.description}</p>
                <div className={styles.cardAccentLine} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
