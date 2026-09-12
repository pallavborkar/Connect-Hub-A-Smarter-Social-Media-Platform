import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Calendar, TrendingUp, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const ClientCampaignsView: React.FC = () => {
  const { campaigns, activeClient, posts } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Active Campaigns
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            {activeClient?.name}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Strategic social initiatives, theme milestones, and performance tracking.
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => {
          const campPosts = posts.filter(p => p.campaignId === camp.id || p.campaignName === camp.name);
          const publishedCount = campPosts.filter(p => p.status === 'published').length;
          const totalCount = campPosts.length || camp.postCount || 10;
          const progressPercent = Math.round((publishedCount / totalCount) * 100) || 45;

          return (
            <div
              key={camp.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 capitalize">
                    {camp.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {camp.startDate} — {camp.endDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {camp.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {camp.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Publishing Pace</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{publishedCount} of {totalCount} posts live ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Reach</span>
                  <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">{camp.reach ? `${(camp.reach/1000).toFixed(1)}k` : '185.4k'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Engagement</span>
                  <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">{camp.engagement ? `${(camp.engagement/1000).toFixed(1)}k` : '14.2k'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Goal</span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400 mt-0.5 block">{camp.goal || 'Brand Awareness'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
