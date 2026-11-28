(()=>{'use strict';
const form=document.getElementById('smart-quote');if(!form)return;
const boat=form.querySelector('#q-boat'),date=form.querySelector('#q-date'),slot=form.querySelector('#q-slot');
const params=new URLSearchParams(location.search),known={florentine:'Florentine sur Seine',mistinguett:'Mistinguett',alize:'Alizé'};
if(known[params.get('peniche')])boat.value=known[params.get('peniche')];
const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const d=Object.fromEntries(parts.map(p=>[p.type,p.value]));const today=d.year+'-'+d.month+'-'+d.day;date.min=today;date.max='9999-12-31';
if(/^\d{4}-\d{2}-\d{2}$/.test(params.get('date')||'')&&params.get('date')>=today)date.value=params.get('date');
if(params.get('creneau')==='journee')slot.value='Journée';else if(params.get('creneau')==='soiree')slot.value='Soirée';
function validateDate(){
 const value=date.value;
 let error='';
 if(value&&!/^\d{4}-\d{2}-\d{2}$/.test(value))error='Indiquez une année sur 4 chiffres, par exemple 2027.';
 else if(date.validity?.badInput)error='Complétez la date au format jour / mois / année (4 chiffres).';
 else if(value&&Date.parse(value+'T00:00:00Z')<Date.parse(today+'T00:00:00Z'))error='Choisissez une date à partir d’aujourd’hui.';
 date.setCustomValidity(error);
}
function valid(){validateDate();return form.reportValidity()}
date.addEventListener('invalid',validateDate);
date.addEventListener('input',()=>date.setCustomValidity(''));
function message(){const entries=Array.from(new FormData(form).entries()).filter(([k,v])=>!k.startsWith('_')&&String(v).trim()).map(([k,v])=>k+' : '+String(v).trim());if(!date.value)entries.push('Date : à définir');return 'Bonjour, je souhaite un devis de privatisation.\n\n'+entries.join('\n')+'\n\nMerci de me confirmer les disponibilités et les prestations.'}
let sending=false;
form.addEventListener('submit',e=>{e.preventDefault();if(sending||!valid())return;document.getElementById('quote-status').textContent='Votre message est prêt. Relisez-le et envoyez-le dans WhatsApp.';location.assign('https://wa.me/33663659679?text='+encodeURIComponent(message()))});
function showMailSent(){
 document.getElementById('quote-mail-sent')?.remove();
 const popup=document.createElement('div');
 popup.id='quote-mail-sent';popup.setAttribute('role','status');popup.setAttribute('aria-live','polite');
 popup.style.cssText='position:fixed;top:110px;left:50%;transform:translateX(-50%);z-index:1100;display:flex;align-items:center;gap:24px;max-width:calc(100vw - 32px);padding:16px 20px;border:1px solid #a9c5bd;border-radius:10px;background:#102a25;color:#fff;box-shadow:0 8px 30px #0006;font:600 16px/1.4 Arial,sans-serif';
 const label=document.createElement('span');label.textContent='Mail envoyé !';popup.appendChild(label);
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Fermer la confirmation');
 close.style.cssText='border:0;background:transparent;color:inherit;font-size:24px;line-height:1;min-width:32px;min-height:32px;cursor:pointer';
 close.addEventListener('click',()=>popup.remove());popup.appendChild(close);
 document.body.appendChild(popup);setTimeout(()=>popup.remove(),5000);
}
const emailButton=document.getElementById('quote-email-button');
emailButton?.addEventListener('click',async()=>{
 if(sending||!valid())return;
 const data=Object.fromEntries(new FormData(form).entries());
 if(String(data._honey||'').trim())return;
 const status=document.getElementById('quote-status');
 const originalLabel=emailButton.textContent;
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),20000);
 sending=true;emailButton.disabled=true;emailButton.textContent='Envoi en cours…';form.setAttribute('aria-busy','true');
 status.textContent='Envoi de votre demande…';
 try{
  const response=await fetch('https://formsubmit.co/ajax/contact@florentine-sur-seine.fr',{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:controller.signal,
   body:JSON.stringify({...data,_subject:'Demande de devis Florentine · '+boat.value,_template:'table',_url:'https://florentine-sur-seine.fr/devis-peniche.html',message:message()})
  });
  const result=await response.json();
  if(!response.ok||!(result.success===true||result.success==='true')){
   if(/activat/i.test(String(result.message||''))){
    status.textContent='L’envoi par e-mail est temporairement indisponible. Vos informations sont conservées : vous pouvez nous transmettre la demande sur WhatsApp ou nous appeler au 06 63 65 96 79.';
    return;
   }
   throw new Error('Email submission not confirmed');
  }
  showMailSent();
  status.textContent='Votre demande a été transmise par e-mail. Merci ! Notre équipe reviendra vers vous pour confirmer les disponibilités.';
 }catch(error){
  status.textContent='L’envoi n’a pas pu être confirmé. Vos informations sont conservées. Vous pouvez réessayer ou continuer sur WhatsApp.';
 }finally{
  clearTimeout(timeout);sending=false;emailButton.disabled=false;emailButton.textContent=originalLabel;form.setAttribute('aria-busy','false');
 }
});
})();
