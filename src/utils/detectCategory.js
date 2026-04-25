/**
 * detectCategory.js
 * Rule-based category detection for user questions.
 * Decoupled from Gemini service for testability and reuse.
 * Categories map 1:1 with Firestore question_categories documents.
 */

/**
 * Detects the ECI topic category of a user question using keyword rules.
 * @param {string} text - Raw user question text
 * @returns {'registration'|'booth'|'voter_id'|'evm'|'nota'|'complaints'|null}
 */
export function detectCategory(text) {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase();

  if (lower.match(/register|registr|enrolled|voter list|roll|form 6|epic.*apply/))
    return 'registration';

  if (lower.match(/booth|polling station|where.*vote|find.*booth|location/))
    return 'booth';

  if (lower.match(/voter id|epic card|id card|identity|aadhaar|document|what.*id|what.*carry/))
    return 'voter_id';

  if (lower.match(/evm|machine|button|press|vvpat|hack|tamper|vote.*machine/))
    return 'evm';

  if (lower.match(/nota|none of the above|reject|protest vote/))
    return 'nota';

  if (lower.match(/complain|report|cvigil|bribe|money|threaten|impersonat/))
    return 'complaints';

  return null;
}
