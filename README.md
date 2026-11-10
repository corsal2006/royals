# 👑 ROYAL SCOUT AI
### IPL Player Intelligence & Auction Analytics Platform
*Official Decision-Support Intelligence for Rajasthan Royals Ahead of the IPL 2027 Auction*

![Royals Brand](https://img.shields.io/badge/Rajasthan_Royals-Official_Scouting_Intelligence-EA1A7F?style=for-the-badge&logo=shield)
![Platform Status](https://img.shields.io/badge/System-Production_Ready-06B6D4?style=for-the-badge)
![Deliveries](https://img.shields.io/badge/Deliveries_Analyzed-200%2C999-E2B714?style=for-the-badge)
![Matches](https://img.shields.io/badge/Matches_Processed-883-1D4ED8?style=for-the-badge)

---

## 📌 Executive Overview

In franchise T20 cricket, career aggregates and vanity statistics fail to distinguish players who elevate their game when the contest is on the line from those who falter under scrutiny.

**ROYAL SCOUT AI** is an advanced cricket intelligence and auction decision-support system built for the Rajasthan Royals management, coaches, and analytics staff. Analyzing **200,999 delivery-level records** across **883 matches** (IPL and T20Is from 2022 to 2026), the platform reconstructs the exact match context before every ball, measures how players perform in high-leverage situations relative to baseline conditions, applies **Bayesian sample-size shrinkage**, and delivers evidence-backed player intelligence for the **IPL 2027 auction**.

---

## 🎯 Core Product Capabilities

1. **Dual-Theme Design System (Light & Dark Modes):**
   - **Dark Mode:** Deep navy (`#070B19`), charcoal surfaces, white primary typography, soft royal blue accents, and restrained Rajasthan Royals pink/gold highlights.
   - **Light Mode:** Clean crisp off-white background (`#F8FAFC`), pure white cards (`#FFFFFF`), high-contrast dark navy typography (`#0F172A`), soft borders, and optimized sports editorial contrast.
   - Smooth transitions, header toggle, `localStorage` persistence, and automatic system preference detection.

2. **Verified Player Photograph Engine:**
   - Centralized `PlayerImage.jsx` component mapped to verified public action headshots from official IPL and cricket registries cached in `backend/data/player_images.json`.
   - Elegant fallback to custom-crafted SVG jersey avatars with player initials, role badges, and verified indicators. Zero broken images, zero face-guessing.

3. **10 Main Navigation Views:**
   - **Overview Dashboard:** Executive KPIs, top pressure performers, live delivery pressure simulator, and auction highlights.
   - **Players Directory:** Complete searchable database of 811 players with role filter tabs, sorting, view toggle (Modern Cards vs Detailed Table), and pagination.
   - **Batters Intelligence:** Filterable scatter plot (Normal SR vs Pressure SR), phase breakdowns, boundary avoidance, and BPRI leaderboards.
   - **Bowlers Intelligence:** Scatter plot (Normal Economy vs Pressure Economy), pace/spin splits, death-overs containment, and BoPRI rankings.
   - **All-Rounders Intelligence:** Dual-threat quadrant matrix (BPRI vs BoPRI) and harmonic mean (ARPRI) rankings.
   - **Fielders & Wicketkeepers:** Verified wicketkeeper leaderboard and tournament dismissal involvement analytics.
   - **Clutch Performers Spotlight:** Tactical deep-dives into Death Overs Specialists, Chase Closers, and Crisis Anchors.
   - **Head-to-Head Comparison:** 5-axis interactive radar chart, head-to-head metric differentials, and situational breakdown.
   - **Auction Intelligence Hub:** Interactive IPL 2027 purse simulator, budget allocation tracker, projected clutch lift, and target priority blueprints.
   - **Scientific Methodology:** Transparent mathematical formulations, sigmoid models, Bayesian shrinkage equations, and data dictionary.

4. **Interactive AI Scouting Assistant:**
   - Natural language cricket query console grounded strictly in delivery-level tournament analytics.
   - Suggested query chips, actionable answers, and clickable player dossier cards.

5. **Professional Print & PDF Dossier Export:**
   - Dedicated print stylesheets allowing scouts and decision-makers to export individual player dossiers and auction blueprints with clean pagination and background printing.

---

## 🏆 Top Pressure Performers

### 🏏 Top Batters Under Pressure (BPRI)

| Rank | Player Name | BPRI Score | Pressure Balls | Pressure Runs | Pressure SR | Normal SR | Clutch Δ SR | Pressure Avg | Confidence |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Naman Dhir** | **81.95** | 184 | 371 | 201.6 | 144.0 | **+57.7** | 37.1 | MEDIUM |
| **2** | **Suryakumar Yadav** | **77.89** | 227 | 460 | 202.6 | 157.9 | **+44.7** | 28.8 | HIGH |
| **3** | **David Miller** | **74.62** | 307 | 584 | 190.2 | 113.3 | **+76.9** | 27.8 | HIGH |
| **4** | **Rinku Singh** | **73.16** | 542 | 934 | 172.3 | 123.4 | **+48.9** | 34.6 | HIGH |
| **5** | **Shashank Singh** | **71.04** | 282 | 462 | 163.8 | 135.2 | **+28.6** | 57.8 | HIGH |
| **6** | **Tristan Stubbs** | **70.05** | 307 | 540 | 175.9 | 114.6 | **+61.3** | 28.2 | HIGH |
| **7** | **Marcus Stoinis** | **70.00** | 281 | 505 | 179.7 | 136.3 | **+43.4** | 26.6 | HIGH |
| **8** | **Matthew Wade** | **69.44** | 173 | 286 | 165.3 | 108.5 | **+56.8** | 40.9 | MEDIUM |
| **9** | **Tim David** | **68.30** | 513 | 901 | 175.6 | 163.6 | **+12.0** | 39.2 | HIGH |
| **10** | **Donovan Ferreira**| **66.59** | 168 | 301 | 179.2 | 143.1 | **+36.1** | 30.1 | MEDIUM |

---

### 🎯 Top Bowlers Under Pressure (BoPRI)

| Rank | Player Name | BoPRI Score | Pressure Balls | Pressure Wkts | Pressure Econ | Normal Econ | Clutch Δ Econ | Pressure Avg | Confidence |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Kuldeep Yadav** | **88.34** | 350 | 36 | 6.51 | 8.29 | **+1.78** | 10.55 | HIGH |
| **2** | **Abrar Ahmed** | **80.96** | 210 | 15 | 4.80 | 7.43 | **+2.63** | 11.20 | HIGH |
| **3** | **Sufiyan Muqeem** | **80.03** | 134 | 15 | 5.60 | 6.06 | **+0.46** | 8.33 | MEDIUM |
| **4** | **Varun Chakravarthy**| **78.94** | 414 | 32 | 6.77 | 8.32 | **+1.55** | 14.59 | HIGH |
| **5** | **Shadab Khan** | **77.20** | 113 | 10 | 5.79 | 8.42 | **+2.63** | 10.90 | MEDIUM |
| **6** | **Mohammad Nawaz** | **75.44** | 162 | 11 | 5.63 | 7.68 | **+2.05** | 13.82 | MEDIUM |
| **7** | **Matheesha Pathirana**| **73.40** | 400 | 44 | 8.29 | 8.59 | **+0.30** | 12.57 | HIGH |
| **8** | **Akeal Hosein** | **73.12** | 132 | 8 | 4.95 | 8.10 | **+3.15** | 13.63 | MEDIUM |
| **9** | **Maheesh Theekshana**| **72.81** | 311 | 24 | 6.95 | 7.69 | **+0.74** | 15.00 | HIGH |
| **10** | **Noor Ahmad** | **72.59** | 236 | 20 | 7.22 | 7.87 | **+0.65** | 14.20 | HIGH |

*(Pace Specialists of Note: Arshdeep Singh - 74 pressure wickets in 775 balls; Jasprit Bumrah - 7.37 pressure economy across 459 balls).*

---

## ⚙️ Mathematical Methodology & Science

### 1. Delivery-Level Pressure Index ($P_{\text{ball}} \in [0, 100]$)

#### Innings 2 (Chasing Target):
$$P_{\text{ball}} = \min\Big(100,\; \max\big(0,\; 0.42 \cdot C_{\text{rrr}} + 0.33 \cdot C_{\text{wkt}} + 0.25 \cdot C_{\text{stage}} + I_{\text{crisis}} + K_{\text{bonus}}\big)\Big)$$
- **Required Run Rate ($C_{\text{rrr}}$):** $100 / (1 + e^{-0.65 \cdot (\text{RRR} - 9.5)})$
- **Wicket Scarcity ($C_{\text{wkt}}$):** $(W_{\text{lost}} / 9)^{1.8} \times 100$
- **Stage Climax ($C_{\text{stage}}$):** Overs 16–20 urgency factor ($B_{\text{rem}} \le 30$)
- **Crisis Interaction ($I_{\text{crisis}}$):** Escalation bonus when RRR $> 10$ and wickets lost $\ge 4$
- **Knockout Match ($K_{\text{bonus}}$):** $+12.0$ points in playoff / knockout games

#### Innings 1 (Target Setting):
$$P_{\text{ball}} = \max(\text{Crisis\_Collapse},\; \text{Death\_Phase\_Base}) + K_{\text{bonus}}$$
- Powerplay crisis (3+ down in overs 1–6): $+55.0$
- Middle overs collapse (4+ down in overs 7–12): $+45.0$ to $+60.0$
- Death phase base: 40.0 (over 16) to 72.0 (over 20), $+15.0$ if tail exposed
- Super Overs (Innings 3 & 4): Fixed at $100.0$

### 2. Bayesian Sample-Size Shrinkage

To prevent rewarding small-sample outliers:
$$w_{\text{sample}} = \frac{N_{\text{pressure\_balls}}}{N_{\text{pressure\_balls}} + 60.0}$$
$$\text{PRI} = w_{\text{sample}} \cdot \text{Raw\_Score} + (1 - w_{\text{sample}}) \cdot 50.0$$

---

## 🌸 Rajasthan Royals IPL 2027 Auction Strategy

Rajasthan Royals possess an elite core: **Sanju Samson (C/WK)**, **Yashasvi Jaiswal**, **Riyan Parag**, **Dhruv Jurel**, and **Shimron Hetmyer**. 

Clutch analysis identifies the 4 essential acquisitions for IPL 2027:
1. **Death Overs Spearhead:** **Matheesha Pathirana** (8.29 death econ, dipping sling yorkers) or **Arshdeep Singh** (74 pressure wickets).
2. **Lead Mystery / Wrist Spinner:** **Kuldeep Yadav** (#1 BoPRI 88.34, 6.51 economy) or **Varun Chakravarthy** (6.77 economy).
3. **Ice-Cold Finisher at #6:** **Rinku Singh** (934 pressure runs @ 172.3 SR) or **David Miller** (+76.9 SR elevation).
4. **Crisis Recovery Anchor:** **Shashank Singh** (57.8 pressure average @ 163.8 SR).

---

## 💻 Tech Stack & Architecture

- **Frontend:** React 18, Vite 5, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- **Backend API:** Node.js, Express, CORS
- **Analytics Engine:** Python 3.10, Pandas, NumPy, Scikit-learn
- **Persistence:** SQLite Database (`royal_scout.db`), Precomputed High-Speed JSON
- **Asset Pipeline:** Verified Wikimedia Commons & official cricket registries with SVG fallback

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (3.9+) with `pandas`, `numpy`, `scikit-learn`

### 1. Run the Python Pipeline (Optional / Precomputed)
```bash
python pipeline/run_pipeline.py
```

### 2. Start the Backend API & Web Server
```bash
cd backend
npm install
node server.js
```
The full application will be live at `http://localhost:5000`.

### 3. Start Frontend Development Server (Live Hot-Reloading)
```bash
cd frontend
npm install
npm run dev
```
Available at `http://localhost:3000`.

---

## 📁 Repository Structure

```
c:\Users\megha\royals\
├── pipeline\                  # Python ETL and Pressure Analytics Engine
│   ├── etl_pipeline.py        # Reconstructs match situations and P_ball
│   ├── pressure_engine.py     # Batting, Bowling, All-Rounder, Fielding models
│   ├── enrich_metadata.py     # Public cricket metadata enrichment
│   ├── generate_artifacts.py  # Master database & JSON exporter
│   └── run_pipeline.py        # Master pipeline execution runner
├── backend\                   # Express API Server
│   ├── server.js              # REST endpoints & static server
│   └── data\                  # Precomputed JSON & SQLite Database (royal_scout.db)
├── frontend\                  # Vite + React User Interface
│   ├── src\
│   │   ├── components\        # Navbar, PlayerImage, ScoutingAssistant, SituationSimulator, PlayerModal
│   │   ├── pages\             # Overview, Players, Batters, Bowlers, AllRounders, Fielders, Clutch, Comparison, Auction, Methodology
│   │   └── services\api.js    # API Client
├── docs\                      # Architecture & Analytical Documentation
│   ├── DATA_DICTIONARY.md     # Full schema and metric dictionary
│   ├── METHODOLOGY_REPORT.md  # Scientific Pressure Reliability Index report
│   ├── RR_AUCTION_STRATEGY.md # Rajasthan Royals Tactical Auction Strategy
│   └── ROYAL_SCOUT_PRESSURE_RANKINGS.csv # Exportable Rankings CSV
├── requirements.txt           # Python dependencies
├── .env.example               # Environment variables
└── README.md                  # System Documentation
```

---

**Product:** ROYAL SCOUT AI  
**Brand Identity:** Royal Navy (`#070B19`) • Royals Pink (`#EA1A7F`) • Royal Gold (`#E2B714`) • Off-White Light (`#F8FAFC`)
