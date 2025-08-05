import React from 'react';
import { assets } from '../assets/assets';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-branding">
          <img src={assets.logo} alt="QuickAI" className="footer-logo" />
          <p className="footer-copyright">
            © {new Date().getFullYear()} DevMindAI. All rights reserved.
          </p>
        </div>
        <nav className="footer-navigation">
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Terms of Service</a></li>
            <li><a href="#" className="footer-link">Privacy Policy</a></li>
            <li><a href="#" className="footer-link">Contact Us</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;