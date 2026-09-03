import React from 'react';
import { NumberStat } from '../types';
import { sounds } from '../utils/audio';

interface KenoBoardProps {
  selectedNumbers: number[];
  drawnNumbers?: number[];
  statsMap?: Map<number, NumberStat>;
  isDrawing: boolean;
  onToggleNumber: (num: number) => void;
}

export const KenoBoard: React.FC<KenoBoardProps> = ({
  selectedNumbers,
  drawnNumbers = [],
  statsMap,
  isDrawing,
  onToggleNumber,
}) => {
  const isSelected = (num: number) => selectedNumbers.includes(num);
  const isDrawn = (num: number) => drawnNumbers.includes(num);

  const handleClick = (num: number) => {
    if (isDrawing) return; // Cannot alter selection while balls are currently dropping
    sounds.playClick(isSelected(num) ? 380 : 520);
    onToggleNumber(num);
  };

  return (
    <div className="w-full bg-[#141e28] p-2 border-y border-[#1f2d3d]">
      <div className="grid grid-cols-10 gap-1 sm:gap-1.5 max-w-lg mx-auto">
        {Array.from({ length: 80 }, (_, i) => i + 1).map(num => {
          const selected = isSelected(num);
          const drawn = isDrawn(num);
          const stat = statsMap?.get(num);
          const isHot = stat?.isHot;
          const isCold = stat?.isCold;

          let cellStyle = 'bg-[#1f2a36] text-slate-200 border-[#283645] hover:bg-[#273443]';

          if (selected && drawn) {
            // MATCHED HIT!
            cellStyle = 'bg-emerald-500 text-white font-black border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-105 z-10 animate-pulse';
          } else if (selected) {
            // Selected by player
            cellStyle = 'bg-[#2e7d5b] text-white font-extrabold border-emerald-400 shadow-sm';
          } else if (drawn) {
            // Drawn in the current round, but not picked
            cellStyle = 'bg-[#1e3448] text-cyan-200 font-bold border-cyan-500/50 shadow-inner';
          }

          return (
            <button
              key={`keno-cell-${num}`}
              id={`keno-num-${num}`}
              type="button"
              disabled={isDrawing}
              onClick={() => handleClick(num)}
              className={`relative h-9 sm:h-10 w-full rounded flex items-center justify-center text-xs sm:text-sm font-semibold border transition-all cursor-pointer select-none active:scale-90 ${cellStyle} ${
                isDrawing && !selected && !drawn ? 'opacity-50' : ''
              }`}
            >
              {num}

              {/* Hot Marker (Red Dot) */}
              {isHot && !selected && (
                <span
                  title="Hot Number"
                  className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.9)]"
                />
              )}

              {/* Cold Marker (Cyan Dot) */}
              {isCold && !selected && !isHot && (
                <span
                  title="Cold Number"
                  className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.9)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
