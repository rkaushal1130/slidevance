import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Presentation, 
  FileText, 
  FileSpreadsheet, 
  BarChart2, 
  Briefcase, 
  Compass 
} from 'lucide-react';
import ServicesHero from '../components/services/ServicesHero/ServicesHero';
import ServicesStickyNav from '../components/services/ServicesStickyNav/ServicesStickyNav';
import ServiceDetailSection from '../components/services/ServiceDetailSection/ServiceDetailSection';
import DeliveryStandards from '../components/services/DeliveryStandards/DeliveryStandards';
import TurnaroundTable from '../components/services/TurnaroundTable/TurnaroundTable';
import EngagementModels from '../components/services/EngagementModels/EngagementModels';
import ServicesCTA from '../components/services/ServicesCTA/ServicesCTA';
import SkeletonCard from '../components/common/SkeletonCard/SkeletonCard';
import ErrorMessage from '../components/common/ErrorMessage/ErrorMessage';
import { getServices, getServiceBySlug } from '../api/services';
import { getIconComponent } from '../utils/iconMap';
import { getMockupType } from '../utils/mockupMap';

const ACCENT_COLORS = ['blue', 'cyan', 'magenta', 'orange'];

const FALLBACK_SERVICES = [
  {
    id: 'service-01',
    number: '01',
    slug: 'presentation-design-interactive-decks',
    icon: Presentation,
    accentColor: 'blue',
    tagline: 'EXECUTIVE PRESENTATIONS',
    title: 'Presentation Design & Interactive Decks',
    description:
      'Create high-impact executive presentations and interactive decks designed around the audience, objective and story.',
    deliverables: [
      'Pitch Decks & Fundraise Stories',
      'Executive & Board Presentations',
      'Dynamic Motion & Interactivity',
      'Enterprise Master Templates'
    ],
    mockupType: 'investor',
    reverse: false
  },
  {
    id: 'service-02',
    number: '02',
    slug: 'proposal-bid-rfp-engineering',
    icon: FileText,
    accentColor: 'cyan',
    tagline: 'STRATEGIC PURSUIT & TENDERS',
    title: 'Proposal, Bid & RFP Engineering',
    description:
      'Transform high-stakes enterprise proposals and complex bid responses into compliant, visually decisive tender submissions that win.',
    deliverables: [
      'Enterprise RFP & RFI Submissions',
      'Bids, Tenders & Competitive Pitches',
      'Executive Redesign'
    ],
    mockupType: 'rfp',
    reverse: true
  },
  {
    id: 'service-03',
    number: '03',
    slug: 'collateral-one-pagers-business-documents',
    icon: FileSpreadsheet,
    accentColor: 'magenta',
    tagline: 'BOARDROOM BRIEFS & TEARSHEETS',
    title: 'Collateral, One-Pagers & Business Documents',
    description:
      'Distill multifaceted corporate programs, financial metrics, and operational briefings into boardroom-ready executive documents and tearsheets.',
    deliverables: [
      'Executive One-Pagers',
      'Corporate Documents',
      'Whitepapers',
      'Executive Summaries',
      'Fact Sheets'
    ],
    mockupType: 'strategy',
    reverse: false
  },
  {
    id: 'service-04',
    number: '04',
    slug: 'bespoke-vectors-quantitative-data-storytelling',
    icon: BarChart2,
    accentColor: 'orange',
    tagline: 'QUANTITATIVE VISUAL SYSTEMS',
    title: 'Bespoke Vectors & Quantitative Data Storytelling',
    description:
      'Convert dense spreadsheets, financial modeling, and proprietary systems into intuitive, high-fidelity quantitative charts and vector diagrams.',
    deliverables: [
      'Custom Vector Iconography',
      'Process & Framework Mapping',
      'Financial & Data Visualization'
    ],
    mockupType: 'data',
    reverse: true
  },
  {
    id: 'service-05',
    number: '05',
    slug: 'sales-enablement-brochures-digital-collateral',
    icon: Briefcase,
    accentColor: 'blue',
    tagline: 'COMMERCIAL ENABLEMENT',
    title: 'Sales Enablement, Brochures & Digital Collateral',
    description:
      'Equip revenue organizations and commercial leaders with high-conversion field pitch decks, digital playbooks, and branded market collateral.',
    deliverables: [
      'Corporate & Product Brochures',
      'Visual Marketing Assets',
      'AI-Assisted Conceptual Renders'
    ],
    mockupType: 'sales',
    reverse: false
  },
  {
    id: 'service-06',
    number: '06',
    slug: 'strategic-research-market-intelligence',
    icon: Compass,
    accentColor: 'cyan',
    tagline: 'MARKET BENCHMARKING',
    title: 'Strategic Research & Market Intelligence',
    description:
      'Synthesize unstructured market data, competitive intelligence, and industry research into clear, actionable executive narrative decks.',
    deliverables: [
      'Competitor & Market Benchmarking',
      'Desk Research Synthesis',
      'Insight-to-Slide Structuring'
    ],
    mockupType: 'research',
    reverse: true
  }
];

function formatServices(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return FALLBACK_SERVICES;
  }
  return rawList.map((svc, index) => {
    let deliverables = [];
    if (Array.isArray(svc.items)) {
      deliverables = svc.items.map((it) => it.title || it.name || it);
    } else if (Array.isArray(svc.deliverables)) {
      deliverables = svc.deliverables;
    }

    if (deliverables.length === 0) {
      deliverables = ['Executive Presentations', 'Board Materials', 'Visual Systems'];
    }

    const serviceId = svc.slug || `service-${String(index + 1).padStart(2, '0')}`;

    return {
      id: serviceId,
      number: svc.number || String(index + 1).padStart(2, '0'),
      slug: svc.slug,
      icon: getIconComponent(svc.icon, Presentation),
      accentColor: ACCENT_COLORS[index % ACCENT_COLORS.length],
      tagline: svc.tagline || (svc.shortDescription ? svc.shortDescription.slice(0, 30).toUpperCase() : 'STUDIO PRACTICE'),
      title: svc.title,
      description: svc.description || svc.shortDescription,
      deliverables,
      mockupType: getMockupType(svc, index),
      reverse: index % 2 !== 0,
    };
  });
}

export default function ServicesPage() {
  const { slug } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Services | Slidevance';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore Slidevance presentation design, RFP engineering, business documents, data storytelling, sales enablement and market intelligence services.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content =
        'Explore Slidevance presentation design, RFP engineering, business documents, data storytelling, sales enablement and market intelligence services.';
      document.head.appendChild(metaDesc);
    }
  }, []);

  const loadServices = () => {
    setLoading(true);
    setError(null);
    getServices()
      .then((res) => {
        const rawList = res?.data || res || [];
        setServices(formatServices(rawList));
      })
      .catch((err) => {
        setError(err?.message || 'Unable to load services from server.');
        setServices(FALLBACK_SERVICES);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((res) => {
        if (!isMounted) return;
        const rawList = res?.data || res || [];
        setServices(formatServices(rawList));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Unable to load services from server.');
        setServices(FALLBACK_SERVICES);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Support service detail by slug
  useEffect(() => {
    if (!slug || loading) return;

    let targetEl = document.getElementById(slug);
    if (!targetEl) {
      const match = services.find((s) => s.slug === slug || s.id === slug);
      if (match) {
        targetEl = document.getElementById(match.id);
      }
    }

    if (targetEl) {
      setTimeout(() => {
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 100);
    } else {
      getServiceBySlug(slug).catch(() => {});
    }
  }, [slug, loading, services]);

  const navItems = useMemo(() => {
    return services.map((svc) => ({
      label: svc.title.split('&')[0].trim(),
      id: svc.id,
    }));
  }, [services]);

  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. Page Hero */}
      <ServicesHero />

      {/* 2. Sticky & Smooth-Scrolling Practice Navigation */}
      <ServicesStickyNav items={navItems} />

      {error && (
        <div className="container" style={{ marginTop: '2rem' }}>
          <ErrorMessage
            title="Notice"
            message={error}
            onRetry={loadServices}
            compact
          />
        </div>
      )}

      {/* 3. Detailed Service Sections */}
      {loading ? (
        <div className="container" style={{ padding: '4rem 2rem', display: 'grid', gap: '2rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} variant="service" />
          ))}
        </div>
      ) : (
        services.map((service) => (
          <ServiceDetailSection
            key={service.id}
            id={service.id}
            number={service.number}
            icon={service.icon}
            accentColor={service.accentColor}
            tagline={service.tagline}
            title={service.title}
            description={service.description}
            deliverables={service.deliverables}
            mockupType={service.mockupType}
            reverse={service.reverse}
          />
        ))
      )}

      {/* 4. Delivery Standards */}
      <DeliveryStandards />

      {/* 5. Turnaround & Urgency Support */}
      <TurnaroundTable />

      {/* 6. Investment & Flexible Engagement Models */}
      <EngagementModels />

      {/* 7. Final Call to Action */}
      <ServicesCTA />
    </main>
  );
}
