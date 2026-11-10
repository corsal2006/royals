import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Scale, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

export default function MethodologyPage() {
  const [activeTab, setActiveTab] = useState('pressure_def'); // pressure_def, formulas, shrinkage, validation, dictionary

  // Interactive Weight Calculator Demo
  const [srWeight, setSrWeight] = useState(35);
  const [avgWeight, setAvgWeight] = useState(25);
  const [deltaWeight, setDeltaWeight] = useState(20);
  const [boundWeight, setBoundWeight] = useState(20);

  const totalBatWeight = srWeight + avgWeight + deltaWeight + boundWeight;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="royal-glass-card rounded-2xl p-6 sm:p-8 border border-navy-700 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-blue/20 border border-royal-blue/40 text-royal-blue-light text-xs font-bold tracking-wide">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scientific & Analytical Integrity</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
          Pressure Reliability Index (PRI) Methodology
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
          Complete transparent documentation of delivery-level pressure modeling, baseline normalization, 
          Bayesian sample-size shrinkage, and statistical validation across 200,999 deliveries.
        </p>
      </div>

      {/* Methodology Navigation Tabs */}
      <div className="flex border-b border-navy-700 bg-navy-900/60 p-1.5 rounded-2xl overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'pressure_def', label: '1. Defining Match Pressure' },
          { id: 'formulas', label: '2. Scoring Formulas (BPRI & BoPRI)' },
          { id: 'shrinkage', label: '3. Bayesian Sample Shrinkage' },
          { id: 'validation', label: '4. Cricket Rules & Validation' },
          { id: 'dictionary', label: '5. Data Dictionary' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-royal-pink text-white shadow-royal-glow'
                : 'text-slate-400 hover:text-white hover:bg-navy-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: DEFINING MATCH PRESSURE */}
      {activeTab === 'pressure_def' && (
        <div className="space-y-6">
          <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
              <Scale className="w-5 h-5 text-royal-gold" />
              <span>The Delivery-Level Match Situation Reconstructor</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Cricket pressure is not static; it evolves ball-by-ball. Rather than arbitrarily labeling an entire 20-over match as "pressure", 
              our engine reconstructs the exact match state before each delivery:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Innings 2 Chasing Model */}
              <div className="bg-navy-900/80 p-5 rounded-xl border border-navy-750 space-y-3">
                <div className="flex items-center space-x-2 text-royal-pink font-bold text-xs uppercase tracking-wider">
                  <span>Innings 2 (Chasing Target Model)</span>
                </div>
                <div className="bg-navy-950 p-3 rounded-lg font-mono text-[11px] text-royal-gold leading-relaxed border border-navy-800">
                  P_ball = 0.42 * C_rrr + 0.33 * C_wkt + 0.25 * C_stage + Interaction + KO_Bonus
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>
                    <strong className="text-white">C_rrr (Required Run Rate Factor):</strong> Continuous sigmoid centered at 9.5 RPO:
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">100 / (1 + exp(-0.65 * (RRR - 9.5)))</div>
                  </li>
                  <li>
                    <strong className="text-white">C_wkt (Wicket Scarcity):</strong> Exponential penalty as wickets fall:
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">(Wickets_Lost / 9)^1.8 * 100</div>
                  </li>
                  <li>
                    <strong className="text-white">C_stage (Climax Urgency):</strong> Applied in the last 5 overs (balls remaining ≤ 30).
                  </li>
                  <li>
                    <strong className="text-white">Interaction Bonus:</strong> Triggered when RRR &gt; 10.0 and ≥ 4 wickets are lost.
                  </li>
                  <li>
                    <strong className="text-white">Knockout Bonus:</strong> +12.0 points for Finals, Qualifiers, and Eliminators.
                  </li>
                </ul>
              </div>

              {/* Innings 1 Setting Model */}
              <div className="bg-navy-900/80 p-5 rounded-xl border border-navy-750 space-y-3">
                <div className="flex items-center space-x-2 text-royal-cyan font-bold text-xs uppercase tracking-wider">
                  <span>Innings 1 (Target Setting Model)</span>
                </div>
                <div className="bg-navy-950 p-3 rounded-lg font-mono text-[11px] text-royal-gold leading-relaxed border border-navy-800">
                  P_ball = max(Crisis_Collapse, Death_Phase_Base) + KO_Bonus
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>
                    <strong className="text-white">Powerplay Collapse (Overs 1-6):</strong> If ≥ 3 wickets lost early, pressure escalates to +55.0 to reflect crisis rebuilding.
                  </li>
                  <li>
                    <strong className="text-white">Middle Overs Collapse (Overs 7-12):</strong> If ≥ 4 wickets lost, pressure rises to 65.0–85.0.
                  </li>
                  <li>
                    <strong className="text-white">Death Phase (Overs 16-20):</strong> Base pressure increases from 40.0 (over 16) to 72.0 (over 20), rising further if 5+ wickets are down.
                  </li>
                  <li>
                    <strong className="text-white">Super Overs (Innings 3 &amp; 4):</strong> Fixed at maximum 100.0 Pressure.
                  </li>
                </ul>
              </div>

            </div>

            {/* Threshold Categorization */}
            <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 flex flex-wrap items-center justify-between gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-royal-pink"></span>
                <span className="text-xs font-bold text-white">High Pressure (P ≥ 60.0):</span>
                <span className="text-xs text-slate-400">Top 19.55% of all tournament deliveries (39,289 balls)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="text-xs font-bold text-white">Medium Pressure (35.0 ≤ P &lt; 60.0):</span>
                <span className="text-xs text-slate-400">17.93% transition deliveries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-bold text-white">Normal Baseline (P &lt; 35.0):</span>
                <span className="text-xs text-slate-400">62.52% baseline game-flow deliveries</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SCORING FORMULAS */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-6">
            <h3 className="text-lg font-display font-bold text-white">
              Mathematical Scoring Formulations
            </h3>

            {/* BPRI */}
            <div className="bg-navy-900 p-5 rounded-xl border border-navy-750 space-y-3">
              <div className="flex items-center space-x-2 text-royal-pink font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Batting Pressure Reliability Index (BPRI)</span>
              </div>
              <div className="bg-navy-950 p-4 rounded-lg font-mono text-xs text-royal-gold border border-navy-800 leading-relaxed">
                Raw_Bat = 0.35 * S_sr + 0.25 * S_avg + 0.20 * S_delta + 0.20 * S_boundary <br />
                BPRI = w_sample * Raw_Bat + (1 - w_sample) * 50.0
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>• <strong>S_sr (35%):</strong> Pressure Strike Rate scaled from 100 to 200.</div>
                <div>• <strong>S_avg (25%):</strong> Pressure Average scaled from 10 to 45 runs/dismissal.</div>
                <div>• <strong>S_delta (20%):</strong> Clutch Delta ($SR_P - SR_N$) scaled from -20 to +40.</div>
                <div>• <strong>S_boundary (20%):</strong> Boundary % ($≥ 30\%$) and dot-ball avoidance ($≤ 20\%$).</div>
              </div>
            </div>

            {/* BoPRI */}
            <div className="bg-navy-900 p-5 rounded-xl border border-navy-750 space-y-3">
              <div className="flex items-center space-x-2 text-royal-cyan font-bold text-xs uppercase tracking-wider">
                <Crosshair className="w-4 h-4" />
                <span>Bowling Pressure Reliability Index (BoPRI)</span>
              </div>
              <div className="bg-navy-950 p-4 rounded-lg font-mono text-xs text-royal-gold border border-navy-800 leading-relaxed">
                Raw_Bowl = 0.35 * S_econ + 0.30 * S_wkt + 0.20 * S_strangle + 0.15 * S_delta_econ <br />
                BoPRI = w_sample * Raw_Bowl + (1 - w_sample) * 50.0
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>• <strong>S_econ (35%):</strong> Pressure Economy Rate scaled from 12.5 (worst) to 6.5 (elite).</div>
                <div>• <strong>S_wkt (30%):</strong> Breakthrough strike rate and bowling average.</div>
                <div>• <strong>S_strangle (20%):</strong> Dot ball percentage ($≥ 50\%$) and boundary denial ($≥ 90\%$).</div>
                <div>• <strong>S_delta_econ (15%):</strong> Economy improvement under pressure ($Econ_N - Econ_P$).</div>
              </div>
            </div>

            {/* ARPRI */}
            <div className="bg-navy-900 p-5 rounded-xl border border-navy-750 space-y-3">
              <div className="flex items-center space-x-2 text-royal-gold font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>All-Rounder Pressure Impact (ARPRI)</span>
              </div>
              <div className="bg-navy-950 p-4 rounded-lg font-mono text-xs text-royal-gold border border-navy-800 leading-relaxed">
                Harmonic_Mean = 2.0 * (BPRI * BoPRI) / (BPRI + BoPRI) <br />
                ARPRI = Harmonic_Mean * clip(Total_Pressure_Involvement / 400.0, 0.75, 1.15)
              </div>
              <p className="text-xs text-slate-300">
                The harmonic mean mathematically ensures that a pure batter with 2 fluke overs cannot top the all-rounder leaderboard. Both disciplines must contribute under pressure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: BAYESIAN SAMPLE SHRINKAGE */}
      {activeTab === 'shrinkage' && (
        <div className="space-y-6">
          <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Bayesian Sample-Size Shrinkage & Credibility Weighting</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              A notorious flaw in naive sports analytics is the "small sample trap" — e.g., a batter who faces 12 balls, hits 25 runs, and boasts a 208 SR. 
              To strictly prevent rewarding one-hit wonders, our engine applies Bayesian credibility weighting:
            </p>

            <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 font-mono text-xs text-royal-gold">
              w_sample = N_pressure_balls / (N_pressure_balls + K) <br />
              Final_Score = w_sample * Raw_Performance + (1 - w_sample) * Prior_Mean (50.0)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
                <span className="font-bold text-white block">Small Sample (30 balls)</span>
                <span className="text-slate-400 block mt-1">Weight: 33% raw, 67% prior. Score is heavily regressed to 50.0 mean.</span>
              </div>
              <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
                <span className="font-bold text-white block">Medium Sample (180 balls)</span>
                <span className="text-slate-400 block mt-1">Weight: 75% raw, 25% prior. Substantial credibility earned.</span>
              </div>
              <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
                <span className="font-bold text-white block">Large Sample (400+ balls)</span>
                <span className="text-slate-400 block mt-1">Weight: 87%+ raw. True, battle-tested sample reliability.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: VALIDATION & RULES */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold text-white">
              Official Cricket Scoring Rules & Rigorous Validation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Our data pipeline conforms to official ICC and IPL scoring definitions:
            </p>

            <div className="space-y-3">
              {[
                { title: "Byes and Leg-Byes Excluded from Bowler Economy", desc: "In official cricket rules, runs scored off byes or leg-byes are credited to team extras and not charged against the bowler's runs conceded or economy rate. Our ETL pipeline strictly enforces this separation." },
                { title: "Wides and No-Balls Counted to Bowler Economy", desc: "Wides and Oversteps (no-balls) are added to bowler runs conceded, but do not increment legal deliveries bowled. This ensures exact concordance with official bowling figures." },
                { title: "Run Outs and Retire Outs Excluded from Bowler Wickets", desc: "Only dismissals directly achieved by the bowler (Caught, Bowled, LBW, Stump, Hit Wicket) are credited to bowler wickets. Run-outs and retire-outs are isolated." },
                { title: "Target Reconstruction from Innings 1 Totals & DLS", desc: "Innings 2 targets are computed from Innings 1 total + 1, or revised DLS targets where rain interruptions occurred." }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-navy-850/80 border border-navy-750 text-xs">
                  <div className="flex items-center space-x-2 text-white font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DATA DICTIONARY */}
      {activeTab === 'dictionary' && (
        <div className="space-y-6">
          <div className="royal-glass-card rounded-2xl border border-navy-700 overflow-hidden shadow-xl">
            <div className="p-4 bg-navy-850 border-b border-navy-750">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Official Dataset Schema & Metric Dictionary
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-900 text-slate-400 uppercase text-[10px] font-bold border-b border-navy-800">
                  <tr>
                    <th className="py-3 px-4">Field / Metric</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Scope</th>
                    <th className="py-3 px-4">Definition & Analytical Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {[
                    { field: 'P_ball', type: 'Float [0-100]', scope: 'Delivery', def: 'Instantaneous match pressure index prior to delivery based on RRR, wickets, stage, and match context.' },
                    { field: 'BPRI', type: 'Float [0-100]', scope: 'Player (Bat)', def: 'Batting Pressure Reliability Index: finishing firepower, average, clutch delta, boundary % with shrinkage.' },
                    { field: 'BoPRI', type: 'Float [0-100]', scope: 'Player (Bowl)', def: 'Bowling Pressure Reliability Index: death economy, strike rate, dot %, boundary prevention with shrinkage.' },
                    { field: 'ARPRI', type: 'Float [0-100]', scope: 'Player (All)', def: 'All-Rounder Pressure Impact: harmonic mean of BPRI and BoPRI multiplied by volume factor.' },
                    { field: 'Clutch Delta SR', type: 'Float (Runs/100b)', scope: 'Player (Bat)', def: 'Pressure Strike Rate minus Normal Strike Rate. Positive values show clutch acceleration.' },
                    { field: 'Clutch Delta Econ', type: 'Float (Runs/ov)', scope: 'Player (Bowl)', def: 'Normal Economy minus Pressure Economy. Positive values show tighter containment under pressure.' },
                    { field: 'is_high_pressure', type: 'Boolean', scope: 'Delivery', def: 'True if P_ball ≥ 60.0 (top 19.55% of all tournament deliveries).' },
                    { field: 'is_wk', type: 'Boolean', scope: 'Player', def: 'Designated wicketkeeper in official match playing-XIs (playing_eleven.csv).' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-navy-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-royal-gold">{row.field}</td>
                      <td className="py-3 px-3 text-slate-400">{row.type}</td>
                      <td className="py-3 px-3 text-slate-300 font-medium">{row.scope}</td>
                      <td className="py-3 px-4 text-slate-300">{row.def}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

