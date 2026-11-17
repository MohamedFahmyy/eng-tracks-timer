import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { PresentationScreen } from './components/presentation/PresentationScreen';
import { QuickControlsModal } from './components/presentation/QuickControlsModal';

const AppContent: React.FC = () => {
  const { isLoading, isFullscreen } = useApp();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#070A10] flex flex-col items-center justify-center text-slate-200">
        <div className="w-20 h-20 rounded-2xl bg-white/95 p-3 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 animate-pulse border border-white/30">
          <img src="/logo-emblem.png" alt="Engineering Tracks" className="w-full h-full object-contain" />
        </div>
        <p className="font-semibold text-sm tracking-wider uppercase text-slate-300">Engineering Tracks</p>
        <p className="text-xs text-slate-500 mt-1">Initializing Presenter Studio...</p>
      </div>
    );
  }

  return (
    <>
      {isFullscreen ? (
        <div className="w-screen h-screen overflow-hidden bg-black">
          <PresentationScreen isEmbeddedPreview={false} />
        </div>
      ) : (
        <DashboardLayout />
      )}
      <QuickControlsModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
