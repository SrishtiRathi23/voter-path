/**
 * Phase 2 Tests — VoterPath India
 * Tests: JSON response parsing, rate limit blocking, guardrail detection, category detection
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectCategory, RateLimitError } from '../services/gemini';
import knowledgeBase from '../data/eci-knowledge-base.json';

// ─── 1. Knowledge Base Structure Tests ────────────────────────────────────────
describe('Knowledge Base Validation', () => {
  it('should have at least 50 entries', () => {
    expect(knowledgeBase.length).toBeGreaterThanOrEqual(50);
  });

  it('each entry must have required fields: id, category, question, answer, source, last_verified', () => {
    const required = ['id', 'category', 'question', 'answer', 'source', 'last_verified'];
    knowledgeBase.forEach((entry, idx) => {
      required.forEach((field) => {
        expect(entry, `Entry ${idx} (${entry.id}) is missing field: ${field}`).toHaveProperty(field);
        expect(entry[field], `Entry ${idx} field "${field}" must not be empty`).toBeTruthy();
      });
    });
  });

  it('all categories must be from the allowed set', () => {
    const allowed = ['registration', 'voter_id', 'booth', 'evm', 'nota', 'complaints'];
    knowledgeBase.forEach((entry) => {
      expect(allowed).toContain(entry.category);
    });
  });

  it('all source fields must be valid URLs', () => {
    knowledgeBase.forEach((entry) => {
      expect(() => new URL(entry.source)).not.toThrow();
    });
  });

  it('all IDs must be unique', () => {
    const ids = knowledgeBase.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('answers must not contain specific hardcoded election dates', () => {
    // Ensure no entry hardcodes election-specific dates like "2024 elections"
    const datePattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi;
    knowledgeBase.forEach((entry) => {
      const matches = entry.answer.match(datePattern);
      expect(
        matches,
        `Entry ${entry.id} contains hardcoded date: ${matches}`
      ).toBeNull();
    });
  });
});

// ─── 2. JSON Parsing Validation ────────────────────────────────────────────────
describe('Gemini JSON Response Parsing', () => {
  it('should parse a valid Gemini JSON response correctly', () => {
    const rawResponse = JSON.stringify({
      answer: 'You can check your registration at voters.eci.gov.in.',
      source: 'https://voters.eci.gov.in',
      confidence: 0.97,
      next_step: 'Find your polling booth next.',
      category: 'registration',
    });

    const parsed = JSON.parse(rawResponse);
    expect(parsed.answer).toBeTruthy();
    expect(parsed.confidence).toBe(0.97);
    expect(parsed.source).toContain('eci.gov.in');
    expect(parsed.category).toBe('registration');
    expect(parsed.next_step).toBeTruthy();
  });

  it('should handle invalid JSON gracefully — parse should throw', () => {
    const badResponse = 'Here is your answer: You can vote at 7am. No JSON here.';
    expect(() => JSON.parse(badResponse)).toThrow();
  });

  it('confidence should be clamped to 0.0–1.0 range', () => {
    const clamp = (val) => Math.max(0, Math.min(1, parseFloat(val)));
    expect(clamp(1.5)).toBe(1.0);
    expect(clamp(-0.3)).toBe(0.0);
    expect(clamp(0.85)).toBe(0.85);
  });

  it('should identify incomplete response (missing answer field)', () => {
    const incompleteResponse = { source: 'https://voters.eci.gov.in', confidence: 0.9 };
    const isValid = incompleteResponse.answer && incompleteResponse.confidence !== undefined;
    expect(isValid).toBeFalsy();
  });
});

// ─── 3. Category Detection Tests ─────────────────────────────────────────────
describe('detectCategory()', () => {
  it('detects registration queries', () => {
    expect(detectCategory('How do I register to vote?')).toBe('registration');
    expect(detectCategory('Am I enrolled on the voter list?')).toBe('registration');
    expect(detectCategory('How to fill form 6?')).toBe('registration');
  });

  it('detects booth queries', () => {
    expect(detectCategory('Where is my polling booth?')).toBe('booth');
    expect(detectCategory('Find booth location')).toBe('booth');
    expect(detectCategory('Where do I vote?')).toBe('booth');
  });

  it('detects voter_id queries', () => {
    expect(detectCategory('What is my EPIC card?')).toBe('voter_id');
    expect(detectCategory('I lost my voter id card')).toBe('voter_id');
    expect(detectCategory('Can I vote using Aadhaar as identity?')).toBe('voter_id');
  });

  it('detects EVM queries', () => {
    expect(detectCategory('How does the EVM machine work?')).toBe('evm');
    expect(detectCategory('Can EVM be hacked?')).toBe('evm');
    expect(detectCategory('What is VVPAT machine?')).toBe('evm');
  });

  it('detects NOTA queries', () => {
    expect(detectCategory('What is NOTA?')).toBe('nota');
    expect(detectCategory('I want to vote none of the above')).toBe('nota');
    expect(detectCategory('Is protest vote valid?')).toBe('nota');
  });

  it('detects complaints queries', () => {
    expect(detectCategory('How do I report bribery?')).toBe('complaints');
    expect(detectCategory('Someone is threatening voters')).toBe('complaints');
    expect(detectCategory('cVIGIL app how to use')).toBe('complaints');
  });

  it('returns null for unrecognized queries', () => {
    expect(detectCategory('What is the weather today?')).toBeNull();
    expect(detectCategory('Hello there')).toBeNull();
  });
});

// ─── 4. Guardrail Detection Tests ─────────────────────────────────────────────
describe('Guardrail Response Detection', () => {
  const isGuardrailResponse = (parsed) =>
    parsed.category === 'guardrail' ||
    parsed.answer?.includes('factual information about the voting process');

  it('detects a guardrail response for political question', () => {
    const guardrailResponse = {
      answer:
        'I can only provide factual information about the voting process. Please visit https://voters.eci.gov.in',
      source: 'https://voters.eci.gov.in',
      confidence: 1.0,
      next_step: 'Ask about registration, booths, EVMs, or NOTA instead.',
      category: 'guardrail',
    };
    expect(isGuardrailResponse(guardrailResponse)).toBe(true);
  });

  it('does NOT flag a legitimate voting question as guardrail', () => {
    const legitimateResponse = {
      answer: 'You can vote using your Aadhaar card as valid photo ID.',
      source: 'https://voters.eci.gov.in',
      confidence: 0.95,
      next_step: 'Find your polling booth.',
      category: 'voter_id',
    };
    expect(isGuardrailResponse(legitimateResponse)).toBe(false);
  });
});

// ─── 5. Rate Limit Error Class ────────────────────────────────────────────────
describe('RateLimitError', () => {
  it('should be an instance of Error', () => {
    const err = new RateLimitError(30);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(RateLimitError);
  });

  it('should carry the waitSeconds property', () => {
    const err = new RateLimitError(45);
    expect(err.waitSeconds).toBe(45);
    expect(err.name).toBe('RateLimitError');
  });

  it('should have a meaningful message', () => {
    const err = new RateLimitError(10);
    expect(err.message).toBe('Rate limit exceeded');
  });
});

// ─── 6. Input Sanitization Logic Tests ────────────────────────────────────────
describe('Input Validation Logic', () => {
  const validateInput = (text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return { valid: false, reason: 'Too short' };
    if (trimmed.length > 500) return { valid: false, reason: 'Too long' };
    return { valid: true };
  };

  it('rejects empty input', () => {
    expect(validateInput('').valid).toBe(false);
    expect(validateInput('  ').valid).toBe(false);
  });

  it('rejects single-character input', () => {
    expect(validateInput('a').valid).toBe(false);
  });

  it('accepts normal questions', () => {
    expect(validateInput('How do I register to vote?').valid).toBe(true);
  });

  it('rejects input over 500 characters', () => {
    const longInput = 'a'.repeat(501);
    expect(validateInput(longInput).valid).toBe(false);
    expect(validateInput(longInput).reason).toBe('Too long');
  });

  it('accepts exactly 500 characters', () => {
    const exactInput = 'a'.repeat(500);
    expect(validateInput(exactInput).valid).toBe(true);
  });
});
