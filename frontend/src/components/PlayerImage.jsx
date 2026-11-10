import React, { useState } from 'react';
import { Target, Crosshair, Shield, Zap } from 'lucide-react';

export default function PlayerImage({ 
  playerId, 
  player,
  name = "Player", 
  imageUrl = null, 
  role = "", 
  size = "md", 
  className = "",
  showBadge = false,
  verified = false
}) {
  const actualId = playerId || player?.player_id || player?.id || player?.striker_id || player?.bowler_id;
  const actualName = name !== "Player" ? name : (player?.player_name || player?.name || "Player");
  const actualUrl = imageUrl || player?.image_url || player?.local_image || (actualId ? `/players/${actualId}.jpg` : null);
  const actualRole = role || player?.primary_role || player?.role || player?.category || "";

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Compute player initials (e.g. Sanju Samson -> SS, Virat Kohli -> VK)
  const getInitials = (n) => {
    if (!n || n === "Player") return "RR";
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Dimension presets
  const sizeClasses = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-10 h-10 text-xs",
    md: "w-14 h-14 text-sm",
    lg: "w-20 h-20 text-base",
    xl: "w-28 h-28 text-xl",
    hero: "w-36 h-36 sm:w-44 sm:h-44 text-2xl"
  };

  const badgeSizes = {
    xs: "w-2.5 h-2.5 -bottom-0.5 -right-0.5",
    sm: "w-3.5 h-3.5 -bottom-0.5 -right-0.5",
    md: "w-4 h-4 bottom-0 right-0",
    lg: "w-5 h-5 bottom-0 right-0",
    xl: "w-6 h-6 bottom-1 right-1",
    hero: "w-8 h-8 bottom-2 right-2"
  };

  // Role icon indicator
  const getRoleIcon = (r) => {
    const lower = (r || '').toLowerCase();
    if (lower.includes('all-rounder') || lower.includes('all rounder')) {
      return <Zap className="w-2.5 h-2.5 text-purple-400" />;
    }
    if (lower.includes('bowl') || lower.includes('pacer') || lower.includes('spinner')) {
      return <Target className="w-2.5 h-2.5 text-royal-cyan" />;
    }
    if (lower.includes('wicket') || lower.includes('wk') || lower.includes('keeper')) {
      return <Shield className="w-2.5 h-2.5 text-royal-gold" />;
    }
    return <Crosshair className="w-2.5 h-2.5 text-royal-pink" />;
  };

  const initials = getInitials(actualName);
  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;
  const selectedBadgeSize = badgeSizes[size] || badgeSizes.md;

  return (
    <div className={`relative inline-block shrink-0 rounded-2xl select-none ${selectedSizeClass} ${className}`}>
      {actualUrl && !hasError ? (
        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-navy-800 animate-pulse"></div>
          )}
          <img
            src={actualUrl}
            alt={actualName}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`w-full h-full object-cover object-top transition-opacity duration-200 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
      ) : (
        /* Clean Vector Athlete Avatar */
        <div 
          className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 via-navy-900 to-navy-950 border border-slate-700/50 flex flex-col items-center justify-center font-display font-black tracking-wider text-white shadow-inner relative overflow-hidden"
          title={`${actualName} (${actualRole || 'Cricketer'})`}
        >
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none"></div>
          <span className="relative z-10 leading-none text-royal-gold">
            {initials}
          </span>
        </div>
      )}

      {/* Role Badge Indicator */}
      {showBadge && (
        <div className={`absolute ${selectedBadgeSize} rounded-full bg-navy-900 border border-slate-700 flex items-center justify-center shadow-md z-10`}>
          {getRoleIcon(actualRole)}
        </div>
      )}
    </div>
  );
}
