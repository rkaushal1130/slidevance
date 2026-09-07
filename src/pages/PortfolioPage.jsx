import React, { useState, useEffect, useMemo } from 'react';
import PortfolioHero from '../components/portfolio/PortfolioHero/PortfolioHero';
import FeaturedProject from '../components/portfolio/FeaturedProject/FeaturedProject';
import PortfolioFilter from '../components/portfolio/PortfolioFilter/PortfolioFilter';
import PortfolioGrid from '../components/portfolio/PortfolioGrid/PortfolioGrid';
import CaseStudyModal from '../components/portfolio/CaseStudyModal/CaseStudyModal';
import PortfolioCTA from '../components/portfolio/PortfolioCTA/PortfolioCTA';
import SectionHeading from '../components/common/SectionHeading/SectionHeading';

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  useEffect(() => {
    document.title = 'Slidevance Portfolio | Presentation & Business Communication';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "Explore Slidevance's presentation design, business communication, research and visual storytelling capabilities."
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content =
        "Explore Slidevance's presentation design, business communication, research and visual storytelling capabilities.";
      document.head.appendChild(metaDesc);
    }
  }, []);

  const categories = [
    'All',
    'Presentation Design',
    'Business Communication',
    'RFP & Proposals',
    'Data Storytelling',
    'Marketing Collateral',
    'Research'
  ];

  const allProjects = useMemo(() => [
    {
      number: '01',
      title: 'Investor Presentation & Capital Raise',
      category: 'Presentation Design',
      mockupType: 'investor',
      description:
        'Comprehensive investor deck transformation aligning financial traction, unit economics, and capital deployment strategy for institutional venture partners.',
      challenge:
        'Complex unit economics, recurring revenue milestones, and multi-tier market sizing were buried in disparate spreadsheet tabs, diluting the investment thesis during partner meetings.',
      approach:
        'Engineered an objective-first investor narrative, restructured financial graphs into clear comparative milestones, and built a high-conviction pitch deck system with standardized typography.',
      outcome:
        'Eliminated narrative friction across investor presentations, enabling executive leadership to present with unanimous clarity and confidence.',
      deliverables: ['Series B Pitch Deck', 'Financial Model Tearsheet', 'Executive Summary Deck']
    },
    {
      number: '02',
      title: 'Corporate Strategy & Executive Roadmap',
      category: 'Business Communication',
      mockupType: 'strategy',
      description:
        'High-stakes 3-year transformation roadmap and multi-stream operational matrix engineered for unanimous executive board alignment.',
      challenge:
        'Cross-department transformation priorities were fragmented across separate operational groups, leading to misaligned objectives during quarterly executive planning.',
      approach:
        'Synthesized disparate initiative streams into a cohesive Tri-Pillar Strategic Framework, translating complex dependencies into an intuitive boardroom deck.',
      outcome:
        'Secured immediate leadership consensus and unanimous board authorization to advance the 3-year transformation roadmap into execution.',
      deliverables: ['Board of Directors Deck', 'Strategic Pillar Framework', 'Executive Milestone Roadmap']
    },
    {
      number: '03',
      title: 'Enterprise RFP & Proposal Transformation',
      category: 'RFP & Proposals',
      mockupType: 'rfp',
      description:
        'Restructuring a multi-million dollar technical proposal into a compliant, visually compelling executive response that won enterprise procurement selection.',
      challenge:
        'A dense 140-page competitive bid risked compliance disqualification due to unformatted technical tables, convoluted architecture drawings, and weak visual hierarchy.',
      approach:
        'Re-engineered proposal document architecture, designed high-fidelity system diagrams, and built a color-coded compliance matrix highlighting verified enterprise criteria.',
      outcome:
        'Passed all technical procurement hurdles with top compliance marks and won competitive selection over incumbent enterprise vendors.',
      deliverables: ['Interactive RFP Response', 'Architecture Diagram Suite', 'Executive Briefing Book']
    },
    {
      number: '04',
      title: 'Market Intelligence & Competitor Matrix',
      category: 'Research',
      mockupType: 'research',
      description:
        'Deep competitive benchmarking and market intelligence landscape synthesized into an intuitive, board-ready strategic positioning report.',
      challenge:
        'Massive volumes of competitor pricing datasets, feature matrices, and market dynamics lacked executive synthesis, overwhelming strategic planners.',
      approach:
        'Distilled thousands of raw data points into clear competitive quadrant landscapes, structured moat comparisons, and strategic decision decks.',
      outcome:
        'Equipped leadership with clear, defensible market insight that informed executive product strategy and strategic positioning.',
      deliverables: ['Market Intelligence Report', 'Competitor Quadrant Analysis', 'Threat Assessment Brief']
    },
    {
      number: '05',
      title: 'Commercial Sales Enablement System',
      category: 'Marketing Collateral',
      mockupType: 'sales',
      description:
        'High-conversion field sales playbook, ROI calculation framework, and modular client pitch deck system for global enterprise revenue teams.',
      challenge:
        'A decentralized global commercial sales force was utilizing outdated, inconsistent presentation decks, resulting in extended sales cycles and message inconsistency.',
      approach:
        'Created a modular enterprise sales deck ecosystem with standardized ROI calculation slides, client value journeys, and customizable solution slides.',
      outcome:
        'Standardized sales execution across all regional teams and dramatically shortened enterprise proposal turnaround times.',
      deliverables: ['Enterprise Pitch Deck', 'Solution One-Pagers', 'Commercial Playbook System']
    },
    {
      number: '06',
      title: 'Executive One-Pager & Strategic Brief',
      category: 'Business Communication',
      mockupType: 'strategy',
      description:
        'Dense multi-department initiative condensed into a high-impact, single-page boardroom tearsheet designed for immediate C-suite comprehension.',
      challenge:
        'C-suite decision makers had zero time to review 40-page briefing binders before an urgent capital allocation committee meeting.',
      approach:
        'Distilled the core business logic, risk mitigations, and capital request into a precision-engineered, single-page visual tearsheet.',
      outcome:
        'Committee members reviewed and committed capital within the first 15 minutes of the session based on the executive brief.',
      deliverables: ['Executive Tearsheet', 'KPI Callout Card', 'Digital Executive Brief']
    },
    {
      number: '07',
      title: 'Quantitative Data Storytelling Framework',
      category: 'Data Storytelling',
      mockupType: 'data',
      description:
        'Translating millions of operational data points and econometrics into a clear, intuitive visual narrative for strategic investment decision-makers.',
      challenge:
        'Dense econometric models and volatile operational datasets confused non-technical stakeholders, creating hesitation around crucial investment decisions.',
      approach:
        'Designed custom vector curves, multi-stream comparative charts, and visual confidence bands to illuminate the underlying growth drivers.',
      outcome:
        'Stakeholders achieved instant intuitive grasp of the econometric model and approved the capital allocation program without hesitation.',
      deliverables: ['Econometric Trend Suite', 'Performance Analytics Deck', 'Quantitative Storyline']
    },
    {
      number: '08',
      title: 'Interactive Keynote & Global All-Hands',
      category: 'Presentation Design',
      mockupType: 'investor',
      description:
        'Executive keynote presentation combining high-contrast typography, interactive slide navigation, and custom motion principles for high-visibility summits.',
      challenge:
        'An executive keynote address at a major industry forum required presenting complex strategic visions in a high-production auditorium setting without losing audience engagement.',
      approach:
        'Architected a visually dramatic keynote deck featuring bold typography, cinematic data visualizations, and seamless narrative pacing.',
      outcome:
        'Delivered an authoritative stage presence that reinforced market leadership and generated widespread industry acclaim.',
      deliverables: ['Keynote Presentation System', 'Interactive Speaker Deck', 'Audience Executive Summary']
    },
    {
      number: '09',
      title: 'Enterprise Brand & Product Collateral Suite',
      category: 'Marketing Collateral',
      mockupType: 'sales',
      description:
        'Integrated suite of institutional marketing one-pagers, technical capability brochures, and digital collateral unified under executive visual standards.',
      challenge:
        'Inconsistent marketing collateral across digital channels and client meetings weakened the brand perception of a premier enterprise technology provider.',
      approach:
        'Engineered an enterprise-grade collateral system with unified typography, modular content grids, and high-fidelity vector illustrations.',
      outcome:
        'Elevated market perception and established a reusable, scalable library of collateral assets for enterprise marketing operations.',
      deliverables: ['Capability Brochure', 'Product Overview Tearsheets', 'Digital Field Collateral']
    }
  ], []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory, allProjects]);

  return (
    <main>
      {/* 1. Page Hero */}
      <PortfolioHero />

      {/* 2. Large Featured Project Showcase */}
      <FeaturedProject onOpenCaseStudy={setSelectedCaseStudy} />

      {/* 3. Portfolio Grid Section with Interactive Category Filters */}
      <section className="section-spacing" aria-label="Portfolio Gallery">
        <div className="container">
          <SectionHeading
            eyebrow="PORTFOLIO CATEGORIES"
            title="Explore Case Studies by Practice"
            subtitle="Filter by discipline to examine how narrative strategy and bespoke visual engineering solve specific business communication challenges."
            align="center"
          />

          {/* Interactive filter tabs */}
          <PortfolioFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Animated filtered grid */}
          <PortfolioGrid
            projects={filteredProjects}
            onOpenCaseStudy={setSelectedCaseStudy}
          />
        </div>
      </section>

      {/* 4. Process Call to Action */}
      <PortfolioCTA />

      {/* Interactive Case Study Detail Modal */}
      {selectedCaseStudy && (
        <CaseStudyModal
          project={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
        />
      )}
    </main>
  );
}
