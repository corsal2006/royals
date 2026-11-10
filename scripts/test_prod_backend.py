import urllib.request
import json

base = 'https://royals-18de.vercel.app'

endpoints = [
    '/api/health',
    '/api/overview',
    '/api/rankings/top10',
    '/api/rankings/batters?min_balls=60',
    '/api/rankings/bowlers?min_balls=60',
    '/api/rankings/all-rounders',
    '/api/rankings/fielders',
    '/api/player/1699',
    '/api/player/3644',
    '/api/compare?ids=1699,813',
    '/api/auction',
    '/api/methodology',
    '/api/images',
    '/api/rankings/clutch',
    '/api/assistant/query?q=who+is+best+death+bowler',
    '/api/export/csv'
]

print(f"=== TESTING PRODUCTION BACKEND: {base} ===")
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Origin': 'https://royals-taupe.vercel.app'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content_type = resp.headers.get('Content-Type', '')
            data = resp.read()
            size = len(data)
            sample = data[:100].decode('utf-8', errors='ignore').replace('\n', ' ')
            print(f"✓ [{resp.status}] {ep} ({content_type}, {size} bytes) -> {sample}")
    except Exception as e:
        print(f"✗ FAILED {ep}: {e}")
