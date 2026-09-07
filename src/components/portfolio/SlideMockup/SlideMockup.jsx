import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Search, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import styles from './SlideMockup.module.css';

export default function SlideMockup({ type = 'investor', className = '' }) {
  switch (type) {
    case 'investor':
      return (
        <div className={`${styles.mockupContainer} ${styles.investorTheme} ${className}`}>
          <div className={styles.chromeBar}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.slideHeaderTitle}>INVESTOR PRESENTATION // SERIES B EXPANSION</span>
            <span className={styles.slidePageTag}>04 / 24</span>
          </div>
          <div className={styles.slideBody}>
            <div className={styles.slideHeroTag}>
              <TrendingUp size={12} />
              <span>CAPITAL EFFICIENCY &amp; GROWTH TRAJECTORY</span>
            </div>
            <h4 className={styles.mockupHeading}>Scalable Unit Economics &amp; Gross Margin Expansion</h4>
            <div className={styles.chartMultiGrid}>
              <div className={styles.chartCol}>
                <div className={styles.barStack}>
                  <div className={styles.barSegment} style={{ height: '35%', background: 'rgba(7,95,232,0.3)' }} />
                  <div className={styles.barSegment} style={{ height: '65%', background: 'var(--blue)' }} />
                </div>
                <span className={styles.barLabel}>FY24</span>
              </div>
              <div className={styles.chartCol}>
                <div className={styles.barStack}>
                  <div className={styles.barSegment} style={{ height: '45%', background: 'rgba(7,95,232,0.3)' }} />
                  <div className={styles.barSegment} style={{ height: '85%', background: 'var(--blue)' }} />
                </div>
                <span className={styles.barLabel}>FY25</span>
              </div>
              <div className={styles.chartCol}>
                <div className={styles.barStack}>
                  <div className={styles.barSegment} style={{ height: '55%', background: 'rgba(18,201,232,0.4)' }} />
                  <div className={styles.barSegment} style={{ height: '100%', background: 'linear-gradient(180deg, #12C9E8 0%, #075FE8 100%)' }} />
                </div>
                <span className={styles.barLabel}>FY26E</span>
              </div>
            </div>
            <div className={styles.kpiPillsRow}>
              <div className={styles.kpiPill}>
                <span className={styles.kpiPillVal}>84%</span>
                <span className={styles.kpiPillLbl}>Gross Margin</span>
              </div>
              <div className={styles.kpiPill}>
                <span className={styles.kpiPillVal}>3.8x</span>
                <span className={styles.kpiPillLbl}>LTV : CAC</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'strategy':
      return (
        <div className={`${styles.mockupContainer} ${styles.strategyTheme} ${className}`}>
          <div className={styles.chromeBar}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.slideHeaderTitle}>CORPORATE STRATEGY // 3-YEAR VISION</span>
            <span className={styles.slidePageTag}>08 / 32</span>
          </div>
          <div className={styles.slideBody}>
            <div className={styles.slideHeroTag}>
              <Target size={12} />
              <span>EXECUTIVE ROADMAP</span>
            </div>
            <h4 className={styles.mockupHeading}>Tri-Pillar Transformation Framework</h4>
            <div className={styles.matrixGrid}>
              <div className={styles.matrixBox}>
                <span className={styles.matrixBoxNum}>01</span>
                <span className={styles.matrixBoxTitle}>Core Consolidation</span>
                <div className={styles.miniProgress} style={{ width: '80%' }} />
              </div>
              <div className={styles.matrixBox}>
                <span className={styles.matrixBoxNum}>02</span>
                <span className={styles.matrixBoxTitle}>Market Expansion</span>
                <div className={styles.miniProgress} style={{ width: '60%' }} />
              </div>
              <div className={styles.matrixBox}>
                <span className={styles.matrixBoxNum}>03</span>
                <span className={styles.matrixBoxTitle}>Operating Leverage</span>
                <div className={styles.miniProgress} style={{ width: '90%' }} />
              </div>
            </div>
            <div className={styles.matrixFooter}>
              <span className={styles.matrixNote}>ALIGNED FOR BOARD APPROVAL</span>
            </div>
          </div>
        </div>
      );

    case 'rfp':
      return (
        <div className={`${styles.mockupContainer} ${styles.rfpTheme} ${className}`}>
          <div className={styles.chromeBar}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.slideHeaderTitle}>RFP RESPONSE // TECHNICAL PURSUIT</span>
            <span className={styles.slidePageTag}>SEC 3.2</span>
          </div>
          <div className={styles.slideBody}>
            <div className={styles.slideHeroTag}>
              <CheckCircle2 size={12} />
              <span>COMPLIANCE &amp; ARCHITECTURE</span>
            </div>
            <h4 className={styles.mockupHeading}>Enterprise Security &amp; Delivery Rubric</h4>
            <div className={styles.rfpChecklist}>
              <div className={styles.rfpRow}>
                <CheckCircle2 size={14} className={styles.checkIcon} />
                <span className={styles.rfpRowText}>SOC2 Type II &amp; ISO 27001 Certified Architecture</span>
              </div>
              <div className={styles.rfpRow}>
                <CheckCircle2 size={14} className={styles.checkIcon} />
                <span className={styles.rfpRowText}>SLA Guarantee: 99.99% Availability Commitment</span>
              </div>
              <div className={styles.rfpRow}>
                <CheckCircle2 size={14} className={styles.checkIcon} />
                <span className={styles.rfpRowText}>Zero-Trust Multi-Cloud Data Protection</span>
              </div>
            </div>
            <div className={styles.rfpScoreBadge}>
              <span>EVALUATION SCORE: 100% COMPLIANT</span>
            </div>
          </div>
        </div>
      );

    case 'research':
      return (
        <div className={`${styles.mockupContainer} ${styles.researchTheme} ${className}`}>
          <div className={styles.chromeBar}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.slideHeaderTitle}>MARKET INTELLIGENCE // COMPETITIVE MATRIX</span>
            <span className={styles.slidePageTag}>VOL 4</span>
          </div>
          <div className={styles.slideBody}>
            <div className={styles.slideHeroTag}>
              <Search size={12} />
              <span>LANDSCAPE SYNTHESIS</span>
            </div>
            <h4 className={styles.mockupHeading}>Market Positioning &amp; Moat Durability</h4>
            <div className={styles.quadrantVisual}>
              <div className={styles.quadrantAxisH} />
              <div className={styles.quadrantAxisV} />
              <div className={`${styles.quadrantDot} ${styles.dotLeader}`}>
                <span>LEADER</span>
              </div>
              <div className={`${styles.quadrantDot} ${styles.dotPeer1}`} />
              <div className={`${styles.quadrantDot} ${styles.dotPeer2}`} />
              <div className={`${styles.quadrantDot} ${styles.dotPeer3}`} />
            </div>
            <div className={styles.researchLegend}>
              <span className={styles.legendItem}>Bespoke Intelligence Model</span>
            </div>
          </div>
        </div>
      );

    case 'sales':
      return (
        <div className={`${styles.mockupContainer} ${styles.salesTheme} ${className}`}>
          <div className={styles.chromeBar}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.slideHeaderTitle}>SALES ENABLEMENT // FIELD PLAYBOOK</span>
            <span className={styles.slidePageTag}>PITCH 02</span>
          </div>
          <div className={styles.slideBody}>
            <div className={styles.slideHeroTag}>
              <Briefcase size={12} />
              <span>COMMERCIAL CONVERSION</span>
            </div>
            <h4 className={styles.mockupHeading}>Enterprise Value Proposition &amp; ROI Funnel</h4>
            <div className={styles.funnelSteps}>
              <div className={styles.funnelBar} style={{ width: '100%', background: 'rgba(255, 157, 37, 0.2)' }}>
                <span>01 Discovery &amp; Pain Audit</span>
              </div>
              <div className={styles.funnelBar} style={{ width: '75%', background: 'rgba(255, 157, 37, 0.35)' }}>
                <span>02 Solution Demonstration</span>
              </div>
              <div className={styles.funnelBar} style={{ width: '50%', background: 'linear-gradient(90deg, #FF9D25 0%, #E52BB8 100%)', color: '#fff' }}>
                <span>03 Commercial Close</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'data':
      return (
        <div className={`${styles.mockupContainer} ${styles.dataTheme} ${className}`}>
          <div className={styles.chromeBar}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.slideHeaderTitle}>DATA STORYTELLING // QUANTITATIVE REPORT</span>
            <span className={styles.slidePageTag}>ANALYTICS</span>
          </div>
          <div className={styles.slideBody}>
            <div className={styles.slideHeroTag}>
              <BarChart3 size={12} />
              <span>ECONOMETRIC VISUALIZATION</span>
            </div>
            <h4 className={styles.mockupHeading}>Complex Quantitative Multi-Stream Synthesis</h4>
            <div className={styles.dataGraph}>
              <svg viewBox="0 0 280 90" className={styles.dataSvg}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12C9E8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#12C9E8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 75 Q 40 60, 80 50 T 160 35 T 220 20 T 280 10 L 280 90 L 0 90 Z" fill="url(#areaGrad)" />
                <path d="M 0 75 Q 40 60, 80 50 T 160 35 T 220 20 T 280 10" fill="none" stroke="#12C9E8" strokeWidth="2.5" />
                <path d="M 0 85 Q 50 75, 100 65 T 190 55 T 280 40" fill="none" stroke="#075FE8" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>
            <div className={styles.dataStatsRow}>
              <span>+38% Efficiency Gain</span>
              <span>Predictive Confidence: 99.2%</span>
            </div>
          </div>
        </div>
      );

    case 'featured':
    default:
      return (
        <div className={`${styles.mockupContainer} ${styles.featuredTheme} ${className}`}>
          <div className={styles.chromeBar}>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.slideHeaderTitle}>BOARD OF DIRECTORS // EXECUTIVE DELIVERABLE</span>
            <span className={styles.slidePageTag}>BOARDROOM</span>
          </div>
          <div className={styles.slideBody}>
            <div className={styles.slideHeroTag}>
              <Sparkles size={12} />
              <span>HIGH-STAKES COMMUNICATION</span>
            </div>
            <h3 className={styles.featuredSlideTitle}>Turning Complex Information Into Executive Communication</h3>
            <div className={styles.featuredVisualGrid}>
              <div className={styles.featuredCol}>
                <span className={styles.colLabel}>OPERATIONAL COMPLEXITY</span>
                <div className={styles.wireframeStack}>
                  <div className={styles.wireLine} style={{ width: '85%' }} />
                  <div className={styles.wireLine} style={{ width: '65%' }} />
                  <div className={styles.wireLine} style={{ width: '90%' }} />
                </div>
              </div>
              <div className={styles.featuredArrowCol}>
                <ArrowUpRight size={20} className={styles.advanceArrow} />
              </div>
              <div className={styles.featuredColRight}>
                <span className={styles.colLabelHighlight}>EXECUTIVE CONSENSUS</span>
                <div className={styles.consensusBox}>
                  <span className={styles.consensusVal}>UNANIMOUS</span>
                  <span className={styles.consensusSub}>BOARD RESOLUTION</span>
                </div>
              </div>
            </div>
            <div className={styles.featuredMetaRow}>
              <span>SLIDEVANCE STUDIO ARCHITECTURE</span>
              <span>DECK REF #SL-2026</span>
            </div>
          </div>
        </div>
      );
  }
}
