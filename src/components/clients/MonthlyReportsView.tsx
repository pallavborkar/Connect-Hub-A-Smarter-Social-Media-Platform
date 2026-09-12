import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePermissions } from '../../hooks/usePermissions';
import { MonthlyReport } from '../../types';
import { 
  FileText, 
  Plus, 
  Download, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Eye, 
  BarChart3, 
  CheckCircle2, 
  Calendar, 
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

export const MonthlyReportsView: React.FC = () => {
  const { 
    filteredMonthlyReports, 
    generateMonthlyReport, 
    activeClient, 
    isClientViewMode, 
    currentRole 
  } = useApp();
  const { hasPermission } = usePermissions();

  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    filteredMonthlyReports[0]?.id || null
  );

  const selectedReport = filteredMonthlyReports.find(r => r.id === selectedReportId) || filteredMonthlyReports[0];
  const isClient = currentRole === 'client' || isClientViewMode;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Executive Monthly Performance Reports
            </h1>
            {activeClient && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                {activeClient.name}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data-backed summaries, reach velocity, key engagement milestones, and actionable recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </button>

          {hasPermission('reports.export') && (
            <button
              id="generate-report-btn"
              onClick={() => {
                const rep = generateMonthlyReport('August 2026');
                setSelectedReportId(rep.id);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Reports Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Available Reports ({filteredMonthlyReports.length})
          </h3>

          <div className="space-y-2">
            {filteredMonthlyReports.map((report) => {
              const isSelected = selectedReport?.id === report.id;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {report.month}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      +{report.metrics.reachChangePercent}% Reach
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5">
                    {report.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{report.metrics.postsPublished} posts published</span>
                    <span>Generated {report.generatedAt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Report Document Viewer */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <img 
                    src={activeClient?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'} 
                    alt="" 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white" 
                  />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Monthly Performance Report
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedReport.title}
                    </h2>
                    <p className="text-xs text-slate-400">Prepared for {activeClient?.name || 'Client Leadership'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Report Period</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedReport.month}</span>
                </div>
              </div>

              {/* Executive Summary Callout */}
              <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60">
                <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Executive Summary
                </h4>
                <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Core Performance Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <p className="text-[11px] text-slate-400">Total Organic Reach</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {selectedReport.metrics.reach.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-500 font-bold">
                      +{selectedReport.metrics.reachChangePercent}% MoM
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <p className="text-[11px] text-slate-400">Total Engagements</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {selectedReport.metrics.engagement.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-500 font-bold">
                      +{selectedReport.metrics.engagementChangePercent}% MoM
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <p className="text-[11px] text-slate-400">New Followers</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      +{selectedReport.metrics.followerGrowth.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-purple-500 font-bold">
                      Top on {selectedReport.metrics.topPlatform}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <p className="text-[11px] text-slate-400">Posts Published</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {selectedReport.metrics.postsPublished}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      100% SLA approval rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Milestones & Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Key Milestones & Wins
                </h4>
                <div className="space-y-2">
                  {selectedReport.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Month Strategic Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Next Month Strategic Recommendations
                </h4>
                <div className="space-y-2">
                  {selectedReport.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 text-xs text-slate-700 dark:text-slate-300">
                      <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No report selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
