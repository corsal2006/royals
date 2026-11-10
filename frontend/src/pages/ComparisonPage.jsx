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
  Swords
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
    ids: [4708, 1077], // Rinku Singh vs David Miller
    desc: "Match-closer shootout between India's premier finisher and South Africa's death-chase veteran"
  },
  {
    name: "Death Overs: Bumrah vs Pathirana",
    ids: [2933, 8661], // Jasprit Bumrah vs Matheesha Pathirana
    desc: "Pace spearmhead battle: Bumrah's immaculate execution vs Pathirana's sling yorkers"
  },
  {
    name: "Mystery Spin: Kuldeep vs Varun",
    ids: [3644, 6256], // Kuldeep Yadav vs Varun Chakravarthy
    desc: "Wrist-spin choke duel: unreadable googlies vs finger-flick variations"
  },
  {
    name: "Impact All-Rounders: Russell vs Stoinis",
    ids: [1318, 2639], // Andre Russell vs Marcus Stoinis
    desc: "Dual-threat powerhouses: raw hitting capability paired with crunch death overs"
  },
  {
    name: "Crisis Recovery: Shashank vs Stubbs",
    ids: [2756, 20702], // Shashank Singh vs Tristan Stubbs
    desc: "Middle-order anchors equipped to rescue collapses under high required run rates"
  }
];

export default function ComparisonPage({ onSelectPlayer }) {
  const [selectedIds, setSelectedIds] = useState([4708, 1077]); // Default: Rinku vs Miller
  const [comparedPlayers, setComparedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      setLoading(true);
      fetchComparison(selectedIds)
        .then(res => {
          setComparedPlayers(res.players || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedIds]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length >= 2) {
      setIsSearching(true);
      fetchPlayers({ q, limit: 6 })
        .then(res => {
          setSearchResults(res.players || []);
        });
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const addPlayer = (id) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const removePlayer = (id) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter(pid => pid !== id));
    }
  };

  // Determine card winners for side-by-side battle
  const p1 = comparedPlayers[0];
  const p2 = comparedPlayers[1];

  let p1Wins = [];
  let p2Wins = [];

  if (p1 && p2) {
    // Overall PRI
    const p1Pri = Number(p1.overall_pri || p1.pri_score || 0);
    const p2Pri = Number(p2.overall_pri || p2.pri_score || 0);
    if (p1Pri > p2Pri) p1Wins.push('pri');
    else if (p2Pri > p1Pri) p2Wins.push('pri');

    // Strike Rate
    const p1Sr = p1.batting?.p_sr || (p1.bowling ? (12 - p1.bowling.p_econ) * 15 : 0);
    const p2Sr = p2.batting?.p_sr || (p2.bowling ? (12 - p2.bowling.p_econ) * 15 : 0);
    if (p1Sr > p2Sr) p1Wins.push('str');
    else if (p2Sr > p1Sr) p2Wins.push('str');

    // Economy / Run Control
    const p1Econ = p1.bowling?.p_econ || 999;
    const p2Econ = p2.bowling?.p_econ || 999;
    if (p1Econ < p2Econ && p1Econ !== 999) p1Wins.push('ecn');
    else if (p2Econ < p1Econ && p2Econ !== 999) p2Wins.push('ecn');

    // Clutch Delta
    const p1Delta = p1.batting?.delta_sr || (p1.bowling?.delta_econ ? p1.bowling.delta_econ * 10 : 0);
    const p2Delta = p2.batting?.delta_sr || (p2.bowling?.delta_econ ? p2.bowling.delta_econ * 10 : 0);
    if (p1Delta > p2Delta) p1Wins.push('clu');
    else if (p2Delta > p1Delta) p2Wins.push('clu');

    // Volume
    const p1Vol = (p1.batting?.p_balls || 0) + (p1.bowling?.p_balls || 0);
    const p2Vol = (p2.batting?.p_balls || 0) + (p2.bowling?.p_balls || 0);
    if (p1Vol > p2Vol) p1Wins.push('run');
    else if (p2Vol > p1Vol) p2Wins.push('run');
  }

  // Radar chart metrics calculation
  const radarAxes = [
    { key: 'pri', label: 'Overall PRI' },
    { key: 'clutch', label: 'Clutch Delta' },
    { key: 'strike', label: 'Strike / Econ' },
    { key: 'volume', label: 'Sample Volume' },
    { key: 'consistency', label: 'Dot / Strangle' },
  ];

  const radarData = radarAxes.map(axis => {
    const row = { metric: axis.label };
    comparedPlayers.forEach(p => {
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

  const colors = ['#EA1A7F', '#E2B714', '#06B6D4'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-700 shadow-sm bg-white dark:bg-navy-850 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-royal-pink text-xs font-bold uppercase tracking-widest mb-2 px-3 py-1 rounded-full bg-royal-pink/10 border border-royal-pink/30">
            <Swords className="w-3.5 h-3.5 text-royal-gold" />
            <span>Card-by-Card Head-to-Head Arena</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Player Card Comparison Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1 leading-relaxed">
            FIFA Ultimate Team-style card battle. Compare verified clutch attributes, pressure strike rates, dot-ball resistance, and tactical fit for Rajasthan Royals.
          </p>
        </div>

        {/* Selected Players Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {comparedPlayers.map((p, idx) => (
            <div 
              key={p.player_id}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border text-xs font-bold shadow-sm"
              style={{ borderColor: colors[idx % colors.length] }}
            >
              <PlayerImage
                playerId={p.player_id}
                name={p.player_name}
                imageUrl={p.image_url}
                role={p.primary_role}
                size="xs"
              />
              <span className="text-slate-900 dark:text-white">{p.player_name}</span>
              {selectedIds.length > 2 && (
                <button 
                  onClick={() => removePlayer(p.player_id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Presets & Search Input */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Matchups:</span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIds(preset.ids)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-900 hover:bg-royal-pink hover:text-white dark:hover:bg-royal-pink dark:hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 transition-all shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Player Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Add player to card battle..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={selectedIds.length >= 3}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-royal-pink disabled:opacity-50"
          />

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-2xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-100 dark:divide-navy-800">
              {searchResults.map(p => (
                <div 
                  key={p.player_id}
                  onClick={() => addPlayer(p.player_id)}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer flex justify-between items-center text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <PlayerImage
                      playerId={p.player_id}
                      name={p.player_name}
                      imageUrl={p.image_url}
                      role={p.primary_role}
                      size="xs"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{p.player_name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.country} • {p.primary_role}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-royal-pink font-mono">PRI {p.overall_pri || p.bpri || p.bopri}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
          THE CARD-BY-CARD FIFA ULTIMATE TEAM COMPARISON ARENA
          Side-by-side FIFA cards with attribute deltas and winner highlights
          ========================================================================= */}
      <div className="rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-750 shadow-sm bg-gradient-to-b from-slate-50 to-white dark:from-navy-900 dark:to-navy-950">
        
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] uppercase font-mono font-black tracking-widest text-royal-gold px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
            HEAD-TO-HEAD CARD SHOWDOWN
          </span>
          <h2 className="text-xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mt-2">
            Card-by-Card Pressure Duel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Green highlights indicate the winning stat on each card. Click any card to inspect full match dossier.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-royal-pink/20 border-t-royal-pink animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            
            {/* Player 1 FIFA Card */}
            {p1 && (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <FifaPlayerCard 
                    player={p1} 
                    onSelect={onSelectPlayer}
                    winningStats={p1Wins}
                    showCompareBtn={false}
                  />
                  {p1Wins.length > p2Wins.length && (
                    <div className="absolute -top-3 -right-3 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center space-x-1 border border-white">
                      <Trophy className="w-3 h-3 text-slate-950" />
                      <span>MATCHUP WINNER</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{p1.player_name}</span>
                  <p className="text-[10px] text-slate-500">{p1Wins.length} winning clutch attributes</p>
                </div>
              </div>
            )}

            {/* Electric VS Divider Badge */}
            <div className="flex flex-col items-center justify-center my-4 lg:my-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-royal-pink via-purple-600 to-royal-blue text-white font-display font-black text-xl flex items-center justify-center shadow-royal-glow border-2 border-white dark:border-navy-800">
                VS
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-2 font-bold">
                CLUTCH DUEL
              </span>
            </div>

            {/* Player 2 FIFA Card */}
            {p2 && (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <FifaPlayerCard 
                    player={p2} 
                    onSelect={onSelectPlayer}
                    winningStats={p2Wins}
                    showCompareBtn={false}
                  />
                  {p2Wins.length > p1Wins.length && (
                    <div className="absolute -top-3 -right-3 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center space-x-1 border border-white">
                      <Trophy className="w-3 h-3 text-slate-950" />
                      <span>MATCHUP WINNER</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{p2.player_name}</span>
                  <p className="text-[10px] text-slate-500">{p2Wins.length} winning clutch attributes</p>
                </div>
              </div>
            )}

            {/* Optional Player 3 Card if 3 players selected */}
            {comparedPlayers[2] && (
              <>
                <div className="hidden lg:flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-navy-700">
                    &
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <FifaPlayerCard 
                    player={comparedPlayers[2]} 
                    onSelect={onSelectPlayer}
                    showCompareBtn={false}
                  />
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{comparedPlayers[2].player_name}</span>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

      </div>

      {/* Direct Head-to-Head Metric Battle Table */}
      <div className="overflow-x-auto rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-royal-gold" />
            <span>Card-by-Card Metric Breakdown & Verdict</span>
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Detailed telemetry comparison</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-navy-900/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-navy-750">
            <tr>
              <th className="py-3.5 px-4 w-48">Key Metric</th>
              {comparedPlayers.map((p, idx) => (
                <th key={p.player_id} className="py-3.5 px-4 text-right">
                  <span className="font-bold block text-xs" style={{ color: colors[idx % colors.length] }}>
                    {p.player_name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{p.country} • {p.primary_role}</span>
                </th>
              ))}
              {comparedPlayers.length === 2 && (
                <th className="py-3.5 px-4 text-center font-bold text-royal-gold">Head-to-Head Edge</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
            {/* PRI Score */}
            <tr className="bg-slate-50/50 dark:bg-navy-900/40">
              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Overall Pressure Reliability (PRI)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right font-black text-royal-pink text-sm tabular font-mono">
                  {p.overall_pri || p.bpri || p.bopri}
                </td>
              ))}
              {comparedPlayers.length === 2 && (
                <td className="py-3 px-4 text-center text-[11px] font-bold text-royal-pink font-mono">
                  {p1 && p2 ? (
                    (p1.overall_pri || 0) > (p2.overall_pri || 0) 
                      ? `${p1.player_name} (+${((p1.overall_pri||0) - (p2.overall_pri||0)).toFixed(1)})` 
                      : `${p2.player_name} (+${((p2.overall_pri||0) - (p1.overall_pri||0)).toFixed(1)})`
                  ) : '-'}
                </td>
              )}
            </tr>

            {/* Pressure Strike Rate (Bat) */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Strike Rate (Bat)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular font-bold text-royal-gold font-mono">
                  {p.batting ? `${p.batting.p_sr.toFixed(1)}` : 'N/A'}
                </td>
              ))}
              {comparedPlayers.length === 2 && (
                <td className="py-3 px-4 text-center text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  {p1?.batting && p2?.batting ? (
                    p1.batting.p_sr > p2.batting.p_sr
                      ? `${p1.player_name} (+${(p1.batting.p_sr - p2.batting.p_sr).toFixed(1)} SR)`
                      : `${p2.player_name} (+${(p2.batting.p_sr - p1.batting.p_sr).toFixed(1)} SR)`
                  ) : '-'}
                </td>
              )}
            </tr>

            {/* Clutch Delta SR */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Clutch Delta SR (vs Normal)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className={`py-3 px-4 text-right tabular font-bold font-mono ${p.batting && p.batting.delta_sr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {p.batting ? (p.batting.delta_sr >= 0 ? `+${p.batting.delta_sr.toFixed(1)}` : p.batting.delta_sr.toFixed(1)) : 'N/A'}
                </td>
              ))}
              {comparedPlayers.length === 2 && (
                <td className="py-3 px-4 text-center text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {p1?.batting && p2?.batting ? (
                    p1.batting.delta_sr > p2.batting.delta_sr
                      ? `${p1.player_name} (+${(p1.batting.delta_sr - p2.batting.delta_sr).toFixed(1)})`
                      : `${p2.player_name} (+${(p2.batting.delta_sr - p1.batting.delta_sr).toFixed(1)})`
                  ) : '-'}
                </td>
              )}
            </tr>

            {/* Pressure Economy Rate */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Economy Rate (Bowl)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular font-bold text-royal-blue dark:text-blue-400 font-mono">
                  {p.bowling ? `${p.bowling.p_econ.toFixed(2)}` : 'N/A'}
                </td>
              ))}
              {comparedPlayers.length === 2 && (
                <td className="py-3 px-4 text-center text-[11px] font-mono text-royal-blue dark:text-blue-400 font-bold">
                  {p1?.bowling && p2?.bowling ? (
                    p1.bowling.p_econ < p2.bowling.p_econ
                      ? `${p1.player_name} (-${(p2.bowling.p_econ - p1.bowling.p_econ).toFixed(2)} tighter)`
                      : `${p2.player_name} (-${(p1.bowling.p_econ - p2.bowling.p_econ).toFixed(2)} tighter)`
                  ) : '-'}
                </td>
              )}
            </tr>

            {/* Pressure Wickets */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Wickets</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular font-bold text-slate-900 dark:text-white font-mono">
                  {p.bowling ? `${p.bowling.p_wkts}` : 'N/A'}
                </td>
              ))}
              {comparedPlayers.length === 2 && (
                <td className="py-3 px-4 text-center text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  {p1?.bowling && p2?.bowling ? (
                    p1.bowling.p_wkts > p2.bowling.p_wkts
                      ? `${p1.player_name} (+${p1.bowling.p_wkts - p2.bowling.p_wkts} wkts)`
                      : `${p2.player_name} (+${p2.bowling.p_wkts - p1.bowling.p_wkts} wkts)`
                  ) : '-'}
                </td>
              )}
            </tr>

            {/* Sample Volume */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">High-Pressure Balls Faced / Bowled</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular text-slate-800 dark:text-slate-200 font-bold font-mono">
                  {(p.batting?.p_balls || 0) + (p.bowling?.p_balls || 0)} balls
                </td>
              ))}
              {comparedPlayers.length === 2 && (
                <td className="py-3 px-4 text-center text-[11px] font-mono text-slate-500">
                  {p1 && p2 ? (
                    ((p1.batting?.p_balls || 0) + (p1.bowling?.p_balls || 0)) > ((p2.batting?.p_balls || 0) + (p2.bowling?.p_balls || 0))
                      ? `${p1.player_name} higher volume`
                      : `${p2.player_name} higher volume`
                  ) : '-'}
                </td>
              )}
            </tr>

            {/* Tactical Fit for RR */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Rajasthan Royals Fit</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right text-[11px] text-slate-600 dark:text-slate-300 leading-normal max-w-xs">
                  {p.key_strength || "High-reliability performer"}
                </td>
              ))}
              {comparedPlayers.length === 2 && (
                <td className="py-3 px-4 text-center text-[11px] font-semibold text-royal-gold">
                  Both targetable
                </td>
              )}
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
              {comparedPlayers.map((p, idx) => (
                <Radar
                  key={p.player_id}
                  name={p.player_name}
                  dataKey={p.player_name}
                  stroke={colors[idx % colors.length]}
                  fill={colors[idx % colors.length]}
                  fillOpacity={0.25}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
