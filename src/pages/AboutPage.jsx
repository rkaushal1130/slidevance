import React, { useEffect } from 'react';
import AboutHero from '../components/about/AboutHero/AboutHero';
import AboutIntro from '../components/about/AboutIntro/AboutIntro';
import AboutSetsUsApart from '../components/about/AboutSetsUsApart/AboutSetsUsApart';
import HowWeThink from '../components/about/HowWeThink/HowWeThink';
import OurPromise from '../components/about/OurPromise/OurPromise';
import SlidevanceAdvantage from '../components/about/SlidevanceAdvantage/SlidevanceAdvantage';
import DeliveryCapabilities from '../components/about/DeliveryCapabilities/DeliveryCapabilities';
import DarkVisualSection from '../components/about/DarkVisualSection/DarkVisualSection';
import AboutCTA from '../components/about/AboutCTA/AboutCTA';

export default function AboutPage() {
  useEffect(() => {
    // SEO Meta Title and Description
    document.title = 'About Slidevance | Creative Presentation & Business Communication';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Learn how Slidevance combines narrative strategy, research and intelligent visual design to transform complex business information into clear, decision-ready communication.'
      );
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content =
        'Learn how Slidevance combines narrative strategy, research and intelligent visual design to transform complex business information into clear, decision-ready communication.';
      document.head.appendChild(metaDescription);
    }
  }, []);

  return (
    <main>
      {/* 1. Page Hero */}
      <AboutHero />

      {/* 2. Introduction */}
      <AboutIntro />

      {/* 3. What Sets Us Apart */}
      <AboutSetsUsApart />

      {/* 4. How We Think (3 Connected Stages) */}
      <HowWeThink />

      {/* 5. Our Promise (Light Blue with Geometric Corner Accents) */}
      <OurPromise />

      {/* 6. Slidevance Advantage (5 Enterprise Blocks) */}
      <SlidevanceAdvantage />

      {/* 7. Delivery Capabilities (4 Minimal Columns) */}
      <DeliveryCapabilities />

      {/* 8. Dark Visual Section (#092B63 with Geometric Visual) */}
      <DarkVisualSection />

      {/* 9. Final Call to Action */}
      <AboutCTA />
    </main>
  );
}
