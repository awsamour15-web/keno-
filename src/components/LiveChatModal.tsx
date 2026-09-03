import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Smile, ShieldCheck, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isUser?: boolean;
}

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawId: string;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  drawId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys_1',
      sender: 'System',
      text: `Welcome to Fast Keno Live! Round #${drawId} in progress.`,
      timestamp: 'Just now',
      isSystem: true,
    },
    {
      id: 'msg_1',
      sender: 'h***s',
      text: 'Good luck everyone! Waiting for 11 and 30 🔥',
      timestamp: '1m ago',
    },
    {
      id: 'msg_2',
      sender: 'q***y',
      text: 'Hit 2 numbers already! Let’s go 50!',
      timestamp: '1m ago',
    },
    {
      id: 'msg_3',
      sender: 'g***i',
      text: 'Deposited 500 ETB via Telebirr, instant! 🚀',
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Occasional incoming messages from other players
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const mockSenders = ['b***c', 'q***y', 'm***a', 'k***o', 's***m'];
      const mockQuotes = [
        'Hit on 52! 🤑',
        'Need 27 for full house!',
        'Nice draw, 100 ETB bet paid 10x!',
        'Anyone playing spot 10?',
        'Good luck all 🔥',
        'Next round starting soon!',
      ];

      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: mockSenders[Math.floor(Math.random() * mockSenders.length)],
        text: mockQuotes[Math.floor(Math.random() * mockQuotes.length)],
        timestamp: 'Just now',
      };

      setMessages(prev => [...prev.slice(-25), newMsg]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'You',
      text: inputMessage.trim(),
      timestamp: 'Just now',
      isUser: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
  };

  const handleEmojiClick = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#101923] border border-[#202f40] rounded-xl shadow-2xl flex flex-col h-[520px] max-h-[90vh] overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#131f2c] border-b border-[#1f2e3f]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>Fast Keno Live Chat</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                  LIVE
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">1,466 Players Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1e2c3c] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.isUser
                  ? 'items-end'
                  : msg.isSystem
                  ? 'items-center'
                  : 'items-start'
              }`}
            >
              {msg.isSystem ? (
                <div className="bg-[#182736] border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-[11px] font-mono flex items-center space-x-1.5 my-1">
                  <ShieldCheck size={12} className="text-cyan-400" />
                  <span>{msg.text}</span>
                </div>
              ) : (
                <div
                  className={`max-w-[85%] rounded-lg p-2.5 ${
                    msg.isUser
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-[#182534] border border-[#233547] text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between space-x-2 mb-0.5">
                    <span
                      className={`font-bold text-[11px] ${
                        msg.isUser ? 'text-amber-200' : 'text-emerald-400 font-mono'
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <span className="text-[9px] text-slate-400 opacity-80 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="break-words text-xs leading-relaxed">{msg.text}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Emoji Bar */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#0f1721] border-t border-[#1c2a3a]">
          {['🍀', '🔥', '🎉', '💰', '👍', '🚀'].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-base hover:scale-125 transition-transform cursor-pointer px-1"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2 p-2.5 bg-[#131f2c] border-t border-[#1f2e3f]"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#1a2837] border border-[#273a4d] rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            maxLength={120}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 rounded-lg transition-colors cursor-pointer"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
