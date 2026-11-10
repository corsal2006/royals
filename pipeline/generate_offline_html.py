"""
Standalone Offline HTML Dossier Generator for ROYAL SCOUT AI
SuperRR Selector 2.0 • Rajasthan Royals Official Round 1 Submission
Produces docs/SUPER_RR_SELECTOR_ROUND1_SUBMISSION.html
"""
import json
import os

def build_standalone_html():
    with open('backend/data/top10_batters.json', 'r', encoding='utf-8') as f:
        batters = json.load(f)

    with open('backend/data/top10_bowlers.json', 'r', encoding='utf-8') as f:
        bowlers = json.load(f)
    
    with open('backend/data/overview_stats.json', 'r', encoding='utf-8') as f:
        overview = json.load(f)

    with open('backend/data/players_master.json', 'r', encoding='utf-8') as f:
        players_by_id = json.load(f)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ROYAL SCOUT AI • SuperRR Selector 2.0 Round 1 Official Submission</title>
  <style>
    :root {{
      --navy-950: #040711;
      --navy-900: #070B19;
      --navy-850: #0B1226;
      --navy-800: #0F172A;
      --navy-700: #1E293B;
      --navy-600: #334155;
      --royal-pink: #EA1A7F;
      --royal-gold: #E2B714;
      --royal-blue: #1D4ED8;
      --royal-cyan: #06B6D4;
      --emerald-400: #34D399;
      --rose-400: #FB7185;
      --slate-100: #F1F5F9;
      --slate-300: #CBD5E1;
      --slate-400: #94A3B8;
      --slate-500: #64748B;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--navy-900);
      color: var(--slate-100);
      line-height: 1.6;
      padding: 40px 20px;
    }}
    .container {{
      max-width: 1200px;
      margin: 0 auto;
    }}
    .badge {{
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }}
    .badge-pink {{
      background: rgba(234, 26, 127, 0.15);
      border: 1px solid rgba(234, 26, 127, 0.4);
      color: var(--royal-pink);
    }}
    .badge-gold {{
      background: rgba(226, 183, 20, 0.15);
      border: 1px solid rgba(226, 183, 20, 0.4);
      color: var(--royal-gold);
    }}
    .header-card {{
      background: linear-gradient(135deg, #0B1226 0%, #070B19 100%);
      border: 1px solid rgba(234, 26, 127, 0.35);
      border-radius: 24px;
      padding: 48px;
      margin-bottom: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      position: relative;
    }}
    h1 {{
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }}
    .highlight-pink {{
      color: var(--royal-pink);
    }}
    .highlight-gold {{
      color: var(--royal-gold);
    }}
    .subtitle {{
      color: var(--slate-300);
      font-size: 16px;
      max-width: 900px;
      margin-bottom: 24px;
    }}
    .stats-strip {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--navy-700);
    }}
    .stat-box {{
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--navy-700);
      border-radius: 14px;
      padding: 16px;
    }}
    .stat-label {{
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--slate-400);
    }}
    .stat-val {{
      font-size: 26px;
      font-weight: 900;
      color: #FFF;
      display: block;
      margin-top: 4px;
    }}
    .section {{
      background: var(--navy-850);
      border: 1px solid var(--navy-700);
      border-radius: 20px;
      padding: 36px;
      margin-bottom: 36px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }}
    h2 {{
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .section-desc {{
      font-size: 13px;
      color: var(--slate-400);
      margin-bottom: 24px;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 16px;
    }}
    th {{
      background: #0F172A;
      color: var(--slate-400);
      text-align: left;
      padding: 12px 14px;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid var(--navy-700);
    }}
    td {{
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--slate-300);
    }}
    tr:hover td {{
      background: rgba(234, 26, 127, 0.04);
    }}
    .rank-pill {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--navy-700);
      color: #FFF;
      font-weight: 800;
      font-size: 12px;
    }}
    .rank-1 {{ background: var(--royal-gold); color: #000; }}
    .rank-2 {{ background: #94A3B8; color: #000; }}
    .rank-3 {{ background: #B45309; color: #FFF; }}
    .score-badge {{
      font-weight: 800;
      color: var(--royal-pink);
      font-family: monospace;
      font-size: 14px;
    }}
    .player-name {{
      font-weight: 700;
      color: #FFF;
    }}
    .player-team {{
      font-size: 11px;
      color: var(--slate-500);
    }}
    .grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }}
    .card-item {{
      background: #0B1226;
      border: 1px solid var(--navy-700);
      border-radius: 14px;
      padding: 20px;
    }}
    .formula-box {{
      background: #040711;
      border: 1px solid rgba(226, 183, 20, 0.3);
      border-radius: 12px;
      padding: 16px;
      font-family: monospace;
      font-size: 12px;
      color: var(--royal-gold);
      margin: 12px 0;
      overflow-x: auto;
    }}
    .callout {{
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 13px;
    }}
    .callout-info {{
      background: rgba(29, 78, 216, 0.12);
      border: 1px solid rgba(29, 78, 216, 0.3);
      color: #93C5FD;
    }}
    .callout-warning {{
      background: rgba(226, 183, 20, 0.1);
      border: 1px solid rgba(226, 183, 20, 0.3);
      color: #FDE047;
    }}
    @media print {{
      body {{ background: #FFF !important; color: #000 !important; padding: 0 !important; }}
      .header-card, .section {{ background: #FFF !important; border: 1px solid #CCC !important; color: #000 !important; box-shadow: none !important; page-break-after: always; }}
      th {{ background: #EEE !important; color: #000 !important; }}
      td {{ color: #000 !important; border-bottom: 1px solid #DDD !important; }}
      .player-name {{ color: #000 !important; }}
      .formula-box {{ background: #F8F9FA !important; color: #000 !important; border-color: #999 !important; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Header Banner -->
    <div class="header-card">
      <span class="badge badge-pink">Official Submission • SuperRR Selector 2.0</span>
      <h1>ROYAL SCOUT <span class="highlight-pink">AI</span></h1>
      <p class="subtitle">
        Identifying the Most Reliable Players Under Pressure to Strengthen Rajasthan Royals at the IPL 2027 Auction.
        Built with high-fidelity ball-by-ball match state reconstruction, Bayesian sample-size shrinkage, and tactical squad fit optimization.
      </p>

      <div class="stats-strip">
        <div class="stat-box">
          <span class="stat-label">Deliveries Analyzed</span>
          <span class="stat-val">{overview.get('total_deliveries', 200999):,}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Matches</span>
          <span class="stat-val">{overview.get('total_matches', 883)}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Pressure Balls Evaluated</span>
          <span class="stat-val">{overview.get('pressure_balls', 39289):,}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Verified Players Tracked</span>
          <span class="stat-val">{overview.get('total_players', 1709):,}</span>
        </div>
      </div>
    </div>

    <!-- Official Unstop Submission Top 10 Batters -->
    <div class="section">
      <span class="badge badge-pink">Unstop Form Submission • Batters Dropdown</span>
      <h2>Top 10 Batters Under Pressure (Ranks 1 to 10)</h2>
      <p class="section-desc">
        Ranks 1 to 10 selected from the official Unstop submission dropdown. Ranked by Batting Pressure Reliability Index (BPRI).
      </p>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player Name</th>
            <th>Role</th>
            <th>BPRI Score</th>
            <th>Pressure Runs</th>
            <th>Pressure SR</th>
            <th>Normal SR</th>
            <th>SR Delta</th>
            <th>Boundary %</th>
            <th>Sample (Balls)</th>
          </tr>
        </thead>
        <tbody>
"""

    for b in batters:
        rank = b['rank']
        meta = players_by_id.get(str(b['striker_id']), {})
        team = meta.get('teams', 'International / Franchise')
        role = meta.get('playing_role', 'Batter')
        rank_class = f"rank-{rank}" if rank <= 3 else ""
        delta_str = f"+{b['delta_sr']}" if b['delta_sr'] > 0 else str(b['delta_sr'])

        html_content += f"""
          <tr>
            <td><span class="rank-pill {rank_class}">{rank}</span></td>
            <td>
              <span class="player-name">{b['striker_name']}</span><br/>
              <span class="player-team">{team}</span>
            </td>
            <td>{role}</td>
            <td><span class="score-badge">{b['bpri']}</span></td>
            <td><strong>{b['p_runs']}</strong></td>
            <td><strong>{b['p_sr']}</strong></td>
            <td>{b['norm_sr']}</td>
            <td style="color: var(--emerald-400); font-weight: bold;">{delta_str}</td>
            <td>{b['p_bound_pct']}%</td>
            <td>{b['p_balls']}</td>
          </tr>
"""

    html_content += """
        </tbody>
      </table>
    </div>

    <!-- Official Unstop Submission Top 10 Bowlers -->
    <div class="section">
      <span class="badge badge-gold">Unstop Form Submission • Bowlers Dropdown</span>
      <h2>Top 10 Bowlers Under Pressure (Ranks 1 to 10)</h2>
      <p class="section-desc">
        Ranks 1 to 10 selected from the official Unstop submission dropdown. Ranked by Bowling Pressure Reliability Index (BoPRI).
      </p>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player Name</th>
            <th>Bowling Style</th>
            <th>BoPRI Score</th>
            <th>Pressure Econ</th>
            <th>Normal Econ</th>
            <th>Econ Delta</th>
            <th>Pressure Wkts</th>
            <th>Dot Ball %</th>
            <th>Death Econ</th>
            <th>Sample (Balls)</th>
          </tr>
        </thead>
        <tbody>
"""

    for bow in bowlers:
        rank = bow['rank']
        meta = players_by_id.get(str(bow['bowler_id']), {})
        team = meta.get('teams', 'International / Franchise')
        style = meta.get('bowling_style', 'Bowler')
        rank_class = f"rank-{rank}" if rank <= 3 else ""
        delta_str = f"+{bow['delta_econ']}" if bow['delta_econ'] > 0 else str(bow['delta_econ'])

        html_content += f"""
          <tr>
            <td><span class="rank-pill {rank_class}">{rank}</span></td>
            <td>
              <span class="player-name">{bow['bowler_name']}</span><br/>
              <span class="player-team">{team}</span>
            </td>
            <td>{style}</td>
            <td><span class="score-badge" style="color: var(--royal-gold);">{bow['bopri']}</span></td>
            <td><strong>{bow['p_econ']}</strong></td>
            <td>{bow['norm_econ']}</td>
            <td style="color: var(--emerald-400); font-weight: bold;">{delta_str}</td>
            <td><strong>{bow['p_wkts']}</strong></td>
            <td>{bow['p_dot_pct']}%</td>
            <td>{bow['death_p_econ']}</td>
            <td>{bow['p_balls']}</td>
          </tr>
"""

    html_content += """
        </tbody>
      </table>
    </div>

    <!-- Methodology & Mathematical Rigor -->
    <div class="section">
      <span class="badge badge-pink">Mathematical Formulation</span>
      <h2>Pressure Situation Reconstruction & PRI Methodology</h2>
      <p class="section-desc">
        Defensible delivery-level situational modeling without black-box bias.
      </p>

      <div class="callout callout-info">
        <strong>Dynamic Ball Pressure Formula (P_ball ∈ [0, 100]):</strong><br/>
        Every delivery is assigned a pressure index based on required run rate (RRR), wickets lost, balls remaining, target score, and innings phase.
      </div>

      <div class="formula-box">
        Innings 2 (Chasing):<br/>
        P_ball = 0.40 * clip((RRR - 6.0)/8.0, 0, 1) + 0.25 * clip(W_lost/7.0, 0, 1) + 0.20 * clip((120 - B_legal)/60.0, 0, 1) + 0.15 * clip((Target - 140.0)/80.0, 0, 1)<br/><br/>
        Innings 1 (Setting Total):<br/>
        P_ball = 0.45 * clip((W_lost - 2)/6.0, 0, 1) + 0.35 * (1.0 if over >= 16 else (0.5 if over < 6 else 0.2)) + 0.20 * clip(CR - 8.0/6.0, 0, 1)
      </div>

      <div class="formula-box">
        Bayesian Sample-Size Shrinkage Formula:<br/>
        w_sample = N_pressure / (N_pressure + 60.0)<br/>
        PRI_final = w_sample * PRI_raw + (1.0 - w_sample) * 50.0
      </div>

      <div class="callout callout-warning">
        <strong>Fielding Data Disclosure:</strong><br/>
        The official proprietary dataset includes wicketkeeper fielding records (stumpings and caught behinds) but omits delivery-level fielder tags for outfield catches and run-outs. 
        Accordingly, outfield fielding analysis is transparently reported as limited to preserve 100% data integrity without fabricating statistics.
      </div>
    </div>

    <!-- Rajasthan Royals Auction Strategy -->
    <div class="section">
      <span class="badge badge-gold">Auction Decision Support</span>
      <h2>Rajasthan Royals IPL 2027 Auction Strategy</h2>
      <p class="section-desc">
        How identified pressure performers strengthen Rajasthan Royals' existing retained core.
      </p>

      <div class="grid-2">
        <div class="card-item">
          <h3 style="color: var(--royal-pink); font-size: 15px; margin-bottom: 8px;">1. Specialist Death Pacer: Matheesha Pathirana</h3>
          <p style="font-size: 13px; color: var(--slate-300);">
            <strong>Telemetry:</strong> 44 pressure wickets, 8.29 death-overs economy, 73.40 BoPRI.<br/>
            <strong>Tactical Fit:</strong> Solves RR's critical death-overs vulnerability. Sling release and lethal yorker choke opponents in overs 18–20.
          </p>
        </div>

        <div class="card-item">
          <h3 style="color: var(--royal-gold); font-size: 15px; margin-bottom: 8px;">2. Mystery Spin Squeeze: Kuldeep Yadav</h3>
          <p style="font-size: 13px; color: var(--slate-300);">
            <strong>Telemetry:</strong> 88.34 BoPRI (#1 overall bowler), 6.51 pressure economy, 10.55 average.<br/>
            <strong>Tactical Fit:</strong> Middle-overs stranglehold at Sawai Mansingh Stadium. Stifles opponent acceleration even under high RRR.
          </p>
        </div>

        <div class="card-item">
          <h3 style="color: var(--royal-pink); font-size: 15px; margin-bottom: 8px;">3. Clutch Chase Finisher: Rinku Singh</h3>
          <p style="font-size: 13px; color: var(--slate-300);">
            <strong>Telemetry:</strong> 934 pressure runs (#1 in world cricket), 172.3 pressure SR (+48.9 SR delta), 73.16 BPRI.<br/>
            <strong>Tactical Fit:</strong> Ice-cold left-handed closer. Partners seamlessly with Dhruv Jurel and Shimron Hetmyer to secure close finishes.
          </p>
        </div>

        <div class="card-item">
          <h3 style="color: var(--emerald-400); font-size: 15px; margin-bottom: 8px;">4. Crisis Recovery Specialist: Shashank Singh</h3>
          <p style="font-size: 13px; color: var(--slate-300);">
            <strong>Telemetry:</strong> 57.8 pressure average, 163.8 strike rate, 71.04 BPRI.<br/>
            <strong>Tactical Fit:</strong> Rescues the innings from 30/3 without wasting deliveries, insulating Sanju Samson and Yashasvi Jaiswal.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px; color: var(--slate-500); font-size: 12px;">
      ROYAL SCOUT AI • SuperRR Selector 2.0 • Official Hackathon Submission for Rajasthan Royals<br/>
      Reproducible Python Pipeline • Verified 2022–2026 IPL & T20I Dataset
    </div>

  </div>
</body>
</html>
"""
    with open('docs/SUPER_RR_SELECTOR_ROUND1_SUBMISSION.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Generated docs/SUPER_RR_SELECTOR_ROUND1_SUBMISSION.html successfully!")

if __name__ == '__main__':
    build_standalone_html()
