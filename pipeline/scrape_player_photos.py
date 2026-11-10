import urllib.request
import re

def parse_scripts():
    url = "https://www.iplt20.com/teams/rajasthan-royals"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req, timeout=6).read().decode('utf-8', errors='ignore')
    # search for player name like Samson or Jaiswal
    for name in ['Samson', 'Jaiswal', 'Parag', 'Jurel', 'Hetmyer']:
        matches = [m.start() for m in re.finditer(name, html, re.I)]
        print(f"Name '{name}' found at indices: {matches[:3]}")
        if matches:
            idx = matches[0]
            snippet = html[max(0, idx-100):min(len(html), idx+300)]
            print(f"Snippet for {name}:\n{snippet}\n---")

if __name__ == '__main__':
    parse_scripts()
