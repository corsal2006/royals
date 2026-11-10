import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Crown, 
  Plus, 
  X, 
  Search, 
  Trophy, 
  Flame, 
  Crosshair, 
  TrendingUp, 
  Check, 
  Zap, 
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Swords,
  UserCheck,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import FifaPlayerCard from '../components/FifaPlayerCard';
import PlayerImage from '../components/PlayerImage';
import { fetchPlayers, fetchComparison } from '../services/api';

const PRESETS = [
  {
    name: "Clutch Finishers: Rinku vs Miller",
    ids: [4708, 1077],
    desc: "Match-closer shootout between India's designated finisher and South Africa's veteran"
  },
  {
    name: "Death Overs: Bumrah vs Pathirana",
    ids: [2933, 8661],
    desc: "Pace spearhead battle: Bumrah's immaculate execution vs Pathirana's sling yorkers"
  },
  {
    name: "Mystery Spin: Kuldeep vs Varun",
    ids: [3644, 6256],
    desc: "Wrist-spin choke duel: unreadable googlies vs finger-flick variations"
  },
  {
    name: "Power All-Rounders: Russell vs Stoinis",
    ids: [1318, 2639],
    desc: "Dual-threat impact: boundary firepower paired with clutch death overs"
  },
  {
    name: "Top-Order Strikers: Naman Dhir vs Patidar",
    ids: [37052, 5039],
    desc: "Aggressive powerplay acceleration and boundary conversion under pressure"
  }
];

export default function ComparisonPage({ onSelectPlayer }) {
  const [player1Id, setPlayer1Id] = useState(4708); // Default: Rinku Singh
  const [player2Id, setPlayer2Id] = useState(1077); // Default: David Miller
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [loading, setLoading] = useState(false);

  // Situation Tab Filter (like ICC's Test/ODI/T20I, but for match pressure situations)
  const [situationTab, setSituationTab] = useState('overall'); // overall, death, chase, crisis

  // Player Selection Modal State
  const [pickerSlot, setPickerSlot] = useState(null); // 1 or 2 or null
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load both players whenever IDs change
  useEffect(() => {
    if (player1Id && player2Id) {
      setLoading(true);
      fetchComparison([player1Id, player2Id])
        .then(res => {
          const list = res.players || [];
          setPlayer1(list.find(p => p.player_id === player1Id) || list[0]);
          setPlayer2(list.find(p => p.player_id === player2Id) || list[1]);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [player1Id, player2Id]);

  // Live player search for picker modal
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      fetchPlayers({ q: searchQuery.trim(), limit: 8 })
        .then(res => {
          setSearchResults(res.players || []);
          setIsSearching(false);
        })
        .catch(err => {
          console.error(err);
          setIsSearching(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const selectPlayerForSlot = (pid) => {
    if (pickerSlot === 1) setPlayer1Id(pid);
    if (pickerSlot === 2) setPlayer2Id(pid);
    setPickerSlot(null);
    setSearchQuery('');
  };

  // Determine winner for each attribute
  const p1Pri = Number(player1?.overall_pri || player1?.pri_score || 0);
  const p2Pri = Number(player2?.overall_pri || player2?.pri_score || 0);

  const p1Sr = Number(player1?.batting?.p_sr || (player1?.bowling ? (12 - player1.bowling.p_econ) * 15 : 0));
  const p2Sr = Number(player2?.batting?.p_sr || (player2?.bowling ? (12 - player2.bowling.p_econ) * 15 : 0));

  const p1Delta = Number(player1?.batting?.delta_sr || (player1?.bowling?.delta_econ ? player1.bowling.delta_econ * 10 : 0));
  const p2Delta = Number(player2?.batting?.delta_sr || (player2?.bowling?.delta_econ ? player2.bowling.delta_econ * 10 : 0));

  const p1Econ = player1?.bowling?.p_econ !== undefined ? Number(player1.bowling.p_econ) : 999;
  const p2Econ = player2?.bowling?.p_econ !== undefined ? Number(player2.bowling.p_econ) : 999;

  const p1Wkts = Number(player1?.bowling?.p_wkts || 0);
  const p2Wkts = Number(player2?.bowling?.p_wkts || 0);

  const p1Balls = Number((player1?.batting?.p_balls || 0) + (player1?.bowling?.p_balls || 0));
  const p2Balls = Number((player2?.batting?.p_balls || 0) + (player2?.bowling?.p_balls || 0));

  let p1Wins = [];
  let p2Wins = [];

  if (p1Pri > p2Pri) p1Wins.push('pri'); else if (p2Pri > p1Pri) p2Wins.push('pri');
  if (p1Sr > p2Sr) p1Wins.push('str'); else if (p2Sr > p1Sr) p2Wins.push('str');
  if (p1Delta > p2Delta) p1Wins.push('clu'); else if (p2Delta > p1Delta) p2Wins.push('clu');
  if (p1Econ < p2Econ && p1Econ !== 999) p1Wins.push('ecn'); else if (p2Econ < p1Econ && p2Econ !== 999) p2Wins.push('ecn');
  if (p1Balls > p2Balls) p1Wins.push('run'); else if (p2Balls > p1Balls) p2Wins.push('run');

  // Radar chart data
  const radarAxes = [
    { key: 'pri', label: 'Overall PRI' },
    { key: 'clutch', label: 'Clutch Delta' },
    { key: 'strike', label: 'Strike / Econ' },
    { key: 'volume', label: 'Sample Volume' },
    { key: 'consistency', label: 'Dot / Strangle' },
  ];

  const radarData = radarAxes.map(axis => {
    const row = { metric: axis.label };
    [player1, player2].filter(Boolean).forEach(p => {
      let val = 50;
      if (axis.key === 'pri') {
        val = p.overall_pri || p.bpri || p.bopri || 50;
      } else if (axis.key === 'clutch') {
        val = p.batting ? Math.min(100, Math.max(20, 50 + p.batting.delta_sr)) : 
              p.bowling ? Math.min(100, Math.max(20, 50 + p.bowling.delta_econ * 15)) : 50;
      } else if (axis.key === 'strike') {
        val = p.batting ? Math.min(100, (p.batting.p_sr / 200) * 100) :
              p.bowling ? Math.min(100, Math.max(20, (12 - p.bowling.p_econ) * 12)) : 50;
      } else if (axis.key === 'volume') {
        const b = (p.batting?.p_balls || 0) + (p.bowling?.p_balls || 0);
        val = Math.min(100, Math.max(30, (b / 500) * 100));
      } else if (axis.key === 'consistency') {
        val = p.batting ? Math.min(100, p.batting.p_bound_pct * 3) :
              p.bowling ? p.bowling.p_bound_prev : 50;
      }
      row[p.player_name] = Math.round(val);
    });
    return row;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* =========================================================================
          ICC-STYLE TOP HERO COMPARISON BANNER
          Deep Navy / Royal Banner with Slot 1, Center Metadata Spine, Slot 2
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070e28] via-[#09153d] to-[#040817] text-white border border-slate-700/60 shadow-2xl p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-royal-blue/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-pink/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Title & Quick Presets */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center space-x-2 text-royal-gold text-xs font-mono font-bold uppercase tracking-widest mb-1">
              <Swords className="w-3.5 h-3.5" />
              <span>OFFICIAL PRESSURE HEAD-TO-HEAD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
              SELECT PLAYERS TO COMPARE
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Side-by-side trading card showdown grounded in 200,999 delivery-level pressure match states.
            </p>
          </div>

          {/* Quick Presets Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mr-1">PRESETS:</span>
            {PRESETS.map((pr, idx) => (
              <button
                key={idx}
                onClick={() => { setPlayer1Id(pr.ids[0]); setPlayer2Id(pr.ids[1]); }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-royal-pink text-white transition-all border border-white/15 shadow-sm"
              >
                {pr.name}
              </button>
            ))}
          </div>
        </div>

        {/* ICC-Style Comparison Stage: Slot 1 | Center Column | Slot 2 */}
        <div className="relative z-10 pt-8 grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
          
          {/* SLOT 1 (PLAYER 1) */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-4">
            {player1 ? (
              <div className="relative flex flex-col items-center">
                <FifaPlayerCard 
                  player={player1} 
                  onSelect={onSelectPlayer}
                  winningStats={p1Wins}
                  showCompareBtn={false}
                />
                <button
                  onClick={() => setPickerSlot(1)}
                  className="mt-3 px-4 py-1.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-royal-pink text-white border border-white/20 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>CHANGE PLAYER 1</span>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => setPickerSlot(1)}
                className="w-64 h-80 rounded-3xl border-2 border-dashed border-white/20 hover:border-royal-pink flex flex-col items-center justify-center cursor-pointer transition-all bg-white/5 hover:bg-white/10"
              >
                <Plus className="w-12 h-12 text-slate-400 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">SELECT PLAYER 1</span>
              </div>
            )}
          </div>

          {/* CENTER METADATA SPINE (EXACTLY AS ON ICC) */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-4 text-center">
            
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-pink via-purple-600 to-royal-blue text-white font-display font-black text-lg flex items-center justify-center shadow-royal-glow border-2 border-white/30">
              VS
            </div>

            {/* Structured Attribute Spine */}
            <div className="w-full space-y-2 text-xs">
              
              <div className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-[11px] truncate">{player1?.age ? `${player1.age} yrs` : 'Verified Pro'}</span>
                <span className="text-[10px] uppercase font-mono font-bold text-royal-gold">AGE</span>
                <span className="font-bold text-slate-300 text-[11px] truncate">{player2?.age ? `${player2.age} yrs` : 'Verified Pro'}</span>
              </div>

              <div className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-[11px] truncate max-w-[90px]">{player1?.primary_role || 'Batter'}</span>
                <span className="text-[10px] uppercase font-mono font-bold text-royal-gold">ROLE</span>
                <span className="font-bold text-slate-300 text-[11px] truncate max-w-[90px]">{player2?.primary_role || 'Batter'}</span>
              </div>

              <div className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-[11px] truncate">{player1?.batting_style || 'RHB'}</span>
                <span className="text-[10px] uppercase font-mono font-bold text-royal-gold">BAT STYLE</span>
                <span className="font-bold text-slate-300 text-[11px] truncate">{player2?.batting_style || 'RHB'}</span>
              </div>

              <div className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-[11px] truncate max-w-[90px]">{player1?.bowling_style || 'None'}</span>
                <span className="text-[10px] uppercase font-mono font-bold text-royal-gold">BOWL STYLE</span>
                <span className="font-bold text-slate-300 text-[11px] truncate max-w-[90px]">{player2?.bowling_style || 'None'}</span>
              </div>

              <div className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-[11px] truncate max-w-[90px]">{player1?.current_ipl_team || 'IPL'}</span>
                <span className="text-[10px] uppercase font-mono font-bold text-royal-gold">FRANCHISE</span>
                <span className="font-bold text-slate-300 text-[11px] truncate max-w-[90px]">{player2?.current_ipl_team || 'IPL'}</span>
              </div>

              <div className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-[11px]">{player1?.country || 'India'}</span>
                <span className="text-[10px] uppercase font-mono font-bold text-royal-gold">COUNTRY</span>
                <span className="font-bold text-slate-300 text-[11px]">{player2?.country || 'India'}</span>
              </div>

            </div>

          </div>

          {/* SLOT 2 (PLAYER 2) */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-4">
            {player2 ? (
              <div className="relative flex flex-col items-center">
                <FifaPlayerCard 
                  player={player2} 
                  onSelect={onSelectPlayer}
                  winningStats={p2Wins}
                  showCompareBtn={false}
                />
                <button
                  onClick={() => setPickerSlot(2)}
                  className="mt-3 px-4 py-1.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-royal-pink text-white border border-white/20 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>CHANGE PLAYER 2</span>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => setPickerSlot(2)}
                className="w-64 h-80 rounded-3xl border-2 border-dashed border-white/20 hover:border-royal-pink flex flex-col items-center justify-center cursor-pointer transition-all bg-white/5 hover:bg-white/10"
              >
                <Plus className="w-12 h-12 text-slate-400 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">SELECT PLAYER 2</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* =========================================================================
          MATCH SITUATION TABS (ICC TEST / ODI / T20I EQUIVALENT IN PRESSURE CONTEXT)
          ========================================================================= */}
      <div className="flex border-b border-slate-200 dark:border-navy-750 bg-slate-100 dark:bg-navy-900/60 p-1.5 rounded-2xl overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'overall', label: 'Overall High Pressure (P ≥ 60)', icon: Sparkles },
          { id: 'death', label: 'Death Overs (17–20)', icon: Flame },
          { id: 'chase', label: 'High-RRR Chases (RRR > 9.5)', icon: Zap },
          { id: 'crisis', label: 'Top-Order Collapse Recovery', icon: ShieldCheck }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSituationTab(t.id)}
              className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                situationTab === t.id
                  ? 'bg-royal-pink text-white shadow-royal-glow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-navy-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          DIRECT STAT-BY-STAT METRIC BATTLE TABLE
          ========================================================================= */}
      <div className="overflow-x-auto rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-royal-gold" />
            <span>Head-to-Head Metric Edge Breakdown</span>
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Grounded in 2022–2026 match telemetry</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-navy-900/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-navy-750">
            <tr>
              <th className="py-3.5 px-4 w-48">Key Metric</th>
              <th className="py-3.5 px-4 text-right font-bold text-royal-pink">{player1?.player_name || 'Player 1'}</th>
              <th className="py-3.5 px-4 text-center font-bold text-royal-gold">Head-to-Head Edge</th>
              <th className="py-3.5 px-4 text-left font-bold text-royal-gold">{player2?.player_name || 'Player 2'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
            {/* PRI Score */}
            <tr className="bg-slate-50/50 dark:bg-navy-900/40">
              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Pressure Reliability Index (PRI)</td>
              <td className="py-3 px-4 text-right font-black text-royal-pink text-base tabular font-mono">{p1Pri}</td>
              <td className="py-3 px-4 text-center font-bold font-mono text-[11px]">
                {p1Pri > p2Pri ? (
                  <span className="text-royal-pink px-2 py-0.5 rounded bg-royal-pink/10">🏆 {player1?.player_name} (+{(p1Pri - p2Pri).toFixed(1)})</span>
                ) : p2Pri > p1Pri ? (
                  <span className="text-royal-gold px-2 py-0.5 rounded bg-amber-400/10">🏆 {player2?.player_name} (+{(p2Pri - p1Pri).toFixed(1)})</span>
                ) : (
                  <span className="text-slate-400">Equal</span>
                )}
              </td>
              <td className="py-3 px-4 text-left font-black text-royal-gold text-base tabular font-mono">{p2Pri}</td>
            </tr>

            {/* Pressure Strike Rate */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Strike Rate (Bat)</td>
              <td className="py-3 px-4 text-right tabular font-bold text-royal-gold font-mono">{player1?.batting ? `${player1.batting.p_sr}` : '—'}</td>
              <td className="py-3 px-4 text-center font-mono text-[11px]">
                {player1?.batting && player2?.batting ? (
                  player1.batting.p_sr > player2.batting.p_sr ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{((player1.batting.p_sr) - (player2.batting.p_sr)).toFixed(1)} SR Edge</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{((player2.batting.p_sr) - (player1.batting.p_sr)).toFixed(1)} SR Edge</span>
                  )
                ) : '—'}
              </td>
              <td className="py-3 px-4 text-left tabular font-bold text-royal-gold font-mono">{player2?.batting ? `${player2.batting.p_sr}` : '—'}</td>
            </tr>

            {/* Clutch Delta SR */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Clutch Delta SR (vs Normal)</td>
              <td className="py-3 px-4 text-right tabular font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {player1?.batting ? (player1.batting.delta_sr >= 0 ? `+${player1.batting.delta_sr}` : `${player1.batting.delta_sr}`) : '—'}
              </td>
              <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500">
                {player1?.batting && player2?.batting ? (
                  player1.batting.delta_sr > player2.batting.delta_sr ? `${player1.player_name} higher clutch surge` : `${player2.player_name} higher clutch surge`
                ) : '—'}
              </td>
              <td className="py-3 px-4 text-left tabular font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {player2?.batting ? (player2.batting.delta_sr >= 0 ? `+${player2.batting.delta_sr}` : `${player2.batting.delta_sr}`) : '—'}
              </td>
            </tr>

            {/* Pressure Economy Rate */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Economy Rate (Bowl)</td>
              <td className="py-3 px-4 text-right tabular font-bold text-royal-blue dark:text-cyan-400 font-mono">{player1?.bowling ? `${player1.bowling.p_econ}` : '—'}</td>
              <td className="py-3 px-4 text-center font-mono text-[11px] text-royal-blue dark:text-cyan-400 font-bold">
                {player1?.bowling && player2?.bowling ? (
                  player1.bowling.p_econ < player2.bowling.p_econ ? (
                    <span>-{((player2.bowling.p_econ) - (player1.bowling.p_econ)).toFixed(2)} tighter containment</span>
                  ) : (
                    <span>-{((player1.bowling.p_econ) - (player2.bowling.p_econ)).toFixed(2)} tighter containment</span>
                  )
                ) : '—'}
              </td>
              <td className="py-3 px-4 text-left tabular font-bold text-royal-blue dark:text-cyan-400 font-mono">{player2?.bowling ? `${player2.bowling.p_econ}` : '—'}</td>
            </tr>

            {/* Total Pressure Volume */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">High-Pressure Deliveries (Sample)</td>
              <td className="py-3 px-4 text-right tabular text-slate-900 dark:text-white font-bold font-mono">{p1Balls} balls</td>
              <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500">
                {p1Balls > p2Balls ? `${player1?.player_name} higher sample volume` : `${player2?.player_name} higher sample volume`}
              </td>
              <td className="py-3 px-4 text-left tabular text-slate-900 dark:text-white font-bold font-mono">{p2Balls} balls</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Radar Chart Visualizer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-royal-gold" />
          <span>Multi-Dimensional Clutch Radar Profile</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Comparing normalized performance across PRI, Clutch Elevation, Strike Prowess, Sample Volume, and Dot/Strangle control.
        </p>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#94A3B8" opacity={0.25} />
              <PolarAngleAxis dataKey="metric" stroke="#64748B" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748B" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderColor: '#1E293B', 
                  borderRadius: '12px',
                  color: '#FFFFFF' 
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              {[player1, player2].filter(Boolean).map((p, idx) => (
                <Radar
                  key={p.player_id}
                  name={p.player_name}
                  dataKey={p.player_name}
                  stroke={idx === 0 ? '#EA1A7F' : '#E2B714'}
                  fill={idx === 0 ? '#EA1A7F' : '#E2B714'}
                  fillOpacity={0.25}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE PLAYER PICKER MODAL (WHEN USER CLICKS CHANGE / SELECT PLAYER)
          ========================================================================= */}
      {pickerSlot !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setPickerSlot(null)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-700 shadow-2xl overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-800">
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                Select Player for Slot {pickerSlot}
              </h3>
              <button 
                onClick={() => setPickerSlot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search player by name, country, or IPL franchise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-royal-pink"
              />
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-800">
              {isSearching ? (
                <div className="p-8 text-center text-xs text-slate-400">Searching players...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(p => (
                  <div
                    key={p.player_id}
                    onClick={() => selectPlayerForSlot(p.player_id)}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer flex items-center justify-between transition-colors rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <PlayerImage
                        playerId={p.player_id}
                        name={p.player_name}
                        imageUrl={p.image_url}
                        role={p.primary_role}
                        size="sm"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-xs">{p.player_name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.primary_role} • {p.country}</span>
                      </div>
                    </div>
                    <span className="font-bold text-royal-pink font-mono text-xs">PRI {p.overall_pri || p.bpri || p.bopri}</span>
                  </div>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="p-8 text-center text-xs text-slate-400">No players found matching "{searchQuery}"</div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">Type at least 2 letters to search 824 cricketers</div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
