(()=>{'use strict';
const WA='33663659679';
const fmt=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const parisToday=()=>{const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const by=Object.fromEntries(parts.map(p=>[p.type,p.value]));return by.year+'-'+by.month+'-'+by.day};
const today=parisToday();
const iso=(y,m,d)=>y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
const price=(str,slot)=>{const d=new Date(str+'T12:00:00Z').getUTCDay();const peak=d>=4&&d<=6;return slot==='journee'?(peak?2000:1800):(peak?2800:2500)};
const details={florentine:{name:'Florentine sur Seine',address:'Boulogne-Billancourt'},mistinguett:{name:'Mistinguett',address:'Paris 12e'},alize:{name:'Alizé',address:'Paris 12e'}};
document.querySelectorAll('[data-gallery]').forEach(g=>{
  let imgs=[];try{imgs=JSON.parse(g.dataset.gallery||'[]')}catch(e){}
  if(!imgs.length)return;
  const frame=g.querySelector('.gallery-frame'),count=g.querySelector('.gallery-count');let index=0;
  const render=()=>{frame.src=imgs[index].src;frame.alt=imgs[index].alt||'Photo de péniche';count.textContent=(index+1)+' / '+imgs.length};
  const show=n=>{index=(n+imgs.length)%imgs.length;render()};
  g.querySelector('[data-prev]')?.addEventListener('click',()=>show(index-1));
  g.querySelector('[data-next]')?.addEventListener('click',()=>show(index+1));
  frame.addEventListener('click',()=>{const dialog=document.getElementById('collection-lightbox');const big=dialog?.querySelector('img');if(!dialog||!big)return;big.src=imgs[index].src;big.alt=imgs[index].alt||'';dialog.showModal()});
  let start=null;g.addEventListener('touchstart',e=>{start=e.changedTouches[0]?.clientX},{passive:true});
  g.addEventListener('touchend',e=>{if(start===null)return;const dx=e.changedTouches[0].clientX-start;if(Math.abs(dx)>40)show(index+(dx<0?1:-1));start=null},{passive:true});
  render();
});
document.getElementById('collection-close')?.addEventListener('click',()=>document.getElementById('collection-lightbox')?.close());
document.querySelectorAll('[data-booking]').forEach(card=>{
 const boat=card.dataset.booking,info=details[boat];if(!info)return;
 let slot='soiree',selected='',month=new Date(today+'T12:00:00Z');month.setUTCDate(1);
 const bar=card.querySelector('.collection-calendar-bar strong'),days=card.querySelector('.collection-month'),status=card.querySelector('.collection-total'),link=card.querySelector('.collection-booking-link');
 const getPrice=()=>boat==='florentine'?price(selected,slot):null;
 const update=()=>{
   const p=selected?getPrice():null;
   status.textContent=selected?(boat==='florentine'?fmt.format(p):'Sur devis'):'Sélectionnez une date';
   const m='Bonjour, je souhaite '+(boat==='florentine'?'privatiser ':'un devis pour la péniche ')+info.name+'.\nDate : '+(selected||'à préciser')+'\nFormule : '+(slot==='soiree'?'Soirée':'Journée')+(boat==='florentine'&&slot==='soiree'?' (20h à 02h, installation dès 18h)':'')+(p?'\nTarif affiché : '+fmt.format(p):'')+'\nPouvez-vous me confirmer la disponibilité et les conditions ?';
   link.href='https://wa.me/'+WA+'?text='+encodeURIComponent(m);
 };
 const render=()=>{
  bar.textContent=month.toLocaleDateString('fr-FR',{month:'long',year:'numeric',timeZone:'UTC'});
  days.replaceChildren();
  let first=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth(),1)),offset=(first.getUTCDay()+6)%7;
  for(let i=0;i<offset;i++)days.append(document.createElement('span'));
  const len=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth()+1,0)).getUTCDate();
  for(let d=1;d<=len;d++){
   const str=iso(month.getUTCFullYear(),month.getUTCMonth(),d);
   const b=document.createElement('button');b.type='button';b.className='collection-day';b.disabled=str<today;b.setAttribute('aria-pressed',String(str===selected));
   const n=document.createElement('span');n.className='n';n.textContent=d;
   const p=document.createElement('span');p.className='p';p.textContent=boat==='florentine'?fmt.format(price(str,slot)):'Devis';
   b.append(n,p);b.setAttribute('aria-label',d+' '+bar.textContent+', '+p.textContent);
   b.addEventListener('click',()=>{selected=str;render();update()});days.append(b);
  }
  card.querySelector('[data-prev-month]').disabled=iso(month.getUTCFullYear(),month.getUTCMonth(),1)<today.slice(0,7)+'-01';
 };
 card.querySelector('[data-prev-month]').addEventListener('click',()=>{month.setUTCMonth(month.getUTCMonth()-1);render()});
 card.querySelector('[data-next-month]').addEventListener('click',()=>{month.setUTCMonth(month.getUTCMonth()+1);render()});
 card.querySelectorAll('[data-slot]').forEach(b=>b.addEventListener('click',()=>{slot=b.dataset.slot;card.querySelectorAll('[data-slot]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();update()}));
 render();update();
});
})();