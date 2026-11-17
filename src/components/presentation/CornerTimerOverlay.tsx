import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, AlertTriangle, Coffee, GraduationCap } from 'lucide-react';

export const CornerTimerOverlay: React.FC = () => {
  const { config, timer } = useApp();
  const { timerState, startTimer, pauseTimer, resumeTimer, resetTimer } = timer;
  const { initialSeconds, remainingSeconds, isRunning, isPaused, isCompleted, overtimeSeconds } = timerState;

  if (!config.showTimer) return null;

  // Format hours, minutes, seconds
  const totalDisplaySecs = isCompleted ? overtimeSeconds : remainingSeconds;
  const hours = Math.floor(totalDisplaySecs / 3600);
  const minutes = Math.floor((totalDisplaySecs % 3600) / 60);
  const seconds = totalDisplaySecs % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Progress percentage
  const progressPercent = initialSeconds > 0
    ? Math.max(0, Math.min(100, ((initialSeconds - remainingSeconds) / initialSeconds) * 100))
    : 0;

  // Position Classes
  const getPositionClasses = () => {
    switch (config.timerPosition) {
      case 'top-left':
        return 'top-4 left-4 sm:top-6 sm:left-6';
      case 'bottom-left':
        return 'bottom-4 left-4 sm:bottom-6 sm:left-6';
      case 'bottom-right':
        return 'bottom-4 right-4 sm:bottom-6 sm:right-6';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2 sm:top-6';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6';
      case 'top-right':
      default:
        return 'top-4 right-4 sm:top-6 sm:right-6';
    }
  };

  // Glass/Background Style Classes
  const getGlassClasses = () => {
    switch (config.timerGlass) {
      case 'glass-frosted':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]';
      case 'solid-dark':
        return 'bg-[#0B0F19] border border-slate-700 shadow-2xl';
      case 'minimal-ghost':
        return 'bg-black/30 backdrop-blur-sm border border-white/10';
      case 'glass-dark':
      default:
        return 'bg-black/60 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)]';
    }
  };

  // Text Color Classes
  const getColorClasses = () => {
    if (isCompleted) return 'text-red-400';
    switch (config.timerColor) {
      case 'white':
        return 'text-white';
      case 'amber':
        return 'text-amber-400';
      case 'emerald':
        return 'text-emerald-400';
      case 'cyan':
        return 'text-cyan-400';
      case 'orange':
      default:
        return 'text-brand-orange';
    }
  };

  // Progress Bar Accent
  const getProgressBarColor = () => {
    if (isCompleted) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
    switch (config.timerColor) {
      case 'white':
        return 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]';
      case 'amber':
        return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
      case 'emerald':
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
      case 'cyan':
        return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]';
      case 'orange':
      default:
        return 'bg-brand-orange shadow-[0_0_8px_rgba(255,90,0,0.8)]';
    }
  };

  // Size Classes
  const getSizeClasses = () => {
    switch (config.timerSize) {
      case 'large':
        return {
          container: 'px-5 py-3 rounded-2xl',
          digits: 'text-3xl sm:text-4xl md:text-5xl',
          badge: 'text-xs',
        };
      case 'normal':
        return {
          container: 'px-4 py-2.5 rounded-xl',
          digits: 'text-2xl sm:text-3xl',
          badge: 'text-[11px]',
        };
      case 'compact':
      default:
        return {
          container: 'px-3.5 py-2 rounded-xl',
          digits: 'text-xl sm:text-2xl',
          badge: 'text-[10px]',
        };
    }
  };

  const sizes = getSizeClasses();

  return (
    <div
      className={`absolute z-30 select-none group transition-all duration-300 ${getPositionClasses()}`}
    >
      <div className={`relative flex flex-col items-center overflow-hidden transition-all duration-300 ${sizes.container} ${getGlassClasses()}`}>
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -inset-1 rounded-full opacity-10 bg-brand-orange blur-lg pointer-events-none" />

        {/* Status Header */}
        <div className="flex items-center justify-between w-full gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            {config.mode === 'break' ? (
              <span className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider ${sizes.badge} text-emerald-400`}>
                <Coffee className="w-3 h-3 animate-pulse" />
                <span>Break</span>
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider ${sizes.badge} text-slate-300`}>
                <GraduationCap className="w-3 h-3 text-brand-orange" />
                <span>Lecture</span>
              </span>
            )}

            {isCompleted && (
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest animate-pulse flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" /> Overtime
              </span>
            )}
          </div>

          {/* Quick Hover Control (Play/Pause/Reset) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {isRunning && !isPaused ? (
              <button
                onClick={(e) => { e.stopPropagation(); pauseTimer(); }}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Pause (Space)"
              >
                <Pause className="w-3 h-3 fill-current" />
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); isPaused ? resumeTimer() : startTimer(); }}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Start / Resume (Space)"
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); resetTimer(); }}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Reset (R)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Digital Numbers */}
        <div className={`font-mono font-black tracking-tight flex items-baseline drop-shadow-md ${sizes.digits} ${getColorClasses()}`}>
          {isCompleted && <span className="mr-1 text-red-400">+</span>}
          {hours > 0 && (
            <>
              <span>{pad(hours)}</span>
              <span className="text-white/40 mx-0.5 -translate-y-0.5">:</span>
            </>
          )}
          <span>{pad(minutes)}</span>
          <span className="text-white/40 mx-0.5 -translate-y-0.5">:</span>
          <span>{pad(seconds)}</span>
        </div>

        {/* Slim Progress Bar */}
        {config.showProgress && (
          <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${getProgressBarColor()}`}
              style={{ width: `${isCompleted ? 100 : progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
