import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CurrencyType,
  DrawRecord,
  GameStage,
  KenoTicket,
  PlayerFeedItem,
  WalletState,
} from './types';
import {
  calculateNumberStats,
  CURRENCIES,
  generateDrawNumbers,
  generateInitialDrawHistory,
  generateMockPlayers,
  getMultiplier,
  sha256,
} from './utils/kenoEngine';
import { sounds } from './utils/audio';

import { TelegramHeader } from './components/TelegramHeader';
import { GameHeader } from './components/GameHeader';
import { OddsAndSelectionBar } from './components/OddsAndSelectionBar';
import { KenoBoard } from './components/KenoBoard';
import { BetControls } from './components/BetControls';
import { DrawStage } from './components/DrawStage';
import { GameTabs, TabType } from './components/GameTabs';
import { LivePlayerFeed } from './components/LivePlayerFeed';
import { HistoryTab } from './components/HistoryTab';
import { ResultsTab } from './components/ResultsTab';
import { StatisticsTab } from './components/StatisticsTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { WalletModal } from './components/WalletModal';
import { ProvablyFairModal } from './components/ProvablyFairModal';
import { MenuDrawer } from './components/MenuDrawer';
import { RulesModal } from './components/RulesModal';
import { LiveChatModal } from './components/LiveChatModal';

export default function App() {
  // Game mode & preferences
  const [isInstantMode, setIsInstantMode] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(sounds.isEnabled());
  const [activeTab, setActiveTab] = useState<TabType>('GAME');

  // Modals state
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [walletInitialTab, setWalletInitialTab] = useState<'OVERVIEW' | 'DEPOSIT'>('OVERVIEW');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isFairnessOpen, setIsFairnessOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isBetSheetOpen, setIsBetSheetOpen] = useState<boolean>(false);
  const drawIntervalRef = useRef<any>(null);

  // Wallet state
  const [walletState, setWalletState] = useState<WalletState>(() => {
    return {
      selectedCurrency: 'ETB',
      balances: {
        ETB: 1250,
        TON: 5.0,
        USDT: 25.0,
        STARS: 250,
      },
      transactions: [
        {
          id: 'tx_init_1',
          type: 'DEPOSIT',
          amount: 1250,
          currency: 'ETB',
          timestamp: Date.now() - 3600000,
          status: 'CONFIRMED',
          txHash: '0x8f7a...3b21',
          note: 'Welcome Bonus',
        },
      ],
    };
  });

  const currency = walletState.selectedCurrency;
  const currentBalance = walletState.balances[currency] || 0;
  const currencyConfig = CURRENCIES[currency];

  // Bet and Number Selection State
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState<number>(currencyConfig.defaultBet);

  // Synchronize bet amount step when currency changes
  useEffect(() => {
    setBetAmount(CURRENCIES[currency].defaultBet);
  }, [currency]);

  // Provably Fair Seeds
  const [clientSeed, setClientSeed] = useState<string>('tg_client_player_1');
  const [currentNonce, setCurrentNonce] = useState<number>(1042);
  const [currentDrawId, setCurrentDrawId] = useState<string>('75622678');
  const [currentServerSeed, setCurrentServerSeed] = useState<string>(
    'secret_seed_fast_keno_75622678'
  );
  const [serverSeedHash, setServerSeedHash] = useState<string>(
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );

  // Generate initial hash on load
  useEffect(() => {
    sha256(currentServerSeed).then(hash => setServerSeedHash(hash));
  }, [currentServerSeed]);

  // Round Timing and State initialized to match reference screenshot r1.jpg (17 / 20)
  const [stage, setStage] = useState<GameStage>('DRAWING');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([
    49, 1, 34, 54, 15, 77, 76, 28, 27, 65, 47, 57, 24, 22, 13, 40, 46,
  ]);
  const [currentDrawnBall, setCurrentDrawnBall] = useState<number | null>(46);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [drawSpeed, setDrawSpeed] = useState<'NORMAL' | 'FAST'>('NORMAL');

  // Current Round Tickets & Players initialized to match reference screenshot r1.jpg (All 2)
  const [activeTickets, setActiveTickets] = useState<KenoTicket[]>([]);
  const [otherPlayers, setOtherPlayers] = useState<PlayerFeedItem[]>([
    {
      id: 'p_n',
      userId: 'user_n',
      username: 'N***i',
      numbers: [23, 43, 65, 67],
      betAmount: 148,
      currency: 'ETB',
      timestamp: Date.now() - 30000,
    },
    {
      id: 'p_a',
      userId: 'user_a',
      username: 'A***a',
      numbers: [67],
      betAmount: 159,
      currency: 'ETB',
      timestamp: Date.now() - 15000,
    },
  ]);

  // Past Results & User History
  const [drawHistory, setDrawHistory] = useState<DrawRecord[]>(() => generateInitialDrawHistory(30));
  const [userHistory, setUserHistory] = useState<KenoTicket[]>([]);

  // User Leaderboard Stats
  const [userTotalWon, setUserTotalWon] = useState<number>(480);
  const [userHighestMultiplier, setUserHighestMultiplier] = useState<number>(10);
  const [userRank, setUserRank] = useState<number>(14);

  // Calculate Statistics for 1-80 balls
  const statsMap = useMemo(() => {
    const draws = drawHistory.map(d => d.drawnNumbers);
    return calculateNumberStats(draws);
  }, [drawHistory]);

  // Number selection handler (1 to 10 numbers)
  const handleToggleNumber = (num: number) => {
    if (stage === 'DRAWING') return;

    setSelectedNumbers(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      if (prev.length >= 10) {
        return prev; // Maximum 10 picks allowed in Fast Keno
      }
      return [...prev, num].sort((a, b) => a - b);
    });
  };

  // Quick random pick 10 numbers
  const handleAutoPick = () => {
    sounds.playClick(600);
    const pool = Array.from({ length: 80 }, (_, i) => i + 1);
    const picks: number[] = [];
    for (let i = 0; i < 10; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picks.push(pool[idx]);
      pool.splice(idx, 1);
    }
    setSelectedNumbers(picks.sort((a, b) => a - b));
  };

  // Clear selections
  const handleClear = () => {
    sounds.playClick(300);
    setSelectedNumbers([]);
  };

  // Place bet action
  const handlePlaceBet = () => {
    if (selectedNumbers.length === 0 || betAmount <= 0 || betAmount > currentBalance) {
      return;
    }

    sounds.playBet();

    // Deduct balance
    setWalletState(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [currency]: Math.max(0, (prev.balances[currency] || 0) - betAmount),
      },
      transactions: [
        {
          id: `tx_bet_${Date.now()}`,
          type: 'BET',
          amount: betAmount,
          currency,
          timestamp: Date.now(),
          status: 'COMPLETED',
          txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
          note: `Round ${currentDrawId.slice(-6)} (${selectedNumbers.length} Picks)`,
        },
        ...prev.transactions,
      ],
    }));

    // Create ticket
    const newTicket: KenoTicket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      drawId: currentDrawId,
      userId: 'user_me',
      username: 'You',
      numbers: [...selectedNumbers],
      betAmount,
      currency,
      status: 'PENDING',
      timestamp: Date.now(),
    };

    setActiveTickets(prev => [...prev, newTicket]);

    // If ticket placed and in betting stage, start draw after brief 600ms transition!
    if (stage === 'BETTING') {
      setTimeout(() => {
        startDrawSequence(0, []);
      }, 600);
    }
  };

  // Canonical draw sequence generator helper
  const getCanonicalNumbers = (): number[] => {
    const seed = `${currentServerSeed}_${clientSeed}_nonce_${currentNonce}`;
    return generateDrawNumbers(seed);
  };

  // Start Drawing Sequence
  const startDrawSequence = (startIndex = 0, initialAccumulator: number[] = []) => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
      drawIntervalRef.current = null;
    }

    setStage('DRAWING');
    setIsPlaying(true);
    setSecondsRemaining(0);

    const targetNumbers = getCanonicalNumbers();
    let ballIndex = startIndex;
    const drawnAccumulator: number[] = [...initialAccumulator];

    if (startIndex === 0 && initialAccumulator.length === 0) {
      setDrawnNumbers([]);
      setCurrentDrawnBall(null);
    }

    const intervalMs = drawSpeed === 'FAST' || isInstantMode ? 500 : 1600;

    // Immediately reveal first ball if starting fresh so chamber isn't blank
    if (startIndex === 0 && initialAccumulator.length === 0) {
      const firstNum = targetNumbers[0];
      drawnAccumulator.push(firstNum);
      setDrawnNumbers([firstNum]);
      setCurrentDrawnBall(firstNum);
      sounds.playBallPop(0);
      ballIndex = 1;
    }

    drawIntervalRef.current = setInterval(() => {
      if (ballIndex < targetNumbers.length) {
        const nextNum = targetNumbers[ballIndex];
        drawnAccumulator.push(nextNum);
        setDrawnNumbers([...drawnAccumulator]);
        setCurrentDrawnBall(nextNum);
        sounds.playBallPop(ballIndex);

        // Check if user's tickets or chosen numbers hit
        const userHasHit =
          activeTickets.some(t => t.numbers.includes(nextNum)) ||
          selectedNumbers.includes(nextNum);
        if (userHasHit) {
          sounds.playMatchHit(drawnAccumulator.filter(n => selectedNumbers.includes(n)).length);
          try {
            confetti({
              particleCount: 22,
              spread: 50,
              origin: { y: 0.42 },
              colors: ['#10b981', '#06b6d4', '#f59e0b', '#ffffff'],
              ticks: 70,
              gravity: 1.2,
            });
          } catch {
            // Safe fallback
          }
        }

        ballIndex++;
      } else {
        if (drawIntervalRef.current) {
          clearInterval(drawIntervalRef.current);
          drawIntervalRef.current = null;
        }
        setIsPlaying(false);
        finishRound(targetNumbers);
      }
    }, intervalMs);
  };

  // Step 1 ball forward in sequence
  const handleDrawNextBall = () => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
      drawIntervalRef.current = null;
    }
    setIsPlaying(false);
    setStage('DRAWING');

    const canonical = getCanonicalNumbers();
    const currentIndex = drawnNumbers.length;

    if (currentIndex < canonical.length) {
      const nextNum = canonical[currentIndex];
      const updated = [...drawnNumbers, nextNum];
      setDrawnNumbers(updated);
      setCurrentDrawnBall(nextNum);
      sounds.playBallPop(currentIndex);

      const userHasHit =
        activeTickets.some(t => t.numbers.includes(nextNum)) ||
        selectedNumbers.includes(nextNum);
      if (userHasHit) {
        sounds.playMatchHit(updated.filter(n => selectedNumbers.includes(n)).length);
      }

      if (updated.length === canonical.length) {
        finishRound(canonical);
      }
    }
  };

  // Toggle Play / Pause for the sequential draw
  const handleTogglePlayPause = () => {
    if (isPlaying && drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
      drawIntervalRef.current = null;
      setIsPlaying(false);
    } else {
      if (drawnNumbers.length >= 20) {
        startDrawSequence(0, []);
      } else {
        startDrawSequence(drawnNumbers.length, drawnNumbers);
      }
    }
  };

  // Restart draw sequence from ball #1
  const handleRestartDraw = () => {
    startDrawSequence(0, []);
  };

  // Toggle speed between 1.6s and 0.5s
  const handleToggleSpeed = () => {
    const nextSpeed = drawSpeed === 'NORMAL' ? 'FAST' : 'NORMAL';
    setDrawSpeed(nextSpeed);

    if (isPlaying && stage === 'DRAWING' && drawnNumbers.length < 20) {
      if (drawIntervalRef.current) {
        clearInterval(drawIntervalRef.current);
        drawIntervalRef.current = null;
      }
      startDrawSequence(drawnNumbers.length, drawnNumbers);
    }
  };

  // Instant presets to match reference screenshots (0/20, 3/20, 6/20, 17/20) or live draw
  const handleSetPreset = (preset: '0/20' | '3/20' | '6/20' | '17/20' | 'LIVE') => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
      drawIntervalRef.current = null;
    }

    const canonical = getCanonicalNumbers();

    if (preset === '0/20') {
      setDrawnNumbers([]);
      setCurrentDrawnBall(null);
      setStage('BETTING');
      setSecondsRemaining(60);
      setIsPlaying(false);
    } else if (preset === '3/20') {
      // Photo 3: [21, 30, 52] with 52 in center, 21 and 30 in queue
      const balls = [canonical[0], canonical[1], canonical[2]];
      setDrawnNumbers(balls);
      setCurrentDrawnBall(canonical[2]);
      setStage('DRAWING');
      sounds.playBallPop(2);
      setIsPlaying(false);
    } else if (preset === '6/20') {
      // Photo 2: [21, 30, 52, 72, 11, 27] with 27 in center, 21, 30, 52, 72, 11 in queue
      const balls = canonical.slice(0, 6);
      setDrawnNumbers(balls);
      setCurrentDrawnBall(canonical[5]);
      setStage('DRAWING');
      sounds.playBallPop(5);
      setIsPlaying(false);
    } else if (preset === '17/20') {
      // Reference screenshot r1.jpg: Ball 46 in center, Row 1 (6 balls), Row 2 (10 balls)
      const balls = [49, 1, 34, 54, 15, 77, 76, 28, 27, 65, 47, 57, 24, 22, 13, 40, 46];
      setDrawnNumbers(balls);
      setCurrentDrawnBall(46);
      setCurrentDrawId('75622678');
      setOtherPlayers([
        {
          id: 'p_n',
          userId: 'user_n',
          username: 'N***i',
          numbers: [23, 43, 65, 67],
          betAmount: 148,
          currency: 'ETB',
          timestamp: Date.now() - 30000,
        },
        {
          id: 'p_a',
          userId: 'user_a',
          username: 'A***a',
          numbers: [67],
          betAmount: 159,
          currency: 'ETB',
          timestamp: Date.now() - 15000,
        },
      ]);
      setStage('DRAWING');
      sounds.playBallPop(16);
      setIsPlaying(false);
    } else if (preset === 'LIVE') {
      startDrawSequence(0, []);
    }
  };

  // Evaluate Round and Payouts
  const finishRound = (winningNumbers: number[]) => {
    setStage('RESULT');

    let totalRoundWin = 0;
    let roundHighestMult = 0;

    // Evaluate user tickets
    const evaluatedTickets = activeTickets.map(ticket => {
      const matches = ticket.numbers.filter(num => winningNumbers.includes(num));
      const mult = getMultiplier(ticket.numbers.length, matches.length);
      const payout = mult > 0 ? Math.round(ticket.betAmount * mult * 100) / 100 : 0;

      if (mult > roundHighestMult) {
        roundHighestMult = mult;
      }
      if (payout > 0) {
        totalRoundWin += payout;
      }

      const status = payout > 0 ? ('WON' as const) : ('LOST' as const);

      return {
        ...ticket,
        matchedCount: matches.length,
        matchedNumbers: matches,
        multiplier: mult,
        payout,
        status,
      };
    });

    // If user won any payout
    if (totalRoundWin > 0) {
      sounds.playWin();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ffffff'],
      });

      // Credit wallet
      setWalletState(prev => ({
        ...prev,
        balances: {
          ...prev.balances,
          [currency]: (prev.balances[currency] || 0) + totalRoundWin,
        },
        transactions: [
          {
            id: `tx_win_${Date.now()}`,
            type: 'WIN',
            amount: totalRoundWin,
            currency,
            timestamp: Date.now(),
            status: 'COMPLETED',
            txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
            note: `Draw ${currentDrawId.slice(-6)} Payout (x${roundHighestMult})`,
          },
          ...prev.transactions,
        ],
      }));

      setUserTotalWon(prev => prev + totalRoundWin);
      if (roundHighestMult > userHighestMultiplier) {
        setUserHighestMultiplier(roundHighestMult);
      }
      if (userRank > 5) {
        setUserRank(prev => Math.max(1, prev - 1));
      }
    }

    // Save to user history
    if (evaluatedTickets.length > 0) {
      setUserHistory(prev => [...evaluatedTickets, ...prev]);
    }

    // Record draw to Results archive
    const newDrawRecord: DrawRecord = {
      drawId: currentDrawId,
      drawNumber: parseInt(currentDrawId, 10) || 2324712,
      timestamp: Date.now(),
      drawnNumbers: winningNumbers,
      serverSeedHash,
      serverSeed: currentServerSeed,
      clientSeed,
      nonce: currentNonce,
      totalBetsPlaced: Math.floor(130 + Math.random() * 60) + activeTickets.length,
      totalPayouts: Math.floor(300 + Math.random() * 900) + totalRoundWin,
    };

    setDrawHistory(prev => [newDrawRecord, ...prev]);

    // Transition to next round after short results pause
    setTimeout(() => {
      prepareNextRound();
    }, isInstantMode ? 2000 : 4000);
  };

  // Prepare Next Round
  const prepareNextRound = () => {
    const nextNum = (parseInt(currentDrawId, 10) || 11114) + 1;
    const nextDrawId = String(nextNum);
    const nextServerSeed = `secret_seed_fast_keno_${nextDrawId}`;

    setCurrentDrawId(nextDrawId);
    setCurrentServerSeed(nextServerSeed);
    setCurrentNonce(prev => prev + 1);
    sha256(nextServerSeed).then(hash => setServerSeedHash(hash));

    setActiveTickets([]);
    setOtherPlayers(generateMockPlayers());
    setDrawnNumbers([]);
    setCurrentDrawnBall(null);
    setSecondsRemaining(60); // 1 minute countdown
    setStage('BETTING');

    // Auto start draw after brief betting intermission
    setTimeout(() => {
      startDrawSequence(0, []);
    }, isInstantMode ? 1000 : 4000);
  };

  // Auto-start live draw sequence on load
  useEffect(() => {
    const initTimer = setTimeout(() => {
      startDrawSequence(0, []);
    }, 1500);

    return () => {
      clearTimeout(initTimer);
      if (drawIntervalRef.current) {
        clearInterval(drawIntervalRef.current);
      }
    };
  }, []);

  // Background Countdown Timer for Live Clock Mode
  useEffect(() => {
    if (isInstantMode || stage === 'DRAWING' || stage === 'RESULT') return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          startDrawSequence();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInstantMode, stage, currentDrawId, activeTickets]);

  // Wallet Actions
  const handleDeposit = (curr: CurrencyType, amount: number, note?: string) => {
    setWalletState(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [curr]: (prev.balances[curr] || 0) + amount,
      },
      transactions: [
        {
          id: `tx_dep_${Date.now()}`,
          type: 'DEPOSIT',
          amount,
          currency: curr,
          timestamp: Date.now(),
          status: 'CONFIRMED',
          txHash: `0x${Math.random().toString(16).slice(2, 12)}`,
          note,
        },
        ...prev.transactions,
      ],
    }));
  };

  const handleWithdraw = (curr: CurrencyType, amount: number, destination: string): boolean => {
    const avail = walletState.balances[curr] || 0;
    if (amount <= 0 || amount > avail) return false;

    setWalletState(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [curr]: avail - amount,
      },
      transactions: [
        {
          id: `tx_with_${Date.now()}`,
          type: 'WITHDRAW',
          amount,
          currency: curr,
          timestamp: Date.now(),
          status: 'COMPLETED',
          txHash: `0x${Math.random().toString(16).slice(2, 12)}`,
          note: `To: ${destination.slice(0, 10)}...`,
        },
        ...prev.transactions,
      ],
    }));
    return true;
  };

  const handleToggleSound = () => {
    const newState = sounds.toggle();
    setIsSoundEnabled(newState);
  };

  const handleToggleInstantMode = () => {
    sounds.playClick(500);
    setIsInstantMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#070d13] flex justify-center text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Mobile-First Shell (Fits standard Telegram Mini App viewport up to 500px max-width) */}
      <div className="w-full max-w-md bg-[#0d141d] border-x border-[#1a2533] min-h-screen flex flex-col shadow-2xl relative overflow-hidden pb-12">
        {/* Telegram WebApp Native Header */}
        <TelegramHeader
          onBack={() => setActiveTab('GAME')}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        {/* Fast Keno Game Header (Logo, Balance, ID, Timer, Menu, Chat) */}
        <GameHeader
          balance={currentBalance}
          currency={currency}
          drawId={currentDrawId}
          secondsRemaining={secondsRemaining}
          isDrawing={stage === 'DRAWING'}
          onOpenWallet={() => {
            setWalletInitialTab('OVERVIEW');
            setIsWalletOpen(true);
          }}
          onOpenDeposit={() => {
            setWalletInitialTab('DEPOSIT');
            setIsWalletOpen(true);
          }}
          onOpenFairness={() => setIsFairnessOpen(true)}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Center Content: Live Draw Radar Stage matching reference screenshots */}
        <DrawStage
          drawnNumbers={drawnNumbers}
          currentDrawnNumber={currentDrawnBall}
          drawProgress={drawnNumbers.length}
          totalDrawCount={20}
          tickets={activeTickets}
          playerFeed={otherPlayers}
          userSelectedNumbers={selectedNumbers}
          isPlaying={isPlaying}
          drawSpeed={drawSpeed}
          onSetPreset={handleSetPreset}
          onDrawNext={handleDrawNextBall}
          onRestartDraw={handleRestartDraw}
          onTogglePlayPause={handleTogglePlayPause}
          onToggleSpeed={handleToggleSpeed}
        />

        {/* Sub-Navigation Tabs matching screenshots: GAME | HISTORY | RESULTS | STATISTICS */}
        <GameTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userTicketCount={activeTickets.length}
        />

        {/* Tab View Panels */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'GAME' && (
            <div className="flex flex-col min-h-full">
              <LivePlayerFeed
                userTickets={activeTickets}
                otherPlayers={otherPlayers}
                drawnNumbers={drawnNumbers}
                currency={currency}
                onOpenFairness={() => setIsFairnessOpen(true)}
              />
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <HistoryTab
              userHistory={userHistory}
              currency={currency}
            />
          )}

          {activeTab === 'RESULTS' && (
            <ResultsTab
              results={drawHistory}
              onVerifyDraw={draw => {
                setIsFairnessOpen(true);
              }}
            />
          )}

          {activeTab === 'STATISTICS' && (
            <StatisticsTab
              statsMap={statsMap}
              totalRoundsCount={100}
            />
          )}

          {activeTab === 'LEADERBOARD' && (
            <LeaderboardTab
              userRank={userRank}
              userTotalWon={userTotalWon}
              userHighestMultiplier={userHighestMultiplier}
              currency={currency}
            />
          )}
        </div>

        {/* Telegram Action Bar for Number Picking & Betting */}
        <div className="sticky bottom-0 left-0 right-0 p-2.5 bg-[#0a121a]/95 backdrop-blur border-t border-[#182635] flex items-center justify-between z-30 shadow-2xl">
          <button
            onClick={() => setIsBetSheetOpen(true)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm py-2.5 px-3.5 rounded-lg shadow-md flex items-center justify-between transition-all cursor-pointer mr-2"
          >
            <div className="flex items-center space-x-1.5">
              <span>🎲</span>
              <span className="tracking-wide">PICK NUMBERS</span>
              <span className="bg-slate-950/30 text-slate-950 font-mono text-[11px] px-1.5 py-0.5 rounded font-bold">
                {selectedNumbers.length}/10
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold">
              {selectedNumbers.length > 0
                ? `${getMultiplier(selectedNumbers.length, selectedNumbers.length)}x`
                : 'UP TO 50,000x'}
            </span>
          </button>

          <button
            onClick={() => {
              if (selectedNumbers.length === 0) {
                handleAutoPick();
              }
              handlePlaceBet();
            }}
            className="bg-[#f59e0b] hover:bg-[#fbbf24] active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-lg shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            BET {betAmount} {currency}
          </button>
        </div>

        {/* Slide-Up Betting & Number Selection Sheet */}
        {isBetSheetOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-end">
            <div
              className="absolute inset-0"
              onClick={() => setIsBetSheetOpen(false)}
            />
            <div className="relative z-10 w-full max-w-md mx-auto bg-[#0d1620] border-t border-[#1e2e3d] rounded-t-2xl max-h-[88vh] overflow-y-auto flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="sticky top-0 bg-[#0a1118]/95 backdrop-blur px-4 py-2.5 border-b border-[#182635] flex items-center justify-between z-20">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold text-sm">Select 1 to 10 Numbers</span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({selectedNumbers.length}/10)
                  </span>
                </div>
                <button
                  onClick={() => setIsBetSheetOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#182635] text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Odds Bar */}
              <OddsAndSelectionBar
                selectedNumbers={selectedNumbers}
                betAmount={betAmount}
                currency={currency}
                onClear={handleClear}
                onAutoPick={handleAutoPick}
                onOpenRules={() => setIsRulesOpen(true)}
              />

              {/* 80-Number Keno Grid */}
              <div className="px-2 py-1">
                <KenoBoard
                  selectedNumbers={selectedNumbers}
                  drawnNumbers={drawnNumbers}
                  statsMap={statsMap}
                  isDrawing={false}
                  onToggleNumber={handleToggleNumber}
                />
              </div>

              {/* Bet Controls */}
              <div className="sticky bottom-0 bg-[#0a1118] border-t border-[#182635] p-2">
                <BetControls
                  betAmount={betAmount}
                  currency={currency}
                  balance={currentBalance}
                  selectedCount={selectedNumbers.length}
                  isDrawing={false}
                  hasPlacedTicket={activeTickets.length > 0}
                  onBetChange={setBetAmount}
                  onPlaceBet={() => {
                    handlePlaceBet();
                    setIsBetSheetOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modals & Drawers */}
        <WalletModal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          walletState={walletState}
          initialTab={walletInitialTab}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onSelectCurrency={curr =>
            setWalletState(prev => ({ ...prev, selectedCurrency: curr }))
          }
        />

        <LiveChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          drawId={currentDrawId}
        />


        <ProvablyFairModal
          isOpen={isFairnessOpen}
          onClose={() => setIsFairnessOpen(false)}
          drawId={currentDrawId}
          serverSeedHash={serverSeedHash}
          revealedServerSeed={stage === 'RESULT' ? currentServerSeed : undefined}
          clientSeed={clientSeed}
          nonce={currentNonce}
          onUpdateClientSeed={setClientSeed}
        />

        <RulesModal
          isOpen={isRulesOpen}
          onClose={() => setIsRulesOpen(false)}
          currency={currency}
        />

        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={handleToggleSound}
          isInstantMode={isInstantMode}
          onToggleInstantMode={handleToggleInstantMode}
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenLeaderboard={() => setActiveTab('LEADERBOARD')}
          onOpenFairness={() => setIsFairnessOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      </div>
    </div>
  );
}
