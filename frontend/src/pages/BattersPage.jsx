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
  Info
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
import { fetchBatters } from '../services/api';

export default function BattersPage({ onSelectPlayer }) {
  const [batters, setBatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minBalls, setMinBalls] = useState(80);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('ALL');
  const [sortBy, setSortBy] = useState('bpri');
  const [order, setOrder] = useState('desc');

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
      
      {/* Header */}
      <div className="royal-glass-card rounded-2xl p-6 sm:p-8 border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-royal-pink text-xs font-bold uppercase tracking-widest mb-1.5">
            <Flame className="w-4 h-4" />
            <span>Batting Pressure Reliability Model</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Batters Under Pressure Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Evaluates finishing firepower, boundary percentage, dismissal resistance, and clutch acceleration ($SR_P - SR_N$) with Bayesian sample dampening.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-navy-900/80 px-4 py-2.5 rounded-xl border border-navy-750">
          <span className="text-xs font-medium text-slate-400">Total Filtered:</span>
          <span className="text-lg font-display font-bold text-royal-pink tabular">{batters.length} Batters</span>
        </div>
      </div>

      {/* Interactive Scatter Plot: Normal SR vs Pressure SR */}
      <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-royal-pink" />
              <span>Clutch Accelerator Quadrant: Normal SR vs Pressure SR</span>
            </h3>
            <p className="text-xs text-slate-400">
              Players above the diagonal line scored faster under high pressure than in normal baseline situations.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-royal-pink inline-block"></span>
              <span>Clutch Accelerator (+Δ SR)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
              <span>Pressure Decelerator</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis 
                type="number" 
                dataKey="norm_sr" 
                name="Normal SR" 
                unit="" 
                stroke="#94A3B8" 
                fontSize={11} 
                domain={[100, 180]}
                label={{ value: 'Normal Situation Strike Rate', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
              />
              <YAxis 
                type="number" 
                dataKey="p_sr" 
                name="Pressure SR" 
                unit="" 
                stroke="#94A3B8" 
                fontSize={11} 
                domain={[100, 220]}
                label={{ value: 'High Pressure Strike Rate', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-navy-950 p-3 rounded-xl border border-navy-700 shadow-xl text-xs space-y-1">
                        <span className="font-bold text-white block text-sm">{data.name}</span>
                        <div className="text-slate-300">Pressure SR: <span className="font-bold text-royal-gold tabular">{data.p_sr.toFixed(1)}</span></div>
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
              <ReferenceLine stroke="#475569" strokeDasharray="4 4" segment={[{ x: 100, y: 100 }, { x: 200, y: 200 }]} />
              <Scatter name="Batters" data={scatterData} onClick={(node) => onSelectPlayer && onSelectPlayer(node.id)}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.delta >= 25 ? '#EA1A7F' : entry.delta >= 0 ? '#F59E0B' : '#475569'} 
                    className="cursor-pointer hover:r-7 transition-all"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="royal-glass-card rounded-2xl p-4 sm:p-5 border border-navy-700 flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search batter by name or IPL team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy-900 border border-navy-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-pink transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Min balls slider */}
          <div className="flex items-center space-x-2 bg-navy-900 px-3 py-1.5 rounded-xl border border-navy-750 text-xs">
            <span className="text-slate-400">Min Balls:</span>
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
            className="bg-navy-900 border border-navy-750 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-pink cursor-pointer"
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
            className="bg-navy-900 border border-navy-750 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-pink cursor-pointer"
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
      <div className="royal-glass-card rounded-2xl border border-navy-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-navy-750">
              <tr>
                <th className="py-3.5 px-4">Player & Country</th>
                <th className="py-3.5 px-3">Role & Franchise</th>
                <th className="py-3.5 px-3 text-right">Pressure Balls</th>
                <th className="py-3.5 px-3 text-right">Pressure Runs</th>
                <th className="py-3.5 px-3 text-right">Pressure SR</th>
                <th className="py-3.5 px-3 text-right">Clutch Δ SR</th>
                <th className="py-3.5 px-3 text-right">Pressure Avg</th>
                <th className="py-3.5 px-3 text-right">Boundary %</th>
                <th className="py-3.5 px-4 text-right">BPRI Score</th>
                <th className="py-3.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {batters.map((b) => (
                <tr key={b.player_id} className="hover:bg-navy-800/60 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-royal-pink transition-colors">
                      {b.player_name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {b.country} • {b.batting_style}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] font-medium text-slate-300 block">{b.primary_role}</span>
                    <span className="text-[10px] text-slate-500">{b.current_ipl_team}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300 tabular">
                    {b.batting.p_balls}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-white tabular">
                    {b.batting.p_runs}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-royal-gold tabular">
                    {b.batting.p_sr.toFixed(1)}
                  </td>
                  <td className={`py-3.5 px-3 text-right font-bold tabular ${b.batting.delta_sr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {b.batting.delta_sr >= 0 ? `+${b.batting.delta_sr.toFixed(1)}` : b.batting.delta_sr.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300 tabular">
                    {b.batting.p_avg.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300 tabular">
                    {b.batting.p_bound_pct.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-royal-pink tabular text-sm">
                    {b.bpri}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => onSelectPlayer && onSelectPlayer(b.player_id)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-navy-750 hover:bg-royal-pink hover:text-white text-slate-300 border border-navy-700 transition-all"
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

    </div>
  );
}

