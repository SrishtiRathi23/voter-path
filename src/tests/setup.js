import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ── DOMPurify mock ───────────────────────────────────────────────────────────
vi.mock('dompurify', () => ({
  default: { sanitize: (text) => text },
}));

// ── import.meta.env defaults ──────────────────────────────────────────────────
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_GEMINI_API_KEY: 'TEST_KEY',
    VITE_TRANSLATE_API_KEY: 'TEST_TRANSLATE_KEY',
    VITE_GOOGLE_CLIENT_ID: 'TEST_CLIENT_ID',
    VITE_RATE_LIMIT_PER_MINUTE: '10',
    VITE_FIREBASE_API_KEY: '',
    VITE_FIREBASE_PROJECT_ID: '',
    VITE_FIREBASE_AUTH_DOMAIN: '',
    VITE_FIREBASE_STORAGE_BUCKET: '',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '',
    VITE_FIREBASE_APP_ID: '',
  },
  configurable: true,
  writable: true,
});

// ── Global fetch mock ────────────────────────────────────────────────────────
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}

// ── window.open mock (OAuth popup) ───────────────────────────────────────────
globalThis.window.open = vi.fn();

// ── scrollIntoView mock (not in jsdom) ──────────────────────────────────────
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// ── window.location.origin (OAuth redirect) ──────────────────────────────────
Object.defineProperty(window, 'location', {
  value: { origin: 'http://localhost:3000', href: 'http://localhost:3000' },
  writable: true,
  configurable: true,
});
