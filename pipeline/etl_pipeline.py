"""
ROYAL SCOUT AI — ETL Pipeline & Match Situation Reconstructor
-------------------------------------------------------------
Reproducible ETL pipeline that reconstructs match situations before each delivery,
calculates delivery-level pressure index, and prepares analytical datasets.
Strict adherence to official cricket scoring laws and dynamic DLS rain-reduction handling.
"""

import os
import glob
import numpy as np
import pandas as pd

RAW_DATA_DIR = r"c:\Users\megha\royals\raw_data\SupeRR Selector Season 2 _ Problem Statement _ Data Pack\SupeRR Selector Season 2 _ Data Pack"

def load_raw_data(data_dir=RAW_DATA_DIR):
    print("Loading raw CSV files from:", data_dir)
    competitions = pd.read_csv(os.path.join(data_dir, "competitions.csv"))
    teams = pd.read_csv(os.path.join(data_dir, "teams.csv"))
    matches = pd.read_csv(os.path.join(data_dir, "matches.csv"))
    ball_by_ball = pd.read_csv(os.path.join(data_dir, "ball_by_ball.csv"))
    playing_eleven = pd.read_csv(os.path.join(data_dir, "playing_eleven.csv"))
    player_mapping = pd.read_csv(os.path.join(data_dir, "competition_team_player_mapping.csv"))
    
    print(f"Loaded: competitions ({len(competitions)}), teams ({len(teams)}), matches ({len(matches)}), "
          f"ball_by_ball ({len(ball_by_ball)}), playing_eleven ({len(playing_eleven)}), mapping ({len(player_mapping)})")
    return competitions, teams, matches, ball_by_ball, playing_eleven, player_mapping

def process_deliveries(ball_by_ball, matches):
    print("Processing deliveries and reconstructing match situations...")
    
    # 1. Sort deliveries strictly in chronological sequence
    sort_cols = ['match_id', 'innings']
    if 'innings_ball_num' in ball_by_ball.columns:
        sort_cols.append('innings_ball_num')
    sort_cols.extend(['overid', 'over_ball_num'])
    
    bbb = ball_by_ball.sort_values(sort_cols).reset_index(drop=True)
    
    # 2. Distinguish legal vs illegal deliveries
    # In cricket, wide and overstep (no-ball) require an extra legal delivery to be bowled
    bbb['is_illegal'] = bbb['extras_type'].isin(['wide', 'Overstep', 'other'])
    bbb['is_legal'] = ~bbb['is_illegal']
    
    # 3. Runs calculation conforming to ICC scoring laws
    # Batter runs = 'runs' off the bat
    # Bowler runs conceded = runs + (wide / overstep / other penalties) + extras_2_runs (byes and legbyes excluded!)
    bbb['bowler_extra'] = np.where(bbb['extras_type'].isin(['wide', 'Overstep', 'other']), 1, 0) + bbb['extras_2_runs'].fillna(0)
    bbb['bowler_runs_conceded'] = bbb['runs'] + bbb['bowler_extra']
    
    # Team runs conceded = runs + (1 if any extras_type) + extras_2_runs
    bbb['team_extra'] = np.where(bbb['extras_type'].notna(), 1, 0) + bbb['extras_2_runs'].fillna(0)
    bbb['team_ball_runs'] = bbb['runs'] + bbb['team_extra']
    
    # 4. Bowler wickets: only credit bowler for direct dismissals (Caught, Bowled, LBW, Stump, Hit Wicket)
    bowler_dismissals = ['Caught', 'Bowled', 'LBW', 'Stump', 'Hit Wicket']
    bbb['is_bowler_wkt'] = bbb['is_wicket'] & bbb['dismissal_type'].isin(bowler_dismissals)
    bbb['is_run_out'] = bbb['is_wicket'] & (bbb['dismissal_type'] == 'RunOut')
    
    # 5. Innings 1 totals to set accurate targets for Innings 2
    inn1_totals = bbb[bbb['innings'] == 1].groupby('match_id')['team_ball_runs'].sum().to_dict()
    
    # Build match targets, DLS revised overs, and knockout context dictionaries
    m_targets = {}
    m_knockouts = {}
    m_stages = {}
    m_revised_inn1 = matches.set_index('match_id')['first_inn_revised_overs'].dropna().to_dict() if 'first_inn_revised_overs' in matches.columns else {}
    m_revised_inn2 = matches.set_index('match_id')['second_inn_revised_overs'].dropna().to_dict() if 'second_inn_revised_overs' in matches.columns else {}
    
    for idx, row in matches.iterrows():
        mid = row['match_id']
        ko = (row['knock_out'] == 1) or (str(row['stage']).lower() in ['final', 'qualifier', 'super 4', 'semi-final'])
        m_knockouts[mid] = ko
        m_stages[mid] = str(row['stage']) if pd.notna(row['stage']) else 'League'
        
        # Target determination with DLS precedence
        if pd.notna(row['revised_target']) and float(row['revised_target']) > 0:
            m_targets[mid] = float(row['revised_target'])
        elif mid in inn1_totals:
            m_targets[mid] = float(inn1_totals[mid] + 1)
        else:
            m_targets[mid] = 165.0  # Fallback par score
            
    bbb['target'] = bbb['match_id'].map(m_targets).fillna(165.0)
    bbb['is_knockout'] = bbb['match_id'].map(m_knockouts).fillna(False)
    bbb['stage'] = bbb['match_id'].map(m_stages).fillna('League')
    bbb['rev_balls_inn1'] = bbb['match_id'].map(m_revised_inn1)
    bbb['rev_balls_inn2'] = bbb['match_id'].map(m_revised_inn2)
    
    # 6. Cumulative match situation BEFORE each delivery
    print("Computing cumulative match state (runs, wickets, legal balls)...")
    bbb['cum_runs'] = bbb.groupby(['match_id', 'innings'])['team_ball_runs'].cumsum() - bbb['team_ball_runs']
    bbb['cum_wkts'] = bbb.groupby(['match_id', 'innings'])['is_wicket'].cumsum() - bbb['is_wicket'].astype(int)
    bbb['cum_legal_balls'] = bbb.groupby(['match_id', 'innings'])['is_legal'].cumsum() - bbb['is_legal'].astype(int)
    
    # Phase calculation
    bbb['phase'] = np.where(bbb['overid'] <= 6, 'Powerplay',
                   np.where(bbb['overid'] <= 15, 'Middle', 'Death'))
    
    # 7. Delivery-level Pressure Calculation (P_ball in [0, 100])
    print("Computing delivery-level Pressure Index (P_ball)...")
    pressures = []
    
    for idx, row in bbb.iterrows():
        inn = row['innings']
        # Super Overs are maximum 100 pressure
        if inn in [3, 4]:
            pressures.append(100.0)
            continue
            
        ko_bonus = 12.0 if row['is_knockout'] else 0.0
        
        if inn == 2:
            rev_balls = row['rev_balls_inn2']
            max_balls = int(rev_balls) if pd.notna(rev_balls) and rev_balls > 0 else 120
            
            runs_req = row['target'] - row['cum_runs']
            balls_rem = max(1, max_balls - int(row['cum_legal_balls']))
            
            # If target already chased, pressure drops to baseline
            if runs_req <= 0:
                pressures.append(5.0)
                continue
                
            wkts_lost = min(9, int(row['cum_wkts']))
            rrr = (runs_req / balls_rem) * 6.0
            
            # Required Run Rate pressure (smooth sigmoid centered around 9.5 RRR)
            c_rrr = 100.0 / (1.0 + np.exp(-0.65 * (rrr - 9.5)))
            
            # Wicket scarcity pressure (exponential loss of batting resources)
            c_wkt = ((wkts_lost / 9.0) ** 1.8) * 100.0
            
            # Match stage urgency scaled to innings duration (final 25% of legal balls)
            urgency_balls = min(30, int(max_balls * 0.25))
            c_stage = max(0.0, (urgency_balls - balls_rem) / float(urgency_balls)) * 100.0 if balls_rem <= urgency_balls else 0.0
            
            # Compounding crisis interaction (high RRR with few wickets in hand)
            interaction = 0.0
            if rrr > 10.0 and wkts_lost >= 4:
                interaction = min(15.0, (rrr - 10.0) * (wkts_lost - 3))
                
            p = 0.42 * c_rrr + 0.33 * c_wkt + 0.25 * c_stage + interaction + ko_bonus
            pressures.append(min(100.0, max(0.0, p)))
        else:
            # Innings 1 (Setting target)
            rev_balls = row['rev_balls_inn1']
            max_balls = int(rev_balls) if pd.notna(rev_balls) and rev_balls > 0 else 120
            max_overs = max(5, max_balls // 6)
            
            over = row['overid']
            wkts_lost = min(9, int(row['cum_wkts']))
            
            p = 15.0  # Base early innings pressure
            
            # Dynamic Powerplay & Middle overs thresholds adapted to match length
            pp_limit = min(6, int(max_overs * 0.3))
            mid_limit = min(15, int(max_overs * 0.75))
            
            if over <= pp_limit:
                if wkts_lost >= 3: p += 55.0
                elif wkts_lost >= 2: p += 30.0
                elif wkts_lost >= 1: p += 10.0
            elif over <= mid_limit:
                if wkts_lost >= 5: p += 60.0
                elif wkts_lost >= 4: p += 45.0
                elif wkts_lost >= 3: p += 25.0
            
            # Death overs acceleration pressure (final 4 overs of the innings)
            death_start = max(1, max_overs - 4)
            if over >= death_start:
                death_step = (over - death_start) / max(1, max_overs - death_start)
                death_base = 40.0 + death_step * 32.0
                if wkts_lost >= 5: death_base += 15.0
                p = max(p, death_base)
                
            p += ko_bonus
            pressures.append(min(100.0, max(0.0, p)))
            
    bbb['pressure_index'] = np.round(pressures, 2)
    
    # Categorize pressure
    bbb['pressure_category'] = pd.cut(
        bbb['pressure_index'],
        bins=[-1, 40, 65, 101],
        labels=['LOW', 'MEDIUM', 'HIGH']
    )
    bbb['is_high_pressure'] = bbb['pressure_index'] >= 60.0
    bbb['is_normal_pressure'] = bbb['pressure_index'] < 40.0
    
    print("ETL complete. Delivery dataset processed successfully with dynamic match lengths!")
    return bbb

if __name__ == "__main__":
    competitions, teams, matches, ball_by_ball, playing_eleven, player_mapping = load_raw_data()
    bbb_processed = process_deliveries(ball_by_ball, matches)
    print("Sample processed deliveries:")
    print(bbb_processed[['match_id', 'innings', 'overid', 'striker_name', 'bowler_name', 'pressure_index', 'pressure_category']].head(10))
