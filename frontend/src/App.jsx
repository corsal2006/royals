import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewPage from './pages/OverviewPage';
import PlayersDirectoryPage from './pages/PlayersDirectoryPage';
import BattersPage from './pages/BattersPage';
import BowlersPage from './pages/BowlersPage';
import AllRoundersPage from './pages/AllRoundersPage';
import FieldersPage from './pages/FieldersPage';
import ClutchPage from './pages/ClutchPage';
import ComparisonPage from './pages/ComparisonPage';
import AuctionPage from './pages/AuctionPage';
import MethodologyPage from './pages/MethodologyPage';
import PlayerModal from './components/PlayerModal';
import ScoutingAssistant from './components/ScoutingAssistant';
import { fetchOverview, fetchPlayer } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overviewData, setOverviewData] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Dual-Theme System (Light & Dark Mode) — strictly defaults to Light Mode
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('royal_scout_theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('royal_scout_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loadOverview = () => {
    setLoading(true);
    setApiError(null);
    fetchOverview()
      .then(data => {
        setOverviewData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading overview data:', err);
        setApiError(err.message || 'Could not reach player intelligence API.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleSelectPlayer = (playerId) => {
    fetchPlayer(playerId)
      .then(p => setSelectedPlayer(p))
      .catch(err => console.error('Failed to load player:', err));
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
  };

  const handleCompareFromModal = (playerId) => {
    setSelectedPlayer(null);
    setActiveTab('compare');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSelectPlayer={handleSelectPlayer}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-royal-pink/20 border-t-royal-pink animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading Royal Scout AI Intelligence...
            </p>
          </div>
        ) : apiError && !overviewData && activeTab === 'overview' ? (
          <div className="royal-glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-navy-700 text-center max-w-xl mx-auto my-12 space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold">⚠️</span>
            </div>
            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">Connecting to Analytics Engine...</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {apiError}
            </p>
            <div className="pt-2">
              <button
                onClick={loadOverview}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow transition-all"
              >
                Retry Connection
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewPage 
                overviewData={overviewData} 
                onSelectPlayer={handleSelectPlayer}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'players' && (
              <PlayersDirectoryPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'batters' && (
              <BattersPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'bowlers' && (
              <BowlersPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'allrounders' && (
              <AllRoundersPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'fielders' && (
              <FieldersPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'clutch' && (
              <ClutchPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'compare' && (
              <ComparisonPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'auction' && (
              <AuctionPage 
                onSelectPlayer={handleSelectPlayer} 
              />
            )}

            {activeTab === 'methodology' && (
              <MethodologyPage />
            )}
          </>
        )}
      </main>

      {/* Embedded AI Scouting Assistant Widget */}
      <ScoutingAssistant onSelectPlayer={handleSelectPlayer} />

      {/* Dedicated Player Dossier Modal */}
      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          onClose={handleCloseModal}
          onCompare={handleCompareFromModal}
        />
      )}

      {/* Professional Brand Footer */}
      <footer className="border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-display font-black text-slate-900 dark:text-white">ROYAL SCOUT AI</span>
            <span>•</span>
            <span>IPL Player Intelligence & Auction Analytics</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Rajasthan Royals Auction Strategy</span>
            <span>200,999 Deliveries Processed</span>
            <span>Bayesian Shrinkage Applied</span>
            <span className="font-semibold text-royal-pink">IPL 2027</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
