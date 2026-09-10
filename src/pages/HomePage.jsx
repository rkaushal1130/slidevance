import React, { useEffect } from 'react';
import Hero from '../components/home/Hero/Hero';
import PositioningStrip from '../components/home/PositioningStrip/PositioningStrip';
import IntroSection from '../components/home/IntroSection/IntroSection';
import WhatSetsUsApart from '../components/home/WhatSetsUsApart/WhatSetsUsApart';
import ShowcaseCarousel from '../components/home/ShowcaseCarousel/ShowcaseCarousel';
import Process from '../components/home/Process/Process';
import PromiseSection from '../components/home/PromiseSection/PromiseSection';
export default function HomePage() {
  useEffect(() => {
    document.title = 'SLIDEVANCE | Creative Presentation & Business Communication Studio';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Slidevance combines narrative strategy, research, and corporate visual design to build presentation materials engineered for high-stakes decisions.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content =
        'Slidevance combines narrative strategy, research, and corporate visual design to build presentation materials engineered for high-stakes decisions.';
      document.head.appendChild(metaDesc);
    }
  }, []);
  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. Large Premium Hero */}
      <Hero />

      {/* 2. Positioning Strip with Thin Gradient Line */}
      <PositioningStrip />

      {/* 3. Clean Two-Column Intro Section */}
      <IntroSection />

      {/* 4. What Sets Us Apart (4 Feature Cards) */}
      <WhatSetsUsApart />

      {/* 5. Work Showcase Cards Slider */}
      <ShowcaseCarousel />

      {/* 6. Process: From Brief to Boardroom (5-Phase Timeline) */}
      <Process />

      {/* 7. Dark Navy Promise Section */}
      <PromiseSection />
    </main>
  );
}
