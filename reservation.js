(() => {
  'use strict';
  const form = document.getElementById('booking-form');
  if (!form) return;
  const date = form.elements.date;
  const money = value => new Intl.NumberFormat('fr-FR', {style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  date.min = today;
  let month = new Date(`${today}T12:00:00`); month.setDate(1);
  const calendar = document.getElementById('booking-calendar');
  calendar.hidden = false;
  function calendarRender() {
    document.getElementById('calendar-month').textContent = month.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
    const grid = document.getElementById('calendar-days'); grid.replaceChildren();
    const offset = (month.getDay()+6)%7;
    for(let i=0;i<offset;i++) grid.append(document.createElement('span'));
    const length = new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    for(let day=1;day<=length;day++) {
      const value=iso(new Date(month.getFullYear(),month.getMonth(),day));
      const button=document.createElement('button');button.type='button';button.textContent=day;
      button.disabled=value<today;button.setAttribute('aria-pressed',String(value===date.value));
      button.setAttribute('aria-label',new Date(`${value}T12:00:00`).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
      button.addEventListener('click',()=>{date.value=value;calendarRender();update();});grid.append(button);
    }
    document.getElementById('previous-month').disabled=iso(month).slice(0,7)<=today.slice(0,7);
  }
  document.getElementById('previous-month').addEventListener('click',()=>{month.setMonth(month.getMonth()-1);calendarRender();});
  document.getElementById('next-month').addEventListener('click',()=>{month.setMonth(month.getMonth()+1);calendarRender();});
  date.addEventListener('change',()=>{if(date.value){month=new Date(`${date.value}T12:00:00`);month.setDate(1);calendarRender();}});
  const selectedOptions=()=>form.elements.extras.value==='oui' ? Array.from(form.querySelectorAll('input[name="option"]:checked')) : [];
  const formattedDate=()=>date.value?new Date(`${date.value}T12:00:00`).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'Date à choisir';
  const slotLabel=()=>form.elements.slot.value==='soiree'?'Soirée de 20h à 2h du matin · mise en place dès 18h':'Journée · horaires à convenir';
  function update() {
    const enabled=form.elements.extras.value==='oui';document.getElementById('paid-options').hidden=!enabled;
    form.querySelectorAll('input[name="option"]').forEach(el=>{el.disabled=!enabled; if(!enabled)el.checked=false;});
    const selected=selectedOptions();const total=selected.reduce((sum,el)=>sum+Number(el.dataset.price),0);
    document.getElementById('extras-total').textContent=money(total);
    document.getElementById('selection-summary').textContent=`${formattedDate()} · ${slotLabel()}${form.elements.guests.value?' · '+form.elements.guests.value+' personnes':''}${selected.length?' · '+selected.map(el=>el.dataset.label).join(', '):' · Sans option'}`;
  }
  form.addEventListener('input',()=>{form.elements.email.required=false;update();});
  form.addEventListener('change',update);
  function message() {
    const selected=selectedOptions();const total=selected.reduce((sum,el)=>sum+Number(el.dataset.price),0);
    return ['Bonjour, je souhaite privatiser Florentine sur Seine.', '',
      `Prénom : ${form.elements.firstname.value.trim()}`,`Téléphone : ${form.elements.phone.value.trim()}`,
      ...(form.elements.email.value.trim()?[`E-mail : ${form.elements.email.value.trim()}`]:[]),
      `Date souhaitée : ${formattedDate()}`,`Créneau : ${slotLabel()}`,`Nombre de personnes : ${form.elements.guests.value}`,
      '', 'Options :',...(selected.length?selected.map(el=>`- ${el.dataset.label} : ${money(Number(el.dataset.price))}`):['Aucune option']),
      `Total des options : ${money(total)}`,'Location : sur devis. Total de l’événement à confirmer.',
      ...(form.elements.comment.value.trim()?['',`Commentaire : ${form.elements.comment.value.trim()}`]:[]),
      '', 'Merci de me confirmer la disponibilité et de m’adresser votre proposition.'].join('\n');
  }
  form.querySelectorAll('button[name=channel]').forEach(button=>button.addEventListener('click',()=>{form.elements.email.required=button.value==='email';}));
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const channel=event.submitter?.value||'whatsapp';
    form.elements.email.required=channel==='email';
    if(!form.reportValidity())return;
    if(!form.elements.firstname.value.trim()||!form.elements.phone.value.trim()) {
      document.getElementById('send-feedback').textContent='Merci de renseigner votre prénom et votre téléphone.';return;
    }
    const body=message();
    document.getElementById('message-copy').value=body;document.getElementById('message-fallback').hidden=false;
    if(channel==='email') {
      document.getElementById('send-feedback').textContent='Votre application e-mail va s’ouvrir. Appuyez sur « Envoyer » pour transmettre la demande. Si elle ne s’ouvre pas, copiez le récapitulatif ci-dessous et envoyez-le à contact@florentine-sur-seine.com.';
      window.location.href='mailto:contact@florentine-sur-seine.com?subject='+encodeURIComponent('Demande de privatisation Florentine — '+formattedDate())+'&body='+encodeURIComponent(body);
    } else {
      document.getElementById('send-feedback').textContent='Le récapitulatif s’ouvre dans WhatsApp. Appuyez sur « Envoyer » pour transmettre votre demande.';
      window.open('https://wa.me/33781660629?text='+encodeURIComponent(body),'_blank','noopener,noreferrer');
    }
  });
  calendarRender();update();
})();
