"""Apply the shared public navigation without changing article or legal content."""
from pathlib import Path
import re,runpy
root=Path(__file__).resolve().parent.parent
shared=runpy.run_path(str(root/'scripts/render-site.py'))
changed=[]
for p in [*root.glob('*.html'),*(root/'blog').glob('*.html')]:
 s=p.read_text()
 if p.name=='validation-seo.html':continue
 if 'class="f-header"' in s:continue
 pattern=r'<header\b[^>]*class="(?:document-header|legal-header)"[^>]*>.*?</header>'
 if not re.search(pattern,s,re.S):continue
 main=re.search(r'<main\b([^>]*)>',s)
 if not main:continue
 ident=re.search(r'\bid="([^"]+)"',main.group(1))
 target=ident.group(1) if ident else 'main'
 if not ident:s=s[:main.start()]+main.group(0).replace('<main','<main id="main"',1)+s[main.end():]
 current='/blog.html' if p.parent.name=='blog' else '/'+p.name
 new=shared['header'](current).replace('href="#main"','href="#'+target+'"')
 s=re.sub(pattern,lambda _:new,s,count=1,flags=re.S)
 # Already published text, dates and structured data are deliberately preserved.
 s=s.replace('</head>',f'<link rel="stylesheet" href="/florentine.css?v={shared["VERSION"]}"><script defer src="/florentine.js?v={shared["VERSION"]}"></script></head>')
 def body(m):
  tag=m.group(0)
  if 'class=' in tag:return re.sub(r'class="([^"]*)"',lambda c:'class="'+c.group(1)+' f-legacy"',tag)
  return tag.replace('<body','<body class="f-legacy"',1)
 s=re.sub(r'<body\b[^>]*>',body,s,count=1)
 # Article and legal footers keep their existing information; use the same colors.
 s=s.replace('name="theme-color" content="#65040d"','name="theme-color" content="#0b141d"')
 p.write_text(s);changed.append(str(p.relative_to(root)))
print(f'Navigation et identité visuelle harmonisées sur {len(changed)} pages de journal, conseils et informations. Contenu conservé.')
