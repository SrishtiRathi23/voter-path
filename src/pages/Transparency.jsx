import React from 'react';
import MainLayout from '../components/MainLayout';
import { ShieldCheck, Scale, Database, Code, BrainCircuit } from 'lucide-react';
import TranslateText from '../components/TranslateText';

const Transparency = () => {
  return (
    <MainLayout>
      <div className="page-container section-spacing animate-fade-in">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-navy text-white text-meta font-semibold rounded-full mb-5">
            <TranslateText>Solution Challenge 2026: Unbiased AI Decision Track</TranslateText>
          </span>
          <h1 className="text-[32px] md:text-[40px] text-navy font-bold mb-4">
            <TranslateText>AI Transparency & Bias Report</TranslateText>
          </h1>
          <p className="text-[#5C5C5C] max-w-2xl mx-auto">
            <TranslateText>We believe in Ethical AI. Discover exactly how VoterPath's assistant makes decisions and ensures 100% unbiased, factual information.</TranslateText>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1 */}
          <div className="card relative overflow-hidden bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl shadow-gray-200/50">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Scale size={80} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-saffron-light rounded-full flex items-center justify-center">
                <Scale size={24} className="text-saffron-dark" />
              </div>
              <h2 className="text-h2 text-navy mb-0"><TranslateText>Zero-Bias Architecture</TranslateText></h2>
            </div>
            <p className="text-base text-[#5C5C5C] relative z-10">
              <TranslateText>VoterPath operates on a strict Retrieval-Augmented Generation (RAG) pattern, restricted to a verified Election Commission of India (ECI) static knowledge base. The AI is structurally incapable of inventing facts or exhibiting political bias because it is blocked from accessing external, unverified data.</TranslateText>
            </p>
          </div>

          {/* Card 2 */}
          <div className="card relative overflow-hidden bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl shadow-gray-200/50">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck size={80} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-forest/20 rounded-full flex items-center justify-center">
                <ShieldCheck size={24} className="text-forest" />
              </div>
              <h2 className="text-h2 text-navy mb-0"><TranslateText>Political Guardrails</TranslateText></h2>
            </div>
            <p className="text-base text-[#5C5C5C] relative z-10">
              <TranslateText>Through rigorous Chain-of-Thought (CoT) and Few-Shot prompting, the AI is programmed to instantly reject queries like "Who should I vote for?" or "Which party is best?". It intercepts these inputs and returns a safe fallback guiding the user back to civic procedures.</TranslateText>
            </p>
          </div>
        </div>

        {/* Vibe Coding Section */}
        <div className="card bg-navy text-white text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-saffron">
                <BrainCircuit size={24} />
                <h3 className="text-h3 text-white mb-0">Built with Google Antigravity</h3>
              </div>
              <p className="text-blue-200 text-small mb-0">
                This platform was engineered using "Vibe Coding" via the Google Antigravity agent. 
                By utilizing advanced AI planning mode, autonomous UI generation, and multi-agent flows, 
                we ensured high-speed prototyping while maintaining strict repository hygiene (under 10 MB).
              </p>
            </div>
            <div className="flex-shrink-0">
              <Code size={64} className="text-white/20" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Transparency;
