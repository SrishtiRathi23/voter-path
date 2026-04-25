import React from 'react';

const VoterCard = ({ className = '' }) => (
  <svg 
    viewBox="0 0 300 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Voter ID Card Illustration"
    role="img"
  >
    {/* Card base */}
    <rect x="10" y="10" width="280" height="180" rx="15" fill="#FFFFFF" stroke="#1A237E" strokeWidth="4" />
    {/* Header */}
    <rect x="12" y="12" width="276" height="40" rx="13" fill="#1A237E" />
    <rect x="12" y="50" width="276" height="5" fill="#FF6B00" />
    <text x="150" y="38" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ELECTION COMMISSION OF INDIA</text>
    {/* Photo placeholder */}
    <rect x="30" y="70" width="60" height="80" rx="5" fill="#E8EAF6" stroke="#1A237E" strokeWidth="2" />
    {/* User silhouette */}
    <circle cx="60" cy="100" r="15" fill="#1A237E" />
    <path d="M40 145C40 130 80 130 80 145V150H40V145Z" fill="#1A237E" />
    {/* Text lines */}
    <rect x="110" y="80" width="120" height="8" rx="4" fill="#1A237E" />
    <rect x="110" y="100" width="150" height="8" rx="4" fill="#E8EAF6" />
    <rect x="110" y="120" width="100" height="8" rx="4" fill="#E8EAF6" />
    {/* Hologram */}
    <circle cx="250" cy="160" r="15" fill="#FF6B00" opacity="0.8" />
  </svg>
);

export default VoterCard;
