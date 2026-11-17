import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GallerySpeedPreset, GallerySpacing, GalleryImageScale } from '../../types';
import {
  Upload,
  LayoutTemplate,
  Trash2,
  MoveUp,
  MoveDown,
  Pin,
  Columns,
  Rows,
  Gauge,
  Sliders,
  Maximize,
  Split,
  Timer
} from 'lucide-react';

export const GalleryManager: React.FC = () => {
  const {
    images,
    featuredImage,
    setFeaturedImage,
    reorderImages,
    uploadImages,
    deleteImage,
    config,
    updateConfig,
    timer
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadImages(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...images];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    reorderImages(newItems);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newItems = [...images];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    reorderImages(newItems);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...images];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    reorderImages(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSpeedPreset = (preset: GallerySpeedPreset) => {
    let speed = config.galleryScrollSpeed;
    if (preset === 'slow') speed = 45;
    if (preset === 'normal') speed = 25;
    if (preset === 'fast') speed = 12;

    updateConfig({
      gallerySpeedPreset: preset,
      galleryScrollSpeed: speed
    });
  };

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* 1. MANDATORY TWO GALLERY LAYOUT OPTIONS */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <LayoutTemplate className="w-4 h-4 text-brand-orange" />
          <span>Screen Gallery Layout (75% / 25%)</span>
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Option A: Vertical Right */}
          <button
            onClick={() => updateConfig({ presentationLayout: 'vertical-right' })}
            className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
              config.presentationLayout === 'vertical-right'
                ? 'bg-brand-orange/15 border-brand-orange text-white ring-1 ring-brand-orange shadow-lg shadow-brand-orange/10'
                : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <Columns className={`w-5 h-5 ${config.presentationLayout === 'vertical-right' ? 'text-brand-orange' : 'text-slate-400'}`} />
              {config.presentationLayout === 'vertical-right' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-orange text-white">Active</span>
              )}
            </div>
            <div className="text-xs font-bold text-white">Option A: Vertical</div>
            <div className="text-[11px] text-slate-400 mt-0.5">75% Hero Left • 25% Continuous Vertical Right</div>
          </button>

          {/* Option B: Horizontal Bottom */}
          <button
            onClick={() => updateConfig({ presentationLayout: 'horizontal-bottom' })}
            className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
              config.presentationLayout === 'horizontal-bottom'
                ? 'bg-brand-orange/15 border-brand-orange text-white ring-1 ring-brand-orange shadow-lg shadow-brand-orange/10'
                : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <Rows className={`w-5 h-5 ${config.presentationLayout === 'horizontal-bottom' ? 'text-brand-orange' : 'text-slate-400'}`} />
              {config.presentationLayout === 'horizontal-bottom' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-orange text-white">Active</span>
              )}
            </div>
            <div className="text-xs font-bold text-white">Option B: Horizontal</div>
            <div className="text-[11px] text-slate-400 mt-0.5">75% Hero Top • 25% Continuous Horizontal Bottom</div>
          </button>
        </div>
      </div>

      {/* 2. TIMER SYNCHRONIZATION STATUS BADGE */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-brand-orange" />
          <span className="text-slate-300 font-semibold">Timer Sync State:</span>
        </div>
        <div>
          {timer.timerState.isRunning && !timer.timerState.isPaused && !timer.timerState.isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Moving (Timer Running)
            </span>
          ) : timer.timerState.isPaused ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Frozen at Exact Position
            </span>
          ) : timer.timerState.isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
              Stopped (Time's Up)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
              Static (Ready to Start)
            </span>
          )}
        </div>
      </div>

      {/* 3. CONTINUOUS ANIMATION SETTINGS */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
            <Gauge className="w-4 h-4 text-sky-400" />
            <span>Continuous Movement Speed</span>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400">
            {config.galleryScrollSpeed}s / loop
          </span>
        </div>

        {/* Speed Presets */}
        <div className="grid grid-cols-4 gap-1.5">
          {(['slow', 'normal', 'fast', 'custom'] as GallerySpeedPreset[]).map((p) => {
            const isActive = config.gallerySpeedPreset === p;
            return (
              <button
                key={p}
                onClick={() => handleSpeedPreset(p)}
                className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Custom Speed Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Fast (5s)</span>
            <span>Smooth Continuous Duration</span>
            <span>Slow (60s)</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={config.galleryScrollSpeed}
            onChange={(e) => updateConfig({
              galleryScrollSpeed: parseInt(e.target.value) || 25,
              gallerySpeedPreset: 'custom'
            })}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        {/* Image Spacing & Size */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
              <Split className="w-3.5 h-3.5 text-slate-400" />
              <span>Image Spacing:</span>
            </span>
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              {(['compact', 'normal', 'relaxed'] as GallerySpacing[]).map((sp) => (
                <button
                  key={sp}
                  onClick={() => updateConfig({ gallerySpacing: sp })}
                  className={`flex-1 py-1 text-center rounded capitalize font-medium transition-colors ${
                    config.gallerySpacing === sp ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5 text-slate-400" />
              <span>Image Scale:</span>
            </span>
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              {(['compact', 'normal', 'large'] as GalleryImageScale[]).map((sc) => (
                <button
                  key={sc}
                  onClick={() => updateConfig({ galleryImageScale: sc })}
                  className={`flex-1 py-1 text-center rounded capitalize font-medium transition-colors ${
                    config.galleryImageScale === sc ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Autoplay & Labels Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-300">Continuous Auto-Scrolling Enabled:</span>
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

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-300">Show Image Titles in Strip:</span>
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
      </div>

      {/* 4. UPLOAD NEW SLIDES */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-orange to-red-600 hover:from-brand-orangeHover hover:to-red-700 text-white font-bold text-xs transition-all shadow-md shadow-brand-orange/20 active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image(s) from Computer</span>
        </button>
      </div>

      {/* 5. SLIDES LIBRARY */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">All Slides ({images.length})</span>
          <span className="text-[11px] text-slate-500">Click any slide to make it Featured</span>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {images.map((img, index) => {
            const isFeatured = featuredImage?.id === img.id;

            return (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => setFeaturedImage(img.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isFeatured
                    ? 'bg-brand-orange/15 border-brand-orange ring-1 ring-brand-orange shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-black/60 border border-white/10">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {isFeatured && (
                    <div className="absolute top-0.5 right-0.5 bg-brand-orange p-0.5 rounded-full shadow" title="Featured Slide">
                      <Pin className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isFeatured ? 'text-brand-orange font-bold' : 'text-slate-200'}`}>
                    {img.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isFeatured ? '★ Fixed Hero (75% Screen)' : 'Continuous Scrolling Gallery'}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-20"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === images.length - 1}
                      title="Move Down"
                      className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-20"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => deleteImage(img.id)}
                    title="Delete Image"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
