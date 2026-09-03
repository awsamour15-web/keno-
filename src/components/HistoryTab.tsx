import React from 'react';
import { RotateCcw, Award } from 'lucide-react';
import { KenoTicket } from '../types';

interface HistoryTabProps {
  userHistory: KenoTicket[];
  currency: string;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ userHistory, currency }) => {
  if (userHistory.length === 0) {
    return (
      <div className="w-full bg-[#0d141d] p-8 text-center space-y-2">
        <RotateCcw size={32} className="mx-auto text-slate-600 animate-spin-slow" />
        <h3 className="text-sm font-bold text-slate-300">No Tickets in History</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Choose your lucky numbers and place a bet. Your complete ticket receipts and payout history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0d141d] p-3 space-y-2.5">
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1 pb-1 border-b border-[#1c2736]">
        <span>Recent Bets ({userHistory.length})</span>
        <span>Outcome</span>
      </div>

      <div className="space-y-2.5 max-w-lg mx-auto">
        {userHistory.map(ticket => {
          const isWon = ticket.status === 'WON';
          const time = new Date(ticket.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <div
              key={ticket.id}
              className={`bg-[#131c26] border rounded-lg p-2.5 transition-all ${
                isWon ? 'border-emerald-500/50 shadow-md shadow-emerald-950/30' : 'border-[#1f2c3b]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-slate-400 text-[11px]">{time}</span>
                  <span className="font-bold text-slate-200">
                    Bet: {ticket.betAmount} {ticket.currency}
                  </span>
                </div>

                {isWon ? (
                  <div className="flex items-center space-x-1 text-emerald-400 font-black">
                    <Award size={14} />
                    <span>+{ticket.payout?.toLocaleString()} {ticket.currency}</span>
                    <span className="text-[10px] bg-emerald-950/70 border border-emerald-500/30 px-1 py-0.5 rounded font-mono">
                      x{ticket.multiplier}
                    </span>
                  </div>
                ) : ticket.status === 'LOST' ? (
                  <span className="text-slate-500 font-bold text-[11px]">
                    0.00 {ticket.currency}
                  </span>
                ) : (
                  <span className="text-cyan-400 font-bold text-[11px] animate-pulse">
                    IN PLAY
                  </span>
                )}
              </div>

              {/* Number balls row */}
              <div className="flex flex-wrap gap-1">
                {ticket.numbers.map(num => {
                  const isHit = ticket.matchedNumbers?.includes(num);
                  return (
                    <span
                      key={`hist-${ticket.id}-${num}`}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
                        isHit
                          ? 'bg-emerald-500 text-white shadow-sm font-extrabold'
                          : 'bg-[#1c2734] text-slate-300 border border-[#273748]'
                      }`}
                    >
                      {num}
                    </span>
                  );
                })}
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Draw: {ticket.drawId.slice(-8)}</span>
                <span>
                  Matched {ticket.matchedCount || 0} / {ticket.numbers.length} numbers
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
