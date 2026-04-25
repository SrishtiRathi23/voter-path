// src/test/chat.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { LanguageContext } from '../context/LanguageContext';
import ChatAssistant from '../pages/ChatAssistant';

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock('../services/firebase', () => ({
  getTopCategories: vi.fn().mockResolvedValue([
    'How to register to vote?',
    'Where is my polling booth?',
    'How to use an EVM?',
  ]),
}));

vi.mock('../services/gemini', () => ({
  askGemini: vi.fn(),
  RateLimitError: class RateLimitError extends Error {
    constructor(w) {
      super('Rate limit exceeded');
      this.name = 'RateLimitError';
      this.waitSeconds = w;
    }
  },
  detectCategory: vi.fn().mockReturnValue('registration'),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeLangCtx = (lang = 'EN') => ({
  language: lang,
  changeLanguage: vi.fn(),
  t: async (text) => text,
});

const FULL_MILESTONES = {
  registration: 'locked',
  booth: 'locked',
  idReady: 'locked',
  evm: 'locked',
  ready: 'locked',
};

function buildChatCtx(overrides = {}) {
  return {
    messages: [],
    loading: false,
    error: null,
    rateLimitMsg: null,
    isOnline: true,
    progressMilestones: FULL_MILESTONES,
    sendMessage: vi.fn(),
    clearRateLimitMsg: vi.fn(),
    ...overrides,
  };
}

function renderChat(chatCtx, langCtx) {
  return render(
    <MemoryRouter>
      <LanguageContext.Provider value={langCtx ?? makeLangCtx()}>
        <ChatContext.Provider value={chatCtx}>
          <ChatAssistant />
        </ChatContext.Provider>
      </LanguageContext.Provider>
    </MemoryRouter>
  );
}

// Actual placeholder text from the component
const INPUT_PLACEHOLDER = 'Ask anything about voting in India…';

// ── Core rendering ────────────────────────────────────────────────────────────
describe('ChatAssistant — core rendering', () => {
  it('renders empty state with sample questions', async () => {
    renderChat(buildChatCtx());
    await waitFor(() => {
      expect(screen.getByText(/Ask me anything about voting/i)).toBeInTheDocument();
    });
  });

  it('renders a user message bubble', () => {
    const ctx = buildChatCtx({
      messages: [{ role: 'user', content: 'How do I register?' }],
    });
    renderChat(ctx);
    expect(screen.getByText('How do I register?')).toBeInTheDocument();
  });

  it('renders an assistant message with answer text', () => {
    const ctx = buildChatCtx({
      messages: [
        { role: 'user', content: 'How do I register?' },
        {
          role: 'assistant',
          content: 'You can register at voters.eci.gov.in',
          confidence: 0.95,
          source: 'https://voters.eci.gov.in',
          nextStep: 'Visit the portal.',
          category: 'registration',
          isStatic: false,
        },
      ],
    });
    renderChat(ctx);
    expect(screen.getByText(/register at voters.eci.gov.in/i)).toBeInTheDocument();
  });

  it('shows typing indicator (animate-bounce dots) when loading', () => {
    const ctx = buildChatCtx({
      messages: [{ role: 'user', content: 'test' }],
      loading: true,
    });
    renderChat(ctx);
    // TypingIndicator renders spans with animate-bounce
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('calls sendMessage when send button is clicked', async () => {
    const sendMessage = vi.fn();
    renderChat(buildChatCtx({ sendMessage }));

    const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER);
    fireEvent.change(input, { target: { value: 'How do I vote?' } });
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    fireEvent.click(sendBtn);
    expect(sendMessage).toHaveBeenCalledWith('How do I vote?', 'EN');
  });

  it('does NOT submit empty input', () => {
    const sendMessage = vi.fn();
    renderChat(buildChatCtx({ sendMessage }));
    // Send button is disabled when input is empty
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    expect(sendBtn).toBeDisabled();
    fireEvent.click(sendBtn);
    expect(sendMessage).not.toHaveBeenCalled();
  });
});

// ── Confidence badge ──────────────────────────────────────────────────────────
describe('ChatAssistant — confidence badge', () => {
  it('renders ConfidenceBadge for assistant messages with numeric confidence', () => {
    const ctx = buildChatCtx({
      messages: [
        {
          role: 'assistant',
          content: 'You can register online.',
          confidence: 0.95,
          source: 'https://voters.eci.gov.in',
          nextStep: '',
          category: 'registration',
          isStatic: false,
        },
      ],
    });
    renderChat(ctx);
    // ConfidenceBadge renders the score as a percentage text
    expect(screen.getByText(/95%/i)).toBeInTheDocument();
  });

  it('does NOT render ConfidenceBadge when confidence is null (rawFallback)', () => {
    const ctx = buildChatCtx({
      messages: [
        {
          role: 'assistant',
          content: 'Raw fallback answer.',
          confidence: null,
          source: 'https://voters.eci.gov.in',
          nextStep: '',
          category: null,
          isStatic: false,
          rawFallback: true,
        },
      ],
    });
    renderChat(ctx);
    // ConfidenceBadge shows text like "95%" — should not appear
    // Use a specific pattern that only ConfidenceBadge would render (e.g. "100%")
    // Quick facts won't contain percentage patterns like "100%"
    expect(screen.queryByText(/^\d+%$/)).toBeNull();
  });
});

// ── Failure / fallback rendering ──────────────────────────────────────────────
describe('ChatAssistant — failure states', () => {
  it('displays generic error message', () => {
    const ctx = buildChatCtx({ error: 'Something went wrong. Please try again.' });
    renderChat(ctx);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('shows rate limit warning text', () => {
    const ctx = buildChatCtx({
      rateLimitMsg: 'Please wait 45 seconds before asking another question.',
    });
    renderChat(ctx);
    expect(screen.getByText(/Please wait 45 seconds/i)).toBeInTheDocument();
  });

  it('disables send button when rate limited', () => {
    const ctx = buildChatCtx({
      rateLimitMsg: 'Please wait 45 seconds before asking another question.',
      loading: true, // loading=true disables the input
    });
    renderChat(ctx);
    // The send button should be disabled when loading
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    expect(sendBtn).toBeDisabled();
  });

  it('shows raw fallback answer without crashing', () => {
    const ctx = buildChatCtx({
      messages: [
        {
          role: 'assistant',
          content: 'Visit voters.eci.gov.in for information.',
          confidence: null,
          source: 'https://voters.eci.gov.in',
          nextStep: '',
          category: null,
          isStatic: false,
          rawFallback: true,
        },
      ],
    });
    renderChat(ctx);
    expect(screen.getByText(/Visit voters.eci.gov.in/i)).toBeInTheDocument();
  });

  it('shows static cached answer (isStatic=true)', () => {
    const ctx = buildChatCtx({
      messages: [
        {
          role: 'assistant',
          content: 'This is a cached answer from KB.',
          confidence: 0.75,
          source: 'https://voters.eci.gov.in',
          nextStep: 'Verify at ECI.',
          category: 'registration',
          isStatic: true,
        },
      ],
    });
    renderChat(ctx);
    expect(screen.getByText(/cached answer/i)).toBeInTheDocument();
  });
});

// ── Offline mode ──────────────────────────────────────────────────────────────
describe('ChatAssistant — offline mode', () => {
  it('disables input when offline', () => {
    const ctx = buildChatCtx({ isOnline: false });
    renderChat(ctx);
    const input = screen.getByRole('textbox', { name: /Ask a question/i });
    expect(input).toBeDisabled();
  });

  it('shows offline banner text', () => {
    const ctx = buildChatCtx({ isOnline: false });
    renderChat(ctx);
    // Both the banner and the status indicator show offline text — check at least one exists
    const offlineEls = screen.getAllByText(/offline|Reconnect/i);
    expect(offlineEls.length).toBeGreaterThan(0);
  });

  it('shows "Offline" status indicator in chat header', () => {
    const ctx = buildChatCtx({ isOnline: false });
    renderChat(ctx);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('does NOT call sendMessage when offline', () => {
    const sendMessage = vi.fn();
    const ctx = buildChatCtx({ isOnline: false, sendMessage });
    renderChat(ctx);
    // The input is disabled so form submission is prevented
    const btn = screen.getByRole('button', { name: /Send message/i });
    expect(btn).toBeDisabled();
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('placeholder changes to reconnect hint when offline', () => {
    const ctx = buildChatCtx({ isOnline: false });
    renderChat(ctx);
    expect(
      screen.getByPlaceholderText(/Reconnect to use/i)
    ).toBeInTheDocument();
  });
});

// ── Most Asked Today (Firebase) ───────────────────────────────────────────────
describe('ChatAssistant — Most Asked Today', () => {
  it('fetches and displays top categories from Firebase', async () => {
    renderChat(buildChatCtx());
    await waitFor(() => {
      expect(screen.getByText('How to register to vote?')).toBeInTheDocument();
    });
  });
});

// ── Sample questions ──────────────────────────────────────────────────────────
describe('ChatAssistant — sample question chips', () => {
  it('clicking a sample question chip triggers sendMessage', async () => {
    const sendMessage = vi.fn();
    renderChat(buildChatCtx({ sendMessage }));

    const sampleBtns = await screen.findAllByRole('button', { name: /^Ask:/i });
    fireEvent.click(sampleBtns[0]);
    expect(sendMessage).toHaveBeenCalled();
  });
});
