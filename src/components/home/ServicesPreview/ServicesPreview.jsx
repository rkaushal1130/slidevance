import React, { useState, useEffect } from 'react';
import { Presentation, ArrowRight } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import Button from '../../common/Button/Button';
import SkeletonCard from '../../common/SkeletonCard/SkeletonCard';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';
import ServiceCard from './ServiceCard';
import { getServices } from '../../../api/services';
import { getIconComponent } from '../../../utils/iconMap';
import styles from './ServicesPreview.module.css';

const DEFAULT_SERVICES = [
  {
    number: '01',
    icon: 'Presentation',
    title: 'Presentation Design & Interactive Decks',
    description:
      'Bespoke keynote decks, board presentations, investor pitches, and executive slide systems built to command attention and drive decisive outcomes.',
    to: '/services#presentation-design-interactive-decks'
  },
  {
    number: '02',
    icon: 'FileText',
    title: 'Proposal, Bid & RFP Engineering',
    description:
      'Multi-million dollar RFP responses, strategic proposals, and competitive bids structured for technical compliance and compelling visual differentiation.',
    to: '/services#proposal-bid-rfp-engineering'
  },
  {
    number: '03',
    icon: 'FileSpreadsheet',
    title: 'Collateral, One-Pagers & Business Documents',
    description:
      'Executive summaries, boardroom briefs, tearsheets, and policy overviews engineered with rigorous visual hierarchy for immediate comprehension.',
    to: '/services#collateral-one-pagers-business-documents'
  },
  {
    number: '04',
    icon: 'BarChart2',
    title: 'Bespoke Vectors & Quantitative Data Storytelling',
    description:
      'Complex proprietary frameworks, econometric charts, and system architecture diagrams rendered into high-fidelity, intuitive visual logic.',
    to: '/services#bespoke-vectors-quantitative-data-storytelling'
  },
  {
    number: '05',
    icon: 'Briefcase',
    title: 'Sales Enablement, Brochures & Digital Collateral',
    description:
      'High-conversion enterprise sales decks, commercial playbooks, and branded collateral that equip global revenue teams to win.',
    to: '/services#sales-enablement-brochures-digital-collateral'
  },
  {
    number: '06',
    icon: 'Compass',
    title: 'Strategic Research & Market Intelligence',
    description:
      'Industry benchmarking, competitive landscapes, and quantitative insights synthesized into structured, board-level narrative decks.',
    to: '/services#strategic-research-market-intelligence'
  },
];

function formatServicesData(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return DEFAULT_SERVICES.map((s) => ({
      ...s,
      icon: getIconComponent(s.icon, Presentation),
    }));
  }
  return rawList.map((svc, index) => ({
    id: svc.id || svc.slug,
    number: svc.number || String(index + 1).padStart(2, '0'),
    icon: getIconComponent(svc.icon, Presentation),
    title: svc.title,
    description: svc.shortDescription || svc.description,
    to: `/services#${svc.slug || 'service-' + String(index + 1).padStart(2, '0')}`,
  }));
}

export default function ServicesPreview() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = () => {
    setLoading(true);
    setError(null);
    getServices()
      .then((response) => {
        const rawList = response?.data || response || [];
        setServices(formatServicesData(rawList));
      })
      .catch((err) => {
        setError(err?.message || 'Unable to load services at this time.');
        setServices(formatServicesData([]));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((response) => {
        if (!isMounted) return;
        const rawList = response?.data || response || [];
        setServices(formatServicesData(rawList));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Unable to load services at this time.');
        setServices(formatServicesData([]));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Services Preview">
      <div className="container">
        <SectionHeading
          eyebrow="CAPABILITIES &amp; SPECIALIZATIONS"
          title="What We Do"
          subtitle="End-to-End Visual Communication, Narrative Strategy &amp; Intelligent Design."
          align="center"
          maxWidth="760px"
        />

        {error && (
          <ErrorMessage
            title="Notice"
            message={error}
            onRetry={loadServices}
            compact
          />
        )}

        <div className={styles.servicesGrid}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="service" />
            ))
          ) : (
            services.map((service) => (
              <ServiceCard
                key={service.number || service.title}
                number={service.number}
                icon={service.icon}
                title={service.title}
                description={service.description}
                to={service.to}
              />
            ))
          )}
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
