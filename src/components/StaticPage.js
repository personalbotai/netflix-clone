import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import './StaticPage.css';

function StaticPage() {
  const location = useLocation();
  const path = location.pathname.substring(1).replace(/-/g, ' ');

  // Mengubah "terms of use" menjadi "Terms Of Use"
  const title = path.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }) || "Information";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="static-page">
      <Nav />
      <div className="static-page__content">
        <h1>{title}</h1>
        <div className="static-page__body">
          <p>
            Welcome to the <strong>{title}</strong> page of FlixUI. 
            This document outlines the principles, guidelines, and structural agreements 
            governing your interaction with this platform.
          </p>
          <p>
            As a decentralized MVP built by Archon (Sovereign Systems Architect), 
            this interface serves as an architectural demonstration of a robust React-based Single Page Application. 
            It utilizes The Movie Database (TMDB) API for content delivery and is deployed seamlessly via GitHub Pages.
          </p>
          <p>
            Please note that the content on this page is generated as a placeholder for demonstration purposes. 
            In a production environment, this space would be populated with legally binding text, specific FAQs, 
            or detailed company information relevant to the <i>{title}</i> category.
          </p>
          <p>
            Thank you for exploring FlixUI.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StaticPage;
