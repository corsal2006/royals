import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Flame, 
  Crosshair, 
  ShieldAlert, 
  Users, 
  GitCompare, 
  Crown, 
  BookOpen, 
  Presentation,
  Download,
  Activity,
  Layers,
  Search,
  X
} from 'lucide-react';
import { fetchPlayers } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, onSelectPlayer }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      fetchPlayers({ q: searchQuery.trim(), limit: 6 })
        .then(res => {
          setSearchResults(res.players || []);
          setIsSearching(true);
        })
        .catch(err => console.error(err));
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Click outside to dismiss search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (playerId) => {
    if (onSelectPlayer) {
      onSelectPlayer(playerId);
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'rankings', label: 'Official Top 10', icon: Trophy, badge: 'Unstop' },
    { id: 'batters', label: 'Batters', icon: Flame },
    { id: 'bowlers', label: 'Bowlers', icon: Crosshair },
    { id: 'allrounders', label: 'All-Rounders', icon: Layers },
    { id: 'fielders', label: 'Fielders & WK', icon: Users },
    { id: 'compare', label: 'Comparison', icon: GitCompare },
    { id: 'auction', label: 'RR Auction 2027', icon: Crown, highlight: true },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'deck', label: 'Judging Deck', icon: Presentation, special: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full royal-glass border-b border-navy-700 shadow-xl">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-royal-pink via-purple-900 to-royal-blue shadow-royal-glow border border-white/20">
              <Crown className="w-6 h-6 text-royal-gold animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-navy-900" title="Pressure Engine Live"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  ROYAL SCOUT <span className="text-royal-pink">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-royal-pink/20 text-royal-pink border border-royal-pink/30">
                  Round 1
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                SuperRR Selector 2.0 • Pressure Reliability Intelligence
              </p>
            </div>
          </div>

          {/* Quick Actions & Global Search */}
          <div className="flex items-center space-x-3">
            {/* Global Search Input */}
            <div ref={searchRef} className="relative hidden md:block w-48 lg:w-60">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search any player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setIsSearching(true); }}
                className="w-full pl-8 pr-7 py-1.5 bg-navy-800/90 hover:bg-navy-800 focus:bg-navy-800 border border-navy-700 focus:border-royal-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setIsSearching(false); }}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {isSearching && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-navy-950/95 border border-navy-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-navy-850 backdrop-blur-xl">
                  {searchResults.map(p => (
                    <div
                      key={p.player_id}
                      onClick={() => handleSelect(p.player_id)}
                      className="p-2.5 hover:bg-navy-800/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white block text-xs">{p.player_name}</span>
                        <span className="text-[10px] text-slate-400">{p.country} • {p.current_ipl_team}</span>
                      </div>
                      <span className="text-[11px] font-black text-royal-pink tabular">
                        PRI {p.overall_pri || p.bpri || p.bopri}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/api/export/csv"
              download="UNSTOP_SUBMISSION_RANKINGS.csv"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 hover:border-slate-500 transition-all shadow-sm"
              title="Download official Unstop-compliant Top 10 CSV rankings"
            >
              <Download className="w-3.5 h-3.5 text-royal-gold" />
              <span>Export Unstop CSV</span>
            </a>

            <button
              onClick={() => setActiveTab('deck')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-royal-pink to-pink-600 hover:from-royal-pink-hover hover:to-pink-500 text-white shadow-royal-glow transition-all"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Judge Walkthrough</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-navy-800/80 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? item.highlight 
                      ? 'bg-gradient-to-r from-royal-pink/25 to-pink-600/20 text-royal-pink border border-royal-pink/40 shadow-sm' 
                      : 'bg-navy-750 text-white border border-royal-blue/40 shadow-sm'
                    : item.highlight
                      ? 'text-royal-pink/90 hover:bg-royal-pink/10 hover:text-white'
                      : item.special
                        ? 'text-royal-gold hover:bg-royal-gold/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (item.highlight ? 'text-royal-pink' : 'text-royal-gold') : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-royal-blue/30 text-royal-blue-light border border-royal-blue/40">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-pink animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

