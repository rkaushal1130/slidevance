import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import IndustriesPage from './pages/IndustriesPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route
          path="/services"
          element={
            <PlaceholderPage
              title="Studio Services"
              subtitle="End-to-end visual communication, narrative strategy, and intelligent design."
            />
          }
        />
        <Route
          path="/contact"
          element={
            <PlaceholderPage
              title="Start a Project"
              subtitle="Let's advance your next critical deliverable. Reach out directly at hello@slidevance.com."
            />
          }
        />
        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
