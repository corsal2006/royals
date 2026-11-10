import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Crown, 
  Flame, 
  Crosshair, 
  TrendingUp, 
  Award,
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
import { fetchAllRounders } from '../services/api';

export default function AllRoundersPage({ onSelectPlayer }) {
  const [allRounders, setAllRounders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRounders()
      .then(res => {
        setAllRounders(res.players || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Scatter data: BPRI vs BoPRI
  const scatterData = allRounders.map(ar => ({
    name: ar.player_name,
    bpri: ar.bpri || 50,
    bopri: ar.bopri || 50,
    arpri: ar.arpri,
    country: ar.country,
    id: ar.player_id
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="royal-glass-card rounded-2xl p-6 sm:p-8 border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-royal-gold text-xs font-bold uppercase tracking-widest mb-1.5">
            <Layers className="w-4 h-4" />
            <span>Dual Impact Pressure Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            All-Rounders Under Pressure
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Evaluates genuine two-way match-winners who deliver with both bat and ball under high pressure using the harmonic index (ARPRI).
          </p>
        </div>

        <div className="bg-navy-900/80 px-4 py-2.5 rounded-xl border border-navy-750">
          <span className="text-xs font-medium text-slate-400">Dual-Threat Profiles:</span>
          <span className="text-lg font-display font-bold text-royal-gold tabular ml-2">{allRounders.length} Players</span>
        </div>
      </div>

      {/* Dual Impact Quadrant Plot: BPRI vs BoPRI */}
      <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-royal-gold" />
              <span>Dual-Threat Matrix: Batting PRI (X) vs Bowling PRI (Y)</span>
            </h3>
            <p className="text-xs text-slate-400">
              The top-right quadrant represents players with balanced high impact in both disciplines under pressure.
            </p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis 
                type="number" 
                dataKey="bpri" 
                name="Batting PRI" 
                unit="" 
                stroke="#94A3B8" 
                fontSize={11} 
                domain={[45, 75]}
                label={{ value: 'Batting Pressure Reliability Index (BPRI)', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
              />
              <YAxis 
                type="number" 
                dataKey="bopri" 
                name="Bowling PRI" 
                unit="" 
                stroke="#94A3B8" 
                fontSize={11} 
                domain={[45, 80]}
                label={{ value: 'Bowling Pressure Reliability Index (BoPRI)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-navy-950 p-3 rounded-xl border border-navy-700 shadow-xl text-xs space-y-1">
                        <span className="font-bold text-white block text-sm">{data.name}</span>
                        <div className="text-slate-400">{data.country}</div>
                        <div className="text-royal-pink font-bold tabular">Batting PRI: {data.bpri}</div>
                        <div className="text-royal-cyan font-bold tabular">Bowling PRI: {data.bopri}</div>
                        <div className="text-royal-gold font-black tabular">All-Rounder ARPRI: {data.arpri}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine x={55} stroke="#334155" strokeDasharray="3 3" />
              <ReferenceLine y={55} stroke="#334155" strokeDasharray="3 3" />
              <Scatter name="All-Rounders" data={scatterData} onClick={(node) => onSelectPlayer && onSelectPlayer(node.id)}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.arpri >= 60 ? '#E2B714' : '#3B82F6'} 
                    className="cursor-pointer hover:r-7 transition-all"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All-Rounders Table */}
      <div className="royal-glass-card rounded-2xl border border-navy-700 overflow-hidden shadow-2xl">
        <div className="p-4 bg-navy-850 border-b border-navy-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-royal-gold" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              All-Rounder Pressure Rankings (ARPRI)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Harmonic formulation with volume damping</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-navy-750">
              <tr>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-3">Country & Team</th>
                <th className="py-3.5 px-3 text-right">Pressure Batting</th>
                <th className="py-3.5 px-3 text-right">BPRI</th>
                <th className="py-3.5 px-3 text-right">Pressure Bowling</th>
                <th className="py-3.5 px-3 text-right">BoPRI</th>
                <th className="py-3.5 px-4 text-right">Combined ARPRI</th>
                <th className="py-3.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {allRounders.map((ar, idx) => (
                <tr key={ar.player_id} className="hover:bg-navy-800/60 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-royal-gold transition-colors">
                      {ar.player_name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {ar.batting_style} / {ar.bowling_style}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-300 font-medium block">{ar.country}</span>
                    <span className="text-[10px] text-slate-500">{ar.current_ipl_team}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right tabular text-slate-300">
                    <span className="font-bold text-white">{ar.batting?.p_runs || 0}r</span> ({ar.batting?.p_balls || 0}b) @ {ar.batting?.p_sr || 0} SR
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-royal-pink tabular text-sm">
                    {ar.bpri}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular text-slate-300">
                    <span className="font-bold text-white">{ar.bowling?.p_wkts || 0}w</span> ({ar.bowling?.p_balls || 0}b) @ {ar.bowling?.p_econ || 0} Econ
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-royal-cyan tabular text-sm">
                    {ar.bopri}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-royal-gold tabular text-base">
                    {ar.arpri}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => onSelectPlayer && onSelectPlayer(ar.player_id)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-navy-750 hover:bg-royal-gold hover:text-navy-950 text-slate-300 border border-navy-700 transition-all"
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

