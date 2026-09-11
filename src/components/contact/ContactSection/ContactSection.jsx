import React from 'react';
import ContactSidebar from '../ContactSidebar/ContactSidebar';
import ContactForm from '../ContactForm/ContactForm';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <section className={`section-spacing ${styles.section}`} aria-label="Contact and Inquiry Form">
      <div className={`container ${styles.gridContainer}`}>
        {/* Left Column: Contact Introduction, Studio Email, Pillars */}
        <div className={`${styles.leftCol} reveal-on-scroll`}>
          <ContactSidebar />
        </div>

        {/* Right Column: Contact Form */}
        <div className={`${styles.rightCol} reveal-on-scroll reveal-delay-2`}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
