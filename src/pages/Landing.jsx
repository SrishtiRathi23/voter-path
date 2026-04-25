import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, CalendarCheck, ArrowRight, CheckCircle } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import BallotBox from '../illustrations/BallotBox';
import IndiaMapOutline from '../illustrations/IndiaMapOutline';
import VoterFinger from '../illustrations/VoterFinger';
import TranslateText from '../components/TranslateText';

const features = [
  {
    icon: Globe,
    title: 'Multilingual Support',
    desc: 'Ask in English, Hindi, or Tamil — get answers in your language instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'ECI Verified Facts',
    desc: 'Every answer is backed by the Election Commission of India. No guesswork.',
  },
  {
    icon: CalendarCheck,
    title: 'Add to Calendar',
    desc: 'Never miss a registration or voting deadline with Google Calendar reminders.',
  },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Check your voter registration status on the ECI portal using your EPIC card.', icon: CheckCircle },
  { num: '02', title: 'Find Booth', desc: 'Locate your exact polling booth — address, timing, and what to carry.', icon: CheckCircle },
  { num: '03', title: 'Understand Ballot', desc: 'Learn how the EVM works, what NOTA means, and how votes are counted.', icon: CheckCircle },
  { num: '04', title: 'Vote', desc: 'Walk in confident. Your vote is completely secret and tamper-proof.', icon: CheckCircle },
];

const Landing = () => {
  return (
    <MainLayout showFooter={true}>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-saffron-light section-spacing">
        {/* Watermark India Map */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none" aria-hidden="true">
          <IndiaMapOutline className="w-[420px] h-[420px] opacity-30 -mr-16" />
        </div>

        <div className="page-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left — Text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 bg-saffron text-white text-meta font-semibold rounded-full mb-5">
                <TranslateText>🇮🇳 Your Civic Guide for Indian Elections</TranslateText>
              </span>
              <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-navy leading-tight mb-5">
                <TranslateText>Know Your Vote.</TranslateText>{' '}
                <span className="text-saffron"><TranslateText>Own Your Voice.</TranslateText></span>
              </h1>
              <p className="text-base text-[#5C5C5C] mb-8 max-w-lg mx-auto lg:mx-0">
                <TranslateText>A trusted, AI-powered guide for Indian voters. Get answers about registration, polling booths, EVM machines, and election deadlines — in your language.</TranslateText>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/checklist"
                  className="btn-primary text-base px-7 py-3.5 gap-2 shadow-md hover:shadow-lg"
                  aria-label="Start Guided Tour — go to voter checklist"
                >
                  <TranslateText>Start Guided Tour</TranslateText>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/chat"
                  className="btn-secondary text-base px-7 py-3.5"
                  aria-label="Ask the AI Assistant"
                >
                  <TranslateText>Ask the Assistant</TranslateText>
                </Link>
              </div>
            </div>

            {/* Right — Illustration */}
            <div className="flex-shrink-0 hidden md:flex items-center justify-center">
              <BallotBox className="w-[260px] h-[310px] drop-shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-navy py-6">
        <div className="page-container">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-[28px] md:text-[36px] font-bold text-saffron">97Cr+</div>
              <div className="text-meta text-blue-200"><TranslateText>Registered Voters</TranslateText></div>
            </div>
            <div>
              <div className="text-[28px] md:text-[36px] font-bold text-saffron">3</div>
              <div className="text-meta text-blue-200"><TranslateText>Languages Supported</TranslateText></div>
            </div>
            <div>
              <div className="text-[28px] md:text-[36px] font-bold text-saffron">0</div>
              <div className="text-meta text-blue-200"><TranslateText>Wrong Answers Given</TranslateText></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features Strip ── */}
      <section className="section-spacing bg-white" aria-labelledby="features-heading">
        <div className="page-container">
          <h2 id="features-heading" className="text-center text-h2 text-navy font-semibold mb-10">
            <TranslateText>Everything You Need to Vote with Confidence</TranslateText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card border-l-4 border-saffron hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-saffron-light rounded-full flex items-center justify-center flex-shrink-0">
                    <f.icon size={20} className="text-saffron" />
                  </div>
                  <h3 className="text-h3 text-navy font-semibold mb-0"><TranslateText>{f.title}</TranslateText></h3>
                </div>
                <p className="text-small text-[#5C5C5C] mb-0"><TranslateText>{f.desc}</TranslateText></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-spacing bg-saffron-light" aria-labelledby="how-it-works-heading">
        <div className="page-container">
          <h2 id="how-it-works-heading" className="text-center text-h2 text-navy font-semibold mb-12">
            <TranslateText>How VoterPath Works</TranslateText>
          </h2>
          <div className="relative">
            {/* Connector Line (desktop only) */}
            <div className="hidden lg:block absolute top-8 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 border-t-2 border-dashed border-saffron" aria-hidden="true" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <div key={step.num} className="relative flex flex-col items-center text-center group">
                  <div className="w-14 h-14 bg-saffron text-white rounded-full flex items-center justify-center font-bold text-[18px] mb-4 shadow-md group-hover:bg-saffron-dark transition-colors z-10">
                    {step.num}
                  </div>
                  <h3 className="text-h3 text-navy font-semibold mb-2"><TranslateText>{step.title}</TranslateText></h3>
                  <p className="text-small text-[#5C5C5C]"><TranslateText>{step.desc}</TranslateText></p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link to="/chat" className="btn-primary text-base px-8 py-4 gap-2 shadow-md hover:shadow-lg inline-flex">
              <TranslateText>Ask the AI Assistant Now</TranslateText>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Myth Teaser ── */}
      <section className="section-spacing bg-white" aria-labelledby="myth-teaser-heading">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-navy rounded-card p-8 text-white">
            <div className="flex-shrink-0">
              <VoterFinger className="w-24 h-24" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 id="myth-teaser-heading" className="text-h2 text-white mb-2"><TranslateText>Don't Fall for Election Myths</TranslateText></h2>
              <p className="text-small text-blue-200 mb-5">
                <TranslateText>"Your vote isn't secret." "You can vote twice." — These are lies. We bust 6 common myths with official ECI sources.</TranslateText>
              </p>
              <Link to="/myths" className="btn-primary inline-flex gap-2 px-6 py-3">
                <TranslateText>See All Myths</TranslateText> <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Landing;
