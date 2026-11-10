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
  Download,
  Activity,
  Layers,
  Search,
  X,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  FileText
} from 'lucide-react';
import PlayerImage from './PlayerImage';
import { fetchPlayers, API_BASE } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, onSelectPlayer, theme, setTheme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    { id: 'players', label: 'Players', icon: Users },
    { id: 'batters', label: 'Batters', icon: Flame },
    { id: 'bowlers', label: 'Bowlers', icon: Crosshair },
    { id: 'allrounders', label: 'All-Rounders', icon: Layers },
    { id: 'fielders', label: 'Fielders & WK', icon: Trophy },
    { id: 'clutch', label: 'Clutch Spotlight', icon: ZapIcon },
    { id: 'compare', label: 'Comparison Studio', icon: GitCompare },
    { id: 'auction', label: 'RR Auction 2027', icon: Crown, highlight: true },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
  ];

  function ZapIcon(props) {
    return <Flame {...props} />;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800 shadow-sm transition-colors duration-200">
      
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('overview')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-navy-800 p-1 shadow-md border border-slate-200 dark:border-navy-700">
              <img 
                src="/rr_logo.png" 
                alt="Rajasthan Royals" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="font-display font-black text-royal-pink text-sm">RR</span>';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  ROYAL SCOUT <span className="text-royal-pink">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-royal-pink/10 text-royal-pink border border-royal-pink/30">
                  IPL 2027
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                IPL Player Intelligence & Auction Analytics
              </p>
            </div>
          </div>

          {/* Quick Actions & Global Search */}
          <div className="flex items-center space-x-2.5">
            
            {/* Global Search Input */}
            <div ref={searchRef} className="relative hidden md:block w-48 lg:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search player or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setIsSearching(true); }}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 focus:border-royal-pink rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setIsSearching(false); }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {isSearching && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-navy-800">
                  {searchResults.map(p => (
                    <div
                      key={p.player_id}
                      onClick={() => handleSelect(p.player_id)}
                      className="p-2.5 hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <PlayerImage
                          playerId={p.player_id}
                          name={p.player_name}
                          imageUrl={p.image_url}
                          role={p.primary_role}
                          size="xs"
                        />
                        <div className="truncate">
                          <span className="font-bold text-slate-900 dark:text-white block text-xs truncate">{p.player_name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">{p.primary_role} • {p.country}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-royal-pink font-mono pl-2 shrink-0">
                        PRI {p.overall_pri || p.bpri || p.bopri}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700 transition-colors shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-royal-gold" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Export CSV Download */}
            <a
              href={`${API_BASE}/export/csv`}
              download="RR_AUCTION_SCOUTING_RANKINGS.csv"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 transition-all shadow-sm"
              title="Download verified player scouting rankings CSV"
            >
              <Download className="w-3.5 h-3.5 text-royal-pink" />
              <span>Export CSV</span>
            </a>

            {/* Print / PDF Trigger */}
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-royal-pink hover:bg-royal-pink-hover text-white shadow-royal-glow transition-all"
              title="Export professional print-ready dossier"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Desktop Navigation Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-navy-800 bg-white dark:bg-navy-950 overflow-x-auto no-scrollbar hidden md:block">
        <nav className="flex space-x-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? item.highlight 
                      ? 'bg-gradient-to-r from-royal-pink/20 to-pink-600/10 text-royal-pink border border-royal-pink/40 shadow-sm' 
                      : 'bg-royal-blue/10 dark:bg-navy-750 text-royal-blue dark:text-white border border-royal-blue/30 dark:border-royal-blue/40 shadow-sm'
                    : item.highlight
                      ? 'text-royal-pink hover:bg-royal-pink/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (item.highlight ? 'text-royal-pink' : 'text-royal-blue dark:text-royal-gold') : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-pink animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 space-y-2">
          {/* Mobile search */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white border border-slate-200 dark:border-navy-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-royal-pink text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
}
