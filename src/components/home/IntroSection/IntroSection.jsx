import React from 'react';
import { FileCheck2, BarChart3, Users2 } from 'lucide-react';
import GradientLine from '../../common/GradientLine/GradientLine';
import styles from './IntroSection.module.css';

export default function IntroSection() {
  return (
    <section className={`section-spacing ${styles.introSection}`} aria-label="Slidevance Introduction">
      <div className={`container ${styles.introContainer}`}>
        {/* Left Column: Heading & Editorial Accent */}
        <div className={styles.leftCol}>
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>EXECUTIVE CLARITY AT SCALE</span>
          </div>

          <h2 className={styles.introHeading}>
            From Complex Information
            <br />
            <span className="gradient-text">to Powerful Business Stories.</span>
          </h2>

          <div className={styles.gradientLineWrapper}>
            <GradientLine height="3px" width="120px" align="left" />
          </div>

          <p className={styles.sideNote}>
            In high-stakes corporate arenas, comprehension precedes decision. We eliminate narrative ambiguity so your value proposition commands unanimous conviction.
          </p>
        </div>

        {/* Right Column: Lead Text & Editorial Impact Points */}
        <div className={styles.rightCol}>
          <div className={styles.leadTextCard}>
            <p className={styles.leadParagraph}>
              “Slidevance transforms complex business logic, financial data, technical
              specifications and research into clear, compelling visual communication
              designed for executive audiences.”
            </p>
          </div>

          {/* Structured Executive Proof Grid */}
          <div className={styles.pointsGrid}>
            <div className={styles.pointItem}>
              <div className={styles.pointIconWrapper}>
                <BarChart3 size={18} />
              </div>
              <div className={styles.pointContent}>
                <h3 className={styles.pointTitle}>Quantitative Precision</h3>
                <p className={styles.pointDesc}>
                  Multimillion-dollar financial models and dense technical datasets converted into intuitive executive charts.
                </p>
              </div>
            </div>

            <div className={styles.pointItem}>
              <div className={styles.pointIconWrapper}>
                <Users2 size={18} />
              </div>
              <div className={styles.pointContent}>
                <h3 className={styles.pointTitle}>C-Suite Alignment</h3>
                <p className={styles.pointDesc}>
                  Engineered specifically for boards, investors, enterprise procurement teams, and institutional evaluators.
                </p>
              </div>
            </div>

            <div className={styles.pointItem}>
              <div className={styles.pointIconWrapper}>
                <FileCheck2 size={18} />
              </div>
              <div className={styles.pointContent}>
                <h3 className={styles.pointTitle}>Bespoke Architecture</h3>
                <p className={styles.pointDesc}>
                  Zero generic clip-art or off-the-shelf templates. Every layout is custom crafted around your strategic objective.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
