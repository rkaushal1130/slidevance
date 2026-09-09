import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortfolioHero from '../components/portfolio/PortfolioHero/PortfolioHero';
import FeaturedProject from '../components/portfolio/FeaturedProject/FeaturedProject';
import PortfolioFilter from '../components/portfolio/PortfolioFilter/PortfolioFilter';
import PortfolioGrid from '../components/portfolio/PortfolioGrid/PortfolioGrid';
import CaseStudyModal from '../components/portfolio/CaseStudyModal/CaseStudyModal';
import PortfolioCTA from '../components/portfolio/PortfolioCTA/PortfolioCTA';
import SectionHeading from '../components/common/SectionHeading/SectionHeading';
import SkeletonCard from '../components/common/SkeletonCard/SkeletonCard';
import ErrorMessage from '../components/common/ErrorMessage/ErrorMessage';
import { getPortfolio, getPortfolioBySlug } from '../api/portfolio';
import { getMockupType } from '../utils/mockupMap';

const FALLBACK_PROJECTS = [
  {
    number: '01',
    title: 'Investor Presentation & Capital Raise',
    slug: 'investor-presentation-capital-raise',
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
    deliverables: ['Series B Pitch Deck', 'Financial Model Tearsheet', 'Executive Summary Deck'],
    featured: true
  },
  {
    number: '02',
    title: 'Corporate Strategy & Executive Roadmap',
    slug: 'corporate-strategy-executive-roadmap',
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
    deliverables: ['Board of Directors Deck', 'Strategic Pillar Framework', 'Executive Milestone Roadmap'],
    featured: true
  },
  {
    number: '03',
    title: 'Enterprise RFP & Proposal Transformation',
    slug: 'enterprise-rfp-proposal-transformation',
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
    deliverables: ['Interactive RFP Response', 'Architecture Diagram Suite', 'Executive Briefing Book'],
    featured: false
  },
  {
    number: '04',
    title: 'Market Intelligence & Competitor Matrix',
    slug: 'market-intelligence-competitor-matrix',
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
    deliverables: ['Market Intelligence Report', 'Competitor Quadrant Analysis', 'Threat Assessment Brief'],
    featured: false
  },
  {
    number: '05',
    title: 'Commercial Sales Enablement System',
    slug: 'commercial-sales-enablement-system',
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
    deliverables: ['Enterprise Pitch Deck', 'Solution One-Pagers', 'Commercial Playbook System'],
    featured: false
  },
  {
    number: '06',
    title: 'Executive One-Pager & Strategic Brief',
    slug: 'executive-one-pager-strategic-brief',
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
    deliverables: ['Executive Tearsheet', 'KPI Callout Card', 'Digital Executive Brief'],
    featured: false
  },
  {
    number: '07',
    title: 'Quantitative Data Storytelling Framework',
    slug: 'quantitative-data-storytelling-framework',
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
    deliverables: ['Econometric Trend Suite', 'Performance Analytics Deck', 'Quantitative Storyline'],
    featured: false
  },
  {
    number: '08',
    title: 'Interactive Keynote & Global All-Hands',
    slug: 'interactive-keynote-global-all-hands',
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
    deliverables: ['Keynote Presentation System', 'Interactive Speaker Deck', 'Audience Executive Summary'],
    featured: false
  },
  {
    number: '09',
    title: 'Enterprise Brand & Product Collateral Suite',
    slug: 'enterprise-brand-product-collateral-suite',
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
    deliverables: ['Capability Brochure', 'Product Overview Tearsheets', 'Digital Field Collateral'],
    featured: false
  }
];

function formatProjects(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return FALLBACK_PROJECTS;
  }
  return rawList.map((p, index) => ({
    id: p.id || p.slug,
    number: p.number || String(index + 1).padStart(2, '0'),
    title: p.title,
    slug: p.slug,
    category: p.category || 'Presentation Design',
    mockupType: getMockupType(p, index),
    description: p.description || p.shortDescription,
    challenge: p.challenge,
    approach: p.approach,
    outcome: p.outcome,
    deliverables: Array.isArray(p.deliverables)
      ? p.deliverables
      : ['Executive Board Deck', 'Visual Frameworks', 'Strategic Summary'],
    featured: Boolean(p.featured),
  }));
}

export default function PortfolioPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const categories = useMemo(() => [
    'All',
    'Presentation Design',
    'Business Communication',
    'RFP & Proposals',
    'Data Storytelling',
    'Marketing Collateral',
    'Research'
  ], []);

  const loadProjects = () => {
    setLoading(true);
    setError(null);
    getPortfolio()
      .then((res) => {
        const rawList = res?.data || res || [];
        setProjects(formatProjects(rawList));
      })
      .catch((err) => {
        setError(err?.message || 'Unable to connect to portfolio service.');
        setProjects(FALLBACK_PROJECTS);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getPortfolio()
      .then((res) => {
        if (!isMounted) return;
        const rawList = res?.data || res || [];
        setProjects(formatProjects(rawList));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Unable to connect to portfolio service.');
        setProjects(FALLBACK_PROJECTS);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [fetchedSlugProject, setFetchedSlugProject] = useState(null);

  // Support project detail by slug when not in loaded list
  useEffect(() => {
    if (!slug) return;
    const existing = projects.find((p) => p.slug === slug);
    if (existing) return;

    let isCancelled = false;
    getPortfolioBySlug(slug)
      .then((res) => {
        const p = res?.data || res;
        if (p && !isCancelled) {
          const formatted = formatProjects([p]);
          setFetchedSlugProject(formatted[0] || null);
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [slug, projects]);

  const activeCaseStudy = useMemo(() => {
    if (selectedCaseStudy) return selectedCaseStudy;
    if (slug) {
      return projects.find((p) => p.slug === slug) || fetchedSlugProject || null;
    }
    return null;
  }, [selectedCaseStudy, slug, projects, fetchedSlugProject]);

  const handleOpenCaseStudy = (project) => {
    setSelectedCaseStudy(project);
    if (project?.slug) {
      window.history.replaceState(null, '', `/portfolio/${encodeURIComponent(project.slug)}`);
    }
  };

  const handleCloseCaseStudy = () => {
    setSelectedCaseStudy(null);
    setFetchedSlugProject(null);
    if (slug) {
      navigate('/portfolio', { replace: true });
    } else {
      window.history.replaceState(null, '', '/portfolio');
    }
  };

  // Find featured project from loaded projects
  const featuredProject = useMemo(() => {
    return projects.find((p) => p.featured) || projects[0] || null;
  }, [projects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory, projects]);

  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. Page Hero */}
      <PortfolioHero />

      {/* 2. Large Featured Project Showcase */}
      <FeaturedProject
        project={featuredProject}
        onOpenCaseStudy={handleOpenCaseStudy}
      />

      {/* 3. Portfolio Grid Section with Interactive Category Filters */}
      <section className="section-spacing" aria-label="Portfolio Gallery">
        <div className="container">
          <SectionHeading
            title="Explore Case Studies by Practice"
            subtitle="Filter by discipline to examine how narrative strategy and bespoke visual engineering solve specific business communication challenges."
            align="center"
          />

          {error && (
            <ErrorMessage
              title="Notice"
              message={error}
              onRetry={loadProjects}
              compact
            />
          )}

          {/* Interactive filter tabs */}
          <PortfolioFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Animated filtered grid or Skeletons */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} variant="portfolio" />
              ))}
            </div>
          ) : (
            <PortfolioGrid
              projects={filteredProjects}
              onOpenCaseStudy={handleOpenCaseStudy}
            />
          )}
        </div>
      </section>

      {/* 4. Process Call to Action */}
      <PortfolioCTA />

      {/* Interactive Case Study Detail Modal */}
      {activeCaseStudy && (
        <CaseStudyModal
          project={activeCaseStudy}
          onClose={handleCloseCaseStudy}
        />
      )}
    </main>
  );
}
