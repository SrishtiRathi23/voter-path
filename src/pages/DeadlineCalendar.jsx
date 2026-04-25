import React, { useState } from 'react';
import { Calendar, Plus, Check } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import IndiaMapOutline from '../illustrations/IndiaMapOutline';
import { addToCalendar } from '../services/calendar';
import TranslateText from '../components/TranslateText';

// Realistic election deadline data in DD MMM YYYY format
const ALL_DEADLINES = [
  {
    id: 'd1',
    title: 'Voter Registration Deadline',
    date: '15 May 2026',
    dateObj: new Date('2026-05-15'),
    description: 'Last date to enroll as a new voter or update your existing voter registration details on the ECI portal.',
    urgency: 'upcoming', // upcoming | urgent | passed
  },
  {
    id: 'd2',
    title: 'EPIC Card Correction Window',
    date: '20 May 2026',
    dateObj: new Date('2026-05-20'),
    description: 'Submit corrections to your Elector Photo Identity Card (name, address, photo) before this deadline.',
    urgency: 'upcoming',
  },
  {
    id: 'd3',
    title: 'Voter List Final Publication',
    date: '01 Jun 2026',
    dateObj: new Date('2026-06-01'),
    description: 'ECI publishes the final electoral roll. Verify your name appears correctly using your EPIC card number.',
    urgency: 'upcoming',
  },
  {
    id: 'd4',
    title: 'Model Code of Conduct Enforced',
    date: '10 Jun 2026',
    dateObj: new Date('2026-06-10'),
    description: 'Model Code of Conduct comes into effect. No new government schemes can be announced after this date.',
    urgency: 'upcoming',
  },
  {
    id: 'd5',
    title: 'Nomination Filing Deadline',
    date: '17 Jun 2026',
    dateObj: new Date('2026-06-17'),
    description: 'Last date for candidates to file nomination papers with Returning Officers for the upcoming election.',
    urgency: 'upcoming',
  },
  {
    id: 'd6',
    title: 'General Election Day — Phase 1',
    date: '25 Jun 2026',
    dateObj: new Date('2026-06-25'),
    description: 'Polling day for Phase 1 constituencies. Polling booths open 7:00 AM – 6:00 PM. Bring valid photo ID.',
    urgency: 'urgent',
  },
];

const urgencyConfig = {
  urgent: { border: 'border-l-red-500', badge: 'bg-red-100 text-red-700', label: <TranslateText>🔴 Urgent</TranslateText> },
  upcoming: { border: 'border-l-saffron', badge: 'bg-saffron-light text-saffron-dark', label: <TranslateText>🟠 Upcoming</TranslateText> },
  passed: { border: 'border-l-gray-300', badge: 'bg-gray-100 text-gray-500', label: <TranslateText>⚫ Passed</TranslateText> },
};

const FILTERS = ['All', 'Upcoming', 'Urgent', 'Passed'];

const DeadlineCalendar = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [addedEvents, setAddedEvents] = useState({});
  const [loadingEvents, setLoadingEvents] = useState({});
  const [calendarError, setCalendarError] = useState(null);

  const filteredDeadlines = ALL_DEADLINES.filter((d) => {
    if (activeFilter === 'All') return true;
    return d.urgency.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleAddToCalendar = async (deadline) => {
    setLoadingEvents((prev) => ({ ...prev, [deadline.id]: true }));
    setCalendarError(null);
    try {
      await addToCalendar({
        title: deadline.title,
        description: deadline.description,
        date: deadline.dateObj.toISOString().split('T')[0],
      });
      setAddedEvents((prev) => ({ ...prev, [deadline.id]: true }));
    } catch (err) {
      setCalendarError(`Could not add ${deadline.title} to Calendar. ${err.message}`);
    } finally {
      setLoadingEvents((prev) => ({ ...prev, [deadline.id]: false }));
    }
  };

  return (
    <MainLayout>
      <div className="page-container section-spacing relative">
        {/* Background watermark */}
        <div className="absolute top-0 right-0 pointer-events-none select-none" aria-hidden="true">
          <IndiaMapOutline className="w-72 h-72 opacity-10" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-saffron rounded-full flex items-center justify-center">
              <Calendar size={22} className="text-white" />
            </div>
            <h1 className="text-h1 text-navy font-bold mb-0"><TranslateText>Election Deadlines</TranslateText></h1>
          </div>
          <p className="text-small text-[#5C5C5C]"><TranslateText>Key dates for the upcoming election cycle. Add reminders directly to your Google Calendar.</TranslateText></p>
        </div>

        {calendarError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-small rounded-lg border border-red-200">
            {calendarError}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter deadlines by status">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-small font-semibold transition-colors focus:ring-2 focus:ring-saffron focus:outline-none ${
                activeFilter === filter
                  ? 'bg-saffron text-white shadow-sm'
                  : 'bg-white text-navy border border-navy-light hover:bg-navy-light'
              }`}
            >
              <TranslateText>{filter}</TranslateText>
            </button>
          ))}
        </div>

        {/* Deadline Cards Grid */}
        {filteredDeadlines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDeadlines.map((deadline) => {
              const cfg = urgencyConfig[deadline.urgency];
              const isAdded = addedEvents[deadline.id];
              return (
                <article
                  key={deadline.id}
                  className={`card border-l-4 ${cfg.border} hover:-translate-y-1 transition-transform`}
                  aria-label={`${deadline.title} - ${deadline.date}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Date badge */}
                    <div className="text-center bg-navy-light rounded-lg px-3 py-2 flex-shrink-0">
                      <div className="text-[22px] font-bold text-navy leading-none">{deadline.date.split(' ')[0]}</div>
                      <div className="text-meta text-navy font-semibold">{deadline.date.split(' ').slice(1).join(' ')}</div>
                    </div>
                    {/* Urgency badge */}
                    <span className={`text-meta font-semibold px-2 py-1 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-navy mb-2"><TranslateText>{deadline.title}</TranslateText></h2>
                  <p className="text-small text-[#5C5C5C] mb-4"><TranslateText>{deadline.description}</TranslateText></p>

                  <button
                    onClick={() => !isAdded && !loadingEvents[deadline.id] && handleAddToCalendar(deadline)}
                    disabled={isAdded || loadingEvents[deadline.id]}
                    className={`flex items-center gap-2 text-small font-semibold px-4 py-2 rounded-full border transition-colors focus:ring-2 focus:ring-saffron focus:outline-none ${
                      isAdded
                        ? 'bg-forest text-white border-forest cursor-default'
                        : loadingEvents[deadline.id]
                        ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-wait'
                        : 'border-navy text-navy hover:bg-saffron hover:text-white hover:border-saffron'
                    }`}
                    aria-label={isAdded ? `Added to Google Calendar` : `Add to Google Calendar`}
                    aria-disabled={isAdded || loadingEvents[deadline.id]}
                  >
                    {isAdded ? <Check size={16} /> : <Plus size={16} />}
                    {isAdded ? <TranslateText>Added ✓</TranslateText> : loadingEvents[deadline.id] ? <TranslateText>Adding...</TranslateText> : <TranslateText>Add to Google Calendar</TranslateText>}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h2 className="text-h2 text-navy font-semibold"><TranslateText>No deadlines in this category</TranslateText></h2>
            <p className="text-small text-[#5C5C5C] max-w-sm">
              <TranslateText>
              {activeFilter === 'Passed'
                ? 'No deadlines have passed yet. Check upcoming ones!'
                : 'No deadlines match this filter. Try viewing All deadlines.'}
              </TranslateText>
            </p>
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex gap-2 px-6 py-3"
            >
              <TranslateText>Check ECI Website</TranslateText>
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DeadlineCalendar;
