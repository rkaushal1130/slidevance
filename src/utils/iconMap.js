import {
  Presentation,
  FileText,
  FileSpreadsheet,
  BarChart2,
  BarChart3,
  Briefcase,
  Compass,
  Cpu,
  TrendingUp,
  Activity,
  Building2,
  Building,
  Rocket,
  PieChart,
  ShieldCheck,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

const ICON_REGISTRY = {
  Presentation,
  FileText,
  FileSpreadsheet,
  BarChart2,
  BarChart3,
  Briefcase,
  Compass,
  Cpu,
  TrendingUp,
  Activity,
  Building2,
  Building,
  Rocket,
  PieChart,
  ShieldCheck,
  Sparkles,
  Layers,
};

/**
 * Resolve icon name to Lucide React component safely
 * @param {string|Function} icon - Icon name or component
 * @param {Function} [fallback=HelpCircle] - Fallback icon component
 * @returns {Function} Lucide Icon component
 */
export function getIconComponent(icon, fallback = HelpCircle) {
  if (!icon) return fallback;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    return icon;
  }
  return ICON_REGISTRY[icon] || fallback;
}

export default getIconComponent;
