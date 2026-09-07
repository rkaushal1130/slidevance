import React from 'react';
import ContactSidebar from '../ContactSidebar/ContactSidebar';
import ContactForm from '../ContactForm/ContactForm';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Contact and Inquiry Form">
      <div className={`container ${styles.gridContainer}`}>
        {/* Left Column: Contact Introduction, Studio Email, Pillars */}
        <div className={styles.leftCol}>
          <ContactSidebar />
        </div>

        {/* Right Column: Contact Form */}
        <div className={styles.rightCol}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
