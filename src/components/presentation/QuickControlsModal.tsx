import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimerControls } from '../dashboard/TimerControls';
import { FeaturedImageManager } from '../dashboard/FeaturedImageManager';
import { GalleryManager } from '../dashboard/GalleryManager';
import { SessionSettingsManager } from '../dashboard/SessionSettingsManager';
import { ThemeCustomizer } from '../dashboard/ThemeCustomizer';
import { X, Clock, Pin, Layers, Sliders, Palette } from 'lucide-react';

export const QuickControlsModal: React.FC = () => {
  const {
    isQuickControlsOpen,
    setIsQuickControlsOpen,
    activeSidebarTab,
    setActiveSidebarTab
  } = useApp();

  if (!isQuickControlsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl max-h-[85vh] bg-[#0E131F] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0A0E17]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-orange" />
            <h2 className="font-bold text-sm text-white">Presenter Quick Controls</h2>
          </div>
          <button
            onClick={() => setIsQuickControlsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-2 bg-[#0B0F19] border-b border-slate-800 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveSidebarTab('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSidebarTab === 'timer'
                ? 'bg-brand-orange text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Timer
          </button>
          <button
            onClick={() => setActiveSidebarTab('featured')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSidebarTab === 'featured'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pin className="w-3.5 h-3.5" /> Featured
          </button>
          <button
            onClick={() => setActiveSidebarTab('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSidebarTab === 'gallery'
                ? 'bg-sky-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Gallery
          </button>
          <button
            onClick={() => setActiveSidebarTab('session')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSidebarTab === 'session'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Session
          </button>
          <button
            onClick={() => setActiveSidebarTab('appearance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSidebarTab === 'appearance'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Theme
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {activeSidebarTab === 'timer' && <TimerControls />}
          {activeSidebarTab === 'featured' && <FeaturedImageManager />}
          {activeSidebarTab === 'gallery' && <GalleryManager />}
          {activeSidebarTab === 'session' && <SessionSettingsManager />}
          {activeSidebarTab === 'appearance' && <ThemeCustomizer />}
        </div>
      </div>
    </div>
  );
};
