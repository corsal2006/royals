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
      
      {/* Header */}
      <div className="royal-glass-card rounded-2xl p-6 sm:p-8 border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-royal-cyan text-xs font-bold uppercase tracking-widest mb-1.5">
            <Crosshair className="w-4 h-4" />
            <span>Bowling Pressure Reliability Model</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Bowlers Under Pressure Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Evaluates death overs containment, breakthrough strike rates, dot-ball pressure creation, and boundary suppression against high required run rates.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-navy-900/80 px-4 py-2.5 rounded-xl border border-navy-750">
          <span className="text-xs font-medium text-slate-400">Total Filtered:</span>
          <span className="text-lg font-display font-bold text-royal-cyan tabular">{bowlers.length} Bowlers</span>
        </div>
      </div>

      {/* Scatter Plot: Normal Econ vs Pressure Econ */}
      <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-royal-cyan" />
              <span>Economy Control Quadrant: Normal Econ vs Pressure Econ</span>
            </h3>
            <p className="text-xs text-slate-400">
              Bowlers below the diagonal line were more economical under high pressure than in baseline situations.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-royal-cyan inline-block"></span>
              <span>Pressure Choke Specialist (+Δ Econ)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
              <span>Higher Pressure Leak</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis 
                type="number" 
                dataKey="norm_econ" 
                name="Normal Econ" 
                unit="" 
                stroke="#94A3B8" 
                fontSize={11} 
                domain={[5.0, 11.5]}
                label={{ value: 'Normal Situation Economy Rate', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
              />
              <YAxis 
                type="number" 
                dataKey="p_econ" 
                name="Pressure Econ" 
                unit="" 
                stroke="#94A3B8" 
                fontSize={11} 
                domain={[4.5, 12.0]}
                label={{ value: 'High Pressure Economy Rate', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-navy-950 p-3 rounded-xl border border-navy-700 shadow-xl text-xs space-y-1">
                        <span className="font-bold text-white block text-sm">{data.name}</span>
                        <div className="text-slate-300">Pressure Econ: <span className="font-bold text-royal-gold tabular">{data.p_econ.toFixed(2)}</span></div>
                        <div className="text-slate-300">Normal Econ: <span className="text-slate-400 tabular">{data.norm_econ.toFixed(2)}</span></div>
                        <div className={`font-bold tabular ${data.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          Clutch Delta: {data.delta >= 0 ? `+${data.delta.toFixed(2)} better` : `${data.delta.toFixed(2)} leak`}
                        </div>
                        <div className="text-royal-cyan font-black tabular">BoPRI: {data.bopri} ({data.balls}b)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine stroke="#475569" strokeDasharray="4 4" segment={[{ x: 5, y: 5 }, { x: 12, y: 12 }]} />
              <Scatter name="Bowlers" data={scatterData} onClick={(node) => onSelectPlayer && onSelectPlayer(node.id)}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.delta >= 1.0 ? '#06B6D4' : entry.delta >= 0 ? '#3B82F6' : '#64748B'} 
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
            placeholder="Search bowler by name or IPL team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy-900 border border-navy-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-cyan transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Min balls */}
          <div className="flex items-center space-x-2 bg-navy-900 px-3 py-1.5 rounded-xl border border-navy-750 text-xs">
            <span className="text-slate-400">Min Balls:</span>
            <input
              type="range"
              min="30"
              max="250"
              step="10"
              value={minBalls}
              onChange={(e) => setMinBalls(parseInt(e.target.value))}
              className="w-20 accent-royal-cyan cursor-pointer"
            />
            <span className="font-bold text-royal-gold tabular w-8">{minBalls}b</span>
          </div>

          {/* Pace vs Spin */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-navy-900 border border-navy-750 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-cyan cursor-pointer"
          >
            <option value="ALL">Pace & Spin</option>
            <option value="Pace">Pace Only</option>
            <option value="Spin">Spin Only</option>
          </select>

          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-navy-900 border border-navy-750 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-cyan cursor-pointer"
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
            className="bg-navy-900 border border-navy-750 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-royal-cyan cursor-pointer"
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
      <div className="royal-glass-card rounded-2xl border border-navy-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-navy-750">
              <tr>
                <th className="py-3.5 px-4">Player & Country</th>
                <th className="py-3.5 px-3">Style & Role</th>
                <th className="py-3.5 px-3 text-right">Pressure Balls</th>
                <th className="py-3.5 px-3 text-right">Pressure Wkts</th>
                <th className="py-3.5 px-3 text-right">Pressure Econ</th>
                <th className="py-3.5 px-3 text-right">Econ Δ</th>
                <th className="py-3.5 px-3 text-right">Bowling Avg</th>
                <th className="py-3.5 px-3 text-right">Dot Ball %</th>
                <th className="py-3.5 px-4 text-right">BoPRI Score</th>
                <th className="py-3.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {bowlers.map((b) => (
                <tr key={b.player_id} className="hover:bg-navy-800/60 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-royal-cyan transition-colors">
                      {b.player_name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {b.country} • {b.current_ipl_team}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] font-medium text-slate-300 block">{b.bowling_style}</span>
                    <span className="text-[10px] text-slate-500">{b.pace_or_spin}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300 tabular">
                    {b.bowling.p_balls}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-white tabular">
                    {b.bowling.p_wkts}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-royal-gold tabular">
                    {b.bowling.p_econ.toFixed(2)}
                  </td>
                  <td className={`py-3.5 px-3 text-right font-bold tabular ${b.bowling.delta_econ >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {b.bowling.delta_econ >= 0 ? `+${b.bowling.delta_econ.toFixed(1)}` : b.bowling.delta_econ.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300 tabular">
                    {b.bowling.p_avg.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300 tabular">
                    {b.bowling.p_dot_pct.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-royal-cyan tabular text-sm">
                    {b.bopri}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => onSelectPlayer && onSelectPlayer(b.player_id)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-navy-750 hover:bg-royal-cyan hover:text-white text-slate-300 border border-navy-700 transition-all"
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

