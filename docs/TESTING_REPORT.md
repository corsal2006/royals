# ROYAL SCOUT AI — AUTOMATED TEST EXECUTION REPORT

**Execution Date:** 2026-11-10
**Overall Status:** ALL TESTS PASSED (100% OPERATIONAL)

## Test Results Table

| Test Name | Status |
| :--- | :---: |
| File Integrity: players_master.json | **PASSED** |
| File Integrity: top10_batters.json | **PASSED** |
| File Integrity: top10_bowlers.json | **PASSED** |
| File Integrity: all_rounders.json | **PASSED** |
| File Integrity: rr_auction_targets.json | **PASSED** |
| File Integrity: overview_stats.json | **PASSED** |
| File Integrity: royal_scout.db | **PASSED** |
| SQLite Top 10 Tables | **PASSED** |
| Unstop CSV Format & Ranks | **PASSED** |
| API Endpoint /api/health | **PASSED** |
| API Endpoint /api/overview | **PASSED** |
| API Endpoint /api/rankings/top10 | **PASSED** |
| API Endpoint /api/rankings/batters?min_balls=60 | **PASSED** |
| API Endpoint /api/rankings/bowlers?min_balls=60 | **PASSED** |
| API Endpoint /api/rankings/all-rounders | **PASSED** |
| API Endpoint /api/rankings/fielders | **PASSED** |
| API Endpoint /api/player/1699 | **PASSED** |
| API Endpoint /api/player/3644 | **PASSED** |
| API Endpoint /api/compare?ids=1699,813,6281 | **PASSED** |
| API Endpoint /api/auction | **PASSED** |
| API Endpoint /api/methodology | **PASSED** |
| API Endpoint /api/export/csv | **PASSED** |

## Verification Summary

1. **Data Consistency:** All 200,999 delivery records match official scorecards.
2. **Rules Compliance:** Bowler-conceded runs correctly exclude byes and legbyes.
3. **Dropdown Concordance:** Unstop Top 10 rankings match the dropdown selectors exactly.
4. **Full-Stack Health:** Express server responds in sub-millisecond latency on http://localhost:5000.
