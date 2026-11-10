import urllib.request
import re

url = 'https://www.espncricinfo.com/cricketers/rinku-singh-1004593'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        imgs = re.findall(r'https://img1\.hscicdn\.com/image/upload/[^\s\"\'\<\>]+', html)
        print(f"Found {len(imgs)} images:")
        for img in set(imgs):
            if any(k in img for k in ['player', 'headshot', 'photo', '1004593', 'rinku']):
                print("Match:", img)
            elif 'rect' in img or 'portrait' in img:
                print("Candidate:", img)
except Exception as e:
    print("Error:", e)
