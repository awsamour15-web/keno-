import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { CurrencyType } from '../types';
import { CURRENCIES } from '../utils/kenoEngine';
import { sounds } from '../utils/audio';

interface BetControlsProps {
  betAmount: number;
  currency: CurrencyType;
  balance: number;
  selectedCount: number;
  isDrawing: boolean;
  hasPlacedTicket: boolean;
  onBetChange: (newBet: number) => void;
  onPlaceBet: () => void;
}

export const BetControls: React.FC<BetControlsProps> = ({
  betAmount,
  currency,
  balance,
  selectedCount,
  isDrawing,
  hasPlacedTicket,
  onBetChange,
  onPlaceBet,
}) => {
  const config = CURRENCIES[currency];

  const handleDecrease = () => {
    sounds.playClick(350);
    const next = Math.max(config.minBet, betAmount - config.step);
    onBetChange(Math.round(next * 100) / 100);
  };

  const handleIncrease = () => {
    sounds.playClick(450);
    const next = Math.min(config.maxBet, betAmount + config.step);
    onBetChange(Math.round(next * 100) / 100);
  };

  const handleDouble = () => {
    sounds.playClick(550);
    const next = Math.min(config.maxBet, betAmount * 2);
    onBetChange(Math.round(next * 100) / 100);
  };

  const handleMax = () => {
    sounds.playClick(650);
    const maxPossible = Math.min(config.maxBet, Math.max(config.minBet, balance));
    onBetChange(Math.round(maxPossible * 100) / 100);
  };

  const isBetValid = betAmount > 0 && betAmount <= balance && selectedCount > 0;

  return (
    <div className="w-full bg-[#111922] px-3 py-2 border-b border-[#1b2532] space-y-2">
      {/* Bet adjustments row matching screenshots: [-] [ amount ] [+] [X2] [MAX] */}
      <div className="grid grid-cols-5 gap-1.5 max-w-lg mx-auto">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={isDrawing || betAmount <= config.minBet}
          className="h-10 bg-[#1c2734] hover:bg-[#253445] disabled:opacity-40 text-slate-200 font-bold rounded-lg border border-[#2b3b4e] flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <Minus size={18} />
        </button>

        <div className="h-10 bg-[#151f2b] border border-[#243345] rounded-lg flex items-center justify-center px-2">
          <span className="text-white font-extrabold text-base tracking-tight">
            {betAmount}
          </span>
        </div>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={isDrawing || betAmount >= config.maxBet}
          className="h-10 bg-[#1c2734] hover:bg-[#253445] disabled:opacity-40 text-slate-200 font-bold rounded-lg border border-[#2b3b4e] flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <Plus size={18} />
        </button>

        <button
          type="button"
          onClick={handleDouble}
          disabled={isDrawing || betAmount * 2 > config.maxBet}
          className="h-10 bg-[#1c2734] hover:bg-[#253445] disabled:opacity-40 text-emerald-400 font-extrabold text-sm rounded-lg border border-[#2b3b4e] flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          X2
        </button>

        <button
          type="button"
          onClick={handleMax}
          disabled={isDrawing}
          className="h-10 bg-[#1c2734] hover:bg-[#253445] disabled:opacity-40 text-emerald-400 font-extrabold text-xs tracking-wider rounded-lg border border-[#2b3b4e] flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          MAX
        </button>
      </div>

      {/* Large BET Button */}
      <div className="max-w-lg mx-auto">
        <button
          type="button"
          id="keno-main-bet-btn"
          disabled={isDrawing || !isBetValid}
          onClick={onPlaceBet}
          className={`w-full h-12 rounded-lg font-black text-base tracking-wider transition-all shadow-md select-none cursor-pointer flex items-center justify-center ${
            isDrawing
              ? 'bg-[#1b2633] text-slate-500 border border-[#28384b] cursor-not-allowed'
              : !isBetValid
              ? 'bg-[#1e2c39] text-slate-400 border border-[#28394a] cursor-not-allowed'
              : hasPlacedTicket
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 shadow-emerald-950/50 active:scale-[0.98]'
              : 'bg-[#2e7d5b] hover:bg-[#348f68] text-white active:scale-[0.98] shadow-emerald-950/40'
          }`}
        >
          {isDrawing ? (
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>DRAWING IN PROGRESS...</span>
            </span>
          ) : selectedCount === 0 ? (
            'CHOOSE 1 TO 10 NUMBERS'
          ) : betAmount > balance ? (
            'INSUFFICIENT BALANCE'
          ) : hasPlacedTicket ? (
            `BET PLACED (+ADD ANOTHER TICKET)`
          ) : (
            `BET (${betAmount} ${currency})`
          )}
        </button>
      </div>
    </div>
  );
};
