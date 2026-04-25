import React from 'react';
import { ExternalLink } from 'lucide-react';

const ECISourceTag = ({ url, text = "Source: ECI" }) => {
  return (
    <a 
      href={url || "https://voters.eci.gov.in"} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-navy hover:text-saffron transition-colors focus:ring-2 focus:ring-saffron focus:outline-none rounded px-1"
      aria-label={`${text}. Opens in a new tab.`}
    >
      <span className="font-semibold">{text}</span>
      <ExternalLink size={12} />
    </a>
  );
};

export default ECISourceTag;
