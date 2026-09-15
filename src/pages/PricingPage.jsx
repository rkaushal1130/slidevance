import React, { useEffect } from 'react';
import PricingHero from '../components/pricing/PricingHero/PricingHero';
import PricingPlansCarousel from '../components/pricing/PricingPlansCarousel/PricingPlansCarousel';
import PricingSubscription from '../components/pricing/PricingSubscription/PricingSubscription';
import PricingOffer from '../components/pricing/PricingOffer/PricingOffer';
import PricingWhyChoose from '../components/pricing/PricingWhyChoose/PricingWhyChoose';

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Investment & Flexible Engagement | Slidevance Pricing';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Transparent pricing and flexible engagement models to match your needs — whether it’s a one-off project, ongoing support, or a dedicated resource.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content =
        'Transparent pricing and flexible engagement models to match your needs — whether it’s a one-off project, ongoing support, or a dedicated resource.';
      document.head.appendChild(metaDesc);
    }
  }, []);

  return (
    <main id="main-content" tabIndex={-1}>
      <PricingHero />
      <PricingPlansCarousel />
      <PricingSubscription />
      <PricingOffer />
      <PricingWhyChoose />
    </main>
  );
}

