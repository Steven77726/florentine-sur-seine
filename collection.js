(()=>{'use strict';
const WA='33663659679';
const EMAIL='contact@florentine-sur-seine.com';
const fmt=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const parisToday=()=>{const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const by=Object.fromEntries(parts.map(p=>[p.type,p.value]));return by.year+'-'+by.month+'-'+by.day};
const today=parisToday();
const iso=(y,m,d)=>y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
const price=(str,slot)=>{const d=new Date(str+'T12:00:00Z').getUTCDay();const peak=d>=4&&d<=6;return slot==='journee'?(peak?2000:1800):(peak?2800:2500)};
const details={florentine:{name:'Florentine sur Seine',address:'Boulogne-Billancourt'},mistinguett:{name:'Mistinguett',address:'Paris 12e'},alize:{name:'Alizé',address:'Paris 12e'}};
const lightbox=document.getElementById('collection-lightbox');
const lightboxImg=lightbox?.querySelector('img');
const lightboxCount=lightbox?.querySelector('[data-zoom-count]');
let zoomItems=[],zoomIndex=0;
function setZoom(next){
 if(!lightbox||!lightboxImg||!zoomItems.length)return;
 zoomIndex=(next+zoomItems.length)%zoomItems.length;
 lightboxImg.src=zoomItems[zoomIndex].src;
 lightboxImg.alt=zoomItems[zoomIndex].alt||'Photographie de la péniche';
 if(lightboxCount)lightboxCount.textContent=(zoomIndex+1)+' / '+zoomItems.length;
}
function openZoom(items,index){
 if(!lightbox||!items?.length)return;
 zoomItems=items;setZoom(index);
 if(!lightbox.open)lightbox.showModal();
}
lightbox?.querySelector('[data-zoom-prev]')?.addEventListener('click',()=>setZoom(zoomIndex-1));
lightbox?.querySelector('[data-zoom-next]')?.addEventListener('click',()=>setZoom(zoomIndex+1));
lightbox?.querySelector('[data-zoom-close]')?.addEventListener('click',()=>lightbox.close());
lightbox?.addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft'){e.preventDefault();setZoom(zoomIndex-1)}
 else if(e.key==='ArrowRight'){e.preventDefault();setZoom(zoomIndex+1)}
});
let touchStart=null;
lightbox?.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0]?.clientX??null},{passive:true});
lightbox?.addEventListener('touchend',e=>{
 if(touchStart===null)return;
 const dx=(e.changedTouches[0]?.clientX??touchStart)-touchStart;
 if(Math.abs(dx)>45)setZoom(zoomIndex+(dx<0?1:-1));
 touchStart=null;
},{passive:true});
document.querySelectorAll('[data-hero-gallery]').forEach(g=>{
  let photos=[];try{photos=JSON.parse(g.getAttribute('data-hero-gallery')||'[]')}catch(e){}
  if(!photos.length)return;
  const img=g.querySelector('.hero-boat-image'),counter=g.querySelector('.hero-gallery-count');if(!img||!counter)return;
  let current=0,gestureX=null;
  const show=(next)=>{
    current=(next+photos.length)%photos.length;
    img.src=photos[current].src;
    img.alt=photos[current].alt||'Photo de la péniche Florentine';
    counter.textContent=(current+1)+' / '+photos.length;
  };
  const prev=()=>show(current-1),next=()=>show(current+1);
  g.querySelector('[data-hero-prev]')?.addEventListener('click',prev);
  g.querySelector('[data-hero-next]')?.addEventListener('click',next);
  g.setAttribute('tabindex','0');
  g.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();prev()}else if(e.key==='ArrowRight'){e.preventDefault();next()}});
  g.addEventListener('touchstart',e=>{gestureX=e.changedTouches[0]?.clientX??null},{passive:true});
  g.addEventListener('touchend',e=>{if(gestureX===null)return;const delta=(e.changedTouches[0]?.clientX??gestureX)-gestureX;if(Math.abs(delta)>35)(delta<0?next:prev)();gestureX=null},{passive:true});
  g.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&Math.abs(e.deltaX)>12){e.preventDefault();(e.deltaX>0?next:prev)()}},{passive:false});
  img.addEventListener('click',()=>openZoom(photos,current));
  img.style.cursor='zoom-in';
  show(0);
});
document.querySelectorAll('[data-gallery]').forEach(g=>{
  let imgs=[];try{imgs=JSON.parse(g.dataset.gallery||'[]')}catch(e){}
  if(!imgs.length)return;
  const frame=g.querySelector('.gallery-frame'),count=g.querySelector('.gallery-count');let index=0;
  const render=()=>{frame.src=imgs[index].src;frame.alt=imgs[index].alt||'Photo de péniche';count.textContent=(index+1)+' / '+imgs.length};
  const show=n=>{index=(n+imgs.length)%imgs.length;render()};
  g.querySelector('[data-prev]')?.addEventListener('click',()=>show(index-1));
  g.querySelector('[data-next]')?.addEventListener('click',()=>show(index+1));
  frame.addEventListener('click',()=>openZoom(imgs,index));
  let start=null;g.addEventListener('touchstart',e=>{start=e.changedTouches[0]?.clientX},{passive:true});
  g.addEventListener('touchend',e=>{if(start===null)return;const dx=e.changedTouches[0].clientX-start;if(Math.abs(dx)>40)show(index+(dx<0?1:-1));start=null},{passive:true});
  render();
});

document.querySelectorAll('[data-booking]').forEach(card=>{
 const boat=card.dataset.booking,info=details[boat];if(!info)return;
 let slot='soiree',selected='',month=new Date(today+'T12:00:00Z');month.setUTCDate(1);
 const bar=card.querySelector('.collection-calendar-bar strong'),days=card.querySelector('.collection-month'),status=card.querySelector('.collection-total'),link=card.querySelector('.collection-booking-link'),mail=card.querySelector('.collection-booking-email');
 const getPrice=()=>boat==='florentine'?price(selected,slot):null;
 const update=()=>{
   const p=selected?getPrice():null;
   status.textContent=selected?(boat==='florentine'?fmt.format(p):'Sur devis'):'Sélectionnez une date';
   const m='Bonjour, je souhaite '+(boat==='florentine'?'privatiser ':'un devis pour la péniche ')+info.name+'.\nDate : '+(selected||'à préciser')+'\nFormule : '+(slot==='soiree'?'Soirée':'Journée')+(boat==='florentine'&&slot==='soiree'?' (20h à 02h, installation dès 18h)':'')+(p?'\nTarif affiché : '+fmt.format(p):'')+'\nPouvez-vous me confirmer la disponibilité et les conditions ?';
   link.href='https://wa.me/'+WA+'?text='+encodeURIComponent(m);
   if(mail){mail.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Demande de devis - '+info.name+(selected?' - '+selected:''))+'&body='+encodeURIComponent(m);}
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