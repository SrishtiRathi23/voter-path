import React from 'react';

const VoterFinger = ({ className = '' }) => (
  <svg 
    viewBox="0 0 100 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Voter Finger with Ink Illustration"
    role="img"
  >
    {/* Hand base */}
    <path d="M20 120C20 120 10 150 10 200H90C90 150 80 120 80 120V100C80 90 70 80 50 80C30 80 20 90 20 100V120Z" fill="#F0C7B1" />
    {/* Index Finger */}
    <path d="M40 85V30C40 20 60 20 60 30V85" fill="#F0C7B1" />
    {/* Nail */}
    <path d="M45 25H55V40H45V25Z" fill="#E5B29B" rx="2" />
    {/* Ink Mark */}
    <rect x="45" y="30" width="10" height="35" fill="#283593" />
  </svg>
);

export default VoterFinger;
