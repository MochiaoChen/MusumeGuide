import React, { useState } from 'react';
import LiveGuide from './components/LiveGuide';
import CulturePage from './components/CulturePage';
import MuseumIntro from './components/MuseumIntro';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <MuseumIntro />;
      case ViewState.GUIDE:
        return <LiveGuide onNavigate={setCurrentView} />;
      case ViewState.CULTURE:
        return <CulturePage />;
      default:
        return <MuseumIntro />;
    }
  };

  return (
    // Adaptive Container
    // Mobile: Full screen (h-full w-full)
    // Desktop: Phone simulator style (md:max-w-[420px] md:h-[85vh])
    <div className="w-full h-full md:max-w-[420px] md:h-[90vh] md:max-h-[850px] bg-white shadow-2xl relative flex flex-col md:rounded-[2.5rem] md:overflow-hidden md:border-[8px] md:border-stone-800 transition-all duration-300 ring-1 ring-stone-900/5">
      
      {/* Top Bar - Sticky */}
      <header className="h-14 bg-uibe-red text-white flex items-center justify-between px-5 shadow-md z-30 shrink-0 bg-opacity-95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-serif font-bold border border-white/20 shadow-inner">
                UIBE
            </div>
            <span className="font-serif tracking-wide font-medium text-base">博物馆导游</span>
        </div>
        <button 
            className={`text-[10px] px-3 py-1.5 rounded-full font-bold shadow-sm transition-all transform active:scale-95 ${currentView === ViewState.GUIDE ? 'bg-white text-uibe-red' : 'bg-uibe-gold text-uibe-red'}`}
            onClick={() => setCurrentView(ViewState.GUIDE)}
        >
            {currentView === ViewState.GUIDE ? '正在通话' : 'AI 导游'}
        </button>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-stone-50">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-[4.5rem] bg-white border-t border-stone-200 flex justify-around items-center px-2 shrink-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentView(ViewState.HOME)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:bg-stone-50 transition-colors ${currentView === ViewState.HOME ? 'text-uibe-red' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={currentView === ViewState.HOME ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="text-[10px] font-medium">首页</span>
        </button>

        <button 
          onClick={() => setCurrentView(ViewState.GUIDE)}
          className="relative group w-full h-full flex flex-col items-center justify-end pb-2"
        >
          <div className={`absolute bottom-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform ${currentView === ViewState.GUIDE ? 'bg-uibe-red text-white scale-110 ring-4 ring-white -translate-y-1' : 'bg-white text-stone-400 border border-stone-200 group-hover:text-uibe-red group-hover:-translate-y-1'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
             </svg>
          </div>
          <span className={`text-[10px] font-medium transition-colors ${currentView === ViewState.GUIDE ? 'text-uibe-red' : 'text-stone-400'}`}>智能导游</span>
        </button>

        <button 
          onClick={() => setCurrentView(ViewState.CULTURE)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:bg-stone-50 transition-colors ${currentView === ViewState.CULTURE ? 'text-uibe-red' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={currentView === ViewState.CULTURE ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span className="text-[10px] font-medium">传统文化</span>
        </button>
      </nav>
    </div>
  );
};

export default App;