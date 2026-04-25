import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import ECISourceTag from '../components/ECISourceTag';
import VoterFinger from '../illustrations/VoterFinger';
import TranslateText from '../components/TranslateText';

const myths = [
  {
    id: 1,
    myth: 'Your vote is not secret. Booth officials can see who you voted for.',
    fact: 'EVM votes are completely anonymous. No one — including booth officials, candidates, or political parties — can ever link a vote to a specific voter. The EVM records only the total count, not who pressed which button.',
    source: 'ECI Handbook on EVM Operation, Chapter 4',
    sourceUrl: 'https://voters.eci.gov.in',
  },
  {
    id: 2,
    myth: 'EVMs can be hacked or tampered with to change your vote.',
    fact: 'Indian EVMs are standalone machines with no WiFi, Bluetooth, or internet connection — making remote hacking impossible. They use one-time programmable chips. The Election Commission invites all parties to inspect EVMs before elections.',
    source: 'ECI Technical Specifications for EVMs',
    sourceUrl: 'https://voters.eci.gov.in',
  },
  {
    id: 3,
    myth: 'You need your Voter ID card to vote. No other ID is accepted.',
    fact: 'You can vote using any ONE of 12 valid photo identity documents — including Aadhaar, Passport, PAN Card, Driving Licence, MNREGA Job Card, or Pension Document with photo. The EPIC card is just one option.',
    source: 'ECI Circular on Alternative Photo ID Documents',
    sourceUrl: 'https://voters.eci.gov.in',
  },
  {
    id: 4,
    myth: 'If you vote for NOTA, your vote is wasted and helps no one.',
    fact: 'NOTA is a constitutionally valid choice introduced by the Supreme Court in 2013. It registers official dissatisfaction with all candidates. While it does not transfer to any candidate, it is counted in the total votes polled and is a legitimate civic act.',
    source: 'Supreme Court Order PUCL vs. Union of India, 2013',
    sourceUrl: 'https://voters.eci.gov.in',
  },
  {
    id: 5,
    myth: 'You can vote more than once by going to different booths.',
    fact: 'Voting more than once is impossible and illegal. Every voter is assigned to a specific booth on the electoral roll. Indelible ink is applied to your index finger, and your name is marked off. A second attempt is rejected and is a criminal offence under the Representation of the People Act.',
    source: 'Representation of the People Act, 1951, Section 171E',
    sourceUrl: 'https://voters.eci.gov.in',
  },
  {
    id: 6,
    myth: 'Rich or politically-connected voters have more voting power than ordinary citizens.',
    fact: 'In India\'s democracy, every vote has equal weight regardless of the voter\'s wealth, caste, religion, or political connections. One Citizen, One Vote, One Value — this is guaranteed by Articles 325 and 326 of the Constitution of India.',
    source: 'Constitution of India, Articles 325 & 326',
    sourceUrl: 'https://voters.eci.gov.in',
  },
];

const MythBuster = () => {
  return (
    <MainLayout>
      <div className="page-container section-spacing">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-h1 text-navy font-bold mb-2"><TranslateText>Election Myths vs. Facts</TranslateText></h1>
            <p className="text-small text-[#5C5C5C] max-w-xl">
              <TranslateText>Common misconceptions about Indian elections — debunked with official sources from the Election Commission of India.</TranslateText>
            </p>
          </div>
          <div className="hidden md:block flex-shrink-0" aria-hidden="true">
            <VoterFinger className="w-20 h-20" />
          </div>
        </div>

        {/* Myth Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {myths.map((m) => (
            <article
              key={m.id}
              className="rounded-card overflow-hidden shadow-sm hover:-translate-y-1 transition-transform border border-gray-100"
              aria-label={`Myth: ${m.myth.substring(0, 40)}…`}
            >
              {/* MYTH section */}
              <div className="bg-red-50 border-l-4 border-red-400 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-500 text-white text-meta font-bold px-2 py-0.5 rounded"><TranslateText>MYTH</TranslateText></span>
                  <span className="text-red-600" aria-hidden="true">✗</span>
                </div>
                <p className="text-small font-semibold text-red-900 mb-0">"<TranslateText>{m.myth}</TranslateText>"</p>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-300 bg-white" aria-hidden="true" />

              {/* FACT section */}
              <div className="bg-forest-light border-l-4 border-forest p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-forest text-white text-meta font-bold px-2 py-0.5 rounded"><TranslateText>FACT</TranslateText></span>
                  <span className="text-forest" aria-hidden="true">✓</span>
                </div>
                <p className="text-small text-[#1A1A1A] mb-3"><TranslateText>{m.fact}</TranslateText></p>
                <ECISourceTag url={m.sourceUrl} text={<TranslateText>{`Source: ${m.source}`}</TranslateText>} />
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-8 bg-saffron-light rounded-card border border-saffron/20">
          <h2 className="text-h2 text-navy font-semibold mb-3"><TranslateText>Still Have Questions?</TranslateText></h2>
          <p className="text-small text-[#5C5C5C] mb-5"><TranslateText>Our AI assistant is trained on ECI data and can answer any question about the voting process.</TranslateText></p>
          <Link to="/chat" className="btn-primary inline-flex gap-2 px-7 py-3.5">
            <TranslateText>Ask the Assistant</TranslateText> <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default MythBuster;
