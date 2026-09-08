import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Slidevance database seeding...');

  // ==================================================
  // 1. ADMIN USER (From environment variables)
  // ==================================================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@slidevance.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const adminName = process.env.ADMIN_NAME || 'Slidevance Administrator';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: {
      name: adminName,
      passwordHash,
      isActive: true,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail.toLowerCase().trim(),
      passwordHash,
      name: adminName,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email} (Role: ${admin.role})`);

  // ==================================================
  // 2. SLIDEVANCE SERVICES & DELIVERABLES
  // ==================================================
  const servicesData = [
    {
      number: '01',
      title: 'Presentation Design & Interactive Decks',
      slug: 'presentation-design-interactive-decks',
      shortDescription:
        'Create high-impact executive presentations and interactive decks designed around the audience, objective and story.',
      description:
        'Create high-impact executive presentations and interactive decks designed around the audience, objective and story. We build narrative structures, investor pitches, board materials, and master design templates tailored for executive conviction.',
      icon: 'Presentation',
      sortOrder: 1,
      items: [
        {
          title: 'Pitch Decks & Fundraise Stories',
          description:
            'Narrative-driven Series A through C funding presentations engineered for venture capitalists and institutional allocators.',
          sortOrder: 1,
        },
        {
          title: 'Executive & Board Presentations',
          description:
            'Confidential board of directors reviews, AGM presentations, and C-suite strategy alignment decks.',
          sortOrder: 2,
        },
        {
          title: 'Dynamic Motion & Interactivity',
          description:
            'Hyperlinked click-through prototypes, animated state transitions, and interactive digital navigation structures.',
          sortOrder: 3,
        },
        {
          title: 'Enterprise Master Templates',
          description:
            'Bespoke, brand-compliant theme systems and typography guidelines built for corporate PowerPoint and Keynote fleets.',
          sortOrder: 4,
        },
      ],
    },
    {
      number: '02',
      title: 'Proposal, Bid & RFP Engineering',
      slug: 'proposal-bid-rfp-engineering',
      shortDescription:
        'Transform high-stakes enterprise proposals and complex bid responses into compliant, visually decisive tender submissions that win.',
      description:
        'Transform high-stakes enterprise proposals and complex bid responses into compliant, visually decisive tender submissions that win. We navigate stringent matrix compliance, multi-vendor differentiators, and procurement evaluation scorecards.',
      icon: 'FileText',
      sortOrder: 2,
      items: [
        {
          title: 'Enterprise RFP & RFI Submissions',
          description:
            'Fully compliant commercial bid responses structured for government, enterprise, and corporate procurement scorecards.',
          sortOrder: 1,
        },
        {
          title: 'Bids, Tenders & Competitive Pitches',
          description:
            'Strategic bid collateral and visual differentiators highlighting solution durability and cost efficiency.',
          sortOrder: 2,
        },
        {
          title: 'Executive Redesign',
          description:
            'Complete visual overhaul of dense legal and technical specifications into accessible visual communication.',
          sortOrder: 3,
        },
      ],
    },
    {
      number: '03',
      title: 'Collateral, One-Pagers & Business Documents',
      slug: 'collateral-one-pagers-business-documents',
      shortDescription:
        'Distill multifaceted corporate programs, financial metrics, and operational briefings into boardroom-ready executive documents and tearsheets.',
      description:
        'Distill multifaceted corporate programs, financial metrics, and operational briefings into boardroom-ready executive documents and tearsheets. Formats include printed briefings, landscape tearsheets, and executive leave-behinds.',
      icon: 'FileSpreadsheet',
      sortOrder: 3,
      items: [
        {
          title: 'Executive One-Pagers',
          description:
            'Single-sheet summaries designed to convey complex business models and strategic initiatives instantly.',
          sortOrder: 1,
        },
        {
          title: 'Corporate Documents',
          description:
            'Formatted reports, governance memos, and operational manuals maintaining strict institutional typography.',
          sortOrder: 2,
        },
        {
          title: 'Whitepapers',
          description:
            'Authoritative research-based publications blending technical substance with publication-grade editorial layouts.',
          sortOrder: 3,
        },
        {
          title: 'Executive Summaries & Fact Sheets',
          description:
            'Concise balance-sheet summaries and high-density performance snapshots for stakeholders and committees.',
          sortOrder: 4,
        },
      ],
    },
    {
      number: '04',
      title: 'Bespoke Vectors & Quantitative Data Storytelling',
      slug: 'bespoke-vectors-quantitative-data-storytelling',
      shortDescription:
        'Convert dense spreadsheets, financial modeling, and proprietary systems into intuitive, high-fidelity quantitative charts and vector diagrams.',
      description:
        'Convert dense spreadsheets, financial modeling, and proprietary systems into intuitive, high-fidelity quantitative charts and vector diagrams. We eliminate visual noise to spotlight inflection points and capital return metrics.',
      icon: 'BarChart2',
      sortOrder: 4,
      items: [
        {
          title: 'Custom Vector Iconography',
          description:
            'Handcrafted scalable vectors illustrating proprietary methodologies and platform architectures.',
          sortOrder: 1,
        },
        {
          title: 'Process & Framework Mapping',
          description:
            'Logical process flows, multi-stakeholder journey maps, and governance diagrams.',
          sortOrder: 2,
        },
        {
          title: 'Financial & Data Visualization',
          description:
            'High-density waterfall charts, sensitivity heatmaps, and cohort analysis visuals for financial executives.',
          sortOrder: 3,
        },
      ],
    },
    {
      number: '05',
      title: 'Sales Enablement, Brochures & Digital Collateral',
      slug: 'sales-enablement-brochures-digital-collateral',
      shortDescription:
        'Equip revenue organizations and commercial leaders with high-conversion field pitch decks, digital playbooks, and branded market collateral.',
      description:
        'Equip revenue organizations and commercial leaders with high-conversion field pitch decks, digital playbooks, and branded market collateral that accelerate deal velocity.',
      icon: 'Briefcase',
      sortOrder: 5,
      items: [
        {
          title: 'Corporate & Product Brochures',
          description:
            'Interactive PDFs and print-ready brochures showcasing enterprise product suites.',
          sortOrder: 1,
        },
        {
          title: 'Visual Marketing Assets',
          description:
            'Branded collateral, battlecards, and objection-handling sheets for enterprise sales representatives.',
          sortOrder: 2,
        },
        {
          title: 'AI-Assisted Conceptual Renders',
          description:
            'Tailored visual metaphors and product representations for forward-looking solution launches.',
          sortOrder: 3,
        },
      ],
    },
    {
      number: '06',
      title: 'Strategic Research & Market Intelligence',
      slug: 'strategic-research-market-intelligence',
      shortDescription:
        'Synthesize unstructured market data, competitive intelligence, and industry research into clear, actionable executive narrative decks.',
      description:
        'Synthesize unstructured market data, competitive intelligence, and industry research into clear, actionable executive narrative decks. We turn disparate desk research into coherent investment hypotheses.',
      icon: 'Compass',
      sortOrder: 6,
      items: [
        {
          title: 'Competitor & Market Benchmarking',
          description:
            'Systematic feature matrices, pricing tiers, and positioning maps across direct and adjacent competitors.',
          sortOrder: 1,
        },
        {
          title: 'Desk Research Synthesis',
          description:
            'Aggregation and verification of secondary market data, analyst reports, and macroeconomic trends.',
          sortOrder: 2,
        },
        {
          title: 'Insight-to-Slide Structuring',
          description:
            'Translation of qualitative research notes into compelling board-ready presentation sequences.',
          sortOrder: 3,
        },
      ],
    },
  ];

  for (const svc of servicesData) {
    const service = await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        number: svc.number,
        title: svc.title,
        shortDescription: svc.shortDescription,
        description: svc.description,
        icon: svc.icon,
        sortOrder: svc.sortOrder,
        published: true,
      },
      create: {
        number: svc.number,
        title: svc.title,
        slug: svc.slug,
        shortDescription: svc.shortDescription,
        description: svc.description,
        icon: svc.icon,
        sortOrder: svc.sortOrder,
        published: true,
      },
    });

    // Seed Deliverable items
    await prisma.serviceItem.deleteMany({ where: { serviceId: service.id } });
    for (const item of svc.items) {
      await prisma.serviceItem.create({
        data: {
          serviceId: service.id,
          title: item.title,
          description: item.description,
          sortOrder: item.sortOrder,
        },
      });
    }

    console.log(`✅ Service seeded: ${service.number} - ${service.title}`);
  }

  // ==================================================
  // 3. INDUSTRIES (From Frontend Content)
  // ==================================================
  const industriesData = [
    {
      name: 'Technology & SaaS',
      slug: 'technology-saas',
      description:
        'Translating multi-layered technical architectures, platform capabilities, and software unit economics into clear executive value propositions.',
      challenges:
        'Complex products, multi-tier technical architectures, data-heavy communication, and abstract software workflows.',
      capabilities: ['Presentation Design', 'Data Storytelling', 'Sales Enablement', 'Research'],
      icon: 'Cpu',
      sortOrder: 1,
    },
    {
      name: 'Financial Services',
      slug: 'financial-services',
      description:
        'Communicating intricate risk models, quantitative performance metrics, and complex transaction structures with institutional rigor.',
      challenges:
        'Volatile financial datasets, regulatory compliance disclosures, multi-asset reporting, and dense quantitative modeling.',
      capabilities: [
        'Quantitative Data Storytelling',
        'Executive Decks',
        'Board Briefs',
        'RFP Engineering',
      ],
      icon: 'TrendingUp',
      sortOrder: 2,
    },
    {
      name: 'Consulting & Professional Services',
      slug: 'consulting-professional-services',
      description:
        'Structuring strategic recommendations, transformation methodologies, and high-impact client deliverable systems that drive client conviction.',
      challenges:
        'Abstract consulting frameworks, multi-workstream governance, dense diagnostic findings, and tight client turnaround deadlines.',
      capabilities: [
        'Bespoke Vectors',
        'Proposal & RFP Engineering',
        'Executive One-Pagers',
        'Strategic Narrative',
      ],
      icon: 'Briefcase',
      sortOrder: 3,
    },
    {
      name: 'Healthcare & Life Sciences',
      slug: 'healthcare-life-sciences',
      description:
        'Distilling scientific methodologies, clinical trial metrics, and commercial regulatory pathways into compelling visual narratives for partners.',
      challenges:
        'Complex clinical datasets, specialized medical terminology, multi-phase trial timelines, and diverse evaluation panels.',
      capabilities: [
        'Data Storytelling',
        'Presentation Design',
        'Executive Summaries',
        'Strategic Research',
      ],
      icon: 'Activity',
      sortOrder: 4,
    },
    {
      name: 'Real Estate & Infrastructure',
      slug: 'real-estate-infrastructure',
      description:
        'Presenting large-scale capital development proposals, multi-property asset portfolios, and infrastructure financing models with spatial clarity.',
      challenges:
        'Multi-year capital expenditure schedules, complex asset portfolios, municipal zoning approvals, and syndicated funding structures.',
      capabilities: [
        'Interactive Decks',
        'Proposal Engineering',
        'Collateral & Brochures',
        'Bespoke Vectors',
      ],
      icon: 'Building2',
      sortOrder: 5,
    },
    {
      name: 'Enterprise & Corporate',
      slug: 'enterprise-corporate',
      description:
        'Unifying global internal communications, leadership summit presentations, and company-wide strategic programs under executive design standards.',
      challenges:
        'Disparate global business units, cross-functional organizational misalignment, and high-stakes board governance scrutiny.',
      capabilities: [
        'Executive Presentations',
        'Corporate Collateral',
        'Turnkey Design Files',
        'Sales Enablement',
      ],
      icon: 'Building',
      sortOrder: 6,
    },
    {
      name: 'Startups & Growth Companies',
      slug: 'startups-growth-companies',
      description:
        'Engineering high-conviction investor pitch decks, market entry narratives, and commercial traction assets engineered for rapid venture scale.',
      challenges:
        'Brief investor attention spans, establishing market category definition, proving competitive moat durability, and urgent funding rounds.',
      capabilities: [
        'Pitch Deck Design',
        'Market Intelligence',
        'Executive One-Pagers',
        'Rapid 24/7 Agility',
      ],
      icon: 'Rocket',
      sortOrder: 7,
    },
    {
      name: 'Investment & Private Equity',
      slug: 'investment-private-equity',
      description:
        'Packaging investment memorandums, fund performance updates, and thesis presentations built for investment committees and institutional LPs.',
      challenges:
        'Complex capital stacks, portfolio company reporting harmonization, and confidential investment committee reviews.',
      capabilities: [
        'Boardroom Deliverables',
        'Quantitative Data Storytelling',
        'Tearsheets & Briefs',
        'Strict Confidentiality',
      ],
      icon: 'PieChart',
      sortOrder: 8,
    },
  ];

  for (const ind of industriesData) {
    const industry = await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {
        name: ind.name,
        description: ind.description,
        challenges: ind.challenges,
        capabilities: ind.capabilities,
        icon: ind.icon,
        sortOrder: ind.sortOrder,
        published: true,
      },
      create: {
        name: ind.name,
        slug: ind.slug,
        description: ind.description,
        challenges: ind.challenges,
        capabilities: ind.capabilities,
        icon: ind.icon,
        sortOrder: ind.sortOrder,
        published: true,
      },
    });

    console.log(`✅ Industry seeded: ${industry.name}`);
  }

  // ==================================================
  // 4. SITE SETTINGS
  // ==================================================
  const settingsData = [
    { key: 'site_email', value: 'hello@slidevance.com' },
    { key: 'company_name', value: 'Slidevance' },
    { key: 'tagline', value: 'Ideas That Slide. Solutions That Advance.' },
    { key: 'contact_email', value: 'hello@slidevance.com' },
    {
      key: 'positioning',
      value: 'Creative Presentation & Business Communication Studio',
    },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
    console.log(`✅ Site setting seeded: ${s.key}`);
  }

  // ==================================================
  // 5. PORTFOLIO CONCEPT SHOWCASES
  // ==================================================
  const portfolioData = [
    {
      title: 'Investor Presentation & Capital Raise',
      slug: 'investor-presentation-capital-raise',
      category: 'Presentation Design',
      shortDescription:
        'Comprehensive investor deck transformation aligning financial traction, unit economics, and capital deployment strategy.',
      description:
        'Comprehensive investor deck transformation aligning financial traction, unit economics, and capital deployment strategy for institutional venture partners.',
      challenge:
        'Complex unit economics, recurring revenue milestones, and multi-tier market sizing were buried in disparate spreadsheet tabs, diluting the investment thesis during partner meetings.',
      approach:
        'Engineered an objective-first investor narrative, restructured financial graphs into clear comparative milestones, and built a high-conviction pitch deck system with standardized typography.',
      outcome:
        'Eliminated narrative friction across investor presentations, enabling executive leadership to present with unanimous clarity and confidence.',
      featured: true,
      sortOrder: 1,
      published: true,
    },
    {
      title: 'Corporate Strategy & Executive Roadmap',
      slug: 'corporate-strategy-executive-roadmap',
      category: 'Business Communication',
      shortDescription:
        'High-stakes transformation roadmap and multi-stream operational matrix engineered for executive board alignment.',
      description:
        'High-stakes 3-year transformation roadmap and multi-stream operational matrix engineered for unanimous executive board alignment.',
      challenge:
        'Cross-department transformation priorities were fragmented across separate operational groups, leading to misaligned objectives during quarterly executive planning.',
      approach:
        'Synthesized disparate initiative streams into a cohesive Tri-Pillar Strategic Framework, translating complex dependencies into an intuitive boardroom deck.',
      outcome:
        'Secured immediate leadership consensus and unanimous board authorization to advance the 3-year transformation roadmap into execution.',
      featured: true,
      sortOrder: 2,
      published: true,
    },
    {
      title: 'Enterprise RFP & Proposal Transformation',
      slug: 'enterprise-rfp-proposal-transformation',
      category: 'RFP & Proposals',
      shortDescription:
        'Restructuring a technical proposal into a compliant, visually compelling executive response that won enterprise procurement selection.',
      description:
        'Restructuring a multi-million dollar technical proposal into a compliant, visually compelling executive response that won enterprise procurement selection.',
      challenge:
        'A dense competitive bid risked compliance disqualification due to unformatted technical tables, convoluted architecture drawings, and weak visual hierarchy.',
      approach:
        'Re-engineered proposal document architecture, designed high-fidelity system diagrams, and built a color-coded compliance matrix highlighting verified enterprise criteria.',
      outcome:
        'Passed all technical procurement hurdles with top compliance marks and won competitive selection over incumbent enterprise vendors.',
      featured: false,
      sortOrder: 3,
      published: true,
    },
    {
      title: 'Market Intelligence & Competitor Matrix',
      slug: 'market-intelligence-competitor-matrix',
      category: 'Research',
      shortDescription:
        'Deep competitive benchmarking and market intelligence landscape synthesized into an intuitive, board-ready strategic positioning report.',
      description:
        'Deep competitive benchmarking and market intelligence landscape synthesized into an intuitive, board-ready strategic positioning report.',
      challenge:
        'Massive volumes of competitor pricing datasets, feature matrices, and market dynamics lacked executive synthesis, overwhelming strategic planners.',
      approach:
        'Distilled thousands of raw data points into clear competitive quadrant landscapes, structured moat comparisons, and strategic decision decks.',
      outcome:
        'Equipped leadership with clear, defensible market insight that informed executive product strategy and strategic positioning.',
      featured: false,
      sortOrder: 4,
      published: true,
    },
    {
      title: 'Quantitative Financial & Risk Analytics',
      slug: 'quantitative-financial-risk-analytics',
      category: 'Data Storytelling',
      shortDescription:
        'Multi-layer financial modeling and risk simulation dashboard translated into executive board presentations.',
      description:
        'Multi-layer financial modeling and risk simulation dashboard translated into executive board presentations and institutional investor materials.',
      challenge:
        'Dense actuarial tables and multi-variable monte carlo outputs lacked executive readability, confusing non-quantitative stakeholders.',
      approach:
        'Designed visual hierarchy overlays, comparative benchmark heatmaps, and simplified sensitivity sliders.',
      outcome:
        'Accelerated board review cycles and established standard quantitative reporting templates.',
      featured: false,
      sortOrder: 5,
      published: true,
    },
  ];

  for (const p of portfolioData) {
    await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        category: p.category,
        shortDescription: p.shortDescription,
        description: p.description,
        challenge: p.challenge,
        approach: p.approach,
        outcome: p.outcome,
        featured: p.featured,
        sortOrder: p.sortOrder,
        published: p.published,
      },
      create: p,
    });
    console.log(`✅ Portfolio project seeded: ${p.title}`);
  }

  console.log('🎉 Slidevance database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
