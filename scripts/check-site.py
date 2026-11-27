from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import re,subprocess,json
root=Path(__file__).resolve().parent.parent
core=['index.html','peniches.html','photos.html','privatisation.html','devis-peniche.html','privatisation-peniche-florentine-boulogne.html','privatisation-peniche-mistinguett-paris-bercy.html','privatisation-peniche-alize-paris-bercy.html']
class Inspect(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.sources=[];self.h1=0;self.json=False;self.scripts=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if a.get('id'):self.ids.append(a['id'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag in ('script','img') and a.get('src'):self.sources.append(a['src'])
  if tag=='link' and a.get('rel')=='stylesheet':self.sources.append(a['href'])
  if tag=='script' and a.get('type')=='application/ld+json':self.json=True
 def handle_data(self,s):
  if self.json:self.scripts.append(s)
 def handle_endtag(self,t):
  if t=='script':self.json=False
for file in core:
 s=(root/file).read_text();p=Inspect();p.feed(s)
 assert p.h1==1,(file,'H1',p.h1)
 assert len(set(p.ids))==len(p.ids),(file,'identifiants dupliqués')
 for script in p.scripts:json.loads(script)
 for url in p.links+p.sources:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  if u.path:
   target=root/unquote(u.path.lstrip('/')) if u.path.startswith('/') else root/Path(file).parent/unquote(u.path)
   if u.path=='/':target=root/'index.html'
   assert target.exists(),(file,'ressource introuvable',url)
  elif u.fragment:assert u.fragment in p.ids,(file,'ancre introuvable',url)
 assert '/logo-florentine.png?v=transparent-20261127' in s
 assert 'class="f-menu"' in s
print('8 pages : liens, ressources, ancres, titres uniques, logo et données structurées valides.')
changed=subprocess.check_output(['git','diff','--name-only'],cwd=root,text=True).splitlines()
kept=0
for name in changed:
 if not name.endswith('.html') or name in core:continue
 before=subprocess.check_output(['git','show','HEAD:'+name],cwd=root,text=True)
 after=(root/name).read_text()
 extract=lambda t:re.search(r'<main\b[^>]*>(.*?)</main>',t,re.S).group(1)
 assert extract(before)==extract(after),(name,'contenu publié modifié')
 kept+=1
assert 'validation-seo.html' not in changed
print(f'{kept} pages secondaires : contenu principal et dates conservés ; validation SEO inchangée.')
