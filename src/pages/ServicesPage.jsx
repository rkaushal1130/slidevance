import React, { useEffect, useMemo } from 'react';
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

export default function ServicesPage() {
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

  const servicesData = useMemo(() => [
    {
      id: 'service-01',
      number: '01',
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
  ], []);

  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. Page Hero */}
      <ServicesHero />

      {/* 2. Sticky & Smooth-Scrolling Practice Navigation */}
      <ServicesStickyNav />

      {/* 3. Six Editorial Detailed Service Sections */}
      {servicesData.map((service) => (
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
      ))}

      {/* 4. Delivery Standards (4 Cards) */}
      <DeliveryStandards />

      {/* 5. Turnaround & Urgency Support (Interactive Table & Mobile Cards) */}
      <TurnaroundTable />

      {/* 6. Investment & Flexible Engagement Models */}
      <EngagementModels />

      {/* 7. Final Call to Action */}
      <ServicesCTA />
    </main>
  );
}
