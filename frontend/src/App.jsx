import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewPage from './pages/OverviewPage';
import RankingsPage from './pages/RankingsPage';
import BattersPage from './pages/BattersPage';
import BowlersPage from './pages/BowlersPage';
import AllRoundersPage from './pages/AllRoundersPage';
import FieldersPage from './pages/FieldersPage';
import ComparisonPage from './pages/ComparisonPage';
import AuctionPage from './pages/AuctionPage';
import MethodologyPage from './pages/MethodologyPage';
import SubmissionDeckPage from './pages/SubmissionDeckPage';
import PlayerModal from './components/PlayerModal';
import { fetchOverview, fetchPlayer } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overviewData, setOverviewData] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview()
      .then(data => {
        setOverviewData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading overview data:', err);
        setLoading(false);
      });
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
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 antialiased selection:bg-royal-pink selection:text-white">
      {/* Main Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSelectPlayer={handleSelectPlayer}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-royal-pink/20 border-t-royal-pink animate-spin"></div>
            <p className="text-sm font-semibold text-slate-400">Loading Royal Scout AI Intelligence...</p>
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

            {activeTab === 'rankings' && (
              <RankingsPage 
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

            {activeTab === 'deck' && (
              <SubmissionDeckPage />
            )}
          </>
        )}
      </main>

      {/* Dedicated Player Dossier Modal */}
      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          onClose={handleCloseModal}
          onCompare={handleCompareFromModal}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-navy-800 bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold text-slate-300">ROYAL SCOUT AI</span>
            <span>•</span>
            <span>SuperRR Selector Season 2 • Round 1 Official Build</span>
          </div>

          <div className="flex items-center space-x-6">
            <span>IPL 2022–2026 & T20I Dataset</span>
            <span>Bayesian Sample Shrinkage</span>
            <span>Rajasthan Royals Auction Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

