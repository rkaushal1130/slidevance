import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './DarkVisualSection.module.css';

export default function DarkVisualSection() {
  return (
    <section className={styles.darkSection} aria-label="Visual Narrative Transformation">
      {/* Background Soft Glow */}
      <div className={styles.glow} />

      <div className={`container ${styles.container}`}>
        <div className={styles.contentCol}>
          <h2 className={styles.heading}>
            From Raw Data
            <br />
            to <span className={styles.highlightLogic}>Business Logic</span>
            <br />
            to <span className="gradient-text">Visual Narrative.</span>
          </h2>

          <p className={styles.leadText}>
            Executive audiences do not need more slides; they need total clarity. We bridge
            the gap between dense operational information and intuitive visual authority.
          </p>

          <div className={styles.transformationList}>
            <div className={styles.transformItem}>
              <div className={styles.checkIcon}>
                <CheckCircle2 size={20} />
              </div>
              <div className={styles.itemText}>
                <span className={styles.itemTitle}>Raw Data Ingestion</span>
                <span className={styles.itemDesc}>Untangling complex spreadsheets, models, and technical specs.</span>
              </div>
            </div>

            <div className={styles.transformItem}>
              <div className={styles.checkIcon}>
                <CheckCircle2 size={20} />
              </div>
              <div className={styles.itemText}>
                <span className={styles.itemTitle}>Strategic Synthesis</span>
                <span className={styles.itemDesc}>Distilling the single core argument that drives decision conviction.</span>
              </div>
            </div>

            <div className={styles.transformItem}>
              <div className={styles.checkIcon}>
                <CheckCircle2 size={20} />
              </div>
              <div className={styles.itemText}>
                <span className={styles.itemTitle}>Executive Presentation</span>
                <span className={styles.itemDesc}>Engineered for the boardroom, investor rounds, and enterprise bids.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
