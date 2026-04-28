import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ChecklistProvider } from './context/ChecklistContext';
import { ChatProvider } from './context/ChatContext';
import Landing from './pages/Landing';
import ChatAssistant from './pages/ChatAssistant';
import VoterChecklist from './pages/VoterChecklist';
import DeadlineCalendar from './pages/DeadlineCalendar';
import MythBuster from './pages/MythBuster';
import Transparency from './pages/Transparency';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ChecklistProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/chat" element={<ChatAssistant />} />
              <Route path="/checklist" element={<VoterChecklist />} />
              <Route path="/deadlines" element={<DeadlineCalendar />} />
              <Route path="/myths" element={<MythBuster />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </ChecklistProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
