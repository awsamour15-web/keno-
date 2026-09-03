import React, { useState } from 'react';
import { Menu, MessageSquare, Check, Eye, EyeOff, ChevronDown, ShieldCheck } from 'lucide-react';
import { CurrencyType } from '../types';

interface GameHeaderProps {
  balance: number;
  currency: CurrencyType;
  drawId: string;
  secondsRemaining: number;
  isDrawing: boolean;
  onOpenWallet: () => void;
  onOpenDeposit: () => void;
  onOpenFairness: () => void;
  onOpenMenu: () => void;
  onOpenChat: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  balance,
  currency,
  drawId,
  secondsRemaining,
  isDrawing,
  onOpenWallet,
  onOpenDeposit,
  onOpenFairness,
  onOpenMenu,
  onOpenChat,
}) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(true);

  const minutes = Math.floor(Math.max(0, secondsRemaining) / 60);
  const seconds = Math.max(0, secondsRemaining) % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Formatted round ID like 75622678 from screenshot r1.jpg
  const displayRoundId = drawId || '75622678';

  return (
    <div className="w-full bg-[#0e1620] text-slate-100 select-none border-b border-[#182432]">
      {/* Sleek single bar matching reference screenshot r1.jpg */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* FAST KENO Stylized Logo */}
        <div className="flex flex-col leading-none select-none cursor-pointer" onClick={onOpenMenu}>
          <span className="font-black italic text-base sm:text-lg text-white tracking-tight">FAST</span>
          <span className="font-black italic text-emerald-400 text-xs sm:text-sm tracking-wider -mt-0.5">KENO</span>
        </div>

        {/* Currency Pill matching screenshot: 0 ETB (clickable to open wallet & deposit) */}
        <button
          onClick={onOpenWallet}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#121c27] border border-teal-500/40 text-slate-200 hover:border-emerald-400 transition-colors cursor-pointer text-xs font-mono font-medium shadow-xs"
          title="Click to view balance and deposit"
        >
          <span className="text-slate-100 font-bold">
            {balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
          <span className="text-slate-400 text-[10px] uppercase font-bold">{currency}</span>
        </button>

        {/* ID Badge with Green Checkmark (ID: 75622678 ✓) and Hamburger Menu ☰ */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenFairness}
            className="flex items-center space-x-1 px-2 py-1 rounded-md bg-[#121c27] border border-[#1e2f41] hover:border-emerald-500/60 transition-colors cursor-pointer text-xs"
            title="Provably Fair Round Verification"
          >
            <span className="text-slate-400 text-[11px] font-medium">ID:</span>
            <span className="text-slate-100 font-mono font-bold text-xs">{displayRoundId}</span>
            <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 flex items-center justify-center text-[9px] font-black ml-0.5">
              <Check size={10} strokeWidth={3} />
            </div>
          </button>

          <button
            onClick={onOpenMenu}
            className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer p-1"
            title="Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
