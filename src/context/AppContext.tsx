import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppImage, SessionConfig } from '../types';
import {
  getAllImagesFromDB,
  saveImageToDB,
  saveMultipleImagesToDB,
  deleteImageFromDB,
  getSettingsFromDB,
  saveSettingsToDB,
  DEFAULT_SLIDES,
  DEFAULT_CONFIG,
  fileToBase64
} from '../services/db';
import { useTimer } from '../hooks/useTimer';

interface AppContextType {
  // Config & State
  config: SessionConfig;
  updateConfig: (partial: Partial<SessionConfig>) => void;
  images: AppImage[];
  featuredImage: AppImage | null;
  galleryImages: AppImage[];
  isLoading: boolean;

  // Image Management
  setFeaturedImage: (id: string) => void;
  toggleGalleryImage: (id: string, inGallery: boolean) => void;
  reorderImages: (newImages: AppImage[]) => void;
  uploadImages: (files: FileList | File[]) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;

  // Timer
  timer: ReturnType<typeof useTimer>;

  // View / Presentation Mode
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  activeSidebarTab: 'timer' | 'featured' | 'gallery' | 'session' | 'appearance';
  setActiveSidebarTab: (tab: 'timer' | 'featured' | 'gallery' | 'session' | 'appearance') => void;
  isQuickControlsOpen: boolean;
  setIsQuickControlsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SessionConfig>(DEFAULT_CONFIG);
  const [images, setImages] = useState<AppImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'timer' | 'featured' | 'gallery' | 'session' | 'appearance'>('timer');
  const [isQuickControlsOpen, setIsQuickControlsOpen] = useState(false);

  // Initialize DB and Seed Data
  useEffect(() => {
    async function initData() {
      try {
        const [savedSettings, storedImages] = await Promise.all([
          getSettingsFromDB(),
          getAllImagesFromDB()
        ]);

        if (savedSettings) {
          setConfig(savedSettings);
        }

        if (storedImages && storedImages.length > 0) {
          // Sort by order or createdAt
          storedImages.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setImages(storedImages);
        } else {
          // Seed initial default slides
          await saveMultipleImagesToDB(DEFAULT_SLIDES);
          setImages(DEFAULT_SLIDES);
        }
      } catch (err) {
        console.error('Failed to load data from IndexedDB:', err);
        setImages(DEFAULT_SLIDES);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // Update Config
  const updateConfig = useCallback((partial: Partial<SessionConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...partial };
      saveSettingsToDB(next).catch(e => console.error('Save settings error:', e));
      return next;
    });
  }, []);

  // Initialize Timer Engine
  const timer = useTimer({
    initialDurationSeconds: config.mode === 'break' ? 15 * 60 : 45 * 60,
    soundAlert: config.soundAlert,
    soundProfile: config.soundProfile,
    soundVolume: config.soundVolume
  });

  // Keep timer alert options synced with config
  useEffect(() => {
    // soundAlert, soundProfile, and soundVolume are read in timer
  }, [config.soundAlert, config.soundProfile, config.soundVolume]);

  // Featured Image Resolution
  const featuredImage = images.find(img => img.id === config.featuredImageId) ||
    images.find(img => img.isFeatured) ||
    (images.length > 0 ? images[0] : null);

  // Gallery Images: only those with isInGallery = true
  const galleryImages = images.filter(img => img.isInGallery);

  // Set Featured Image
  const setFeaturedImage = useCallback((id: string) => {
    updateConfig({ featuredImageId: id });
    setImages(prev => {
      const updated = prev.map(img => ({
        ...img,
        isFeatured: img.id === id,
      }));
      saveMultipleImagesToDB(updated);
      return updated;
    });
  }, [updateConfig]);

  // Toggle Gallery Image
  const toggleGalleryImage = useCallback((id: string, inGallery: boolean) => {
    setImages(prev => {
      const updated = prev.map(img =>
        img.id === id ? { ...img, isInGallery: inGallery } : img
      );
      saveMultipleImagesToDB(updated);
      return updated;
    });
  }, []);

  // Reorder Images (drag and drop)
  const reorderImages = useCallback((newImages: AppImage[]) => {
    const updated = newImages.map((img, index) => ({
      ...img,
      order: index
    }));
    setImages(updated);
    saveMultipleImagesToDB(updated);
  }, []);

  // Upload Images
  const uploadImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newItems: AppImage[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) continue;
      const base64 = await fileToBase64(file);
      const newImg: AppImage = {
        id: 'img-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: base64,
        createdAt: Date.now(),
        size: file.size,
        isFeatured: false,
        isInGallery: true,
        order: images.length + newItems.length
      };
      newItems.push(newImg);
      await saveImageToDB(newImg);
    }

    setImages(prev => [...prev, ...newItems]);
  }, [images.length]);

  // Delete Image
  const deleteImage = useCallback(async (id: string) => {
    await deleteImageFromDB(id);
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // If deleted image was featured, pick another
      if (config.featuredImageId === id) {
        const nextFeatured = filtered[0]?.id || null;
        updateConfig({ featuredImageId: nextFeatured });
      }
      return filtered;
    });
  }, [config.featuredImageId, updateConfig]);

  // Reset to Defaults
  const resetToDefaults = useCallback(async () => {
    await saveMultipleImagesToDB(DEFAULT_SLIDES);
    await saveSettingsToDB(DEFAULT_CONFIG);
    setImages(DEFAULT_SLIDES);
    setConfig(DEFAULT_CONFIG);
    timer.resetTimer(15 * 60);
  }, [timer]);

  // Fullscreen Management
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Could not enter fullscreen:', err);
      // Fallback: Still mark isFullscreen for pure CSS full-window view
      setIsFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Could not exit fullscreen:', err);
    } finally {
      setIsFullscreen(false);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement || isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen, isFullscreen]);

  // Keyboard shortcut listener ('F' for Fullscreen, 'Space' for Play/Pause, 'Esc' to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          e.preventDefault();
          exitFullscreen();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (timer.timerState.isRunning && !timer.timerState.isPaused) {
          timer.pauseTimer();
        } else if (timer.timerState.isPaused) {
          timer.resumeTimer();
        } else {
          timer.startTimer();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        timer.resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, timer]);

  return (
    <AppContext.Provider
      value={{
        config,
        updateConfig,
        images,
        featuredImage,
        galleryImages,
        isLoading,
        setFeaturedImage,
        toggleGalleryImage,
        reorderImages,
        uploadImages,
        deleteImage,
        resetToDefaults,
        timer,
        isFullscreen,
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
        activeSidebarTab,
        setActiveSidebarTab,
        isQuickControlsOpen,
        setIsQuickControlsOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
