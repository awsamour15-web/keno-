import React from 'react';
import { X, Volume2, VolumeX, Zap, Clock, ShieldCheck, Wallet, Trophy, HelpCircle, Send } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isInstantMode: boolean;
  onToggleInstantMode: () => void;
  onOpenWallet: () => void;
  onOpenLeaderboard: () => void;
  onOpenFairness: () => void;
  onOpenRules: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  isSoundEnabled,
  onToggleSound,
  isInstantMode,
  onToggleInstantMode,
  onOpenWallet,
  onOpenLeaderboard,
  onOpenFairness,
  onOpenRules,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-4/5 max-w-xs h-full bg-[#111a24] border-l border-[#223347] shadow-2xl p-4 flex flex-col justify-between text-slate-200">
        <div className="space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1f2f42]">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold italic text-base text-white tracking-tight">FAST</span>
              <span className="font-black italic text-emerald-400 text-sm tracking-wider">KENO</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2736] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Settings & Mode Options */}
          <div className="space-y-1.5 text-xs font-semibold">
            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#162230] hover:bg-[#1d2d3e] transition-colors cursor-pointer border border-[#223447]"
            >
              <div className="flex items-center space-x-2.5">
                {isSoundEnabled ? <Volume2 size={18} className="text-emerald-400" /> : <VolumeX size={18} className="text-slate-500" />}
                <span>Sound FX</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSoundEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                {isSoundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Fast Mode Toggle */}
            <button
              onClick={onToggleInstantMode}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#162230] hover:bg-[#1d2d3e] transition-colors cursor-pointer border border-[#223447]"
            >
              <div className="flex items-center space-x-2.5">
                {isInstantMode ? <Zap size={18} className="text-amber-400" /> : <Clock size={18} className="text-cyan-400" />}
                <span>Speed Mode</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isInstantMode ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                {isInstantMode ? 'Instant' : 'Live Clock (1 Min)'}
              </span>
            </button>

            {/* Wallet */}
            <button
              onClick={() => { onClose(); onOpenWallet(); }}
              className="w-full flex items-center space-x-2.5 p-3 rounded-xl bg-[#162230] hover:bg-[#1d2d3e] transition-colors cursor-pointer border border-[#223447]"
            >
              <Wallet size={18} className="text-emerald-400" />
              <span>Secure Casino Wallet</span>
            </button>

            {/* Leaderboard */}
            <button
              onClick={() => { onClose(); onOpenLeaderboard(); }}
              className="w-full flex items-center space-x-2.5 p-3 rounded-xl bg-[#162230] hover:bg-[#1d2d3e] transition-colors cursor-pointer border border-[#223447]"
            >
              <Trophy size={18} className="text-amber-400" />
              <span>Daily Leaderboard & Prizes</span>
            </button>

            {/* Provably Fair */}
            <button
              onClick={() => { onClose(); onOpenFairness(); }}
              className="w-full flex items-center space-x-2.5 p-3 rounded-xl bg-[#162230] hover:bg-[#1d2d3e] transition-colors cursor-pointer border border-[#223447]"
            >
              <ShieldCheck size={18} className="text-teal-400" />
              <span>Provably Fair Check (ATLAS-V)</span>
            </button>

            {/* Rules & Odds */}
            <button
              onClick={() => { onClose(); onOpenRules(); }}
              className="w-full flex items-center space-x-2.5 p-3 rounded-xl bg-[#162230] hover:bg-[#1d2d3e] transition-colors cursor-pointer border border-[#223447]"
            >
              <HelpCircle size={18} className="text-slate-400" />
              <span>How To Play & Full Paytable</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#1d2b3b] text-center space-y-2">
          <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
            <Send size={14} className="text-cyan-400" />
            <span>Fast Keno Telegram Mini App</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            v2.4.0 • Provably Fair Engine
          </span>
        </div>
      </div>
    </div>
  );
};
