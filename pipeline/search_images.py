import urllib.request
import urllib.parse
import json

def search_wikimedia(query):
    headers = {'User-Agent': 'RoyalScoutResearchBot/2.0 (contact@royalscout.cricket)'}
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url')
                mime = info.get('mime')
                if url and ('image/jpeg' in mime or 'image/png' in mime):
                    results.append({'title': title, 'url': url})
            return results
    except Exception as e:
        print("Wikimedia error:", e)
        return []

if __name__ == '__main__':
    for q in ['Rinku Singh cricketer', 'Jos Buttler cricketer', 'Matheesha Pathirana', 'Varun Chakravarthy']:
        res = search_wikimedia(q)
        print(f"=== {q} ===")
        for r in res[:3]:
            print(r['title'], "->", r['url'])
