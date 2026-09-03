import React, { useState } from 'react';
import { Trophy, Medal, Flame, Timer, Sparkles, UserCheck } from 'lucide-react';
import { LeaderboardUser } from '../types';

interface LeaderboardTabProps {
  userRank: number;
  userTotalWon: number;
  userHighestMultiplier: number;
  currency: string;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  userRank,
  userTotalWon,
  userHighestMultiplier,
  currency,
}) => {
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'ALL_TIME'>('DAILY');

  // Realistic leaderboard data
  const mockLeaderboard: LeaderboardUser[] = [
    { rank: 1, username: '@crypto_king', avatar: '👑', totalWon: 148500, highestMultiplier: 5000, betsPlaced: 342 },
    { rank: 2, username: '@addis_keno', avatar: '🦁', totalWon: 96200, highestMultiplier: 2500, betsPlaced: 218 },
    { rank: 3, username: '@tg_roller', avatar: '⚡', totalWon: 74800, highestMultiplier: 1000, betsPlaced: 195 },
    { rank: 4, username: '@solomon_g', avatar: '🎯', totalWon: 52400, highestMultiplier: 500, betsPlaced: 144 },
    { rank: 5, username: '@lucky_striker', avatar: '🍀', totalWon: 41200, highestMultiplier: 500, betsPlaced: 112 },
    { rank: 6, username: '@keno_pro99', avatar: '🔥', totalWon: 33900, highestMultiplier: 150, betsPlaced: 98 },
    { rank: 7, username: '@ethio_bettor', avatar: '⭐', totalWon: 27500, highestMultiplier: 120, betsPlaced: 85 },
    { rank: 8, username: '@fast_hands', avatar: '🚀', totalWon: 19800, highestMultiplier: 60, betsPlaced: 64 },
    { rank: 9, username: '@habesha_win', avatar: '💎', totalWon: 15200, highestMultiplier: 45, betsPlaced: 52 },
    { rank: 10, username: '@vip_guest', avatar: '🎲', totalWon: 12400, highestMultiplier: 45, betsPlaced: 43 },
  ];

  return (
    <div className="w-full bg-[#0d141d] p-3 space-y-3">
      {/* Daily Prize Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-emerald-950/40 to-teal-950/40 border border-amber-500/30 rounded-xl p-3 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Trophy size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-amber-300">Daily Grand Prize Pool</span>
              <Sparkles size={13} className="text-amber-400" />
            </div>
            <div className="text-lg font-black text-white font-mono tracking-tight">
              50,000 {currency}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-semibold justify-end">
            <Timer size={11} className="text-cyan-400" />
            <span>Reset in</span>
          </div>
          <span className="font-digital text-sm font-bold text-cyan-300">08:24:16</span>
        </div>
      </div>

      {/* Period Filter: Daily | Weekly | All-time */}
      <div className="flex items-center justify-between bg-[#121c27] p-1 rounded-lg border border-[#1d2a38]">
        {(['DAILY', 'WEEKLY', 'ALL_TIME'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              period === p
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {p === 'DAILY' ? 'Today' : p === 'WEEKLY' ? 'This Week' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Current User Standing Card */}
      <div className="bg-[#152332] border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
            #{userRank}
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-slate-200">You (My Rank)</span>
              <UserCheck size={13} className="text-emerald-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Best Multiplier: <b className="text-emerald-400">x{userHighestMultiplier || 0}</b>
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">Total Won</span>
          <span className="font-mono font-black text-sm text-emerald-400">
            {userTotalWon.toLocaleString()} {currency}
          </span>
        </div>
      </div>

      {/* Top 10 Leaderboard List */}
      <div className="space-y-1.5 max-w-lg mx-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pb-1 font-semibold">
          <span>Rank & Player</span>
          <span>Payout & Best Multiplier</span>
        </div>

        {mockLeaderboard.map(player => {
          const isTop3 = player.rank <= 3;
          return (
            <div
              key={player.rank}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                player.rank === 1
                  ? 'bg-gradient-to-r from-amber-950/30 to-[#141e2a] border-amber-500/40'
                  : player.rank === 2
                  ? 'bg-gradient-to-r from-slate-800/40 to-[#141e2a] border-slate-400/40'
                  : player.rank === 3
                  ? 'bg-gradient-to-r from-amber-900/20 to-[#141e2a] border-amber-700/40'
                  : 'bg-[#131d27] border-[#1d2b3a]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-6 text-center font-bold text-xs">
                  {player.rank === 1 ? (
                    <Medal size={18} className="text-amber-400 mx-auto" />
                  ) : player.rank === 2 ? (
                    <Medal size={18} className="text-slate-300 mx-auto" />
                  ) : player.rank === 3 ? (
                    <Medal size={18} className="text-amber-600 mx-auto" />
                  ) : (
                    <span className="text-slate-400 font-mono">#{player.rank}</span>
                  )}
                </div>

                <div className="text-base">{player.avatar}</div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200 font-mono">
                    {player.username}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {player.betsPlaced} rounds played
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-emerald-400 font-mono block">
                  +{player.totalWon.toLocaleString()} {currency}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold font-mono">
                  x{player.highestMultiplier}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
