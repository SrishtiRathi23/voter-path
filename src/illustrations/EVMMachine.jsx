import React from 'react';

const EVMMachine = ({ className = '' }) => (
  <svg 
    viewBox="0 0 160 280" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="EVM Machine Illustration"
    role="img"
  >
    <rect x="20" y="20" width="120" height="240" rx="10" fill="#1A237E" />
    <rect x="30" y="30" width="100" height="220" rx="5" fill="#E8EAF6" />
    {/* Buttons */}
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(0, ${i * 40})`}>
        <rect x="40" y="50" width="40" height="20" rx="2" fill="#FFFFFF" stroke="#1A237E" />
        <rect x="90" y="50" width="30" height="20" rx="10" fill="#FF6B00" />
      </g>
    ))}
    {/* Indicator Light */}
    <circle cx="80" cy="240" r="8" fill="#2E7D32" />
  </svg>
);

export default EVMMachine;
