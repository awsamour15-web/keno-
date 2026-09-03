import React, { useState } from 'react';
import { ArrowUpDown, Flame, Snowflake } from 'lucide-react';
import { NumberStat } from '../types';

interface StatisticsTabProps {
  statsMap: Map<number, NumberStat>;
  totalRoundsCount?: number;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({
  statsMap,
  totalRoundsCount = 100,
}) => {
  const [sortMode, setSortMode] = useState<'NUMBER' | 'HOT' | 'COLD'>('NUMBER');

  const statsList: NumberStat[] = Array.from(statsMap.values());

  const sortedStats = [...statsList].sort((a, b) => {
    if (sortMode === 'HOT') {
      return b.frequency - a.frequency;
    }
    if (sortMode === 'COLD') {
      return a.frequency - b.frequency;
    }
    return a.number - b.number;
  });

  const maxFrequency = Math.max(...statsList.map(s => s.frequency), 1);

  const cycleSort = () => {
    if (sortMode === 'NUMBER') setSortMode('HOT');
    else if (sortMode === 'HOT') setSortMode('COLD');
    else setSortMode('NUMBER');
  };

  return (
    <div className="w-full bg-[#0d141d] p-3 space-y-2">
      {/* Sub-header matching screenshot: Last 100 rounds | Sort */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1 pb-1 border-b border-[#1c2736]">
        <span>Last {totalRoundsCount} rounds</span>
        <button
          onClick={cycleSort}
          className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer px-2 py-0.5 rounded bg-[#16212d] border border-[#233345]"
        >
          <ArrowUpDown size={12} />
          <span>
            Sort: {sortMode === 'NUMBER' ? '1-80' : sortMode === 'HOT' ? 'Hot First' : 'Cold First'}
          </span>
        </button>
      </div>

      {/* Quick Hot & Cold Legend */}
      <div className="flex items-center justify-between text-[11px] bg-[#121b25] px-2.5 py-1.5 rounded border border-[#1d2b3a]">
        <div className="flex items-center space-x-1.5 text-rose-400 font-medium">
          <Flame size={14} />
          <span>Hot: Top frequent (Red dot on board)</span>
        </div>
        <div className="flex items-center space-x-1.5 text-cyan-400 font-medium">
          <Snowflake size={14} />
          <span>Cold: Least frequent (Cyan dot)</span>
        </div>
      </div>

      {/* Statistics List matching screenshot 5 & 11 */}
      <div className="space-y-1.5 max-w-lg mx-auto max-h-[440px] overflow-y-auto pr-1">
        {sortedStats.map(item => {
          const percentage = Math.round((item.frequency / maxFrequency) * 100);

          return (
            <div
              key={`stat-num-${item.number}`}
              className="flex items-center space-x-3 bg-[#131c26] border border-[#1e2a37] rounded-lg px-2.5 py-1.5 hover:border-[#273748] transition-colors"
            >
              {/* Number Badge */}
              <div
                className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0 border ${
                  item.isHot
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                    : item.isCold
                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                    : 'bg-[#1a2532] text-slate-200 border-[#253648]'
                }`}
              >
                {item.number}
              </div>

              {/* Horizontal Green Bar */}
              <div className="flex-1 bg-[#101821] h-3 rounded-full overflow-hidden p-0.5 border border-[#1b2634]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.isHot
                      ? 'bg-gradient-to-r from-emerald-500 to-rose-400'
                      : item.isCold
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(4, percentage)}%` }}
                />
              </div>

              {/* Frequency Count */}
              <span className="text-xs font-mono font-bold text-slate-200 w-6 text-right shrink-0">
                {item.frequency}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
