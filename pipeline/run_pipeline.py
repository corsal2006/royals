"""
ROYAL SCOUT AI — Master Pipeline Runner
---------------------------------------
Executes complete end-to-end analytics pipeline:
1. Loads raw CSV data from official data pack
2. Cleans deliveries and reconstructs match situations
3. Calculates delivery-level Pressure Index (P_ball)
4. Computes Batting, Bowling, All-Rounder, and Fielding reliability scores
5. Enriches profiles with verified public cricket intelligence
6. Exports high-speed JSON files and SQLite database
7. Generates official Unstop CSV submission file
"""

import sys
import os

from generate_artifacts import generate_all

if __name__ == "__main__":
    print("=" * 60)
    print("ROYAL SCOUT AI — REPRODUCIBLE ANALYTICS PIPELINE")
    print("SuperRR Selector Season 2 • Round 1 Official Build")
    print("=" * 60)
    generate_all()
    print("=" * 60)
    print("Pipeline finished successfully! All assets ready.")
    print("=" * 60)

