import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  Video, 
  Camera, 
  Sun, 
  Layers, 
  Sliders, 
  RefreshCw,
  Film
} from 'lucide-react';
import { generateVideoPrompts } from '../services/api';

export const AIPromptGeneratorView: React.FC = () => {
  const { showToast } = useApp();

  const [concept, setConcept] = useState('Autonomous drone sweeping through sleek architectural gallery');
  const [cameraMotion, setCameraMotion] = useState('Dynamic FPV drone swoop with motion blur');
  const [lighting, setLighting] = useState('Golden hour volumetric sunbeams with cinematic lens flare');
  const [style, setStyle] = useState('Hyper-realistic 8K, 35mm anamorphic lens, shallow depth of field');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [targetTool, setTargetTool] = useState<'veo' | 'runway' | 'sora' | 'midjourney'>('veo');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<any[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGeneratePrompts = async () => {
    if (!concept.trim()) {
      showToast('Enter Concept First', 'Please enter a visual video concept.', 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const fullStyle = `${style}, ${cameraMotion}, ${lighting}, aspect ratio ${aspectRatio}`;
      const res = await generateVideoPrompts(concept, fullStyle);
      setGeneratedPrompts(res.prompts || []);
      showToast('Prompts Generated! 🎬', `Generated video prompts formatted for ${targetTool.toUpperCase()}.`, 'success');
    } catch (e) {
      showToast('Error', 'Failed to generate prompts', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    showToast('Prompt Copied', 'Ready to paste into video generation tool.', 'info');
  };

  return (
    <div id="ai-prompts-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto text-[#F5F5F0]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">SYNTHESIS LAB</span>
            <span className="text-xs text-[#9A9A9A] font-mono">VIDEO PROMPTING</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
            AI Video Prompt Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Engineer cinematic camera prompts with volumetric lighting, precise focal lengths, and camera motions for Veo, Runway, and Sora.
          </p>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Prompt Controls */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl card-brivon space-y-5">
          <div>
            <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
              TARGET GENERATIVE AI ENGINE
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'veo', label: 'Google Veo' },
                { id: 'runway', label: 'Runway Gen-3' },
                { id: 'sora', label: 'OpenAI Sora' },
                { id: 'midjourney', label: 'Midjourney v6' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTargetTool(m.id as any)}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                    targetTool === m.id
                      ? 'bg-[#C8FF00] text-[#080808]'
                      : 'bg-[#151515] text-[#9A9A9A] border border-white/5 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
              SCENE CONCEPT & SUBJECT
            </label>
            <textarea
              rows={3}
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. A futuristic luxury brand launch where luminescent architectural arcs frame the runway..."
              className="input-brivon w-full p-3.5 rounded-xl text-xs font-mono"
            />
          </div>

          {/* Camera Motion */}
          <div>
            <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
              CAMERA MOTION & FRAMING
            </label>
            <select
              value={cameraMotion}
              onChange={(e) => setCameraMotion(e.target.value)}
              className="input-brivon w-full p-2.5 rounded-xl text-xs font-mono"
            >
              <option value="Dynamic FPV drone swoop with motion blur" className="bg-[#111111] text-white">Dynamic FPV drone swoop with motion blur</option>
              <option value="Smooth 360-degree orbit around subjects" className="bg-[#111111] text-white">Smooth 360-degree orbit around subjects</option>
              <option value="Slow cinematic low-angle dolly push-in" className="bg-[#111111] text-white">Slow cinematic low-angle dolly push-in</option>
              <option value="Whip-pan transition into extreme close-up" className="bg-[#111111] text-white">Whip-pan transition into extreme close-up</option>
              <option value="Static tripod, deep focal depth, subtle parallax" className="bg-[#111111] text-white">Static tripod, deep focal depth, subtle parallax</option>
            </select>
          </div>

          {/* Lighting & Environment */}
          <div>
            <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
              LIGHTING & ATMOSPHERE
            </label>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="input-brivon w-full p-2.5 rounded-xl text-xs font-mono"
            >
              <option value="Golden hour volumetric sunbeams with cinematic lens flare" className="bg-[#111111] text-white">Golden hour volumetric sunbeams with cinematic lens flare</option>
              <option value="Architectural studio lighting, deep shadows, volumetric fog" className="bg-[#111111] text-white">Architectural studio lighting, deep shadows, volumetric fog</option>
              <option value="Clean modern studio keylight, soft ambient daylight" className="bg-[#111111] text-white">Clean modern studio keylight, soft ambient daylight</option>
              <option value="Moody overcast dramatic twilight, cool neutral grading" className="bg-[#111111] text-white">Moody overcast dramatic twilight, cool neutral grading</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">
              OUTPUT ASPECT RATIO
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: '9:16', label: '9:16 (Vertical Reel / Short)' },
                { id: '16:9', label: '16:9 (Landscape 4K)' },
                { id: '1:1', label: '1:1 (Square Feed)' },
              ].map((ar) => (
                <button
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                    aspectRatio === ar.id
                      ? 'bg-[#C8FF00] text-[#080808]'
                      : 'bg-[#151515] text-[#9A9A9A] border border-white/5 hover:text-white'
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="generate-prompts-btn"
            onClick={handleGeneratePrompts}
            disabled={isGenerating}
            className="w-full py-3.5 btn-lime text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
          >
            <Sparkles className={`w-4 h-4 text-[#080808] ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Prompts...' : 'Generate Video Prompts'}</span>
          </button>
        </div>

        {/* Right: Prompt Outputs */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-mono-tag text-[#707070]">
            GENERATED PROMPTS FOR {targetTool.toUpperCase()}
          </h3>

          <div className="space-y-4">
            {(generatedPrompts.length > 0 ? generatedPrompts : [
              {
                tool: 'Google Veo',
                promptText: 'Cinematic 8K 60fps video: An ultra-sleek matte-black industrial drone with glowing amber LED rings glides through the minimalist atrium of a modern design studio. Camera performs an exhilarating low-angle dive tracking along reflective polished concrete floors. Golden hour light cascades through geometric glass skylights. 35mm anamorphic lens, hyper-realistic textures, clean motion blur --ar 9:16',
                negativePrompt: 'blurry, low resolution, plastic texture, grainy artifact, distorted geometry',
                cameraSettings: 'FPV Swoop • 24mm Anamorphic • 60 FPS • f/2.8',
              },
              {
                tool: 'Runway Gen-3',
                promptText: 'High energy cinematic macro close-up of a designer inspecting a glowing holographic interface, particles dispersing in slow motion (120fps). Smooth whip-pan to team in background celebrating product release. Minimalist rim lighting, studio softbox ambient light --ar 9:16',
                negativePrompt: 'overexposed, distorted face, low FPS, watermarks, stuttering',
                cameraSettings: 'Macro Push • 85mm Prime • 120 FPS Slow-Mo',
              }
            ]).map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl card-brivon space-y-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4 text-[#C8FF00]" />
                    <span className="font-display font-bold text-white text-xs">{p.tool || 'Generative Engine'} Prompt #{idx + 1}</span>
                  </div>
                  <span className="font-mono-tag text-[9px] px-2 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20">
                    {aspectRatio}
                  </span>
                </div>

                <div>
                  <p className="font-mono-tag text-[9px] text-[#707070] mb-1">MASTER PROMPT:</p>
                  <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-white/5 text-[#F5F5F0] leading-relaxed select-all whitespace-pre-line">
                    {p.promptText}
                  </div>
                </div>

                {p.negativePrompt && (
                  <div>
                    <p className="font-mono-tag text-[9px] text-[#707070] mb-1">NEGATIVE PROMPT:</p>
                    <p className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                      {p.negativePrompt}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-[#707070]">{p.cameraSettings || '8K UHD Mastered'}</span>
                  <button
                    onClick={() => copyPrompt(p.promptText, idx)}
                    className="btn-secondary-dark px-3.5 py-1.5 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-[#C8FF00]" /> : <Copy className="w-3.5 h-3.5 text-[#C8FF00]" />}
                    <span>{copiedIdx === idx ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
