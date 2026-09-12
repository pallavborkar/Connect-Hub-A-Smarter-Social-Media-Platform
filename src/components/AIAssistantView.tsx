import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  PenSquare, 
  Film, 
  Zap, 
  Layers, 
  Flame, 
  Hash, 
  HelpCircle, 
  ArrowRight,
  RefreshCw,
  Clock,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateReelIdeas, generateVideoScript, generateCaptions, generateHooks, generateHashtags } from '../services/api';

export const AIAssistantView: React.FC = () => {
  const { 
    setIsStudioModalOpen, 
    setStudioInitialDraft, 
    showToast,
    subscription,
    consumeAICredit,
    checkFeatureAccess,
    openUpgradeModal
  } = useApp();

  const [toolMode, setToolMode] = useState<'reels' | 'script' | 'captions' | 'hooks' | 'hashtags'>('reels');
  const [topic, setTopic] = useState('Campus Hackathon Finalist Demos & Prize Ceremony');
  const [tone, setTone] = useState<'energetic' | 'professional' | 'funny' | 'genz' | 'storytelling'>('energetic');
  const [duration, setDuration] = useState<'15s' | '30s' | '60s'>('30s');
  const [targetAudience, setTargetAudience] = useState('College Students & Tech Recruiters');

  const [isLoading, setIsLoading] = useState(false);
  const [resultReels, setResultReels] = useState<any[]>([]);
  const [resultScript, setResultScript] = useState<any | null>(null);
  const [resultCaptions, setResultCaptions] = useState<string[]>([]);
  const [resultHooks, setResultHooks] = useState<string[]>([]);
  const [resultTags, setResultTags] = useState<string[]>([]);

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Enter a Topic', 'Please enter a topic or concept.', 'warning');
      return;
    }

    // Check AI Credit Limit
    const hasCredit = consumeAICredit(1);
    if (!hasCredit) {
      // consumeAICredit automatically triggers openUpgradeModal
      return;
    }

    setIsLoading(true);

    try {
      if (toolMode === 'reels') {
        const res = await generateReelIdeas(topic, targetAudience, tone, 3);
        setResultReels(res.ideas || []);
        showToast('Reels Generated! 🎬', 'Generated 3 high-retention reel concepts.', 'success');
      } else if (toolMode === 'script') {
        const res = await generateVideoScript(topic, duration, tone, 'Cinematic high-energy tech style');
        setResultScript(res);
        showToast('Script Ready! 📜', 'Full shot-by-shot production script created.', 'success');
      } else if (toolMode === 'captions') {
        const res = await generateCaptions(topic, tone, 'instagram');
        setResultCaptions(res.captions || []);
        showToast('Captions Ready! ✍️', 'Generated engaging captions.', 'success');
      } else if (toolMode === 'hooks') {
        const res = await generateHooks(topic, targetAudience);
        setResultHooks(res.hooks || []);
        showToast('Hooks Generated! 🎣', 'Generated 5 scroll-stopping hooks.', 'success');
      } else if (toolMode === 'hashtags') {
        const res = await generateHashtags(topic, 'education, tech, campus');
        setResultTags(res.hashtags || []);
        showToast('Hashtags Ready! #️⃣', 'Generated optimized hashtags.', 'success');
      }
    } catch (e) {
      showToast('Error', 'Failed to generate AI response. Using smart fallback.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    showToast('Copied to Clipboard', 'Text copied successfully.', 'info');
  };

  return (
    <div id="ai-assistant-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto text-[#F5F5F0]">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/10 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00] font-mono-tag text-[10px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span>AI NEURAL ENGINE • POWERED BY GEMINI 2.5</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            What are we creating today?
          </h1>
          <p className="font-mono-tag text-xs text-[#9A9A9A] leading-relaxed">
            INPUT RAW CONCEPTS. WE ENGINEER HIGH-RETENTION HOOKS, VIRAL REELS, SCRIPTS, AND HASHTAG GRAPHS.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3.5 rounded-xl bg-[#181818] border border-white/10 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#C8FF00] flex items-center justify-center text-[#080808]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono-tag text-[9px] text-[#707070] font-bold uppercase tracking-wider">AI QUOTA STATUS</div>
              <div className="font-mono-tag text-xs font-bold text-white">
                {subscription.planId === 'agency' || subscription.planId === 'enterprise'
                  ? 'UNLIMITED GENERATIONS'
                  : `${subscription.usage.aiGenerationsUsed} / ${subscription.planId === 'creator' ? '100' : '10'} USED THIS MONTH`}
              </div>
            </div>
          </div>
          {subscription.planId === 'free' && (
            <button
              onClick={() => openUpgradeModal({
                title: 'Get 100+ Monthly AI Generations',
                description: 'Upgrade to Creator Plan to generate unlimited viral hooks, full scripts, and captions.'
              })}
              className="px-4 py-2.5 rounded-lg bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#080808]" />
              <span>UPGRADE QUOTA →</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#111111] border border-white/10">
        {[
          { id: 'reels', label: '🎬 VIRAL REEL IDEAS', icon: Film },
          { id: 'script', label: '📜 VIDEO SCRIPTING', icon: Zap },
          { id: 'captions', label: '✍️ CAPTIONS & COPY', icon: PenSquare },
          { id: 'hooks', label: '🎣 RETENTION HOOKS', icon: Flame },
          { id: 'hashtags', label: '#️⃣ HASHTAG GRAPH', icon: Hash },
        ].map((tab) => {
          const isActive = toolMode === tab.id;
          return (
            <button
              key={tab.id}
              id={`ai-tool-${tab.id}`}
              onClick={() => {
                setToolMode(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-lg font-mono-tag text-xs font-bold uppercase transition-all flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-[#C8FF00] text-[#080808] shadow-sm'
                  : 'text-[#9A9A9A] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Configuration Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/10 space-y-5">
        <div>
          <label className="block font-mono-tag text-[10px] uppercase font-bold text-[#9A9A9A] mb-1.5">
            [ TOPIC, PRODUCT OR EVENT CONCEPT ]
          </label>
          <div className="relative">
            <input
              id="ai-topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Mechanical engineering students building electric formula racing car..."
              className="w-full px-4 py-3.5 rounded-xl bg-[#181818] border border-white/10 font-sans text-sm font-semibold text-white placeholder-[#707070] focus:outline-none focus:border-[#C8FF00] pr-36"
            />
            <button
              id="ai-generate-main-btn"
              onClick={handleGenerate}
              disabled={isLoading}
              className="absolute right-2 top-2 px-4 py-2 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#080808] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'GENERATING...' : 'GENERATE →'}</span>
            </button>
          </div>
        </div>

        {/* Tone, Audience & Duration Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block font-mono-tag text-[10px] uppercase font-bold text-[#707070] mb-1">TONE & BRAND VOICE</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-lg bg-[#181818] border border-white/10 font-mono-tag text-xs font-bold text-white focus:outline-none focus:border-[#C8FF00]"
            >
              <option value="energetic" className="bg-[#111111]">ENERGETIC & FAST-PACED</option>
              <option value="funny" className="bg-[#111111]">HUMOROUS & SELF-AWARE</option>
              <option value="genz" className="bg-[#111111]">GEN-Z VIRAL INTERNET</option>
              <option value="professional" className="bg-[#111111]">EXECUTIVE & EDITORIAL</option>
              <option value="storytelling" className="bg-[#111111]">CINEMATIC STORYTELLING</option>
            </select>
          </div>

          <div>
            <label className="block font-mono-tag text-[10px] uppercase font-bold text-[#707070] mb-1">TARGET AUDIENCE</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Prospective students & founders"
              className="w-full px-3 py-2.5 rounded-lg bg-[#181818] border border-white/10 font-mono-tag text-xs font-bold text-white focus:outline-none focus:border-[#C8FF00]"
            />
          </div>

          <div>
            <label className="block font-mono-tag text-[10px] uppercase font-bold text-[#707070] mb-1">TARGET DURATION</label>
            <div className="flex items-center bg-[#181818] p-1 rounded-lg border border-white/10 font-mono-tag text-xs">
              {(['15s', '30s', '60s'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-1 rounded font-bold uppercase transition-all ${
                    duration === d
                      ? 'bg-[#C8FF00] text-[#080808]'
                      : 'text-[#707070] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Output Results Showcase */}
      <div className="space-y-6">
        {/* Reel Ideas Mode */}
        {toolMode === 'reels' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(resultReels.length > 0 ? resultReels : [
              {
                title: 'POV: 3 AM at the Campus Hackathon',
                hook: 'If you think founders only sleep, wait till you see hour 23... ☕🤯',
                concept: 'A cinematic timelapse of whiteboard schematics crashing, coffee cups stacking, followed by a final code compilation success cheer.',
                visualDirection: 'Rapid jump cuts, heavy kinetic sound design, lo-fi beats into bass drop.',
                callToAction: 'Tag your hackathon squad who survives on cold pizza.',
              },
              {
                title: 'The Secret Lab Nobody Shows You',
                hook: 'There is a room in this facility that looks like Tony Stark built it... 🤖',
                concept: 'Host walks past normal rooms, opens hidden magnetic door to 12 autonomous robotics arms and AI drone swarms.',
                visualDirection: 'FPV drone shot swooping through the corridor straight into the lab.',
                callToAction: 'Admissions for 2026 are open. Tap link in bio to tour the lab.',
              },
              {
                title: 'Expectations vs Reality: Product Sprint',
                hook: 'How 1st year designers think sprints work vs what actually happens 💀',
                concept: 'Hilarious side-by-side comparison of neatly color-coded moodboards vs 4 laptops open simultaneously debugging build errors.',
                visualDirection: 'Fast meme sound effects, split-screen layout format.',
                callToAction: 'Share this to someone currently drowning in Figma tabs.',
              }
            ]).map((reel, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#111111] border border-white/10 hover:border-[#C8FF00]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded font-mono-tag text-[9px] font-bold uppercase bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30">
                      CONCEPT #{idx + 1}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${reel.title}\n\nHook: ${reel.hook}\n\nConcept: ${reel.concept}`, idx)}
                      className="p-1.5 text-[#707070] hover:text-white rounded hover:bg-white/5 cursor-pointer"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-[#C8FF00]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-base text-white uppercase mb-2">{reel.title}</h3>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white mb-3">
                    🎣 Hook: "{reel.hook}"
                  </div>

                  <div className="space-y-2 text-xs text-[#9A9A9A]">
                    <p><strong className="text-white">Storyboard:</strong> {reel.concept}</p>
                    <p><strong className="text-white">Camera:</strong> {reel.visualDirection}</p>
                    <p className="text-[#C8FF00]"><strong className="text-[#C8FF00]">CTA:</strong> {reel.callToAction}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setStudioInitialDraft({
                        title: reel.title,
                        caption: `🔥 ${reel.hook}\n\n${reel.concept}\n\n👉 ${reel.callToAction}\n\n#Socially #CreatorEconomy #ViralReels`,
                        tags: ['Socially', 'ViralReels', 'Creator'],
                      });
                      setIsStudioModalOpen(true);
                    }}
                    className="w-full py-2 bg-white/10 hover:bg-[#C8FF00] hover:text-[#080808] text-white rounded-lg font-mono-tag text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    <span>SEND TO STUDIO →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Script Mode */}
        {toolMode === 'script' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ SHOT-BY-SHOT SCRIPT ]</span>
                <h3 className="font-display text-xl font-black text-white uppercase mt-0.5">
                  {resultScript?.title || 'Championship Production: 30s Kinetic Reel Script'}
                </h3>
                <p className="font-mono-tag text-xs text-[#707070] mt-0.5">TARGET DURATION: {duration} • HIGH VELOCITY HOOK CUT</p>
              </div>

              <button
                onClick={() => {
                  setStudioInitialDraft({
                    title: resultScript?.title || 'Production 30s Reel',
                    caption: `🎬 Production Script:\n\n${resultScript?.scenes ? resultScript.scenes.map((s: any) => `[${s.time}] ${s.visual}\nVoice: ${s.audio}`).join('\n\n') : 'Production highlights!'}`,
                  });
                  setIsStudioModalOpen(true);
                }}
                className="px-4 py-2 bg-[#C8FF00] hover:bg-[#D4FF35] text-[#080808] font-mono-tag font-bold text-xs rounded-lg flex items-center space-x-1.5 cursor-pointer"
              >
                <PenSquare className="w-3.5 h-3.5 text-[#080808]" />
                <span>OPEN IN STUDIO →</span>
              </button>
            </div>

            <div className="space-y-3">
              {(resultScript?.scenes || [
                { time: '0:00 - 0:03', visual: 'Fast zoom-in on robotic arm soldering silicon chip with glowing sparks.', audio: 'Voiceover: "They said this was impossible in 24 hours."', textOverlay: 'HOUR 01 ⏱️' },
                { time: '0:03 - 0:08', visual: 'Whip-pan across product team debugging frantically on three ultrawide monitors.', audio: 'Voiceover: "48 teams. 10,000 lines of code. Zero sleep."', textOverlay: 'SPRINT 2026 🔥' },
                { time: '0:08 - 0:18', visual: 'Drone takes off autonomously; judge gasps; engineer raises fists in victory.', audio: 'Epic bass drop and synthesized audio beat punch.', textOverlay: 'SYSTEM DEPLOYED 🚀' },
                { time: '0:18 - 0:30', visual: 'Golden confetti erupts on stage holding oversized winner check.', audio: 'Voiceover: "Welcome to Socially Innovation Labs. Beta access live now."', textOverlay: 'TAG YOUR SQUAD 🏆' },
              ]).map((scene: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-2">
                    <span className="px-2.5 py-1 rounded bg-white/10 text-[#C8FF00] font-mono-tag text-xs font-bold">
                      {scene.time}
                    </span>
                  </div>
                  <div className="md:col-span-5 text-xs text-[#F5F5F0]">
                    <p className="font-bold text-white uppercase font-mono-tag text-[10px]">Visual & Camera:</p>
                    <p className="mt-0.5 text-[#9A9A9A]">{scene.visual}</p>
                  </div>
                  <div className="md:col-span-3 text-xs text-[#9A9A9A]">
                    <p className="font-bold text-white uppercase font-mono-tag text-[10px]">Audio / VO:</p>
                    <p className="mt-0.5">{scene.audio}</p>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <span className="font-mono-tag text-[10px] font-bold bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 px-2 py-0.5 rounded">
                      {scene.textOverlay}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Captions Mode */}
        {toolMode === 'captions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(resultCaptions.length > 0 ? resultCaptions : [
              '🚀 When ambition meets opportunity, impossible becomes a Tuesday afternoon sprint.\n\nOur product engineering squad just clocked 1st place at the National Tech Challenge! 🏆 From debugging microcontrollers at 3 AM to seeing the autonomous rover cross the finish line—this is what hands-on building looks like.\n\nReady to build the future? Early beta access for 2026 is officially open. Tap the link in bio to schedule your team walkthrough! 🌟\n\n#Socially #EngineeringPride #Innovation #Robotics #CreatorEconomy',
              'Coffee: ☕ 4 cups.\nCode: 💻 8,400 lines.\nSleep: 😴 Optional.\nVictory: 🥇 Unmatched.\n\nSwipe left to see the moment our team shipped the Smart Hackathon release! Tag a builder who would stay up all night shipping with you. 🔥\n\n#SociallyHQ #HackathonWinners #YouthInnovators',
            ]).map((cap, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#111111] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tag text-xs font-bold text-[#C8FF00]">CAPTION ANGLE #{i + 1}</span>
                    <button onClick={() => copyToClipboard(cap, i)} className="p-1 text-[#707070] hover:text-white cursor-pointer">
                      {copiedIdx === i ? <Check className="w-4 h-4 text-[#C8FF00]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs whitespace-pre-line text-[#F5F5F0] leading-relaxed font-sans">{cap}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setStudioInitialDraft({ title: 'AI Generated Post', caption: cap });
                      setIsStudioModalOpen(true);
                    }}
                    className="w-full py-2 bg-white/10 hover:bg-[#C8FF00] hover:text-[#080808] text-white rounded-lg font-mono-tag text-xs font-bold transition-all cursor-pointer"
                  >
                    USE IN POST →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hooks Mode */}
        {toolMode === 'hooks' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ HOOK BANK ]</span>
            <h3 className="font-display text-lg font-bold text-white uppercase">Viral Hook Presets (First 3 Seconds)</h3>
            <div className="space-y-3">
              {(resultHooks.length > 0 ? resultHooks : [
                'Stop scrolling if you think creator management is just posting twice a day... 🤯',
                'The #1 mistake brands make before launching their social pipeline:',
                'What happens when you give 4 creative directors 24 hours and unlimited coffee:',
                'Nobody talks about this secret growth loop hidden inside Instagram algorithms...',
                'If you are scaling a creative agency in 2026, you NEED to see this first:',
              ]).map((hook, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-[#C8FF00]/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs font-bold text-white">"{hook}"</span>
                  </div>
                  <button onClick={() => copyToClipboard(hook, i)} className="p-1.5 text-[#707070] hover:text-white shrink-0 ml-2 cursor-pointer">
                    {copiedIdx === i ? <Check className="w-4 h-4 text-[#C8FF00]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags Mode */}
        {toolMode === 'hashtags' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] uppercase font-bold">[ HASHTAG GRAPH ]</span>
            <h3 className="font-display text-lg font-bold text-white uppercase">High-Affinity Hashtag Cluster</h3>
            <div className="flex flex-wrap gap-2">
              {(resultTags.length > 0 ? resultTags : [
                '#SociallyApp', '#CreatorEconomy', '#ViralStrategy', '#EditorialDesign', '#MediaCommand',
                '#ContentCreator', '#AgencyWorkflow', '#GrowthHacking', '#TechInnovators', '#SocialCommand',
                '#ContentStrategy', '#ViralReels', '#NextGenDesign', '#InnovationLab', '#StudioSync'
              ]).map((tag, i) => (
                <button
                  key={i}
                  onClick={() => copyToClipboard(tag, i)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono-tag text-xs font-bold hover:border-[#C8FF00] hover:text-[#C8FF00] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
