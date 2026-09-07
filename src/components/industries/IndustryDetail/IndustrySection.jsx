import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './IndustryDetail.module.css';

export default function IndustrySection({
  title,
  number,
  icon: Icon,
  challenges,
  capabilities,
  description,
  accentColor = 'blue'
}) {
  return (
    <div className={`${styles.industrySectionCard} ${styles[`card_${accentColor}`]}`} id={`industry-${number}`}>
      <div className={styles.sectionCardHeader}>
        <div className={styles.headerLeft}>
          <div className={`${styles.iconWrap} ${styles[`icon_${accentColor}`]}`}>
            {Icon && <Icon size={24} strokeWidth={1.8} />}
          </div>
          <div>
            <span className={styles.sectionNumber}>PRACTICE SECTOR {number}</span>
            <h3 className={styles.sectionTitle}>{title}</h3>
          </div>
        </div>
        <span className={styles.badgePill}>COMMUNICATION PROFILE</span>
      </div>

      {description && (
        <p className={styles.sectionDesc}>{description}</p>
      )}

      <div className={styles.sectionColumns}>
        {/* Challenges Column */}
        <div className={styles.challengeBox}>
          <div className={styles.boxHeader}>
            <AlertCircle size={17} className={styles.challengeIcon} />
            <h4 className={styles.boxTitle}>Typical Communication Challenges</h4>
          </div>
          <p className={styles.boxText}>{challenges}</p>
        </div>

        {/* Capabilities Column */}
        <div className={styles.capabilitiesBox}>
          <div className={styles.boxHeader}>
            <CheckCircle2 size={17} className={styles.capabilityIcon} />
            <h4 className={styles.boxTitle}>Relevant Slidevance Capabilities</h4>
          </div>
          <div className={styles.capabilityPills}>
            {capabilities.map((cap) => (
              <span key={cap} className={styles.capabilityPill}>
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sectionFooter}>
        <Button
          to="/contact"
          variant="outline"
          size="sm"
          icon={<ArrowRight size={14} />}
        >
          Discuss {title} Deliverable
        </Button>
      </div>
    </div>
  );
}
