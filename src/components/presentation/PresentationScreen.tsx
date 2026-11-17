import React from 'react';
import { useApp } from '../../context/AppContext';
import { CornerTimerOverlay } from './CornerTimerOverlay';
import { AutoScrollGallery } from './AutoScrollGallery';
import { FloatingPresenterOverlay } from './FloatingPresenterOverlay';

interface PresentationScreenProps {
  isEmbeddedPreview?: boolean;
}

export const PresentationScreen: React.FC<PresentationScreenProps> = ({ isEmbeddedPreview = false }) => {
  const {
    config,
    featuredImage,
  } = useApp();

  const isVertical = config.presentationLayout === 'vertical-right';

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      
      {/* Dynamic 75% / 25% Split Layout */}
      <div className={`w-full h-full flex ${isVertical ? 'flex-row' : 'flex-col'}`}>
        
        {/* ============================================================== */}
        {/* HERO FEATURED IMAGE: STRICTLY 75% OF THE PRESENTATION SCREEN   */}
        {/* ============================================================== */}
        <section
          className={`relative overflow-hidden bg-black flex items-center justify-center ${
            isVertical ? 'w-[75%] h-full' : 'w-full h-[75%]'
          }`}
        >
          {featuredImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Optional ambient backdrop blur if contain mode is chosen */}
              {config.featuredFit === 'contain' && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-105 pointer-events-none"
                  style={{ backgroundImage: `url(${featuredImage.url})` }}
                />
              )}

              {/* Main Featured Image with smooth transition */}
              <img
                key={featuredImage.id}
                src={featuredImage.url}
                alt={featuredImage.name}
                className={`w-full h-full animate-fade-in transition-all duration-500 ${
                  config.featuredFit === 'contain' ? 'object-contain' : 'object-cover'
                }`}
                loading="eager"
              />

              {/* Discreet Topic Title Badge (Opposite of timer, minimal digital signage header) */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none max-w-lg">
                <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                    <h1 className="text-xs sm:text-sm font-bold truncate">
                      {config.mode === 'break' ? config.breakMessage : config.sessionTitle}
                    </h1>
                  </div>
                  {config.subtitle && (
                    <p className="text-[10px] text-slate-300 truncate mt-0.5 ml-4">
                      {config.mode === 'break' ? config.breakSubtitle : config.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Small, Elegant Corner Overlay Countdown Timer */}
              <CornerTimerOverlay />
            </div>
          ) : (
            <div className="text-slate-500 text-sm">No featured image selected</div>
          )}
        </section>

        {/* ============================================================== */}
        {/* SECONDARY GALLERY: STRICTLY 25% (RIGHT COLUMN OR BOTTOM ROW)   */}
        {/* ============================================================== */}
        <section
          className={`relative overflow-hidden ${
            isVertical ? 'w-[25%] h-full' : 'w-full h-[25%]'
          }`}
        >
          <AutoScrollGallery layout={config.presentationLayout} />
        </section>
      </div>

      {/* Floating Presenter HUD (Auto-hiding, surfaces gently on mouse move in fullscreen) */}
      {!isEmbeddedPreview && <FloatingPresenterOverlay />}
    </div>
  );
};
