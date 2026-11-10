import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Crown, 
  ArrowUpDown, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import PlayerImage from '../components/PlayerImage';
import FifaPlayerCard from '../components/FifaPlayerCard';
import { fetchPlayers } from '../services/api';

export default function PlayersDirectoryPage({ onSelectPlayer }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('pri'); // pri, name, runs, wkts
  const [viewMode, setViewMode] = useState('grid'); // grid (fifa cards), table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPlayers({ q: search, role: roleFilter, limit: 300 })
      .then(res => {
        let list = res.players || [];
        
        // Sorting
        list.sort((a, b) => {
          if (sortBy === 'name') return a.player_name.localeCompare(b.player_name);
          if (sortBy === 'runs') return (b.batting?.p_runs || 0) - (a.batting?.p_runs || 0);
          if (sortBy === 'wkts') return (b.bowling?.p_wkts || 0) - (a.bowling?.p_wkts || 0);
          return (b.overall_pri || 0) - (a.overall_pri || 0);
        });

        setPlayers(list);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading players:", err);
        setError(err.message || "Failed to load players directory");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [search, roleFilter, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(players.length / itemsPerPage);
  const paginatedPlayers = players.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-700 shadow-sm bg-white dark:bg-navy-850">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-royal-blue/10 dark:bg-royal-blue/20 text-royal-blue dark:text-blue-400 border border-royal-blue/30 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Master Player Registry & Intelligence Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Comprehensive Player Intelligence Database
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            Search, filter, and inspect pressure telemetry for all verified cricketers evaluated across 
            the 2022–2026 IPL and international T20 competition archives.
          </p>
        </div>
      </div>

      {/* Control Bar: Filters, Search, View Mode */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by player name, franchise or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 text-slate-900 dark:text-white border border-slate-200 dark:border-navy-700 focus:outline-none focus:border-royal-pink transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Role Filter */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
            {['ALL', 'Batter', 'Bowler', 'All-Rounder', 'Wicketkeeper'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  roleFilter === role 
                    ? 'bg-royal-pink text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 focus:outline-none"
          >
            <option value="pri">Sort: Highest PRI Score</option>
            <option value="name">Sort: Player Name (A-Z)</option>
            <option value="runs">Sort: Pressure Runs</option>
            <option value="wkts">Sort: Pressure Wickets</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-royal-pink text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="FIFA Player Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>FIFA Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'table' 
                  ? 'bg-royal-pink text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-pink"></div>
          <span className="text-xs font-semibold text-slate-500 animate-pulse">Retrieving Player Telemetry...</span>
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 space-y-4 max-w-lg mx-auto">
          <p className="text-rose-500 font-bold text-sm">⚠️ {error}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Please verify network connectivity to the analytics API.</p>
          <button 
            onClick={loadData}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-royal-pink text-white shadow-royal-glow"
          >
            Retry Connection
          </button>
        </div>
      ) : players.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No players match the selected filters or search keyword.</p>
          <button 
            onClick={() => { setSearch(''); setRoleFilter('ALL'); }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-royal-pink text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* FIFA ULTIMATE TEAM PLAYER CARDS GRID FOR EACH PLAYER */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedPlayers.map(p => (
            <FifaPlayerCard
              key={p.player_id}
              player={p}
              onSelect={onSelectPlayer}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-3xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-900 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-navy-750">
              <tr>
                <th className="py-3 px-4">Player & Country</th>
                <th className="py-3 px-3">Primary Role</th>
                <th className="py-3 px-3">IPL Team</th>
                <th className="py-3 px-3 text-right">Pressure Runs</th>
                <th className="py-3 px-3 text-right">Pressure SR</th>
                <th className="py-3 px-3 text-right">Pressure Wkts</th>
                <th className="py-3 px-3 text-right">Pressure Econ</th>
                <th className="py-3 px-4 text-right">PRI Rating</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
              {paginatedPlayers.map(p => (
                <tr 
                  key={p.player_id}
                  className="hover:bg-slate-50 dark:hover:bg-navy-800/60 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <PlayerImage
                        playerId={p.player_id}
                        name={p.player_name}
                        imageUrl={p.image_url}
                        role={p.primary_role}
                        size="sm"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-royal-pink transition-colors block">
                          {p.player_name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {p.country}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">{p.primary_role}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{p.current_ipl_team}</td>
                  <td className="py-3 px-3 text-right tabular text-slate-700 dark:text-slate-300 font-bold">{p.batting ? p.batting.p_runs : '—'}</td>
                  <td className="py-3 px-3 text-right tabular text-royal-gold font-bold">{p.batting ? p.batting.p_sr : '—'}</td>
                  <td className="py-3 px-3 text-right tabular text-slate-700 dark:text-slate-300 font-bold">{p.bowling ? p.bowling.p_wkts : '—'}</td>
                  <td className="py-3 px-3 text-right tabular text-royal-blue dark:text-blue-400 font-bold">{p.bowling ? p.bowling.p_econ : '—'}</td>
                  <td className="py-3 px-4 text-right tabular font-black text-royal-pink text-sm font-mono">{p.overall_pri || p.bpri || p.bopri || '—'}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onSelectPlayer && onSelectPlayer(p.player_id)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-royal-pink hover:text-white dark:bg-navy-750 dark:hover:bg-royal-pink text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-navy-850 rounded-2xl border border-slate-200 dark:border-navy-750 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, players.length)} of {players.length} players
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-slate-900 dark:text-white px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
