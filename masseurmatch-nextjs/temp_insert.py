from pathlib import Path
path = Path("app/blog/page.tsx")
text = path.read_text()
target = 'import { getAllPosts } from "./data/posts";'
insert = target + '\n\nexport const dynamic = "force-dynamic";\n'
if target not in text:
    raise SystemExit('target not found')
text = text.replace(target, insert, 1)
path.write_text(text)
