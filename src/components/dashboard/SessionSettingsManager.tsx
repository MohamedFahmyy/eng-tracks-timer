import React from 'react';
import { useApp } from '../../context/AppContext';
import { PresentationMode } from '../../types';
import { GraduationCap, Coffee, MessageSquare, Tag, Sparkles } from 'lucide-react';

const BREAK_MESSAGE_PRESETS = [
  { message: "Enjoy Your Break", sub: "The session will resume shortly. Please be back on time." },
  { message: "15-Minute Coffee Break", sub: "Grab a drink and refresh. See you in a few minutes!" },
  { message: "استراحة قصيرة - Coffee Break", sub: "المحاضرة ستستأنف بعد قليل - يرجى العودة في الموعد" },
  { message: "Lunch & Prayer Break", sub: "Session will resume at the scheduled time." },
  { message: "Q&A & Discussion Break", sub: "Feel free to post your questions in the chat." }
];

export const SessionSettingsManager: React.FC = () => {
  const { config, updateConfig, timer } = useApp();

  const handleModeChange = (newMode: PresentationMode) => {
    updateConfig({ mode: newMode });
    // Adjust timer duration to standard default if not running
    if (!timer.timerState.isRunning) {
      timer.setDuration(newMode === 'break' ? 15 * 60 : 45 * 60, false);
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* 1. Presentation Mode Switcher */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Active Presentation Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleModeChange('lecture')}
            className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border transition-all text-center ${
              config.mode === 'lecture'
                ? 'bg-brand-orange/15 border-brand-orange text-brand-orange shadow-lg shadow-brand-orange/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-6 h-6" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Lecture Mode</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Session countdown & course banners</div>
            </div>
          </button>

          <button
            onClick={() => handleModeChange('break')}
            className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border transition-all text-center ${
              config.mode === 'break'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Break Mode</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Relaxing countdown & break banner</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Lecture Mode Configuration */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-orange uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Lecture Titles & Details</span>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Session Title (English or Arabic)
          </label>
          <input
            type="text"
            value={config.sessionTitle}
            onChange={(e) => updateConfig({ sessionTitle: e.target.value })}
            placeholder="e.g. PMI-RMP: Risk Management Professional"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Subtitle / Topic / Instructor Name
          </label>
          <input
            type="text"
            value={config.subtitle}
            onChange={(e) => updateConfig({ subtitle: e.target.value })}
            placeholder="e.g. Engineering Tracks | Dr. Eng. Amr Talat"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      {/* 3. Break Mode Configuration */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Coffee className="w-4 h-4" />
          <span>Break Screen Messages</span>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Break Banner Heading
          </label>
          <input
            type="text"
            value={config.breakMessage}
            onChange={(e) => updateConfig({ breakMessage: e.target.value })}
            placeholder="e.g. Enjoy Your Break"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Break Subtitle / Instructions
          </label>
          <input
            type="text"
            value={config.breakSubtitle}
            onChange={(e) => updateConfig({ breakSubtitle: e.target.value })}
            placeholder="e.g. The session will resume shortly. Please be back on time."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Quick Break Presets */}
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Quick Break Message Suggestions
          </span>
          <div className="space-y-1.5">
            {BREAK_MESSAGE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => updateConfig({ breakMessage: p.message, breakSubtitle: p.sub })}
                className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors text-xs text-slate-300"
              >
                <div className="font-semibold text-emerald-300 truncate">{p.message}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
