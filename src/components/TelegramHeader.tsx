import React from 'react';
import { ChevronLeft, ChevronDown, MoreVertical } from 'lucide-react';

interface TelegramHeaderProps {
  onBack?: () => void;
  onOpenMenu?: () => void;
}

export const TelegramHeader: React.FC<TelegramHeaderProps> = ({ onBack, onOpenMenu }) => {
  return (
    <div className="w-full bg-[#0d141d] px-3 py-2 flex items-center justify-between text-slate-100 select-none border-b border-[#182330]">
      {/* Left: Back button with arrow and text matching screenshot */}
      <button
        onClick={onBack}
        className="flex items-center space-x-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
      >
        <ChevronLeft size={20} className="text-slate-100" />
        <span className="text-base tracking-tight">Back</span>
      </button>

      {/* Right: Dropdown chevron & 3-dot menu matching screenshot */}
      <div className="flex items-center space-x-3">
        <button
          title="Minimize / Collapse"
          className="text-slate-200 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <ChevronDown size={20} />
        </button>
        <button
          onClick={onOpenMenu}
          title="Menu"
          className="text-slate-200 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

