(()=>{'use strict';
const form=document.getElementById('smart-quote');if(!form)return;
const boat=form.querySelector('#q-boat'),date=form.querySelector('#q-date'),slot=form.querySelector('#q-slot');
const params=new URLSearchParams(location.search),known={florentine:'Florentine sur Seine',mistinguett:'Mistinguett',alize:'Alizé'};
if(known[params.get('peniche')])boat.value=known[params.get('peniche')];
const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const d=Object.fromEntries(parts.map(p=>[p.type,p.value]));const today=d.year+'-'+d.month+'-'+d.day;date.min=today;
if(/^\d{4}-\d{2}-\d{2}$/.test(params.get('date')||'')&&params.get('date')>=today)date.value=params.get('date');
if(params.get('creneau')==='journee')slot.value='Journée';else if(params.get('creneau')==='soiree')slot.value='Soirée';
function valid(){date.setCustomValidity(date.value&&date.value<today?'Choisissez une date à partir d’aujourd’hui.':'');return form.reportValidity()}
date.addEventListener('input',()=>date.setCustomValidity(''));
function message(){const entries=Array.from(new FormData(form).entries()).filter(([,v])=>String(v).trim()).map(([k,v])=>k+' : '+String(v).trim());if(!date.value)entries.push('Date : à définir');return 'Bonjour, je souhaite un devis de privatisation.\n\n'+entries.join('\n')+'\n\nMerci de me confirmer les disponibilités et les prestations.'}
form.addEventListener('submit',e=>{e.preventDefault();if(!valid())return;document.getElementById('quote-status').textContent='Votre message est prêt. Relisez-le et envoyez-le dans WhatsApp.';location.assign('https://wa.me/33663659679?text='+encodeURIComponent(message()))});
document.getElementById('quote-email-button')?.addEventListener('click',()=>{if(!valid())return;document.getElementById('quote-status').textContent='Votre brouillon s’ouvre dans votre application e-mail. Vous pouvez le relire avant de l’envoyer.';location.href='mailto:contact@florentine-sur-seine.com?subject='+encodeURIComponent('Demande de devis · '+boat.value)+'&body='+encodeURIComponent(message())});
})();
