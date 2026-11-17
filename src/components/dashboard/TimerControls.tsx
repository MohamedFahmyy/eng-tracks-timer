import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PresetOption, TimerPosition, TimerSize, TimerGlass, TimerColor } from '../../types';
import { playTimerFinishSound } from '../../services/sound';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Music,
  Move,
  Maximize2,
  Palette,
  Eye,
  Sliders
} from 'lucide-react';

const PRESETS: PresetOption[] = [
  { label: '5 Min', seconds: 5 * 60 },
  { label: '10 Min', seconds: 10 * 60 },
  { label: '15 Min', seconds: 15 * 60, isBreakDefault: true },
  { label: '20 Min', seconds: 20 * 60 },
  { label: '30 Min', seconds: 30 * 60 },
  { label: '45 Min', seconds: 45 * 60, isLectureDefault: true },
  { label: '60 Min', seconds: 60 * 60 },
];

export const TimerControls: React.FC = () => {
  const { timer, config, updateConfig } = useApp();
  const { timerState, startTimer, pauseTimer, resumeTimer, resetTimer, setDuration, adjustTime } = timer;
  const { initialSeconds, remainingSeconds, isRunning, isPaused } = timerState;

  const [customHours, setCustomHours] = useState(Math.floor(initialSeconds / 3600));
  const [customMins, setCustomMins] = useState(Math.floor((initialSeconds % 3600) / 60));
  const [customSecs, setCustomSecs] = useState(initialSeconds % 60);

  const applyCustomDuration = () => {
    const total = (Number(customHours) || 0) * 3600 + (Number(customMins) || 0) * 60 + (Number(customSecs) || 0);
    if (total > 0) {
      setDuration(total, false);
    }
  };

  const handleTestSound = () => {
    playTimerFinishSound(config.soundProfile, config.soundVolume);
  };

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* 1. Timer Overlay Position & Styling (Critical Image-First Feature) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Move className="w-4 h-4 text-brand-orange" />
            <span>Corner Overlay Position</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showTimer}
              onChange={(e) => updateConfig({ showTimer: e.target.checked })}
              className="accent-brand-orange"
            />
            <span>Show Timer</span>
          </label>
        </div>

        {/* Position Grid Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'top-left', label: 'Top-Left' },
            { id: 'top-right', label: 'Top-Right (Default)' },
            { id: 'bottom-left', label: 'Bottom-Left' },
            { id: 'bottom-right', label: 'Bottom-Right' },
          ].map((pos) => (
            <button
              key={pos.id}
              onClick={() => updateConfig({ timerPosition: pos.id as TimerPosition })}
              className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all border text-center ${
                config.timerPosition === pos.id
                  ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>

        {/* Size & Color & Glass Styling */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-1.5">Timer Overlay Size:</span>
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              {(['compact', 'normal', 'large'] as TimerSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateConfig({ timerSize: sz })}
                  className={`flex-1 py-1 text-center rounded capitalize font-medium transition-colors ${
                    config.timerSize === sz ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1.5">Digits Color:</span>
            <select
              value={config.timerColor}
              onChange={(e) => updateConfig({ timerColor: e.target.value as TimerColor })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-orange"
            >
              <option value="orange">Brand Orange</option>
              <option value="white">Clean White</option>
              <option value="amber">Warm Amber</option>
              <option value="emerald">Emerald Green</option>
              <option value="cyan">Tech Cyan</option>
            </select>
          </div>
        </div>

        {/* Glass transparency style */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400">Overlay Glass Style:</span>
          <select
            value={config.timerGlass}
            onChange={(e) => updateConfig({ timerGlass: e.target.value as TimerGlass })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-orange"
          >
            <option value="glass-dark">Dark Glass (High Contrast)</option>
            <option value="glass-frosted">Frosted Glass</option>
            <option value="solid-dark">Solid Carbon Background</option>
            <option value="minimal-ghost">Minimalist Ghost</option>
          </select>
        </div>
      </div>

      {/* 2. Main Action Controls */}
      <div className="flex items-center gap-2">
        {isRunning && !isPaused ? (
          <button
            onClick={pauseTimer}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
          >
            <Pause className="w-5 h-5 fill-current" />
            <span>Pause Timer</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={resumeTimer}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume Timer</span>
          </button>
        ) : (
          <button
            onClick={() => startTimer()}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-orange to-red-600 hover:from-brand-orangeHover hover:to-red-700 text-white font-bold text-sm transition-all shadow-lg shadow-brand-orange/30 active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Timer</span>
          </button>
        )}

        <button
          onClick={() => resetTimer()}
          title="Reset Timer"
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-md"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Quick Adjustments */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span>Quick Adjustments</span>
          <span className="text-[11px] font-mono text-slate-500">Live Adjustment</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => adjustTime(60)}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" /> 1 min
          </button>
          <button
            onClick={() => adjustTime(300)}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" /> 5 min
          </button>
          <button
            onClick={() => adjustTime(-60)}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Minus className="w-3.5 h-3.5 text-rose-400" /> 1 min
          </button>
          <button
            onClick={() => adjustTime(-300)}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Minus className="w-3.5 h-3.5 text-rose-400" /> 5 min
          </button>
        </div>
      </div>

      {/* 4. Duration Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Preset Durations
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset) => {
            const isActive = initialSeconds === preset.seconds && !isRunning;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setDuration(preset.seconds, false);
                  setCustomHours(Math.floor(preset.seconds / 3600));
                  setCustomMins(Math.floor((preset.seconds % 3600) / 60));
                  setCustomSecs(preset.seconds % 60);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20 scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Duration Input */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-orange" />
          <span>Custom Duration</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Hours</span>
            <input
              type="number"
              min="0"
              max="23"
              value={customHours}
              onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-center text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Minutes</span>
            <input
              type="number"
              min="0"
              max="59"
              value={customMins}
              onChange={(e) => setCustomMins(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-center text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Seconds</span>
            <input
              type="number"
              min="0"
              max="59"
              value={customSecs}
              onChange={(e) => setCustomSecs(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-center text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>
        <button
          onClick={applyCustomDuration}
          className="w-full mt-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
        >
          Set Custom Duration
        </button>
      </div>

      {/* 6. Sound Settings */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.soundAlert ? (
              <Volume2 className="w-4 h-4 text-brand-orange" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-xs font-semibold text-slate-300">Sound Alert at Finish</span>
          </div>
          <input
            type="checkbox"
            checked={config.soundAlert}
            onChange={(e) => updateConfig({ soundAlert: e.target.checked })}
            className="accent-brand-orange cursor-pointer"
          />
        </div>

        {config.soundAlert && (
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Chime Tone:</span>
              <div className="flex items-center gap-1.5">
                <select
                  value={config.soundProfile}
                  onChange={(e) => updateConfig({ soundProfile: e.target.value as any })}
                  className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-orange"
                >
                  <option value="melodic">Melodic 4-Tone</option>
                  <option value="bell">Executive Bell</option>
                  <option value="digital">Digital Beeps</option>
                </select>
                <button
                  onClick={handleTestSound}
                  title="Test Sound Tone"
                  className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-orange text-xs font-medium flex items-center gap-1 border border-slate-700"
                >
                  <Music className="w-3 h-3" /> Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
