import React from 'react';
import { Play, RotateCcw, Check, BarChart2 } from 'lucide-react';

export type TabType = 'GAME' | 'HISTORY' | 'RESULTS' | 'STATISTICS';

interface GameTabsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userTicketCount?: number;
}

export const GameTabs: React.FC<GameTabsProps> = ({
  activeTab,
  onSelectTab,
  userTicketCount = 0,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'GAME', label: 'GAME', icon: <Play size={12} className="fill-current" /> },
    { id: 'HISTORY', label: 'HISTORY', icon: <RotateCcw size={13} /> },
    { id: 'RESULTS', label: 'RESULTS', icon: <Check size={14} strokeWidth={2.5} /> },
    { id: 'STATISTICS', label: 'STATISTICS', icon: <BarChart2 size={13} /> },
  ];

  return (
    <div className="w-full bg-[#0a1118] border-b border-[#182635] px-1 select-none">
      <div className="grid grid-cols-4 items-center">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center justify-center space-x-1 py-3 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="tracking-wide text-[11px] sm:text-xs">{tab.label}</span>

              {/* Active green underline bar matching screenshot */}
              {isActive && (
                <div className="absolute bottom-0 inset-x-2 h-0.5 bg-emerald-400 rounded-t shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
