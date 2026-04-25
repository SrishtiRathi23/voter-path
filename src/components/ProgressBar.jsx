import React from 'react';

const ProgressBar = ({ progress, className = '' }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);
  const isComplete = percentage === 100;
  
  return (
    <div 
      className={`w-full bg-gray-200 rounded-full h-2.5 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div 
        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-forest' : 'bg-saffron'}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
