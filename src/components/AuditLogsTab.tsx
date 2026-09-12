import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { usePermissions } from '../hooks/usePermissions';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User, 
  Lock, 
  Clock, 
  Building2, 
  Layers, 
  CreditCard, 
  ArrowRight,
  Eye,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';
import { AuditLogEntry, RoleType } from '../types';
import { ROLE_CONFIGS } from '../config/permissions';
import { motion, AnimatePresence } from 'motion/react';

export const AuditLogsTab: React.FC = () => {
  const { 
    filteredAuditLogs, 
    workspace, 
    user, 
    showToast, 
    formatDate, 
    formatDateTime, 
    liveClock,
    userTimezone
  } = useApp();
  
  const { can, isOwner, isManager, currentRole, roleConfig } = usePermissions();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const [activeLogs, setActiveLogs] = useState<AuditLogEntry[]>(filteredAuditLogs);

  React.useEffect(() => {
    setActiveLogs(filteredAuditLogs);
  }, [filteredAuditLogs]);

  // Filter computation
  const filteredList = useMemo(() => {
    return activeLogs.filter(log => {
      if (selectedCategory !== 'all' && log.category !== selectedCategory) {
        return false;
      }
      if (selectedRole !== 'all' && log.userRole !== selectedRole) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesUser = log.userName.toLowerCase().includes(q);
        const matchesResource = log.resource.toLowerCase().includes(q);
        const matchesDetails = (log.details || '').toLowerCase().includes(q);
        if (!matchesAction && !matchesUser && !matchesResource && !matchesDetails) {
          return false;
        }
      }
      return true;
    });
  }, [activeLogs, selectedCategory, selectedRole, searchQuery, dateRange]);

  const handleExportJSON = () => {
    if (!can('reports.export') && !isOwner && !isManager) {
      showToast('Permission Denied', 'You need Owner or Manager permissions to export audit logs.', 'error');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `socially-audit-log-${workspace.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Export Completed', `Successfully exported ${filteredList.length} audit logs in JSON format.`, 'success');
  };

  const handleExportCSV = () => {
    if (!can('reports.export') && !isOwner && !isManager) {
      showToast('Permission Denied', 'You need Owner or Manager permissions to export audit logs.', 'error');
      return;
    }
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Category', 'Action', 'Resource', 'Previous Value', 'New Value', 'Details'];
    const rows = filteredList.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.category}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.resource.replace(/"/g, '""')}"`,
      `"${(l.previousValue || '').replace(/"/g, '""')}"`,
      `"${(l.newValue || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `socially-audit-log-${workspace.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('CSV Exported', `Exported ${filteredList.length} records to CSV.`, 'success');
  };

  const handleClearLogs = () => {
    if (!isOwner) {
      showToast('Access Denied', 'Only workspace Owners can purge audit logs.', 'error');
      return;
    }
    setActiveLogs([]);
    setIsClearModalOpen(false);
    showToast('Audit Log Purged', 'All past activity records have been safely archived and cleared.', 'info');
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'security':
        return { bg: 'bg-rose-500/10 text-rose-300 border-rose-500/20', icon: Lock };
      case 'approval':
        return { bg: 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/30', icon: ShieldCheck };
      case 'content':
        return { bg: 'bg-white/10 text-white border-white/20', icon: FileText };
      case 'team':
        return { bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', icon: User };
      case 'workspace':
        return { bg: 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/20', icon: Building2 };
      case 'billing':
        return { bg: 'bg-blue-500/10 text-blue-300 border-blue-500/20', icon: CreditCard };
      default:
        return { bg: 'bg-white/5 text-[#9A9A9A] border-white/10', icon: Layers };
    }
  };

  return (
    <div id="audit-logs-tab-content" className="space-y-6 text-[#F5F5F0]">
      {/* Top Banner Card */}
      <div className="p-6 sm:p-8 rounded-2xl card-brivon border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#C8FF00]/10 border border-[#C8FF00]/20 text-[#C8FF00] font-mono-tag text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span>IMMUTABLE SECURITY JOURNAL</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Enterprise Audit Trail & Compliance
            </h2>
            <p className="text-xs text-[#9A9A9A] max-w-xl font-mono leading-relaxed">
              Every sensitive workspace event — role assignments, post status transitions, approvals, campaign updates, and billing modifications — is recorded with actor metadata and UTC timestamps.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-center min-w-[110px]">
              <span className="text-[10px] font-mono-tag text-[#707070] uppercase block">TOTAL LOGGED</span>
              <span className="text-2xl font-black text-[#C8FF00] font-mono">{activeLogs.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-center min-w-[110px]">
              <span className="text-[10px] font-mono-tag text-[#707070] uppercase block">RBAC SCOPE</span>
              <span className="text-xs font-bold text-white font-mono block mt-1">
                {roleConfig.name}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-[#707070] font-mono-tag block">TIMEZONE BOUND</span>
            <span className="font-bold text-white">{userTimezone}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#707070] font-mono-tag block">RETENTION</span>
            <span className="font-bold text-white">365 Days</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#707070] font-mono-tag block">MULTI-TENANT GUARD</span>
            <span className="font-bold text-[#C8FF00] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
              <span>Isolated</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#707070] font-mono-tag block">EXPORT PRIVILEGES</span>
            <span className="font-bold text-white">{isOwner || isManager ? 'Authorized' : 'Restricted'}</span>
          </div>
        </div>
      </div>

      {/* Action and Filter Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl card-brivon space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="audit-search-input"
              type="text"
              placeholder="Search by action, user, resource ID, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-brivon w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-white text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>

          {/* Export & Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="audit-export-csv-btn"
              onClick={handleExportCSV}
              className="btn-secondary-dark px-3.5 py-2 text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
              title="Export filtered logs to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span>CSV</span>
            </button>

            <button
              id="audit-export-json-btn"
              onClick={handleExportJSON}
              className="btn-secondary-dark px-3.5 py-2 text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
              title="Export filtered logs to JSON"
            >
              <FileText className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span>JSON</span>
            </button>

            {isOwner && (
              <button
                id="audit-clear-logs-btn"
                onClick={() => setIsClearModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Purge logs (Owner Only)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Purge</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center space-x-1 text-[#707070] text-[10px] font-mono-tag mr-1 font-semibold">
            <Filter className="w-3 h-3" />
            <span>CATEGORY:</span>
          </div>

          {['all', 'security', 'approval', 'content', 'team', 'workspace', 'billing'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold capitalize transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'bg-white/5 text-[#9A9A9A] hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block" />

          <div className="flex items-center space-x-1 text-[#707070] text-[10px] font-mono-tag mr-1 font-semibold">
            <User className="w-3 h-3" />
            <span>ROLE:</span>
          </div>

          {['all', 'owner', 'manager', 'editor', 'viewer', 'client'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold capitalize transition-all cursor-pointer ${
                selectedRole === r
                  ? 'bg-white text-[#080808]'
                  : 'bg-white/5 text-[#9A9A9A] hover:bg-white/10 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Table / List */}
      <div className="rounded-2xl card-brivon overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#C8FF00]" />
            <h3 className="text-sm font-display font-bold text-white">
              Activity History Log
            </h3>
            <span className="text-xs font-mono text-[#707070]">({filteredList.length} events)</span>
          </div>

          <div className="text-[11px] font-mono text-[#707070]">
            <span>Workspace: </span>
            <span className="font-bold text-white">{workspace.name}</span>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-[#707070] mx-auto" />
            <h4 className="text-sm font-display font-bold text-white">No Audit Events Found</h4>
            <p className="text-xs font-mono text-[#707070] max-w-sm mx-auto">
              No matching activity logs were found for the selected category or search filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedRole('all');
              }}
              className="btn-secondary-dark px-4 py-2 text-xs font-mono font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredList.map((log) => {
              const catBadge = getCategoryBadge(log.category);
              const CatIcon = catBadge.icon;
              const rConfig = ROLE_CONFIGS[log.userRole] || { name: log.userRole, badgeColor: 'bg-white/10 text-white' };

              return (
                <div
                  key={log.id}
                  id={`audit-log-item-${log.id}`}
                  onClick={() => setSelectedLog(log)}
                  className="p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <img
                      src={log.userAvatar}
                      alt={log.userName}
                      className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0 mt-0.5"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold font-display text-white">
                          {log.userName}
                        </span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase tracking-wide bg-white/10 text-[#F5F5F0]`}>
                          {rConfig.name}
                        </span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-mono-tag font-semibold border flex items-center space-x-1 ${catBadge.bg}`}>
                          <CatIcon className="w-2.5 h-2.5" />
                          <span className="capitalize">{log.category}</span>
                        </span>
                      </div>

                      <div className="flex items-baseline space-x-1.5 text-xs font-mono text-[#9A9A9A]">
                        <span className="font-semibold text-white">{log.action}</span>
                        <span className="text-[#707070]">•</span>
                        <span className="truncate text-[#707070]">{log.resource}</span>
                      </div>

                      {log.details && (
                        <p className="text-[11px] font-mono text-[#707070] line-clamp-1 italic">
                          "{log.details}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="text-[11px] text-[#707070] font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </div>

                    {(log.previousValue || log.newValue) && (
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {log.previousValue && (
                          <span className="text-rose-400 line-through max-w-[80px] truncate">{log.previousValue}</span>
                        )}
                        {log.previousValue && log.newValue && (
                          <ArrowRight className="w-2.5 h-2.5 text-[#707070]" />
                        )}
                        {log.newValue && (
                          <span className="text-[#C8FF00] font-bold max-w-[80px] truncate">{log.newValue}</span>
                        )}
                      </div>
                    )}

                    <ChevronRight className="w-4 h-4 text-[#707070] group-hover:text-[#C8FF00] group-hover:translate-x-0.5 transition-all hidden sm:block" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#C8FF00]" />
                  <h3 className="text-base font-display font-bold text-white">Audit Event Details</h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 text-[#707070] hover:text-white text-lg leading-none font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-white/5 flex items-center space-x-3">
                  <img
                    src={selectedLog.userAvatar}
                    alt={selectedLog.userName}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm font-display">{selectedLog.userName}</h4>
                    <p className="text-[11px] text-[#707070]">User ID: {selectedLog.userId}</p>
                    <span className="inline-block mt-1 px-2 py-0.2 rounded text-[9px] font-mono-tag font-bold uppercase bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20">
                      {selectedLog.userRole}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0D0D0D] border border-white/5">
                    <span className="text-[10px] uppercase font-mono-tag text-[#707070] block mb-0.5">ACTION EXECUTED</span>
                    <span className="font-bold text-[#C8FF00]">{selectedLog.action}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D0D0D] border border-white/5">
                    <span className="text-[10px] uppercase font-mono-tag text-[#707070] block mb-0.5">CATEGORY</span>
                    <span className="font-bold capitalize text-white">{selectedLog.category}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D0D0D] border border-white/5 col-span-2">
                    <span className="text-[10px] uppercase font-mono-tag text-[#707070] block mb-0.5">RESOURCE TARGET</span>
                    <span className="font-semibold text-white break-all">{selectedLog.resource}</span>
                    {selectedLog.resourceId && (
                      <p className="text-[10px] text-[#707070] mt-0.5">ID: {selectedLog.resourceId}</p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D0D0D] border border-white/5 col-span-2">
                    <span className="text-[10px] uppercase font-mono-tag text-[#707070] block mb-0.5">TIMESTAMP (WORKSPACE TZ)</span>
                    <span className="font-medium text-[#9A9A9A]">{selectedLog.timestamp}</span>
                  </div>
                </div>

                {(selectedLog.previousValue || selectedLog.newValue) && (
                  <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-mono-tag text-[#C8FF00] block">
                      STATE TRANSITION DIFF
                    </span>
                    <div className="flex items-center space-x-3 text-xs font-mono">
                      {selectedLog.previousValue && (
                        <div className="flex-1 p-2 rounded-lg bg-white/5 border border-rose-500/30 text-rose-300">
                          <span className="text-[9px] uppercase font-mono-tag block text-[#707070] mb-0.5">PREVIOUS</span>
                          <span className="line-through">{selectedLog.previousValue}</span>
                        </div>
                      )}
                      {selectedLog.previousValue && selectedLog.newValue && (
                        <ArrowRight className="w-4 h-4 text-[#707070] shrink-0" />
                      )}
                      {selectedLog.newValue && (
                        <div className="flex-1 p-2 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00]">
                          <span className="text-[9px] uppercase font-mono-tag block text-[#707070] mb-0.5">NEW</span>
                          <span className="font-bold">{selectedLog.newValue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedLog.details && (
                  <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-mono-tag text-[#707070] block">SUMMARY</span>
                    <p className="text-[#9A9A9A] leading-relaxed">{selectedLog.details}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="btn-secondary-dark px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear/Purge Confirmation Modal */}
      <AnimatePresence>
        {isClearModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111111] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-base font-display font-bold text-white">Purge Workspace Audit Log?</h3>
                <p className="text-xs font-mono text-[#9A9A9A]">
                  This action is strictly restricted to Workspace Owners. All logged activities for <span className="font-bold text-white">{workspace.name}</span> will be cleared from this view.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="btn-secondary-dark px-4 py-2 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono shadow-md cursor-pointer"
                >
                  Confirm Purge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
