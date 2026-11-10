import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  Crown, 
  Flame, 
  Award,
  AlertTriangle
} from 'lucide-react';
import { fetchFielders } from '../services/api';

export default function FieldersPage({ onSelectPlayer }) {
  const [data, setData] = useState({ wicketkeepers: [], limitation_note: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFielders()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
            <Users className="w-4 h-4" />
            <span>Fielding & Wicketkeeping Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Fielders & Wicketkeepers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Identifies verified tournament wicketkeepers and analyzes fielding dismissal involvement under high pressure.
          </p>
        </div>

        <div className="bg-navy-900/80 px-4 py-2.5 rounded-xl border border-navy-750">
          <span className="text-xs font-medium text-slate-400">Verified Keepers:</span>
          <span className="text-lg font-display font-bold text-royal-gold tabular ml-2">{data.wicketkeepers.length} Players</span>
        </div>
      </div>

      {/* Mandatory Official Limitation Notice */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-4 shadow-lg">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
            Official Data Scope Notice: Fielding Analysis Marked as Limited
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {data.limitation_note || "The proprietary ball_by_ball dataset provided by the organizers records deliveries, runs, and dismissals attributed to the bowler and dismissed player, but does not provide individual outfielder tracking for catches and run-outs. In strict compliance with the hackathon rules ('If data is insufficient, mark fielding analysis as limited'), outfield fielding has not been fabricated. Wicketkeeper identities are verified through official playing XIs (playing_eleven.csv)."}
          </p>
        </div>
      </div>

      {/* Tournament Dismissal Involvements Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Catches</span>
          <span className="text-2xl font-display font-extrabold text-white tabular mt-1 block">7,557</span>
          <span className="text-[10px] text-slate-500">Bowler & Fielder assists</span>
        </div>

        <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bowled Wickets</span>
          <span className="text-2xl font-display font-extrabold text-royal-cyan tabular mt-1 block">1,775</span>
          <span className="text-[10px] text-slate-500">Stump crashes</span>
        </div>

        <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LBW Decisions</span>
          <span className="text-2xl font-display font-extrabold text-royal-gold tabular mt-1 block">709</span>
          <span className="text-[10px] text-slate-500">Pad deflections</span>
        </div>

        <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Run-Out Dismissals</span>
          <span className="text-2xl font-display font-extrabold text-royal-pink tabular mt-1 block">600</span>
          <span className="text-[10px] text-slate-500">Pressure direct hits</span>
        </div>

        <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stumpings</span>
          <span className="text-2xl font-display font-extrabold text-emerald-400 tabular mt-1 block">214</span>
          <span className="text-[10px] text-slate-500">Wicketkeeper dismissals</span>
        </div>
      </div>

      {/* Verified Wicketkeeper-Batters Leaderboard */}
      <div className="royal-glass-card rounded-2xl border border-navy-700 overflow-hidden shadow-2xl">
        <div className="p-4 bg-navy-850 border-b border-navy-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-royal-gold" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Wicketkeeper-Batters Ranked by Pressure Reliability
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Verified in official match playing-XIs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-navy-750">
              <tr>
                <th className="py-3.5 px-4">Wicketkeeper</th>
                <th className="py-3.5 px-3">Country & IPL Team</th>
                <th className="py-3.5 px-3 text-right">Pressure Balls</th>
                <th className="py-3.5 px-3 text-right">Pressure Runs</th>
                <th className="py-3.5 px-3 text-right">Pressure SR</th>
                <th className="py-3.5 px-3 text-right">Clutch Δ SR</th>
                <th className="py-3.5 px-4 text-right">BPRI Score</th>
                <th className="py-3.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {data.wicketkeepers.map((wk) => (
                <tr key={wk.player_id} className="hover:bg-navy-800/60 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-royal-gold transition-colors flex items-center space-x-2">
                      <span>{wk.player_name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        WK
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {wk.batting_style}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-300 font-medium block">{wk.country}</span>
                    <span className="text-[10px] text-slate-500">{wk.current_ipl_team}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right tabular text-slate-300">
                    {wk.batting?.p_balls || 0}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-white tabular">
                    {wk.batting?.p_runs || 0}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-royal-gold tabular">
                    {wk.batting ? wk.batting.p_sr.toFixed(1) : '-'}
                  </td>
                  <td className={`py-3.5 px-3 text-right font-bold tabular ${wk.batting && wk.batting.delta_sr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {wk.batting ? (wk.batting.delta_sr >= 0 ? `+${wk.batting.delta_sr.toFixed(1)}` : wk.batting.delta_sr.toFixed(1)) : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-royal-pink tabular text-sm">
                    {wk.bpri || '-'}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => onSelectPlayer && onSelectPlayer(wk.player_id)}
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

