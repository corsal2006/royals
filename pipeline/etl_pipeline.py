"""
ROYAL SCOUT AI — ETL Pipeline & Match Situation Reconstructor
-------------------------------------------------------------
Reproducible ETL pipeline that reconstructs match situations before each delivery,
calculates delivery-level pressure index, and prepares analytical datasets.
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
    
    # 1. Sort deliveries strictly in chronological order
    bbb = ball_by_ball.sort_values(
        ['match_id', 'innings', 'overid', 'over_ball_num']
    ).reset_index(drop=True)
    
    # 2. Distinguish legal vs illegal deliveries
    # In cricket, wide and overstep (no-ball) and other illegal deliveries require an extra ball to be bowled
    bbb['is_illegal'] = bbb['extras_type'].isin(['wide', 'Overstep', 'other'])
    bbb['is_legal'] = ~bbb['is_illegal']
    
    # 3. Runs calculation
    # Batter runs = 'runs'
    # Bowler runs conceded = runs + (1 if wide/overstep/other) + extras_2_runs (byes and legbyes excluded!)
    bbb['bowler_extra'] = np.where(bbb['extras_type'].isin(['wide', 'Overstep', 'other']), 1, 0) + bbb['extras_2_runs'].fillna(0)
    bbb['bowler_runs_conceded'] = bbb['runs'] + bbb['bowler_extra']
    
    # Team runs conceded = runs + (1 if any extras_type) + extras_2_runs
    bbb['team_extra'] = np.where(bbb['extras_type'].notna(), 1, 0) + bbb['extras_2_runs'].fillna(0)
    bbb['team_ball_runs'] = bbb['runs'] + bbb['team_extra']
    
    # 4. Bowler wickets: only credit bowler for direct dismissals (Caught, Bowled, LBW, Stump, Hit Wicket)
    bowler_dismissals = ['Caught', 'Bowled', 'LBW', 'Stump', 'Hit Wicket']
    bbb['is_bowler_wkt'] = bbb['is_wicket'] & bbb['dismissal_type'].isin(bowler_dismissals)
    bbb['is_run_out'] = bbb['is_wicket'] & (bbb['dismissal_type'] == 'RunOut')
    
    # 5. Calculate Innings 1 totals to set accurate targets for Innings 2
    inn1_totals = bbb[bbb['innings'] == 1].groupby('match_id')['team_ball_runs'].sum().to_dict()
    
    # Build match targets and knockout context dictionary
    m_targets = {}
    m_knockouts = {}
    m_stages = {}
    m_formats = {}
    for idx, row in matches.iterrows():
        mid = row['match_id']
        ko = (row['knock_out'] == 1) or (str(row['stage']).lower() in ['final', 'qualifier', 'super 4', 'semi-final'])
        m_knockouts[mid] = ko
        m_stages[mid] = str(row['stage']) if pd.notna(row['stage']) else 'League'
        
        # Target determination
        if pd.notna(row['revised_target']):
            m_targets[mid] = float(row['revised_target'])
        elif mid in inn1_totals:
            m_targets[mid] = float(inn1_totals[mid] + 1)
        else:
            m_targets[mid] = 165.0  # Fallback par score
            
    bbb['target'] = bbb['match_id'].map(m_targets).fillna(165.0)
    bbb['is_knockout'] = bbb['match_id'].map(m_knockouts).fillna(False)
    bbb['stage'] = bbb['match_id'].map(m_stages).fillna('League')
    
    # 6. Cumulative match situation BEFORE the ball is bowled
    # groupby match_id and innings:
    print("Computing cumulative state (runs, wickets, balls)...")
    bbb['cum_runs'] = bbb.groupby(['match_id', 'innings'])['team_ball_runs'].cumsum() - bbb['team_ball_runs']
    bbb['cum_wkts'] = bbb.groupby(['match_id', 'innings'])['is_wicket'].cumsum() - bbb['is_wicket'].astype(int)
    bbb['cum_legal_balls'] = bbb.groupby(['match_id', 'innings'])['is_legal'].cumsum() - bbb['is_legal'].astype(int)
    
    # Phase calculation
    # Powerplay: overs 1-6; Middle: overs 7-15; Death: overs 16-20
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
            runs_req = max(1.0, row['target'] - row['cum_runs'])
            balls_rem = max(1, 120 - int(row['cum_legal_balls']))
            wkts_lost = min(9, int(row['cum_wkts']))
            rrr = (runs_req / balls_rem) * 6.0
            
            # Required Run Rate pressure (smooth sigmoid centered around 9.5 RRR)
            c_rrr = 100.0 / (1.0 + np.exp(-0.65 * (rrr - 9.5)))
            
            # Wicket scarcity pressure (exponential loss of batting resources)
            c_wkt = ((wkts_lost / 9.0) ** 1.8) * 100.0
            
            # Match stage urgency (last 5 overs = last 30 legal balls)
            c_stage = max(0.0, (30.0 - balls_rem) / 30.0) * 100.0 if balls_rem <= 30 else 0.0
            
            # Compounding crisis interaction (high RRR with few wickets in hand)
            interaction = 0.0
            if rrr > 10.0 and wkts_lost >= 4:
                interaction = min(15.0, (rrr - 10.0) * (wkts_lost - 3))
                
            p = 0.42 * c_rrr + 0.33 * c_wkt + 0.25 * c_stage + interaction + ko_bonus
            pressures.append(min(100.0, max(0.0, p)))
        else:
            # Innings 1 (Setting target)
            over = row['overid']
            wkts_lost = min(9, int(row['cum_wkts']))
            
            p = 15.0  # Base early innings pressure
            
            # Collapse pressure
            if over <= 6:
                if wkts_lost >= 3: p += 55.0
                elif wkts_lost >= 2: p += 30.0
                elif wkts_lost >= 1: p += 10.0
            elif over <= 12:
                if wkts_lost >= 5: p += 60.0
                elif wkts_lost >= 4: p += 45.0
                elif wkts_lost >= 3: p += 25.0
            elif over <= 15:
                if wkts_lost >= 6: p += 55.0
                elif wkts_lost >= 5: p += 40.0
                
            # Death overs acceleration pressure
            if over >= 16:
                death_base = {16: 40.0, 17: 48.0, 18: 56.0, 19: 64.0, 20: 72.0}.get(over, 50.0)
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
    
    print("ETL complete. Delivery dataset processed successfully!")
    return bbb

if __name__ == "__main__":
    competitions, teams, matches, ball_by_ball, playing_eleven, player_mapping = load_raw_data()
    bbb_processed = process_deliveries(ball_by_ball, matches)
    print("Sample processed deliveries:")
    print(bbb_processed[['match_id', 'innings', 'overid', 'striker_name', 'bowler_name', 'pressure_index', 'pressure_category']].head(10))

