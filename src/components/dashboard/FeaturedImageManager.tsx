import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Pin, Upload, Check, Sparkles, Image as ImageIcon, ZoomIn, Maximize } from 'lucide-react';

export const FeaturedImageManager: React.FC = () => {
  const {
    images,
    featuredImage,
    setFeaturedImage,
    config,
    updateConfig,
    uploadImages
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadImages(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* 75% Hero Area Explanatory Notice */}
      <div className="p-3.5 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-orange-200 flex items-start gap-3 text-xs leading-relaxed">
        <Sparkles className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold text-brand-orange">Hero Image First (75% Dominant): </span>
          The selected image commands 75% of the total presentation screen. It is fixed and remains prominent at all times.
        </div>
      </div>

      {/* Active Featured Image Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current 75% Hero Slide
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-orange/20 text-brand-orange text-[11px] font-bold border border-brand-orange/30">
            <Pin className="w-3 h-3 fill-current" /> Fixed Hero
          </span>
        </div>

        {featuredImage ? (
          <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black shadow-inner">
            <img
              src={featuredImage.url}
              alt={featuredImage.name}
              className={`w-full h-full ${config.featuredFit === 'cover' ? 'object-cover' : 'object-contain'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-xs font-semibold text-white truncate drop-shadow">
                {featuredImage.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-slate-700 text-center text-slate-500 text-xs">
            No image selected. Click any slide below or upload new files.
          </div>
        )}

        {/* Aspect Ratio Fit Mode (Cover vs Contain) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400">Hero Fit Behavior:</span>
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => updateConfig({ featuredFit: 'cover' })}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                config.featuredFit === 'cover'
                  ? 'bg-brand-orange text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cover (Full 75% Fill)
            </button>
            <button
              onClick={() => updateConfig({ featuredFit: 'contain' })}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                config.featuredFit === 'contain'
                  ? 'bg-brand-orange text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Contain (Show Borders)
            </button>
          </div>
        </div>
      </div>

      {/* Upload Button */}
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-700 hover:border-brand-orange hover:bg-slate-800/60 text-slate-300 hover:text-brand-orange transition-all text-xs font-semibold"
        >
          <Upload className="w-4 h-4" />
          <span>Upload High-Res Slide(s)</span>
        </button>
      </div>

      {/* Select Hero Slide from Library */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Click Slide to Feature on 75% Hero Area ({images.length})
        </label>
        <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {images.map((img) => {
            const isSelected = featuredImage?.id === img.id;
            return (
              <div
                key={img.id}
                onClick={() => setFeaturedImage(img.id)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 aspect-video group ${
                  isSelected
                    ? 'ring-2 ring-brand-orange border-brand-orange scale-[1.02] shadow-lg shadow-brand-orange/20'
                    : 'border-slate-800 hover:border-slate-600 bg-slate-900/50'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {isSelected ? (
                  <div className="absolute top-2 right-2 bg-brand-orange text-white p-1 rounded-full shadow-lg">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2 py-1 rounded bg-black/80 text-[10px] font-semibold text-white backdrop-blur-sm">
                      Set As 75% Hero
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-[10px] font-medium text-slate-200 truncate">{img.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
