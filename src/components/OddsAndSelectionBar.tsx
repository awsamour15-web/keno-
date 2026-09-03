import React from 'react';
import { HelpCircle, Shuffle, Trash2 } from 'lucide-react';
import { getMaxMultiplier, PAYOUT_TIERS } from '../utils/kenoEngine';

interface OddsAndSelectionBarProps {
  selectedNumbers: number[];
  betAmount: number;
  currency: string;
  onClear: () => void;
  onAutoPick: () => void;
  onOpenRules: () => void;
}

export const OddsAndSelectionBar: React.FC<OddsAndSelectionBarProps> = ({
  selectedNumbers,
  betAmount,
  currency,
  onClear,
  onAutoPick,
  onOpenRules,
}) => {
  const pickCount = selectedNumbers.length;
  const maxMultiplier = pickCount > 0 ? getMaxMultiplier(pickCount) : 0;
  const possibleWin = Math.floor(betAmount * maxMultiplier * 100) / 100;
  const tier = pickCount > 0 ? PAYOUT_TIERS[pickCount] || {} : {};

  // If no numbers picked, show the default state matching screenshots
  if (pickCount === 0) {
    return (
      <div className="relative w-full bg-gradient-to-b from-[#131d27] to-[#0f1720] px-4 py-2.5 rounded-t-xl border-t border-[#1e2d3d] flex items-center justify-between">
        {/* Floating background indicator balls */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            {/* Main sphere with "1" */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 via-teal-600 to-slate-900 border border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <span className="font-extrabold text-white text-lg drop-shadow">1</span>
            </div>
            {/* Ambient small spheres */}
            <div className="absolute -top-1 -left-2 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[9px] text-slate-300 font-bold shadow">
              80
            </div>
            <div className="absolute -top-1 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center text-[10px] text-cyan-300 font-bold shadow">
              10
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold text-sm sm:text-base tracking-tight leading-tight">
              Choose 10 numbers
            </span>
            <span className="text-emerald-400 text-xs font-semibold">
              From 1 to 80
            </span>
          </div>
        </div>

        {/* Action icons: Quick pick & Help */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onAutoPick}
            className="flex items-center space-x-1 px-2.5 py-1 bg-[#1a2636] hover:bg-[#233549] text-cyan-300 text-xs font-medium rounded-lg border border-cyan-500/30 transition-colors cursor-pointer shadow active:scale-95"
            title="Auto Pick 10 Numbers"
          >
            <Shuffle size={13} />
            <span>Random</span>
          </button>
          <button
            onClick={onOpenRules}
            className="w-7 h-7 rounded-full bg-[#162230] hover:bg-[#203247] border border-emerald-500/40 flex items-center justify-center text-emerald-400 transition-colors cursor-pointer"
            title="Paytable & Odds"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>
    );
  }

  // When numbers are selected, show dynamic real-time odds & possible win table
  const matchKeys = Object.keys(tier).map(Number).sort((a, b) => a - b);

  return (
    <div className="w-full bg-[#111a24] px-3.5 py-2 rounded-t-xl border-t border-[#1d2b3a]">
      {/* Top line: Number count & Max Possible Win */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline space-x-2">
          <span className="text-white font-bold text-sm">
            {pickCount}
          </span>
          <span className="text-slate-400 text-xs font-medium">Possible win</span>
          <span className="text-emerald-400 font-extrabold text-sm tracking-tight">
            {possibleWin.toLocaleString()} {currency}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onAutoPick}
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Auto pick"
          >
            <Shuffle size={15} />
          </button>
          <button
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear selections"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={onOpenRules}
            className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
            title="View Payout Table"
          >
            <HelpCircle size={15} />
          </button>
        </div>
      </div>

      {/* Middle line: Match & Pays Real-time Odds breakdown */}
      <div className="mt-1 flex items-center text-[11px] text-slate-300 overflow-x-auto py-0.5 space-x-4 no-scrollbar">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-slate-400 text-[10px] uppercase font-semibold">Match:</span>
          {matchKeys.map(m => (
            <span key={`match-${m}`} className="w-4 text-center font-bold text-slate-200">
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-slate-400 text-[10px] uppercase font-semibold">Pays:</span>
          {matchKeys.map(m => (
            <span key={`pay-${m}`} className="text-emerald-400 font-bold">
              x{tier[m]}
            </span>
          ))}
        </div>
      </div>

      {/* Selected Numbers 10-slot Tray */}
      <div className="mt-1.5 grid grid-cols-10 gap-1 w-full max-w-full">
        {Array.from({ length: 10 }).map((_, idx) => {
          const num = selectedNumbers[idx];
          return (
            <div
              key={`tray-slot-${idx}`}
              className={`h-7 rounded flex items-center justify-center text-xs font-bold transition-all ${
                num !== undefined
                  ? 'bg-[#2e7d5b] text-white border border-emerald-400 shadow-sm'
                  : 'bg-[#182330] text-slate-600 border border-[#213042]'
              }`}
            >
              {num !== undefined ? num : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};
