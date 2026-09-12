import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePermissions } from '../../hooks/usePermissions';
import { BrandAsset, BrandAssetCategory } from '../../types';
import { 
  Palette, 
  Plus, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  FileText, 
  Type, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Building2, 
  X,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_TABS: { id: BrandAssetCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All Brand Assets', icon: Layers },
  { id: 'logo', label: 'Logos & Marks', icon: ImageIcon },
  { id: 'color_palette', label: 'Color Palette', icon: Palette },
  { id: 'font', label: 'Typography', icon: Type },
  { id: 'guideline', label: 'Brand Guidelines', icon: FileText },
  { id: 'template', label: 'Templates & Media', icon: Layers },
];

export const BrandAssetsView: React.FC = () => {
  const { 
    filteredBrandAssets, 
    addBrandAsset, 
    deleteBrandAsset, 
    approveBrandAsset, 
    activeClient, 
    isClientViewMode,
    currentRole 
  } = useApp();
  const { hasPermission } = usePermissions();

  const [selectedCategory, setSelectedCategory] = useState<BrandAssetCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Upload modal state
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<BrandAssetCategory>('logo');
  const [assetUrl, setAssetUrl] = useState('');
  const [hexCodes, setHexCodes] = useState('');
  const [fontFamily, setFontFamily] = useState('');
  const [description, setDescription] = useState('');

  const isClient = currentRole === 'client' || isClientViewMode;

  const assets = filteredBrandAssets.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.fontFamily && item.fontFamily.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    addBrandAsset({
      clientId: activeClient ? activeClient.id : 'client-1',
      workspaceId: 'ws-agency',
      name: assetName.trim(),
      category: assetCategory,
      url: assetUrl.trim() || (assetCategory === 'logo' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' : undefined),
      colorHexes: hexCodes ? hexCodes.split(',').map(h => h.trim()) : undefined,
      fontFamily: fontFamily.trim() || undefined,
      description: description.trim() || undefined,
      fileSize: '1.4 MB',
      fileType: assetCategory === 'guidelines' ? 'PDF Document' : 'Vector Image',
    });

    setAssetName('');
    setAssetUrl('');
    setHexCodes('');
    setFontFamily('');
    setDescription('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Brand Assets & Style Guide
            </h1>
            {activeClient && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                {activeClient.name}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Central repository for verified brand logos, official palettes, typography guidelines, and creative templates.
          </p>
        </div>

        {hasPermission('brand_assets.upload') && (
          <button
            id="upload-brand-asset-btn"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center space-x-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Brand Asset</span>
          </button>
        )}
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="search-brand-assets-input"
            type="text"
            placeholder="Search assets, hex, fonts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assets.map((asset) => {
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              <div>
                {/* Visual Preview Banner */}
                {asset.category === 'color_palette' && asset.colorHexes && (
                  <div className="h-32 grid grid-cols-4 p-2 gap-1.5 bg-slate-100 dark:bg-slate-800/50">
                    {asset.colorHexes.map((hex, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopyHex(hex)}
                        title={`Click to copy ${hex}`}
                        className="h-full rounded-xl flex flex-col justify-end p-2 transition-transform hover:scale-[1.02] cursor-pointer shadow-xs relative group"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs flex items-center justify-between w-full">
                          <span>{hex}</span>
                          {copiedHex === hex ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {asset.category === 'typography' && (
                  <div className="h-32 p-4 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-800/50 dark:to-purple-950/20 flex flex-col justify-center border-b border-slate-100 dark:border-slate-800">
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100" style={{ fontFamily: asset.fontFamily || 'inherit' }}>
                      Aa Bb Gg 123
                    </p>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
                      {asset.fontFamily || 'Modern Display Font'}
                    </p>
                  </div>
                )}

                {asset.category !== 'color_palette' && asset.category !== 'typography' && asset.url && (
                  <div className="h-36 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                    <img 
                      src={asset.url} 
                      alt={asset.name} 
                      className="max-h-full max-w-full object-contain rounded-lg" 
                    />
                  </div>
                )}

                {/* Asset Metadata */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        {asset.category.replace('_', ' ')}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {asset.name}
                      </h3>
                    </div>
                    {asset.isApproved ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  {asset.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {asset.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{asset.fileType || 'Asset File'} • {asset.fileSize || '1.2 MB'}</span>
                    <span>By {asset.uploadedBy}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {asset.url && (
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {!asset.isApproved && hasPermission('brand_assets.manage') && (
                    <button
                      onClick={() => approveBrandAsset(asset.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Verify
                    </button>
                  )}

                  {hasPermission('brand_assets.manage') && (
                    <button
                      onClick={() => deleteBrandAsset(asset.id)}
                      title="Delete asset"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Upload Brand Asset Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Brand Asset</h2>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asset Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Primary Horizontal Vector Logo"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asset Category
                  </label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="logo">Logo & Brand Marks</option>
                    <option value="color_palette">Color Palette & Hex Codes</option>
                    <option value="typography">Typography & Font Guide</option>
                    <option value="guidelines">Brand Guidelines (PDF / Doc)</option>
                    <option value="templates">Templates & Media Assets</option>
                  </select>
                </div>

                {assetCategory === 'color_palette' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hex Codes (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="#6366F1, #EC4899, #0F172A, #F8FAFC"
                      value={hexCodes}
                      onChange={(e) => setHexCodes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                ) : assetCategory === 'typography' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Font Family / Spec
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Plus Jakarta Sans, Inter, Playfair Display"
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Asset URL or File link
                    </label>
                    <input
                      type="url"
                      placeholder="https://... image or pdf link"
                      value={assetUrl}
                      onChange={(e) => setAssetUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Usage Notes / Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Always maintain 24px padding around the logomark. Do not place on red backgrounds."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20"
                  >
                    Save Asset
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
