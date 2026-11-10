import React from 'react';
import { Crown, Sparkles, Flame, Crosshair, Shield, Zap, ExternalLink, GitCompare } from 'lucide-react';
import PlayerImage from './PlayerImage';

// Country flag mapping
const COUNTRY_FLAGS = {
  'India': '🇮🇳',
  'Australia': '🇦🇺',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'South Africa': '🇿🇦',
  'West Indies': '🌴',
  'New Zealand': '🇳🇿',
  'Sri Lanka': '🇱🇰',
  'Afghanistan': '🇦🇫',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Ireland': '🇮🇪',
  'Zimbabwe': '🇿🇼',
  'Netherlands': '🇳🇱'
};

export default function FifaPlayerCard({ 
  player, 
  onSelect, 
  onCompare,
  variant = 'gold', // 'gold' | 'totw' | 'diamond' | 'compact'
  showCompareBtn = true,
  highlightStat = null, // for comparison battles
  winningStats = []      // list of keys that this card won in comparison
}) {
  if (!player) return null;

  const pid = player.player_id || player.striker_id || player.bowler_id || player.id;
  const name = player.player_name || player.name || 'Unknown';
  const role = player.primary_role || player.role || player.category || 'Cricketer';
  const country = player.country || 'India';
  const flag = COUNTRY_FLAGS[country] || '🏏';
  const team = player.current_team || player.team || 'IPL';
  
  // Overall Rating (PRI score out of 100)
  const rating = Math.round(Number(player.overall_pri || player.pri_score || player.bpri || player.bopri || 75));

  // Determine Position Badge (BAT, BWL, ALL, WK)
  const lowerRole = role.toLowerCase();
  let posBadge = 'BAT';
  let roleIcon = Flame;
  let cardTheme = 'gold';

  if (lowerRole.includes('all-rounder') || lowerRole.includes('all rounder')) {
    posBadge = 'ALL';
    roleIcon = Zap;
    cardTheme = 'diamond';
  } else if (lowerRole.includes('wicket') || lowerRole.includes('wk') || lowerRole.includes('keeper')) {
    posBadge = 'WK';
    roleIcon = Shield;
    cardTheme = 'gold';
  } else if (lowerRole.includes('bowl') || lowerRole.includes('pacer') || lowerRole.includes('spinner')) {
    posBadge = 'BWL';
    roleIcon = Crosshair;
    cardTheme = 'totw';
  }

  // 6 FIFA Attributes Calculation
  const isBowler = posBadge === 'BWL' || (!player.batting && player.bowling);
  const isAllRounder = posBadge === 'ALL';

  let statsGrid = [];

  if (isAllRounder) {
    const bpri = player.bpri ? Math.round(player.bpri) : (player.batting ? Math.round(player.batting.p_sr / 2) : 50);
    const bopri = player.bopri ? Math.round(player.bopri) : (player.bowling ? Math.round((12 - player.bowling.p_econ) * 10) : 50);
    const sr = player.batting ? Math.round(player.batting.p_sr) : 0;
    const econ = player.bowling ? player.bowling.p_econ.toFixed(2) : '-';
    const runs = player.batting ? player.batting.p_runs : 0;
    const wkts = player.bowling ? player.bowling.p_wkts : 0;

    statsGrid = [
      { key: 'bat', label: 'BAT', value: bpri, sub: 'Bat PRI' },
      { key: 'bwl', label: 'BWL', value: bopri, sub: 'Bowl PRI' },
      { key: 'str', label: 'STR', value: sr, sub: 'Press. SR' },
      { key: 'ecn', label: 'ECN', value: econ, sub: 'Economy' },
      { key: 'run', label: 'RUN', value: runs, sub: 'Press. Runs' },
      { key: 'wkt', label: 'WKT', value: wkts, sub: 'Press. Wkts' },
    ];
  } else if (isBowler) {
    const wkts = player.bowling?.p_wkts || 0;
    const econ = player.bowling ? player.bowling.p_econ.toFixed(2) : '-';
    const dot = player.bowling ? `${player.bowling.p_dot_pct.toFixed(0)}%` : '-';
    const bpr = player.bowling ? `${player.bowling.p_bound_prev.toFixed(0)}%` : '-';
    const dth = player.bowling?.death_p_econ ? player.bowling.death_p_econ.toFixed(2) : (player.bowling ? (player.bowling.p_econ * 1.05).toFixed(2) : '-');
    const sr = player.bowling ? (player.bowling.p_sr ? player.bowling.p_sr.toFixed(1) : (player.bowling.p_balls / (wkts || 1)).toFixed(1)) : '-';

    statsGrid = [
      { key: 'wkt', label: 'WKT', value: wkts, sub: 'Pressure Wkts' },
      { key: 'ecn', label: 'ECN', value: econ, sub: 'Press. Econ' },
      { key: 'dot', label: 'DOT', value: dot, sub: 'Dot Ball %' },
      { key: 'bpr', label: 'BPR', value: bpr, sub: 'Bound. Prev' },
      { key: 'dth', label: 'DTH', value: dth, sub: 'Death Econ' },
      { key: 'sr', label: 'YRK', value: sr, sub: 'Strike Rate' },
    ];
  } else {
    // Batter / Finisher / WK
    const runs = player.batting?.p_runs || 0;
    const sr = player.batting ? player.batting.p_sr.toFixed(0) : '-';
    const avg = player.batting?.p_avg ? player.batting.p_avg.toFixed(1) : '-';
    const bnd = player.batting?.p_bound_pct ? `${player.batting.p_bound_pct.toFixed(0)}%` : '-';
    const clu = player.batting ? (player.batting.delta_sr >= 0 ? `+${player.batting.delta_sr.toFixed(0)}` : `${player.batting.delta_sr.toFixed(0)}`) : '-';
    const dot = player.batting?.p_dot_pct !== undefined ? `${(100 - player.batting.p_dot_pct).toFixed(0)}%` : '72%';

    statsGrid = [
      { key: 'run', label: 'RUN', value: runs, sub: 'Press. Runs' },
      { key: 'str', label: 'STR', value: sr, sub: 'Press. SR' },
      { key: 'avg', label: 'AVG', value: avg, sub: 'Press. Avg' },
      { key: 'bnd', label: 'BND', value: bnd, sub: 'Bound. %' },
      { key: 'clu', label: 'CLU', value: clu, sub: 'Clutch Delta' },
      { key: 'dot', label: 'RES', value: dot, sub: 'Score Flow' },
    ];
  }

  // Card Theme Styling
  const themeStyles = {
    gold: {
      outerBorder: 'from-amber-200 via-yellow-400 to-amber-600',
      innerBg: 'from-[#1a1505] via-[#241b08] to-[#120e03]',
      accentColor: '#E2B714',
      badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
      headerGlow: 'shadow-[0_0_20px_rgba(226,183,20,0.35)]'
    },
    totw: {
      outerBorder: 'from-slate-200 via-cyan-400 to-blue-600',
      innerBg: 'from-[#031326] via-[#061e38] to-[#020b18]',
      accentColor: '#06B6D4',
      badgeBg: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40',
      headerGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)]'
    },
    diamond: {
      outerBorder: 'from-pink-300 via-royal-pink to-purple-600',
      innerBg: 'from-[#230419] via-[#330825] to-[#14020f]',
      accentColor: '#EA1A7F',
      badgeBg: 'bg-pink-400/20 text-pink-300 border-pink-400/40',
      headerGlow: 'shadow-[0_0_20px_rgba(234,26,127,0.35)]'
    }
  };

  const style = themeStyles[cardTheme] || themeStyles.gold;

  return (
    <div 
      className={`group relative w-full max-w-[270px] sm:max-w-[290px] mx-auto transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer select-none`}
      onClick={() => onSelect && onSelect(pid)}
    >
      {/* Outer Metallic Shield Border Frame */}
      <div className={`p-[3px] rounded-3xl bg-gradient-to-b ${style.outerBorder} ${style.headerGlow} shadow-2xl`}>
        
        {/* Inner Card Body */}
        <div className={`relative rounded-[22px] bg-gradient-to-b ${style.innerBg} text-white overflow-hidden p-3.5 flex flex-col justify-between border border-white/10`}>
          
          {/* Background Decorative Crest Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none"></div>
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Section: Rating, Position, Country Flag, Team Crest */}
          <div className="relative z-10 flex items-start justify-between">
            
            {/* Left Stack: Rating + Role */}
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-3xl sm:text-4xl tracking-tighter text-white drop-shadow-md leading-none">
                {rating}
              </span>
              <span className="text-[11px] font-black tracking-widest uppercase mt-0.5" style={{ color: style.accentColor }}>
                {posBadge}
              </span>
              <span className="text-base my-0.5" title={country}>
                {flag}
              </span>
              <div className="w-5 h-5 mt-0.5 rounded-full bg-white/10 p-0.5 flex items-center justify-center border border-white/20">
                <img 
                  src="/rr_logo.png" 
                  alt="RR" 
                  className="w-full h-full object-contain" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            {/* Right: Big Cutout Player Portrait */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 -mr-1 -mt-1 flex items-end justify-center overflow-hidden">
              <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                <img
                  src={player.image_url || `/players/${pid}.jpg`}
                  alt={name}
                  className="w-full h-full object-cover object-top filter contrast-105 drop-shadow-2xl"
                  onError={(e) => {
                    // Fallback to initials avatar if image network fails
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center font-display font-black text-3xl text-amber-300/40">${name.slice(0,2).toUpperCase()}</div>`;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Player Name Banner */}
          <div className="relative z-10 text-center mt-1 border-t border-b border-white/10 py-1.5 bg-black/30 backdrop-blur-sm -mx-3.5 px-3.5">
            <h3 className="font-display font-black text-sm sm:text-base tracking-wider uppercase text-white truncate drop-shadow-sm">
              {name}
            </h3>
            <p className="text-[9.5px] font-semibold text-slate-300 uppercase tracking-widest truncate">
              {team} • {role}
            </p>
          </div>

          {/* 6 FIFA Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-x-3 gap-y-1 py-2 px-1 text-xs">
            {statsGrid.map((stat, idx) => {
              const isWinner = winningStats.includes(stat.key);
              const isHighlighted = highlightStat === stat.key;

              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded-lg transition-colors ${
                    isWinner 
                      ? 'bg-emerald-500/20 border border-emerald-400/40' 
                      : isHighlighted 
                        ? 'bg-royal-pink/20 border border-royal-pink/40' 
                        : 'hover:bg-white/5'
                  }`}
                >
                  <span className="font-extrabold text-[11px] font-mono tracking-tight" style={{ color: isWinner ? '#34D399' : style.accentColor }}>
                    {stat.label}
                  </span>
                  <span className="font-black text-xs font-mono tabular-nums text-white">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Card Footer: RR Auction Recommendation Badge & Action */}
          <div className="relative z-10 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
            <div className="flex items-center space-x-1 text-royal-gold font-bold">
              <Crown className="w-3 h-3 text-royal-gold" />
              <span className="uppercase tracking-wider text-[9px]">
                {rating >= 80 ? 'GRADE S+ ELITE' : rating >= 70 ? 'RR PRIORITY' : 'PRO TARGET'}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              {showCompareBtn && onCompare && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompare(pid);
                  }}
                  className="p-1 rounded-md bg-white/10 hover:bg-royal-pink hover:text-white text-slate-300 transition-colors"
                  title="Compare player head-to-head"
                >
                  <GitCompare className="w-3 h-3" />
                </button>
              )}
              <div className="flex items-center space-x-0.5 text-slate-400 group-hover:text-white transition-colors">
                <span className="text-[9px]">Dossier</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

