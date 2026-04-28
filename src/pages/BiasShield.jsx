import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MainLayout from '../components/MainLayout';
import { ShieldAlert, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import TranslateText from '../components/TranslateText';

const BiasShield = () => {
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeBias = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'REPLACE_WITH_YOUR_KEY') {
      setTimeout(() => {
        setResult({
          score: 80,
          biasedWords: ['corrupt', 'disastrous', 'rigged'],
          neutralSummary: 'The article discusses the upcoming election process and concerns raised by observers.',
          verdict: 'Highly Emotionally Charged'
        });
        setAnalyzing(false);
      }, 1500);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `You are an Unbiased AI Bias Detector. Analyze the political news snippet provided. 
1. Identify emotionally charged, manipulative, or biased words.
2. Give a "Bias Score" from 0 to 100 (100 being extremely biased/manipulative).
3. Provide a strictly neutral, factual summary of the core claim.
Return ONLY strict JSON matching this schema: {"score": 85, "biasedWords": ["word1", "word2"], "neutralSummary": "Neutral fact.", "verdict": "Highly Biased"}`,
        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
      });

      const res = await model.generateContent(input);
      const parsed = JSON.parse(res.response.text());
      setResult(parsed);
    } catch (e) {
      console.error(e);
      setResult({
        score: 0,
        biasedWords: [],
        neutralSummary: 'Error analyzing text. Please try again.',
        verdict: 'Analysis Failed'
      });
    }
    setAnalyzing(false);
  };

  return (
    <MainLayout>
      <div className="page-container section-spacing animate-fade-in">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 text-meta font-semibold rounded-full mb-5">
            <TranslateText>Unbiased AI Decision Track</TranslateText>
          </span>
          <h1 className="text-h1 text-navy font-bold mb-4">
            <TranslateText>Political Bias Shield</TranslateText>
          </h1>
          <p className="text-[#5C5C5C] max-w-2xl mx-auto">
            <TranslateText>Paste a political news snippet, WhatsApp forward, or claim below. Our Unbiased AI will strip away emotionally charged language and give you the neutral facts.</TranslateText>
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="card shadow-lg mb-8">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-navy focus:outline-none resize-none"
              rows={5}
              placeholder="Paste news snippet here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={analyzeBias}
              disabled={analyzing || !input.trim()}
              className="btn-primary w-full flex justify-center gap-2"
            >
              {analyzing ? (
                <TranslateText>Analyzing Bias...</TranslateText>
              ) : (
                <>
                  <ShieldAlert size={20} /> <TranslateText>Analyze snippet</TranslateText>
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="card bg-navy text-white animate-fade-in shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b border-white/20 pb-4 gap-4">
                <div>
                  <h3 className="text-h3 text-white mb-1"><TranslateText>Analysis Complete</TranslateText></h3>
                  <p className="text-blue-200 text-small mb-0">
                    <TranslateText>Verdict:</TranslateText> <strong className="text-saffron">{result.verdict}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                  <AlertTriangle className={result.score > 50 ? 'text-red-400' : 'text-yellow-400'} size={24} />
                  <div className="text-right">
                    <div className="text-[24px] font-bold leading-none">{result.score}/100</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-70">Bias Score</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-small font-bold text-blue-200 uppercase tracking-wider mb-3"><TranslateText>Emotionally Charged Words Flagged</TranslateText></h4>
                <div className="flex flex-wrap gap-2">
                  {result.biasedWords.map((word, idx) => (
                    <span key={idx} className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-small">
                      {word}
                    </span>
                  ))}
                  {result.biasedWords.length === 0 && (
                    <span className="text-gray-400 italic text-small"><TranslateText>No heavily biased words detected.</TranslateText></span>
                  )}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-5 border-l-4 border-forest">
                <h4 className="text-small font-bold text-forest uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle size={16} /> <TranslateText>Neutral Fact Summary</TranslateText>
                </h4>
                <p className="text-white mb-0 text-base leading-relaxed">
                  {result.neutralSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BiasShield;
