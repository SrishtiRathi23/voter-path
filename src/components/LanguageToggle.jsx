import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const languages = [
  { code: 'EN', label: 'EN' },
  { code: 'HI', label: 'हि' },
  { code: 'TA', label: 'த' }
];

const LanguageToggle = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <div className="flex bg-navy-light rounded-full p-1" role="group" aria-label="Language Selection">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          aria-pressed={language === lang.code}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors focus:ring-2 focus:ring-saffron focus:outline-none ${
            language === lang.code
              ? 'bg-saffron text-white shadow-sm'
              : 'text-navy hover:bg-gray-200'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
