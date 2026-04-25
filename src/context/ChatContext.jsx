import React, { createContext, useState, useCallback, useEffect } from 'react';
import { askGemini, RateLimitError, detectCategory } from '../services/gemini';

export const ChatContext = createContext();

// Category → sidebar milestone mapping
const CATEGORY_TO_MILESTONE = {
  registration: 'registration',
  booth: 'booth',
  voter_id: 'idReady',
  evm: 'evm',
  nota: 'ready',
  complaints: 'ready',
};

const INITIAL_MILESTONES = {
  registration: 'locked',
  booth: 'locked',
  idReady: 'locked',
  evm: 'locked',
  ready: 'locked',
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitMsg, setRateLimitMsg] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [progressMilestones, setProgressMilestones] = useState({
    registration: 'complete',    // Hardcoded for visual demo Phase 1 initial state
    booth: 'in-progress',
    idReady: 'locked',
    evm: 'locked',
    ready: 'locked',
  });

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update sidebar milestones based on AI response category
  const updateMilestone = useCallback((category) => {
    if (!category) return;
    const milestoneKey = CATEGORY_TO_MILESTONE[category];
    if (!milestoneKey) return;

    setProgressMilestones((prev) => {
      const currentState = prev[milestoneKey];
      let nextState;
      if (currentState === 'locked') nextState = 'in-progress';
      else if (currentState === 'in-progress') nextState = 'complete';
      else nextState = 'complete'; // already complete
      return { ...prev, [milestoneKey]: nextState };
    });
  }, []);

  const sendMessage = useCallback(
    async (question, language) => {
      if (!question.trim()) return;
      if (!isOnline) {
        setError('You are offline. Reconnect to use the Assistant.');
        return;
      }

      setError(null);
      setRateLimitMsg(null);

      // Add user message immediately
      const userMessage = { role: 'user', content: question };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      // Detect category from user question for early sidebar update
      const detectedCategory = detectCategory(question);
      if (detectedCategory) updateMilestone(detectedCategory);

      try {
        // Build history from current messages (last 12 = 6 exchanges)
        const history = messages.slice(-12);
        const response = await askGemini(question, language, history);

        const assistantMessage = {
          role: 'assistant',
          content: response.answer,
          confidence: response.confidence,
          source: response.source,
          nextStep: response.next_step,
          category: response.category,
          isStatic: response.isStatic || false,
          rawFallback: response.rawFallback || false,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update sidebar with confirmed category from AI response
        if (response.category && response.category !== 'guardrail') {
          updateMilestone(response.category);
          
          // Log to Firebase for 'Most Asked Today'
          import('../services/firebase').then((m) => {
            m.logQuestionCategory(response.category);
          }).catch(err => console.error("Firebase log error:", err));
        }
      } catch (err) {
        if (err instanceof RateLimitError) {
          setRateLimitMsg(
            `Please wait ${err.waitSeconds} seconds before asking another question.`
          );
          // Remove user message that was added optimistically
          setMessages((prev) => prev.slice(0, -1));
        } else {
          setError('Something went wrong. Please try again.');
          setMessages((prev) => prev.slice(0, -1));
        }
      } finally {
        setLoading(false);
      }
    },
    [messages, isOnline, updateMilestone]
  );

  const clearRateLimitMsg = useCallback(() => setRateLimitMsg(null), []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        rateLimitMsg,
        isOnline,
        progressMilestones,
        sendMessage,
        clearRateLimitMsg,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
