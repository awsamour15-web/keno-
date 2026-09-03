import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { KenoTicket, PlayerFeedItem } from '../types';

interface LivePlayerFeedProps {
  userTickets: KenoTicket[];
  otherPlayers: PlayerFeedItem[];
  drawnNumbers: number[];
  currency: string;
  onOpenFairness?: () => void;
}

export const LivePlayerFeed: React.FC<LivePlayerFeedProps> = ({
  userTickets,
  otherPlayers,
  drawnNumbers,
  currency,
  onOpenFairness,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ALL' | 'MY_TICKETS' | 'MY_BETS'>('ALL');

  const totalAllCount = otherPlayers.length + userTickets.length;
  const myTicketsCount = userTickets.length;
  const myBetsCount = userTickets.length;

  return (
    <div className="w-full bg-[#091118] p-3 space-y-3 select-none">
      {/* Sub-bar matching screenshot: All 1466 | My Tickets 0 | My Bets 0 */}
      <div className="flex items-center space-x-7 text-xs border-b border-[#182635] pb-2 font-medium px-1">
        <button
          onClick={() => setActiveSubTab('ALL')}
          className={`flex items-center space-x-1.5 cursor-pointer transition-colors ${
            activeSubTab === 'ALL'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>All</span>
          <span className="font-mono font-bold">{totalAllCount}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('MY_TICKETS')}
          className={`flex items-center space-x-1.5 cursor-pointer transition-colors ${
            activeSubTab === 'MY_TICKETS'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>My Tickets</span>
          <span className="font-mono">{myTicketsCount}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('MY_BETS')}
          className={`flex items-center space-x-1.5 cursor-pointer transition-colors ${
            activeSubTab === 'MY_BETS'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>My Bets</span>
          <span className="font-mono">{myBetsCount}</span>
        </button>
      </div>

      {/* Cards List matching screenshot structure */}
      <div className="space-y-2.5 max-w-md mx-auto">
        {/* User's placed tickets */}
        {userTickets.map((ticket, idx) => {
          const matchedCount = ticket.numbers.filter(n => drawnNumbers.includes(n)).length;
          const isDone = drawnNumbers.length >= 20;

          return (
            <div
              key={ticket.id}
              className="bg-[#121c25] border border-emerald-500/50 rounded-lg p-3 shadow-md relative overflow-hidden"
            >
              {/* Card Header: Username in Mint Green */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-emerald-400 font-bold font-mono text-sm tracking-tight">
                    You (Ticket #{idx + 1})
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    ACTIVE
                  </span>
                </div>
                {drawnNumbers.length > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Hits: {matchedCount} / {ticket.numbers.length}
                  </span>
                )}
              </div>

              {/* Number Slots Grid: 1 single row of 10 slots matching reference screenshot r1.jpg */}
              <div className="grid grid-cols-10 gap-1 sm:gap-1.5 mb-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const num = ticket.numbers[i];
                  const hasNumber = num !== undefined;
                  const isHit = hasNumber && drawnNumbers.includes(num);

                  return (
                    <div
                      key={`user-slot-${ticket.id}-${i}`}
                      className={`h-7 sm:h-8 rounded flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${
                        isHit
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-emerald-300'
                          : hasNumber
                          ? 'bg-[#202d39] text-slate-100 border border-[#283847]'
                          : 'bg-[#141d27]/70 border border-[#1b2633]'
                      }`}
                    >
                      {hasNumber ? num : ''}
                    </div>
                  );
                })}
              </div>

              {/* Footer: Bet Amount (Left) matching screenshot */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white">
                  Bet {ticket.betAmount} {ticket.currency}
                </span>
                <span
                  className={
                    isDone
                      ? matchedCount > 0
                        ? 'text-emerald-400 font-extrabold'
                        : 'text-slate-400'
                      : 'text-[#f59e0b]'
                  }
                >
                  {isDone ? (matchedCount > 0 ? `Won!` : 'Completed') : 'Waiting'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Other players cards matching screenshot r1.jpg (e.g. N***i, A***a) */}
        {activeSubTab === 'ALL' &&
          otherPlayers.map((player, idx) => {
            const matchedCount = player.numbers.filter(n => drawnNumbers.includes(n)).length;
            const isDone = drawnNumbers.length >= 20;

            return (
              <div
                key={player.id || `bot-${idx}`}
                className="bg-[#121c25] border border-[#1b2834] rounded-lg p-3 shadow-sm transition-all"
              >
                {/* Header: Username in Mint Green font matching screenshot (e.g. N***i, A***a) */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 font-mono font-bold text-sm tracking-tight">
                    {player.username}
                  </span>
                  {matchedCount > 0 && (
                    <span className="text-emerald-400 font-mono text-xs font-bold">
                      {matchedCount} hit{matchedCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Number slots: Exactly 1 row of 10 boxes matching screenshot r1.jpg */}
                <div className="grid grid-cols-10 gap-1 sm:gap-1.5 mb-2">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const num = player.numbers[i];
                    const hasNumber = num !== undefined;
                    const isHit = hasNumber && drawnNumbers.includes(num);

                    return (
                      <div
                        key={`bot-slot-${player.id}-${i}`}
                        className={`h-7 sm:h-8 rounded flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${
                          isHit
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-emerald-300'
                            : hasNumber
                            ? 'bg-[#202d39] text-slate-100 border border-[#283847]'
                            : 'bg-[#141d27]/70 border border-[#1b2633]'
                        }`}
                      >
                        {hasNumber ? num : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Footer: Bet Amount (Left) and Waiting (Right in Amber/Gold) matching r1.jpg */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">Bet {player.betAmount}</span>
                  <span
                    className={
                      isDone
                        ? matchedCount > 0
                          ? 'text-emerald-400 font-extrabold'
                          : 'text-slate-500'
                        : 'text-[#f59e0b]'
                    }
                  >
                    {isDone ? (matchedCount > 0 ? `Won` : 'Ended') : 'Waiting'}
                  </span>
                </div>
              </div>
            );
          })}

        {/* Empty state for user tickets */}
        {activeSubTab !== 'ALL' && userTickets.length === 0 && (
          <div className="py-10 text-center text-slate-500 text-xs bg-[#0f1721] rounded-lg border border-[#1a2533] p-4">
            You haven't placed any tickets for this round yet. Pick numbers above and click Bet!
          </div>
        )}

        {/* ATLAS-V GAMING FAIRNESS Badge matching bottom of screenshot r1.jpg */}
        <div
          onClick={onOpenFairness}
          className="pt-4 pb-2 flex flex-col items-center justify-center text-center cursor-pointer group select-none"
          title="Click to verify Provably Fair Cryptographic Seed"
        >
          <div className="flex items-center space-x-1.5 text-slate-300 group-hover:text-emerald-400 transition-colors">
            <ShieldCheck size={20} className="text-emerald-400" />
            <span className="text-xs font-black tracking-widest uppercase">FAIRNESS</span>
          </div>
          <div className="mt-1 flex flex-col items-center">
            <span className="text-[13px] font-black tracking-wider text-slate-200 group-hover:text-white transition-colors">
              ATLAS-V
            </span>
            <span className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase">
              G A M I N G
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
