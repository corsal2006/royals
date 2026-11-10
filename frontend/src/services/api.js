/**
 * ROYAL SCOUT AI — API Client
 */

const API_BASE = '/api';

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  if (!res.ok) throw new Error('Failed to fetch overview data');
  return res.json();
}

export async function fetchTop10() {
  const res = await fetch(`${API_BASE}/rankings/top10`);
  if (!res.ok) throw new Error('Failed to fetch top 10 rankings');
  return res.json();
}

export async function fetchBatters(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/rankings/batters?${query}`);
  if (!res.ok) throw new Error('Failed to fetch batters');
  return res.json();
}

export async function fetchBowlers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/rankings/bowlers?${query}`);
  if (!res.ok) throw new Error('Failed to fetch bowlers');
  return res.json();
}

export async function fetchAllRounders() {
  const res = await fetch(`${API_BASE}/rankings/all-rounders`);
  if (!res.ok) throw new Error('Failed to fetch all-rounders');
  return res.json();
}

export async function fetchFielders() {
  const res = await fetch(`${API_BASE}/rankings/fielders`);
  if (!res.ok) throw new Error('Failed to fetch fielders');
  return res.json();
}

export async function fetchPlayers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/players?${query}`);
  if (!res.ok) throw new Error('Failed to fetch players');
  return res.json();
}

export async function fetchPlayer(id) {
  const res = await fetch(`${API_BASE}/player/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch player ${id}`);
  return res.json();
}

export async function fetchComparison(ids) {
  const res = await fetch(`${API_BASE}/compare?ids=${ids.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch comparison');
  return res.json();
}

export async function fetchAuctionStrategy() {
  const res = await fetch(`${API_BASE}/auction`);
  if (!res.ok) throw new Error('Failed to fetch auction strategy');
  return res.json();
}

export async function fetchMethodology() {
  const res = await fetch(`${API_BASE}/methodology`);
  if (!res.ok) throw new Error('Failed to fetch methodology');
  return res.json();
}

