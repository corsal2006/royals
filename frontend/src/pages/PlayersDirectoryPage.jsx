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
import { fetchPlayers } from '../services/api';

export default function PlayersDirectoryPage({ onSelectPlayer }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('pri'); // pri, name, runs, wkts
  const [viewMode, setViewMode] = useState('grid'); // grid, table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    setLoading(true);
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
        console.error(err);
        setLoading(false);
      });
  }, [search, roleFilter, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(players.length / itemsPerPage);
  const paginatedPlayers = players.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="royal-glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-700 shadow-xl bg-white dark:bg-navy-850">
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
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        
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
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-navy-750 text-royal-pink shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-navy-750 text-royal-pink shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-pink"></div>
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
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedPlayers.map(p => {
            const pid = p.player_id;
            return (
              <div
                key={pid}
                onClick={() => onSelectPlayer && onSelectPlayer(pid)}
                className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-navy-850 hover:border-royal-pink/50 border border-slate-200 dark:border-navy-750 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <PlayerImage
                      playerId={pid}
                      name={p.player_name}
                      imageUrl={p.image_url}
                      role={p.primary_role}
                      size="md"
                      showBadge={true}
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-royal-pink transition-colors leading-tight">
                        {p.player_name}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {p.primary_role || 'Cricketer'}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                        {p.country || p.current_ipl_team || 'International'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-black text-lg text-royal-pink dark:text-royal-pink font-mono block leading-none">
                      {p.overall_pri || p.bpri || p.bopri || '—'}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mt-1">
                      PRI Index
                    </span>
                  </div>
                </div>

                {/* Performance Snapshot */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 grid grid-cols-2 gap-2 text-xs">
                  {p.batting ? (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pressure Runs</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{p.batting.p_runs}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pressure SR</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.batting.p_sr}</span>
                      </div>
                    </>
                  ) : p.bowling ? (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pressure Wkts</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{p.bowling.p_wkts}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pressure Econ</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.bowling.p_econ}</span>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 text-slate-400 text-[10px]">
                      General squad member
                    </div>
                  )}
                </div>

                {/* Footer Tag */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-medium">
                    {p.sample_confidence || 'STANDARD'} Confidence
                  </span>
                  <span className="text-royal-pink font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Dossier &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 shadow-md">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-750 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Country / Team</th>
                <th className="py-3 px-3 text-right">PRI Score</th>
                <th className="py-3 px-3 text-right">Pressure Runs</th>
                <th className="py-3 px-3 text-right">Pressure SR</th>
                <th className="py-3 px-3 text-right">Pressure Wkts</th>
                <th className="py-3 px-3 text-right">Pressure Econ</th>
                <th className="py-3 px-4 text-center">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
              {paginatedPlayers.map(p => (
                <tr
                  key={p.player_id}
                  onClick={() => onSelectPlayer && onSelectPlayer(p.player_id)}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-750/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <PlayerImage
                        playerId={p.player_id}
                        name={p.player_name}
                        imageUrl={p.image_url}
                        role={p.primary_role}
                        size="xs"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{p.player_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{p.primary_role || '—'}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{p.country || p.current_ipl_team || '—'}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-royal-pink">{p.overall_pri || '—'}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{p.batting ? p.batting.p_runs : '—'}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{p.batting ? p.batting.p_sr : '—'}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{p.bowling ? p.bowling.p_wkts : '—'}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{p.bowling ? p.bowling.p_econ : '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-navy-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                      {p.sample_confidence || 'STANDARD'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-750 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, players.length)} of {players.length} players
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-navy-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-navy-750 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="font-bold text-slate-700 dark:text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-navy-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-navy-750 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
