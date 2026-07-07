import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__title">
          Questions? Call <a href="tel:0800-000-0000">0800-000-0000</a>
        </p>
        
        <div className="footer__links">
          <a href="#" className="footer__link">FAQ</a>
          <a href="#" className="footer__link">Help Center</a>
          <a href="#" className="footer__link">Account</a>
          <a href="#" className="footer__link">Media Center</a>
          
          <a href="#" className="footer__link">Investor Relations</a>
          <a href="#" className="footer__link">Jobs</a>
          <a href="#" className="footer__link">Ways to Watch</a>
          <a href="#" className="footer__link">Terms of Use</a>
          
          <a href="#" className="footer__link">Privacy</a>
          <a href="#" className="footer__link">Cookie Preferences</a>
          <a href="#" className="footer__link">Corporate Information</a>
          <a href="#" className="footer__link">Contact Us</a>
          
          <a href="#" className="footer__link">Speed Test</a>
          <a href="#" className="footer__link">Legal Notices</a>
          <a href="#" className="footer__link">Only on FlixUI</a>
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
