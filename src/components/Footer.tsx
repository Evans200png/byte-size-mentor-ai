
import React from 'react';
import { Mail, Linkedin, Instagram, Phone } from 'lucide-react';
import { X } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Contact Icons */}
        <div className="flex justify-center items-center gap-8 mb-6">
          {/* Gmail */}
          <a
            href="mailto:kimanievansonk@gmail.com"
            className="text-white hover:text-[#007BFF] transition-all duration-300 hover:scale-110"
            aria-label="Send email to kimanievansonk@gmail.com"
          >
            <Mail size={24} />
          </a>

          {/* LinkedIn */}
          <a
            href="https://ke.linkedin.com/in/evanson-kimani-2770b4331"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#007BFF] transition-all duration-300 hover:scale-110"
            aria-label="Visit LinkedIn profile"
          >
            <Linkedin size={24} />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/kahushvirile/?utm_source=qr&r=nametag"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#007BFF] transition-all duration-300 hover:scale-110"
            aria-label="Visit Instagram profile"
          >
            <Instagram size={24} />
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/kim43364?s=08"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#007BFF] transition-all duration-300 hover:scale-110"
            aria-label="Visit X (Twitter) profile"
          >
            <X size={24} />
          </a>

          {/* Phone */}
          <a
            href="tel:+254727402449"
            className="text-white hover:text-[#007BFF] transition-all duration-300 hover:scale-110"
            aria-label="Call +254 727402449"
          >
            <Phone size={24} />
          </a>
        </div>

        {/* Copyright Text */}
        <div className="text-center text-sm opacity-80">
          © 2025 TechBites. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
