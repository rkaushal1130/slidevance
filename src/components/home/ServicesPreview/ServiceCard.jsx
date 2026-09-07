import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './ServicesPreview.module.css';

export default function ServiceCard({
  number,
  icon: Icon,
  title,
  description,
  to = '/services'
}) {
  return (
    <div className={styles.serviceCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          {Icon && <Icon size={22} />}
        </div>
        <span className={styles.serviceNumber}>{number}</span>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.serviceTitle}>{title}</h3>
        <p className={styles.serviceDescription}>{description}</p>
      </div>

      <div className={styles.cardAction}>
        <Link to={to} className={styles.serviceLink} aria-label={`Explore ${title}`}>
          <span>Explore Service</span>
          <ArrowRight size={15} className={styles.linkArrow} />
        </Link>
      </div>
    </div>
  );
}
