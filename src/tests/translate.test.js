// src/test/translate.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Helper: create a fresh translateText with a controlled fetch mock and env
async function getModule(apiKey = 'TEST_TRANSLATE_KEY') {
  vi.resetModules();
  // Patch the key before importing
  import.meta.env.VITE_TRANSLATE_API_KEY = apiKey;
  const mod = await import('../services/translate.js');
  return mod.translateText;
}

describe('translateText service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  // ── Success cases ─────────────────────────────────────────────────────────

  it('translates text correctly when API succeeds', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { translations: [{ translatedText: 'मतदाता' }] },
      }),
    });

    const translateText = await getModule();
    const result = await translateText('voter', 'hi');
    expect(result).toBe('मतदाता');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('translation.googleapis.com'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('returns original text when target is EN (no API call)', async () => {
    const translateText = await getModule();
    const result = await translateText('voter', 'en');
    expect(result).toBe('voter');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  // ── Failure / fallback cases ──────────────────────────────────────────────

  it('falls back to original text when API returns non-OK response', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Quota Exceeded',
    });

    const translateText = await getModule();
    const result = await translateText('register to vote', 'hi');
    expect(result).toBe('register to vote');
  });

  it('falls back to original text when fetch throws (network error)', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network Error'));

    const translateText = await getModule();
    const result = await translateText('polling booth', 'ta');
    expect(result).toBe('polling booth');
  });

  it('returns original text when API key is missing', async () => {
    const translateText = await getModule(''); // blank key
    const result = await translateText('EPIC card', 'hi');
    expect(result).toBe('EPIC card');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('does NOT translate URLs', async () => {
    const translateText = await getModule();
    const url = 'https://voters.eci.gov.in';
    const result = await translateText(url, 'hi');
    expect(result).toBe(url);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('does NOT translate pure numbers', async () => {
    const translateText = await getModule();
    const result = await translateText('97', 'hi');
    expect(result).toBe('97');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('returns empty string unchanged', async () => {
    const translateText = await getModule();
    expect(await translateText('', 'hi')).toBe('');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('returns null/non-string input unchanged', async () => {
    const translateText = await getModule();
    expect(await translateText(null, 'hi')).toBeNull();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  // ── Caching ───────────────────────────────────────────────────────────────

  it('caches results — same input+lang only calls API once', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { translations: [{ translatedText: 'मत' }] },
      }),
    });

    // Use same module instance (no reset) so cache persists
    import.meta.env.VITE_TRANSLATE_API_KEY = 'TEST_TRANSLATE_KEY';
    vi.resetModules();
    const { translateText } = await import('../services/translate.js');

    await translateText('vote', 'hi');
    await translateText('vote', 'hi'); // cache hit
    await translateText('vote', 'hi'); // cache hit

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('caches are per-language — different lang triggers new API call', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { translations: [{ translatedText: 'translated' }] },
      }),
    });

    import.meta.env.VITE_TRANSLATE_API_KEY = 'TEST_TRANSLATE_KEY';
    vi.resetModules();
    const { translateText } = await import('../services/translate.js');

    await translateText('voter', 'hi');
    await translateText('voter', 'ta'); // different lang → new call

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
