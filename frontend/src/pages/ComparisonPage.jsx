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
  ArrowRight
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
import PlayerImage from '../components/PlayerImage';
import { fetchPlayers, fetchComparison } from '../services/api';

const PRESETS = [
  {
    name: "Elite Finishers Shootout",
    ids: [4708, 1077, 6396, 2756], // Rinku Singh, David Miller, Tim David, Shashank Singh
    label: "Rinku vs Miller vs Tim David vs Shashank"
  },
  {
    name: "Death Overs Pacer Showdown",
    ids: [8661, 6464, 2933], // Matheesha Pathirana, Arshdeep Singh, Jasprit Bumrah
    label: "Pathirana vs Arshdeep vs Bumrah"
  },
  {
    name: "Mystery Spin Choke Duel",
    ids: [3644, 6256, 781], // Kuldeep Yadav, Varun Chakravarthy, Sunil Narine
    label: "Kuldeep vs Varun vs Narine"
  },
  {
    name: "Dual-Threat All-Rounder Clash",
    ids: [4722, 152, 1318, 2639], // Rashid Khan, Ravindra Jadeja, Andre Russell, Marcus Stoinis
    label: "Rashid vs Jadeja vs Russell vs Stoinis"
  }
];

export default function ComparisonPage({ onSelectPlayer }) {
  const [selectedIds, setSelectedIds] = useState([4708, 1077, 2756]); // Default: Rinku, Miller, Shashank
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
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
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
        const b = p.batting?.p_balls || p.bowling?.p_balls || 0;
        val = Math.min(100, Math.max(30, (b / 500) * 100));
      } else if (axis.key === 'consistency') {
        val = p.batting ? Math.min(100, p.batting.p_bound_pct * 3) :
              p.bowling ? p.bowling.p_bound_prev : 50;
      }
      row[p.player_name] = Math.round(val);
    });
    return row;
  });

  const colors = ['#EA1A7F', '#E2B714', '#06B6D4', '#8B5CF6'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="royal-glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-700 shadow-xl bg-white dark:bg-navy-850 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-royal-pink text-xs font-bold uppercase tracking-widest mb-2 px-3 py-1 rounded-full bg-royal-pink/10 border border-royal-pink/30">
            <GitCompare className="w-3.5 h-3.5 text-royal-gold" />
            <span>Head-to-Head Pressure Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Player Comparison Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
            Side-by-side radar analysis, clutch metric differentials, sample volume confidence, and situational breakdown across 2 to 4 candidates.
          </p>
        </div>

        {/* Selected Players Cards */}
        <div className="flex flex-wrap items-center gap-2.5">
          {comparedPlayers.map((p, idx) => (
            <div 
              key={p.player_id}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-navy-900 border text-xs font-bold shadow-sm"
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

      {/* Preset Quick Comparisons & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
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
            placeholder="Add player to compare..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={selectedIds.length >= 4}
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

      {/* Radar Chart Visualizer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md space-y-3">
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

      {/* Direct Head-to-Head Comparison Table */}
      <div className="overflow-x-auto rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md">
        <div className="p-4 bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-royal-gold" />
            <span>Head-to-Head Metric Breakdown</span>
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Direct statistical side-by-side</span>
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
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{p.country}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
            {/* PRI Score */}
            <tr className="bg-slate-50/50 dark:bg-navy-900/40">
              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Pressure Reliability Index (PRI)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right font-black text-royal-pink text-sm tabular font-mono">
                  {p.overall_pri || p.bpri || p.bopri}
                </td>
              ))}
            </tr>

            {/* Sample Volume */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Balls Faced / Bowled</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular text-slate-800 dark:text-slate-200 font-bold font-mono">
                  {p.batting?.p_balls || p.bowling?.p_balls || 0} balls
                </td>
              ))}
            </tr>

            {/* Batting Pressure SR */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Strike Rate (Bat)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular font-bold text-royal-gold font-mono">
                  {p.batting ? `${p.batting.p_sr.toFixed(1)}` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Clutch Delta SR */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Clutch Delta SR (vs Normal)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className={`py-3 px-4 text-right tabular font-bold font-mono ${p.batting && p.batting.delta_sr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {p.batting ? (p.batting.delta_sr >= 0 ? `+${p.batting.delta_sr.toFixed(1)}` : p.batting.delta_sr.toFixed(1)) : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Pressure Average */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Average (Bat)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular text-slate-700 dark:text-slate-300 font-mono">
                  {p.batting ? `${p.batting.p_avg.toFixed(1)}` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Bowling Pressure Econ */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Economy Rate (Bowl)</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular font-bold text-royal-blue dark:text-blue-400 font-mono">
                  {p.bowling ? `${p.bowling.p_econ.toFixed(2)}` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Pressure Wickets */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Pressure Wickets</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right tabular font-bold text-slate-900 dark:text-white font-mono">
                  {p.bowling ? `${p.bowling.p_wkts}` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Scouting Verdict */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">RR Tactical Fit</td>
              {comparedPlayers.map(p => (
                <td key={p.player_id} className="py-3 px-4 text-right text-[11px] text-slate-600 dark:text-slate-300 leading-normal max-w-xs">
                  {p.key_strength || "Consistent performer"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
