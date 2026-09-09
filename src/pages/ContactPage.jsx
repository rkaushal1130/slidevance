import React, { useEffect } from 'react';
import ContactHero from '../components/contact/ContactHero/ContactHero';
import ContactSection from '../components/contact/ContactSection/ContactSection';
import ContactFAQ from '../components/contact/ContactFAQ/ContactFAQ';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Slidevance | Start a Project';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Contact Slidevance to discuss presentation design, business communication, RFPs, research, data storytelling and ongoing design support.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content =
        'Contact Slidevance to discuss presentation design, business communication, RFPs, research, data storytelling and ongoing design support.';
      document.head.appendChild(metaDesc);
    }
  }, []);

  return (
    <main id="main-content" tabIndex={-1}>
      <ContactHero />
      <ContactSection />
      <ContactFAQ />
    </main>
  );
}
