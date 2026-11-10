import json
import os
import urllib.request

with open('backend/data/player_images.json', 'r', encoding='utf-8') as f:
    images = json.load(f)

os.makedirs('frontend/public/players', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

success = 0
failed = 0

for pid, pdata in images.items():
    url = pdata.get('image_url')
    if not url:
        continue
    dest = f'frontend/public/players/{pid}.jpg'
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        pdata['local_image'] = f'/players/{pid}.jpg'
        success += 1
        continue
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            if len(data) > 500:
                with open(dest, 'wb') as out:
                    out.write(data)
                success += 1
                pdata['local_image'] = f'/players/{pid}.jpg'
                print(f"Downloaded {pid} ({pdata['player_name']}) -> {len(data)} bytes")
            else:
                failed += 1
    except Exception as e:
        print(f"Fail {pid} ({pdata['player_name']}): {e}")
        failed += 1

print(f"\nFinished downloading! Success: {success}, Failed: {failed}")

with open('backend/data/player_images.json', 'w', encoding='utf-8') as f:
    json.dump(images, f, indent=2)

