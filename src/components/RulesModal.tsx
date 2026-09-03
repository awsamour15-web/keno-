import React, { useState } from 'react';
import { X, HelpCircle, Award } from 'lucide-react';
import { PAYOUT_TIERS } from '../utils/kenoEngine';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, currency }) => {
  const [selectedPickTab, setSelectedPickTab] = useState<number>(10);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121c27] border border-[#233549] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#172332] px-4 py-3 border-b border-[#233549] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Fast Keno Rules & Odds</h2>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                Official Paytable
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#203144] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Quick instructions */}
          <div className="bg-[#152230] p-3 rounded-xl border border-[#223347] space-y-1.5 text-slate-300">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Award size={14} className="text-emerald-400" />
              <span>How To Play</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>Choose between <b>1 and 10 numbers</b> from the 1 to 80 board.</li>
              <li>Adjust your bet size with <b>[-]</b>, <b>[+]</b>, <b>X2</b>, or <b>MAX</b>.</li>
              <li>Tap <b>BET</b> to submit your ticket before the countdown reaches zero.</li>
              <li>20 numbers are drawn live using our provably fair engine.</li>
              <li>Match numbers to win multipliers up to <b>50,000x</b> your bet!</li>
            </ol>
          </div>

          {/* Tab selector for pick count */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-1.5">
              Select Picks to view Odds:
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(picks => (
                <button
                  key={picks}
                  onClick={() => setSelectedPickTab(picks)}
                  className={`py-1.5 font-bold rounded-lg text-xs transition-all cursor-pointer ${
                    selectedPickTab === picks
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-[#15212e] text-slate-400 hover:text-slate-200 border border-[#1e2e40]'
                  }`}
                >
                  {picks} {picks === 1 ? 'Pick' : 'Picks'}
                </button>
              ))}
            </div>
          </div>

          {/* Paytable for selected pick */}
          <div className="bg-[#0e1622] rounded-xl border border-[#1c293a] overflow-hidden">
            <div className="bg-[#152230] px-3 py-2 flex justify-between text-xs font-bold text-slate-300 border-b border-[#1f2f42]">
              <span>Matches for {selectedPickTab} Picks</span>
              <span>Multiplier Payout</span>
            </div>
            <div className="divide-y divide-[#182332]">
              {Object.entries(PAYOUT_TIERS[selectedPickTab] || {}).map(([match, mult]) => (
                <div key={match} className="px-3 py-2 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">
                    Match {match} of {selectedPickTab}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      x{mult}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      (e.g. 10 bet pays {(10 * mult).toLocaleString()} {currency})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
