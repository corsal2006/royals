# ROYAL SCOUT AI — DATA DICTIONARY & SCHEMA DOCUMENTATION

**SuperRR Selector 2.0 • Round 1: Identify the Most Reliable Players Under Pressure**  
**Dataset Coverage:** Indian Premier League (IPL 2022–2026) and T20 Internationals (T20I 2022–2026)  
**Total Records:** 200,999 Deliveries • 883 Matches • 353 Teams • 141 Competitions • 28,381 Playing XI entries  

---

## 1. Raw Datasets Overview

The proprietary data pack supplied by the organizers comprises six interrelated relational tables:

```
+------------------------------------+---------------------------------------------------------------+
| Table Name                         | Core Purpose                                                  |
+------------------------------------+---------------------------------------------------------------+
| ball_by_ball.csv                   | Delivery-level ball-by-ball event log (runs, extras, wickets) |
| matches.csv                        | Match fixtures, dates, stages, venues, results, and targets   |
| competitions.csv                   | Tournament metadata, season, and format (IPL / T20I)          |
| teams.csv                          | Team identity and tournament participation mapping            |
| playing_eleven.csv                 | Official match-day playing XIs, captains, and wicketkeepers   |
| competition_team_player_mapping.csv| Player-to-franchise/national team tournament roster mapping   |
+------------------------------------+---------------------------------------------------------------+
```

---

## 2. Table-by-Table Schema Specification

### 2.1 `ball_by_ball.csv` (200,999 rows, 33 columns)

| Column Name | Data Type | Description & Null Handling |
| :--- | :--- | :--- |
| `match_id` | Integer | Unique match identifier foreign key referencing `matches.csv`. |
| `innings` | Integer | Innings index: `1` (setting target), `2` (chasing), `3`/`4` (super overs). |
| `overid` | Integer | Over number (1 to 20). 1-indexed. |
| `over_ball_num` | Integer | Ball delivery sequence number within the over (1 to 8+ for extras). |
| `innings_ball_num` | Integer | Sequential delivery count across the entire innings. |
| `batting_team_id` | Integer | Identifier for the team batting. |
| `bowling_team_id` | Integer | Identifier for the team bowling. |
| `striker_id` | Integer | Unique player identifier of the batter facing delivery. |
| `striker_name` | String | Verified name of the facing batter. |
| `non_striker_id` | Integer | Unique player identifier of the runner at the non-striker's end. |
| `non_striker_name` | String | Verified name of non-striker. |
| `bowler_id` | Integer | Unique player identifier of the bowler delivering the ball. |
| `bowler_name` | String | Verified name of bowler. |
| `batting_type` | String | Batter stance: `RHB` (Right-Hand Bat) or `LHB` (Left-Hand Bat). |
| `bowling_type` | String | Bowling style classification (e.g., `Right-arm Fast`, `Slow left-arm orthodox`, `Right-arm Leg-Break`). |
| `batting_order` | Integer | Position of the striker in the batting lineup (1 to 11). |
| `runs` | Integer | Runs scored directly off the bat by the striker (0, 1, 2, 3, 4, 6). |
| `is_four` | Boolean | True if a boundary four was struck off the bat. |
| `is_six` | Boolean | True if a six was struck off the bat. |
| `is_wicket` | Boolean | True if a dismissal occurred on this delivery. |
| `dismissal_type_id` | Float | Internal categorical ID for the dismissal mode. |
| `dismissal_type` | String | Categorical dismissal mode (`Caught`, `Bowled`, `LBW`, `RunOut`, `Stump`, `Hit Wicket`, `Retire Out`). |
| `dismissed_player_id`| Float | Player ID of the dismissed batter. |
| `extras_type` | String | Penalty/extra categorization: `wide`, `Overstep` (no-ball), `legbyes`, `byes`, `other`, `Penalty`, or `NaN`. |
| `extras1_runs` | Integer | Internal identifier mapping to extras type (1=Overstep, 2=wide, 3=legbyes, 4=byes, 5=other, 6=none). |
| `extras_2_runs` | Integer | Overthrow / penalty run values (non-zero in 36 edge cases). |
| `pace_or_spin` | String | Primary bowling discipline: `Pace` (123,886 balls) or `Spin` (77,113 balls). |
| `bowl_speed` | Float | Recorded delivery velocity in km/h (telemetry available for speed-tracked matches). |
| `stroke` | String | Categorical stroke type (e.g., `Pull shot`, `Cover Drive`, `Worked`, `Flick`, `Square Cut`, `Slog`). |
| `delivery_style` | String | Specific ball variation (e.g., `Yorker`, `Bouncer`, `Googly`, `Off Cutter`, `Inswing`, `Full Toss`). |
| `over_or_around` | String | Angle of delivery relative to the stumps: `Over` the wicket or `Around` the wicket. |
| `on_or_off` | String | Pitch line / strike direction: `Off-side` or `On-side`. |
| `delivery_ist_time` | Timestamp | Timestamp of delivery recording in IST / UTC. |

---

### 2.2 `matches.csv` (883 rows, 22 columns)

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `match_id` | Integer | Primary key identifying the match. |
| `comp_id` | Integer | Foreign key referencing `competitions.csv`. |
| `match_number` | Integer | Match fixture index within the tournament. |
| `match_date` | Date | Date of fixture execution (YYYY-MM-DD). |
| `stage` | String | Stage of competition: `League`, `Qualifier`, `Final`, `Super 4`, `Others`. |
| `venue_id` | Integer | Venue stadium identifier. |
| `venue_country` | String | Host country (e.g., `India`, `Australia`, `West Indies`). |
| `home_team_id` / `away_team_id` | Integer | Participating franchise / national team identifiers. |
| `home_team` / `away_team` | String | Team names (e.g., `Rajasthan Royals`, `Chennai Super Kings`). |
| `toss_win_team_id` | Integer | Identifier of the team that won the coin toss. |
| `toss_opted` | String | Decision elected after winning toss: `bat` or `field`. |
| `man_of_the_match` | Integer | Player ID awarded Player of the Match accolade. |
| `first_inn_revised_overs` | Float | Revised overs allocated to Innings 1 under DLS rain interruptions. |
| `second_inn_revised_overs`| Float | Revised overs allocated to Innings 2 under DLS rain interruptions. |
| `revised_target` | Float | Official DLS target runs required for victory in Innings 2. |
| `knock_out` | Integer | Binary flag: `1` if playoff / knockout fixture, `0` if league stage. |
| `win_team_id` | Integer | Identifier of the victorious team. |
| `result` | String | Textual result statement (e.g., `Rajasthan Royals Won by 61 Runs`). |

---

### 2.3 `competitions.csv` (141 rows, 4 columns)

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `comp_id` | Integer | Primary key for tournament. |
| `comp_name` | String | Tournament name (e.g., `IPL 2026`, `IPL 2025`, `ICC Men's T20 World Cup`). |
| `match_format` | String | Format classification: `T20` (Franchise leagues) or `T20I` (Internationals). |
| `season` | String | Operational season year (2022 to 2026). |

---

### 2.4 `playing_eleven.csv` (28,381 rows, 9 columns)

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `match_id` | Integer | Match identifier. |
| `team_id` | Integer | Team identifier. |
| `player_id` | Integer | Player identifier. |
| `batting_order` | Integer | Designated slot in the match batting order (1 to 11). |
| `is_played` | Boolean | True if the player actively participated in the playing XI. |
| `is_captain` | Boolean | True if player served as the designated match captain. |
| `is_wk` | Boolean | True if player was the verified designated wicketkeeper. |
| `is_impact` | Integer | Flag for Impact Player substitution introduced in IPL 2023+. |
| `is_impact_off` | Integer | Flag for substituted-out player under Impact Player rules. |

---

## 3. Derived Analytical Variables in Pipeline

The ETL pipeline reconstructs the instantaneous match state immediately before each delivery:

| Derived Variable | Calculation & Cricket Logic |
| :--- | :--- |
| `is_illegal` | `extras_type in ['wide', 'Overstep', 'other']`. Requires re-bowling; legal ball counter not incremented. |
| `is_legal` | `~is_illegal`. Legal deliveries contributing to the 120 balls of an innings. |
| `bowler_runs_conceded`| `runs + extras_wide + extras_noball + extras_2_runs`. Byes and leg-byes are strictly excluded per ICC rules. |
| `team_ball_runs` | Total runs added to the team score on this delivery (off-bat + all extras). |
| `is_bowler_wkt` | `is_wicket and dismissal_type in ['Caught', 'Bowled', 'LBW', 'Stump', 'Hit Wicket']`. Run-outs excluded. |
| `cum_runs` | Cumulative team score prior to this delivery being bowled. |
| `cum_wkts` | Cumulative team wickets lost prior to this delivery being bowled. |
| `cum_legal_balls` | Cumulative legal balls bowled in the innings so far. |
| `balls_remaining` | `max(1, 120 - cum_legal_balls)`. |
| `target` | DLS `revised_target` if rain-affected, else `Innings 1 Total + 1`. |
| `runs_required` | `max(1, target - cum_runs)` (Innings 2). |
| `rrr` | `(runs_required / balls_remaining) * 6.0` (Innings 2 Required Run Rate). |
| `pressure_index` ($P_{\text{ball}}$) | Continuous delivery leverage metric $[0, 100]$ synthesized from RRR, wickets in hand, death stage, collapse state, and knockout bonus. |
| `is_high_pressure` | True if $P_{\text{ball}} \ge 60.0$ (top 19.55% of all tournament deliveries). |
| `is_normal_pressure` | True if $P_{\text{ball}} < 40.0$ (baseline match flow, 62.52% of all deliveries). |

---

## 4. Integrity and Compliance Checklist

1. **No Data Fabrication:** Every statistic originates from observed delivery events in the provided files.
2. **Missing Field Handling:** Fielder tracking for outfield catches is marked as limited rather than guessed.
3. **Reproducibility:** Re-running `pipeline/run_pipeline.py` reproduces all outputs and database tables deterministically.

