const https = require('https');

function testEndpoint(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ms = Date.now() - start;
        let json = null;
        try { json = JSON.parse(data); } catch(e) {}
        resolve({
          url,
          status: res.statusCode,
          ms,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          sample: json ? (Array.isArray(json) ? 'Array(' + json.length + ')' : Object.keys(json).join(', ')) : data.slice(0, 80)
        });
      });
    });
    req.on('error', err => resolve({ url, status: 'ERR', error: err.message }));
    req.setTimeout(12000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
  });
}

async function verifyAll() {
  const tests = [
    // Health & Core
    'https://royals-18de.vercel.app/',
    'https://royals-18de.vercel.app/api/health',
    'https://royals-18de.vercel.app/api/overview',
    'https://royals-18de.vercel.app/api/dashboard',
    
    // Players & Categories
    'https://royals-18de.vercel.app/api/players?limit=5',
    'https://royals-18de.vercel.app/api/player/1699',
    'https://royals-18de.vercel.app/api/player/jasprit-bumrah',
    'https://royals-18de.vercel.app/api/player-details/jasprit-bumrah',
    'https://royals-18de.vercel.app/api/rankings/top10',
    'https://royals-18de.vercel.app/api/categories/batters',
    'https://royals-18de.vercel.app/api/categories/bowlers',
    'https://royals-18de.vercel.app/api/categories/all-rounders',
    'https://royals-18de.vercel.app/api/categories/fielders',
    
    // Clutch & Comparison
    'https://royals-18de.vercel.app/api/rankings/clutch',
    'https://royals-18de.vercel.app/api/clutch',
    'https://royals-18de.vercel.app/api/compare?ids=1699,813',
    'https://royals-18de.vercel.app/api/compare?p1=jasprit-bumrah&p2=pat-cummins',
    
    // Auction & Method
    'https://royals-18de.vercel.app/api/auction',
    'https://royals-18de.vercel.app/api/auction-intelligence',
    'https://royals-18de.vercel.app/api/methodology',
    
    // Frontend deployed URL & Rewrite Proxy
    'https://royals-taupe.vercel.app/',
    'https://royals-taupe.vercel.app/api/health',
    'https://royals-taupe.vercel.app/api/players?limit=3',
    'https://royals-taupe.vercel.app/api/rankings/top10'
  ];

  console.log('--- PRODUCTION VERIFICATION SUITE ---');
  let passCount = 0;
  for (const t of tests) {
    const res = await testEndpoint(t);
    const pass = res.ok;
    if (pass) passCount++;
    console.log(`[${res.status}] ${pass ? 'PASS' : 'FAIL'} (${res.ms}ms) ${t} -> ${res.sample}`);
  }
  console.log(`\nTOTAL PASSED: ${passCount} / ${tests.length}`);
}

verifyAll();
