import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Flame, 
  Crosshair, 
  ShieldCheck, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  Zap,
  Target,
  Calculator,
  Plus,
  Check,
  RefreshCw,
  Coins,
  Printer
} from 'lucide-react';
import { fetchAuctionStrategy } from '../services/api';
import PlayerImage from '../components/PlayerImage';
import FifaPlayerCard from '../components/FifaPlayerCard';

const SIMULATED_TARGETS = [
  { id: 8661, name: "Matheesha Pathirana", role: "Death Sling Yorker Pacer", estPrice: 13.5, category: "Fast Bowler", impact: "Death Econ 8.29", pri: 73.4 },
  { id: 3644, name: "Kuldeep Yadav", role: "Wrist Spinner (Choke Middle)", estPrice: 11.5, category: "Spinner", impact: "Pressure Econ 6.51", pri: 88.3 },
  { id: 4708, name: "Rinku Singh", role: "Clutch Chase Finisher (LHB)", estPrice: 11.0, category: "Finisher", impact: "934 Pressure Runs", pri: 73.2 },
  { id: 6464, name: "Arshdeep Singh", role: "Left-Arm Death Pacer", estPrice: 12.0, category: "Fast Bowler", impact: "74 Pressure Wickets", pri: 64.9 },
  { id: 2756, name: "Shashank Singh", role: "Crisis Middle-Order Anchor", estPrice: 6.0, category: "Middle Order", impact: "Pressure Avg 57.8", pri: 71.0 },
  { id: 1077, name: "David Miller", role: "Elite Veteran Finisher", estPrice: 7.5, category: "Finisher", impact: "+76.9 SR Delta", pri: 74.6 },
  { id: 6256, name: "Varun Chakravarthy", role: "Mystery Carrom Spinner", estPrice: 9.0, category: "Spinner", impact: "Pressure Econ 6.77", pri: 78.9 },
  { id: 20702, name: "Tristan Stubbs", role: "Multi-Phase Power Striker", estPrice: 8.5, category: "Finisher", impact: "Pressure SR 175.9", pri: 70.1 },
];

export default function AuctionPage({ onSelectPlayer }) {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // ALL, Finisher, Bowler, Spinner
  const [auctionCardView, setAuctionCardView] = useState('cards'); // cards (FIFA), dossiers

  // Interactive Auction Purse Simulator State
  const [totalPurse, setTotalPurse] = useState(120); // standard ₹120 Cr IPL 2027 purse
  const [retentionCost, setRetentionCost] = useState(45); // ₹45 Cr retained by core (Samson, Jaiswal, Parag, Jurel, Hetmyer)
  const [selectedBids, setSelectedBids] = useState([8661, 3644, 4708]); // Default: Pathirana, Kuldeep, Rinku

  const toggleBid = (id) => {
    setSelectedBids(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchAuctionStrategy()
      .then(res => {
        setStrategy(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !strategy) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-pink"></div>
      </div>
    );
  }

  const targets = strategy.curated_targets || [];
  const filteredTargets = selectedCategory === 'ALL' 
    ? targets 
    : targets.filter(t => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-850 border border-royal-pink/40 p-8 sm:p-12 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-royal-pink/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-royal-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-pink/20 border border-royal-pink/40 text-royal-pink text-xs font-bold tracking-wide">
              <Crown className="w-4 h-4 text-royal-gold" />
              <span>Official IPL 2027 Auction Decision Support Module</span>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Auction Strategy (PDF)</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Rajasthan Royals <br />
            <span className="bg-gradient-to-r from-royal-pink via-pink-400 to-royal-gold bg-clip-text text-transparent">
              Auction Intelligence Hub
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-3xl">
            A championship squad is not built by chasing raw aggregate statistics. At the IPL 2027 auction, 
            <strong className="text-white"> Rajasthan Royals </strong> must target players with proven resilience in close finishes, 
            high required run rates, death overs, and playoff pressure. Here is RR's evidence-backed auction shortlist.
          </p>
        </div>

        {/* Existing Core Pillars */}
        <div className="mt-8 pt-6 border-t border-navy-800">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">
            Rajasthan Royals Core Pillars (Retained Foundation)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {strategy.core_pillars.map((c, idx) => (
              <div 
                key={idx} 
                onClick={() => c.player_id && onSelectPlayer && onSelectPlayer(c.player_id)}
                className="bg-navy-900/80 hover:bg-navy-850 p-2.5 rounded-xl border border-navy-750 flex items-center space-x-2.5 cursor-pointer transition-all group"
              >
                <PlayerImage player={c} name={c.name} size="sm" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white group-hover:text-royal-pink transition-colors truncate block">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">{c.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Strategic Auction Priorities */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-royal-gold" />
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Top 4 Squad-Strengthening Priorities for IPL 2027
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {strategy.auction_strategy_pillars.map((pillar) => (
            <div 
              key={pillar.priority}
              className="bg-white dark:bg-navy-850 rounded-2xl p-6 border border-slate-200 dark:border-navy-750 hover:border-royal-pink/40 shadow-sm dark:shadow-xl transition-all space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-royal-pink/15 text-royal-pink border border-royal-pink/30">
                  Priority {pillar.priority}
                </span>
                <span className="text-xs font-bold text-royal-gold dark:text-royal-gold-light">Target Role</span>
              </div>

              <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
                {pillar.need}
              </h3>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Recommended Targets:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{pillar.recommended_target}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {pillar.strategic_rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Player Shortlist Filter */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-navy-750 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Crown className="w-5 h-5 text-royal-pink" />
              <span>Ranked Auction Shortlist for Rajasthan Royals</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every candidate is selected based on pressure reliability, tactical role fit, and sample confidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex space-x-1.5 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <button
                onClick={() => setAuctionCardView('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  auctionCardView === 'cards' 
                    ? 'bg-royal-pink text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                FIFA Cards
              </button>
              <button
                onClick={() => setAuctionCardView('dossiers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  auctionCardView === 'dossiers' 
                    ? 'bg-royal-pink text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dossier Cards
              </button>
            </div>

            <div className="flex space-x-1">
              {['ALL', 'Finisher', 'Bowler', 'Spinner'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-royal-pink text-white shadow-sm' 
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'All Roles' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shortlist Cards Grid */}
        {auctionCardView === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTargets.map((target) => (
              <FifaPlayerCard 
                key={target.player_id}
                player={target}
                onSelect={onSelectPlayer}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTargets.map((target) => (
              <div 
                key={target.player_id}
                className="bg-white dark:bg-navy-850 rounded-2xl p-6 border border-slate-200 dark:border-navy-750 hover:border-royal-pink/40 shadow-sm dark:shadow-xl transition-all space-y-4 group"
              >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <PlayerImage playerId={target.player_id} player={target} name={target.name || target.player_name} size="md" className="shadow-sm" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-display font-black text-slate-900 dark:text-white group-hover:text-royal-pink transition-colors">
                        {target.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-royal-blue/10 dark:bg-royal-blue/20 text-royal-blue dark:text-royal-blue-light border border-royal-blue/30">
                        {target.auction_tier}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-royal-gold dark:text-royal-gold-light block mt-0.5">
                      {target.role_in_rr}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <Crown className="w-4 h-4 text-royal-gold" />
                    <span className="font-display font-black text-xl text-slate-900 dark:text-white tabular">
                      {target.pri_score}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                    PRI Score
                  </span>
                </div>
              </div>

              {/* Stat Highlight Banner */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Pressure Telemetry:</span>
                <span className="font-bold text-royal-pink dark:text-royal-gold tabular">{target.stat_highlight}</span>
              </div>

              {/* Tactical Rationale */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-royal-pink block">
                  Why Rajasthan Royals Must Back This Player
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {target.why_rr_must_buy}
                </p>
              </div>

              {/* Sample Confidence & Inspect Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-navy-750">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Confidence: {target.sample_confidence}
                </span>

                <button
                  onClick={() => onSelectPlayer && onSelectPlayer(target.player_id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-royal-pink hover:text-white dark:bg-navy-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 transition-all"
                >
                  <span>Inspect Full Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Interactive IPL 2027 Auction Purse & Clutch Index Simulator */}
      {(() => {
        const availablePurse = totalPurse - retentionCost;
        const activeBids = SIMULATED_TARGETS.filter(t => selectedBids.includes(t.id));
        const committedSpend = Math.round(activeBids.reduce((sum, t) => sum + t.estPrice, 0) * 10) / 10;
        const remainingPurse = Math.round((availablePurse - committedSpend) * 10) / 10;
        const hasDeathBowler = activeBids.some(t => t.category === 'Fast Bowler');
        const hasSpinner = activeBids.some(t => t.category === 'Spinner');
        const hasFinisher = activeBids.some(t => t.category === 'Finisher');
        const avgTargetPRI = activeBids.length > 0 
          ? (activeBids.reduce((s, t) => s + t.pri, 0) / activeBids.length).toFixed(1) 
          : '0.0';
        const clutchLift = Math.min(38.0, (activeBids.length * 8.5)).toFixed(1);
        const percentSpent = Math.min(100, Math.round((committedSpend / Math.max(availablePurse, 1)) * 100));

        return (
          <div className="bg-white dark:bg-navy-850 rounded-2xl p-6 sm:p-8 border border-royal-pink/30 shadow-md dark:shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-750">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold-dark dark:text-royal-gold text-[10px] font-bold uppercase tracking-wider">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Interactive Auction War-Room Simulator</span>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>Rajasthan Royals Auction Purse & Clutch Index Simulator</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulate bidding combinations, test budget allocation, and see projected clutch lift in close finishes.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedBids([8661, 3644, 4708])}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 transition-all"
                  title="Reset to recommended target trio"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-royal-pink" />
                  <span>Reset Trio</span>
                </button>
              </div>
            </div>

            {/* Top War-Room Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Available Purse</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white tabular">₹{availablePurse} Cr</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">₹{totalPurse} Cr - ₹{retentionCost} Cr core</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Committed Bid Spend</span>
                <span className="text-2xl font-black text-royal-gold dark:text-royal-gold-light tabular">₹{committedSpend} Cr</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{percentSpent}% of available purse</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                remainingPurse >= 15 
                  ? 'bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-navy-750' 
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/40'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Remaining Auction Purse</span>
                <span className={`text-2xl font-black tabular ${remainingPurse >= 15 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  ₹{remainingPurse} Cr
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {remainingPurse >= 15 ? 'Safe buffer for bench squad' : 'Caution: Tight squad budget'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-royal-pink/15 to-slate-50 dark:from-royal-pink/20 dark:to-navy-900 border border-royal-pink/40">
                <span className="text-[10px] uppercase font-bold text-royal-pink block">Projected Clutch Lift</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white tabular">+{clutchLift}%</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Avg PRI: {avgTargetPRI}</span>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Purse Allocation ({activeBids.length} Target Slots Selected)</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">₹{committedSpend} Cr / ₹{availablePurse} Cr</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-navy-950 overflow-hidden border border-slate-300 dark:border-navy-850">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    percentSpent > 85 ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-royal-pink to-royal-gold'
                  }`}
                  style={{ width: `${Math.min(100, percentSpent)}%` }}
                ></div>
              </div>
            </div>

            {/* Tactical Requirement Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mr-1">Tactical Must-Haves:</span>
              
              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                hasDeathBowler ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/40 text-rose-700 dark:text-rose-400'
              }`}>
                {hasDeathBowler ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>Death Yorker Specialist</span>
              </span>

              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                hasSpinner ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/40 text-rose-700 dark:text-rose-400'
              }`}>
                {hasSpinner ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>Middle-Overs Mystery Spinner</span>
              </span>

              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                hasFinisher ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/40 text-rose-700 dark:text-rose-400'
              }`}>
                {hasFinisher ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>Clutch Chase Finisher</span>
              </span>
            </div>

            {/* Interactive Target Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Select / Toggle Simulated Auction Targets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SIMULATED_TARGETS.map(t => {
                  const isSelected = selectedBids.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleBid(t.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-gradient-to-br from-royal-pink/15 to-slate-50 dark:from-royal-pink/20 dark:to-navy-850 border-royal-pink shadow-royal-glow' 
                          : 'bg-slate-50 dark:bg-navy-900/60 border-slate-200 dark:border-navy-750 hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-royal-pink text-white' : 'bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-400'
                          }`}>
                            {t.category}
                          </span>
                          <span className="font-bold text-royal-gold-dark dark:text-royal-gold font-mono">
                            ₹{t.estPrice} Cr
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2.5">
                          <PlayerImage player={t} name={t.name} size="sm" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white text-sm block leading-tight truncate">{t.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{t.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-slate-200 dark:border-navy-750/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400 font-mono">{t.impact}</span>
                        <span className={`font-bold flex items-center space-x-1 ${
                          isSelected ? 'text-royal-pink' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {isSelected ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>In Target List</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add Target</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Blueprint RR Playing XI Lineup Visualizer */}
      <div className="bg-white dark:bg-navy-850 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-750">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Crown className="w-5 h-5 text-royal-gold" />
              <span>Projected Rajasthan Royals Clutch Playing XI (IPL 2027)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Demonstrating how recommended pressure targets integrate with Rajasthan Royals' existing retained core.
            </p>
          </div>
          <span className="text-xs font-bold text-royal-pink px-3 py-1 rounded-full bg-royal-pink/15 border border-royal-pink/30">
            Balanced 7 Bat / 6 Bowl Balance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { pos: 1, name: "Yashasvi Jaiswal", type: "Retained Core", role: "Explosive Opener (LHB)", id: 6819 },
            { pos: 2, name: "Sanju Samson (C/WK)", type: "Retained Core", role: "Captain & Anchor / Accelerator", id: 2258 },
            { pos: 3, name: "Riyan Parag", type: "Retained Core", role: "Middle-Order Spine & Float Hitter", id: 6423 },
            { pos: 4, name: "Shashank Singh", type: "Recommended Target", role: "Crisis Recovery Specialist (Avg 57.8)", id: 2756 },
            { pos: 5, name: "David Miller / Tristan Stubbs", type: "Recommended Target", role: "Clutch Finisher (+61.5 SR Delta)", id: 1077 },
            { pos: 6, name: "Dhruv Jurel", type: "Retained Core", role: "Homegrown Chase Closer (178.3 SR)", id: 7260 },
            { pos: 7, name: "Rinku Singh / Shimron Hetmyer", type: "Recommended Target", role: "Premier Death Finisher (934 Pressure Runs)", id: 4708 },
            { pos: 8, name: "Kuldeep Yadav / Varun Chakravarthy", type: "Recommended Target", role: "Mystery Spin Lead (6.51 Econ)", id: 3644 },
            { pos: 9, name: "Trent Boult / Indian Swing", type: "Pace Core", role: "Powerplay Wicket Spearhead", id: 2320 },
            { pos: 10, name: "Arshdeep Singh", type: "Recommended Target", role: "Death Yorker Pacer (74 Pressure Wkts)", id: 6464 },
            { pos: 11, name: "Matheesha Pathirana", type: "Recommended Target", role: "Sling Death Closer (8.30 Econ at Death)", id: 8661 },
            { pos: 12, name: "Impact Player (Tactical)", type: "Flex Sub", role: "Batting / Bowling Matchup Specialist", id: null },
          ].map(p => (
            <div 
              key={p.pos}
              onClick={() => p.id && onSelectPlayer && onSelectPlayer(p.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                p.type === 'Recommended Target' 
                  ? 'bg-gradient-to-br from-royal-pink/10 to-slate-50 dark:from-royal-pink/15 dark:to-navy-900 border-royal-pink/40 shadow-sm dark:shadow-royal-glow hover:border-royal-pink' 
                  : 'bg-slate-50 dark:bg-navy-900/80 border-slate-200 dark:border-navy-750 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400">#{p.pos}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  p.type === 'Recommended Target' ? 'bg-royal-pink text-white' : 'bg-slate-200 dark:bg-navy-750 text-slate-700 dark:text-slate-300'
                }`}>
                  {p.type}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {p.id ? <PlayerImage player={p} name={p.name} size="xs" /> : null}
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white block text-sm truncate">{p.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{p.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
