import React from 'react';
import { Lightbulb, Layers, PenTool, Target, Rocket } from 'lucide-react';
import styles from './AboutDNA.module.css';

const VALUES = [
  {
    number: '01',
    numColor: 'num_cyan',
    icon: Lightbulb,
    title: 'THINK',
    description: 'We understand the message before touching the design.'
  },
  {
    number: '02',
    numColor: 'num_cyan',
    icon: Layers,
    title: 'STRUCTURE',
    description: 'We turn scattered information into a clear story.'
  },
  {
    number: '03',
    numColor: 'num_blue',
    icon: PenTool,
    title: 'DESIGN',
    description: 'We build visual systems around the idea.'
  },
  {
    number: '04',
    numColor: 'num_cyanBright',
    icon: Target,
    title: 'DETAIL',
    description: 'Every alignment, chart and pixel has a reason.'
  },
  {
    number: '05',
    numColor: 'num_pink',
    icon: Rocket,
    title: 'IMPACT',
    description: 'The final document doesn’t just look good. It works.'
  }
];

export default function AboutDNA() {
  return (
    <section id="our-dna" className={styles.dnaSection} aria-label="Our DNA and Values">
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.container}`}>
        {/* Left Column: Heading */}
        <div className={`${styles.introCol} reveal-on-scroll`}>
          <div className={styles.tagWrap}>
            <span className={styles.sectionTag}>OUR DNA</span>
            <span className={styles.tagLine} />
          </div>

          <h2 className={styles.heading}>
            Five values.<br />
            <span className={styles.visionGradient}>One vision.</span>
          </h2>

          <p className={styles.subtitle}>
            These aren’t just values — they’re how we think, work and create every project.
          </p>
        </div>

        {/* Right Column: 5 Values */}
        <div className={`${styles.valuesCol} reveal-on-scroll`}>
          <div className={styles.valuesGrid}>
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.number} className={styles.valueItem}>
                  <span className={`${styles.valNumber} ${styles[val.numColor]}`}>
                    {val.number}
                  </span>
                  <div className={styles.iconBox}>
                    <Icon size={22} className={styles.valIcon} />
                  </div>
                  <h3 className={styles.valTitle}>{val.title}</h3>
                  <p className={styles.valDesc}>{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
