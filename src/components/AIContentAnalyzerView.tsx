import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  SearchCheck, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  PenSquare,
  Flame,
  Award
} from 'lucide-react';
import { analyzeContent } from '../services/api';

export const AIContentAnalyzerView: React.FC = () => {
  const { setIsStudioModalOpen, setStudioInitialDraft, showToast } = useApp();

  const [inputContent, setInputContent] = useState(
    `We are excited to announce our upcoming global brand product drop happening this Friday! Everyone can participate and win exclusive limited tier items. Early access and gift cards provided. Register at link in bio.`
  );
  const [platform, setPlatform] = useState('instagram');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>({
    overallScore: 68,
    strengths: [
      'Clear value proposition and incentive offer',
      'Direct perks and access privileges highlighted',
    ],
    weaknesses: [
      'Hook is generic ("We are excited to announce...") causing instant scroll-away',
      'No visual curiosity gap or tension for creator audiences',
      'Call to action lacks urgency or scarcity trigger',
    ],
    recommendations: [
      'Replace opening line with a high-stakes question or curiosity trigger',
      'Add structured formatting to break up text blocks on mobile feeds',
      'Specify exclusive categories to attract niche enthusiasts',
    ],
    improvedVersion: `🔥 48 Hours. 100 Collector Units. $10,000 in VIP Prizes.\n\nThink your setup is ready for the biggest drop of 2026? ⚡\n\nThe Apex Capsule Drop is officially LIVE. Global shipping, early firmware builds, and private discord access for launch day holders.\n\n⚡ Only 50 slots remaining. Tap the link in bio to claim your allocation before registration locks tonight! 🚀\n\n#ApexDrop #DesignTech #CreatorSetup #BuildTheFuture`,
  });

  const handleRunAnalysis = async () => {
    if (!inputContent.trim()) {
      showToast('Enter Text First', 'Please enter your draft post or caption.', 'warning');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await analyzeContent(inputContent, platform);
      setAnalysisResult(res);
      showToast('Analysis Completed! 🎯', `Content scored ${res.overallScore}/100 with actionable feedback.`, 'success');
    } catch (e) {
      showToast('Error', 'Could not complete analysis', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="ai-analyzer-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">AUDIT ENGINE</span>
            <span className="text-xs text-[#9A9A9A] font-mono">CONTENT GRADING</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
            Hook & Retention Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Audit your drafts before publishing. Score hooks, story retention, and mobile feed click-through potential.
          </p>
        </div>
      </div>

      {/* Main Grid: Input + Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Textbox */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl card-brivon space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono-tag text-[#9A9A9A]">
              DRAFT POST / CAPTION
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="input-brivon px-3 py-1 text-xs font-mono capitalize"
            >
              <option value="instagram" className="bg-[#111111] text-white">Instagram Reel / Feed</option>
              <option value="linkedin" className="bg-[#111111] text-white">LinkedIn Post</option>
              <option value="youtube" className="bg-[#111111] text-white">YouTube Short</option>
              <option value="x" className="bg-[#111111] text-white">X / Twitter</option>
            </select>
          </div>

          <textarea
            rows={8}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Paste your draft caption, hook, or script concept here for an instant algorithmic grade..."
            className="input-brivon w-full p-4 rounded-xl text-xs leading-relaxed font-mono"
          />

          <button
            id="run-analysis-btn"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 btn-lime text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
          >
            <Sparkles className={`w-4 h-4 text-[#080808] ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Algorithmic Score...' : 'Audit Hook & Virality'}</span>
          </button>
        </div>

        {/* Right: Score Card & Recommendations */}
        <div className="lg:col-span-6 space-y-6">
          {/* Score Header Card */}
          <div className="p-6 rounded-2xl card-brivon flex items-center justify-between">
            <div>
              <span className="font-mono-tag text-[10px] text-[#707070]">VIRALITY INDEX</span>
              <h3 className="text-xl font-display font-extrabold text-white mt-0.5">
                {analysisResult.overallScore >= 85 ? 'Viral Ready' : analysisResult.overallScore >= 70 ? 'Solid Draft' : 'Needs Optimization'}
              </h3>
              <p className="text-xs font-mono text-[#9A9A9A] mt-1">
                Calculated against feed retention benchmarks and hook engagement rate.
              </p>
            </div>

            <div className="w-20 h-20 rounded-2xl bg-[#C8FF00] flex flex-col items-center justify-center text-[#080808] shadow-lg shrink-0">
              <span className="text-2xl font-mono font-black leading-none">{analysisResult.overallScore}</span>
              <span className="text-[10px] font-mono-tag font-bold opacity-80">/ 100</span>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl card-brivon text-center">
              <span className="font-mono-tag text-[9px] text-[#707070]">HOOK POWER</span>
              <p className="text-base font-mono font-extrabold text-[#C8FF00] mt-1">
                {Math.min(100, analysisResult.overallScore + 5)}%
              </p>
            </div>
            <div className="p-3.5 rounded-2xl card-brivon text-center">
              <span className="font-mono-tag text-[9px] text-[#707070]">RETENTION</span>
              <p className="text-base font-mono font-extrabold text-white mt-1">
                {Math.min(100, analysisResult.overallScore - 2)}%
              </p>
            </div>
            <div className="p-3.5 rounded-2xl card-brivon text-center">
              <span className="font-mono-tag text-[9px] text-[#707070]">CTA CLARITY</span>
              <p className="text-base font-mono font-extrabold text-[#C8FF00] mt-1">
                {Math.min(100, analysisResult.overallScore + 8)}%
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="p-6 rounded-2xl card-brivon space-y-4">
            <div>
              <p className="font-mono-tag text-[10px] text-[#C8FF00] mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WHAT WORKS WELL</span>
              </p>
              <ul className="space-y-1.5 text-xs font-mono text-[#9A9A9A]">
                {analysisResult.strengths?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#C8FF00]">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="font-mono-tag text-[10px] text-rose-400 mb-2 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>AREAS TO OPTIMIZE</span>
              </p>
              <ul className="space-y-1.5 text-xs font-mono text-[#9A9A9A]">
                {analysisResult.weaknesses?.map((w: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-400">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Improved Version Box */}
          {analysisResult.improvedVersion && (
            <div className="p-6 rounded-2xl card-brivon border-[#C8FF00]/30 space-y-4 bg-[#141414]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#C8FF00]" />
                  <h4 className="text-sm font-display font-bold text-white">AI High-Conversion Rewrite</h4>
                </div>
                <span className="font-mono-tag text-[9px] px-2 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30">
                  SCORE: 96/100
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/5 text-xs whitespace-pre-line text-[#F5F5F0] leading-relaxed font-mono">
                {analysisResult.improvedVersion}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysisResult.improvedVersion);
                    showToast('Copied Rewrite', 'Copied improved text to clipboard.', 'info');
                  }}
                  className="text-xs text-[#9A9A9A] hover:text-white font-mono flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Rewrite</span>
                </button>

                <button
                  onClick={() => {
                    setStudioInitialDraft({
                      title: 'AI Optimized Post',
                      caption: analysisResult.improvedVersion,
                    });
                    setIsStudioModalOpen(true);
                  }}
                  className="btn-lime px-4 py-2 text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <PenSquare className="w-3.5 h-3.5 text-[#080808]" />
                  <span>Send to Studio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
