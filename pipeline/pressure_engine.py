"""
ROYAL SCOUT AI — Pressure Analytics Engine & Reliability Scoring
-----------------------------------------------------------------
Calculates Batting Pressure Reliability Index (BPRI), Bowling Pressure Reliability Index (BoPRI),
All-Rounder Pressure Impact (ARPRI), Fielding reliability, and tactical verdicts.
"""

import numpy as np
import pandas as pd

def compute_batting_metrics(bbb):
    print("Computing comprehensive Batting Pressure Metrics...")
    
    # Pressure deliveries (High Pressure: P >= 60)
    p_df = bbb[bbb['is_high_pressure']]
    # Normal deliveries (Low Pressure: P < 40)
    norm_df = bbb[bbb['is_normal_pressure']]
    
    # 1. High Pressure Aggregation
    p_agg = p_df.groupby(['striker_id', 'striker_name']).agg(
        p_balls=('runs', 'count'),
        p_runs=('runs', 'sum'),
        p_fours=('is_four', 'sum'),
        p_sixes=('is_six', 'sum'),
        p_outs=('is_wicket', 'sum'),
        p_dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()
    
    # 2. Normal Aggregation
    norm_agg = norm_df.groupby('striker_id').agg(
        norm_balls=('runs', 'count'),
        norm_runs=('runs', 'sum'),
        norm_fours=('is_four', 'sum'),
        norm_sixes=('is_six', 'sum'),
        norm_outs=('is_wicket', 'sum'),
        norm_dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()
    
    # 3. Situational: Chasing under pressure (Innings 2)
    chase_p_agg = p_df[p_df['innings'] == 2].groupby('striker_id').agg(
        chase_p_balls=('runs', 'count'),
        chase_p_runs=('runs', 'sum'),
        chase_p_outs=('is_wicket', 'sum')
    ).reset_index()
    
    # 4. Situational: Death overs under pressure (overs 16-20)
    death_p_agg = p_df[p_df['overid'] >= 16].groupby('striker_id').agg(
        death_p_balls=('runs', 'count'),
        death_p_runs=('runs', 'sum'),
        death_p_outs=('is_wicket', 'sum')
    ).reset_index()
    
    # 5. Situational: Collapse recovery under pressure (wickets lost >= 3 inside first 10 overs)
    collapse_p_agg = p_df[(p_df['overid'] <= 10) & (p_df['cum_wkts'] >= 3)].groupby('striker_id').agg(
        collapse_p_balls=('runs', 'count'),
        collapse_p_runs=('runs', 'sum'),
        collapse_p_outs=('is_wicket', 'sum')
    ).reset_index()

    # Merge all components
    bat = p_agg.merge(norm_agg, on='striker_id', how='left').fillna(0)
    bat = bat.merge(chase_p_agg, on='striker_id', how='left').fillna(0)
    bat = bat.merge(death_p_agg, on='striker_id', how='left').fillna(0)
    bat = bat.merge(collapse_p_agg, on='striker_id', how='left').fillna(0)
    
    # Calculated rates
    bat['p_sr'] = np.where(bat['p_balls'] > 0, (bat['p_runs'] / bat['p_balls']) * 100.0, 0.0)
    bat['p_avg'] = np.where(bat['p_outs'] > 0, bat['p_runs'] / bat['p_outs'], bat['p_runs'])
    bat['p_bound_pct'] = np.where(bat['p_balls'] > 0, ((bat['p_fours'] + bat['p_sixes']) / bat['p_balls']) * 100.0, 0.0)
    bat['p_dot_pct'] = np.where(bat['p_balls'] > 0, (bat['p_dots'] / bat['p_balls']) * 100.0, 0.0)
    
    bat['norm_sr'] = np.where(bat['norm_balls'] > 0, (bat['norm_runs'] / bat['norm_balls']) * 100.0, 0.0)
    bat['norm_avg'] = np.where(bat['norm_outs'] > 0, bat['norm_runs'] / bat['norm_outs'], bat['norm_runs'])
    bat['delta_sr'] = bat['p_sr'] - bat['norm_sr']
    bat['delta_avg'] = bat['p_avg'] - bat['norm_avg']
    
    bat['chase_p_sr'] = np.where(bat['chase_p_balls'] > 0, (bat['chase_p_runs'] / bat['chase_p_balls']) * 100.0, 0.0)
    bat['chase_p_avg'] = np.where(bat['chase_p_outs'] > 0, bat['chase_p_runs'] / bat['chase_p_outs'], bat['chase_p_runs'])
    bat['death_p_sr'] = np.where(bat['death_p_balls'] > 0, (bat['death_p_runs'] / bat['death_p_balls']) * 100.0, 0.0)
    bat['death_p_avg'] = np.where(bat['death_p_outs'] > 0, bat['death_p_runs'] / bat['death_p_outs'], bat['death_p_runs'])
    
    # BPRI Scoring Formulation
    # Sub-scores:
    # 1. Firepower under pressure (SR baseline: 100 to 200)
    s_sr = np.clip((bat['p_sr'] - 100.0) / (200.0 - 100.0), 0.0, 1.0) * 100.0
    # 2. Wicket preservation under pressure (Avg baseline: 10 to 45)
    s_avg = np.clip((bat['p_avg'] - 10.0) / (45.0 - 10.0), 0.0, 1.0) * 100.0
    # 3. Clutch Delta: Boost over normal baseline (Delta SR: -20 to +40)
    s_delta = np.clip((bat['delta_sr'] - (-20.0)) / (40.0 - (-20.0)), 0.0, 1.0) * 100.0
    # 4. Boundary firepower and dot ball resistance
    s_bound = np.clip((bat['p_bound_pct'] - 10.0) / (30.0 - 10.0), 0.0, 1.0) * 70.0 + \
              np.clip((45.0 - bat['p_dot_pct']) / (45.0 - 20.0), 0.0, 1.0) * 30.0
    
    raw_bat = 0.35 * s_sr + 0.25 * s_avg + 0.20 * s_delta + 0.20 * s_bound
    
    # Bayesian shrinkage / sample-size weighting: K = 60 balls
    K_bat = 60.0
    w_sample = bat['p_balls'] / (bat['p_balls'] + K_bat)
    bat['bpri'] = np.round(w_sample * raw_bat + (1.0 - w_sample) * 50.0, 2)
    
    # Sample confidence
    bat['sample_confidence'] = np.where(bat['p_balls'] >= 250, 'HIGH',
                               np.where(bat['p_balls'] >= 100, 'MEDIUM', 'LOW'))
    
    return bat

def compute_bowling_metrics(bbb):
    print("Computing comprehensive Bowling Pressure Metrics...")
    
    p_df = bbb[bbb['is_high_pressure']]
    norm_df = bbb[bbb['is_normal_pressure']]
    
    # 1. High Pressure Aggregation
    p_agg = p_df.groupby(['bowler_id', 'bowler_name']).agg(
        p_balls=('is_legal', 'sum'),
        p_runs_conceded=('bowler_runs_conceded', 'sum'),
        p_wkts=('is_bowler_wkt', 'sum'),
        p_dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()
    
    # Boundaries conceded under pressure
    p_bounds = p_df[(p_df['is_four'] | p_df['is_six'])].groupby('bowler_id').size().reset_index(name='p_bounds')
    p_agg = p_agg.merge(p_bounds, on='bowler_id', how='left').fillna({'p_bounds': 0})
    
    # Yorkers bowled under pressure
    p_yorkers = p_df[p_df['delivery_style'] == 'Yorker'].groupby('bowler_id').size().reset_index(name='p_yorkers')
    p_agg = p_agg.merge(p_yorkers, on='bowler_id', how='left').fillna({'p_yorkers': 0})
    
    # 2. Normal Aggregation
    norm_agg = norm_df.groupby('bowler_id').agg(
        norm_balls=('is_legal', 'sum'),
        norm_runs_conceded=('bowler_runs_conceded', 'sum'),
        norm_wkts=('is_bowler_wkt', 'sum'),
        norm_dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()
    
    # 3. Situational: Death overs under pressure (overs 16-20)
    death_p_agg = p_df[p_df['overid'] >= 16].groupby('bowler_id').agg(
        death_p_balls=('is_legal', 'sum'),
        death_p_runs=('bowler_runs_conceded', 'sum'),
        death_p_wkts=('is_bowler_wkt', 'sum')
    ).reset_index()
    
    # 4. Situational: Defending target under pressure (Innings 2)
    defend_p_agg = p_df[p_df['innings'] == 2].groupby('bowler_id').agg(
        defend_p_balls=('is_legal', 'sum'),
        defend_p_runs=('bowler_runs_conceded', 'sum'),
        defend_p_wkts=('is_bowler_wkt', 'sum')
    ).reset_index()
    
    # Merge all
    bowl = p_agg.merge(norm_agg, on='bowler_id', how='left').fillna(0)
    bowl = bowl.merge(death_p_agg, on='bowler_id', how='left').fillna(0)
    bowl = bowl.merge(defend_p_agg, on='bowler_id', how='left').fillna(0)
    
    # Rates
    bowl['p_econ'] = np.where(bowl['p_balls'] > 0, (bowl['p_runs_conceded'] / bowl['p_balls']) * 6.0, 12.0)
    bowl['p_avg'] = np.where(bowl['p_wkts'] > 0, bowl['p_runs_conceded'] / bowl['p_wkts'], bowl['p_runs_conceded'])
    bowl['p_sr'] = np.where(bowl['p_wkts'] > 0, bowl['p_balls'] / bowl['p_wkts'], bowl['p_balls'])
    bowl['p_dot_pct'] = np.where(bowl['p_balls'] > 0, (bowl['p_dots'] / bowl['p_balls']) * 100.0, 0.0)
    bowl['p_bound_prev'] = np.where(bowl['p_balls'] > 0, 100.0 - (bowl['p_bounds'] / bowl['p_balls']) * 100.0, 0.0)
    
    bowl['norm_econ'] = np.where(bowl['norm_balls'] > 0, (bowl['norm_runs_conceded'] / bowl['norm_balls']) * 6.0, 9.0)
    bowl['norm_avg'] = np.where(bowl['norm_wkts'] > 0, bowl['norm_runs_conceded'] / bowl['norm_wkts'], bowl['norm_runs_conceded'])
    bowl['delta_econ'] = bowl['norm_econ'] - bowl['p_econ'] # positive = more economical under pressure!
    
    bowl['death_p_econ'] = np.where(bowl['death_p_balls'] > 0, (bowl['death_p_runs'] / bowl['death_p_balls']) * 6.0, 12.0)
    bowl['defend_p_econ'] = np.where(bowl['defend_p_balls'] > 0, (bowl['defend_p_runs'] / bowl['defend_p_balls']) * 6.0, 12.0)
    
    # BoPRI Scoring Formulation
    # 1. Economy control under pressure (baseline: 12.5 to 6.5)
    s_econ = np.clip((12.5 - bowl['p_econ']) / (12.5 - 6.5), 0.0, 1.0) * 100.0
    # 2. Breakthrough punch (Avg: 25 to 10; SR: 18 to 8)
    s_wkt = np.clip((25.0 - bowl['p_avg']) / (25.0 - 10.0), 0.0, 1.0) * 50.0 + \
            np.clip((18.0 - bowl['p_sr']) / (18.0 - 8.0), 0.0, 1.0) * 50.0
    # 3. Boundary suppression & dot ball pressure
    s_strangle = np.clip((bowl['p_dot_pct'] - 20.0) / (50.0 - 20.0), 0.0, 1.0) * 50.0 + \
                 np.clip((bowl['p_bound_prev'] - 70.0) / (90.0 - 70.0), 0.0, 1.0) * 50.0
    # 4. Economy delta advantage
    s_delta_econ = np.clip((bowl['delta_econ'] - (-2.5)) / (2.0 - (-2.5)), 0.0, 1.0) * 100.0
    
    raw_bowl = 0.35 * s_econ + 0.30 * s_wkt + 0.20 * s_strangle + 0.15 * s_delta_econ
    
    # Bayesian shrinkage: K = 60 balls
    K_bowl = 60.0
    w_sample = bowl['p_balls'] / (bowl['p_balls'] + K_bowl)
    bowl['bopri'] = np.round(w_sample * raw_bowl + (1.0 - w_sample) * 50.0, 2)
    
    bowl['sample_confidence'] = np.where(bowl['p_balls'] >= 250, 'HIGH',
                                np.where(bowl['p_balls'] >= 100, 'MEDIUM', 'LOW'))
    
    return bowl

def compute_all_rounders(bat, bowl):
    print("Computing All-Rounder Pressure Impact (ARPRI)...")
    # Merge bat and bowl on player_id
    ar = bat.merge(bowl, left_on='striker_id', right_on='bowler_id', suffixes=('_bat', '_bowl'))
    ar['player_id'] = ar['striker_id']
    ar['player_name'] = ar['striker_name']
    
    # Filter for meaningful contribution with both disciplines under pressure
    # Min 30 pressure balls faced and min 30 pressure legal balls bowled
    dual_mask = (ar['p_balls_bat'] >= 30) & (ar['p_balls_bowl'] >= 30)
    ar = ar[dual_mask].copy()
    
    # Harmonic mean of BPRI and BoPRI to prevent one-discipline domination
    harmonic = 2.0 * (ar['bpri'] * ar['bopri']) / (ar['bpri'] + ar['bopri'])
    
    # Volume factor based on total pressure involvement
    total_involvement = ar['p_balls_bat'] + ar['p_balls_bowl']
    vol_factor = np.clip(total_involvement / 400.0, 0.75, 1.15)
    
    ar['arpri'] = np.round(harmonic * vol_factor, 2)
    return ar.sort_values('arpri', ascending=False)

def compute_fielding_metrics(playing_eleven, matches, bbb):
    print("Computing fielding and wicketkeeping metrics...")
    # 1. Designated wicketkeepers from playing_eleven
    wk_ids = set(playing_eleven[playing_eleven['is_wk'] == True]['player_id'].unique())
    
    # 2. Total catches, stumpings, and runouts in matches
    dismissal_counts = bbb[bbb['is_wicket']]['dismissal_type'].value_counts().to_dict()
    
    print(f"Identified {len(wk_ids)} verified wicketkeepers in tournament playing XIs.")
    print("Delivery-level dismissal types overview:", dismissal_counts)
    
    return wk_ids, dismissal_counts

if __name__ == "__main__":
    from etl_pipeline import load_raw_data, process_deliveries
    comps, teams, matches, bbb, p11, mapping = load_raw_data()
    bbb_proc = process_deliveries(bbb, matches)
    bat = compute_batting_metrics(bbb_proc)
    bowl = compute_bowling_metrics(bbb_proc)
    ar = compute_all_rounders(bat, bowl)
    print("Batting top 5:\n", bat.sort_values('bpri', ascending=False)[['striker_name', 'p_balls', 'p_runs', 'p_sr', 'bpri']].head(5))
    print("Bowling top 5:\n", bowl.sort_values('bopri', ascending=False)[['bowler_name', 'p_balls', 'p_wkts', 'p_econ', 'bopri']].head(5))
    print("All-rounder top 5:\n", ar[['player_name', 'p_balls_bat', 'p_balls_bowl', 'bpri', 'bopri', 'arpri']].head(5))

