import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { PlayCircle, CheckCircle, RefreshCcw, Activity } from 'lucide-react';
import TranslateText from '../components/TranslateText';

const VoteSimulation = () => {
  const [votes, setVotes] = useState({ A: 0, B: 0, NOTA: 0 });
  const [totalVotes, setTotalVotes] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lastVote, setLastVote] = useState(null);

  const castVote = (party) => {
    if (animating) return;
    setAnimating(true);
    setLastVote(party);
    
    // Simulate VVPAT Delay
    setTimeout(() => {
      setVotes(prev => ({ ...prev, [party]: prev[party] + 1 }));
      setTotalVotes(prev => prev + 1);
      setAnimating(false);
    }, 1200);
  };

  const resetSimulation = () => {
    setVotes({ A: 0, B: 0, NOTA: 0 });
    setTotalVotes(0);
    setLastVote(null);
  };

  return (
    <MainLayout>
      <div className="page-container section-spacing animate-fade-in">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-forest-light text-forest font-semibold rounded-full mb-5">
            <TranslateText>Interactive Civic Education</TranslateText>
          </span>
          <h1 className="text-h1 text-navy font-bold mb-4">
            <TranslateText>Live Voting Simulation</TranslateText>
          </h1>
          <p className="text-[#5C5C5C] max-w-2xl mx-auto">
            <TranslateText>Experience how Electronic Voting Machines (EVMs) record votes and generate VVPAT slips. Understand the exact counting process in real-time.</TranslateText>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* EVM Unit */}
          <div className="card shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <PlayCircle className="text-saffron" />
              <h2 className="text-h2 text-navy mb-0"><TranslateText>EVM Ballot Unit</TranslateText></h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {['A', 'B', 'NOTA'].map(party => (
                <div key={party} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-bold text-navy text-lg">{party === 'NOTA' ? 'NOTA' : `Candidate ${party}`}</div>
                  <button
                    onClick={() => castVote(party)}
                    disabled={animating}
                    className={`w-12 h-12 rounded-full border-4 shadow-inner flex items-center justify-center transition-all ${
                      animating ? 'bg-gray-300 border-gray-400 cursor-not-allowed' : 'bg-blue-500 border-blue-600 hover:bg-blue-600 cursor-pointer active:scale-95'
                    }`}
                    aria-label={`Cast vote for ${party}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              ))}
            </div>

            {/* VVPAT Window */}
            <div className="mt-8 p-6 bg-gray-900 rounded-lg border-4 border-gray-700 relative overflow-hidden h-32 flex items-center justify-center">
              <div className="absolute top-2 left-3 text-gray-500 text-xs font-bold tracking-widest">VVPAT SLIP WINDOW</div>
              {animating ? (
                <div className="animate-slide-down bg-white text-black px-6 py-2 border-2 border-dashed border-gray-400 text-center shadow-lg">
                  <div className="text-sm font-bold">{lastVote === 'NOTA' ? 'NOTA' : `Candidate ${lastVote}`}</div>
                  <div className="text-xs">Recorded</div>
                </div>
              ) : (
                <div className="text-gray-700 font-mono text-sm">Awaiting Vote...</div>
              )}
            </div>
          </div>

          {/* Counting Unit */}
          <div className="card shadow-lg bg-navy text-white">
            <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-saffron" />
                <h2 className="text-h2 text-white mb-0"><TranslateText>Live Vote Counting</TranslateText></h2>
              </div>
              <button onClick={resetSimulation} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Reset simulation">
                <RefreshCcw size={20} />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="text-[48px] font-bold text-saffron leading-none">{totalVotes}</div>
              <div className="text-blue-200 text-sm uppercase tracking-wider font-semibold"><TranslateText>Total Votes Cast</TranslateText></div>
            </div>

            <div className="flex flex-col gap-6">
              {['A', 'B', 'NOTA'].map(party => {
                const percentage = totalVotes === 0 ? 0 : Math.round((votes[party] / totalVotes) * 100);
                return (
                  <div key={party}>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span>{party === 'NOTA' ? 'None of the Above' : `Candidate ${party}`}</span>
                      <span>{votes[party]} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${party === 'A' ? 'bg-saffron' : party === 'B' ? 'bg-forest' : 'bg-gray-400'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 bg-white/10 p-4 rounded-lg border-l-4 border-saffron">
              <h4 className="text-sm font-bold text-saffron mb-1 flex items-center gap-2">
                <CheckCircle size={16} /> <TranslateText>Educational Note</TranslateText>
              </h4>
              <p className="text-xs text-blue-100 mb-0 leading-relaxed">
                <TranslateText>In real Indian elections, votes are securely encrypted in the Control Unit. The VVPAT prints a paper slip visible for 7 seconds to the voter before dropping into a sealed box, ensuring a physical audit trail.</TranslateText>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VoteSimulation;
