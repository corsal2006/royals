import React, { useState } from 'react';
import { Gauge, ShieldAlert, Sparkles, HelpCircle, Target, Users, Zap, Award } from 'lucide-react';

export default function SituationSimulator() {
  const [innings, setInnings] = useState(2);
  const [rrr, setRrr] = useState(11.5);
  const [wicketsLost, setWicketsLost] = useState(5);
  const [ballsRemaining, setBallsRemaining] = useState(24);
  const [isKnockout, setIsKnockout] = useState(true);
  const [overNumber, setOverNumber] = useState(18); // for innings 1

  // Compute live pressure index using exact engine formula
  let pressureIndex = 0;
  let category = 'LOW';
  let categoryColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  if (innings === 2) {
    const cRrr = 100.0 / (1.0 + Math.exp(-0.65 * (rrr - 9.5)));
    const cWkt = Math.pow(wicketsLost / 9.0, 1.8) * 100.0;
    const cStage = ballsRemaining <= 30 ? Math.max(0.0, (30.0 - ballsRemaining) / 30.0) * 100.0 : 0.0;
    
    let interaction = 0.0;
    if (rrr > 10.0 && wicketsLost >= 4) {
      interaction = Math.min(15.0, (rrr - 10.0) * (wicketsLost - 3));
    }
    const koBonus = isKnockout ? 12.0 : 0.0;
    
    pressureIndex = Math.min(100.0, Math.max(0.0, 0.42 * cRrr + 0.33 * cWkt + 0.25 * cStage + interaction + koBonus));
  } else {
    // Innings 1
    let p = 15.0;
    if (overNumber <= 6) {
      if (wicketsLost >= 3) p += 55.0;
      else if (wicketsLost >= 2) p += 30.0;
      else if (wicketsLost >= 1) p += 10.0;
    } else if (overNumber <= 12) {
      if (wicketsLost >= 5) p += 60.0;
      else if (wicketsLost >= 4) p += 45.0;
      else if (wicketsLost >= 3) p += 25.0;
    } else if (overNumber <= 15) {
      if (wicketsLost >= 6) p += 55.0;
      else if (wicketsLost >= 5) p += 40.0;
    }
    
    if (overNumber >= 16) {
      const deathBases = { 16: 40.0, 17: 48.0, 18: 56.0, 19: 64.0, 20: 72.0 };
      let dBase = deathBases[overNumber] || 50.0;
      if (wicketsLost >= 5) dBase += 15.0;
      p = Math.max(p, dBase);
    }
    const koBonus = isKnockout ? 12.0 : 0.0;
    pressureIndex = Math.min(100.0, Math.max(0.0, p + koBonus));
  }

  const pScore = Math.round(pressureIndex * 10) / 10;

  if (pScore >= 60.0) {
    category = 'HIGH PRESSURE (CLUTCH ZONE)';
    categoryColor = 'text-royal-pink bg-royal-pink/15 border-royal-pink/40 animate-pulse';
  } else if (pScore >= 35.0) {
    category = 'MEDIUM PRESSURE (TRANSITION)';
    categoryColor = 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else {
    category = 'NORMAL / LOW PRESSURE';
    categoryColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  }

  // Recommended Rajasthan Royals deployment based on situation
  const getTacticalDeployment = () => {
    if (innings === 2) {
      if (pScore >= 65.0) {
        return {
          batter: "Rinku Singh / David Miller",
          batterStat: "Clutch Δ SR +48.9 / +74.2",
          bowler: "Matheesha Pathirana",
          bowlerStat: "8.29 Death Econ, sling yorkers",
          plan: "Extreme leverage situation: Batters must take boundary risks against hard lengths. Bowlers must nail block-hole execution."
        };
      } else if (wicketsLost >= 4) {
        return {
          batter: "Shashank Singh",
          batterStat: "57.8 Pressure Avg, crisis spine",
          bowler: "Kuldeep Yadav",
          bowlerStat: "6.51 Econ, 10.55 Avg",
          plan: "Top-order collapse recovery: Rotate strike, build partnership, and target the weaker boundary."
        };
      } else {
        return {
          batter: "Sanju Samson / Yashasvi Jaiswal",
          batterStat: "Elite Top-Order Acceleration",
          bowler: "Trent Boult / Arshdeep Singh",
          bowlerStat: "Powerplay Wickets & Swing",
          plan: "Controlled chase: Exploit fielding restrictions without giving away soft dismissals."
        };
      }
    } else {
      if (overNumber >= 16) {
        return {
          batter: "Shimron Hetmyer / Tristan Stubbs",
          batterStat: "Death Overs SR 175+",
          bowler: "Matheesha Pathirana",
          bowlerStat: "44 Pressure Wickets",
          plan: "Death overs blitz: Clear front leg against pace, minimize dot balls, and finish above 185 par."
        };
      } else {
        return {
          batter: "Riyan Parag / Sanju Samson",
          batterStat: "Middle-Overs Spin Enforcers",
          bowler: "Kuldeep Yadav / Varun Chakravarthy",
          bowlerStat: "Sub-6.80 Economy containment",
          plan: "Innings building: Exploit matchups against spin and consolidate before the death overs."
        };
      }
    }
  };

  const deployment = getTacticalDeployment();

  return (
    <div className="bg-white dark:bg-navy-850 rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-royal-pink/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-700/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-royal-gold dark:text-royal-gold-light text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Match Simulator</span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
            Real-Time Delivery Pressure Calculator (P_ball)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust match situation parameters to observe how the mathematical pressure engine assesses delivery leverage.
          </p>
        </div>

        {/* Live Gauge Display */}
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-navy-900/90 px-5 py-3 rounded-xl border border-slate-200 dark:border-navy-700/80 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">Calculated Pressure</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${categoryColor}`}>
              {category}
            </span>
          </div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-navy-800 border-2 border-royal-pink/40 shadow-royal-glow">
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white tabular">
              {pScore}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Innings Selector */}
        <div className="bg-slate-50 dark:bg-navy-900/60 p-4 rounded-xl border border-slate-200 dark:border-navy-750">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Innings Context</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInnings(2)}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                innings === 2 ? 'bg-royal-pink text-white shadow-royal-glow' : 'bg-slate-200 dark:bg-navy-750 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Innings 2 (Chasing)
            </button>
            <button
              onClick={() => setInnings(1)}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                innings === 1 ? 'bg-royal-blue text-white shadow-blue-glow' : 'bg-slate-200 dark:bg-navy-750 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Innings 1 (Setting)
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-navy-750/80 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Playoff / Final Match (+12)</span>
            <input
              type="checkbox"
              checked={isKnockout}
              onChange={(e) => setIsKnockout(e.target.checked)}
              className="w-4 h-4 accent-royal-pink rounded cursor-pointer"
            />
          </div>
        </div>

        {innings === 2 ? (
          <>
            {/* Required Run Rate Slider */}
            <div className="bg-slate-50 dark:bg-navy-900/60 p-4 rounded-xl border border-slate-200 dark:border-navy-750">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Required Run Rate (RRR)</span>
                <span className="text-xs font-bold text-royal-gold-dark dark:text-royal-gold tabular bg-royal-gold/10 px-2 py-0.5 rounded border border-royal-gold/20">
                  {rrr.toFixed(1)} RPO
                </span>
              </div>
              <input
                type="range"
                min="5.0"
                max="18.0"
                step="0.5"
                value={rrr}
                onChange={(e) => setRrr(parseFloat(e.target.value))}
                className="w-full accent-royal-gold bg-slate-200 dark:bg-navy-700 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>6.0 (Cruising)</span>
                <span>9.5 (Par)</span>
                <span>15.0+ (Crisis)</span>
              </div>
            </div>

            {/* Balls Remaining Slider */}
            <div className="bg-slate-50 dark:bg-navy-900/60 p-4 rounded-xl border border-slate-200 dark:border-navy-750">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Balls Remaining</span>
                <span className="text-xs font-bold text-royal-blue dark:text-royal-cyan tabular bg-royal-blue/10 px-2 py-0.5 rounded border border-royal-blue/20">
                  {ballsRemaining} Balls ({(ballsRemaining / 6).toFixed(1)} ov)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="120"
                step="1"
                value={ballsRemaining}
                onChange={(e) => setBallsRemaining(parseInt(e.target.value))}
                className="w-full accent-royal-blue bg-slate-200 dark:bg-navy-700 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>1 (Last Ball)</span>
                <span>30 (Death: 5 ov)</span>
                <span>120 (Start)</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Over Number Slider for Innings 1 */}
            <div className="bg-slate-50 dark:bg-navy-900/60 p-4 rounded-xl border border-slate-200 dark:border-navy-750">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Over Number</span>
                <span className="text-xs font-bold text-royal-gold-dark dark:text-royal-gold tabular bg-royal-gold/10 px-2 py-0.5 rounded border border-royal-gold/20">
                  Over {overNumber} / 20
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={overNumber}
                onChange={(e) => setOverNumber(parseInt(e.target.value))}
                className="w-full accent-royal-gold bg-slate-200 dark:bg-navy-700 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>Powerplay (1-6)</span>
                <span>Middle (7-15)</span>
                <span>Death (16-20)</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-navy-900/60 p-4 rounded-xl border border-slate-200 dark:border-navy-750 flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Setting Phase</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {overNumber >= 16 
                  ? "Death Acceleration: Boundary surge expected against specialized death yorkers."
                  : overNumber <= 6 
                    ? "Powerplay Phase: Maximize field restrictions without early cluster wickets."
                    : "Middle Overs: Strike rotation and attacking spin matchups."
                }
              </p>
            </div>
          </>
        )}

        {/* Wickets Lost Slider */}
        <div className="bg-slate-50 dark:bg-navy-900/60 p-4 rounded-xl border border-slate-200 dark:border-navy-750">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Wickets Fallen</span>
            <span className="text-xs font-bold text-royal-pink tabular bg-royal-pink/10 px-2 py-0.5 rounded border border-royal-pink/20">
              {wicketsLost} / 10 Down
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="9"
            step="1"
            value={wicketsLost}
            onChange={(e) => setWicketsLost(parseInt(e.target.value))}
            className="w-full accent-royal-pink bg-slate-200 dark:bg-navy-700 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
            <span>0 (Full Resources)</span>
            <span>5 (Tail Exposed)</span>
            <span>9 (Last Wicket)</span>
          </div>
        </div>
      </div>

      {/* Real-time Rajasthan Royals Tactical Deployment Recommendation */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-royal-pink font-bold text-xs uppercase tracking-wide">
            <Award className="w-3.5 h-3.5" />
            <span>RR Live Tactical Deployment Blueprint</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {deployment.plan}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2.5 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Batting Anchor / Closer</span>
            <span className="font-bold text-slate-900 dark:text-white block">{deployment.batter}</span>
            <span className="text-[10px] text-royal-pink font-mono">{deployment.batterStat}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Bowling Weapon</span>
            <span className="font-bold text-slate-900 dark:text-white block">{deployment.bowler}</span>
            <span className="text-[10px] text-royal-blue dark:text-royal-cyan font-mono">{deployment.bowlerStat}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
