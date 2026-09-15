import React, { useEffect } from 'react';
import ContactHero from '../components/contact/ContactHero/ContactHero';
import ContactSection from '../components/contact/ContactSection/ContactSection';
import ContactTrustSection from '../components/contact/ContactTrustSection/ContactTrustSection';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Slidevance | Let’s Create Something Extraordinary';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Contact Slidevance to discuss presentation design, business documents, marketing collateral, research and data storytelling.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content =
        'Contact Slidevance to discuss presentation design, business documents, marketing collateral, research and data storytelling.';
      document.head.appendChild(metaDesc);
    }
  }, []);

  return (
    <main id="main-content" tabIndex={-1}>
      <ContactHero />
      <ContactSection />
      <ContactTrustSection />
    </main>
  );
}
