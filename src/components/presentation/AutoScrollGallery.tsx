import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PresentationLayout } from '../../types';
import { Pin, Layers, Pause, Play } from 'lucide-react';

interface AutoScrollGalleryProps {
  layout: PresentationLayout;
}

export const AutoScrollGallery: React.FC<AutoScrollGalleryProps> = ({ layout }) => {
  const {
    images,
    featuredImage,
    setFeaturedImage,
    config,
    timer
  } = useApp();

  const isVertical = layout === 'vertical-right';
  const { isRunning, isPaused, isCompleted } = timer.timerState;
  const resetCount = timer.resetCount ?? 0;

  // Determine animation play state directly synchronized with the timer
  // Table requirements:
  // - Not Started: Static (paused at initial position)
  // - Running: Continuous movement (running)
  // - Paused: Immediately freeze at current position (paused)
  // - Resumed: Continue from exactly the same position (running)
  // - Reset: Return to initial position and stop (paused at 0)
  // - Completed: Stop moving (paused)
  const isAnimationRunning = isRunning && !isPaused && !isCompleted && config.galleryAutoplay;
  const animationPlayState = isAnimationRunning ? 'running' : 'paused';

  // Construct a seamless infinite loop track with zero blank spaces
  // Repeat items to guarantee at least 10 items in base set, then duplicate for infinite 50% translation
  const displayItems = useMemo(() => {
    if (!images || images.length === 0) return [];
    let base = [...images];
    while (base.length < 8) {
      base = [...base, ...images];
    }
    // Duplicate exactly once for seamless 50% marquee translation
    return [...base, ...base];
  }, [images]);

  // Spacing styling
  const getGapStyle = () => {
    switch (config.gallerySpacing) {
      case 'compact':
        return isVertical ? 'gap-2' : 'gap-2';
      case 'relaxed':
        return isVertical ? 'gap-5' : 'gap-5';
      case 'normal':
      default:
        return isVertical ? 'gap-3.5' : 'gap-3.5';
    }
  };

  // Size styling for cards
  const getImageCardSize = () => {
    if (isVertical) {
      switch (config.galleryImageScale) {
        case 'compact':
          return 'w-full aspect-[16/9] max-h-24';
        case 'large':
          return 'w-full aspect-[16/9] max-h-48';
        case 'normal':
        default:
          return 'w-full aspect-[16/9] max-h-36';
      }
    } else {
      switch (config.galleryImageScale) {
        case 'compact':
          return 'h-[80%] aspect-[16/9] min-w-[150px] max-w-[200px]';
        case 'large':
          return 'h-[92%] aspect-[16/9] min-w-[280px] max-w-[380px]';
        case 'normal':
        default:
          return 'h-[86%] aspect-[16/9] min-w-[200px] max-w-[280px]';
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-500 bg-[#0A0E17]">
        <Layers className="w-6 h-6 mb-2 opacity-40" />
        <span className="text-xs">No gallery images available</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full bg-[#080C14] group select-none overflow-hidden flex ${
        isVertical ? 'flex-col border-l border-white/10' : 'flex-row border-t border-white/10 items-center'
      }`}
    >
      {/* Discreet Status Pill / Controls */}
      <div className={`z-20 flex items-center justify-between px-3 py-1.5 bg-black/75 backdrop-blur-md border border-white/10 ${
        isVertical ? 'w-full border-x-0 border-t-0 border-b' : 'absolute top-2 left-3 rounded-lg shadow-lg'
      }`}>
        <div className="flex items-center gap-1.5 text-slate-300 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
          <Layers className="w-3 h-3 text-brand-orange" />
          <span>Continuous Gallery</span>
          <span className={`w-1.5 h-1.5 rounded-full ml-0.5 ${
            isAnimationRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
          }`} />
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <span>{isAnimationRunning ? 'MOVING' : isPaused ? 'FROZEN' : 'STATIC'}</span>
        </div>
      </div>

      {/* Infinite Seamless Scrolling Track (Timer-Synchronized) */}
      {/* key={resetCount} guarantees clean return to initial position when timer is reset */}
      <div
        key={resetCount}
        className={`w-full h-full flex p-2 sm:p-3 ${
          isVertical
            ? 'flex-col gallery-marquee-v'
            : 'flex-row gallery-marquee-h items-center'
        } ${getGapStyle()}`}
        style={{
          ['--marquee-duration' as any]: `${config.galleryScrollSpeed || 25}s`,
          animationPlayState: animationPlayState,
        }}
      >
        {displayItems.map((img, idx) => {
          const isSelected = featuredImage?.id === img.id;

          return (
            <div
              key={`${img.id}-${idx}`}
              onClick={() => setFeaturedImage(img.id)}
              className={`relative flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border transition-all duration-200 group/item shadow-md ${getImageCardSize()} ${
                isSelected
                  ? 'ring-2 ring-brand-orange border-brand-orange shadow-brand-orange/40 scale-[1.02] z-10'
                  : 'border-white/10 hover:border-white/30 hover:scale-[1.01] opacity-80 hover:opacity-100 bg-slate-900'
              }`}
            >
              {/* Thumbnail Image */}
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                loading="lazy"
                draggable={false}
              />

              {/* Glass Dark Overlay & Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2 pointer-events-none">
                <div className="flex justify-end">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-orange text-white text-[9px] font-bold shadow uppercase tracking-wider">
                      <Pin className="w-2.5 h-2.5 fill-current" /> Active
                    </span>
                  ) : (
                    <span className="opacity-0 group-hover/item:opacity-100 transition-opacity px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] text-white">
                      Click to Feature
                    </span>
                  )}
                </div>

                {config.showGalleryLabels && (
                  <p className="text-[10px] font-medium text-white truncate drop-shadow">
                    {img.name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
