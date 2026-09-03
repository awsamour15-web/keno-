import React, { useState } from 'react';
import { X, ShieldCheck, Check, Copy, RefreshCw } from 'lucide-react';
import { generateDrawNumbers } from '../utils/kenoEngine';

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawId: string;
  serverSeedHash: string;
  revealedServerSeed?: string;
  clientSeed: string;
  nonce: number;
  onUpdateClientSeed: (newSeed: string) => void;
}

export const ProvablyFairModal: React.FC<ProvablyFairModalProps> = ({
  isOpen,
  onClose,
  drawId,
  serverSeedHash,
  revealedServerSeed,
  clientSeed,
  nonce,
  onUpdateClientSeed,
}) => {
  const [testSeedInput, setTestSeedInput] = useState<string>(
    revealedServerSeed || `server_seed_${drawId}_nonce_${nonce}`
  );
  const [verifiedNumbers, setVerifiedNumbers] = useState<number[] | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerify = () => {
    const nums = generateDrawNumbers(testSeedInput);
    setVerifiedNumbers(nums);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121c27] border border-[#233549] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#172332] px-4 py-3 border-b border-[#233549] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Provably Fair Protocol</h2>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                ATLAS-V GAMING ENGINE
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

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Fast Keno uses an open cryptographic SHA-256 algorithm to guarantee that each round's 20 winning numbers are generated with zero possibility of casino alteration.
          </p>

          <div className="bg-[#0e1620] p-3 rounded-xl border border-[#1d2a38] space-y-2 font-mono text-[11px]">
            <div className="flex justify-between items-center text-slate-400">
              <span>Active Draw ID:</span>
              <span className="text-emerald-400 font-bold">{drawId}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Nonce Round:</span>
              <span className="text-slate-200">{nonce}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block">Server Seed Hash (Pre-committed):</span>
              <div className="p-1.5 bg-[#080d13] rounded text-emerald-400 text-[10px] break-all border border-[#1a2634] flex items-center justify-between">
                <span>{serverSeedHash}</span>
                <button
                  onClick={() => handleCopy(serverSeedHash)}
                  className="text-slate-400 hover:text-white ml-1 p-0.5"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>

          {/* Client Seed Customization */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 block">Your Client Seed</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={clientSeed}
                onChange={e => onUpdateClientSeed(e.target.value)}
                className="flex-1 h-9 px-3 bg-[#0d141e] border border-[#233346] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => onUpdateClientSeed(`tg_client_${Math.floor(Math.random() * 100000)}`)}
                className="px-2.5 h-9 bg-[#1b2a3a] hover:bg-[#23364a] text-cyan-300 rounded-lg border border-[#2a3f55] transition-colors cursor-pointer flex items-center space-x-1"
                title="Randomize Client Seed"
              >
                <RefreshCw size={13} />
                <span>Random</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-500">
              You can change your client seed at any time to influence future round outcomes.
            </span>
          </div>

          {/* Deterministic Verifier */}
          <div className="bg-[#14202d] p-3 rounded-xl border border-emerald-500/30 space-y-2">
            <span className="font-bold text-emerald-400 block">Verify Draw Numbers Algorithm</span>
            <div className="flex space-x-2">
              <input
                type="text"
                value={testSeedInput}
                onChange={e => setTestSeedInput(e.target.value)}
                placeholder="Enter Seed"
                className="flex-1 h-8 px-2.5 bg-[#090f15] border border-[#1d2a38] rounded text-white font-mono text-[11px]"
              />
              <button
                onClick={handleVerify}
                className="px-3 h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs cursor-pointer shadow"
              >
                Verify
              </button>
            </div>

            {verifiedNumbers && (
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 block mb-1">
                  Output 20 Balls for this seed:
                </span>
                <div className="grid grid-cols-10 gap-1">
                  {verifiedNumbers.map((n, i) => (
                    <span
                      key={`ver-${i}`}
                      className="h-6 rounded bg-[#1c2a38] border border-cyan-500/40 text-cyan-200 text-[10px] font-bold flex items-center justify-center font-mono"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
