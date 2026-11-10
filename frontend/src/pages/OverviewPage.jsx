import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Crosshair, 
  Crown, 
  ShieldAlert, 
  Layers, 
  TrendingUp, 
  ArrowRight, 
  Download, 
  Sparkles,
  Zap,
  BarChart3,
  Award
} from 'lucide-react';
import SituationSimulator from '../components/SituationSimulator';

export default function OverviewPage({ overviewData, onSelectPlayer, setActiveTab }) {
  const stats = overviewData?.stats || {};
  const topBatters = overviewData?.top10_batters?.slice(0, 5) || [];
  const topBowlers = overviewData?.top10_bowlers?.slice(0, 5) || [];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-850 to-navy-900 border border-navy-700/80 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-royal-pink/15 via-royal-blue/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-royal-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-pink/15 border border-royal-pink/30 text-royal-pink text-xs font-bold tracking-wide">
            <Crown className="w-3.5 h-3.5 text-royal-gold" />
            <span>SuperRR Selector Season 2 • Official Round 1 Hackathon Build</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
            Identify the Most Reliable <br />
            <span className="bg-gradient-to-r from-royal-pink via-pink-400 to-royal-gold bg-clip-text text-transparent">
              Players Under Pressure
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-3xl">
            Some players thrive when the game is on the line. Others struggle to deliver. 
            <strong className="text-white font-semibold"> ROYAL SCOUT AI </strong> reconstructs match contexts across 
            <span className="text-royal-gold font-bold"> 200,999 delivery-level records </span> and 883 matches (IPL & T20Is 2022–2026) 
            to isolate high-pressure match situations, calculate the transparent 
            <strong className="text-royal-pink font-semibold"> Pressure Reliability Index (PRI)</strong>, and identify the definitive clutch targets Rajasthan Royals should back at the IPL 2027 auction.
          </p>

          {/* Quick CTA row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('rankings')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow transition-all"
            >
              <Trophy className="w-4 h-4 text-royal-gold" />
              <span>Explore Official Top 10 Lists</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('auction')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-navy-800 hover:bg-navy-750 text-slate-200 border border-royal-blue/40 shadow-sm transition-all"
            >
              <Crown className="w-4 h-4 text-royal-gold" />
              <span>RR IPL 2027 Auction Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('deck')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-slate-300 border border-navy-700 transition-all"
            >
              <Award className="w-4 h-4 text-royal-gold" />
              <span>Judge Submission Walkthrough</span>
            </button>
          </div>
        </div>

        {/* Global Dataset Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-navy-800/80">
          <div className="bg-navy-900/60 p-4 rounded-xl border border-navy-750">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Total Deliveries</span>
            <span className="text-2xl font-display font-extrabold text-white tabular">
              {stats.total_deliveries ? stats.total_deliveries.toLocaleString() : '200,999'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Chronologically reconstructed</span>
          </div>

          <div className="bg-navy-900/60 p-4 rounded-xl border border-navy-750">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Matches Evaluated</span>
            <span className="text-2xl font-display font-extrabold text-white tabular">
              {stats.total_matches || 883}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">401 IPL • 482 T20I Matches</span>
          </div>

          <div className="bg-navy-900/60 p-4 rounded-xl border border-navy-750">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">High Pressure Deliveries</span>
            <span className="text-2xl font-display font-extrabold text-royal-pink tabular">
              {stats.high_pressure_pct || 19.55}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{stats.high_pressure_balls?.toLocaleString() || '39,289'} clutch balls (P ≥ 60)</span>
          </div>

          <div className="bg-navy-900/60 p-4 rounded-xl border border-navy-750">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Players Profiled</span>
            <span className="text-2xl font-display font-extrabold text-royal-gold tabular">
              {stats.total_players || 811}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">With Bayesian sample weighting</span>
          </div>
        </div>
      </div>

      {/* Interactive Match Situation Simulator */}
      <SituationSimulator />

      {/* Top 5 Batters & Bowlers Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Batters */}
        <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-700">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-royal-pink" />
              <h3 className="font-display font-bold text-lg text-white">
                Top Batters Under Pressure (BPRI)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('batters')}
              className="text-xs font-semibold text-royal-pink hover:text-white flex items-center space-x-1 transition-all"
            >
              <span>View All Batters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topBatters.map((b, idx) => (
              <div 
                key={b.striker_id}
                onClick={() => onSelectPlayer && onSelectPlayer(b.striker_id)}
                className="flex items-center justify-between p-3 rounded-xl bg-navy-850/80 hover:bg-navy-750 border border-navy-750 hover:border-royal-pink/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                    idx === 0 ? 'bg-royal-gold text-navy-950 font-black' :
                    idx === 1 ? 'bg-slate-300 text-navy-950 font-black' :
                    idx === 2 ? 'bg-amber-600 text-white font-black' : 'bg-navy-750 text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-royal-pink transition-colors">
                      {b.striker_name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {b.p_balls}b • {b.p_runs} runs • Avg {b.p_avg.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <span className="text-xs font-bold text-royal-gold tabular">{b.p_sr.toFixed(1)} SR</span>
                    <span className="text-[10px] text-emerald-400 font-bold tabular">(+{b.delta_sr.toFixed(1)})</span>
                  </div>
                  <span className="text-[11px] font-black text-royal-pink tabular">
                    BPRI: {b.bpri}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Bowlers */}
        <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-700">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-5 h-5 text-royal-cyan" />
              <h3 className="font-display font-bold text-lg text-white">
                Top Bowlers Under Pressure (BoPRI)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('bowlers')}
              className="text-xs font-semibold text-royal-cyan hover:text-white flex items-center space-x-1 transition-all"
            >
              <span>View All Bowlers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topBowlers.map((b, idx) => (
              <div 
                key={b.bowler_id}
                onClick={() => onSelectPlayer && onSelectPlayer(b.bowler_id)}
                className="flex items-center justify-between p-3 rounded-xl bg-navy-850/80 hover:bg-navy-750 border border-navy-750 hover:border-royal-cyan/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                    idx === 0 ? 'bg-royal-gold text-navy-950 font-black' :
                    idx === 1 ? 'bg-slate-300 text-navy-950 font-black' :
                    idx === 2 ? 'bg-amber-600 text-white font-black' : 'bg-navy-750 text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-royal-cyan transition-colors">
                      {b.bowler_name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {b.p_balls}b • {b.p_wkts} wkts • Avg {b.p_avg.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <span className="text-xs font-bold text-royal-gold tabular">{b.p_econ.toFixed(2)} Econ</span>
                    <span className="text-[10px] text-emerald-400 font-bold tabular">({b.delta_econ > 0 ? `+${b.delta_econ.toFixed(1)}` : b.delta_econ.toFixed(1)})</span>
                  </div>
                  <span className="text-[11px] font-black text-royal-cyan tabular">
                    BoPRI: {b.bopri}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Rajasthan Royals Auction Decision Support Teaser */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-royal-pink/20 via-navy-850 to-navy-900 border border-royal-pink/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-royal-gold text-xs font-bold uppercase tracking-widest">
              <Crown className="w-4 h-4" />
              <span>Rajasthan Royals Auction Strategy • IPL 2027</span>
            </div>
            <h3 className="text-2xl font-display font-extrabold text-white">
              Targeted Squad Strengthening Based on Clutch Data
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              To build a championship team, Rajasthan Royals must not buy generic statistics. 
              Our auction intelligence shortlists the exact profiles RR needs to win playoff finishes:
              <strong className="text-white"> Matheesha Pathirana / Arshdeep Singh </strong> (Death Overs Yorking),
              <strong className="text-white"> Kuldeep Yadav / Varun Chakravarthy </strong> (Middle-Overs Spin Choke), and
              <strong className="text-white"> Rinku Singh / Shashank Singh </strong> (Composed Chase Closers).
            </p>
          </div>

          <button
            onClick={() => setActiveTab('auction')}
            className="px-6 py-3 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow transition-all whitespace-nowrap self-start md:self-center flex items-center space-x-2"
          >
            <span>Open RR Auction Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

