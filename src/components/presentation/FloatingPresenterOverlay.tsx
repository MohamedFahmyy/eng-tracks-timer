import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Coffee,
  GraduationCap,
  Sliders,
  Volume2,
  VolumeX,
  Columns,
  Rows
} from 'lucide-react';

export const FloatingPresenterOverlay: React.FC = () => {
  const {
    timer,
    config,
    updateConfig,
    isFullscreen,
    toggleFullscreen,
    setIsQuickControlsOpen
  } = useApp();

  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Auto-hide after 2.5 seconds of mouse inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const { isRunning, isPaused } = timer.timerState;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      onMouseEnter={() => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        timeoutRef.current = window.setTimeout(() => setIsVisible(false), 1500);
      }}
    >
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl text-white">
        {/* Play/Pause */}
        {isRunning && !isPaused ? (
          <button
            onClick={() => timer.pauseTimer()}
            title="Pause Timer (Space)"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={() => timer.resumeTimer()}
            title="Resume Timer (Space)"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            onClick={() => timer.startTimer()}
            title="Start Timer (Space)"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start</span>
          </button>
        )}

        {/* Quick Time Adjusters */}
        <div className="flex items-center gap-1 border-x border-white/10 px-2">
          <button
            onClick={() => timer.adjustTime(60)}
            title="Add 1 Minute"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> 1m
          </button>
          <button
            onClick={() => timer.adjustTime(300)}
            title="Add 5 Minutes"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> 5m
          </button>
          <button
            onClick={() => timer.adjustTime(-60)}
            title="Subtract 1 Minute"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-0.5"
          >
            <Minus className="w-3 h-3" /> 1m
          </button>
          <button
            onClick={() => timer.resetTimer()}
            title="Reset Timer (R)"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <button
          onClick={() => {
            const nextMode = config.mode === 'lecture' ? 'break' : 'lecture';
            updateConfig({ mode: nextMode });
            timer.setDuration(nextMode === 'break' ? 15 * 60 : 45 * 60, false);
          }}
          title="Switch Mode"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
        >
          {config.mode === 'lecture' ? (
            <>
              <Coffee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch to Break</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-brand-orange" />
              <span>Switch to Lecture</span>
            </>
          )}
        </button>

        {/* 75/25 Layout Switcher */}
        <button
          onClick={() => {
            const nextLayout = config.presentationLayout === 'vertical-right' ? 'horizontal-bottom' : 'vertical-right';
            updateConfig({ presentationLayout: nextLayout });
          }}
          title={config.presentationLayout === 'vertical-right' ? "Switch to Horizontal (Bottom 25%)" : "Switch to Vertical (Right 25%)"}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
        >
          {config.presentationLayout === 'vertical-right' ? (
            <>
              <Rows className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline text-[11px]">Horizontal</span>
            </>
          ) : (
            <>
              <Columns className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline text-[11px]">Vertical</span>
            </>
          )}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => updateConfig({ soundAlert: !config.soundAlert })}
          title={config.soundAlert ? "Mute Sound Alert" : "Enable Sound Alert"}
          className={`p-1.5 rounded-lg transition-colors ${
            config.soundAlert ? 'text-brand-orange bg-brand-orange/10' : 'text-slate-400 bg-slate-800'
          }`}
        >
          {config.soundAlert ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Enter Fullscreen (F)"}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Open Settings Quick Modal */}
        <button
          onClick={() => setIsQuickControlsOpen(true)}
          title="Open Controls Drawer"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
