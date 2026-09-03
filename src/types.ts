export type GameStage = 'BETTING' | 'DRAWING' | 'RESULT';

export type CurrencyType = 'ETB' | 'TON' | 'USDT' | 'STARS';

export interface CurrencyConfig {
  code: CurrencyType;
  symbol: string;
  name: string;
  rateToETB: number; // 1 TON = 200 ETB, etc.
  minBet: number;
  maxBet: number;
  defaultBet: number;
  step: number;
}

export interface KenoTicket {
  id: string;
  drawId: string;
  userId: string;
  username: string;
  numbers: number[]; // 1 to 10 selected numbers
  betAmount: number;
  currency: CurrencyType;
  matchedCount?: number;
  matchedNumbers?: number[];
  payout?: number;
  multiplier?: number;
  status: 'PENDING' | 'WON' | 'LOST';
  timestamp: number;
}

export interface DrawRecord {
  drawId: string;
  drawNumber: number;
  timestamp: number;
  drawnNumbers: number[]; // 20 unique numbers from 1 to 80
  serverSeedHash: string;
  serverSeed?: string;
  clientSeed: string;
  nonce: number;
  totalBetsPlaced: number;
  totalPayouts: number;
}

export interface PlayerFeedItem {
  id: string;
  username: string;
  avatarSeed: string;
  numbers: number[];
  betAmount: number;
  currency: CurrencyType;
  matchedCount?: number;
  isUser?: boolean;
}

export interface NumberStat {
  number: number;
  frequency: number; // how many times drawn in last 100 rounds
  lastDrawnRoundsAgo: number;
  isHot: boolean;
  isCold: boolean;
}

export interface WalletState {
  balances: Record<CurrencyType, number>;
  selectedCurrency: CurrencyType;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BET' | 'WIN' | 'REWARD';
  amount: number;
  currency: CurrencyType;
  timestamp: number;
  status: 'COMPLETED' | 'PENDING' | 'CONFIRMED';
  txHash: string;
  note?: string;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  totalWon: number;
  highestMultiplier: number;
  betsPlaced: number;
  isUser?: boolean;
  change?: 'up' | 'down' | 'same';
}

export interface PayoutTier {
  picks: number;
  matches: Record<number, number>; // matchCount -> multiplier (e.g., 1 -> 3.5)
}
