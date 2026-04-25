import React from 'react';

const IndiaMapOutline = ({ className = '' }) => (
  <svg 
    viewBox="0 0 400 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="India Map Outline"
    role="img"
  >
    <defs>
      <linearGradient id="saffronGradient" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF3E0" />
        <stop offset="1" stopColor="#FAFAFA" />
      </linearGradient>
    </defs>
    <path d="M150 50L200 20L250 60L230 100L280 120L320 180L300 220L250 280L200 350L150 280L100 200L80 150L120 100L150 50Z" fill="url(#saffronGradient)" stroke="#FF6B00" strokeWidth="2" strokeOpacity="0.2" />
    <circle cx="180" cy="110" r="4" fill="#1A237E" />
  </svg>
);

export default IndiaMapOutline;
