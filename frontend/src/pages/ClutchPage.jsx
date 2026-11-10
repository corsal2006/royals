import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Target, 
  Crosshair, 
  ShieldAlert, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Crown, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import PlayerImage from '../components/PlayerImage';
import FifaPlayerCard from '../components/FifaPlayerCard';
import { fetchClutchRankings } from '../services/api';

export default function ClutchPage({ onSelectPlayer }) {
  const [clutchData, setClutchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('death_bowlers'); // death_bowlers, death_batters, chase_closers, crisis_anchors
  const [viewMode, setViewMode] = useState('fifa'); // 'fifa' | 'compact'

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchClutchRankings()
      .then(data => {
        setClutchData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching clutch rankings:", err);
        setError(err.message || "Failed to connect to the pressure analytics engine.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-pink"></div>
        <span className="text-xs font-semibold text-slate-500 animate-pulse">Loading Clutch Telemetry...</span>
      </div>
    );
  }

  if (error || !clutchData) {
    return (
      <div className="royal-glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-navy-700 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">Unable to Load Clutch Spotlight</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {error || "Could not retrieve situational clutch performers from the server."}
        </p>
        <button
          onClick={loadData}
          className="px-6 py-2 rounded-xl text-xs font-bold bg-royal-pink text-white shadow-royal-glow hover:bg-royal-pink-hover transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'death_bowlers', label: 'Death Overs Bowlers (17–20)', icon: <Target className="w-4 h-4" /> },
    { id: 'death_batters', label: 'Death Overs Finishers (17–20)', icon: <Flame className="w-4 h-4" /> },
    { id: 'chase_closers', label: 'High-RRR Chase Closers', icon: <Zap className="w-4 h-4" /> },
    { id: 'crisis_anchors', label: 'Collapse Crisis Anchors', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const currentList = clutchData[activeTab] || [];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="royal-glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-700 shadow-xl bg-white dark:bg-navy-850">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-pink/10 text-royal-pink border border-royal-pink/30 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>High-Pressure Tactical Specialists</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Clutch Performers Studio
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            Isolating the critical match situations that decide championships: death-overs execution (overs 17–20), 
            steep fourth-quarter chases, and early top-order collapse recoveries.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-royal-pink text-white shadow-royal-glow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-navy-800'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Context Callout */}
      <div className="p-4 rounded-2xl bg-royal-blue/5 dark:bg-navy-800/80 border border-royal-blue/20 dark:border-navy-700 flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
        <AlertCircle className="w-5 h-5 text-royal-blue dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {activeTab === 'death_bowlers' && (
            <span>
              <strong>Death Overs Bowling Benchmark:</strong> Bowlers evaluated across deliveries in overs 17–20 with minimum 60 pressure balls. 
              Sub-8.50 economy at the death is considered world-class under T20 scoring surges.
            </span>
          )}
          {activeTab === 'death_batters' && (
            <span>
              <strong>Death Overs Finishing Benchmark:</strong> Batters striking in overs 17–20. 
              Values exceeding 200.0 strike rate with consistent boundary percentage distinguish elite match-closers.
            </span>
          )}
          {activeTab === 'chase_closers' && (
            <span>
              <strong>Chasing Pressure Benchmark:</strong> Batters evaluated in Innings 2 chases with required run rate exceeding 9.5. 
              Ranked by strike rate and positive delta relative to normal baseline.
            </span>
          )}
          {activeTab === 'crisis_anchors' && (
            <span>
              <strong>Crisis Recovery Benchmark:</strong> Batters entering after top-order dismissals (30/3 or worse). 
              Ranked by average without squandering strike rate momentum.
            </span>
          )}
        </div>
      </div>

      {/* Section Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Crown className="w-5 h-5 text-royal-gold" />
            <span>Top Ranked Tactical Candidates ({currentList.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Grounded in delivery-level match telemetry (2022–2026).
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-navy-900 p-1 rounded-xl border border-slate-200 dark:border-navy-750">
          <button
            onClick={() => setViewMode('fifa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'fifa'
                ? 'bg-royal-pink text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            FIFA Cards View
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'compact'
                ? 'bg-royal-pink text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Compact Dossiers
          </button>
        </div>
      </div>

      {/* Roster Cards Grid */}
      {viewMode === 'fifa' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentList.map((p, index) => (
            <div key={p.player_id || index} className="relative">
              <div className="absolute -top-2.5 -left-2.5 z-20 w-7 h-7 rounded-full bg-slate-900 text-white border-2 border-amber-400 flex items-center justify-center font-display font-black text-xs shadow-md">
                #{index + 1}
              </div>
              <FifaPlayerCard 
                player={p} 
                onSelect={onSelectPlayer}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentList.map((p, index) => {
            const pid = p.player_id;
            return (
              <div
                key={pid || index}
                onClick={() => onSelectPlayer && onSelectPlayer(pid)}
                className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-navy-850 hover:border-royal-pink/50 border border-slate-200 dark:border-navy-750 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group"
              >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <PlayerImage
                      playerId={pid}
                      name={p.player_name}
                      imageUrl={p.image_url}
                      role={p.primary_role}
                      size="md"
                      showBadge={true}
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{index + 1}</span>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-royal-pink transition-colors leading-tight">
                          {p.player_name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {p.primary_role || 'Cricketer'}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                        {p.country || p.current_ipl_team || 'International'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-black text-lg text-royal-pink font-mono block leading-none">
                      {p.overall_pri || p.bpri || p.bopri}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mt-1">
                      PRI Index
                    </span>
                  </div>
                </div>

                {/* Specific Metric Strip */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 grid grid-cols-2 gap-2 text-xs">
                  {activeTab === 'death_bowlers' && p.bowling && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Death Economy</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">{p.bowling.death_p_econ}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pressure Wkts</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm font-mono">{p.bowling.p_wkts}</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'death_batters' && p.batting && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Death Strike Rate</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">{p.batting.death_p_sr}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pressure Runs</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm font-mono">{p.batting.p_runs}</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'chase_closers' && p.batting && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Chase SR</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">{p.batting.chase_p_sr}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Clutch SR Delta</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">+{p.batting.delta_sr}</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'crisis_anchors' && p.batting && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pressure Average</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">{p.batting.p_avg}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Strike Rate</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm font-mono">{p.batting.p_sr}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-750 text-xs">
                <span className="text-slate-400 text-[10px]">
                  Sample: {p.batting ? p.batting.p_balls : p.bowling?.p_balls} balls
                </span>
                <span className="text-royal-pink font-bold group-hover:translate-x-1 transition-transform inline-flex items-center text-xs">
                  Inspect Dossier &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}

