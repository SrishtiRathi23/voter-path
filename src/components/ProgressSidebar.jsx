import React, { useContext } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import ProgressBar from './ProgressBar';

const milestones = [
  { id: 'registration', label: 'Registration', icon: '📋' },
  { id: 'booth', label: 'Find Booth', icon: '📍' },
  { id: 'idReady', label: 'ID Ready', icon: '🪪' },
  { id: 'evm', label: 'Understand EVM', icon: '🗳️' },
  { id: 'ready', label: 'Ready to Vote', icon: '✅' },
];

const ProgressSidebar = () => {
  const { progressMilestones } = useContext(ChatContext);
  const completedCount = Object.values(progressMilestones).filter(
    (v) => v === 'complete'
  ).length;
  const progressPercent = (completedCount / milestones.length) * 100;

  return (
    <aside className="h-full flex flex-col" aria-label="Voter Journey Progress Tracker">
      <h2 className="text-h3 text-navy font-semibold mb-5">Your Voter Journey</h2>
      <div className="flex flex-col gap-3 flex-1">
        {milestones.map((m) => {
          const state = progressMilestones[m.id] || 'locked';
          return (
            <div
              key={m.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 ${
                state === 'complete'
                  ? 'bg-forest-light'
                  : state === 'in-progress'
                  ? 'bg-saffron-light'
                  : 'bg-gray-50'
              }`}
              aria-label={`${m.label}: ${state.replace('-', ' ')}`}
            >
              <span className="text-[18px]" aria-hidden="true">{m.icon}</span>
              <span
                className={`text-small font-semibold flex-1 ${
                  state === 'complete'
                    ? 'text-forest'
                    : state === 'in-progress'
                    ? 'text-saffron-dark'
                    : 'text-gray-400'
                }`}
              >
                {m.label}
              </span>
              {state === 'complete' && (
                <CheckCircle size={18} className="text-forest flex-shrink-0" aria-label="Complete" />
              )}
              {state === 'in-progress' && (
                <div
                  className="w-4 h-4 rounded-full border-2 border-saffron flex-shrink-0"
                  aria-label="In progress"
                />
              )}
              {state === 'locked' && (
                <Circle size={18} className="text-gray-300 flex-shrink-0" aria-label="Not started" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-meta text-[#5C5C5C] mb-2">
          <span>Progress</span>
          <span className="font-semibold text-saffron">
            {completedCount}/{milestones.length}
          </span>
        </div>
        <ProgressBar progress={progressPercent} />
      </div>
    </aside>
  );
};

export default ProgressSidebar;
