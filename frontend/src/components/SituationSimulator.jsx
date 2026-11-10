import React, { useState } from 'react';
import { Gauge, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

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
  let categoryColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

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
    categoryColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else {
    category = 'NORMAL / LOW PRESSURE';
    categoryColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  }

  return (
    <div className="royal-glass-card rounded-2xl p-6 border border-navy-700 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-royal-pink/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-navy-700/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-royal-gold text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white mt-1">
            Real-Time Delivery Pressure Calculator ($P_{'{ball}'}$)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust match situation parameters to observe how the mathematical pressure engine assesses delivery leverage.
          </p>
        </div>

        {/* Live Gauge Display */}
        <div className="flex items-center space-x-4 bg-navy-900/90 px-5 py-3 rounded-xl border border-navy-700/80 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Calculated Pressure</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${categoryColor}`}>
              {category}
            </span>
          </div>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-navy-800 border-2 border-royal-pink/40 shadow-royal-glow">
            <span className="font-display font-black text-2xl text-white tabular">
              {pScore}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Innings Selector */}
        <div className="bg-navy-850/60 p-4 rounded-xl border border-navy-750">
          <label className="text-xs font-semibold text-slate-300 block mb-2">Innings Context</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInnings(2)}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                innings === 2 ? 'bg-royal-pink text-white shadow-royal-glow' : 'bg-navy-750 text-slate-400 hover:text-white'
              }`}
            >
              Innings 2 (Chasing)
            </button>
            <button
              onClick={() => setInnings(1)}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                innings === 1 ? 'bg-royal-blue text-white shadow-blue-glow' : 'bg-navy-750 text-slate-400 hover:text-white'
              }`}
            >
              Innings 1 (Setting)
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-navy-750/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Knockout / Playoff Match</span>
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
            <div className="bg-navy-850/60 p-4 rounded-xl border border-navy-750">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-300">Required Run Rate (RRR)</span>
                <span className="text-xs font-bold text-royal-gold tabular bg-royal-gold/10 px-2 py-0.5 rounded border border-royal-gold/20">
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
                className="w-full accent-royal-gold bg-navy-700 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>6.0 (Cruising)</span>
                <span>9.5 (Par)</span>
                <span>15.0+ (Crisis)</span>
              </div>
            </div>

            {/* Balls Remaining Slider */}
            <div className="bg-navy-850/60 p-4 rounded-xl border border-navy-750">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-300">Balls Remaining</span>
                <span className="text-xs font-bold text-royal-cyan tabular bg-royal-cyan/10 px-2 py-0.5 rounded border border-royal-cyan/20">
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
                className="w-full accent-royal-cyan bg-navy-700 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>1 (Last Ball)</span>
                <span>30 (Death: 5 ov)</span>
                <span>120 (Start)</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Over Number Slider for Innings 1 */}
            <div className="bg-navy-850/60 p-4 rounded-xl border border-navy-750">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-300">Over Number</span>
                <span className="text-xs font-bold text-royal-gold tabular bg-royal-gold/10 px-2 py-0.5 rounded border border-royal-gold/20">
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
                className="w-full accent-royal-gold bg-navy-700 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>Powerplay (1-6)</span>
                <span>Middle (7-15)</span>
                <span>Death (16-20)</span>
              </div>
            </div>

            <div className="bg-navy-850/60 p-4 rounded-xl border border-navy-750 flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-300 mb-1">Target Setting Phase</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {overNumber >= 16 
                  ? "Death Acceleration: High expectation to hit boundaries (10-14 RPO) against premier death bowling."
                  : overNumber <= 6 
                    ? "Powerplay Phase: High leverage to establish baseline without losing wickets in clusters."
                    : "Middle Overs: Rotating strike and attacking spin match-ups."
                }
              </p>
            </div>
          </>
        )}

        {/* Wickets Lost Slider */}
        <div className="bg-navy-850/60 p-4 rounded-xl border border-navy-750">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300">Wickets Fallen</span>
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
            className="w-full accent-royal-pink bg-navy-700 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
            <span>0 (Full Resources)</span>
            <span>5 (Tail Exposed)</span>
            <span>9 (Last Wicket)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

