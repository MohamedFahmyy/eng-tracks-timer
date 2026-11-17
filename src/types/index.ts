export type PresentationMode = 'lecture' | 'break';

export type ThemeId = 'dark-midnight' | 'dark-obsidian' | 'deep-corporate' | 'light-modern';

export type PresentationLayout = 'vertical-right' | 'horizontal-bottom';

export type TimerPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export type TimerSize = 'compact' | 'normal' | 'large';

export type TimerGlass = 'glass-dark' | 'glass-frosted' | 'solid-dark' | 'minimal-ghost';

export type TimerColor = 'orange' | 'white' | 'amber' | 'emerald' | 'cyan';

export type GallerySpeedPreset = 'slow' | 'normal' | 'fast' | 'custom';

export type GallerySpacing = 'compact' | 'normal' | 'relaxed';

export type GalleryImageScale = 'compact' | 'normal' | 'large';

export interface AppImage {
  id: string;
  name: string;
  url: string; // Blob URL, static path, or base64
  data?: string;
  createdAt: number;
  size?: number;
  width?: number;
  height?: number;
  isFeatured?: boolean;
  isInGallery?: boolean;
  order?: number;
}

export interface TimerState {
  initialSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  overtimeSeconds: number;
  startTime: number | null;
  targetEndTime: number | null;
}

export interface SessionConfig {
  sessionTitle: string;
  subtitle: string;
  mode: PresentationMode;
  breakMessage: string;
  breakSubtitle: string;
  
  // Layout Options
  presentationLayout: PresentationLayout; // 'vertical-right' (75/25) or 'horizontal-bottom' (75/25)
  featuredImageId: string | null;
  featuredFit: 'cover' | 'contain';
  
  // Timer Overlay Customization
  showTimer: boolean;
  timerPosition: TimerPosition;
  timerSize: TimerSize;
  timerGlass: TimerGlass;
  timerColor: TimerColor;
  showProgress: boolean;
  soundAlert: boolean;
  soundProfile: 'melodic' | 'bell' | 'digital' | 'chime';
  soundVolume: number;
  showOvertime: boolean;

  // Secondary Gallery
  galleryAutoplay: boolean;
  gallerySpeedPreset: GallerySpeedPreset;
  galleryScrollSpeed: number; // seconds per full loop
  gallerySpacing: GallerySpacing; // 'compact' | 'normal' | 'relaxed'
  galleryImageScale: GalleryImageScale; // 'compact' | 'normal' | 'large'
  galleryTransitionDuration: number; // in seconds
  showGalleryLabels: boolean;
  theme: ThemeId;
}

export interface PresetOption {
  label: string;
  seconds: number;
  isBreakDefault?: boolean;
  isLectureDefault?: boolean;
}
