import React, { useState, useContext, useEffect, useRef } from 'react';
import { Send, WifiOff, AlertCircle } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import ProgressSidebar from '../components/ProgressSidebar';
import ConfidenceBadge from '../components/ConfidenceBadge';
import ECISourceTag from '../components/ECISourceTag';
import EVMMachine from '../illustrations/EVMMachine';
import { ChatContext } from '../context/ChatContext';
import { LanguageContext } from '../context/LanguageContext';
import { getTopCategories } from '../services/firebase';
import TranslateText from '../components/TranslateText';

const SAMPLE_QUESTIONS = [
  'How do I check if I am registered to vote?',
  'What ID should I carry to the polling booth?',
  'How does an EVM machine work?',
  'What is NOTA?',
  'Where is my polling booth?',
];

const quickFacts = [
  { emoji: '🗓️', text: 'General Elections in India happen every 5 years.' },
  { emoji: '🏛️', text: 'India has over 97 crore registered voters.' },
  { emoji: '🛡️', text: 'Your vote is 100% secret. Booth officials cannot see it.' },
];

// Removed static mostAsked


// ── Message Bubble ────────────────────────────────────────────────────────────
const UserBubble = ({ content }) => (
  <div className="flex justify-end">
    <div className="max-w-[75%] bg-saffron text-white px-4 py-3 rounded-[16px] rounded-tr-[4px] text-small shadow-sm">
      {content}
    </div>
  </div>
);

const AssistantBubble = ({ msg, onSuggestionClick }) => {
  const showBadge = msg.confidence !== null && msg.confidence !== undefined;
  const badgeScore = msg.isStatic ? 'Static answer' : msg.confidence;

  return (
    <div className="flex justify-start">
      <div className="max-w-[82%] flex flex-col gap-2">
        <div
          aria-live="polite"
          className={`bg-white px-4 py-3 rounded-[16px] rounded-tl-[4px] text-small text-[#1A1A1A] shadow-sm ${
            msg.rawFallback ? 'border border-yellow-300' : 'border-l-4 border-navy'
          }`}
        >
          {msg.content}
          {msg.rawFallback && (
            <p className="text-meta text-yellow-700 mt-2 mb-0">
              ⚠️ Could not parse a structured response. Please verify at voters.eci.gov.in
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap px-1">
          {showBadge && <ConfidenceBadge score={badgeScore} />}
          <ECISourceTag
            url={msg.source || 'https://voters.eci.gov.in'}
            text={msg.isStatic ? 'Verify at ECI' : 'Source: ECI'}
          />
        </div>
        {msg.nextStep && (
          <button
            onClick={() => onSuggestionClick(msg.nextStep)}
            className="self-start text-meta text-navy border border-navy rounded-full px-3 py-1 hover:bg-saffron hover:text-white hover:border-saffron transition-colors focus:ring-2 focus:ring-navy focus:outline-none"
            aria-label={`Follow-up suggestion: ${msg.nextStep}`}
          >
            💡 {msg.nextStep}
          </button>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div
      className="bg-white border border-gray-200 px-4 py-3 rounded-[16px] rounded-tl-[4px] shadow-sm flex items-center gap-1.5"
      role="status"
      aria-label="Assistant is thinking"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 bg-navy rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
          aria-hidden="true"
        />
      ))}
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const ChatAssistant = () => {
  const { messages, loading, error, rateLimitMsg, isOnline, sendMessage } =
    useContext(ChatContext);
  const { language } = useContext(LanguageContext);
  const [inputText, setInputText] = useState('');
  const [dynamicMostAsked, setDynamicMostAsked] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getTopCategories().then(cats => {
      if (mounted) setDynamicMostAsked(cats);
    });
    return () => { mounted = false; };
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!inputText.trim() || loading || !isOnline) return;
    sendMessage(inputText.trim(), language);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    setInputText(text);
    inputRef.current?.focus();
  };

  const handleSampleClick = (q) => {
    sendMessage(q, language);
  };

  const isInputDisabled = loading || !isOnline;

  return (
    <MainLayout>
      {/* Offline Banner */}
      {!isOnline && (
        <div
          className="bg-red-500 text-white text-center py-2 px-4 text-small font-semibold flex items-center justify-center gap-2"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff size={16} aria-hidden="true" />
          You're offline. Reconnect to use the Assistant.
        </div>
      )}

      <div
        className="page-container py-4 lg:py-6 flex flex-col"
        style={{ height: isOnline ? 'calc(100vh - 64px)' : 'calc(100vh - 104px)' }}
      >
        <div className="flex gap-4 flex-1 overflow-hidden">

          {/* ── Left Sidebar: Progress (desktop) ── */}
          <aside className="hidden lg:block w-[20%] flex-shrink-0">
            <div className="card h-full overflow-y-auto">
              <ProgressSidebar />
            </div>
          </aside>

          {/* ── Center: Chat ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Progress Pill */}
            <div
              className="lg:hidden flex items-center gap-2 mb-3 px-4 py-2 bg-saffron-light rounded-full text-saffron font-semibold text-small self-start"
              aria-label="Voter journey progress indicator"
            >
              🗳️ Ask me about voting, registration, booths, EVM…
            </div>

            {/* Chat Card */}
            <div className="card flex flex-col flex-1 min-h-0 p-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <EVMMachine className="w-9 h-9 flex-shrink-0" />
                <div className="flex-1">
                  <h1 className="text-h3 text-navy font-bold mb-0 leading-none">
                    VoterPath Assistant
                  </h1>
                  <p className="text-meta text-[#5C5C5C] mb-0">
                    Powered by ECI-verified knowledge
                  </p>
                </div>
                <div className="flex items-center gap-1.5" aria-label={isOnline ? 'Online' : 'Offline'}>
                  <span
                    className={`w-2 h-2 rounded-full ${isOnline ? 'bg-forest animate-pulse' : 'bg-red-400'}`}
                    aria-hidden="true"
                  />
                  <span className={`text-meta font-semibold ${isOnline ? 'text-forest' : 'text-red-500'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
                role="log"
                aria-live="polite"
                aria-atomic="false"
                aria-label="Chat messages"
                aria-relevant="additions"
              >
                {/* Empty State — Sample Questions */}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center gap-4 py-4">
                    <p className="text-small text-[#5C5C5C] font-semibold text-center">
                      <TranslateText>👋 Ask me anything about voting in India. Here are some ideas:</TranslateText>
                    </p>
                    <div className="flex flex-col gap-2 w-full max-w-sm">
                      {SAMPLE_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSampleClick(q)}
                          className="text-small text-left px-4 py-2.5 rounded-card bg-saffron-light text-saffron-dark border border-saffron/30 hover:bg-saffron hover:text-white transition-colors focus:ring-2 focus:ring-saffron focus:outline-none font-medium"
                          aria-label={`Ask: ${q}`}
                        >
                          <TranslateText>{q}</TranslateText>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Thread */}
                {messages.map((msg, idx) =>
                  msg.role === 'user' ? (
                    <UserBubble key={idx} content={msg.content} />
                  ) : (
                    <AssistantBubble
                      key={idx}
                      msg={msg}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  )
                )}

                {/* Typing indicator */}
                {loading && <TypingIndicator />}

                {/* Rate limit message */}
                {rateLimitMsg && (
                  <div
                    className="flex items-center gap-2 text-small text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
                    {rateLimitMsg}
                  </div>
                )}

                {/* Generic error */}
                {error && (
                  <div
                    className="flex items-center gap-2 text-small text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                    role="alert"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      className={`input-field pr-16 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder={
                        !isOnline
                          ? 'Reconnect to use the Assistant'
                          : 'Ask anything about voting in India…'
                      }
                      value={inputText}
                      onChange={(e) =>
                        e.target.value.length <= 500 && setInputText(e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      disabled={isInputDisabled}
                      maxLength={500}
                      aria-label="Ask a question about voting in India"
                      aria-disabled={isInputDisabled}
                    />
                    {inputText.length > 400 && (
                      <span
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-meta ${
                          inputText.length >= 500 ? 'text-red-500' : 'text-[#5C5C5C]'
                        }`}
                        aria-live="polite"
                      >
                        {inputText.length}/500
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={isInputDisabled || inputText.trim().length === 0}
                    className="btn-primary w-12 h-12 rounded-full p-0 flex-shrink-0 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Send message"
                    aria-disabled={isInputDisabled || inputText.trim().length === 0}
                  >
                    <Send size={18} aria-hidden="true" />
                  </button>
                </div>
                <p className="text-meta text-[#5C5C5C] mt-2 text-center">
                  Responses are based on ECI official data. Always verify at{' '}
                  <a
                    href="https://voters.eci.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-saffron underline focus:outline-none focus:ring-1 focus:ring-saffron rounded"
                  >
                    voters.eci.gov.in
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Quick Facts (desktop) ── */}
          <aside className="hidden lg:flex w-[25%] flex-shrink-0 flex-col gap-4" aria-label="Quick Facts Panel">
            <div className="card">
              <h2 className="text-h3 text-navy font-semibold mb-4"><TranslateText>Did You Know?</TranslateText></h2>
              <div className="flex flex-col gap-3">
                {quickFacts.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-saffron-light rounded-lg border-t-2 border-saffron"
                  >
                    <span className="text-[20px] flex-shrink-0" aria-hidden="true">{f.emoji}</span>
                    <p className="text-small text-[#1A1A1A] mb-0"><TranslateText>{f.text}</TranslateText></p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h2 className="text-h3 text-navy font-semibold mb-4"><TranslateText>Most Asked Today</TranslateText></h2>
              <div className="flex flex-col gap-2">
                {dynamicMostAsked.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSampleClick(q)}
                    className="text-small text-left px-3 py-2.5 rounded-lg bg-navy-light text-navy hover:bg-saffron hover:text-white transition-colors focus:ring-2 focus:ring-saffron focus:outline-none font-medium"
                    aria-label={`Ask: ${q}`}
                  >
                    <TranslateText>{q}</TranslateText>
                  </button>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </MainLayout>
  );
};

export default ChatAssistant;
