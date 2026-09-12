import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Image as ImageIcon, 
  Video, 
  Upload, 
  Folder, 
  FolderPlus, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  X, 
  Sparkles,
  PenSquare,
  FileText,
  UploadCloud,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../types';

export const MediaLibraryView: React.FC = () => {
  const { 
    mediaItems, 
    addMediaItem, 
    deleteMediaItem, 
    setIsStudioModalOpen, 
    setStudioInitialDraft, 
    showToast 
  } = useApp();

  const [activeFolder, setActiveFolder] = useState<string>('All Assets');
  const [activeType, setActiveType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Media Form State
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFolder, setNewFolder] = useState('Brand Campaigns');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [newTags, setNewTags] = useState('Campaign, Brand');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const sampleStockAssets = [
    { name: 'Global Keynote Stage.jpg', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', type: 'image' as const, folder: 'Brand Campaigns' },
    { name: 'Creative Agency Workshop.jpg', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', type: 'image' as const, folder: 'Brand Campaigns' },
    { name: 'Executive Team Meeting.jpg', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80', type: 'image' as const, folder: 'Team & Culture' },
    { name: 'Studio Neon Setup.jpg', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80', type: 'image' as const, folder: 'Templates & Overlays' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewUrl(event.target.result as string);
          if (!newName) {
            setNewName(file.name);
          }
          if (file.type.startsWith('video/')) {
            setNewType('video');
          } else {
            setNewType('image');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const folders = [
    'All Assets',
    'Brand Campaigns',
    'Product Releases',
    'Team & Culture',
    'Customer Stories',
    'Templates & Overlays'
  ];

  const filteredMedia = mediaItems.filter(item => {
    if (activeFolder !== 'All Assets' && item.folder !== activeFolder) return false;
    if (activeType !== 'all' && item.type !== activeType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const tagsList = item.tags || [];
      const matchTag = tagsList.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchTag) return false;
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    addMediaItem({
      name: newName,
      url: newUrl,
      folder: newFolder,
      type: newType,
      size: newType === 'video' ? '18.4 MB' : '2.1 MB',
      dimensions: newType === 'video' ? '1080x1920' : '1080x1080',
      duration: newType === 'video' ? '0:30' : undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    });

    setIsUploadModalOpen(false);
    setNewName('');
    setNewUrl('');
    setNewTags('Campaign, Brand');
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    showToast('Asset URL Copied', 'Direct media URL copied to clipboard.', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseInPost = (item: MediaItem) => {
    const itemTags = item.tags || [];
    setStudioInitialDraft({
      title: item.name ? item.name.replace(/\.[^/.]+$/, '') : 'New Campaign Post',
      mediaUrl: item.url,
      caption: `⚡ Exciting update from the team!\n\n${itemTags.length > 0 ? '#' + itemTags.join(' #') : ''}`,
      tags: itemTags,
    });
    setIsStudioModalOpen(true);
  };

  return (
    <div id="media-library-view" className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono-tag text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">MEDIA VAULT</span>
            <span className="text-xs text-[#9A9A9A] font-mono">ASSETS REPOSITORY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F5F5F0] tracking-tight">
            Media & Creative Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1 max-w-2xl">
            Centralized library for high-resolution video reels, brand lockups, design templates, and campaign collateral.
          </p>
        </div>

        <button
          id="upload-media-btn"
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-lime px-5 py-2.5 text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-[#C8FF00]/10"
        >
          <UploadCloud className="w-4 h-4 text-[#080808]" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 card-brivon p-4 rounded-2xl">
        <div className="flex items-center space-x-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by keyword, format, tag..."
              className="input-brivon w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Type Pills */}
        <div className="flex items-center space-x-2 text-xs w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'image', label: 'Images (Hi-Res)' },
            { id: 'video', label: 'Reels & MP4' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeType === tab.id
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'btn-secondary-dark text-[#9A9A9A] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Folder Sidebar + Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Folders List */}
        <div className="md:col-span-3 card-brivon rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <span className="font-mono-tag text-[10px] text-[#9A9A9A]">DIRECTORIES</span>
            <span className="font-mono text-[10px] text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5 rounded border border-[#C8FF00]/20">
              {mediaItems.length} FILES
            </span>
          </div>

          {folders.map((folder) => {
            const count = folder === 'All Assets' 
              ? mediaItems.length 
              : mediaItems.filter(m => m.folder === folder).length;
            const isSelected = activeFolder === folder;

            return (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/30 font-bold'
                    : 'text-[#9A9A9A] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C8FF00]' : 'text-[#707070]'}`} />
                  <span className="truncate">{folder}</span>
                </div>
                <span className="text-[10px] opacity-70 font-mono">[{count}]</span>
              </button>
            );
          })}
        </div>

        {/* Media Grid */}
        <div className="md:col-span-9">
          {filteredMedia.length === 0 ? (
            <div className="p-12 text-center card-brivon rounded-2xl">
              <ImageIcon className="w-12 h-12 text-[#707070] mx-auto mb-3 opacity-50" />
              <h3 className="text-sm font-display font-bold text-[#F5F5F0]">No assets found in vault</h3>
              <p className="text-xs text-[#9A9A9A] mt-1">Try adjusting your filters or upload a new asset.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMedia.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className="card-brivon rounded-2xl overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-[#080808] overflow-hidden border-b border-white/10">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#F5F5F0] border border-white/10 text-[9px] font-mono-tag flex items-center space-x-1">
                      {item.type === 'video' ? <Video className="w-3 h-3 text-[#C8FF00]" /> : <ImageIcon className="w-3 h-3 text-[#C8FF00]" />}
                      <span>{item.type}</span>
                    </div>

                    {item.duration && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[#F5F5F0] text-[9px] font-mono border border-white/10">
                        {item.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#F5F5F0] leading-snug line-clamp-1 group-hover:text-[#C8FF00] transition-colors" title={item.name}>
                        {item.name}
                      </h4>

                      <p className="text-[10px] text-[#707070] font-mono mt-1">
                        {item.folder} • {item.size} {item.dimensions ? `• ${item.dimensions}` : ''}
                      </p>

                      {/* Tag pills */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {(item.tags || []).map((tag, i) => (
                          <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#151515] border border-white/5 text-[#9A9A9A]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleCopyLink(item.url, item.id)}
                          className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-white hover:bg-white/10 transition-colors"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#C8FF00]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleUseInPost(item)}
                        className="btn-lime px-3 py-1 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <PenSquare className="w-3 h-3 text-[#080808]" />
                        <span>Use in Post</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-display font-black text-white">Delete Media Asset?</h3>
                <p className="text-xs text-[#9A9A9A]">
                  This media file will be removed from your team library and links may expire.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 btn-secondary-dark py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteMediaItem(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg card-brivon bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-white">Upload Media Asset</h3>
                  <p className="text-xs text-[#9A9A9A]">Add imagery, reels, or design assets to the vault.</p>
                </div>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-1.5 text-[#9A9A9A] hover:text-white rounded-lg bg-[#151515]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sample stock quick presets */}
              <div className="p-3.5 bg-[#151515] rounded-xl border border-white/10 space-y-2">
                <span className="font-mono-tag text-[10px] text-[#9A9A9A]">QUICK DEMO PRESETS:</span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleStockAssets.map((stock, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewName(stock.name);
                        setNewUrl(stock.url);
                        setNewFolder(stock.folder);
                        setNewType(stock.type);
                      }}
                      className="p-2 rounded-lg border border-white/10 bg-[#0D0D0D] hover:border-[#C8FF00]/40 text-left transition-colors flex items-center space-x-2 cursor-pointer"
                    >
                      <img src={stock.url} alt="" className="w-7 h-7 rounded-md object-cover" />
                      <span className="text-[10px] font-semibold text-[#F5F5F0] truncate">{stock.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Local file selector */}
                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">CHOOSE LOCAL FILE</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-[#9A9A9A] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/10 file:text-xs file:font-semibold file:bg-[#151515] file:text-[#C8FF00] hover:file:bg-[#222222] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">ASSET NAME</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Q4 Brand Keynote Footage.mp4"
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">MEDIA URL</label>
                  <input
                    type="text"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://... or cloud asset link"
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">TARGET DIRECTORY</label>
                    <select
                      value={newFolder}
                      onChange={(e) => setNewFolder(e.target.value)}
                      className="input-brivon w-full px-3 py-2 rounded-xl text-xs"
                    >
                      {folders.filter(f => f !== 'All Assets').map((f) => (
                        <option key={f} value={f} className="bg-[#111111] text-white">
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">FILE TYPE</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="input-brivon w-full px-3 py-2 rounded-xl text-xs"
                    >
                      <option value="image" className="bg-[#111111] text-white">Image (JPEG/PNG)</option>
                      <option value="video" className="bg-[#111111] text-white">Video / Reel (MP4)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tag text-[#9A9A9A] mb-1.5">TAGS (COMMA-SEPARATED)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Campaign, Keynote, 2026"
                    className="input-brivon w-full px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="btn-secondary-dark px-4 py-2 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-lime px-5 py-2 text-xs font-bold cursor-pointer"
                  >
                    Save to Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
