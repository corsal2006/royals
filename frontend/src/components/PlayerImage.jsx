import React, { useState, useEffect } from 'react';
import { Shield, Zap, Target, Crosshair, Award } from 'lucide-react';

// Optional global cache of verified photos
let GLOBAL_IMAGE_CACHE = null;

export default function PlayerImage({ 
  playerId, 
  name = "Player", 
  imageUrl = null, 
  role = "", 
  size = "md", 
  className = "",
  showBadge = false,
  verified = false
}) {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Compute player initials (e.g. Sanju Samson -> SS, Virat Kohli -> VK)
  const getInitials = (n) => {
    if (!n) return "RR";
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

  useEffect(() => {
    if (imageUrl) {
      setImgSrc(imageUrl);
      setHasError(false);
      setIsLoading(true);
    } else if (playerId && !GLOBAL_IMAGE_CACHE) {
      fetch('/api/images')
        .then(res => res.json())
        .then(data => {
          GLOBAL_IMAGE_CACHE = data;
          const found = data[String(playerId)];
          if (found && found.image_url) {
            setImgSrc(found.image_url);
            setHasError(false);
          } else {
            setHasError(true);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setHasError(true);
          setIsLoading(false);
        });
    } else if (playerId && GLOBAL_IMAGE_CACHE) {
      const found = GLOBAL_IMAGE_CACHE[String(playerId)];
      if (found && found.image_url) {
        setImgSrc(found.image_url);
        setHasError(false);
      } else {
        setHasError(true);
      }
      setIsLoading(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [playerId, imageUrl]);

  const initials = getInitials(name);
  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;
  const selectedBadgeSize = badgeSizes[size] || badgeSizes.md;

  // Role gradient theme
  const getRoleTheme = (r) => {
    const lower = (r || '').toLowerCase();
    if (lower.includes('all-rounder') || lower.includes('all rounder')) {
      return {
        bg: "from-purple-900 via-indigo-900 to-navy-900 dark:from-purple-950 dark:to-navy-950",
        border: "border-purple-500/40",
        text: "text-purple-300",
        icon: <Zap className="w-2.5 h-2.5 text-purple-400" />
      };
    }
    if (lower.includes('bowl')) {
      return {
        bg: "from-blue-900 via-slate-900 to-navy-900 dark:from-blue-950 dark:to-navy-950",
        border: "border-royal-blue/40",
        text: "text-blue-300",
        icon: <Target className="w-2.5 h-2.5 text-royal-cyan" />
      };
    }
    if (lower.includes('wicket') || lower.includes('wk')) {
      return {
        bg: "from-amber-900 via-slate-900 to-navy-900 dark:from-amber-950 dark:to-navy-950",
        border: "border-royal-gold/40",
        text: "text-amber-300",
        icon: <Shield className="w-2.5 h-2.5 text-royal-gold" />
      };
    }
    // Default: Batter
    return {
      bg: "from-pink-900/90 via-slate-900 to-navy-900 dark:from-pink-950 dark:to-navy-950",
      border: "border-royal-pink/40",
      text: "text-pink-300",
      icon: <Crosshair className="w-2.5 h-2.5 text-royal-pink" />
    };
  };

  const roleTheme = getRoleTheme(role);

  return (
    <div className={`relative inline-block shrink-0 rounded-2xl select-none ${selectedSizeClass} ${className}`}>
      {/* If verified photo is available and loaded without error */}
      {imgSrc && !hasError ? (
        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-navy-850 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-navy-800 animate-pulse"></div>
          )}
          <img
            src={imgSrc}
            alt={name}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
      ) : (
        /* Verified Elegant Initials-Based Avatar (Never displays broken images or wrong faces) */
        <div 
          className={`w-full h-full rounded-2xl bg-gradient-to-br ${roleTheme.bg} border ${roleTheme.border} flex flex-col items-center justify-center font-display font-black tracking-wider text-white shadow-inner relative overflow-hidden`}
          title={`${name} (${role || 'Cricketer'})`}
        >
          {/* Subtle background sport crest texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none"></div>

          <span className="relative z-10 leading-none">
            {initials}
          </span>
        </div>
      )}

      {/* Role / Verification Badge indicator */}
      {showBadge && (
        <div className={`absolute ${selectedBadgeSize} rounded-full bg-navy-900 border border-slate-700 flex items-center justify-center shadow-md z-10`}>
          {roleTheme.icon}
        </div>
      )}
    </div>
  );
}
