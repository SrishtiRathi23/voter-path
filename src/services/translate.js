// src/services/translate.js

const translationCache = new Map();

const glossary = {
  "EPIC": "EPIC",
  "EVM": "EVM",
  "NOTA": "NOTA"
};

/**
 * Translates text using Google Cloud Translation REST API.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - Target language code ('hi', 'ta', 'en').
 * @returns {Promise<string>} - The translated text.
 */
export async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  
  if (glossary[text]) return glossary[text];
  
  const target = targetLang.toLowerCase();
  
  // Return original text if target is English or text is a URL or number
  if (target === 'en') return text;
  if (/^https?:\/\//.test(text.trim())) return text;
  if (!isNaN(parseFloat(text)) && isFinite(text)) return text;
  
  const cacheKey = `${target}_${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const apiKey = import.meta.env.VITE_TRANSLATE_API_KEY;
  if (!apiKey || apiKey === 'REPLACE_WITH_YOUR_KEY') {
    console.warn('Translate API key not set, returning original text.');
    return text;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: target,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data?.data?.translations?.[0]?.translatedText) {
      const translated = data.data.translations[0].translatedText;
      translationCache.set(cacheKey, translated);
      return translated;
    }
    
    return text;
  } catch (err) {
    console.error('Translation failed:', err);
    // Fallback to English/original text
    return text;
  }
}
