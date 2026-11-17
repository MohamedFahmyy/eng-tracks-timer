import React, { useState, useEffect } from 'react';
import { PresentationMode } from '../../types';
import { Coffee, GraduationCap } from 'lucide-react';

interface PresentationHeaderProps {
  mode: PresentationMode;
  sessionTitle: string;
  subtitle: string;
  breakMessage: string;
  breakSubtitle: string;
}

export const PresentationHeader: React.FC<PresentationHeaderProps> = ({
  mode,
  sessionTitle,
  subtitle,
  breakMessage,
  breakSubtitle,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isBreak = mode === 'break';

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 z-30 shadow-md">
      {/* Left: Engineering Tracks Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Custom SVG Logo representation */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-red-600 flex items-center justify-center shadow-lg shadow-brand-orange/20 border border-white/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-sans font-black text-sm tracking-wider text-white">ENGINEERING</span>
              <span className="font-sans font-extrabold text-sm tracking-widest text-brand-orange">TRACKS</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">PMI Authorized Training Partner</span>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block h-7 w-[1px] bg-white/15 mx-1" />

        {/* Mode Tag */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm ${
          isBreak
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            : 'bg-brand-orange/15 text-brand-orange border-brand-orange/30'
        }`}>
          {isBreak ? (
            <>
              <Coffee className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Break Mode</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-brand-orange" />
              <span>Lecture Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Center: Title & Subtitle */}
      <div className="flex-1 text-center px-4 max-w-2xl mx-auto truncate">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate drop-shadow-sm font-sans">
          {isBreak ? breakMessage : sessionTitle}
        </h1>
        <p className="text-xs text-slate-400 font-normal truncate mt-0.5">
          {isBreak ? breakSubtitle : subtitle}
        </p>
      </div>

      {/* Right: Live Wall Clock */}
      <div className="text-right flex flex-col items-end">
        <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider tabular-nums drop-shadow-sm">
          {currentTime}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
          {currentDate}
        </span>
      </div>
    </header>
  );
};
