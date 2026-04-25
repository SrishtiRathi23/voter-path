import React from 'react';

const BallotBox = ({ className = '' }) => (
  <svg 
    viewBox="0 0 200 240" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`animate-float ${className}`}
    aria-label="Ballot Box Illustration"
    role="img"
  >
    {/* Box Body */}
    <path d="M40 100L160 100L180 220L20 220Z" fill="#1A237E" />
    {/* Box Lid */}
    <path d="M20 70L180 70L160 100L40 100Z" fill="#FF6B00" />
    <path d="M30 60L170 60L180 70L20 70Z" fill="#E65C00" />
    {/* Ballot Slot */}
    <rect x="70" y="80" width="60" height="10" rx="5" fill="#1A1A1A" />
    {/* Inserted Paper */}
    <path d="M85 30H115V85H85V30Z" fill="#FFFFFF" />
    <line x1="90" y1="40" x2="110" y2="40" stroke="#1A237E" strokeWidth="2" strokeLinecap="round" />
    <line x1="90" y1="50" x2="105" y2="50" stroke="#1A237E" strokeWidth="2" strokeLinecap="round" />
    <line x1="90" y1="60" x2="110" y2="60" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
    {/* Seal/Emblem outline */}
    <circle cx="100" cy="150" r="20" stroke="#FFFFFF" strokeWidth="3" />
    <circle cx="100" cy="150" r="10" fill="#FFFFFF" />
  </svg>
);

export default BallotBox;
