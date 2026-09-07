import React from 'react';
import { Presentation, FileText, FileSpreadsheet, BarChart2, Briefcase, Compass, ArrowRight } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import Button from '../../common/Button/Button';
import ServiceCard from './ServiceCard';
import styles from './ServicesPreview.module.css';

export default function ServicesPreview() {
  const services = [
    {
      number: '01',
      icon: Presentation,
      title: 'Presentation Design & Interactive Decks',
      description:
        'Bespoke keynote decks, board presentations, investor pitches, and executive slide systems built to command attention and drive decisive outcomes.',
      to: '/services#presentation-design'
    },
    {
      number: '02',
      icon: FileText,
      title: 'Proposal, Bid & RFP Engineering',
      description:
        'Multi-million dollar RFP responses, strategic proposals, and competitive bids structured for technical compliance and compelling visual differentiation.',
      to: '/services#proposal-rfp'
    },
    {
      number: '03',
      icon: FileSpreadsheet,
      title: 'Collateral, One-Pagers & Business Documents',
      description:
        'Executive summaries, boardroom briefs, tearsheets, and policy overviews engineered with rigorous visual hierarchy for immediate comprehension.',
      to: '/services#collateral-one-pagers'
    },
    {
      number: '04',
      icon: BarChart2,
      title: 'Bespoke Vectors & Quantitative Data Storytelling',
      description:
        'Complex proprietary frameworks, econometric charts, and system architecture diagrams rendered into high-fidelity, intuitive visual logic.',
      to: '/services#data-storytelling'
    },
    {
      number: '05',
      icon: Briefcase,
      title: 'Sales Enablement, Brochures & Digital Collateral',
      description:
        'High-conversion enterprise sales decks, commercial playbooks, and branded collateral that equip global revenue teams to win.',
      to: '/services#sales-enablement'
    },
    {
      number: '06',
      icon: Compass,
      title: 'Strategic Research & Market Intelligence',
      description:
        'Industry benchmarking, competitive landscapes, and quantitative insights synthesized into structured, board-level narrative decks.',
      to: '/services#strategic-research'
    },
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Services Preview">
      <div className="container">
        <SectionHeading
          eyebrow="CAPABILITIES &amp; SPECIALIZATIONS"
          title="What We Do"
          subtitle="End-to-End Visual Communication, Narrative Strategy & Intelligent Design."
          align="center"
          maxWidth="760px"
        />

        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard
              key={service.number}
              number={service.number}
              icon={service.icon}
              title={service.title}
              description={service.description}
              to={service.to}
            />
          ))}
        </div>

        {/* View All Services Footer CTA */}
        <div className={styles.footerCta}>
          <Button
            to="/services"
            variant="secondary"
            size="lg"
            icon={<ArrowRight size={18} />}
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
