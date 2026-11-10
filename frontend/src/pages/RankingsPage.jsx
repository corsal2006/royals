import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Crosshair, 
  Download, 
  CheckCircle, 
  Filter, 
  Crown, 
  Info, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { fetchTop10 } from '../services/api';

export default function RankingsPage({ onSelectPlayer }) {
  const [data, setData] = useState({ batters: [], bowlers: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('both'); // both, batters, bowlers
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTop10()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const copyRankingsToClipboard = () => {
    let text = "=== SUPER-RR SELECTOR 2.0: OFFICIAL ROUND 1 PLAYER RANKINGS ===\n\n";
    text += "TOP 10 BATTERS UNDER PRESSURE (Rank 1 to 10):\n";
    data.batters.forEach(b => {
      text += `Rank ${b.rank}: ${b.striker_name} (BPRI: ${b.bpri} | ${b.p_balls}b, ${b.p_runs}r, SR ${b.p_sr.toFixed(1)}, Delta +${b.delta_sr.toFixed(1)})\n`;
    });
    text += "\nTOP 10 BOWLERS UNDER PRESSURE (Rank 1 to 10):\n";
    data.bowlers.forEach(b => {
      text += `Rank ${b.rank}: ${b.bowler_name} (BoPRI: ${b.bopri} | ${b.p_balls}b, ${b.p_wkts}w, Econ ${b.p_econ.toFixed(2)}, Delta Econ ${b.delta_econ > 0 ? '+' : ''}${b.delta_econ.toFixed(2)})\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="royal-glass-card rounded-2xl p-6 sm:p-8 border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-gold/10 border border-royal-gold/30 text-royal-gold text-xs font-bold tracking-wide">
            <Trophy className="w-3.5 h-3.5" />
            <span>Official Round 1 Submission Component 01</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Official Top 10 Player Rankings Under Pressure
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Rank 1 to Rank 10 ordered selections matching the dropdown fields on the Unstop submission portal.
            Every rank is supported by delivery-level evidence, Bayesian sample-size shrinkage, and normal-baseline comparison.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={copyRankingsToClipboard}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 shadow-sm transition-all"
          >
            {copied ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-royal-gold" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Form Entries'}</span>
          </button>

          <a
            href="/api/export/csv"
            download="UNSTOP_SUBMISSION_RANKINGS.csv"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Submission CSV</span>
          </a>
        </div>
      </div>

      {/* Category Toggle Bar */}
      <div className="flex items-center justify-between border-b border-navy-700 pb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveCategory('both')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'both' ? 'bg-royal-pink text-white shadow-royal-glow' : 'bg-navy-800 text-slate-400 hover:text-white'
            }`}
          >
            Dual View (Batters & Bowlers)
          </button>
          <button
            onClick={() => setActiveCategory('batters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'batters' ? 'bg-royal-pink text-white shadow-royal-glow' : 'bg-navy-800 text-slate-400 hover:text-white'
            }`}
          >
            Top 10 Batters Only
          </button>
          <button
            onClick={() => setActiveCategory('bowlers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'bowlers' ? 'bg-royal-cyan text-white shadow-blue-glow' : 'bg-navy-800 text-slate-400 hover:text-white'
            }`}
          >
            Top 10 Bowlers Only
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Filter: Minimum 100 pressure balls faced/bowled
        </span>
      </div>

      {/* Unstop Dropdown Simulator Box for Judges */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-850 to-navy-900 border border-royal-gold/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-royal-gold font-bold text-xs uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Unstop Dropdown Simulator</span>
        </div>
        <p className="text-xs text-slate-300 mb-6">
          Judges can inspect how each dropdown slot (Rank 1 through 10) maps directly to our mathematically verified candidate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Batters Dropdown Column */}
          {(activeCategory === 'both' || activeCategory === 'batters') && (
            <div className="space-y-3 bg-navy-900/80 p-4 rounded-xl border border-navy-750">
              <div className="flex items-center space-x-2 text-royal-pink font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4" />
                <span>Top 10 Batters (Unstop Dropdowns)</span>
              </div>

              {data.batters.map((b) => (
                <div key={b.rank} className="flex items-center space-x-3 text-xs">
                  <span className="w-16 font-mono font-bold text-slate-400">Rank {b.rank}:</span>
                  <div className="flex-1 flex items-center justify-between p-2 rounded-lg bg-navy-800 border border-navy-700">
                    <span className="font-bold text-white">{b.striker_name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-royal-gold font-bold tabular">{b.p_sr.toFixed(1)} SR</span>
                      <span className="text-[10px] text-royal-pink font-extrabold tabular">BPRI {b.bpri}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bowlers Dropdown Column */}
          {(activeCategory === 'both' || activeCategory === 'bowlers') && (
            <div className="space-y-3 bg-navy-900/80 p-4 rounded-xl border border-navy-750">
              <div className="flex items-center space-x-2 text-royal-cyan font-bold text-xs uppercase tracking-wider mb-2">
                <Crosshair className="w-4 h-4" />
                <span>Top 10 Bowlers (Unstop Dropdowns)</span>
              </div>

              {data.bowlers.map((b) => (
                <div key={b.rank} className="flex items-center space-x-3 text-xs">
                  <span className="w-16 font-mono font-bold text-slate-400">Rank {b.rank}:</span>
                  <div className="flex-1 flex items-center justify-between p-2 rounded-lg bg-navy-800 border border-navy-700">
                    <span className="font-bold text-white">{b.bowler_name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-royal-gold font-bold tabular">{b.p_econ.toFixed(2)} Econ</span>
                      <span className="text-[10px] text-royal-cyan font-extrabold tabular">BoPRI {b.bopri}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Side-by-Side Ranked Evidence Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Batters Table */}
        {(activeCategory === 'both' || activeCategory === 'batters') && (
          <div className="royal-glass-card rounded-2xl border border-navy-700 overflow-hidden shadow-xl">
            <div className="p-4 bg-navy-850 border-b border-navy-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-royal-pink" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top 10 Batters Under Pressure
                </h3>
              </div>
              <span className="text-[10px] font-bold text-royal-gold uppercase tracking-wider">
                Rank 1 to 10
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-navy-750">
                  <tr>
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-4">Batter</th>
                    <th className="py-3 px-3 text-right">BPRI</th>
                    <th className="py-3 px-3 text-right">Pressure SR</th>
                    <th className="py-3 px-3 text-right">Clutch Δ</th>
                    <th className="py-3 px-3 text-right">Avg</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {data.batters.map((b) => (
                    <tr key={b.rank} className="hover:bg-navy-800/60 transition-colors group">
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-[11px] ${
                          b.rank === 1 ? 'bg-royal-gold text-navy-950' :
                          b.rank === 2 ? 'bg-slate-300 text-navy-950' :
                          b.rank === 3 ? 'bg-amber-600 text-white' : 'bg-navy-800 text-slate-300'
                        }`}>
                          {b.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white group-hover:text-royal-pink transition-colors">
                          {b.striker_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {b.p_balls}b • {b.p_runs} runs
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-royal-pink tabular text-sm">
                        {b.bpri}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-royal-gold tabular">
                        {b.p_sr.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400 tabular">
                        +{b.delta_sr.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300 tabular">
                        {b.p_avg.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onSelectPlayer && onSelectPlayer(b.striker_id)}
                          className="px-2 py-1 rounded-md text-[10px] font-bold bg-navy-750 hover:bg-royal-pink hover:text-white text-slate-300 border border-navy-700 transition-all"
                        >
                          Evidence
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bowlers Table */}
        {(activeCategory === 'both' || activeCategory === 'bowlers') && (
          <div className="royal-glass-card rounded-2xl border border-navy-700 overflow-hidden shadow-xl">
            <div className="p-4 bg-navy-850 border-b border-navy-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-royal-cyan" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top 10 Bowlers Under Pressure
                </h3>
              </div>
              <span className="text-[10px] font-bold text-royal-gold uppercase tracking-wider">
                Rank 1 to 10
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-navy-750">
                  <tr>
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-4">Bowler</th>
                    <th className="py-3 px-3 text-right">BoPRI</th>
                    <th className="py-3 px-3 text-right">Econ</th>
                    <th className="py-3 px-3 text-right">Econ Δ</th>
                    <th className="py-3 px-3 text-right">Wkts</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {data.bowlers.map((b) => (
                    <tr key={b.rank} className="hover:bg-navy-800/60 transition-colors group">
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-[11px] ${
                          b.rank === 1 ? 'bg-royal-gold text-navy-950' :
                          b.rank === 2 ? 'bg-slate-300 text-navy-950' :
                          b.rank === 3 ? 'bg-amber-600 text-white' : 'bg-navy-800 text-slate-300'
                        }`}>
                          {b.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white group-hover:text-royal-cyan transition-colors">
                          {b.bowler_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {b.p_balls} balls bowled
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-royal-cyan tabular text-sm">
                        {b.bopri}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-royal-gold tabular">
                        {b.p_econ.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400 tabular">
                        {b.delta_econ > 0 ? `+${b.delta_econ.toFixed(1)}` : b.delta_econ.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300 tabular font-bold">
                        {b.p_wkts}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onSelectPlayer && onSelectPlayer(b.bowler_id)}
                          className="px-2 py-1 rounded-md text-[10px] font-bold bg-navy-750 hover:bg-royal-cyan hover:text-white text-slate-300 border border-navy-700 transition-all"
                        >
                          Evidence
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

