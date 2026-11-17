import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimerControls } from './TimerControls';
import { FeaturedImageManager } from './FeaturedImageManager';
import { GalleryManager } from './GalleryManager';
import { SessionSettingsManager } from './SessionSettingsManager';
import { ThemeCustomizer } from './ThemeCustomizer';
import { PresentationScreen } from '../presentation/PresentationScreen';
import {
  Clock,
  Pin,
  Layers,
  Sliders,
  Palette,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  GraduationCap,
  Coffee,
  Tv,
  Columns,
  Rows
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    config,
    updateConfig,
    timer,
    enterFullscreen
  } = useApp();

  const { isRunning, isPaused, remainingSeconds, overtimeSeconds, isCompleted } = timer.timerState;

  const displaySecs = isCompleted ? overtimeSeconds : remainingSeconds;
  const m = Math.floor(displaySecs / 60);
  const s = displaySecs % 60;
  const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  const isVertical = config.presentationLayout === 'vertical-right';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070A10] text-slate-100 font-sans">
      
      {/* 1. Global Top Bar */}
      <header className="h-16 flex-shrink-0 bg-[#0B0F19] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30">
        
        {/* Brand & Studio Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 px-2 py-1 rounded-xl bg-white/95 flex items-center justify-center shadow-md shadow-black/30 border border-white/20">
            <img src="/logo.png" alt="Engineering Tracks" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-sans font-black text-xs sm:text-sm tracking-wider text-white">ENGINEERING</span>
              <span className="font-sans font-extrabold text-xs sm:text-sm tracking-widest text-brand-orange">TRACKS</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-orange/20 text-brand-orange ml-1 border border-brand-orange/30">
                Image-First Studio (75/25)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5">
              {config.mode === 'break' ? config.breakMessage : config.sessionTitle}
            </p>
          </div>
        </div>

        {/* Center: Layout Option Switcher + Quick HUD */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
          
          {/* Quick 75/25 Layout Switcher */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => updateConfig({ presentationLayout: 'vertical-right' })}
              title="Option A: 75% Hero Left • 25% Vertical Right"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                isVertical
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Vertical (Right 25%)</span>
            </button>
            <button
              onClick={() => updateConfig({ presentationLayout: 'horizontal-bottom' })}
              title="Option B: 75% Hero Top • 25% Horizontal Bottom"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                !isVertical
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rows className="w-3.5 h-3.5" />
              <span>Horizontal (Bottom 25%)</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-700 mx-1" />

          {/* Mode Pill */}
          <button
            onClick={() => {
              const nextMode = config.mode === 'lecture' ? 'break' : 'lecture';
              updateConfig({ mode: nextMode });
              if (!isRunning) timer.setDuration(nextMode === 'break' ? 15 * 60 : 45 * 60, false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              config.mode === 'break'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
            }`}
          >
            {config.mode === 'break' ? <Coffee className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
            <span>{config.mode === 'break' ? 'Break' : 'Lecture'}</span>
          </button>

          {/* Quick Digits */}
          <div className="font-mono text-base font-bold text-white px-1">
            {isCompleted && <span className="text-red-400 mr-1">+</span>}
            <span className={isCompleted ? 'text-red-400' : ''}>{timeFormatted}</span>
          </div>

          {/* Quick Play/Pause */}
          <div className="flex items-center gap-1">
            {isRunning && !isPaused ? (
              <button
                onClick={timer.pauseTimer}
                title="Pause"
                className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
              >
                <Pause className="w-3 h-3 fill-current" />
              </button>
            ) : isPaused ? (
              <button
                onClick={timer.resumeTimer}
                title="Resume"
                className="p-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
            ) : (
              <button
                onClick={() => timer.startTimer()}
                title="Start"
                className="p-1 rounded-lg bg-brand-orange hover:bg-brand-orangeHover text-white transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
            )}

            <button
              onClick={() => timer.resetTimer()}
              title="Reset"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Enter Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={enterFullscreen}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-orange via-orange-600 to-red-600 hover:from-brand-orangeHover hover:to-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Tv className="w-4 h-4" />
            <span>Present Fullscreen</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-black/30 rounded font-mono border border-white/20">F</kbd>
          </button>
        </div>
      </header>

      {/* 2. Workspace Body: Left Controls + Center Image-First Preview */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Presenter Controls */}
        <aside className="w-full sm:w-[420px] lg:w-[440px] flex-shrink-0 bg-[#0E131F] border-r border-slate-800 flex flex-col z-20 shadow-xl">
          
          {/* Tab Navigation */}
          <div className="flex items-center justify-between p-2 bg-[#0A0E17] border-b border-slate-800/80 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveSidebarTab('gallery')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                activeSidebarTab === 'gallery'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Gallery (75/25)</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('featured')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                activeSidebarTab === 'featured'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Pin className="w-4 h-4" />
              <span>Hero Slide</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('timer')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                activeSidebarTab === 'timer'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Timer Overlay</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('session')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                activeSidebarTab === 'session'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Session</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('appearance')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                activeSidebarTab === 'appearance'
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Theme</span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
            {activeSidebarTab === 'gallery' && <GalleryManager />}
            {activeSidebarTab === 'featured' && <FeaturedImageManager />}
            {activeSidebarTab === 'timer' && <TimerControls />}
            {activeSidebarTab === 'session' && <SessionSettingsManager />}
            {activeSidebarTab === 'appearance' && <ThemeCustomizer />}
          </div>
        </aside>

        {/* Center / Right: Live Image-First 16:9 Presentation Preview */}
        <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-[#070A10] overflow-hidden relative">
          
          {/* Top Label */}
          <div className="w-full max-w-6xl flex items-center justify-between mb-2 px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">Live Image-First Output</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {isVertical
                  ? '[Option A: 75% Hero Left | 25% Vertical Gallery Right]'
                  : '[Option B: 75% Hero Top | 25% Horizontal Gallery Bottom]'}
              </span>
            </div>

            <button
              onClick={enterFullscreen}
              className="text-brand-orange hover:text-orange-400 flex items-center gap-1 font-semibold transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen Preview</span>
            </button>
          </div>

          {/* 16:9 Canvas Viewport */}
          <div className="w-full max-w-6xl aspect-[16/9] max-h-[86vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 ring-1 ring-white/10 relative bg-black">
            <PresentationScreen isEmbeddedPreview={true} />
          </div>
        </main>
      </div>
    </div>
  );
};
