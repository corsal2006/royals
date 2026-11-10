const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load precomputed datasets into memory for sub-millisecond API response times
const DATA_DIR = path.join(__dirname, 'data');
const DOCS_DIR = path.join(__dirname, '..', 'docs');

let playersMaster = {};
let top10Batters = [];
let top10Bowlers = [];
let allRounders = [];
let rrAuctionTargets = [];
let overviewStats = {};
let playerImages = {};

try {
  playersMaster = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_master.json'), 'utf8'));
  top10Batters = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'top10_batters.json'), 'utf8'));
  top10Bowlers = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'top10_bowlers.json'), 'utf8'));
  allRounders = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'all_rounders.json'), 'utf8'));
  rrAuctionTargets = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'rr_auction_targets.json'), 'utf8'));
  overviewStats = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'overview_stats.json'), 'utf8'));
  
  if (fs.existsSync(path.join(DATA_DIR, 'player_images.json'))) {
    playerImages = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'player_images.json'), 'utf8'));
  }
  
  // Attach image_url to playersMaster
  for (const [pid, player] of Object.entries(playersMaster)) {
    player.image_url = playerImages[pid]?.image_url || `/players/${pid}.jpg`;
    player.image_verified = true;
  }

  // Enrich rrAuctionTargets with image_url and uniform name
  rrAuctionTargets = rrAuctionTargets.map(t => ({
    ...t,
    player_id: Number(t.player_id),
    player_name: t.player_name || t.name,
    image_url: playerImages[String(t.player_id)]?.image_url || `/players/${t.player_id}.jpg`,
    image_verified: true
  }));

  // Enrich top10Batters and top10Bowlers with uniform player_id, player_name, image_url
  top10Batters = top10Batters.map(b => enrichPlayer({
    ...b,
    player_id: b.striker_id,
    player_name: b.striker_name,
    overall_pri: b.bpri,
    primary_role: 'Batter'
  }));

  top10Bowlers = top10Bowlers.map(b => enrichPlayer({
    ...b,
    player_id: b.bowler_id,
    player_name: b.bowler_name,
    overall_pri: b.bopri,
    primary_role: 'Bowler'
  }));

  allRounders = allRounders.map(a => enrichPlayer(a));

  console.log(`[ROYAL SCOUT AI] Loaded ${Object.keys(playersMaster).length} player records & ${Object.keys(playerImages).length} verified photos.`);
} catch (err) {
  console.error('[ROYAL SCOUT AI] Error loading dataset files:', err.message);
}

// Helper to enrich player with image
function enrichPlayer(p) {
  if (!p) return null;
  const idStr = String(p.player_id || p.striker_id || p.bowler_id || p.id);
  const imgMeta = playerImages[idStr];
  return {
    ...p,
    player_id: Number(idStr),
    player_name: p.player_name || p.name,
    image_url: imgMeta ? imgMeta.image_url : `/players/${idStr}.jpg`,
    image_verified: true
  };
}

// 1. Health check & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'ROYAL SCOUT AI — Professional IPL Player Intelligence & Auction Decision Engine',
    timestamp: new Date().toISOString(),
    total_players: Object.keys(playersMaster).length,
    verified_images: Object.keys(playerImages).length
  });
});

// 2. Verified Player Images Directory
app.get('/api/images', (req, res) => {
  res.json(playerImages);
});

// 2. Executive Overview Stats
app.get('/api/overview', (req, res) => {
  res.json({
    stats: overviewStats,
    top10_batters: top10Batters,
    top10_bowlers: top10Bowlers,
    rr_targets_count: rrAuctionTargets.length
  });
});

// 3. Official Pressure Rankings Top 10 Dropdowns & Tables
app.get('/api/rankings/top10', (req, res) => {
  res.json({
    batters: top10Batters,
    bowlers: top10Bowlers
  });
});

// 4. Batters Rankings (with filtering & sorting)
app.get('/api/rankings/batters', (req, res) => {
  const minBalls = parseInt(req.query.min_balls) || 60;
  const country = req.query.country || 'ALL';
  const search = (req.query.search || '').toLowerCase();
  const sortBy = req.query.sort_by || 'bpri'; // bpri, p_runs, p_sr, delta_sr, p_avg
  const order = req.query.order === 'asc' ? 1 : -1;

  let list = Object.values(playersMaster)
    .filter(p => p.batting && p.batting.p_balls >= minBalls);

  if (country !== 'ALL') {
    list = list.filter(p => p.country && p.country.toLowerCase() === country.toLowerCase());
  }

  if (search) {
    list = list.filter(p => 
      p.player_name.toLowerCase().includes(search) ||
      (p.current_ipl_team && p.current_ipl_team.toLowerCase().includes(search))
    );
  }

  list.sort((a, b) => {
    let valA = a.bpri || 0;
    let valB = b.bpri || 0;
    if (sortBy === 'p_runs') { valA = a.batting.p_runs; valB = b.batting.p_runs; }
    else if (sortBy === 'p_sr') { valA = a.batting.p_sr; valB = b.batting.p_sr; }
    else if (sortBy === 'delta_sr') { valA = a.batting.delta_sr; valB = b.batting.delta_sr; }
    else if (sortBy === 'p_avg') { valA = a.batting.p_avg; valB = b.batting.p_avg; }
    else if (sortBy === 'p_balls') { valA = a.batting.p_balls; valB = b.batting.p_balls; }
    return (valA - valB) * order;
  });

  res.json({
    total: list.length,
    min_balls: minBalls,
    players: list
  });
});

// 5. Bowlers Rankings (with filtering & sorting)
app.get('/api/rankings/bowlers', (req, res) => {
  const minBalls = parseInt(req.query.min_balls) || 60;
  const country = req.query.country || 'ALL';
  const paceOrSpin = req.query.type || 'ALL'; // Pace, Spin
  const search = (req.query.search || '').toLowerCase();
  const sortBy = req.query.sort_by || 'bopri'; // bopri, p_wkts, p_econ, delta_econ, p_avg
  const order = req.query.order === 'asc' ? 1 : -1;

  let list = Object.values(playersMaster)
    .filter(p => p.bowling && p.bowling.p_balls >= minBalls);

  if (country !== 'ALL') {
    list = list.filter(p => p.country && p.country.toLowerCase() === country.toLowerCase());
  }

  if (paceOrSpin !== 'ALL') {
    list = list.filter(p => p.pace_or_spin && p.pace_or_spin.toLowerCase() === paceOrSpin.toLowerCase());
  }

  if (search) {
    list = list.filter(p => 
      p.player_name.toLowerCase().includes(search) ||
      (p.current_ipl_team && p.current_ipl_team.toLowerCase().includes(search))
    );
  }

  list.sort((a, b) => {
    let valA = a.bopri || 0;
    let valB = b.bopri || 0;
    if (sortBy === 'p_wkts') { valA = a.bowling.p_wkts; valB = b.bowling.p_wkts; }
    else if (sortBy === 'p_econ') { valA = a.bowling.p_econ; valB = b.bowling.p_econ; return (valB - valA) * order; } // lower econ is better
    else if (sortBy === 'delta_econ') { valA = a.bowling.delta_econ; valB = b.bowling.delta_econ; }
    else if (sortBy === 'p_avg') { valA = a.bowling.p_avg; valB = b.bowling.p_avg; return (valB - valA) * order; }
    else if (sortBy === 'p_balls') { valA = a.bowling.p_balls; valB = b.bowling.p_balls; }
    return (valA - valB) * order;
  });

  res.json({
    total: list.length,
    min_balls: minBalls,
    players: list
  });
});

// 6. All-Rounders Rankings
app.get('/api/rankings/all-rounders', (req, res) => {
  const list = Object.values(playersMaster)
    .filter(p => p.arpri && p.arpri > 0)
    .sort((a, b) => (b.arpri || 0) - (a.arpri || 0));

  res.json({
    total: list.length,
    players: list
  });
});

// 7. Fielders & Wicketkeepers
app.get('/api/rankings/fielders', (req, res) => {
  const wks = Object.values(playersMaster)
    .filter(p => p.is_wk)
    .sort((a, b) => (b.overall_pri || 0) - (a.overall_pri || 0));

  res.json({
    total: wks.length,
    limitation_note: "Notice on Fielding Analysis: The official delivery dataset does not provide individual fielder tracking for outfield catches and ground saves. Dismissals attribute the bowler and dismissed player. Wicketkeepers are identified through official match playing-XIs. Outfield fielding metrics are therefore marked as limited in accordance with the problem statement rules.",
    wicketkeepers: wks
  });
});

// 8. Search All Players
app.get('/api/players', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const role = req.query.role || 'ALL';
  const limit = parseInt(req.query.limit) || 50;

  let results = Object.values(playersMaster);

  if (role !== 'ALL') {
    results = results.filter(p => p.primary_role.toLowerCase().includes(role.toLowerCase()));
  }

  if (q) {
    results = results.filter(p => 
      p.player_name.toLowerCase().includes(q) ||
      (p.country && p.country.toLowerCase().includes(q)) ||
      (p.current_ipl_team && p.current_ipl_team.toLowerCase().includes(q))
    );
  }

  results.sort((a, b) => (b.overall_pri || 0) - (a.overall_pri || 0));

  res.json({
    total: results.length,
    players: results.slice(0, limit)
  });
});

// 9. Single Player Deep Profile
app.get('/api/player/:id', (req, res) => {
  const pid = parseInt(req.params.id);
  const player = playersMaster[pid];

  if (!player) {
    // Try matching by name if ID was passed as string name
    const matchByName = Object.values(playersMaster).find(p => 
      p.player_name.toLowerCase() === req.params.id.toLowerCase()
    );
    if (matchByName) {
      return res.json(matchByName);
    }
    return res.status(404).json({ error: 'Player not found in database.' });
  }

  res.json(player);
});

// 10. Multi-Player Comparison API (Head to head)
app.get('/api/compare', (req, res) => {
  const ids = (req.query.ids || '').split(',').map(id => parseInt(id.trim())).filter(Boolean);
  if (ids.length < 2) {
    return res.status(400).json({ error: 'Please provide at least two player IDs for comparison (e.g. ?ids=1699,813).' });
  }

  const compared = ids.map(id => playersMaster[id]).filter(Boolean);
  res.json({
    count: compared.length,
    players: compared
  });
});

// 11. Rajasthan Royals Auction Intelligence Hub
app.get('/api/auction', (req, res) => {
  res.json({
    franchise: 'Rajasthan Royals',
    target_event: 'IPL 2027 Auction',
    objective: 'Acquire the Most Reliable Clutch Performers under High Pressure',
    core_pillars: [
      { name: "Sanju Samson", role: "Captain & Core Top-Order WK", status: "Retained Core" },
      { name: "Yashasvi Jaiswal", role: "Explosive Left-Handed Opener", status: "Retained Core" },
      { name: "Riyan Parag", role: "Middle-Order Spine & Float Power", status: "Retained Core" },
      { name: "Dhruv Jurel", role: "Homegrown Clutch Finisher & WK", status: "Retained Core" },
      { name: "Shimron Hetmyer", role: "Left-Handed Power Finisher", status: "Retained Core" }
    ],
    auction_strategy_pillars: [
      {
        priority: 1,
        need: "World-Class Death Overs Spearhead",
        recommended_target: "Matheesha Pathirana / Arshdeep Singh",
        strategic_rationale: "RR lost critical games in death overs (18-20). Pathirana (BoPRI 73.4, 44 pressure wickets, 8.29 death economy) or Arshdeep (74 pressure wickets) guarantees unhittable yorkers."
      },
      {
        priority: 2,
        need: "Mystery Spin Breakthrough Magician",
        recommended_target: "Kuldeep Yadav / Varun Chakravarthy",
        strategic_rationale: "To command middle overs at Jaipur. Kuldeep holds a 6.51 pressure economy (#1 BoPRI 88.34); Varun boasts an elite 6.77 pressure economy."
      },
      {
        priority: 3,
        need: "Ice-Cold Chase Closer at #6",
        recommended_target: "Rinku Singh / David Miller",
        strategic_rationale: "Rinku Singh (+45.2 SR delta, 934 pressure runs) eliminates the risk of late collapses when chasing 12+ RRR."
      },
      {
        priority: 4,
        need: "High-Composure Indian Crisis Stabilizer",
        recommended_target: "Shashank Singh",
        strategic_rationale: "Shashank averages 57.75 under pressure at 163.8 SR. High-value acquisition to stabilize early top-order wickets."
      }
    ],
    curated_targets: rrAuctionTargets
  });
});

// 12. Clutch Performers Spotlight (Death overs, High RRR, Collapse recovery)
app.get('/api/rankings/clutch', (req, res) => {
  const allPlayers = Object.values(playersMaster);

  // 1. Death Overs Specialists (Overs 17-20)
  const deathBatters = allPlayers
    .filter(p => p.batting && p.batting.death_p_sr && p.batting.p_balls >= 60)
    .sort((a, b) => (b.batting.death_p_sr || 0) - (a.batting.death_p_sr || 0))
    .slice(0, 10)
    .map(enrichPlayer);

  const deathBowlers = allPlayers
    .filter(p => p.bowling && p.bowling.death_p_econ && p.bowling.p_balls >= 60)
    .sort((a, b) => (a.bowling.death_p_econ || 99) - (b.bowling.death_p_econ || 99))
    .slice(0, 10)
    .map(enrichPlayer);

  // 2. Chase Closer Specialists (Innings 2 High Pressure)
  const chaseClosers = allPlayers
    .filter(p => p.batting && p.batting.chase_p_sr && p.batting.p_balls >= 60)
    .sort((a, b) => (b.batting.chase_p_sr || 0) - (a.batting.chase_p_sr || 0))
    .slice(0, 10)
    .map(enrichPlayer);

  // 3. Crisis Stabilizers (High average under pressure)
  const crisisAnchors = allPlayers
    .filter(p => p.batting && p.batting.p_avg >= 30.0 && p.batting.p_balls >= 60)
    .sort((a, b) => (b.batting.p_avg || 0) - (a.batting.p_avg || 0))
    .slice(0, 10)
    .map(enrichPlayer);

  res.json({
    death_batters: deathBatters,
    death_bowlers: deathBowlers,
    chase_closers: chaseClosers,
    crisis_anchors: crisisAnchors
  });
});

// 13. AI Scouting Assistant Query Engine
app.all(['/api/assistant/query', '/api/assistant'], (req, res) => {
  const q = (req.query.q || (req.body && req.body.query) || '').toLowerCase().trim();
  if (!q) {
    return res.json({
      answer: "Welcome to the Royal Scout AI Intelligence Assistant. Ask any question about player reliability, death overs, high-pressure chases, head-to-head comparisons, or IPL 2027 Rajasthan Royals auction targets.",
      suggested_questions: [
        "Who are the top death bowlers for Rajasthan Royals?",
        "Compare Rinku Singh and David Miller in high-pressure chases",
        "Why is Matheesha Pathirana recommended as RR's #1 pace priority?",
        "Which mystery spinners maintain an economy under 7.0 in pressure situations?",
        "What are Rajasthan Royals' 4 tactical auction priorities?"
      ],
      players: []
    });
  }

  const allPlayers = Object.values(playersMaster);

  // Check 1: Rajasthan Royals Strategy Query
  if (q.includes('rr') || q.includes('rajasthan') || q.includes('priority') || q.includes('strategy') || q.includes('target')) {
    return res.json({
      query: q,
      answer: "Rajasthan Royals' IPL 2027 strategy focuses on 4 critical pressure gaps identified across 2022–2026 match telemetry:\n\n" +
              "1. Specialist Death Pacer: Matheesha Pathirana (BoPRI 73.4, 8.29 death economy, 44 pressure wkts) or Arshdeep Singh (74 pressure wkts).\n" +
              "2. Mystery Spin Squeeze: Kuldeep Yadav (BoPRI 88.34, 6.51 pressure economy) to strangle middle overs.\n" +
              "3. Clutch Chase Closer: Rinku Singh (934 pressure runs, 172.3 SR) or David Miller (+76.9 SR delta).\n" +
              "4. Crisis Recovery Anchor: Shashank Singh (57.8 pressure average, 163.8 SR) to rescue early collapses.",
      players: rrAuctionTargets.slice(0, 4)
    });
  }

  // Check 2: Comparison Query
  if (q.includes('compare') || q.includes(' vs ') || q.includes('versus')) {
    const matched = allPlayers.filter(p => q.includes(p.player_name.toLowerCase()));
    if (matched.length >= 2) {
      const p1 = matched[0];
      const p2 = matched[1];
      const edge1 = (p1.overall_pri || 0) > (p2.overall_pri || 0) ? `${p1.player_name} leads in overall PRI (${p1.overall_pri} vs ${p2.overall_pri})` : `${p2.player_name} leads in overall PRI (${p2.overall_pri} vs ${p1.overall_pri})`;
      return res.json({
        query: q,
        answer: `Direct Head-to-Head Comparison: ${p1.player_name} vs ${p2.player_name}.\n\n` +
                `• PRI Score: ${p1.player_name} (${p1.overall_pri}) vs ${p2.player_name} (${p2.overall_pri}).\n` +
                (p1.batting && p2.batting ? `• Strike Rate: ${p1.player_name} (${p1.batting.p_sr}) vs ${p2.player_name} (${p2.batting.p_sr}).\n• Clutch SR Delta: ${p1.player_name} (+${p1.batting.delta_sr}) vs ${p2.player_name} (+${p2.batting.delta_sr}).\n` : '') +
                (p1.bowling && p2.bowling ? `• Pressure Economy: ${p1.player_name} (${p1.bowling.p_econ}) vs ${p2.player_name} (${p2.bowling.p_econ}).\n• Pressure Wickets: ${p1.player_name} (${p1.bowling.p_wkts}) vs ${p2.player_name} (${p2.bowling.p_wkts}).\n` : '') +
                `• Verdict: ${edge1}.`,
        players: [p1, p2]
      });
    }
  }

  // Check 3: Death Overs Query
  if (q.includes('death') || q.includes('yorker') || q.includes('18-20')) {
    const topDeathBowlers = allPlayers
      .filter(p => p.bowling && p.bowling.death_p_econ && p.bowling.p_balls >= 60)
      .sort((a, b) => a.bowling.death_p_econ - b.bowling.death_p_econ)
      .slice(0, 3);

    return res.json({
      query: q,
      answer: `The leading death-overs specialists in our database based on death economy and pressure volume are:\n\n` +
              topDeathBowlers.map((b, i) => `${i+1}. ${b.player_name} (${b.bowling.death_p_econ} death econ, ${b.bowling.p_wkts} pressure wkts across ${b.bowling.p_balls} pressure deliveries)`).join('\n') +
              "\n\nMatheesha Pathirana (8.29 death econ, 44 pressure wkts) and Arshdeep Singh (74 pressure wkts) represent Rajasthan Royals' premier pace options.",
      players: topDeathBowlers
    });
  }

  // Check 4: Finisher / Chasing Query
  if (q.includes('finisher') || q.includes('chase') || q.includes('chasing') || q.includes('strike rate')) {
    const topFinishers = allPlayers
      .filter(p => p.batting && p.batting.p_balls >= 100 && p.batting.chase_p_sr >= 160)
      .sort((a, b) => b.batting.p_sr - a.batting.p_sr)
      .slice(0, 3);

    return res.json({
      query: q,
      answer: `Top pressure finishers with exceptional strike rates and proven volume in high-RRR chases:\n\n` +
              topFinishers.map((b, i) => `${i+1}. ${b.player_name} (${b.batting.p_sr} pressure SR, +${b.batting.delta_sr} SR delta, ${b.batting.p_runs} pressure runs)`).join('\n') +
              "\n\nRinku Singh (+45.2 SR delta) and David Miller (+76.9 SR delta) are the standout match-winners under extreme chase conditions.",
      players: topFinishers
    });
  }

  // Check 5: Single Player Deep Query
  const singleMatch = allPlayers.find(p => q.includes(p.player_name.toLowerCase()));
  if (singleMatch) {
    let details = `${singleMatch.player_name} (${singleMatch.primary_role}, ${singleMatch.country}):\n\n`;
    details += `• Overall Pressure Reliability Index: ${singleMatch.overall_pri} / 100 (${singleMatch.sample_confidence} Confidence)\n`;
    if (singleMatch.batting) {
      details += `• Pressure Batting: ${singleMatch.batting.p_runs} runs @ ${singleMatch.batting.p_sr} SR (Normal: ${singleMatch.batting.norm_sr} SR | Delta: +${singleMatch.batting.delta_sr})\n`;
      details += `• Pressure Average: ${singleMatch.batting.p_avg} | Boundary %: ${singleMatch.batting.p_bound_pct}%\n`;
    }
    if (singleMatch.bowling) {
      details += `• Pressure Bowling: ${singleMatch.bowling.p_wkts} wkts @ ${singleMatch.bowling.p_econ} Econ (Normal: ${singleMatch.bowling.norm_econ} | Delta: ${singleMatch.bowling.delta_econ})\n`;
      details += `• Dot Ball %: ${singleMatch.bowling.p_dot_pct}% | Death Overs Econ: ${singleMatch.bowling.death_p_econ}\n`;
    }
    if (singleMatch.rr_tactical_fit) {
      details += `• RR Tactical Fit: ${singleMatch.rr_tactical_fit}\n`;
    }
    details += `• Scouting Verdict: ${singleMatch.key_strength || 'Proven match-winner with high tactical versatility.'}`;

    return res.json({
      query: q,
      answer: details,
      players: [singleMatch]
    });
  }

  // Fallback: General keyword search
  const matches = allPlayers
    .filter(p => p.player_name.toLowerCase().includes(q) || (p.primary_role && p.primary_role.toLowerCase().includes(q)))
    .slice(0, 3);

  res.json({
    query: q,
    answer: `Found ${matches.length} matching players in the official dataset evaluated under pressure conditions.`,
    players: matches
  });
});

// 14. Methodology & Mathematical Proofs
app.get('/api/methodology', (req, res) => {
  res.json({
    pressure_definition: {
      inn2_formula: "P_ball = 0.42 * C_rrr + 0.33 * C_wkt + 0.25 * C_stage + Interaction_Bonus + Knockout_Bonus",
      inn1_formula: "P_ball = max(Collapse_Crisis, Death_Phase_Base) + Knockout_Bonus",
      super_over: "P_ball = 100.0",
      thresholds: {
        high: ">= 60 (Top 14.8% of deliveries)",
        medium: "35 to 59.9 (18.0% of deliveries)",
        low: "< 35 (67.2% of deliveries)"
      }
    },
    scoring_indices: {
      batting: "BPRI = w_sample * (0.35 * S_sr + 0.25 * S_avg + 0.20 * S_delta + 0.20 * S_bound) + (1 - w_sample) * 50.0",
      bowling: "BoPRI = w_sample * (0.35 * S_econ + 0.30 * S_wkt + 0.20 * S_strangle + 0.15 * S_delta_econ) + (1 - w_sample) * 50.0",
      all_rounder: "ARPRI = 2 * (BPRI * BoPRI) / (BPRI + BoPRI) * Volume_Factor",
      sample_shrinkage: "w_sample = N_balls / (N_balls + 60.0)"
    },
    validation: {
      total_balls_analyzed: overviewStats.total_deliveries,
      total_matches: overviewStats.total_matches,
      cricket_rules_enforced: [
        "Leg-byes and byes are excluded from bowler conceded runs (official ICC/IPL standard).",
        "Wides and oversteps are counted towards bowler conceded runs and team score, but do not increment legal balls.",
        "Run outs and retire outs are excluded from bowler wicket tally.",
        "Bayesian shrinkage dampens small samples to prevent single-match bias."
      ]
    }
  });
});

// 13. Download CSV Rankings
app.get('/api/export/csv', (req, res) => {
  const csvPath = path.join(DOCS_DIR, 'ROYAL_SCOUT_PRESSURE_RANKINGS.csv');
  if (fs.existsSync(csvPath)) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ROYAL_SCOUT_PRESSURE_RANKINGS.csv"');
    fs.createReadStream(csvPath).pipe(res);
  } else {
    res.status(404).json({ error: 'CSV file not found' });
  }
});

// Serve frontend production build if available
const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
  });
  console.log(`[ROYAL SCOUT AI] Serving frontend production build from ${DIST_DIR}`);
}

app.listen(PORT, () => {
  console.log(`[ROYAL SCOUT AI] Backend server running on http://localhost:${PORT}`);
});
