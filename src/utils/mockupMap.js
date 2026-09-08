/**
 * Maps portfolio/service category or slug to a SlideMockup type
 */
const CATEGORY_MOCKUP_MAP = {
  'Presentation Design': 'investor',
  'Business Communication': 'strategy',
  'RFP & Proposals': 'rfp',
  'Data Storytelling': 'data',
  'Marketing Collateral': 'sales',
  'Research': 'research',
};

const DEFAULT_MOCKUPS = ['investor', 'strategy', 'rfp', 'research', 'sales', 'data'];

export function getMockupType(item, index = 0) {
  if (item?.mockupType) return item.mockupType;
  if (item?.category && CATEGORY_MOCKUP_MAP[item.category]) {
    return CATEGORY_MOCKUP_MAP[item.category];
  }
  const slug = (item?.slug || '').toLowerCase();
  if (slug.includes('investor') || slug.includes('presentation') || slug.includes('keynote')) return 'investor';
  if (slug.includes('strategy') || slug.includes('roadmap') || slug.includes('board')) return 'strategy';
  if (slug.includes('rfp') || slug.includes('proposal') || slug.includes('bid')) return 'rfp';
  if (slug.includes('data') || slug.includes('analytics') || slug.includes('quantitative')) return 'data';
  if (slug.includes('sales') || slug.includes('collateral') || slug.includes('brochure')) return 'sales';
  if (slug.includes('research') || slug.includes('intelligence') || slug.includes('market')) return 'research';

  return DEFAULT_MOCKUPS[index % DEFAULT_MOCKUPS.length];
}

export default getMockupType;
