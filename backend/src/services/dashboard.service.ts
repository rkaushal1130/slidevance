import { prisma } from '../config/db.js';
import {
  DashboardData,
  DashboardStats,
  RecentInquiryItem,
  InquiryStatusCount,
  InquiryProjectTypeCount,
  InquiryMonthlyCount,
  InquiryStatus,
  ProjectType,
} from '../types/index.js';

const ALL_INQUIRY_STATUSES: InquiryStatus[] = [
  'NEW',
  'CONTACTED',
  'IN_PROGRESS',
  'COMPLETED',
  'ARCHIVED',
];

const ALL_PROJECT_TYPES: ProjectType[] = [
  'PRESENTATION_DESIGN',
  'PROPOSAL_RFP',
  'BUSINESS_DOCUMENTS',
  'DATA_STORYTELLING',
  'SALES_ENABLEMENT',
  'RESEARCH',
  'OTHER',
];

export class DashboardService {
  /**
   * Fetch aggregate summary statistics for the admin dashboard
   */
  async getStats(): Promise<DashboardStats> {
    const [
      totalInquiries,
      newInquiries,
      contactedInquiries,
      inProgressInquiries,
      completedInquiries,
      totalPortfolioProjects,
      publishedPortfolioProjects,
      totalServices,
      totalIndustries,
    ] = await Promise.all([
      prisma.projectInquiry.count(),
      prisma.projectInquiry.count({ where: { status: 'NEW' } }),
      prisma.projectInquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.projectInquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.projectInquiry.count({ where: { status: 'COMPLETED' } }),
      prisma.portfolioProject.count(),
      prisma.portfolioProject.count({ where: { published: true } }),
      prisma.service.count(),
      prisma.industry.count(),
    ]);

    return {
      totalInquiries,
      newInquiries,
      contactedInquiries,
      inProgressInquiries,
      completedInquiries,
      totalPortfolioProjects,
      publishedPortfolioProjects,
      totalServices,
      totalIndustries,
    };
  }

  /**
   * Fetch the most recent inquiries (default latest 5)
   * Only selects strictly required fields to optimize query performance and data privacy
   */
  async getRecentInquiries(limit = 5): Promise<RecentInquiryItem[]> {
    const safeLimit = Math.max(1, Math.min(limit, 50));

    const inquiries = await prisma.projectInquiry.findMany({
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        projectType: true,
        status: true,
        createdAt: true,
      },
    });

    return inquiries as RecentInquiryItem[];
  }

  /**
   * Fetch inquiry counts grouped by inquiry status
   */
  async getInquiriesByStatus(): Promise<InquiryStatusCount[]> {
    try {
      if (typeof (prisma.projectInquiry as any).groupBy === 'function') {
        const groups = await prisma.projectInquiry.groupBy({
          by: ['status'],
          _count: {
            _all: true,
          },
        });

        const statusMap = new Map<string, number>();
        for (const g of groups as any[]) {
          const count = g._count?._all ?? (typeof g._count === 'number' ? g._count : 0);
          statusMap.set(g.status, count);
        }

        return ALL_INQUIRY_STATUSES.map((status) => ({
          status,
          count: statusMap.get(status) || 0,
        }));
      }
    } catch {
      // Fallback if groupBy is not supported or errors
    }

    const counts = await Promise.all(
      ALL_INQUIRY_STATUSES.map(async (status) => {
        const count = await prisma.projectInquiry.count({
          where: { status },
        });
        return { status, count };
      })
    );

    return counts;
  }

  /**
   * Fetch inquiry counts grouped by project type
   */
  async getInquiriesByProjectType(): Promise<InquiryProjectTypeCount[]> {
    try {
      if (typeof (prisma.projectInquiry as any).groupBy === 'function') {
        const groups = await prisma.projectInquiry.groupBy({
          by: ['projectType'],
          _count: {
            _all: true,
          },
        });

        const typeMap = new Map<string, number>();
        for (const g of groups as any[]) {
          const count = g._count?._all ?? (typeof g._count === 'number' ? g._count : 0);
          typeMap.set(g.projectType, count);
        }

        return ALL_PROJECT_TYPES.map((projectType) => ({
          projectType,
          count: typeMap.get(projectType) || 0,
        }));
      }
    } catch {
      // Fallback if groupBy is not supported or errors
    }

    const counts = await Promise.all(
      ALL_PROJECT_TYPES.map(async (projectType) => {
        const count = await prisma.projectInquiry.count({
          where: { projectType },
        });
        return { projectType, count };
      })
    );

    return counts;
  }

  /**
   * Fetch basic monthly counts of inquiries for time-series charts (default last 6 months)
   * Only loads createdAt to maintain optimal memory and database performance
   */
  async getInquiriesByMonth(monthsCount = 6): Promise<InquiryMonthlyCount[]> {
    const numMonths = Math.max(1, Math.min(monthsCount, 24));
    const now = new Date();

    // Prepare default consecutive months map for continuous timeline (from oldest to newest)
    const monthsMap = new Map<string, { label: string; count: number }>();
    for (let i = numMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthsMap.set(key, { label, count: 0 });
    }

    // Query inquiries selecting only createdAt
    const oldestDate = new Date(now.getFullYear(), now.getMonth() - (numMonths - 1), 1);
    const inquiries = await prisma.projectInquiry.findMany({
      where: {
        createdAt: {
          gte: oldestDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    for (const item of inquiries) {
      const d = new Date(item.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthsMap.has(key)) {
        const entry = monthsMap.get(key)!;
        entry.count += 1;
      } else {
        const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        monthsMap.set(key, { label, count: 1 });
      }
    }

    return Array.from(monthsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        label: data.label,
        count: data.count,
      }));
  }

  /**
   * Fetch complete inquiry analytics (status, project type, and monthly trends)
   */
  async getAnalytics(monthsCount = 6) {
    const [inquiriesByStatus, inquiriesByProjectType, inquiriesByMonth] = await Promise.all([
      this.getInquiriesByStatus(),
      this.getInquiriesByProjectType(),
      this.getInquiriesByMonth(monthsCount),
    ]);

    return {
      inquiriesByStatus,
      inquiriesByProjectType,
      inquiriesByMonth,
    };
  }

  /**
   * Fetch unified admin dashboard data in a single performant call
   */
  async getDashboardData(monthsCount = 6): Promise<DashboardData> {
    const [stats, recentInquiries, inquiriesByStatus, inquiriesByProjectType, inquiriesByMonth] =
      await Promise.all([
        this.getStats(),
        this.getRecentInquiries(5),
        this.getInquiriesByStatus(),
        this.getInquiriesByProjectType(),
        this.getInquiriesByMonth(monthsCount),
      ]);

    return {
      stats,
      recentInquiries,
      inquiriesByStatus,
      inquiriesByProjectType,
      inquiriesByMonth,
    };
  }
}

export const dashboardService = new DashboardService();
