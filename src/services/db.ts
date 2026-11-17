import { AppImage, SessionConfig } from '../types';

const DB_NAME = 'eng_tracks_timer_db';
const DB_VERSION = 1;
const STORE_IMAGES = 'images';
const STORE_SETTINGS = 'settings';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveImageToDB(image: AppImage): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    const store = tx.objectStore(STORE_IMAGES);
    const req = store.put(image);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveMultipleImagesToDB(images: AppImage[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    const store = tx.objectStore(STORE_IMAGES);
    images.forEach(img => store.put(img));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllImagesFromDB(): Promise<AppImage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const store = tx.objectStore(STORE_IMAGES);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteImageFromDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    const store = tx.objectStore(STORE_IMAGES);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveSettingsToDB(config: SessionConfig): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = tx.objectStore(STORE_SETTINGS);
    const req = store.put({ key: 'session_config', value: config });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getSettingsFromDB(): Promise<SessionConfig | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, 'readonly');
    const store = tx.objectStore(STORE_SETTINGS);
    const req = store.get('session_config');
    req.onsuccess = () => {
      resolve(req.result ? req.result.value : null);
    };
    req.onerror = () => reject(req.error);
  });
}

// Convert uploaded File to Base64 string for persistent storage
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Initial seed data using the real Engineering Tracks slides
export const DEFAULT_SLIDES: AppImage[] = [
  {
    id: 'seed-01-rmp-featured',
    name: 'PMI-RMP Risk Management Professional (Featured Slide)',
    url: '/sample-images/slide-01.jpg',
    createdAt: 1700000000001,
    isFeatured: true,
    isInGallery: false,
    order: 0
  },
  {
    id: 'seed-02-pfmp',
    name: 'PfMP Portfolio Management Professional',
    url: '/sample-images/slide-02.jpg',
    createdAt: 1700000000002,
    isFeatured: false,
    isInGallery: true,
    order: 1
  },
  {
    id: 'seed-03-pmi-cp-enroll',
    name: 'PMI-CP Construction Professional - Enroll Now',
    url: '/sample-images/slide-03.jpg',
    createdAt: 1700000000003,
    isFeatured: false,
    isInGallery: true,
    order: 2
  },
  {
    id: 'seed-04-pmi-cp-alt',
    name: 'PMI-CP Construction Professional (Overview)',
    url: '/sample-images/slide-04.jpg',
    createdAt: 1700000000004,
    isFeatured: false,
    isInGallery: true,
    order: 3
  },
  {
    id: 'seed-05-pmp-preview',
    name: 'Professional Course Showcase 05',
    url: '/sample-images/slide-05.jpg',
    createdAt: 1700000000005,
    isFeatured: false,
    isInGallery: true,
    order: 4
  },
  {
    id: 'seed-06-preview',
    name: 'Engineering Tracks Certification 06',
    url: '/sample-images/slide-06.jpg',
    createdAt: 1700000000006,
    isFeatured: false,
    isInGallery: true,
    order: 5
  },
  {
    id: 'seed-07-preview',
    name: 'Professional Diploma 07',
    url: '/sample-images/slide-07.jpg',
    createdAt: 1700000000007,
    isFeatured: false,
    isInGallery: true,
    order: 6
  },
  {
    id: 'seed-08-preview',
    name: 'PMI Authorized Training 08',
    url: '/sample-images/slide-08.jpg',
    createdAt: 1700000000008,
    isFeatured: false,
    isInGallery: true,
    order: 7
  },
  {
    id: 'seed-09-preview',
    name: 'Engineering Masterclass 09',
    url: '/sample-images/slide-09.jpg',
    createdAt: 1700000000009,
    isFeatured: false,
    isInGallery: true,
    order: 8
  },
  {
    id: 'seed-10-preview',
    name: 'Upcoming Live Tracks 10',
    url: '/sample-images/slide-10.jpg',
    createdAt: 1700000000010,
    isFeatured: false,
    isInGallery: true,
    order: 9
  },
  {
    id: 'seed-11-acp',
    name: 'PMI-ACP Agile Certified Practitioner',
    url: '/sample-images/slide-11.jpg',
    createdAt: 1700000000011,
    isFeatured: false,
    isInGallery: true,
    order: 10
  },
  {
    id: 'seed-12-preview',
    name: 'Student Community & Support 12',
    url: '/sample-images/slide-12.jpg',
    createdAt: 1700000000012,
    isFeatured: false,
    isInGallery: true,
    order: 11
  }
];

export const DEFAULT_CONFIG: SessionConfig = {
  sessionTitle: 'PMI-RMP: Risk Management Professional',
  subtitle: 'Engineering Tracks | Authorized Training Partner',
  mode: 'lecture',
  breakMessage: 'Enjoy Your Break',
  breakSubtitle: 'The session will resume shortly. Please be back on time.',
  
  // Image-First Layout (75% Main / 25% Gallery)
  presentationLayout: 'vertical-right',
  featuredImageId: 'seed-01-rmp-featured',
  featuredFit: 'cover',
  
  // Minimal Corner Overlay Timer
  showTimer: true,
  timerPosition: 'top-right',
  timerSize: 'compact',
  timerGlass: 'glass-dark',
  timerColor: 'orange',
  showProgress: true,
  soundAlert: true,
  soundProfile: 'melodic',
  soundVolume: 0.8,
  showOvertime: true,

  // Secondary Scrolling Gallery
  galleryAutoplay: true,
  gallerySpeedPreset: 'normal',
  galleryScrollSpeed: 25,
  gallerySpacing: 'normal',
  galleryImageScale: 'normal',
  galleryTransitionDuration: 0.6,
  showGalleryLabels: true,
  theme: 'dark-obsidian'
};
