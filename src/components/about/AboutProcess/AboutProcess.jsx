import React from 'react';
import p1 from '../../../assets/about/process-01-discover.png';
import p2 from '../../../assets/about/process-02-structure.png';
import p3 from '../../../assets/about/process-03-design.png';
import p4 from '../../../assets/about/process-04-refine.png';
import p5 from '../../../assets/about/process-05-deliver.png';
import styles from './AboutProcess.module.css';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'DISCOVER',
    description: 'We understand your goals, audience and message.',
    img: p1,
    alt: 'Discover phase - brainstorm, goals and sticky notes'
  },
  {
    number: '02',
    title: 'STRUCTURE',
    description: 'We organize information into a clear story.',
    img: p2,
    alt: 'Structure phase - wireframing and information hierarchy'
  },
  {
    number: '03',
    title: 'DESIGN',
    description: 'We create visuals that bring your ideas to life.',
    img: p3,
    alt: 'Design phase - color palettes, visual concepts and styling'
  },
  {
    number: '04',
    title: 'REFINE',
    description: 'We perfect every detail—from typography to charts.',
    img: p4,
    alt: 'Refine phase - typography, data charts and pixel polish'
  },
  {
    number: '05',
    title: 'DELIVER',
    description: 'You get a powerful, ready-to-use document that works.',
    img: p5,
    alt: 'Deliver phase - final executive presentation deck'
  }
];

export default function AboutProcess() {
  return (
    <section id="our-process" className={styles.processSection} aria-label="Our Process">
      <div className={`container ${styles.container}`}>
        {/* Left Column: Heading & Explanation */}
        <div className={`${styles.introCol} reveal-on-scroll`}>
          <div className={styles.tagWrap}>
            <span className={styles.sectionTag}>OUR PROCESS</span>
            <span className={styles.tagLine} />
          </div>

          <h2 className={styles.heading}>
            From confusion<br />
            <span className={styles.clarityGradient}>to clarity.</span>
          </h2>

          <p className={styles.description}>
            Every project starts with scattered thoughts, raw data and endless information.
            Our job is to bring structure, create a visual language and turn it into something
            that makes sense — and makes an impact.
          </p>
        </div>

        {/* Right Column: 5 Process Cards */}
        <div className={`${styles.cardsCol} reveal-on-scroll`}>
          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <div className={styles.imageBox}>
                  <img
                    src={step.img}
                    alt={step.alt}
                    className={styles.stepImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
