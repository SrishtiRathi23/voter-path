/**
 * TranslateText.jsx
 * A lightweight React component that translates its string children
 * using the active language from LanguageContext.
 *
 * Usage:
 *   <TranslateText>Register to Vote</TranslateText>
 *
 * - Non-string children are passed through unchanged
 * - Falls back to original text on translation error
 * - Caching is handled by the translateText service layer
 */
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const TranslateText = ({ children }) => {
  const { language, t } = useContext(LanguageContext);
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    let isMounted = true;

    // Pass non-string children through unchanged (JSX, numbers, etc.)
    if (typeof children !== 'string') {
      setTranslated(children);
      return;
    }

    // No translation needed for English
    if (language === 'EN') {
      setTranslated(children);
      return;
    }

    const translate = async () => {
      try {
        const res = await t(children);
        if (isMounted) setTranslated(res);
      } catch {
        // Graceful fallback: show original text if translation fails
        if (isMounted) setTranslated(children);
      }
    };

    translate();

    return () => { isMounted = false; };
  }, [children, language, t]);

  return <>{translated}</>;
};

export default TranslateText;
