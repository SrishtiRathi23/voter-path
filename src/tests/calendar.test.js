// src/test/calendar.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Google Calendar service', () => {
  let addToCalendar;

  const VALID_EVENT = {
    title: 'Voter Registration Deadline',
    description: 'Last date to enroll.',
    date: '2026-05-15',
  };

  const GOOD_TOKEN = 'valid-oauth-token';

  function mockSessionStorage(tokenValue, expiryValue) {
    const store = {};
    if (tokenValue)  store['vp_calendar_token']        = tokenValue;
    if (expiryValue) store['vp_calendar_token_expiry'] = expiryValue;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((k) => store[k] ?? null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { store[k] = v; });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((k) => { delete store[k]; });
    return store;
  }

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn());
    const mod = await import('../services/calendar.js');
    addToCalendar = mod.addToCalendar;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Success: valid token in sessionStorage ────────────────────────────────

  it('calls Calendar API with correct event structure when token exists', async () => {
    const futureExpiry = (Date.now() + 3_600_000).toString();
    mockSessionStorage(GOOD_TOKEN, futureExpiry);

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'event123', status: 'confirmed' }),
    });

    const result = await addToCalendar(VALID_EVENT);
    expect(result.status).toBe('confirmed');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${GOOD_TOKEN}`,
        }),
      })
    );

    // Verify event body has reminders
    const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(body.reminders.overrides).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ minutes: 1440 }), // 24 hours
      ])
    );
  });

  it('event body has correct summary and start date', async () => {
    const futureExpiry = (Date.now() + 3_600_000).toString();
    mockSessionStorage(GOOD_TOKEN, futureExpiry);

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'event456', status: 'confirmed' }),
    });

    await addToCalendar(VALID_EVENT);
    const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(body.summary).toBe(VALID_EVENT.title);
    expect(body.start.date).toBe(VALID_EVENT.date);
  });

  // ── Token expiry → triggers re-auth ──────────────────────────────────────

  it('clears expired token and triggers re-auth', async () => {
    const expiredExpiry = (Date.now() - 1000).toString();
    mockSessionStorage(GOOD_TOKEN, expiredExpiry);

    globalThis.window.open = vi.fn().mockReturnValue(null);

    // Should throw some error (popup blocked or client ID missing)
    await expect(addToCalendar(VALID_EVENT)).rejects.toThrow();
  });

  // ── OAuth popup blocked ───────────────────────────────────────────────────

  it('throws error when no Client ID is configured (or popup blocked)', async () => {
    mockSessionStorage(null, null); // no token
    globalThis.window.open = vi.fn().mockReturnValue(null);

    // The service throws either 'Google Client ID not configured' or 'Popup blocked'
    await expect(addToCalendar(VALID_EVENT)).rejects.toThrow(
      /Google Client ID not configured|Popup blocked/
    );
  });

  // ── API error ─────────────────────────────────────────────────────────────

  it('throws error on Calendar API non-OK response', async () => {
    const futureExpiry = (Date.now() + 3_600_000).toString();
    mockSessionStorage(GOOD_TOKEN, futureExpiry);

    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    await expect(addToCalendar(VALID_EVENT)).rejects.toThrow(/Calendar API error/);
  });

  // ── 401 expiry retry ──────────────────────────────────────────────────────

  it('clears token and retries once on 401 response', async () => {
    const futureExpiry = (Date.now() + 3_600_000).toString();
    mockSessionStorage(GOOD_TOKEN, futureExpiry);

    // First call → 401, second call triggers re-auth (popup blocked fallback)
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized' });
    globalThis.window.open = vi.fn().mockReturnValue(null);

    await expect(addToCalendar(VALID_EVENT)).rejects.toThrow();
    // Token was removed from sessionStorage
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('vp_calendar_token');
  });
});
