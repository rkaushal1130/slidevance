import React, { useState, useEffect } from 'react';
import AboutHero from '../components/about/AboutHero/AboutHero';
import AboutProcess from '../components/about/AboutProcess/AboutProcess';
import AboutDNA from '../components/about/AboutDNA/AboutDNA';
import AboutTeam from '../components/about/AboutTeam/AboutTeam';
import AboutPromise from '../components/about/AboutPromise/AboutPromise';
import AboutCTA from '../components/about/AboutCTA/AboutCTA';
import { getPublicSettings } from '../api/settings';

export default function AboutPage() {
  const [settings, setSettings] = useState({
    companyName: 'SlideVance',
    tagline: 'Ideas That Slide. Solutions That Advance.',
    contactEmail: 'hello@slidevance.com',
  });

  useEffect(() => {
    // SEO Meta Title and Description
    document.title = `${settings.companyName} | About | ${settings.tagline}`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Learn how ${settings.companyName} transforms complex business information into clear, compelling and visually powerful stories. We don't make slides. We make ideas visible.`
      );
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content =
        `Learn how ${settings.companyName} transforms complex business information into clear, compelling and visually powerful stories. We don't make slides. We make ideas visible.`;
      document.head.appendChild(metaDescription);
    }
  }, [settings]);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const response = await getPublicSettings();
        if (response?.data && isMounted) {
          setSettings((prev) => ({
            ...prev,
            ...response.data,
          }));
        }
      } catch {
        // Retain default safe settings gracefully
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. Page Hero: "We don't make slides. We make ideas visible." */}
      <AboutHero settings={settings} />

      {/* 2. Our Process: "From confusion to clarity." */}
      <AboutProcess />

      {/* 3. Our DNA: "Five values. One vision." */}
      <AboutDNA />

      {/* 4. The Team: "Different minds. Same goal." */}
      <AboutTeam />

      {/* 5. Our Promise: "More than just slides. We design what you need." */}
      <AboutPromise />

      {/* 6. Call to Action: "Your idea deserves more than a bullet point." */}
      <AboutCTA />
    </main>
  );
}
