# 👑 ROYAL SCOUT AI

**Official Round 1 Submission for SuperRR Selector Season 2 — Help Shape Rajasthan Royals**  
*Identifying the Most Reliable Players Under Pressure for the IPL 2027 Auction*

![Royals Banner](https://img.shields.io/badge/SuperRR-Selector%202.0-EA1A7F?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Complete%20%26%20Defensible-06B6D4?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Deliveries-200%2C999-E2B714?style=for-the-badge)
![Matches](https://img.shields.io/badge/Matches-883-1D4ED8?style=for-the-badge)

---

## 📌 Executive Overview

In T20 cricket, career aggregates and vanity statistics fail to distinguish players who elevate their game when the contest is on the line from those who wither under scrutiny. 

**ROYAL SCOUT AI** is a decision-support and cricket intelligence platform that analyzes **200,999 delivery-level records** across **883 matches** (IPL & T20Is from 2022 to 2026). The platform reconstructs the exact match context before every ball, measures how players perform in high-leverage situations relative to baseline conditions, applies **Bayesian sample-size shrinkage**, and delivers defensible player rankings and auction recommendations for **Rajasthan Royals** at the IPL 2027 auction.

---

## 🏆 Official Unstop Submission: Round 1 Player Rankings

These rankings match the dropdown fields on the Unstop submission portal and are fully documented with delivery-level evidence in the application.

### 🏏 Top 10 Batters Under Pressure (Unstop Dropdowns)

| Unstop Rank | Player Name | BPRI Score | Pressure Balls | Pressure Runs | Pressure SR | Normal SR | Clutch Δ SR | Pressure Avg | Confidence |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rank 1** | **Naman Dhir** | **81.95** | 184 | 371 | 201.6 | 144.0 | **+57.7** | 37.1 | MEDIUM |
| **Rank 2** | **Suryakumar Yadav** | **77.89** | 227 | 460 | 202.6 | 157.9 | **+44.7** | 28.8 | HIGH |
| **Rank 3** | **David Miller** | **74.62** | 307 | 584 | 190.2 | 113.3 | **+76.9** | 27.8 | HIGH |
| **Rank 4** | **Rinku Singh** | **73.16** | 542 | 934 | 172.3 | 123.4 | **+48.9** | 34.6 | HIGH |
| **Rank 5** | **Shashank Singh** | **71.04** | 282 | 462 | 163.8 | 135.2 | **+28.6** | 57.8 | HIGH |
| **Rank 6** | **Tristan Stubbs** | **70.05** | 307 | 540 | 175.9 | 114.6 | **+61.3** | 28.2 | HIGH |
| **Rank 7** | **Marcus Stoinis** | **70.00** | 281 | 505 | 179.7 | 136.3 | **+43.4** | 26.6 | HIGH |
| **Rank 8** | **Matthew Wade** | **69.44** | 173 | 286 | 165.3 | 108.5 | **+56.8** | 40.9 | MEDIUM |
| **Rank 9** | **Tim David** | **68.30** | 513 | 901 | 175.6 | 163.6 | **+12.0** | 39.2 | HIGH |
| **Rank 10** | **Donovan Ferreira**| **66.59** | 168 | 301 | 179.2 | 143.1 | **+36.1** | 30.1 | MEDIUM |

---

### 🎯 Top 10 Bowlers Under Pressure (Unstop Dropdowns)

| Unstop Rank | Player Name | BoPRI Score | Pressure Balls | Pressure Wkts | Pressure Econ | Normal Econ | Clutch Δ Econ | Pressure Avg | Confidence |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rank 1** | **Kuldeep Yadav** | **88.34** | 350 | 36 | 6.51 | 8.29 | **+1.78** | 10.55 | HIGH |
| **Rank 2** | **Abrar Ahmed** | **80.96** | 210 | 15 | 4.80 | 7.43 | **+2.63** | 11.20 | HIGH |
| **Rank 3** | **Sufiyan Muqeem** | **80.03** | 134 | 15 | 5.60 | 6.06 | **+0.46** | 8.33 | MEDIUM |
| **Rank 4** | **Varun Chakravarthy**| **78.94** | 414 | 32 | 6.77 | 8.32 | **+1.55** | 14.59 | HIGH |
| **Rank 5** | **Shadab Khan** | **77.20** | 113 | 10 | 5.79 | 8.42 | **+2.63** | 10.90 | MEDIUM |
| **Rank 6** | **Mohammad Nawaz** | **75.44** | 162 | 11 | 5.63 | 7.68 | **+2.05** | 13.82 | MEDIUM |
| **Rank 7** | **Matheesha Pathirana**| **73.40** | 400 | 44 | 8.29 | 8.59 | **+0.30** | 12.57 | HIGH |
| **Rank 8** | **Akeal Hosein** | **73.12** | 132 | 8 | 4.95 | 8.10 | **+3.15** | 13.63 | MEDIUM |
| **Rank 9** | **Maheesh Theekshana**| **72.81** | 311 | 24 | 6.95 | 7.69 | **+0.74** | 15.00 | HIGH |
| **Rank 10** | **Noor Ahmad** | **72.59** | 236 | 20 | 7.22 | 7.87 | **+0.65** | 14.20 | HIGH |

*(Notable Pace Specialists: Arshdeep Singh - 74 pressure wickets in 775 balls; Jasprit Bumrah - 7.37 pressure economy across 459 balls).*

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
1. **Death Overs Spearmhead:** **Matheesha Pathirana** (8.29 death econ, dipping sling yorkers) or **Arshdeep Singh** (74 pressure wickets).
2. **Lead Mystery / Wrist Spinner:** **Kuldeep Yadav** (#1 BoPRI 88.34, 6.51 economy) or **Varun Chakravarthy** (6.77 economy).
3. **Ice-Cold Finisher at #6:** **Rinku Singh** (934 pressure runs @ 172.3 SR) or **David Miller** (+76.9 SR elevation).
4. **Crisis Recovery Anchor:** **Shashank Singh** (57.8 pressure average @ 163.8 SR).

---

## 💻 Tech Stack & Architecture

- **Frontend:** React 18, Vite 5, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- **Backend API:** Node.js, Express, CORS
- **Analytics Engine:** Python 3.10, Pandas, NumPy, Scikit-learn
- **Persistence:** SQLite Database (`royal_scout.db`), Precomputed High-Speed JSON

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

### 3. Start Frontend Development Server (Optional for Live Editing)
```bash
cd frontend
npm install
npm run dev
```

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
│   │   ├── components\        # Navbar, SituationSimulator, PlayerModal
│   │   ├── pages\             # Overview, Rankings, Batters, Bowlers, Comparison, Auction, etc.
│   │   └── services\api.js    # API Client
├── docs\                      # Official Submission Documentation
│   ├── DATA_DICTIONARY.md     # Full schema and data dictionary
│   ├── METHODOLOGY_REPORT.md  # Official Round 1 Methodology Report
│   ├── RR_AUCTION_STRATEGY.md # Rajasthan Royals Tactical Auction Strategy
│   └── UNSTOP_SUBMISSION_RANKINGS.csv # Unstop Dropdown Ready CSV
├── requirements.txt           # Python dependencies
├── .env.example               # Environment variables
└── README.md                  # System Documentation
```

---

**Developed for:** SuperRR Selector Season 2 • Round 1 Hackathon Submission  
**Theme:** Royal Navy (`#070B19`) • Royals Pink (`#EA1A7F`) • Royal Gold (`#E2B714`)

