/**
 * ROYAL SCOUT AI — Production API Client
 * Dynamically resolves production backend via VITE_API_URL or defaults to /api proxy
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
export const API_BASE = RAW_API_URL 
  ? (RAW_API_URL.endsWith('/api') ? RAW_API_URL : `${RAW_API_URL.replace(/\/$/, '')}/api`)
  : '/api';

console.log(`[ROYAL SCOUT AI] Connected to API Engine at: ${API_BASE}`);

async function handleResponse(res, endpointName) {
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`API Error [${res.status}] fetching ${endpointName}: ${errorText || res.statusText}`);
  }
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res, 'health status');
}

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  return handleResponse(res, 'overview telemetry');
}

export async function fetchTop10() {
  const res = await fetch(`${API_BASE}/rankings/top10`);
  return handleResponse(res, 'top 10 rankings');
}

export async function fetchBatters(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/rankings/batters?${query}`);
  return handleResponse(res, 'batters rankings');
}

export async function fetchBowlers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/rankings/bowlers?${query}`);
  return handleResponse(res, 'bowlers rankings');
}

export async function fetchAllRounders() {
  const res = await fetch(`${API_BASE}/rankings/all-rounders`);
  return handleResponse(res, 'all-rounders rankings');
}

export async function fetchFielders() {
  const res = await fetch(`${API_BASE}/rankings/fielders`);
  return handleResponse(res, 'fielders rankings');
}

export async function fetchClutchRankings() {
  const res = await fetch(`${API_BASE}/rankings/clutch`);
  return handleResponse(res, 'clutch spotlight rankings');
}

export async function fetchPlayers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/players?${query}`);
  return handleResponse(res, 'players directory');
}

export async function fetchPlayer(id) {
  const res = await fetch(`${API_BASE}/player/${id}`);
  return handleResponse(res, `player ${id} dossier`);
}

export async function fetchComparison(ids) {
  const res = await fetch(`${API_BASE}/compare?ids=${ids.join(',')}`);
  return handleResponse(res, 'head-to-head comparison');
}

export async function fetchAuctionStrategy() {
  const res = await fetch(`${API_BASE}/auction`);
  return handleResponse(res, 'auction strategy targets');
}

export async function fetchMethodology() {
  const res = await fetch(`${API_BASE}/methodology`);
  return handleResponse(res, 'methodology documentation');
}

export async function queryAssistant(q) {
  const res = await fetch(`${API_BASE}/assistant/query?q=${encodeURIComponent(q)}`);
  return handleResponse(res, 'assistant query');
}
