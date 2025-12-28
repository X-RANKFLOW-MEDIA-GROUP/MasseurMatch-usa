from pathlib import Path
path = Path('masseurmatch-nextjs/app/dashboard/layout.tsx')
text = path.read_text()
replacements = {
    'dY"? My Ads': 'My Ads',
    "dY'3 Billing": 'Billing',
    'ƒsT‹,? Settings': 'Settings',
    'ƒ-? Favorites': 'Favorites',
    "dY'ª Support": 'Support',
}
for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Missing snippet: {old}')
    text = text.replace(old, new)
path.write_text(text)
