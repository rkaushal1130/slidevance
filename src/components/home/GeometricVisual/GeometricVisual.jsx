import React from 'react';
import { TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';
import styles from './GeometricVisual.module.css';

export default function GeometricVisual({ className = '' }) {
  return (
    <div className={`${styles.visualWrapper} ${className}`} aria-label="Slidevance layered presentation architecture visual">
      {/* Background Soft Glows */}
      <div className={`${styles.glow} ${styles.glowBlue}`} />
      <div className={`${styles.glow} ${styles.glowCyan}`} />
      <div className={`${styles.glow} ${styles.glowMagenta}`} />
      <div className={`${styles.glow} ${styles.glowOrange}`} />
      <div className={styles.groundReflection} />

      {/* Main 3D Perspective Stage */}
      <div className={styles.stage}>
        {/* Layer 1: Translucent Blue Panel (Narrative & Architecture) */}
        <div className={`${styles.panel} ${styles.panelBlue}`}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>01 / NARRATIVE ARCHITECTURE</span>
            <span className={styles.panelIndicator} />
          </div>
          <div className={styles.panelContent}>
            <div className={styles.blueprintLine} style={{ width: '85%' }} />
            <div className={styles.blueprintLine} style={{ width: '60%' }} />
            <div className={styles.blueprintGrid}>
              <div className={styles.blueprintBox} />
              <div className={styles.blueprintBox} />
              <div className={styles.blueprintBox} />
            </div>
            <div className={styles.panelFooter}>
              <span className={styles.panelCode}>CORE HYPOTHESIS ALIGNED</span>
            </div>
          </div>
        </div>

        {/* Layer 2: Translucent Cyan Panel (Quantitative & Financial Synthesis) */}
        <div className={`${styles.panel} ${styles.panelCyan}`}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>02 / QUANTITATIVE INSIGHT</span>
            <div className={styles.panelPill}>
              <TrendingUp size={12} />
              <span>+184% IMPACT</span>
            </div>
          </div>
          <div className={styles.panelContent}>
            {/* Chart visualization */}
            <div className={styles.chartArea}>
              <div className={styles.chartBar} style={{ height: '35%' }} />
              <div className={styles.chartBar} style={{ height: '60%' }} />
              <div className={styles.chartBar} style={{ height: '45%' }} />
              <div className={styles.chartBar} style={{ height: '90%' }} />
              <div className={styles.chartBar} style={{ height: '75%' }} />
              <div className={`${styles.chartBar} ${styles.chartBarHighlight}`} style={{ height: '100%' }} />
            </div>
            <div className={styles.chartTrendLine} />
          </div>
        </div>

        {/* Layer 3: Translucent Magenta Panel (Visual Decision Matrix) */}
        <div className={`${styles.panel} ${styles.panelMagenta}`}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>03 / DECISION MAPPING</span>
            <span className={styles.panelDot} />
          </div>
          <div className={styles.panelContent}>
            <div className={styles.matrixContainer}>
              <div className={styles.matrixRow}>
                <span className={styles.matrixCellBold}>STRATEGIC FIT</span>
                <span className={styles.matrixValueHigh}>TIER 1</span>
              </div>
              <div className={styles.matrixRow}>
                <span className={styles.matrixCell}>VALUE REALIZATION</span>
                <span className={styles.matrixValueHigh}>OPTIMAL</span>
              </div>
              <div className={styles.matrixRow}>
                <span className={styles.matrixCell}>RISK DEFENSE</span>
                <span className={styles.matrixValueHigh}>FORTIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 4: Translucent Orange Panel (Boardroom-Ready Deliverable) */}
        <div className={`${styles.panel} ${styles.panelOrange}`}>
          <div className={styles.panelHeader}>
            <div className={styles.slideIdentity}>
              <div className={styles.orangeEmblem}>
                <CheckCircle2 size={13} />
              </div>
              <span className={styles.panelTagBold}>BOARDROOM DELIVERABLE</span>
            </div>
            <span className={styles.statusBadge}>EXECUTIVE READY</span>
          </div>
          <div className={styles.panelContent}>
            <h4 className={styles.slideTitle}>Executive Value Creation &amp; Market Leadership</h4>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}>
                <span className={styles.kpiNumber}>$420M+</span>
                <span className={styles.kpiLabel}>DEAL PIPELINE</span>
              </div>
              <div className={styles.kpiCard}>
                <span className={styles.kpiNumber}>100%</span>
                <span className={styles.kpiLabel}>DECISION CONSENSUS</span>
              </div>
            </div>
            <div className={styles.slideMeta}>
              <span className={styles.watermark}>ENGINEERED BY SLIDEVANCE</span>
              <span className={styles.slideNum}>SLIDE 04 / 28</span>
            </div>
          </div>
        </div>

        {/* Floating Badge 1: High-Stakes Clarity */}
        <div className={`${styles.floatingBadge} ${styles.floatingBadgeClarity}`}>
          <div className={styles.badgeIcon}>
            <Sparkles size={16} />
          </div>
          <div className={styles.badgeText}>
            <span className={styles.badgeTitle}>99.4% Clarity</span>
            <span className={styles.badgeSub}>Executive Consensus</span>
          </div>
        </div>

        {/* Floating Badge 2: 24/7 Availability */}
        <div className={`${styles.floatingBadge} ${styles.floatingBadgeAgile}`}>
          <div className={styles.badgeDotLive} />
          <div className={styles.badgeText}>
            <span className={styles.badgeTitle}>24/7 Agile Availability</span>
            <span className={styles.badgeSub}>Mission-Critical Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
