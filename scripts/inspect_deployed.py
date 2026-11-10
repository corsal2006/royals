import urllib.request
import re

url = 'https://royals-taupe.vercel.app/'
html = urllib.request.urlopen(url).read().decode('utf-8')
print('HTML snippet:', html[:300])

scripts = re.findall(r'src="([^"]+\.js)"', html)
print('Found scripts:', scripts)

for s in scripts:
    js_url = url + s.lstrip('/')
    print('Fetching script:', js_url)
    try:
        js_code = urllib.request.urlopen(js_url).read().decode('utf-8', errors='ignore')
        # Check what fetch calls are made
        fetches = re.findall(r'fetch\(([^)]+)\)', js_code)
        print(f'Sample fetches in {s}:', fetches[:10])
        # Check for localhost or vercel or /api
        print('Contains localhost:', 'localhost' in js_code)
        print('Contains royals-18de:', 'royals-18de' in js_code)
        print('Contains /api/:', '/api/' in js_code)
    except Exception as e:
        print('Error fetching script:', e)
