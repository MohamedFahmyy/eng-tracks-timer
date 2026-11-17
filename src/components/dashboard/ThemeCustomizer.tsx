import React from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeId } from '../../types';
import { Palette, Eye, RotateCcw, ShieldAlert, Sparkles, Check } from 'lucide-react';

const THEMES: { id: ThemeId; name: string; desc: string; colors: string[] }[] = [
  {
    id: 'dark-obsidian',
    name: 'Engineering Tracks Obsidian',
    desc: 'Deep carbon background with signature orange accents',
    colors: ['#0B0F19', '#FF5A00', '#1A2234']
  },
  {
    id: 'deep-corporate',
    name: 'Executive Indigo & Violet',
    desc: 'Rich deep violet gradient with high-contrast text',
    colors: ['#1E0D33', '#8B5CF6', '#371561']
  },
  {
    id: 'dark-midnight',
    name: 'Midnight Slate',
    desc: 'Pure dark slate designed for projector legibility',
    colors: ['#090D16', '#38BDF8', '#1E293B']
  },
  {
    id: 'light-modern',
    name: 'Modern Corporate Light',
    desc: 'Clean bright palette for well-lit training rooms',
    colors: ['#F8FAFC', '#FF5A00', '#E2E8F0']
  }
];

export const ThemeCustomizer: React.FC = () => {
  const { config, updateConfig, resetToDefaults } = useApp();

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all settings and restore original Engineering Tracks slides?")) {
      await resetToDefaults();
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Theme Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-brand-orange" />
          <span>Color & Atmosphere Themes</span>
        </label>
        <div className="space-y-2.5">
          {THEMES.map((th) => {
            const isSelected = config.theme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => updateConfig({ theme: th.id })}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-brand-orange ring-1 ring-brand-orange shadow-md shadow-brand-orange/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Swatches preview */}
                  <div className="flex -space-x-1.5 overflow-hidden p-0.5">
                    {th.colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{th.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-orange" />}
                    </div>
                    <div className="text-[11px] text-slate-400">{th.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Display Toggles */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Eye className="w-4 h-4 text-sky-400" />
          <span>Display & Visibility Controls</span>
        </div>

        {/* Show Countdown Timer */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-300">Show Countdown Timer:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showTimer}
              onChange={(e) => updateConfig({ showTimer: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange"></div>
          </label>
        </div>

        {/* Show Timer Progress Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-300">Show Timer Progress Indicator:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showProgress}
              onChange={(e) => updateConfig({ showProgress: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange"></div>
          </label>
        </div>

        {/* Show Gallery Labels */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-300">Show Slide Titles in Gallery:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showGalleryLabels}
              onChange={(e) => updateConfig({ showGalleryLabels: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange"></div>
          </label>
        </div>

        {/* Gallery Autoplay */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-300">Auto-Scroll Secondary Gallery:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.galleryAutoplay}
              onChange={(e) => updateConfig({ galleryAutoplay: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
          </label>
        </div>
      </div>

      {/* 3. Factory Reset */}
      <div className="pt-2">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-800/60 transition-colors text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Default Slides & Settings</span>
        </button>
      </div>
    </div>
  );
};
