// src/test/phase3.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider, LanguageContext } from '../context/LanguageContext';
import { ChatContext } from '../context/ChatContext';
import DeadlineCalendar from '../pages/DeadlineCalendar';
import ChatAssistant from '../pages/ChatAssistant';

// ── Service mocks ─────────────────────────────────────────────────────────────
vi.mock('../services/translate', () => ({
  translateText: vi.fn(async (text) => text), // pass-through
}));

vi.mock('../services/calendar', () => ({
  addToCalendar: vi.fn(),
}));

vi.mock('../services/firebase', () => ({
  logQuestionCategory: vi.fn(),
  getTopCategories: vi.fn().mockResolvedValue([
    'How to register to vote?',
    'Where is my polling booth?',
    'How to use an EVM?',
  ]),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
const FULL_MILESTONES = {
  registration: 'locked',
  booth: 'locked',
  idReady: 'locked',
  evm: 'locked',
  ready: 'locked',
};

const baseChatCtx = {
  messages: [],
  loading: false,
  error: null,
  rateLimitMsg: null,
  isOnline: true,
  progressMilestones: FULL_MILESTONES,
  sendMessage: vi.fn(),
  clearRateLimitMsg: vi.fn(),
};

function renderWithProviders(ui, chatCtx = baseChatCtx) {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <ChatContext.Provider value={chatCtx}>
          {ui}
        </ChatContext.Provider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Phase 3 — Language toggle', () => {
  it('LanguageContext defaults to EN', () => {
    let capturedLang;
    render(
      <LanguageProvider>
        <LanguageContext.Consumer>
          {(val) => { capturedLang = val.language; return null; }}
        </LanguageContext.Consumer>
      </LanguageProvider>
    );
    expect(capturedLang).toBe('EN');
  });

  it('changeLanguage updates language and persists to localStorage', () => {
    let ctx;
    render(
      <LanguageProvider>
        <LanguageContext.Consumer>
          {(val) => { ctx = val; return null; }}
        </LanguageContext.Consumer>
      </LanguageProvider>
    );
    ctx.changeLanguage('HI');
    expect(localStorage.getItem('vp_lang')).toBe('HI');
  });
});

describe('Phase 3 — Google Calendar button', () => {
  beforeEach(() => vi.clearAllMocks());

  it('triggers addToCalendar when button is clicked', async () => {
    const { addToCalendar } = await import('../services/calendar');
    addToCalendar.mockResolvedValueOnce({ status: 'confirmed' });

    renderWithProviders(<DeadlineCalendar />);

    const buttons = await screen.findAllByRole('button', {
      name: /Add to Google Calendar/i,
    });
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(addToCalendar).toHaveBeenCalledTimes(1);
      expect(addToCalendar).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          date: expect.any(String),
        })
      );
    });
  });

  it('shows "Added ✓" after successful calendar event creation', async () => {
    const { addToCalendar } = await import('../services/calendar');
    addToCalendar.mockResolvedValueOnce({ status: 'confirmed' });

    renderWithProviders(<DeadlineCalendar />);
    const buttons = await screen.findAllByRole('button', {
      name: /Add to Google Calendar/i,
    });
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/Added/i).length).toBeGreaterThan(0);
    });
  });

  it('shows error message when calendar API fails', async () => {
    const { addToCalendar } = await import('../services/calendar');
    addToCalendar.mockRejectedValueOnce(new Error('Popup blocked'));

    renderWithProviders(<DeadlineCalendar />);
    const buttons = await screen.findAllByRole('button', {
      name: /Add to Google Calendar/i,
    });
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Could not add|Popup blocked/i)).toBeInTheDocument();
    });
  });
});

describe('Phase 3 — Firestore Most Asked Today', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches and displays top categories from Firestore', async () => {
    renderWithProviders(<ChatAssistant />);

    await waitFor(() => {
      expect(screen.getByText('How to register to vote?')).toBeInTheDocument();
    });
  });

  it('getTopCategories called once on mount', async () => {
    const { getTopCategories } = await import('../services/firebase');
    renderWithProviders(<ChatAssistant />);
    await waitFor(() => {
      expect(getTopCategories).toHaveBeenCalledTimes(1);
    });
  });
});
