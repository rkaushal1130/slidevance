import React from 'react';
import { Clock, Zap, ArrowRight } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import Button from '../../common/Button/Button';
import styles from './TurnaroundTable.module.css';

export default function TurnaroundTable() {

  const rows = [
    {
      deliverable: 'Executive One-Pager / Service Sheet',
      category: 'collateral',
      scope: '1–2 Page Strategic Brief',
      standard: '24–48 Hours',
      express: '12–24 Hours',
      expressAvailable: true
    },
    {
      deliverable: 'Presentation Deck',
      category: 'deck',
      scope: '10–20 Core Narrative Slides',
      standard: '3–5 Business Days',
      express: '24–48 Hours',
      expressAvailable: true
    },
    {
      deliverable: 'Comprehensive Deck',
      category: 'deck',
      scope: '25–45+ High-Density Slides',
      standard: '5–7 Business Days',
      express: '48–72 Hours',
      expressAvailable: true
    },
    {
      deliverable: 'Interactive Deck & Master Template',
      category: 'template',
      scope: 'Custom Master Layouts & Navigation',
      standard: '5–7 Business Days',
      express: '3–4 Business Days',
      expressAvailable: true
    },
    {
      deliverable: 'Proposal, Bid & RFP Document',
      category: 'rfp',
      scope: 'Full Tender & Technical Architecture',
      standard: '4–6 Business Days',
      express: '48 Hours',
      expressAvailable: true
    },
    {
      deliverable: 'Desk Research & Market Benchmarking',
      category: 'research',
      scope: 'Landscape Analysis & Insight Deck',
      standard: '3–5 Business Days',
      express: '24–48 Hours',
      expressAvailable: true
    }
  ];

  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Delivery Timelines & Urgency Support">
      <div className="container">
        <SectionHeading
          title="Delivery Timelines &amp; Urgency Support"
          subtitle="Engineered for high-stakes decision timelines with active weekend availability for critical boardroom deadlines."
          align="center"
          maxWidth="780px"
        />

        {/* Desktop Table View */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thDeliverable}>Deliverable</th>
                <th className={styles.thScope}>Typical Scope</th>
                <th className={styles.thStandard}>
                  <div className={styles.thHeaderInner}>
                    <Clock size={16} />
                    <span>Standard Turnaround</span>
                  </div>
                </th>
                <th className={styles.thExpress}>
                  <div className={styles.thHeaderInner}>
                    <Zap size={16} className={styles.zapIcon} />
                    <span>Express Turnaround</span>
                    <span className={styles.expressBadge}>24/7 SUPPORT</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.deliverable} className={styles.tableRow}>
                  <td className={styles.tdDeliverable}>
                    <div className={styles.deliverableCell}>
                      <span className={styles.deliverableName}>{row.deliverable}</span>
                    </div>
                  </td>
                  <td className={styles.tdScope}>{row.scope}</td>
                  <td className={styles.tdStandard}>
                    <span className={styles.timeTagStandard}>{row.standard}</span>
                  </td>
                  <td className={styles.tdExpress}>
                    <div className={styles.expressCell}>
                      <span className={styles.timeTagExpress}>{row.express}</span>
                      <span className={styles.weekendTag}>Active Weekend</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className={styles.mobileCardsList}>
          {rows.map((row) => (
            <div key={row.deliverable} className={styles.mobileCard}>
              <div className={styles.mobileCardHeader}>
                <h4 className={styles.mobileDeliverableTitle}>{row.deliverable}</h4>
                <span className={styles.mobileScopeTag}>{row.scope}</span>
              </div>

              <div className={styles.mobileTimelinesGrid}>
                <div className={styles.mobileTimeCol}>
                  <div className={styles.mobileColLabel}>
                    <Clock size={14} />
                    <span>Standard</span>
                  </div>
                  <span className={styles.mobileTimeVal}>{row.standard}</span>
                </div>

                <div className={`${styles.mobileTimeCol} ${styles.mobileExpressCol}`}>
                  <div className={styles.mobileColLabel}>
                    <Zap size={14} className={styles.zapIcon} />
                    <span>Express (24/7)</span>
                  </div>
                  <span className={styles.mobileTimeValExpress}>{row.express}</span>
                  <span className={styles.mobileWeekendPill}>Active Weekend</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Urgency Note Strip */}
        <div className={styles.urgencyStrip}>
          <div className={styles.urgencyText}>
            <strong>Facing an imminent deadline?</strong> Our studio maintains around-the-clock availability with dedicated weekend coverage for time-critical proposals and executive briefings.
          </div>
          <Button
            to="/contact"
            variant="primary"
            size="sm"
            icon={<ArrowRight size={14} />}
          >
            Request Urgent Turnaround
          </Button>
        </div>
      </div>
    </section>
  );
}
