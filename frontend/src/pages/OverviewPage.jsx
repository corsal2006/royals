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
import FifaPlayerCard from '../components/FifaPlayerCard';

export default function OverviewPage({ overviewData, onSelectPlayer, setActiveTab }) {
  const [showAll10, setShowAll10] = useState(true);
  const stats = overviewData?.stats || {};
  const topBatters = showAll10 
    ? (overviewData?.top10_batters || []) 
    : (overviewData?.top10_batters?.slice(0, 5) || []);
  const topBowlers = showAll10 
    ? (overviewData?.top10_bowlers || []) 
    : (overviewData?.top10_bowlers?.slice(0, 5) || []);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {marqueeLeaders.map(m => {
            const playerObj = {
              player_id: m.id,
              player_name: m.name,
              primary_role: m.role,
              current_team: m.team,
              country: m.id === 8661 ? 'Sri Lanka' : 'India',
              overall_pri: m.pri,
              image_url: `/players/${m.id}.jpg`,
              batting: m.id === 4708 ? { p_runs: 934, p_sr: 172.3, p_avg: 44.5, delta_sr: 45.2, p_bound_pct: 23.8, p_balls: 542 } :
                       m.id === 37052 ? { p_runs: 488, p_sr: 201.6, p_avg: 32.5, delta_sr: 57.7, p_bound_pct: 26.5, p_balls: 242 } : null,
              bowling: m.id === 3644 ? { p_wkts: 36, p_econ: 6.51, p_dot_pct: 46.2, p_bound_prev: 86.4, death_p_econ: 7.20, p_sr: 11.2, p_balls: 350 } :
                       m.id === 8661 ? { p_wkts: 44, p_econ: 8.47, p_dot_pct: 42.5, p_bound_prev: 81.2, death_p_econ: 8.29, p_sr: 10.2, p_balls: 400 } : null
            };

            return (
              <FifaPlayerCard
                key={m.id}
                player={playerObj}
                onSelect={onSelectPlayer}
                onCompare={() => setActiveTab('compare')}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Match Situation Simulator */}
      <SituationSimulator />

      {/* Top 10 Batters & Top 10 Bowlers Pressure Rankings */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-navy-750">
          <div>
            <span className="text-xs uppercase font-bold text-royal-pink tracking-widest block">
              Official Pressure Reliability Rankings
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white">
              Top 10 Batters & Top 10 Bowlers Under Pressure
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAll10(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showAll10
                  ? 'bg-royal-pink text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Top 10 (Full Rankings)
            </button>
            <button
              onClick={() => setShowAll10(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !showAll10
                  ? 'bg-royal-pink text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Top 5 (Compact)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Batters */}
        <div className="royal-glass-card rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-sm space-y-4 bg-white dark:bg-navy-850">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-700">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-royal-pink" />
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {showAll10 ? 'Top 10' : 'Top 5'} Batters Under Pressure (BPRI)
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
                {showAll10 ? 'Top 10' : 'Top 5'} Bowlers Under Pressure (BoPRI)
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
