import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Flame, 
  Crosshair, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Printer
} from 'lucide-react';
import PlayerImage from './PlayerImage';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function PlayerModal({ player, onClose, onCompare }) {
  if (!player) return null;

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, situational, phases, scouting

  const isBatter = !!player.batting;
  const isBowler = !!player.bowling;
  const isAllRounder = isBatter && isBowler;

  // Comparison data for Normal vs Pressure Bar Chart
  const comparisonData = isBatter ? [
    { metric: 'Strike Rate', Normal: player.batting.norm_sr, Pressure: player.batting.p_sr },
    { metric: 'Average', Normal: player.batting.norm_avg, Pressure: player.batting.p_avg },
    { metric: 'Boundary %', Normal: Math.round(((player.batting.norm_fours || 0) + (player.batting.norm_sixes || 0)) / (player.batting.norm_balls || 1) * 100), Pressure: player.batting.p_bound_pct },
    { metric: 'Dot %', Normal: Math.round((player.batting.norm_dots || 0) / (player.batting.norm_balls || 1) * 100), Pressure: player.batting.p_dot_pct }
  ] : isBowler ? [
    { metric: 'Economy Rate', Normal: player.bowling.norm_econ, Pressure: player.bowling.p_econ },
    { metric: 'Bowling Avg', Normal: player.bowling.norm_avg, Pressure: player.bowling.p_avg },
    { metric: 'Dot Ball %', Normal: Math.round((player.bowling.norm_dots || 0) / (player.bowling.norm_balls || 1) * 100), Pressure: player.bowling.p_dot_pct },
    { metric: 'Bound Prev %', Normal: 75, Pressure: player.bowling.p_bound_prev }
  ] : [];

  // Phase breakdown data
  const phaseData = player.batting?.phase_breakdown ? [
    { phase: 'Powerplay (1-6)', balls: player.batting.phase_breakdown.Powerplay?.balls || 0, runs: player.batting.phase_breakdown.Powerplay?.runs || 0 },
    { phase: 'Middle (7-15)', balls: player.batting.phase_breakdown.Middle?.balls || 0, runs: player.batting.phase_breakdown.Middle?.runs || 0 },
    { phase: 'Death (16-20)', balls: player.batting.phase_breakdown.Death?.balls || 0, runs: player.batting.phase_breakdown.Death?.runs || 0 },
  ] : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="player-dossier-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm"
    >
      <div 
        id="player-dossier-modal"
        className="relative w-full max-w-4xl bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-750 shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col"
      >
        
        {/* Top Header Card */}
        <div className="relative p-5 sm:p-7 bg-slate-900 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-750 text-white">
          <div className="absolute top-4 right-4 flex items-center space-x-2 no-print">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 flex items-center space-x-1.5 text-xs font-semibold"
              title="Print or Save Official Player Dossier (PDF)"
            >
              <Printer className="w-4 h-4 text-royal-gold" />
              <span className="hidden sm:inline">Export PDF / Print</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-16 sm:pr-32">
            <div className="flex items-center space-x-4">
              <PlayerImage
                playerId={player.player_id}
                name={player.player_name}
                imageUrl={player.image_url}
                role={player.primary_role}
                size="lg"
                showBadge={true}
              />

              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                    {player.player_name}
                  </h2>
                  {player.is_wk && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      WK
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                  <span className="font-semibold text-royal-pink">{player.primary_role}</span>
                  <span>•</span>
                  <span>{player.current_ipl_team}</span>
                  <span>•</span>
                  <span>Age: {player.age ? `${player.age} yrs` : 'Verified Pro'}</span>
                  <span>•</span>
                  <span className="text-slate-400">{player.batting_style} / {player.bowling_style}</span>
                </div>
              </div>
            </div>

            {/* PRI Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pressure Reliability Index
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-royal-pink/20 border border-royal-pink/40">
                  <Crown className="w-4 h-4 text-royal-gold" />
                  <span className="font-display font-black text-xl text-white tabular">
                    {player.overall_pri || player.bpri || player.bopri}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">/ 100</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full border ${
                player.sample_confidence === 'HIGH' 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              }`}>
                {player.sample_confidence} SAMPLE CONFIDENCE
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs (Interactive UI only) */}
        <div className="flex border-b border-slate-200 dark:border-navy-750 bg-slate-100 dark:bg-navy-950 px-4 sm:px-6 overflow-x-auto no-scrollbar no-print">
          {[
            { id: 'overview', label: 'Overview & Pressure Delta' },
            { id: 'situational', label: 'Situational & Clutches' },
            { id: 'phases', label: 'Match Phases & Strokes' },
            { id: 'scouting', label: 'RR Scouting Verdict & Strategy' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-royal-pink text-royal-pink bg-royal-pink/5 dark:bg-royal-pink/10'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-scroll-body p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200">
          
          {/* SECTION 1: OVERVIEW & PRESSURE DELTA */}
          <div className={`${activeSubTab === 'overview' ? 'block' : 'hidden print:block'} space-y-6 print-avoid-break`}>
            <div className="hidden print:block text-xs font-bold uppercase tracking-wider text-royal-pink border-b pb-1 mb-2">
              1. Pressure Performance Baseline & Key Rates
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {isBatter && (
                <>
                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Pressure Runs</span>
                    <span className="text-xl font-display font-extrabold text-slate-900 dark:text-white tabular">{player.batting.p_runs}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Off {player.batting.p_balls} balls</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Pressure Strike Rate</span>
                    <span className="text-xl font-display font-extrabold text-royal-pink tabular">{player.batting.p_sr}</span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${player.batting.delta_sr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {player.batting.delta_sr >= 0 ? `+${player.batting.delta_sr}` : player.batting.delta_sr} vs Normal
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Pressure Average</span>
                    <span className="text-xl font-display font-extrabold text-slate-900 dark:text-white tabular">{player.batting.p_avg}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{player.batting.p_outs} dismissals</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Boundary Firepower</span>
                    <span className="text-xl font-display font-extrabold text-royal-gold tabular">{player.batting.p_bound_pct}%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{player.batting.p_fours} 4s • {player.batting.p_sixes} 6s</span>
                  </div>
                </>
              )}

              {isBowler && (
                <>
                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Pressure Wickets</span>
                    <span className="text-xl font-display font-extrabold text-slate-900 dark:text-white tabular">{player.bowling.p_wkts}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">In {player.bowling.p_balls} balls</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Pressure Economy</span>
                    <span className="text-xl font-display font-extrabold text-royal-pink tabular">{player.bowling.p_econ}</span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${player.bowling.delta_econ >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {player.bowling.delta_econ >= 0 ? `+${player.bowling.delta_econ} tighter` : `${player.bowling.delta_econ} leaked`}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Bowling Strike Rate</span>
                    <span className="text-xl font-display font-extrabold text-slate-900 dark:text-white tabular">{player.bowling.p_sr}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Balls per wicket</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-3.5 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Dot Ball Pressure</span>
                    <span className="text-xl font-display font-extrabold text-royal-cyan tabular">{player.bowling.p_dot_pct}%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{player.bowling.p_bound_prev}% bound prev</span>
                  </div>
                </>
              )}
            </div>

            {/* Normal vs Pressure Delta Comparison Chart */}
            <div className="bg-slate-50 dark:bg-navy-850 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-navy-750 no-print">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-royal-pink" />
                  <span>Normal vs High-Pressure Performance Comparison</span>
                </h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Green/Pink Delta shows clutch elevation</span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                    <XAxis dataKey="metric" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#070B19', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="Normal" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Normal Situation" />
                    <Bar dataKey="Pressure" fill="#EA1A7F" radius={[4, 4, 0, 0]} name="High Pressure (P ≥ 60)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pressure Strengths</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {player.key_strength || "Demonstrated resilience and positive strike/economy balance in crunch match situations."}
                </p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tactical Watchouts</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {player.risk_factor || "Potential matchup vulnerabilities against extreme pace or spin variations under high required run rates."}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: SITUATIONAL & CLUTCHES */}
          <div className={`${activeSubTab === 'situational' ? 'block' : 'hidden print:block'} space-y-6 print-avoid-break`}>
            <div className="hidden print:block text-xs font-bold uppercase tracking-wider text-royal-pink border-b pb-1 mb-2">
              2. Situational Leverage: Chasing, Defending & Death Overs
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {isBatter && (
                <>
                  <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-xs font-bold text-royal-pink uppercase tracking-wider block mb-1">
                      Chasing Target (Innings 2 Under Pressure)
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white tabular">
                        {player.batting.chase_p_sr} SR
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">({player.batting.chase_p_runs || 0} runs)</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Performance when chasing a target with escalating required run rate.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-xs font-bold text-royal-pink uppercase tracking-wider block mb-1">
                      Death Overs Acceleration (Overs 16-20)
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white tabular">
                        {player.batting.death_p_sr} SR
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">({player.batting.death_p_runs || 0} runs)</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Boundary conversion rate against specialized closing pacers.
                    </p>
                  </div>
                </>
              )}

              {isBowler && (
                <>
                  <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-xs font-bold text-royal-pink uppercase tracking-wider block mb-1">
                      Defending Totals (Innings 2)
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white tabular">
                        {player.bowling.defend_p_econ} Econ
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Ability to lock down opposing batters when defending small or tight targets.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                    <span className="text-xs font-bold text-royal-pink uppercase tracking-wider block mb-1">
                      Death Overs Closure (Overs 16-20)
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white tabular">
                        {player.bowling.death_p_econ} Econ
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">({player.bowling.p_yorkers || 0} yorkers)</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Run prevention and yorker accuracy in high-leverage closing deliveries.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Top Match Knocks or Spells */}
            {isBatter && player.batting.top_knocks && player.batting.top_knocks.length > 0 && (
              <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                  Top Pressure Knocks in Dataset
                </h4>
                <div className="space-y-2">
                  {player.batting.top_knocks.map((k, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Match #{k.match_id}</span>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-royal-pink tabular">{k.runs} Runs ({k.balls}b)</span>
                        <span className="text-slate-500 dark:text-slate-400 tabular">{k.fours} 4s • {k.sixes} 6s</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular">{Math.round((k.runs / k.balls) * 100)} SR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isBowler && player.bowling.top_spells && player.bowling.top_spells.length > 0 && (
              <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                  Top Pressure Bowling Spells in Dataset
                </h4>
                <div className="space-y-2">
                  {player.bowling.top_spells.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Match #{s.match_id}</span>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-royal-pink tabular">{s.wkts} Wickets</span>
                        <span className="text-slate-600 dark:text-slate-300 tabular">{s.runs_conceded} Runs ({s.legal_balls}b)</span>
                        <span className="text-royal-cyan font-bold tabular">{s.dots} Dots</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: MATCH PHASES & STROKES */}
          <div className={`${activeSubTab === 'phases' ? 'block' : 'hidden print:block'} space-y-6 print-avoid-break`}>
            <div className="hidden print:block text-xs font-bold uppercase tracking-wider text-royal-pink border-b pb-1 mb-2">
              3. Match Phase Breakdown & Stroke Distribution
            </div>

            {/* Stroke / Delivery Style Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {isBatter && player.batting.top_strokes && (
                <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Most Productive Strokes Under Pressure
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(player.batting.top_strokes).map(([stroke, count]) => (
                      <div key={stroke} className="flex justify-between text-xs py-1.5 border-b border-slate-200 dark:border-navy-800">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{stroke}</span>
                        <span className="font-bold text-royal-pink tabular">{count} shots</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isBowler && player.bowling.top_delivery_styles && (
                <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Go-To Deliveries Under Pressure
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(player.bowling.top_delivery_styles).map(([style, count]) => (
                      <div key={style} className="flex justify-between text-xs py-1.5 border-b border-slate-200 dark:border-navy-800">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{style}</span>
                        <span className="font-bold text-royal-cyan tabular">{count} balls</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: RR SCOUTING VERDICT & STRATEGY */}
          <div className={`${activeSubTab === 'scouting' ? 'block' : 'hidden print:block'} space-y-6 print-avoid-break`}>
            <div className="hidden print:block text-xs font-bold uppercase tracking-wider text-royal-pink border-b pb-1 mb-2">
              4. Rajasthan Royals Tactical Fit & Auction Verdict
            </div>

            <div className="bg-royal-pink/5 dark:bg-royal-pink/10 border border-royal-pink/30 p-5 sm:p-6 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-2 text-royal-pink font-bold text-xs uppercase tracking-widest mb-2">
                <Crown className="w-4 h-4 text-royal-gold" />
                <span>Rajasthan Royals Tactical Fit (IPL 2027 Auction)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                {player.rr_tactical_fit}
              </p>
            </div>

            {/* Tactical Roles and Matchup Fit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block tracking-wider">Recommended RR Role</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-1">{player.primary_role}</span>
              </div>
              <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block tracking-wider">Home Venue Fit (Jaipur)</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-1">High Tactial Synergies</span>
              </div>
              <div className="bg-slate-50 dark:bg-navy-850 p-4 rounded-2xl border border-slate-200 dark:border-navy-750">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block tracking-wider">Sample Credibility</span>
                <span className="text-xs sm:text-sm font-bold text-royal-pink block mt-1">{player.sample_confidence} ({player.batting?.p_balls || player.bowling?.p_balls} balls)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-100 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 flex justify-between items-center no-print">
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
            Official Data Pack • Verified Player Dossier
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => onCompare && onCompare(player.player_id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 transition-all"
            >
              Add to Compare
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-sm transition-all"
            >
              Close Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
