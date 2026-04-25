import React from 'react';

const ConfidenceBadge = ({ score }) => {
  if (score === "Static answer") {
    return <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">Static answer</span>;
  }

  const confidence = parseFloat(score);
  let colorClass = "bg-forest-light text-forest-dark border-forest";
  if (confidence < 0.6) {
    colorClass = "bg-red-100 text-red-800 border-red-300";
  } else if (confidence < 0.85) {
    colorClass = "bg-yellow-100 text-yellow-800 border-yellow-400";
  }

  const percent = Math.round(confidence * 100);

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${colorClass}`} aria-label={`${percent}% confident`}>
      {percent}% confident
    </span>
  );
};

export default ConfidenceBadge;
