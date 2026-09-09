import React, { useState } from 'react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import IndustrySection from './IndustrySection';
import styles from './IndustryDetail.module.css';

export default function IndustryDetail({ industries }) {
  const [selectedTab, setSelectedTab] = useState('All');

  const displayedIndustries = selectedTab === 'All'
    ? industries
    : industries.filter((ind) => ind.name === selectedTab);

  return (
    <section className={`section-spacing ${styles.section}`} id="industry-details" aria-label="Industry Deep Dive">
      <div className="container">
        <SectionHeading
          title="Sector Methodologies &amp; Capabilities"
          subtitle="How Slidevance structures information for distinct decision environments, audience expectations, and regulatory frameworks."
          align="center"
        />

        {/* Practice Filter Navigation */}
        <div className={styles.tabNavWrapper}>
          <div className={styles.tabNavTrack}>
            <button
              type="button"
              className={`${styles.tabBtn} ${selectedTab === 'All' ? styles.activeTabBtn : ''}`}
              onClick={() => setSelectedTab('All')}
            >
              View All ({industries.length})
            </button>
            {industries.map((ind) => (
              <button
                key={ind.name}
                type="button"
                className={`${styles.tabBtn} ${selectedTab === ind.name ? styles.activeTabBtn : ''}`}
                onClick={() => setSelectedTab(ind.name)}
              >
                {ind.name}
              </button>
            ))}
          </div>
        </div>

        {/* Industry Detail Cards */}
        <div className={styles.detailsList}>
          {displayedIndustries.map((ind) => (
            <IndustrySection
              key={ind.name}
              number={ind.number}
              icon={ind.icon}
              title={ind.name}
              description={ind.description}
              challenges={ind.challenges}
              capabilities={ind.capabilities}
              accentColor={ind.accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
