import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../florentine.js',import.meta.url),'utf8');
function estimator(){
 const events={};const date={value:'',addEventListener(k,v){events['date:'+k]=v},setCustomValidity(v){this.error=v},reportValidity(){this.reported=true}};
 const output={},description={},quote={},error={};let slot='journee';
 const fields={'[name=date]':date,'[data-estimate-price]':output,'[data-estimate-description]':description,'[data-estimate-quote]':quote,'[data-estimate-error]':error};
 const form={querySelector:s=>s==='[name=slot]:checked'?{value:slot}:fields[s],addEventListener:(k,v)=>events[k]=v};
 const document={querySelector:()=>null,querySelectorAll:s=>s==='[data-estimate]'?[form]:[],getElementById:()=>null};const location={};
 const NativeDate=Date;class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:['2026-11-27T12:00:00Z']))}}
 vm.runInNewContext(source,{document,Date:FixedDate,Intl,URLSearchParams,location});
 return {date,output,description,quote,error,events,location,setSlot:v=>slot=v};
}
test('Florentine: base, weekday, Thursday–Saturday and evening rates match the published offer',()=>{
 const e=estimator();assert.match(e.output.textContent,/1\s*800/);
 e.date.value='2026-12-02';e.events.change();assert.match(e.output.textContent,/1\s*800/);
 e.date.value='2026-12-03';e.events.change();assert.match(e.output.textContent,/2\s*000/);
 e.setSlot('soiree');e.events.change();assert.match(e.output.textContent,/2\s*800/);
 e.date.value='2026-12-06';e.events.change();assert.match(e.output.textContent,/2\s*500/);
});
test('the chosen date and slot are carried into the quote, and a past date cannot be submitted',()=>{
 const e=estimator();e.date.value='2026-12-03';e.setSlot('soiree');e.events.input();const url=new URL(e.quote.href,'https://florentine-sur-seine.fr');assert.equal(url.searchParams.get('peniche'),'florentine');assert.equal(url.searchParams.get('date'),'2026-12-03');assert.equal(url.searchParams.get('creneau'),'soiree');
 e.date.value='2026-11-01';e.events.input();assert.match(e.error.textContent,/aujourd’hui/);assert.equal(new URL(e.quote.href,'https://florentine-sur-seine.fr').searchParams.has('date'),false);e.events.submit({preventDefault(){}});assert.equal(e.location.href,undefined);assert.equal(e.date.reported,true);
});
test('the short form prepares WhatsApp and e-mail drafts without transmitting during validation',()=>{
 const src=fs.readFileSync(new URL('../devis-intelligent.js',import.meta.url),'utf8');const fields={'#q-boat':{value:'À conseiller'},'#q-date':{value:'',setCustomValidity(v){this.error=v},addEventListener(){}},'#q-slot':{value:'À définir'}};
 let valid=false;const events={};const form={querySelector:s=>fields[s],reportValidity:()=>valid,addEventListener:(k,v)=>events[k]=v};const email={addEventListener(k,fn){this.click=fn}};const status={};const location={search:'?peniche=alize&creneau=soiree',assign(v){this.target=v}};
 const document={getElementById:id=>({'smart-quote':form,'quote-email-button':email,'quote-status':status}[id])};
 class FormData{entries(){return [['Nom','Test local'],['email','test@example.invalid'],['Événement','Anniversaire'],["Nombre d'invités",'80']][Symbol.iterator]()}}
 vm.runInNewContext(src,{document,location,FormData,Intl,Date,URLSearchParams,encodeURIComponent});assert.equal(fields['#q-boat'].value,'Alizé');assert.equal(fields['#q-slot'].value,'Soirée');events.submit({preventDefault(){}});assert.equal(location.target,undefined);
 valid=true;events.submit({preventDefault(){}});const target=new URL(location.target);assert.equal(target.hostname,'wa.me');assert.match(target.searchParams.get('text'),/test@example.invalid/);assert.match(target.searchParams.get('text'),/Date : à définir/);email.click();assert.match(location.href,/^mailto:contact@florentine-sur-seine.com/);
});
