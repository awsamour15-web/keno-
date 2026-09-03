import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, ShieldCheck, RefreshCw, Check, Copy, AlertCircle, Zap } from 'lucide-react';
import { CurrencyType, WalletState, WalletTransaction } from '../types';
import { CURRENCIES } from '../utils/kenoEngine';
import { sounds } from '../utils/audio';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: WalletState;
  onDeposit: (currency: CurrencyType, amount: number, note?: string) => void;
  onWithdraw: (currency: CurrencyType, amount: number, destination: string) => boolean;
  onSelectCurrency: (currency: CurrencyType) => void;
  initialTab?: 'OVERVIEW' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSACTIONS';
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onDeposit,
  onWithdraw,
  onSelectCurrency,
  initialTab = 'OVERVIEW',
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSACTIONS'>(initialTab);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [securityPin, setSecurityPin] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCurrency = walletState.selectedCurrency;
  const currentBalance = walletState.balances[currentCurrency] || 0;
  const config = CURRENCIES[currentCurrency];

  const handleFaucet = () => {
    sounds.playWin();
    const amount = currentCurrency === 'ETB' ? 500 : currentCurrency === 'TON' ? 2 : currentCurrency === 'USDT' ? 10 : 100;
    onDeposit(currentCurrency, amount, 'Free Test Faucet Top-up');
    setActionSuccessMsg(`Added +${amount} ${currentCurrency} demo funds to your secure wallet!`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleDepositSubmit = () => {
    if (depositAmount <= 0) return;
    sounds.playWin();
    onDeposit(currentCurrency, depositAmount, `Deposit via Telegram Payment`);
    setActionSuccessMsg(`Deposit of ${depositAmount} ${currentCurrency} credited successfully!`);
    setTimeout(() => {
      setActionSuccessMsg(null);
      setActiveTab('OVERVIEW');
    }, 1500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMsg(null);

    if (withdrawAmount <= 0) {
      setActionErrorMsg('Please specify a valid amount');
      return;
    }
    if (withdrawAmount > currentBalance) {
      setActionErrorMsg('Withdrawal amount exceeds available balance');
      return;
    }
    if (!withdrawAddress.trim()) {
      setActionErrorMsg('Destination wallet address or phone number is required');
      return;
    }
    if (securityPin.length < 4) {
      setActionErrorMsg('Please enter a 4-digit security PIN for confirmation');
      return;
    }

    const success = onWithdraw(currentCurrency, withdrawAmount, withdrawAddress);
    if (success) {
      sounds.playBet();
      setActionSuccessMsg(`Withdrawal of ${withdrawAmount} ${currentCurrency} processed to ${withdrawAddress}!`);
      setWithdrawAddress('');
      setSecurityPin('');
      setTimeout(() => {
        setActionSuccessMsg(null);
        setActiveTab('OVERVIEW');
      }, 2000);
    } else {
      setActionErrorMsg('Withdrawal failed. Please check your balance.');
    }
  };

  const handleCopyDepositAddress = () => {
    const address = currentCurrency === 'TON'
      ? 'UQBx8...kEn0_tOn_wAlLeT'
      : currentCurrency === 'USDT'
      ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      : currentCurrency === 'ETB'
      ? 'Telebirr / CBE Pay ID: 0912448899'
      : 'Telegram Stars Direct Gateway';
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121c27] border border-[#233549] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#172332] px-4 py-3 border-b border-[#233549] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Secure Casino Wallet</h2>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                Bank-Grade Provably Secure
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#203144] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Currency Switcher Bar */}
        <div className="bg-[#0e1620] px-4 py-2 border-b border-[#1c2938] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Currency:</span>
          <div className="flex items-center space-x-1.5">
            {(['ETB', 'TON', 'USDT', 'STARS'] as CurrencyType[]).map(c => {
              const isSelected = currentCurrency === c;
              return (
                <button
                  key={c}
                  onClick={() => onSelectCurrency(c)}
                  className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-[#162330] text-slate-400 hover:text-slate-200 hover:bg-[#1e2e40]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="grid grid-cols-4 bg-[#141f2c] border-b border-[#203043] text-xs font-bold text-slate-400">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-2.5 text-center transition-colors cursor-pointer ${
              activeTab === 'OVERVIEW' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-[#172535]' : 'hover:text-slate-200'
            }`}
          >
            Balance
          </button>
          <button
            onClick={() => setActiveTab('DEPOSIT')}
            className={`py-2.5 text-center transition-colors cursor-pointer ${
              activeTab === 'DEPOSIT' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-[#172535]' : 'hover:text-slate-200'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('WITHDRAW')}
            className={`py-2.5 text-center transition-colors cursor-pointer ${
              activeTab === 'WITHDRAW' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-[#172535]' : 'hover:text-slate-200'
            }`}
          >
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`py-2.5 text-center transition-colors cursor-pointer ${
              activeTab === 'TRANSACTIONS' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-[#172535]' : 'hover:text-slate-200'
            }`}
          >
            Logs
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {actionSuccessMsg && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 text-xs text-emerald-300 font-semibold flex items-center space-x-2 animate-in fade-in">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {actionErrorMsg && (
            <div className="bg-rose-950/60 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-300 font-semibold flex items-center space-x-2 animate-in fade-in">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{actionErrorMsg}</span>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Big Balance Card */}
              <div className="bg-gradient-to-br from-[#1b2b3d] to-[#121c27] border border-[#2b3e54] rounded-xl p-4 text-center shadow-lg">
                <span className="text-xs text-slate-400 font-medium">Available {config.name} Balance</span>
                <div className="text-3xl font-black text-amber-400 my-1 font-mono tracking-tight">
                  {currentBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}{' '}
                  <span className="text-xs text-slate-300 font-bold">{currentCurrency}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Ready for instant bets in Fast Keno rounds
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => setActiveTab('DEPOSIT')}
                    className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ArrowDownLeft size={16} />
                    <span>Deposit</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('WITHDRAW')}
                    className="h-10 bg-[#223246] hover:bg-[#2b3e56] text-slate-200 font-extrabold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer border border-[#314660]"
                  >
                    <ArrowUpRight size={16} />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>

              {/* Free Demo Faucet Button */}
              <div className="bg-[#152332] border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Instant Demo Faucet</span>
                  <span className="text-[10px] text-slate-400">
                    Get free test tokens instantly to test gameplay
                  </span>
                </div>
                <button
                  onClick={handleFaucet}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-black text-xs rounded-lg flex items-center space-x-1 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Zap size={13} />
                  <span>+Top Up</span>
                </button>
              </div>

              {/* Multi-currency breakdown */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block">All Wallet Balances</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['ETB', 'TON', 'USDT', 'STARS'] as CurrencyType[]).map(curr => (
                    <div
                      key={curr}
                      onClick={() => onSelectCurrency(curr)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        currentCurrency === curr
                          ? 'bg-[#1b2b3d] border-emerald-500/60 shadow-sm'
                          : 'bg-[#121c27] border-[#1f2d3d] hover:border-[#2b3c4f]'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-0.5">
                        <span>{curr}</span>
                        <span>{CURRENCIES[curr].name}</span>
                      </div>
                      <div className="font-mono font-bold text-sm text-slate-100">
                        {(walletState.balances[curr] || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DEPOSIT TAB */}
          {activeTab === 'DEPOSIT' && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Quick Deposit Amount ({currentCurrency})</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[50, 100, 250, 500].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        depositAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-[#152230] text-slate-300 border-[#233447]'
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Custom Amount</label>
                <input
                  type="number"
                  min={config.minBet}
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#0d141e] border border-[#233346] rounded-lg text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Deposit Gateway options */}
              <div className="bg-[#152332] border border-[#24374b] rounded-xl p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">
                    {currentCurrency === 'ETB'
                      ? 'Telebirr / CBE Mobile Pay'
                      : currentCurrency === 'TON'
                      ? 'Telegram Wallet / TON Connect'
                      : currentCurrency === 'STARS'
                      ? 'Telegram In-App Stars'
                      : 'Tether TRC-20'}
                  </span>
                  <button
                    onClick={handleCopyDepositAddress}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer text-[11px]"
                  >
                    {copiedAddress ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedAddress ? 'Copied' : 'Copy Pay ID'}</span>
                  </button>
                </div>
                <div className="p-2 bg-[#0c1219] rounded font-mono text-[11px] text-slate-300 break-all border border-[#1b2837]">
                  {currentCurrency === 'TON'
                    ? 'UQBx8rF9q1X_kEn0_tOn_wAlLeT9988'
                    : currentCurrency === 'ETB'
                    ? 'Telebirr Merchant ID: 887211'
                    : currentCurrency === 'STARS'
                    ? 'Direct Telegram Payment Invoice'
                    : 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDepositSubmit}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <ArrowDownLeft size={16} />
                <span>Confirm Deposit ({depositAmount} {currentCurrency})</span>
              </button>
            </div>
          )}

          {/* WITHDRAW TAB */}
          {activeTab === 'WITHDRAW' && (
            <form onSubmit={handleWithdrawSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {currentCurrency === 'ETB' ? 'Telebirr Phone / CBE Account Number' : 'Destination Wallet Address'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={currentCurrency === 'ETB' ? '0912345678' : 'UQ... / TRC-20 Address'}
                  value={withdrawAddress}
                  onChange={e => setWithdrawAddress(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0d141e] border border-[#233346] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Withdraw Amount ({currentCurrency})</span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(currentBalance)}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Max ({currentBalance})
                  </button>
                </div>
                <input
                  type="number"
                  min={1}
                  max={currentBalance}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#0d141e] border border-[#233346] rounded-lg text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Security PIN (4-Digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={securityPin}
                  onChange={e => setSecurityPin(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0d141e] border border-[#233346] rounded-lg text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Fee notice */}
              <div className="bg-[#141f2c] p-2.5 rounded-lg border border-[#213042] text-[11px] text-slate-400 flex justify-between">
                <span>Network Fee (1.5%):</span>
                <span className="font-mono text-slate-200">
                  {Math.round(withdrawAmount * 0.015 * 100) / 100} {currentCurrency}
                </span>
              </div>

              <button
                type="submit"
                disabled={withdrawAmount <= 0 || withdrawAmount > currentBalance}
                className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white font-black text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <ArrowUpRight size={16} />
                <span>Submit Withdrawal</span>
              </button>
            </form>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'TRANSACTIONS' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Recent Wallet Activity ({walletState.transactions.length})
              </span>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {walletState.transactions.map(tx => {
                  const isPositive = tx.type === 'DEPOSIT' || tx.type === 'WIN' || tx.type === 'REWARD';
                  const time = new Date(tx.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <div
                      key={tx.id}
                      className="bg-[#131d27] border border-[#1f2c3b] rounded-lg p-2.5 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                            isPositive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {isPositive ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block leading-tight">
                            {tx.type} {tx.note ? `• ${tx.note}` : ''}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {time} • TX: {tx.txHash.slice(0, 8)}...
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold">
                        <span className={isPositive ? 'text-emerald-400' : 'text-slate-300'}>
                          {isPositive ? '+' : '-'}
                          {tx.amount.toLocaleString()} {tx.currency}
                        </span>
                        <span className="block text-[9px] text-emerald-500/90 uppercase font-semibold">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
