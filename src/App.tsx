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
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange to-red-600 flex items-center justify-center animate-pulse shadow-xl shadow-brand-orange/30 mb-4">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
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
