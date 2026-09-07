import React, { useEffect, useMemo } from 'react';
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

export default function IndustriesPage() {
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

  const industries = useMemo(() => [
    {
      number: '01',
      name: 'Technology & SaaS',
      icon: Cpu,
      accentColor: 'blue',
      description: 'Translating multi-layered technical architectures, platform capabilities, and software unit economics into clear executive value propositions.',
      challenges: 'Complex products, multi-tier technical architectures, data-heavy communication, and abstract software workflows.',
      capabilities: ['Presentation Design', 'Data Storytelling', 'Sales Enablement', 'Research']
    },
    {
      number: '02',
      name: 'Financial Services',
      icon: TrendingUp,
      accentColor: 'cyan',
      description: 'Communicating intricate risk models, quantitative performance metrics, and complex transaction structures with institutional rigor.',
      challenges: 'Volatile financial datasets, regulatory compliance disclosures, multi-asset reporting, and dense quantitative modeling.',
      capabilities: ['Quantitative Data Storytelling', 'Executive Decks', 'Board Briefs', 'RFP Engineering']
    },
    {
      number: '03',
      name: 'Consulting & Professional Services',
      icon: Briefcase,
      accentColor: 'magenta',
      description: 'Structuring strategic recommendations, transformation methodologies, and high-impact client deliverable systems that drive client conviction.',
      challenges: 'Abstract consulting frameworks, multi-workstream governance, dense diagnostic findings, and tight client turnaround deadlines.',
      capabilities: ['Bespoke Vectors', 'Proposal & RFP Engineering', 'Executive One-Pagers', 'Strategic Narrative']
    },
    {
      number: '04',
      name: 'Healthcare & Life Sciences',
      icon: Activity,
      accentColor: 'orange',
      description: 'Distilling scientific methodologies, clinical trial metrics, and commercial regulatory pathways into compelling visual narratives for partners.',
      challenges: 'Complex clinical datasets, specialized medical terminology, multi-phase trial timelines, and diverse evaluation panels.',
      capabilities: ['Data Storytelling', 'Presentation Design', 'Executive Summaries', 'Strategic Research']
    },
    {
      number: '05',
      name: 'Real Estate & Infrastructure',
      icon: Building2,
      accentColor: 'blue',
      description: 'Presenting large-scale capital development proposals, multi-property asset portfolios, and infrastructure financing models with spatial clarity.',
      challenges: 'Multi-year capital expenditure schedules, complex asset portfolios, municipal zoning approvals, and syndicated funding structures.',
      capabilities: ['Interactive Decks', 'Proposal Engineering', 'Collateral & Brochures', 'Bespoke Vectors']
    },
    {
      number: '06',
      name: 'Enterprise & Corporate',
      icon: Building,
      accentColor: 'cyan',
      description: 'Unifying global internal communications, leadership summit presentations, and company-wide strategic programs under executive design standards.',
      challenges: 'Disparate global business units, cross-functional organizational misalignment, and high-stakes board governance scrutiny.',
      capabilities: ['Executive Presentations', 'Corporate Collateral', 'Turnkey Design Files', 'Sales Enablement']
    },
    {
      number: '07',
      name: 'Startups & Growth Companies',
      icon: Rocket,
      accentColor: 'magenta',
      description: 'Engineering high-conviction investor pitch decks, market entry narratives, and commercial traction assets engineered for rapid venture scale.',
      challenges: 'Brief investor attention spans, establishing market category definition, proving competitive moat durability, and urgent funding rounds.',
      capabilities: ['Pitch Deck Design', 'Market Intelligence', 'Executive One-Pagers', 'Rapid 24/7 Agility']
    },
    {
      number: '08',
      name: 'Investment & Private Equity',
      icon: PieChart,
      accentColor: 'orange',
      description: 'Packaging investment memorandums, fund performance updates, and thesis presentations built for investment committees and institutional LPs.',
      challenges: 'Complex capital stacks, portfolio company reporting harmonization, and confidential investment committee reviews.',
      capabilities: ['Boardroom Deliverables', 'Quantitative Data Storytelling', 'Tearsheets & Briefs', 'Strict Confidentiality']
    }
  ], []);

  const handleSelectIndustry = (ind) => {
    const el = document.getElementById(`industry-${ind.number}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main>
      {/* 1. Page Hero */}
      <IndustriesHero />

      {/* 2. 8-Industry Grid (Desktop 4-col, Tablet 2-col, Mobile 1-col) */}
      <IndustryGrid
        industries={industries}
        onSelectIndustry={handleSelectIndustry}
      />

      {/* 3. Industry Detail Section with Reusable IndustrySection */}
      <IndustryDetail industries={industries} />

      {/* 4. Communication Types Section (6 Cards) */}
      <CommunicationTypes />

      {/* 5. Dark Navy Visual Section with Geometric Visual */}
      <IndustriesVisualSection />

      {/* 6. Call to Action */}
      <IndustriesCTA />
    </main>
  );
}
