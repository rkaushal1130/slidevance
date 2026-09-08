import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Cpu, 
  TrendingUp, 
  Briefcase, 
  Activity, 
  Building2, 
  Building, 
  Rocket, 
  PieChart 
} from 'lucide-react';
import IndustriesHero from '../components/industries/IndustriesHero/IndustriesHero';
import IndustryGrid from '../components/industries/IndustryGrid/IndustryGrid';
import IndustryDetail from '../components/industries/IndustryDetail/IndustryDetail';
import CommunicationTypes from '../components/industries/CommunicationTypes/CommunicationTypes';
import IndustriesVisualSection from '../components/industries/IndustriesVisualSection/IndustriesVisualSection';
import IndustriesCTA from '../components/industries/IndustriesCTA/IndustriesCTA';
import ErrorMessage from '../components/common/ErrorMessage/ErrorMessage';
import { getIndustries, getIndustryBySlug } from '../api/industries';
import { getIconComponent } from '../utils/iconMap';

const ACCENT_COLORS = ['blue', 'cyan', 'magenta', 'orange'];

const FALLBACK_INDUSTRIES = [
  {
    number: '01',
    name: 'Technology & SaaS',
    slug: 'technology-saas',
    icon: Cpu,
    accentColor: 'blue',
    description: 'Translating multi-layered technical architectures, platform capabilities, and software unit economics into clear executive value propositions.',
    challenges: 'Complex products, multi-tier technical architectures, data-heavy communication, and abstract software workflows.',
    capabilities: ['Presentation Design', 'Data Storytelling', 'Sales Enablement', 'Research']
  },
  {
    number: '02',
    name: 'Financial Services',
    slug: 'financial-services',
    icon: TrendingUp,
    accentColor: 'cyan',
    description: 'Communicating intricate risk models, quantitative performance metrics, and complex transaction structures with institutional rigor.',
    challenges: 'Volatile financial datasets, regulatory compliance disclosures, multi-asset reporting, and dense quantitative modeling.',
    capabilities: ['Quantitative Data Storytelling', 'Executive Decks', 'Board Briefs', 'RFP Engineering']
  },
  {
    number: '03',
    name: 'Consulting & Professional Services',
    slug: 'consulting-professional-services',
    icon: Briefcase,
    accentColor: 'magenta',
    description: 'Structuring strategic recommendations, transformation methodologies, and high-impact client deliverable systems that drive client conviction.',
    challenges: 'Abstract consulting frameworks, multi-workstream governance, dense diagnostic findings, and tight client turnaround deadlines.',
    capabilities: ['Bespoke Vectors', 'Proposal & RFP Engineering', 'Executive One-Pagers', 'Strategic Narrative']
  },
  {
    number: '04',
    name: 'Healthcare & Life Sciences',
    slug: 'healthcare-life-sciences',
    icon: Activity,
    accentColor: 'orange',
    description: 'Distilling scientific methodologies, clinical trial metrics, and commercial regulatory pathways into compelling visual narratives for partners.',
    challenges: 'Complex clinical datasets, specialized medical terminology, multi-phase trial timelines, and diverse evaluation panels.',
    capabilities: ['Data Storytelling', 'Presentation Design', 'Executive Summaries', 'Strategic Research']
  },
  {
    number: '05',
    name: 'Real Estate & Infrastructure',
    slug: 'real-estate-infrastructure',
    icon: Building2,
    accentColor: 'blue',
    description: 'Presenting large-scale capital development proposals, multi-property asset portfolios, and infrastructure financing models with spatial clarity.',
    challenges: 'Multi-year capital expenditure schedules, complex asset portfolios, municipal zoning approvals, and syndicated funding structures.',
    capabilities: ['Interactive Decks', 'Proposal Engineering', 'Collateral & Brochures', 'Bespoke Vectors']
  },
  {
    number: '06',
    name: 'Enterprise & Corporate',
    slug: 'enterprise-corporate',
    icon: Building,
    accentColor: 'cyan',
    description: 'Unifying global internal communications, leadership summit presentations, and company-wide strategic programs under executive design standards.',
    challenges: 'Disparate global business units, cross-functional organizational misalignment, and high-stakes board governance scrutiny.',
    capabilities: ['Executive Presentations', 'Corporate Collateral', 'Turnkey Design Files', 'Sales Enablement']
  },
  {
    number: '07',
    name: 'Startups & Growth Companies',
    slug: 'startups-growth-companies',
    icon: Rocket,
    accentColor: 'magenta',
    description: 'Engineering high-conviction investor pitch decks, market entry narratives, and commercial traction assets engineered for rapid venture scale.',
    challenges: 'Brief investor attention spans, establishing market category definition, proving competitive moat durability, and urgent funding rounds.',
    capabilities: ['Pitch Deck Design', 'Market Intelligence', 'Executive One-Pagers', 'Rapid 24/7 Agility']
  },
  {
    number: '08',
    name: 'Investment & Private Equity',
    slug: 'investment-private-equity',
    icon: PieChart,
    accentColor: 'orange',
    description: 'Packaging investment memorandums, fund performance updates, and thesis presentations built for investment committees and institutional LPs.',
    challenges: 'Complex capital stacks, portfolio company reporting harmonization, and confidential investment committee reviews.',
    capabilities: ['Boardroom Deliverables', 'Quantitative Data Storytelling', 'Tearsheets & Briefs', 'Strict Confidentiality']
  }
];

function formatIndustries(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return FALLBACK_INDUSTRIES;
  }
  return rawList.map((ind, index) => {
    let caps = ind.capabilities;
    if (typeof caps === 'string') {
      try {
        caps = JSON.parse(caps);
      } catch {
        caps = caps.split(',').map((c) => c.trim());
      }
    }
    if (!Array.isArray(caps)) {
      caps = ['Presentation Design', 'Data Storytelling', 'Executive Decks'];
    }

    return {
      id: ind.id || ind.slug,
      number: ind.number || String(index + 1).padStart(2, '0'),
      name: ind.name || ind.title,
      slug: ind.slug,
      icon: getIconComponent(ind.icon, Cpu),
      accentColor: ACCENT_COLORS[index % ACCENT_COLORS.length],
      description: ind.description,
      challenges: ind.challenges || 'Complex domain requirements, multi-tier architectures, and high-stakes executive decisions.',
      capabilities: caps,
    };
  });
}

export default function IndustriesPage() {
  const { slug } = useParams();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Industries | Slidevance';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore how Slidevance approaches complex business communication across technology, finance, consulting, enterprise and other business environments.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content =
        'Explore how Slidevance approaches complex business communication across technology, finance, consulting, enterprise and other business environments.';
      document.head.appendChild(metaDesc);
    }
  }, []);

  const loadIndustries = () => {
    setLoading(true);
    setError(null);
    getIndustries()
      .then((res) => {
        const rawList = res?.data || res || [];
        setIndustries(formatIndustries(rawList));
      })
      .catch((err) => {
        setError(err?.message || 'Unable to load industries from server.');
        setIndustries(FALLBACK_INDUSTRIES);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getIndustries()
      .then((res) => {
        if (!isMounted) return;
        const rawList = res?.data || res || [];
        setIndustries(formatIndustries(rawList));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Unable to load industries from server.');
        setIndustries(FALLBACK_INDUSTRIES);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Support industry detail by slug
  useEffect(() => {
    if (!slug || loading) return;

    let targetEl = document.getElementById(`industry-${slug}`);
    if (!targetEl) {
      const match = industries.find((i) => i.slug === slug);
      if (match) {
        targetEl = document.getElementById(`industry-${match.number}`);
      }
    }

    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      getIndustryBySlug(slug).catch(() => {});
    }
  }, [slug, loading, industries]);

  const handleSelectIndustry = (ind) => {
    const el = document.getElementById(`industry-${ind.number}`) || document.getElementById(`industry-${ind.slug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (ind.slug) {
        window.history.replaceState(null, '', `/industries/${encodeURIComponent(ind.slug)}`);
      }
    }
  };

  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. Page Hero */}
      <IndustriesHero />

      {error && (
        <div className="container" style={{ marginTop: '1.5rem' }}>
          <ErrorMessage
            title="Notice"
            message={error}
            onRetry={loadIndustries}
            compact
          />
        </div>
      )}

      {/* 2. Industry Grid with Loading Support */}
      <IndustryGrid
        industries={industries}
        loading={loading}
        onSelectIndustry={handleSelectIndustry}
      />

      {/* 3. Industry Detail Section */}
      {!loading && industries.length > 0 && (
        <IndustryDetail industries={industries} />
      )}

      {/* 4. Communication Types Section */}
      <CommunicationTypes />

      {/* 5. Dark Navy Visual Section */}
      <IndustriesVisualSection />

      {/* 6. Call to Action */}
      <IndustriesCTA />
    </main>
  );
}
