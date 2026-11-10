import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Filter, 
  TrendingUp, 
  Sliders, 
  Crown, 
  ArrowUpDown, 
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
import { fetchBatters } from '../services/api';

export default function BattersPage({ onSelectPlayer }) {
  const [batters, setBatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minBalls, setMinBalls] = useState(80);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('ALL');
  const [sortBy, setSortBy] = useState('bpri');
  const [order, setOrder] = useState('desc');
  const [top10Only, setTop10Only] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBatters({ min_balls: minBalls, country, search, sort_by: sortBy, order })
      .then(res => {
        setBatters(res.players || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [minBalls, country, search, sortBy, order]);

  // Slice for top 10 if active
  const displayedBatters = top10Only ? batters.slice(0, 10) : batters;

  // Scatter plot points: Normal SR vs Pressure SR
  const scatterData = batters.slice(0, 40).map(b => ({
    name: b.player_name,
    norm_sr: b.batting.norm_sr,
    p_sr: b.batting.p_sr,
    delta: b.batting.delta_sr,
    bpri: b.bpri,
    balls: b.batting.p_balls,
    id: b.player_id
  }));

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="royal-glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-700 shadow-xl bg-white dark:bg-navy-850">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-pink/10 text-royal-pink border border-royal-pink/30 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Batting Pressure Reliability Index (BPRI)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Batters Intelligence Hub
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            Evaluating run acceleration, strike rate escalation under high required run rates, 
            boundary frequency, and dismissal avoidance across 200,999 delivery-level match states.
          </p>
        </div>
      </div>

      {/* Interactive Scatter Plot: Normal SR vs Pressure SR */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-750">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-royal-pink" />
              <span>Normal Strike Rate vs Pressure Strike Rate (Clutch Delta)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Points above the diagonal 45° line represent batters whose strike rate accelerates when pressure peaks.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-semibold">
            <span className="flex items-center space-x-1.5 text-royal-pink">
              <span className="w-2.5 h-2.5 rounded-full bg-royal-pink inline-block"></span>
              <span>Delta &ge; +25 SR</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Delta &ge; 0 SR</span>
            </span>
            <span className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
              <span>Declining SR</span>
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
              <XAxis 
                type="number" 
                dataKey="norm_sr" 
                name="Normal SR" 
                unit="" 
                domain={[90, 210]}
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(val) => `${val} SR`}
              />
              <YAxis 
                type="number" 
                dataKey="p_sr" 
                name="Pressure SR" 
                unit="" 
                domain={[90, 240]}
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(val) => `${val} SR`}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1 border border-navy-700">
                        <div className="font-bold text-sm text-white">{data.name}</div>
                        <div className="text-royal-gold font-semibold">Pressure SR: <span className="tabular">{data.p_sr.toFixed(1)}</span></div>
                        <div className="text-slate-300">Normal SR: <span className="text-slate-400 tabular">{data.norm_sr.toFixed(1)}</span></div>
                        <div className={`font-bold tabular ${data.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          Clutch Delta: {data.delta >= 0 ? `+${data.delta.toFixed(1)}` : data.delta.toFixed(1)} SR
                        </div>
                        <div className="text-royal-pink font-black tabular">BPRI: {data.bpri} ({data.balls}b)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine stroke="#64748B" strokeDasharray="4 4" segment={[{ x: 100, y: 100 }, { x: 210, y: 210 }]} />
              <Scatter name="Batters" data={scatterData} onClick={(node) => onSelectPlayer && onSelectPlayer(node.id)}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.delta >= 25 ? '#EA1A7F' : entry.delta >= 0 ? '#F59E0B' : '#64748B'} 
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
            placeholder="Search batter by name or franchise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-royal-pink transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Top 10 Toggle */}
          <button
            onClick={() => setTop10Only(!top10Only)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
              top10Only
                ? 'bg-royal-pink text-white border-royal-pink shadow-royal-glow'
                : 'bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-750 hover:border-royal-pink'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-royal-gold" />
            <span>{top10Only ? 'Showing Top 10 Batters' : 'Filter Top 10 Batters'}</span>
          </button>

          {/* Min balls slider */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-navy-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-750 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Min Balls:</span>
            <input
              type="range"
              min="30"
              max="250"
              step="10"
              value={minBalls}
              onChange={(e) => setMinBalls(parseInt(e.target.value))}
              className="w-20 accent-royal-pink cursor-pointer"
            />
            <span className="font-bold text-royal-gold tabular w-8">{minBalls}b</span>
          </div>

          {/* Country filter */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-pink cursor-pointer"
          >
            <option value="ALL">All Countries</option>
            <option value="India">India</option>
            <option value="Australia">Australia</option>
            <option value="South Africa">South Africa</option>
            <option value="West Indies">West Indies</option>
            <option value="England">England</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-pink cursor-pointer"
          >
            <option value="bpri">Sort: BPRI (Index)</option>
            <option value="p_sr">Sort: Pressure Strike Rate</option>
            <option value="delta_sr">Sort: Clutch Delta SR</option>
            <option value="p_runs">Sort: Pressure Runs</option>
            <option value="p_avg">Sort: Pressure Average</option>
            <option value="p_balls">Sort: Sample Volume</option>
          </select>
        </div>

      </div>

      {/* Batters Table */}
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-navy-750">
            <tr>
              <th className="py-3.5 px-4">Player & Country</th>
              <th className="py-3.5 px-3">Role & Franchise</th>
              <th className="py-3.5 px-3 text-right">Pressure Balls</th>
              <th className="py-3.5 px-3 text-right">Pressure Runs</th>
              <th className="py-3.5 px-3 text-right">Pressure SR</th>
              <th className="py-3.5 px-3 text-right">Clutch &Delta; SR</th>
              <th className="py-3.5 px-3 text-right">Pressure Avg</th>
              <th className="py-3.5 px-3 text-right">Boundary %</th>
              <th className="py-3.5 px-4 text-right">BPRI Score</th>
              <th className="py-3.5 px-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
            {displayedBatters.map((b) => (
              <tr key={b.player_id} className="hover:bg-slate-50 dark:hover:bg-navy-800/60 transition-colors group">
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2.5">
                    <PlayerImage
                      playerId={b.player_id}
                      name={b.player_name}
                      imageUrl={b.image_url}
                      role={b.primary_role}
                      size="xs"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-royal-pink transition-colors">
                        {b.player_name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {b.country} • {b.batting_style}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block">{b.primary_role}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.current_ipl_team}</span>
                </td>
                <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular font-mono">
                  {b.batting.p_balls}
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white tabular font-mono">
                  {b.batting.p_runs}
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-royal-gold tabular font-mono">
                  {b.batting.p_sr.toFixed(1)}
                </td>
                <td className={`py-3.5 px-3 text-right font-bold tabular font-mono ${b.batting.delta_sr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {b.batting.delta_sr >= 0 ? `+${b.batting.delta_sr.toFixed(1)}` : b.batting.delta_sr.toFixed(1)}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular font-mono">
                  {b.batting.p_avg.toFixed(1)}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular font-mono">
                  {b.batting.p_bound_pct.toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-right font-black text-royal-pink tabular text-sm font-mono">
                  {b.bpri}
                </td>
                <td className="py-3.5 px-3 text-center">
                  <button
                    onClick={() => onSelectPlayer && onSelectPlayer(b.player_id)}
                    className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-navy-750 hover:bg-royal-pink hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 transition-all shadow-sm"
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
