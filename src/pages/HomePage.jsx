import React from 'react';
import Hero from '../components/home/Hero/Hero';
import PositioningStrip from '../components/home/PositioningStrip/PositioningStrip';
import IntroSection from '../components/home/IntroSection/IntroSection';
import WhatSetsUsApart from '../components/home/WhatSetsUsApart/WhatSetsUsApart';
import ServicesPreview from '../components/home/ServicesPreview/ServicesPreview';
import Process from '../components/home/Process/Process';
import PromiseSection from '../components/home/PromiseSection/PromiseSection';
import FinalCTA from '../components/home/FinalCTA/FinalCTA';

export default function HomePage() {
  return (
    <main>
      {/* 1. Large Premium Hero */}
      <Hero />

      {/* 2. Positioning Strip with Thin Gradient Line */}
      <PositioningStrip />

      {/* 3. Clean Two-Column Intro Section */}
      <IntroSection />

      {/* 4. What Sets Us Apart (4 Feature Cards) */}
      <WhatSetsUsApart />

      {/* 5. Services Preview (6 Service Cards) */}
      <ServicesPreview />

      {/* 6. Process: From Brief to Boardroom (5-Phase Timeline) */}
      <Process />

      {/* 7. Dark Navy Promise Section */}
      <PromiseSection />

      {/* 8. Final Call to Action */}
      <FinalCTA />
    </main>
  );
}
