import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  Search, 
  Filter, 
  TrendingDown, 
  Sliders, 
  Crown, 
  ShieldCheck, 
  Zap, 
  Info,
  Sparkles
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  Cell 
} from 'recharts';
import PlayerImage from '../components/PlayerImage';
import { fetchBowlers } from '../services/api';

export default function BowlersPage({ onSelectPlayer }) {
  const [bowlers, setBowlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minBalls, setMinBalls] = useState(80);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('ALL');
  const [type, setType] = useState('ALL'); // Pace / Spin
  const [sortBy, setSortBy] = useState('bopri');
  const [order, setOrder] = useState('desc');
  const [top10Only, setTop10Only] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBowlers({ min_balls: minBalls, country, type, search, sort_by: sortBy, order })
      .then(res => {
        setBowlers(res.players || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [minBalls, country, type, search, sortBy, order]);

  // Slice for top 10 if active
  const displayedBowlers = top10Only ? bowlers.slice(0, 10) : bowlers;

  // Scatter data: Normal Economy vs Pressure Economy
  const scatterData = bowlers.slice(0, 40).map(b => ({
    name: b.player_name,
    norm_econ: b.bowling.norm_econ,
    p_econ: b.bowling.p_econ,
    delta: b.bowling.delta_econ,
    bopri: b.bopri,
    balls: b.bowling.p_balls,
    id: b.player_id
  }));

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="royal-glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-700 shadow-xl bg-white dark:bg-navy-850">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-blue/10 dark:bg-royal-blue/20 text-royal-blue dark:text-blue-400 border border-royal-blue/30 text-xs font-bold uppercase tracking-wider">
            <Crosshair className="w-3.5 h-3.5" />
            <span>Bowling Pressure Reliability Index (BoPRI)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Bowlers Intelligence Hub
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            Quantifying economy suppression under peak pressure, dot ball strangulation, boundary prevention, 
            and death-overs execution across fast bowlers and mystery spinners.
          </p>
        </div>
      </div>

      {/* Interactive Scatter Plot: Normal Econ vs Pressure Econ */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-750">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-royal-blue dark:text-blue-400" />
              <span>Normal Economy vs Pressure Economy (Lower Pressure Economy is Better)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Points to the left and below the diagonal line represent bowlers who restrict scoring more effectively when pressure escalates.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-semibold">
            <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Delta &ge; +1.0 Econ Saved</span>
            </span>
            <span className="flex items-center space-x-1.5 text-royal-blue">
              <span className="w-2.5 h-2.5 rounded-full bg-royal-blue inline-block"></span>
              <span>Controlled Pressure</span>
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
              <XAxis 
                type="number" 
                dataKey="norm_econ" 
                name="Normal Econ" 
                unit="" 
                domain={[5.0, 11.5]}
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(val) => `${val} Econ`}
              />
              <YAxis 
                type="number" 
                dataKey="p_econ" 
                name="Pressure Econ" 
                unit="" 
                domain={[4.5, 12.0]}
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(val) => `${val} Econ`}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1 border border-navy-700">
                        <div className="font-bold text-sm text-white">{data.name}</div>
                        <div className="text-royal-gold font-semibold">Pressure Econ: <span className="tabular font-mono">{data.p_econ.toFixed(2)}</span></div>
                        <div className="text-slate-300">Normal Econ: <span className="text-slate-400 tabular font-mono">{data.norm_econ.toFixed(2)}</span></div>
                        <div className={`font-bold tabular ${data.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          Econ Delta: {data.delta >= 0 ? `+${data.delta.toFixed(2)}` : data.delta.toFixed(2)}
                        </div>
                        <div className="text-royal-cyan font-black tabular">BoPRI: {data.bopri} ({data.balls}b)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine stroke="#64748B" strokeDasharray="4 4" segment={[{ x: 5.5, y: 5.5 }, { x: 11.5, y: 11.5 }]} />
              <Scatter name="Bowlers" data={scatterData} onClick={(node) => onSelectPlayer && onSelectPlayer(node.id)}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.delta >= 1.0 ? '#10B981' : entry.p_econ <= 7.0 ? '#1D4ED8' : '#64748B'} 
                    className="cursor-pointer hover:r-7 transition-all"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bowler by name or franchise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-royal-blue transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Top 10 Toggle */}
          <button
            onClick={() => setTop10Only(!top10Only)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
              top10Only
                ? 'bg-royal-blue text-white border-royal-blue shadow-sm'
                : 'bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-750 hover:border-royal-blue'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-royal-gold" />
            <span>{top10Only ? 'Showing Top 10 Bowlers' : 'Filter Top 10 Bowlers'}</span>
          </button>

          {/* Min balls */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-navy-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-750 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Min Balls:</span>
            <input
              type="range"
              min="30"
              max="250"
              step="10"
              value={minBalls}
              onChange={(e) => setMinBalls(parseInt(e.target.value))}
              className="w-20 accent-royal-blue cursor-pointer"
            />
            <span className="font-bold text-royal-gold tabular w-8">{minBalls}b</span>
          </div>

          {/* Pace / Spin */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-blue cursor-pointer"
          >
            <option value="ALL">Pace & Spin</option>
            <option value="Pace">Pace Only</option>
            <option value="Spin">Spin Only</option>
          </select>

          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-blue cursor-pointer"
          >
            <option value="ALL">All Countries</option>
            <option value="India">India</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Afghanistan">Afghanistan</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Australia">Australia</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-blue cursor-pointer"
          >
            <option value="bopri">Sort: BoPRI (Index)</option>
            <option value="p_econ">Sort: Pressure Economy</option>
            <option value="p_wkts">Sort: Pressure Wickets</option>
            <option value="delta_econ">Sort: Clutch Delta Econ</option>
            <option value="p_avg">Sort: Bowling Average</option>
            <option value="p_balls">Sort: Sample Volume</option>
          </select>
        </div>

      </div>

      {/* Bowlers Table */}
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-navy-750">
            <tr>
              <th className="py-3.5 px-4">Player & Country</th>
              <th className="py-3.5 px-3">Style & Role</th>
              <th className="py-3.5 px-3 text-right">Pressure Balls</th>
              <th className="py-3.5 px-3 text-right">Pressure Wkts</th>
              <th className="py-3.5 px-3 text-right">Pressure Econ</th>
              <th className="py-3.5 px-3 text-right">Econ &Delta;</th>
              <th className="py-3.5 px-3 text-right">Bowling Avg</th>
              <th className="py-3.5 px-3 text-right">Dot Ball %</th>
              <th className="py-3.5 px-4 text-right">BoPRI Score</th>
              <th className="py-3.5 px-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
            {displayedBowlers.map((b) => (
              <tr key={b.player_id} className="hover:bg-slate-50 dark:hover:bg-navy-800/60 transition-colors group">
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2.5">
                    <PlayerImage
                      playerId={b.player_id}
                      name={b.player_name}
                      imageUrl={b.image_url}
                      role={b.primary_role}
                      size="sm"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-royal-blue dark:group-hover:text-blue-400 transition-colors">
                        {b.player_name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {b.country} • {b.current_ipl_team}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block">{b.bowling_style}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.pace_or_spin}</span>
                </td>
                <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular font-mono">
                  {b.bowling.p_balls}
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white tabular font-mono">
                  {b.bowling.p_wkts}
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-royal-gold tabular font-mono">
                  {b.bowling.p_econ.toFixed(2)}
                </td>
                <td className={`py-3.5 px-3 text-right font-bold tabular font-mono ${b.bowling.delta_econ >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {b.bowling.delta_econ >= 0 ? `+${b.bowling.delta_econ.toFixed(1)}` : b.bowling.delta_econ.toFixed(1)}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular font-mono">
                  {b.bowling.p_avg.toFixed(1)}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular font-mono">
                  {b.bowling.p_dot_pct.toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-right font-black text-royal-blue dark:text-blue-400 tabular text-sm font-mono">
                  {b.bopri}
                </td>
                <td className="py-3.5 px-3 text-center">
                  <button
                    onClick={() => onSelectPlayer && onSelectPlayer(b.player_id)}
                    className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-navy-750 hover:bg-royal-blue hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 transition-all shadow-sm"
                  >
                    Dossier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
