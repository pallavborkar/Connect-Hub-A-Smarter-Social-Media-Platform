import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  PenSquare, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  Send, 
  Save, 
  CheckSquare, 
  Clock, 
  Smile, 
  Hash, 
  RefreshCw, 
  Eye, 
  Layers, 
  Smartphone, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Check,
  Zap,
  Lock,
  Crown,
  X,
  UploadCloud,
  ArrowUpRight
} from 'lucide-react';
import { SocialPlatform, PostStatus } from '../types';
import { generateCaptions, generateHooks, generateHashtags, analyzeContent } from '../services/api';

interface ContentStudioViewProps {
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({ isModal, onCloseModal }) => {
  const { 
    addPost, 
    studioInitialDraft, 
    setStudioInitialDraft, 
    mediaItems, 
    showToast, 
    setActiveView,
    subscription,
    consumeAICredit,
    checkFeatureAccess,
    openUpgradeModal,
    userTimezone,
    liveClock,
    currentTime,
    formatDate
  } = useApp();

  const getDefaultScheduledDate = () => {
    if (studioInitialDraft?.scheduledDate) return studioInitialDraft.scheduledDate;
    const tomorrow = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} 10:00 AM`;
  };

  const [title, setTitle] = useState(studioInitialDraft?.title || '');
  const [caption, setCaption] = useState(studioInitialDraft?.caption || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    studioInitialDraft?.platforms || (studioInitialDraft as any)?.platform || ['instagram', 'linkedin']
  );
  const [mediaUrl, setMediaUrl] = useState(
    studioInitialDraft?.mediaUrl ||
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
  );
  const [scheduledDate, setScheduledDate] = useState(getDefaultScheduledDate);
  const [tags, setTags] = useState<string[]>(studioInitialDraft?.tags || ['BrandGrowth', 'AgencyWorkflow', 'SaaS']);
  const [newTag, setNewTag] = useState('');
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('instagram');
  const [mobileStudioTab, setMobileStudioTab] = useState<'editor' | 'preview'>('editor');

  // File Upload & Media Library states
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Lock Confirmation Modal state
  const [isLockConfirmOpen, setIsLockConfirmOpen] = useState(false);

  // AI Generation Loaders
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (studioInitialDraft) {
      if (studioInitialDraft.title) setTitle(studioInitialDraft.title);
      if (studioInitialDraft.caption) setCaption(studioInitialDraft.caption);
      if (studioInitialDraft.mediaUrl) setMediaUrl(studioInitialDraft.mediaUrl);
      if (studioInitialDraft.scheduledDate) setScheduledDate(studioInitialDraft.scheduledDate);
      if (studioInitialDraft.tags) setTags(studioInitialDraft.tags);
      const initialPlatforms = studioInitialDraft.platforms || (studioInitialDraft as any).platform;
      if (initialPlatforms && Array.isArray(initialPlatforms) && initialPlatforms.length > 0) {
        setSelectedPlatforms(initialPlatforms);
      }
    }
  }, [studioInitialDraft]);

  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter(i => i !== p) : prev) : [...prev, p]
    );
  };

  const addCustomTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().replace(/^#/, ''))) {
      setTags([...tags, newTag.trim().replace(/^#/, '')]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // AI Handler: Caption
  const handleGenerateCaption = async () => {
    if (!title.trim()) {
      showToast('Enter a Title / Topic First', 'Type a brief topic name above so AI knows what to write about.', 'warning');
      return;
    }
    if (!consumeAICredit(1)) return;

    setIsGeneratingCaption(true);
    try {
      const res = await generateCaptions(title, 'energetic', selectedPlatforms[0]);
      if (res.captions && res.captions.length > 0) {
        setCaption(res.captions[0]);
        setAiSuggestions(res.captions.slice(1));
        showToast('Captions Generated ✨', 'Generated high-conversion copy with optimal spacing.', 'success');
      }
    } catch (e) {
      showToast('Error', 'Could not generate caption', 'error');
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  // AI Handler: Hooks
  const handleGenerateHooks = async () => {
    if (!title.trim()) {
      showToast('Enter a Topic First', 'Topic is required for viral hooks.', 'warning');
      return;
    }
    if (!consumeAICredit(1)) return;

    setIsGeneratingHooks(true);
    try {
      const res = await generateHooks(title, 'modern digital consumers and business leaders');
      if (res.hooks && res.hooks.length > 0) {
        const topHook = res.hooks[0];
        setCaption(prev => `⚡ ${topHook}\n\n${prev}`);
        showToast('Hook Injected! 🎣', `Added: "${topHook}" to the start.`, 'success');
      }
    } catch (e) {
      showToast('Error', 'Could not generate hooks', 'error');
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  // AI Handler: Hashtags
  const handleGenerateTags = async () => {
    if (!title.trim() && !caption.trim()) {
      showToast('Need Context', 'Enter a title or caption to extract trending tags.', 'warning');
      return;
    }
    if (!consumeAICredit(1)) return;

    setIsGeneratingTags(true);
    try {
      const res = await generateHashtags(title || caption, 'marketing, SaaS, tech, growth');
      if (res.hashtags && res.hashtags.length > 0) {
        const cleaned = res.hashtags.map(h => h.replace(/^#/, ''));
        setTags(Array.from(new Set([...tags, ...cleaned])));
        showToast('Hashtags Added #️⃣', `Added ${cleaned.length} algorithm-optimized hashtags.`, 'success');
      }
    } catch (e) {
      showToast('Error', 'Could not generate hashtags', 'error');
    } finally {
      setIsGeneratingTags(false);
    }
  };

  // Save / Submit Handlers
  const handleSavePost = (status: PostStatus) => {
    if (!title.trim()) {
      showToast('Missing Title', 'Please give this post a title.', 'warning');
      return;
    }

    addPost({
      title,
      caption,
      mediaUrl,
      mediaType: mediaUrl.includes('mp4') ? 'video' : 'image',
      platform: selectedPlatforms,
      status,
      scheduledDate,
      tags,
    });

    if (onCloseModal) onCloseModal();
    setStudioInitialDraft(null);
  };

  return (
    <div id="content-studio-view" className={`space-y-6 max-w-7xl mx-auto ${isModal ? 'p-0' : 'p-6 sm:p-8'}`}>
      {!isModal && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">COMPOSER STUDIO</span>
              <span className="text-xs text-[#9A9A9A] font-mono">v3.4 PRO</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
              Content Studio & Composer
            </h1>
            <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
              Craft multi-channel campaigns with Gemini-powered copy generation and instant mobile simulation.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="studio-save-draft-btn-top"
              onClick={() => handleSavePost('draft')}
              className="btn-secondary-dark px-4 py-2 text-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Draft</span>
            </button>
            <button
              id="studio-schedule-btn-top"
              onClick={() => setIsLockConfirmOpen(true)}
              className="btn-lime px-5 py-2 text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
            >
              <Lock className="w-3.5 h-3.5 text-[#080808]" />
              <span>Schedule & Lock</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile / Tablet Tab Switcher */}
      <div className="flex lg:hidden items-center justify-center p-1 rounded-xl bg-[#111111] border border-white/10 max-w-sm mx-auto">
        <button
          id="studio-tab-editor"
          onClick={() => setMobileStudioTab('editor')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            mobileStudioTab === 'editor'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:text-white'
          }`}
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>Editor & AI</span>
        </button>
        <button
          id="studio-tab-preview"
          onClick={() => setMobileStudioTab('preview')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            mobileStudioTab === 'preview'
              ? 'bg-[#C8FF00] text-[#080808]'
              : 'text-[#9A9A9A] hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Feed Preview</span>
        </button>
      </div>

      {/* Main Studio Editor & Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Editor & Controls */}
        <div className={`lg:col-span-7 space-y-6 ${mobileStudioTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Post Title & Channels Card */}
          <div className="card-brivon p-6 rounded-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tag text-[#9A9A9A]">
                  CAMPAIGN / POST TITLE
                </label>
                <span className="text-[10px] text-[#707070] font-mono">Required</span>
              </div>
              <input
                id="studio-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Global Brand Keynote & Feature Launch"
                className="input-brivon w-full px-4 py-3 rounded-xl text-sm font-semibold placeholder:text-[#707070]"
              />
            </div>

            {/* Target Channels */}
            <div>
              <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-2">
                DISTRIBUTION CHANNELS
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'instagram' as SocialPlatform, label: 'Instagram', tag: 'IG' },
                  { id: 'linkedin' as SocialPlatform, label: 'LinkedIn', tag: 'LI' },
                  { id: 'facebook' as SocialPlatform, label: 'Facebook', tag: 'FB' },
                  { id: 'youtube' as SocialPlatform, label: 'YouTube Shorts', tag: 'YT' },
                  { id: 'x' as SocialPlatform, label: 'X (Twitter)', tag: 'X' },
                ].map((p) => {
                  const isSelected = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      id={`studio-platform-${p.id}`}
                      onClick={() => togglePlatform(p.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 cursor-pointer ${
                        isSelected
                          ? 'border-[#C8FF00] bg-[#C8FF00]/10 text-[#C8FF00]'
                          : 'border-white/10 bg-[#151515] text-[#9A9A9A] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-70">[{p.tag}]</span>
                      <span>{p.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#C8FF00]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Caption & AI Enhancers Card */}
          <div className="card-brivon p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-tag text-[#9A9A9A]">
                CAPTION & COPYWRITING
              </label>
              <span className="text-[11px] text-[#707070] font-mono">
                {caption.length} / 2,200 chars
              </span>
            </div>

            <textarea
              id="studio-caption-input"
              rows={6}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your post narrative, copy, or campaign announcement..."
              className="input-brivon w-full p-4 rounded-xl text-xs leading-relaxed font-sans placeholder:text-[#707070]"
            />

            {/* AI Assistant Quick Actions Box */}
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#F5F5F0]">
                  <Sparkles className="w-4 h-4 text-[#C8FF00]" />
                  <span className="font-display">Gemini AI Copy Engine</span>
                </div>
                <span className="font-mono-tag text-[9px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded">
                  1 CREDIT / GEN
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  id="studio-ai-caption-btn"
                  onClick={handleGenerateCaption}
                  disabled={isGeneratingCaption}
                  className="btn-lime px-3.5 py-2 text-xs font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-[#080808] ${isGeneratingCaption ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingCaption ? 'Crafting copy...' : 'Generate High-Conversion Caption'}</span>
                </button>

                <button
                  id="studio-ai-hook-btn"
                  onClick={handleGenerateHooks}
                  disabled={isGeneratingHooks}
                  className="btn-secondary-dark px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>⚡ Inject Hook</span>
                </button>

                <button
                  id="studio-ai-tags-btn"
                  onClick={handleGenerateTags}
                  disabled={isGeneratingTags}
                  className="btn-secondary-dark px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Hash className="w-3.5 h-3.5 text-[#C8FF00]" />
                  <span>Extract Hashtags</span>
                </button>
              </div>

              {aiSuggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs">
                  <p className="font-mono-tag text-[10px] text-[#9A9A9A] mb-2">ALTERNATIVE VARIATIONS:</p>
                  <div className="space-y-1.5">
                    {aiSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => setCaption(sug)}
                        className="text-left w-full p-2.5 rounded-lg bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[11px] text-[#F5F5F0] line-clamp-1 border border-white/5 hover:border-[#C8FF00]/40 transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hashtag Management */}
            <div>
              <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-2">
                HASHTAGS & TAXONOMY
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#151515] border border-white/10 text-[#F5F5F0] text-xs font-mono"
                  >
                    <span className="text-[#C8FF00]">#</span>
                    <span>{t}</span>
                    <button onClick={() => removeTag(t)} className="text-[#707070] hover:text-rose-400 ml-1 transition-colors">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  placeholder="Type tag and press Enter..."
                  className="input-brivon flex-1 px-3.5 py-2 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="btn-secondary-dark px-4 py-2 text-xs font-bold rounded-xl"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Media & Schedule Card */}
          <div className="card-brivon p-6 rounded-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tag text-[#9A9A9A]">
                  MEDIA ASSET OR ATTACHMENT
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setMediaUrl(url);
                        showToast('File Attached! 📁', `${file.name} selected.`, 'success');
                      }
                    }}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <button
                    id="studio-file-upload-btn"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary-dark px-3 py-1.5 text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#C8FF00]" />
                    <span>Upload File</span>
                  </button>
                  <button
                    id="studio-library-picker-btn"
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="btn-secondary-dark px-3 py-1.5 text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#C8FF00]" />
                    <span>Media Library</span>
                  </button>
                </div>
              </div>
              <input
                id="studio-media-input"
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... or click Upload / Library above"
                className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs font-mono"
              />
              <div className="flex items-center space-x-2 mt-2.5">
                <span className="font-mono-tag text-[10px] text-[#707070]">PRESETS:</span>
                {[
                  { label: 'Creative Studio', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' },
                  { label: 'Keynote Stage', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80' },
                  { label: 'Modern Office', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' },
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setMediaUrl(preset.url)}
                    className="text-[11px] font-mono text-[#9A9A9A] hover:text-[#C8FF00] underline decoration-dotted transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tag text-[#9A9A9A]">
                  SCHEDULED BROADCAST DATE & TIME
                </label>
                <span className="text-[10px] font-mono text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">
                  {userTimezone} ({liveClock.tzAbbrev})
                </span>
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#707070] absolute left-3.5 top-3" />
                <input
                  id="studio-schedule-input"
                  type="text"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  placeholder="YYYY-MM-DD HH:MM AM/PM"
                  className="input-brivon w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Submissions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              id="studio-save-draft-btn"
              onClick={() => handleSavePost('draft')}
              className="btn-secondary-dark px-4 py-2.5 text-xs font-bold flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                id="studio-submit-review-btn"
                onClick={() => handleSavePost('pending_review')}
                className="btn-secondary-dark px-4 py-2.5 text-xs font-bold flex items-center space-x-2 border-amber-500/30 text-amber-300 hover:border-amber-500/60 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Submit for Team Approval</span>
              </button>

              <button
                id="studio-schedule-btn"
                onClick={() => setIsLockConfirmOpen(true)}
                className="btn-lime px-5 py-2.5 text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
                title="Schedule this post and lock it against further editing"
              >
                <Lock className="w-3.5 h-3.5 text-[#080808]" />
                <span>Schedule & Lock</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Mobile Device Mockup */}
        <div className={`lg:col-span-5 lg:sticky lg:top-20 ${mobileStudioTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="card-brivon p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#C8FF00]" />
                <span className="font-mono-tag text-xs text-[#F5F5F0]">LIVE FEED SIMULATION</span>
              </div>

              {/* Preview Platform Switcher */}
              <div className="flex items-center space-x-1 bg-[#080808] p-1 rounded-lg border border-white/10">
                {(['instagram', 'linkedin', 'x'] as SocialPlatform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreviewPlatform(p)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold transition-all ${
                      previewPlatform === p ? 'bg-[#C8FF00] text-[#080808]' : 'text-[#707070] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Mockup Frame */}
            <div className="max-w-[340px] mx-auto bg-[#080808] rounded-[36px] p-3 border-2 border-white/15 shadow-2xl">
              {/* Phone Camera Notch */}
              <div className="w-24 h-4 bg-[#151515] rounded-full mx-auto mb-3 border border-white/10" />

              {/* Feed Card */}
              <div className="bg-[#111111] text-[#F5F5F0] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                {/* Account header */}
                <div className="p-3 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#C8FF00] p-0.5">
                      <div className="w-full h-full rounded-full bg-[#080808] flex items-center justify-center font-display font-bold text-[9px] text-[#C8FF00]">
                        SC
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#F5F5F0] leading-tight">socially_hq</p>
                      <p className="text-[9px] text-[#707070] font-mono">Official • Verified</p>
                    </div>
                  </div>
                  <span className="text-[#707070] text-xs font-bold">•••</span>
                </div>

                {/* Media preview */}
                <div className="relative aspect-square bg-[#080808] overflow-hidden">
                  {mediaUrl ? (
                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#707070] p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                      <span className="text-[10px] font-mono">No media attached</span>
                    </div>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#C8FF00] border border-[#C8FF00]/30 text-[9px] font-mono font-bold">
                    POST
                  </span>
                </div>

                {/* Engagement icons */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[#F5F5F0]">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <MessageCircle className="w-4 h-4 text-[#9A9A9A]" />
                      <Share2 className="w-4 h-4 text-[#9A9A9A]" />
                    </div>
                    <Bookmark className="w-4 h-4 text-[#9A9A9A]" />
                  </div>

                  <p className="text-[10px] font-bold text-[#F5F5F0]">1,482 likes</p>

                  <div className="text-[11px] leading-snug">
                    <span className="font-bold text-[#F5F5F0] mr-1.5">socially_hq</span>
                    <span className="text-[#9A9A9A] whitespace-pre-line">
                      {caption || 'Your campaign narrative will be rendered here with live font scaling and tag support.'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-[#C8FF00]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <p className="text-[9px] text-[#707070] font-mono uppercase pt-1">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      {isLockConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md card-brivon bg-[#111111] rounded-2xl p-6 shadow-2xl border border-white/10 space-y-4"
          >
            <div className="flex items-center space-x-3 text-[#C8FF00]">
              <Lock className="w-6 h-6 shrink-0 text-[#C8FF00]" />
              <h3 className="text-base font-display font-extrabold text-white">
                Confirm Schedule & Lock
              </h3>
            </div>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Locking prevents further edits by creators unless explicitly unlocked by an Owner or Manager. The post will automatically publish to <strong className="text-[#F5F5F0]">{selectedPlatforms.join(', ')}</strong> at <strong className="text-[#F5F5F0]">{scheduledDate || 'the selected time'}</strong>.
            </p>
            <div className="p-3 rounded-xl bg-[#151515] border border-white/10 text-[11px] text-[#9A9A9A] font-mono">
              🔒 Locking ensures compliance before automated cross-channel broadcast.
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsLockConfirmOpen(false)}
                className="btn-secondary-dark px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLockConfirmOpen(false);
                  handleSavePost('scheduled');
                }}
                className="btn-lime px-5 py-2 text-xs font-bold cursor-pointer"
              >
                Confirm & Lock
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl card-brivon bg-[#111111] rounded-2xl p-6 shadow-2xl border border-white/10 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-display font-extrabold text-[#F5F5F0]">
                  Select Asset from Media Vault
                </h3>
                <p className="text-xs text-[#9A9A9A]">
                  Pick from uploaded assets, reels, and brand imagery.
                </p>
              </div>
              <button
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515] border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mediaItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setMediaUrl(item.url);
                    setIsMediaPickerOpen(false);
                    showToast('Asset Selected! 🎨', item.title, 'success');
                  }}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#C8FF00] cursor-pointer aspect-square transition-all"
                >
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                    <span className="text-[11px] font-bold text-white truncate">{item.title}</span>
                    <span className="font-mono-tag text-[9px] text-[#C8FF00]">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsMediaPickerOpen(false)}
                className="btn-secondary-dark px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
