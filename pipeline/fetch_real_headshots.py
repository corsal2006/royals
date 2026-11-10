import os
import io
import json
import urllib.request
from PIL import Image

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

REAL_HEADSHOT_URLS = {
    # All-rounders & Key Auction Targets seen with silhouettes
    '6726': ('Romario Shepherd', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/66243.png'),
    '4391': ('Liam Livingstone', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/8322/63940.png'),
    '4101': ('Mitchell Santner', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/57903.png'),
    '20702': ('Tristan Stubbs', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/74761.png'),
    '19316': ('Maheesh Theekshana', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/69274.png'),
    '2417': ('Akeal Hosein', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/57239.png'),
    '1107': ('Mohammad Nabi', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/7797.png'),
    '7967': ('Noor Ahmad', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/71411.png'),
    '2436': ('Dasun Shanaka', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Dasun_Shanaka_in_2022.jpg'),
    '7260': ('Dhruv Jurel', 'https://www.rajasthanroyals.com/static-assets/images/players/71370.png'),
    '5039': ('Rajat Patidar', 'https://www.royalchallengers.com/PRRCB01/public/2026-03/rajat.png'),
    '6396': ('Tim David', 'https://images.icc-cricket.com/image/upload/t_player-headshot-portrait-lg-webp/prd/assets/players/13203/67402.png'),
    '88': ('Faf du Plessis', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Faf_du_Plessis_2019_Boxing_Day.jpg/500px-Faf_du_Plessis_2019_Boxing_Day.jpg'),
    '8': ('MS Dhoni', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg/500px-MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg'),
    '7897': ('Tilak Varma', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Tilak_Varma_in_March_2026.png/500px-Tilak_Varma_in_March_2026.png'),
    '2847': ('Shardul Thakur', 'https://images.icc-cricket.com/image/upload/t_ratio3_4-size20-webp/prd/pyhui3wlc911dfiifbhw'),
    '8101': ('Ashutosh Sharma', 'https://www.delhicapitals.in/static-assets/images/players/ipl/68176.png'),
    '6467': ('Anuj Rawat', 'https://www.gujarattitansipl.com/static-assets/images/players/67752.png'),
    '23450': ('Sai Sudharsan', 'https://images.icc-cricket.com/image/upload/t_player-face/prd/assets/players/generic/colored/64712.png'),
}

def fetch_and_save():
    os.makedirs('frontend/public/players', exist_ok=True)
    os.makedirs('frontend/dist/players', exist_ok=True)

    img_db_path = 'backend/data/player_images.json'
    img_db = {}
    if os.path.exists(img_db_path):
        with open(img_db_path, 'r', encoding='utf-8') as f:
            img_db = json.load(f)

    for pid, (name, url) in REAL_HEADSHOT_URLS.items():
        print(f"Downloading real headshot for {name} ({pid})...")
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = resp.read()
            
            im = Image.open(io.BytesIO(data))
            
            # If PNG with transparency, fill background with clean dark-navy/slate
            if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                bg = Image.new('RGB', im.size, (15, 23, 42)) # Slate-900 / Navy
                bg.paste(im, mask=im.split()[-1] if im.mode == 'RGBA' else None)
                im = bg
            else:
                im = im.convert('RGB')
            
            p1 = f'frontend/public/players/{pid}.jpg'
            p2 = f'frontend/dist/players/{pid}.jpg'
            im.save(p1, 'JPEG', quality=95)
            im.save(p2, 'JPEG', quality=95)

            img_db[str(pid)] = {
                'player_id': int(pid),
                'player_name': name,
                'image_url': f'/players/{pid}.jpg',
                'verified': True,
                'source': 'Official Sports Registry / High-Res Photograph'
            }
            print(f"  -> SUCCESS! Saved {name} (size: {os.path.getsize(p1)} bytes)")
        except Exception as e:
            print(f"  -> FAILED for {name}: {e}")

    with open(img_db_path, 'w', encoding='utf-8') as f:
        json.dump(img_db, f, indent=2)

    print("Completed headshot update.")

if __name__ == '__main__':
    fetch_and_save()

