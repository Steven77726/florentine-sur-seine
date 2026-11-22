(()=>{'use strict';const f=document.getElementById('smart-quote');if(!f)return;
const boat=f.querySelector('#q-boat'),date=f.querySelector('#q-date'),slot=f.querySelector('#q-slot'),mail=f.querySelector('#quote-mailto');
const params=new URLSearchParams(location.search);const known={florentine:'Florentine sur Seine',mistinguett:'Mistinguett',alize:'Alizé'};const key=(params.get('peniche')||'').toLowerCase();
if(known[key])boat.value=known[key];
const requestedDate=params.get('date');if(requestedDate&&/^\d{4}-\d{2}-\d{2}$/.test(requestedDate))date.value=requestedDate;
if(params.get('creneau')==='journee')slot.value='Journée';
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());date.min=today;
function updateDraft(){const data=new FormData(f);const entries=[];for(const [k,v] of data.entries()){if(k.startsWith('_')||!v||k==='email'&&v==='')continue;entries.push(k+': '+v)}
const body='Bonjour,\n\nJe souhaite recevoir un devis de privatisation.\n\n'+entries.join('\n')+'\n\nMerci de me confirmer les disponibilités et conditions.';
mail.href='mailto:contact@florentine-sur-seine.com?subject='+encodeURIComponent('Demande de devis · '+(boat.value||'Péniche'))+'&body='+encodeURIComponent(body)}
f.addEventListener('input',updateDraft);f.addEventListener('change',updateDraft);updateDraft();
f.addEventListener('submit',e=>{if(date.value&&date.value<today){e.preventDefault();date.setCustomValidity('Choisissez une date future.');date.reportValidity();return;}date.setCustomValidity('');const status=document.getElementById('quote-status');if(status)status.textContent='Transmission de la demande au service d’e-mail…'});
})();