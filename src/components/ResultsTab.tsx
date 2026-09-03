import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { DrawRecord } from '../types';

interface ResultsTabProps {
  results: DrawRecord[];
  onVerifyDraw?: (draw: DrawRecord) => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ results, onVerifyDraw }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedSeed, setCopiedSeed] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSeed(id);
    setTimeout(() => setCopiedSeed(null), 2000);
  };

  return (
    <div className="w-full bg-[#0d141d] p-3 space-y-3">
      {/* Table header matching screenshot: Draw ID | Combination */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2 pb-1 border-b border-[#1c2736]">
        <span>Draw ID</span>
        <span>Combination (20 Numbers)</span>
      </div>

      {/* List of past rounds */}
      <div className="space-y-3 max-w-lg mx-auto">
        {results.map(draw => {
          const isExpanded = expandedId === draw.drawId;
          const dateStr = new Date(draw.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <div
              key={draw.drawId}
              className="bg-[#131c26] border border-[#1f2c3b] rounded-lg p-2.5 transition-all hover:border-[#2b3c4f]"
            >
              <div className="flex items-start justify-between gap-2">
                {/* Left: Checkmark, Draw ID, Timestamp */}
                <div className="flex items-start space-x-2 shrink-0">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-xs text-emerald-400">
                      {draw.drawId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dateStr}
                    </span>
                  </div>
                </div>

                {/* Right: 20 numbers arranged in 2 rows of 10 balls (matches screenshot 4 & 10!) */}
                <div className="flex flex-col gap-1 items-end">
                  {/* Row 1 (first 10 numbers) */}
                  <div className="grid grid-cols-10 gap-1">
                    {draw.drawnNumbers.slice(0, 10).map((num, idx) => (
                      <span
                        key={`draw-${draw.drawId}-r1-${idx}`}
                        className="w-6 h-6 rounded bg-[#1c2736] text-slate-200 text-[11px] font-bold flex items-center justify-center border border-[#27384b]"
                      >
                        {num}
                      </span>
                    ))}
                  </div>

                  {/* Row 2 (second 10 numbers) */}
                  <div className="grid grid-cols-10 gap-1">
                    {draw.drawnNumbers.slice(10, 20).map((num, idx) => (
                      <span
                        key={`draw-${draw.drawId}-r2-${idx}`}
                        className="w-6 h-6 rounded bg-[#1c2736] text-slate-200 text-[11px] font-bold flex items-center justify-center border border-[#27384b]"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expandable Provably Fair Details */}
              <div className="mt-2 pt-2 border-t border-[#1b2736] flex items-center justify-between text-[11px]">
                <button
                  onClick={() => toggleExpand(draw.drawId)}
                  className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide' : 'Verify'} Provably Fair Seed</span>
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                <span className="text-[10px] text-slate-500">
                  {draw.totalBetsPlaced} bets • {draw.totalPayouts.toLocaleString()} ETB paid
                </span>
              </div>

              {isExpanded && (
                <div className="mt-2 p-2 bg-[#0c1219] rounded border border-[#1b2837] text-[10px] font-mono space-y-1 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Server Seed Hash:</span>
                    <span className="text-emerald-400 truncate max-w-[200px]">
                      {draw.serverSeedHash}
                    </span>
                  </div>
                  {draw.serverSeed && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Server Seed (Revealed):</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-300 truncate max-w-[170px]">
                          {draw.serverSeed}
                        </span>
                        <button
                          onClick={() => handleCopy(draw.serverSeed!, draw.drawId)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          {copiedSeed === draw.drawId ? (
                            <Check size={11} className="text-emerald-400" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Client Seed:</span>
                    <span className="text-cyan-400">{draw.clientSeed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nonce:</span>
                    <span className="text-slate-300">{draw.nonce}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
