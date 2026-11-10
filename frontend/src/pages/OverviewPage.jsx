import React, { useState } from 'react';
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
  Award,
  Users,
  Target,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import SituationSimulator from '../components/SituationSimulator';
import PlayerImage from '../components/PlayerImage';

export default function OverviewPage({ overviewData, onSelectPlayer, setActiveTab }) {
  const stats = overviewData?.stats || {};
  const topBatters = overviewData?.top10_batters?.slice(0, 5) || [];
  const topBowlers = overviewData?.top10_bowlers?.slice(0, 5) || [];

  // Curated spotlight of leading pressure performers across departments
  const marqueeLeaders = [
    {
      id: 3644,
      name: "Kuldeep Yadav",
      role: "Left-Arm Wrist Spinner",
      team: "India / Delhi Capitals",
      pri: 88.34,
      highlight: "6.51 Pressure Econ • 10.55 Avg",
      tag: "#1 Overall Bowler",
      color: "border-royal-gold text-royal-gold"
    },
    {
      id: 37052,
      name: "Naman Dhir",
      role: "Aggressive Top-Order Striker",
      team: "Mumbai Indians",
      pri: 81.95,
      highlight: "201.6 SR • +57.7 SR Delta",
      tag: "#1 Batting Striker",
      color: "border-royal-pink text-royal-pink"
    },
    {
      id: 8661,
      name: "Matheesha Pathirana",
      role: "Specialist Death Pacer",
      team: "Chennai Super Kings",
      pri: 73.40,
      highlight: "8.29 Death Econ • 44 Wickets",
      tag: "Premier Death Spearhead",
      color: "border-blue-500 text-blue-400"
    },
    {
      id: 4708,
      name: "Rinku Singh",
      role: "Clutch Chase Finisher",
      team: "Kolkata Knight Riders",
      pri: 73.16,
      highlight: "934 Pressure Runs • 172.3 SR",
      tag: "#1 Chase Closer",
      color: "border-emerald-500 text-emerald-400"
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-navy-900 to-navy-950 dark:from-navy-950 dark:via-navy-900 dark:to-navy-850 border border-slate-200 dark:border-navy-700/80 p-8 sm:p-12 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-royal-pink/20 via-royal-blue/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-royal-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-pink/20 border border-royal-pink/40 text-royal-pink text-xs font-bold tracking-wide">
            <Crown className="w-3.5 h-3.5 text-royal-gold" />
            <span>Rajasthan Royals Cricket Intelligence • IPL 2027</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
            Find the Players Who Deliver <br />
            <span className="bg-gradient-to-r from-royal-pink via-pink-400 to-royal-gold bg-clip-text text-transparent">
              Under Pressure
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-3xl">
            Some players produce impressive aggregate numbers in routine situations, but falter when matches tighten. 
            <strong className="text-white font-semibold"> ROYAL SCOUT AI </strong> reconstructs ball-by-ball match states across 
            <span className="text-royal-gold font-bold"> 200,999 deliveries </span> and 883 matches (IPL & T20Is 2022–2026) 
            to isolate high-pressure match situations, compute the statistically validated 
            <strong className="text-royal-pink font-semibold"> Pressure Reliability Index (PRI)</strong>, and empower smarter auction decisions for Rajasthan Royals.
          </p>

          {/* Quick CTA row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('auction')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow transition-all"
            >
              <Crown className="w-4 h-4 text-royal-gold" />
              <span>RR IPL 2027 Auction Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('clutch')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-all"
            >
              <Flame className="w-4 h-4 text-royal-gold" />
              <span>Clutch Performers Spotlight</span>
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"
            >
              <Users className="w-4 h-4 text-slate-300" />
              <span>Browse All Players</span>
            </button>
          </div>
        </div>

        {/* Global Dataset Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Deliveries Processed</span>
            <span className="text-2xl font-display font-extrabold text-white tabular">
              {stats.total_deliveries ? stats.total_deliveries.toLocaleString() : '200,999'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Delivery-level reconstruction</span>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Matches Evaluated</span>
            <span className="text-2xl font-display font-extrabold text-royal-gold tabular">
              {stats.total_matches || 883}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">401 IPL • 482 T20I Matches</span>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">High Pressure Deliveries</span>
            <span className="text-2xl font-display font-extrabold text-royal-pink tabular">
              {stats.high_pressure_pct || 19.55}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">39,289 clutch balls (P ≥ 60)</span>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Players Evaluated</span>
            <span className="text-2xl font-display font-extrabold text-white tabular">
              {stats.total_players || 811}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Bayesian sample shrinkage</span>
          </div>
        </div>
      </div>

      {/* Featured Section: Most Reliable Under Pressure */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-royal-pink tracking-widest block">
              Elite Reliability Index
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white">
              Most Reliable Players Under Pressure
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('players')}
            className="text-xs font-semibold text-royal-pink hover:underline flex items-center space-x-1"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marqueeLeaders.map(player => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer && onSelectPlayer(player.id)}
              className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-navy-850 hover:border-royal-pink/50 border border-slate-200 dark:border-navy-750 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <PlayerImage
                    playerId={player.id}
                    name={player.name}
                    role={player.role}
                    size="md"
                    showBadge={true}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-750 text-slate-700 dark:text-slate-300 inline-block mb-1">
                      {player.tag}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-royal-pink transition-colors leading-tight">
                      {player.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {player.role}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-lg text-royal-pink font-mono block leading-none">
                    {player.pri}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mt-1">
                    PRI Index
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 text-xs">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Key Pressure Metric</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{player.highlight}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-navy-750">
                <span className="text-slate-400 text-[11px]">{player.team}</span>
                <span className="text-royal-pink font-bold group-hover:translate-x-1 transition-transform inline-flex items-center text-xs">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Match Situation Simulator */}
      <SituationSimulator />

      {/* Top Batters & Bowlers Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Batters */}
        <div className="royal-glass-card rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-sm space-y-4 bg-white dark:bg-navy-850">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-700">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-royal-pink" />
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Top Batters Under Pressure (BPRI)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('batters')}
              className="text-xs font-semibold text-royal-pink hover:underline flex items-center space-x-1 transition-all"
            >
              <span>View All Batters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topBatters.map((b, idx) => (
              <div 
                key={b.striker_id}
                onClick={() => onSelectPlayer && onSelectPlayer(b.striker_id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-navy-900/80 hover:bg-slate-100 dark:hover:bg-navy-750 border border-slate-200 dark:border-navy-750 hover:border-royal-pink/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 ${
                    idx === 0 ? 'bg-royal-gold text-navy-950 font-black' :
                    idx === 1 ? 'bg-slate-300 text-navy-950 font-black' :
                    idx === 2 ? 'bg-amber-600 text-white font-black' : 'bg-slate-200 dark:bg-navy-750 text-slate-700 dark:text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <PlayerImage
                    playerId={b.striker_id}
                    name={b.striker_name}
                    role="Batter"
                    size="sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-royal-pink transition-colors">
                      {b.striker_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {b.p_balls} balls • {b.p_runs} runs • Avg {b.p_avg.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular">{b.p_sr.toFixed(1)} SR</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tabular">(+{b.delta_sr.toFixed(1)})</span>
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
        <div className="royal-glass-card rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-sm space-y-4 bg-white dark:bg-navy-850">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-700">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-5 h-5 text-royal-blue dark:text-royal-cyan" />
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Top Bowlers Under Pressure (BoPRI)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('bowlers')}
              className="text-xs font-semibold text-royal-blue dark:text-royal-cyan hover:underline flex items-center space-x-1 transition-all"
            >
              <span>View All Bowlers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topBowlers.map((b, idx) => (
              <div 
                key={b.bowler_id}
                onClick={() => onSelectPlayer && onSelectPlayer(b.bowler_id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-navy-900/80 hover:bg-slate-100 dark:hover:bg-navy-750 border border-slate-200 dark:border-navy-750 hover:border-royal-blue/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 ${
                    idx === 0 ? 'bg-royal-gold text-navy-950 font-black' :
                    idx === 1 ? 'bg-slate-300 text-navy-950 font-black' :
                    idx === 2 ? 'bg-amber-600 text-white font-black' : 'bg-slate-200 dark:bg-navy-750 text-slate-700 dark:text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <PlayerImage
                    playerId={b.bowler_id}
                    name={b.bowler_name}
                    role="Bowler"
                    size="sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-royal-blue dark:group-hover:text-royal-cyan transition-colors">
                      {b.bowler_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {b.p_balls} balls • {b.p_wkts} wkts • Avg {b.p_avg.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular">{b.p_econ.toFixed(2)} Econ</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tabular">({b.delta_econ > 0 ? `+${b.delta_econ.toFixed(1)}` : b.delta_econ.toFixed(1)})</span>
                  </div>
                  <span className="text-[11px] font-black text-royal-blue dark:text-royal-cyan tabular">
                    BoPRI: {b.bopri}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Rajasthan Royals Auction Decision Support Teaser */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-royal-pink/15 via-slate-100 to-royal-blue/10 dark:from-royal-pink/20 dark:via-navy-850 dark:to-navy-900 border border-royal-pink/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-royal-pink text-xs font-bold uppercase tracking-widest">
              <Crown className="w-4 h-4 text-royal-gold" />
              <span>Rajasthan Royals Auction Strategy • IPL 2027</span>
            </div>
            <h3 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              Targeted Squad Strengthening Based on Clutch Telemetry
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              To build an enduring championship roster, Rajasthan Royals must not buy generic statistics. 
              Our auction intelligence shortlists the exact profiles RR needs to win playoff finishes:
              <strong className="text-slate-900 dark:text-white"> Matheesha Pathirana / Arshdeep Singh </strong> (Death Overs Yorking),
              <strong className="text-slate-900 dark:text-white"> Kuldeep Yadav / Varun Chakravarthy </strong> (Middle-Overs Spin Choke), and
              <strong className="text-slate-900 dark:text-white"> Rinku Singh / Shashank Singh </strong> (Composed Chase Closers).
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
