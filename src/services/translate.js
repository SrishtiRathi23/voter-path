// src/services/translate.js

const translationCache = new Map();

// Glossary to prevent literal translation of election jargon
const GLOSSARY = new Set(['EPIC', 'EVM', 'NOTA', 'BLO', 'VVPAT', 'ECI', 'VoterPath']);

/**
 * Translates text using Google Cloud Translation REST API.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - Target language code ('hi', 'ta', 'en').
 * @returns {Promise<string>} - The translated text.
 */
export async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  
  if (GLOSSARY.has(text)) return text;
  
  const target = targetLang.toLowerCase();
  
  // Return original text if target is English or text is a URL or number
  if (target === 'en') return text;
  if (/^https?:\/\//.test(text.trim())) return text;
  if (!isNaN(parseFloat(text)) && isFinite(text)) return text;
  
  const cacheKey = `${target}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  try {
    const local = localStorage.getItem(cacheKey);
    if (local) {
      translationCache.set(cacheKey, local);
      return local;
    }
  } catch(e) {}

  const apiKey = import.meta.env.VITE_TRANSLATE_API_KEY;
  if (!apiKey || apiKey === 'REPLACE_WITH_YOUR_KEY') {
    console.warn('Translate API key not set, returning original text.');
    return text;
  }

  // Pre-process text to protect glossary terms
  let processedText = text;
  GLOSSARY.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    processedText = processedText.replace(regex, `<span translate="no">${term}</span>`);
  });

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: processedText,
        target: target,
        format: 'html' // Enables HTML parsing so span is respected
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data?.data?.translations?.[0]?.translatedText) {
      let translated = data.data.translations[0].translatedText;
      // Post-process: remove protective span tags and fix quotes
      translated = translated.replace(/<span translate="no">/g, '').replace(/<\/span>/g, '');
      translated = translated.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      
      translationCache.set(cacheKey, translated);
      try {
        localStorage.setItem(cacheKey, translated);
      } catch(e) {}
      
      return translated;
    }
    
    return text;
  } catch (err) {
    console.error('Translation failed:', err);
    // Fallback to English/original text
    return text;
  }
}
