import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Download, 
  Crown, 
  CheckCircle2, 
  Award, 
  ShieldAlert, 
  Trophy, 
  Flame, 
  Crosshair, 
  Layers, 
  Target, 
  ExternalLink,
  Sparkles,
  Maximize2
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "1. Official Problem Statement & Objective",
    subtitle: "SuperRR Selector 2.0 • Help Shape Rajasthan Royals",
    badge: "Challenge Objective",
    content: (
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        <div className="p-4 rounded-xl bg-royal-pink/10 border border-royal-pink/30 text-white font-medium">
          "Build a data-driven system that measures how batters and bowlers perform in high-pressure match situations compared with their usual performance levels. Use your system to identify and rank the players who deliver most consistently when it matters for Rajasthan Royals at the IPL 2027 auction."
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <h4 className="font-bold text-royal-gold text-xs uppercase tracking-wider">Required Submission Components</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>01. Player Rankings:</strong> Two ordered top-10 lists (batters & bowlers) selected from Unstop dropdowns.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>02. Methodology Report:</strong> Pressure definitions, formulas, fair comparisons, sample sizes, and RR evidence.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <h4 className="font-bold text-royal-pink text-xs uppercase tracking-wider">Core Analytical Principles</h4>
            <ul className="space-y-1.5 text-xs">
              <li>• Not a generic IPL stat site: Every metric targets pressure reliability.</li>
              <li>• Data integrity: Zero fabricated statistics or imaginary auction prices.</li>
              <li>• Bayesian shrinkage: Prevents small-sample fluke biases.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "2. Dataset Architecture & Scale",
    subtitle: "Official Proprietary Data Pack (2022–2026)",
    badge: "ETL & Pipeline",
    content: (
      <div className="space-y-6 text-sm text-slate-300 font-sans">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Deliveries</span>
            <span className="text-2xl font-black text-white tabular">200,999</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Delivery-level records</span>
          </div>
          <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Matches</span>
            <span className="text-2xl font-black text-royal-gold tabular">883</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">401 IPL • 482 T20I</span>
          </div>
          <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Competitions</span>
            <span className="text-2xl font-black text-royal-pink tabular">141</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">IPL 2022–2026, World Cups</span>
          </div>
          <div className="bg-navy-850 p-4 rounded-xl border border-navy-750">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Playing XI Records</span>
            <span className="text-2xl font-black text-royal-cyan tabular">28,381</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Role & WK designations</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-navy-750 space-y-2 text-xs">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Data Processing Pipeline Standards</h4>
          <p className="text-slate-400 leading-relaxed">
            All 6 official CSVs (competitions, teams, matches, ball_by_ball, playing_eleven, player_mapping) were 
            ingested without data loss. Legal balls were strictly differentiated from wides and no-balls. Bowler-conceded runs 
            accurately excluded byes and leg-byes in strict compliance with official ICC/IPL laws.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3. Pressure Situation Modeling",
    subtitle: "Continuous Delivery-Level Index (P_ball in [0, 100])",
    badge: "Pressure Engine",
    content: (
      <div className="space-y-4 text-xs text-slate-300 font-sans leading-relaxed">
        <p>
          Cricket leverage changes ball-by-ball. Our system reconstructs the cumulative match state 
          (score, wickets lost, legal balls bowled, target, required run rate) immediately preceding each delivery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <span className="font-bold text-royal-pink uppercase tracking-wider block">Innings 2: Chasing Model</span>
            <div className="p-2.5 rounded bg-navy-950 font-mono text-[11px] text-royal-gold border border-navy-800">
              P_ball = 0.42*C_rrr + 0.33*C_wkt + 0.25*C_stage + Interaction + KO
            </div>
            <ul className="space-y-1 text-slate-400">
              <li>• C_rrr: Sigmoid centered at 9.5 RRR. RRR &gt; 12.0 pushes score above 80.</li>
              <li>• C_wkt: Exponential scarcity penalty as wickets fall (0 to 100).</li>
              <li>• C_stage: Urgency multiplier in overs 16–20 (balls left ≤ 30).</li>
              <li>• Interaction: Compounding crisis bonus when RRR &gt; 10 and ≥ 4 down.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <span className="font-bold text-royal-cyan uppercase tracking-wider block">Innings 1: Setting Model</span>
            <div className="p-2.5 rounded bg-navy-950 font-mono text-[11px] text-royal-gold border border-navy-800">
              P_ball = max(Collapse_Crisis, Death_Phase_Base) + KO
            </div>
            <ul className="space-y-1 text-slate-400">
              <li>• Powerplay Crisis: +55.0 points if ≥ 3 wickets lost inside first 6 overs.</li>
              <li>• Middle Collapse: +60.0 points if 5+ wickets lost inside 12 overs.</li>
              <li>• Death Acceleration: Baseline 40–72 for overs 16–20 (+15 if tail exposed).</li>
              <li>• Super Overs: Automatic 100.0 Maximum Pressure.</li>
            </ul>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-royal-pink/10 border border-royal-pink/30 flex justify-between items-center text-xs">
          <span className="font-bold text-white">Resulting High-Pressure Deliveries (P ≥ 60.0):</span>
          <span className="font-mono font-bold text-royal-pink">39,289 balls (19.55% of all balls)</span>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "4. Scoring Methodology & Sample-Size Shrinkage",
    subtitle: "Pressure Reliability Index (PRI) Mathematical Foundations",
    badge: "PRI Science",
    content: (
      <div className="space-y-5 text-xs text-slate-300 font-sans leading-relaxed">
        <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
          <h4 className="font-bold text-royal-gold uppercase tracking-wider">Bayesian Credibility Weighting</h4>
          <p className="text-slate-400">
            To prevent small samples from distorting rankings, every player's raw score is dampened toward the league pressure mean (50.0) based on sample volume:
          </p>
          <div className="p-3 rounded-lg bg-navy-950 font-mono text-[11px] text-royal-gold border border-navy-800">
            w_sample = N_pressure_balls / (N_pressure_balls + 60.0) <br />
            PRI = w_sample * Raw_Performance + (1 - w_sample) * 50.0
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-1.5">
            <span className="font-bold text-royal-pink uppercase tracking-wider block">Batting PRI Weights</span>
            <div>• Finishing Firepower (Pressure SR): <strong>35%</strong></div>
            <div>• Wicket Preservation (Pressure Avg): <strong>25%</strong></div>
            <div>• Clutch Delta ($SR_P - SR_N$): <strong>20%</strong></div>
            <div>• Boundary % & Dot Avoidance: <strong>20%</strong></div>
          </div>

          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-1.5">
            <span className="font-bold text-royal-cyan uppercase tracking-wider block">Bowling PRI Weights</span>
            <div>• Economy Containment: <strong>35%</strong></div>
            <div>• Breakthrough Strike Rate & Avg: <strong>30%</strong></div>
            <div>• Boundary Denial & Dot Ball Rate: <strong>20%</strong></div>
            <div>• Economy Delta ($Econ_N - Econ_P$): <strong>15%</strong></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "5. Official Top 10 Batters Under Pressure",
    subtitle: "Unstop Dropdown Selections (Rank 1 to 10)",
    badge: "Official Submission",
    content: (
      <div className="space-y-4 text-xs font-sans">
        <div className="overflow-x-auto rounded-xl border border-navy-750 bg-navy-900">
          <table className="w-full text-left">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] font-bold border-b border-navy-750">
              <tr>
                <th className="py-2.5 px-3">Unstop Rank</th>
                <th className="py-2.5 px-4">Player Name</th>
                <th className="py-2.5 px-3 text-right">BPRI</th>
                <th className="py-2.5 px-3 text-right">Pressure SR</th>
                <th className="py-2.5 px-3 text-right">Clutch Δ SR</th>
                <th className="py-2.5 px-3 text-right">Pressure Avg</th>
                <th className="py-2.5 px-3 text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {[
                { r: 1, name: "Naman Dhir", bpri: 81.95, sr: "201.6", d: "+57.7", avg: "37.1", b: "184b" },
                { r: 2, name: "Suryakumar Yadav", bpri: 77.89, sr: "202.6", d: "+44.7", avg: "28.8", b: "227b" },
                { r: 3, name: "David Miller", bpri: 74.62, sr: "190.2", d: "+76.9", avg: "27.8", b: "307b" },
                { r: 4, name: "Rinku Singh", bpri: 73.16, sr: "172.3", d: "+48.9", avg: "34.6", b: "542b" },
                { r: 5, name: "Shashank Singh", bpri: 71.04, sr: "163.8", d: "+28.6", avg: "57.8", b: "282b" },
                { r: 6, name: "Tristan Stubbs", bpri: 70.05, sr: "175.9", d: "+61.3", avg: "28.2", b: "307b" },
                { r: 7, name: "Marcus Stoinis", bpri: 70.00, sr: "179.7", d: "+43.4", avg: "26.6", b: "281b" },
                { r: 8, name: "Matthew Wade", bpri: 69.44, sr: "165.3", d: "+56.8", avg: "40.9", b: "173b" },
                { r: 9, name: "Tim David", bpri: 68.30, sr: "175.6", d: "+12.0", avg: "39.2", b: "513b" },
                { r: 10, name: "Donovan Ferreira", bpri: 66.59, sr: "179.2", d: "+36.1", avg: "30.1", b: "168b" }
              ].map(row => (
                <tr key={row.r} className="hover:bg-navy-800/40">
                  <td className="py-2.5 px-3 font-bold text-royal-gold">Rank {row.r}</td>
                  <td className="py-2.5 px-4 font-bold text-white">{row.name}</td>
                  <td className="py-2.5 px-3 text-right font-black text-royal-pink">{row.bpri}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-royal-gold">{row.sr}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{row.d}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{row.avg}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "6. Official Top 10 Bowlers Under Pressure",
    subtitle: "Unstop Dropdown Selections (Rank 1 to 10)",
    badge: "Official Submission",
    content: (
      <div className="space-y-4 text-xs font-sans">
        <div className="overflow-x-auto rounded-xl border border-navy-750 bg-navy-900">
          <table className="w-full text-left">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] font-bold border-b border-navy-750">
              <tr>
                <th className="py-2.5 px-3">Unstop Rank</th>
                <th className="py-2.5 px-4">Player Name</th>
                <th className="py-2.5 px-3 text-right">BoPRI</th>
                <th className="py-2.5 px-3 text-right">Pressure Econ</th>
                <th className="py-2.5 px-3 text-right">Econ Δ</th>
                <th className="py-2.5 px-3 text-right">Pressure Wkts</th>
                <th className="py-2.5 px-3 text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {[
                { r: 1, name: "Kuldeep Yadav", bopri: 88.34, econ: "6.51", d: "+1.78", w: 36, b: "350b" },
                { r: 2, name: "Abrar Ahmed", bopri: 80.96, econ: "4.80", d: "+2.63", w: 15, b: "210b" },
                { r: 3, name: "Sufiyan Muqeem", bopri: 80.03, econ: "5.60", d: "+0.46", w: 15, b: "134b" },
                { r: 4, name: "Varun Chakravarthy", bopri: 78.94, econ: "6.77", d: "+1.55", w: 32, b: "414b" },
                { r: 5, name: "Shadab Khan", bopri: 77.20, econ: "5.79", d: "+2.63", w: 10, b: "113b" },
                { r: 6, name: "Mohammad Nawaz", bopri: 75.44, econ: "5.63", d: "+2.05", w: 11, b: "162b" },
                { r: 7, name: "Matheesha Pathirana", bopri: 73.40, econ: "8.29", d: "+0.30", w: 44, b: "400b" },
                { r: 8, name: "Akeal Hosein", bopri: 73.12, econ: "4.95", d: "+3.15", w: 8, b: "132b" },
                { r: 9, name: "Maheesh Theekshana", bopri: 72.81, econ: "6.95", d: "+0.74", w: 24, b: "311b" },
                { r: 10, name: "Noor Ahmad", bopri: 72.59, econ: "7.22", d: "+0.65", w: 20, b: "236b" }
              ].map(row => (
                <tr key={row.r} className="hover:bg-navy-800/40">
                  <td className="py-2.5 px-3 font-bold text-royal-gold">Rank {row.r}</td>
                  <td className="py-2.5 px-4 font-bold text-white">{row.name}</td>
                  <td className="py-2.5 px-3 text-right font-black text-royal-cyan">{row.bopri}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-royal-gold">{row.econ}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{row.d}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">{row.w}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "7. All-Rounder & Fielding Insights",
    subtitle: "Dual-Impact Pressure Performers & Data Transparency",
    badge: "Holistic Squad Metrics",
    content: (
      <div className="space-y-5 text-xs text-slate-300 font-sans leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <span className="font-bold text-royal-gold uppercase tracking-wider block">Top All-Rounders (ARPRI)</span>
            <ul className="space-y-1.5 text-slate-300">
              <li>• <strong>Rashid Khan (ARPRI 66.31):</strong> 41 pressure wickets @ 7.72 econ + 691 pressure runs.</li>
              <li>• <strong>Ravindra Jadeja (ARPRI 65.74):</strong> 65.3 BoPRI + 50.9 BPRI; championship pedigree.</li>
              <li>• <strong>Jason Holder (ARPRI 64.88):</strong> 45 pressure wickets @ 8.99 econ + 259 pressure runs.</li>
              <li>• <strong>Andre Russell (ARPRI 61.55):</strong> 55.0 BoPRI + 52.2 BPRI (170+ SR muscle).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider block">Fielding Model Transparency</span>
            <p className="text-slate-400">
              The official dataset attributes delivery dismissals to bowler and dismissed player, without individual 
              outfield fielder tracking for catches and runouts. In accordance with problem statement rules, 
              fielding analysis is marked as limited. Wicketkeepers are verified via official playing XIs (108 identified).
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "8. Comparative Analysis & Clutch Head-to-Head",
    subtitle: "Resolving High-Stakes Auction Dilemmas",
    badge: "Decision Analysis",
    content: (
      <div className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <h4 className="font-bold text-royal-pink text-xs uppercase tracking-wider">Death Overs Spearmhead: Pathirana vs Arshdeep</h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>Matheesha Pathirana (BoPRI 73.4)</strong> delivers an elite 8.30 death economy with dipping yorkers from a sling angle. 
              <strong> Arshdeep Singh (BoPRI 67.1)</strong> brings unmatched volume (775 balls, 74 wickets) and left-arm swing. 
              <br /><em className="text-royal-gold">Verdict:</em> Pathirana offers higher per-ball ceiling; Arshdeep frees up an overseas slot.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
            <h4 className="font-bold text-royal-cyan text-xs uppercase tracking-wider">Spin Strangler: Kuldeep vs Varun Chakravarthy</h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>Kuldeep Yadav (BoPRI 88.34)</strong> achieves a staggering 6.51 pressure economy (#1 overall). 
              <strong> Varun Chakravarthy (BoPRI 78.94)</strong> boasts an elite 6.77 pressure economy with multi-directional carrom balls. 
              <br /><em className="text-royal-gold">Verdict:</em> Either spinner transforms Rajasthan Royals' middle-overs choke rate at Jaipur.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "9. Rajasthan Royals IPL 2027 Squad Blueprint",
    subtitle: "Actionable Auction Strategy Tailored for RR Core",
    badge: "RR Decision Support",
    content: (
      <div className="space-y-5 text-xs text-slate-300 font-sans leading-relaxed">
        <div className="p-4 rounded-xl bg-gradient-to-r from-royal-pink/15 to-navy-900 border border-royal-pink/30 space-y-1">
          <span className="font-bold text-royal-pink uppercase tracking-wider block text-[11px]">Core Integration Rationale</span>
          <p className="text-slate-200">
            With Sanju Samson, Yashasvi Jaiswal, Riyan Parag, Dhruv Jurel, and Shimron Hetmyer anchoring the foundation, 
            RR's specific vulnerability in close knockout finishes is death overs containment and chase closer composure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-navy-850 p-3 rounded-xl border border-navy-750">
            <span className="text-[10px] text-royal-pink font-bold block uppercase">Priority 1 Target</span>
            <span className="font-bold text-white text-sm block mt-0.5">Matheesha Pathirana</span>
            <span className="text-[10px] text-slate-400">Death closer overs 18 & 20</span>
          </div>
          <div className="bg-navy-850 p-3 rounded-xl border border-navy-750">
            <span className="text-[10px] text-royal-cyan font-bold block uppercase">Priority 2 Target</span>
            <span className="font-bold text-white text-sm block mt-0.5">Kuldeep Yadav</span>
            <span className="text-[10px] text-slate-400">Jaipur middle overs choke</span>
          </div>
          <div className="bg-navy-850 p-3 rounded-xl border border-navy-750">
            <span className="text-[10px] text-royal-gold font-bold block uppercase">Priority 3 Target</span>
            <span className="font-bold text-white text-sm block mt-0.5">Rinku Singh</span>
            <span className="text-[10px] text-slate-400">Ice-cold finisher at #6</span>
          </div>
          <div className="bg-navy-850 p-3 rounded-xl border border-navy-750">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Priority 4 Target</span>
            <span className="font-bold text-white text-sm block mt-0.5">Shashank Singh</span>
            <span className="text-[10px] text-slate-400">Crisis recovery anchor</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "10. Limitations, Defensibility & Scalability",
    subtitle: "Transparent Scientific Governance",
    badge: "Judging Defensibility",
    content: (
      <div className="space-y-4 text-xs text-slate-300 font-sans leading-relaxed">
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750">
            <strong className="text-white block mb-0.5">Defensible Formulation</strong>
            <p className="text-slate-400">No opaque black-box machine learning was falsely claimed. The Pressure Reliability Index is an explainable, statistically justified index combining leverage theory and Bayesian credibility.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750">
            <strong className="text-white block mb-0.5">Documented Data Limitations</strong>
            <p className="text-slate-400">Outfield fielding metrics were transparently acknowledged as limited due to lack of delivery-level fielder coordinates in the official dataset.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-850 border border-navy-750">
            <strong className="text-white block mb-0.5">Reproducibility</strong>
            <p className="text-slate-400">Every metric is 100% reproducible via Python pipeline, SQLite database, and complete methodology documentation.</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function SubmissionDeckPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Control Top Bar */}
      <div className="print:hidden royal-glass-card rounded-2xl p-4 sm:p-6 border border-navy-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-royal-pink to-royal-blue text-white shadow-royal-glow">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white">
              Official Hackathon Judging Walkthrough Mode
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 10-slide defensible evaluation deck for judges & evaluators.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-royal-gold" />
            <span>Print / Save PDF</span>
          </button>

          <a
            href="/api/export/csv"
            download="UNSTOP_SUBMISSION_RANKINGS.csv"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </a>
        </div>
      </div>

      {/* Main Slide Card (Interactive Screen View) */}
      <div className="print:hidden royal-glass-card rounded-3xl border border-navy-700 shadow-2xl p-6 sm:p-10 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-royal-pink/5 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          {/* Slide Header */}
          <div className="flex items-center justify-between border-b border-navy-750 pb-5 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-royal-pink/15 text-royal-pink border border-royal-pink/30 mb-2 inline-block">
                {currentSlide.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {currentSlide.subtitle}
              </p>
            </div>

            <div className="text-right">
              <span className="font-display font-black text-2xl text-royal-gold tabular">
                {String(currentSlide.id).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-500 font-bold"> / 10</span>
            </div>
          </div>

          {/* Slide Content */}
          <div className="py-2">
            {currentSlide.content}
          </div>
        </div>

        {/* Slide Bottom Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-navy-750 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          {/* Slide Indicators */}
          <div className="hidden sm:flex items-center space-x-1.5">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlideIndex 
                    ? 'w-7 bg-royal-pink' 
                    : 'bg-navy-700 hover:bg-slate-500'
                }`}
                title={`Jump to Slide ${s.id}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === SLIDES.length - 1}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Print View: Full 10-Slide Deck */}
      <div className="hidden print:block space-y-8">
        {SLIDES.map((slide) => (
          <div key={slide.id} className="print-slide">
            <div>
              <div className="flex items-center justify-between border-b border-navy-750 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-royal-pink/20 text-royal-pink border border-royal-pink/40 mb-1 inline-block">
                    {slide.badge}
                  </span>
                  <h2 className="text-xl font-display font-black text-white">
                    {slide.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {slide.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display font-black text-xl text-royal-gold tabular">
                    {String(slide.id).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-slate-500 font-bold"> / 10</span>
                </div>
              </div>

              <div className="py-2">
                {slide.content}
              </div>
            </div>

            <div className="pt-4 border-t border-navy-800 text-[10px] text-slate-500 flex justify-between items-center">
              <span>ROYAL SCOUT AI • SuperRR Selector 2.0 • Rajasthan Royals Official Submission</span>
              <span>Slide {slide.id} of 10</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

