(()=>{'use strict';
// Shared contact button on every public page, including future generated pages.
if(!document.getElementById('florentine-whatsapp')){
 const style=document.createElement('style');
 style.textContent=`
 .f-whatsapp{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:calc(20px + env(safe-area-inset-bottom));z-index:90;display:flex;align-items:center;justify-content:center;width:60px;height:60px;border:2px solid #fff;border-radius:50%;background:#25d366;color:#fff;box-shadow:0 5px 20px #0005;text-decoration:none;transition:background .15s,transform .15s}
 .f-whatsapp:hover{background:#128c7e;transform:translateY(-2px)}
 .f-whatsapp:focus-visible{outline:3px solid #fff;outline-offset:4px}
 .f-whatsapp svg{display:block;width:34px;height:34px;fill:currentColor}
 @media(max-width:800px){.f-whatsapp{width:56px;height:56px;right:max(16px,env(safe-area-inset-right))}.has-mobile-contact .f-whatsapp{bottom:calc(88px + env(safe-area-inset-bottom))}}
 @media(prefers-reduced-motion:reduce){.f-whatsapp{transition:none}.f-whatsapp:hover{transform:none}}
 @media print{.f-whatsapp{display:none}}
 `;
 document.head.appendChild(style);
 const whatsapp=document.createElement('a');
 whatsapp.id='florentine-whatsapp';whatsapp.className='f-whatsapp';
 whatsapp.href='https://wa.me/33663659679?text='+encodeURIComponent('Bonjour, je souhaite des renseignements pour privatiser une péniche avec Florentine sur Seine.');
 whatsapp.target='_blank';whatsapp.rel='noopener noreferrer';
 whatsapp.setAttribute('aria-label','Contacter Florentine sur Seine sur WhatsApp');
 whatsapp.title='Écrivez-nous sur WhatsApp';
 whatsapp.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.89 11.89 0 0 0 12.04 0C5.43 0 .05 5.38.05 11.99c0 2.11.55 4.17 1.6 5.99L0 24l6.16-1.62a12 12 0 0 0 5.88 1.5h.01C18.66 23.88 24 18.5 24 11.89c0-3.2-1.24-6.21-3.48-8.41ZM12.05 21.86h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.66.96.98-3.57-.24-.37a9.9 9.9 0 0 1-1.52-5.29c0-5.5 4.48-9.98 9.99-9.98a9.89 9.89 0 0 1 7.06 2.93 9.9 9.9 0 0 1 2.92 7.06c0 5.5-4.48 9.98-10.1 9.86Zm5.48-7.41c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.11 4.51.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg>';
 document.body.appendChild(whatsapp);
}
const menu=document.querySelector('.f-menu');
if(menu){document.addEventListener('click',e=>{if(!e.target.closest('.f-menu'))menu.open=false});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus()}})}
const parisDate=()=>{const d=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p=>[p.type,p.value]));return `${d.year}-${d.month}-${d.day}`};
const money=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
for(const form of document.querySelectorAll('[data-estimate]')){
 const date=form.querySelector('[name=date]'),output=form.querySelector('[data-estimate-price]'),description=form.querySelector('[data-estimate-description]'),quote=form.querySelector('[data-estimate-quote]'),error=form.querySelector('[data-estimate-error]');date.min=parisDate();
 function update(){const slot=form.querySelector('[name=slot]:checked').value;const validDate=date.value&&date.value>=parisDate();const peak=validDate&&[4,5,6].includes(new Date(date.value+'T12:00:00Z').getUTCDay());const price=slot==='journee'?(peak?2000:1800):(peak?2800:2500);output.textContent=(validDate?'':'Dès ')+money(price);description.textContent=(slot==='journee'?'Location en journée':'Location en soirée')+' · hors options';error.textContent=date.value&&!validDate?'Choisissez une date à partir d’aujourd’hui.':'';const p=new URLSearchParams({peniche:'florentine',creneau:slot});if(validDate)p.set('date',date.value);quote.href='/devis-peniche.html?'+p.toString();quote.textContent=validDate?'Demander cette date':'Demander un devis';}
 form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('submit',e=>{e.preventDefault();if(date.value&&date.value<parisDate()){date.setCustomValidity('Choisissez une date à partir d’aujourd’hui.');date.reportValidity();return}location.href=quote.href});date.addEventListener('input',()=>date.setCustomValidity(''));update();
}
const dialog=document.getElementById('photo-lightbox');const photos=Array.from(document.querySelectorAll('[data-photo]'));
if(dialog&&photos.length){let current=0,previous=null,touchX=null;const image=dialog.querySelector('[data-large]'),caption=dialog.querySelector('[data-caption]'),count=dialog.querySelector('[data-count]');const show=i=>{current=(i+photos.length)%photos.length;const b=photos[current];image.src=b.dataset.src;image.alt=b.querySelector('img').alt;caption.textContent=b.dataset.caption||image.alt;count.textContent=`${current+1} / ${photos.length}`};photos.forEach((b,i)=>b.addEventListener('click',()=>{previous=b;show(i);dialog.showModal()}));dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.querySelector('[data-prev]').addEventListener('click',()=>show(current-1));dialog.querySelector('[data-next]').addEventListener('click',()=>show(current+1));dialog.addEventListener('close',()=>previous?.focus({preventScroll:true}));dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}else if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}});dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});image.addEventListener('touchstart',e=>touchX=e.changedTouches[0]?.clientX??null,{passive:true});image.addEventListener('touchend',e=>{if(touchX===null)return;const delta=(e.changedTouches[0]?.clientX??touchX)-touchX;if(Math.abs(delta)>45)show(current+(delta<0?1:-1));touchX=null},{passive:true})}
})();
