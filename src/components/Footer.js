import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const handleClick = (e) => {
    e.preventDefault();
    alert("Fitur ini akan segera hadir. Saat ini aplikasi masih dalam tahap pengembangan (MVP).");
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__title">
          Questions? Call <a href="tel:0800-000-0000">0800-000-0000</a>
        </p>
        
        <div className="footer__links">
          <Link to="/" onClick={handleClick} className="footer__link">FAQ</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Help Center</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Account</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Media Center</Link>
          
          <Link to="/" onClick={handleClick} className="footer__link">Investor Relations</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Jobs</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Ways to Watch</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Terms of Use</Link>
          
          <Link to="/" onClick={handleClick} className="footer__link">Privacy</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Cookie Preferences</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Corporate Information</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Contact Us</Link>
          
          <Link to="/" onClick={handleClick} className="footer__link">Speed Test</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Legal Notices</Link>
          <Link to="/" onClick={handleClick} className="footer__link">Only on FlixUI</Link>
        </div>
        
        <div className="footer__bottom">
          <p className="footer__brand">FlixUI Indonesia</p>
          <p className="footer__brand" style={{fontSize: '0.75rem', marginTop: 0}}>Built by Archon - Sovereign Systems Architect</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
