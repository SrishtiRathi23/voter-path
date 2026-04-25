// src/test/firestore.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockIncrement     = vi.fn((n) => ({ _increment: n }));
const mockSetDoc        = vi.fn();
const mockGetDocs       = vi.fn();
const mockDoc           = vi.fn((db, col, id) => ({ _path: `${col}/${id}` }));
const mockCollection    = vi.fn();
const mockQuery         = vi.fn((...args) => args);
const mockOrderBy       = vi.fn();
const mockLimit         = vi.fn();

vi.mock('firebase/app',       () => ({ initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: mockDoc, increment: mockIncrement, setDoc: mockSetDoc,
  collection: mockCollection, getDocs: mockGetDocs,
  query: mockQuery, orderBy: mockOrderBy, limit: mockLimit,
}));

describe('Firestore service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    import.meta.env.VITE_FIREBASE_API_KEY    = 'test-firebase-key';
    import.meta.env.VITE_FIREBASE_PROJECT_ID = 'test-project';
  });

  it('increments the correct category document', async () => {
    mockSetDoc.mockResolvedValueOnce(undefined);
    const { logQuestionCategory } = await import('../services/firebase.js');
    await logQuestionCategory('registration');
    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'question_categories', 'registration');
    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      { count: expect.objectContaining({ _increment: 1 }) },
      { merge: true }
    );
  });

  it('uses merge:true — never overwrites', async () => {
    mockSetDoc.mockResolvedValueOnce(undefined);
    const { logQuestionCategory } = await import('../services/firebase.js');
    await logQuestionCategory('evm');
    expect(mockSetDoc.mock.calls[0][2]).toEqual({ merge: true });
  });

  it('does NOT crash when Firestore write fails', async () => {
    mockSetDoc.mockRejectedValueOnce(new Error('write failed'));
    const { logQuestionCategory } = await import('../services/firebase.js');
    await expect(logQuestionCategory('booth')).resolves.toBeUndefined();
  });

  it('skips logging for guardrail / null / empty category', async () => {
    const { logQuestionCategory } = await import('../services/firebase.js');
    await logQuestionCategory('guardrail');
    await logQuestionCategory(null);
    await logQuestionCategory('');
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it('SECURITY: payload contains only count — no user message', async () => {
    mockSetDoc.mockResolvedValueOnce(undefined);
    const { logQuestionCategory } = await import('../services/firebase.js');
    await logQuestionCategory('registration');
    const payload = mockSetDoc.mock.calls[0][1];
    expect(Object.keys(payload)).toEqual(['count']);
    expect(payload).not.toHaveProperty('message');
    expect(payload).not.toHaveProperty('question');
  });

  it('returns top categories as question strings', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (cb) => { cb({ id: 'booth' }); cb({ id: 'registration' }); },
    });
    const { getTopCategories } = await import('../services/firebase.js');
    const result = await getTopCategories();
    expect(result).toHaveLength(2);
    result.forEach(q => expect(typeof q).toBe('string'));
  });

  it('falls back when Firestore read throws', async () => {
    mockGetDocs.mockRejectedValueOnce(new Error('read error'));
    const { getTopCategories } = await import('../services/firebase.js');
    const result = await getTopCategories();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('falls back when Firestore returns empty snapshot', async () => {
    mockGetDocs.mockResolvedValueOnce({ forEach: () => {} });
    const { getTopCategories } = await import('../services/firebase.js');
    const result = await getTopCategories();
    expect(result.length).toBeGreaterThan(0);
  });
});
