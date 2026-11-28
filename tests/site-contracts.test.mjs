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
 const document={querySelector:()=>null,querySelectorAll:s=>s==='[data-estimate]'?[form]:[],getElementById:()=>null,createElement:()=>({setAttribute(){}}),head:{appendChild(){}},body:{appendChild(){}}};const location={};
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
function quoteForm(response={success:'true'},networkError=false){
 const src=fs.readFileSync(new URL('../devis-intelligent.js',import.meta.url),'utf8');
 const fields={'#q-boat':{value:'À conseiller'},'#q-date':{value:'',setCustomValidity(v){this.error=v},addEventListener(){}},'#q-slot':{value:'À définir'}};
 let valid=false;const events={},requests=[];
 const form={querySelector:s=>fields[s],reportValidity:()=>valid&&!fields['#q-date'].error,addEventListener:(k,v)=>events[k]=v,setAttribute(k,v){this[k]=v}};
 const email={textContent:'Envoyer par e-mail',addEventListener(k,fn){this.click=fn}},status={};
 const location={search:'?peniche=alize&creneau=soiree',assign(v){this.target=v}};
 const document={getElementById:id=>({'smart-quote':form,'quote-email-button':email,'quote-status':status}[id]),createElement:()=>({style:{},setAttribute(){},appendChild(){},addEventListener(){},remove(){}}),body:{appendChild(){}}};
 class FormData{entries(){return [['Nom','Test local'],['email','test@example.invalid'],['Événement','Anniversaire'],['_honey','']][Symbol.iterator]()}}
 const fetch=async(url,options)=>{requests.push({url,options});if(networkError)throw new Error('Network unavailable');return {ok:true,json:async()=>response}};
 vm.runInNewContext(src,{document,location,FormData,Intl,Date,URLSearchParams,encodeURIComponent,fetch,AbortController,setTimeout,clearTimeout});
 return {fields,events,email,status,location,requests,form,setValid:v=>valid=v};
}
test('validation sends nothing; WhatsApp still prepares the quote and email posts directly',async()=>{
 const q=quoteForm();assert.equal(q.fields['#q-boat'].value,'Alizé');assert.equal(q.fields['#q-slot'].value,'Soirée');
 q.events.submit({preventDefault(){}});await q.email.click();assert.equal(q.requests.length,0);assert.equal(q.location.target,undefined);
 q.setValid(true);q.events.submit({preventDefault(){}});const target=new URL(q.location.target);assert.equal(target.hostname,'wa.me');assert.match(target.searchParams.get('text'),/test@example.invalid/);assert.match(target.searchParams.get('text'),/Date : à définir/);
 const pending=q.email.click();assert.equal(q.email.disabled,true);await q.email.click();assert.equal(q.requests.length,1);await pending;
 assert.equal(q.requests[0].url,'https://formsubmit.co/ajax/contact@florentine-sur-seine.fr');
 const data=JSON.parse(q.requests[0].options.body);assert.equal(data.email,'test@example.invalid');assert.match(data.message,/Date : à définir/);
 assert.equal(q.status.textContent,'Mail envoyé !');assert.equal(q.email.disabled,false);assert.equal(q.location.href,undefined);
});
test('activation required, HTTP failures and network errors never claim an email was sent',async()=>{
 for(const [result,offline] of [[{success:'false',message:'This form needs Activation'},false],[{success:false,message:'Rejected'},false],[{success:true},true]]){
  const q=quoteForm(result,offline);q.setValid(true);await q.email.click();
  assert.notEqual(q.status.textContent,'Mail envoyé !');assert.match(q.status.textContent,/WhatsApp/);
  assert.equal(q.email.disabled,false);assert.equal(q.email.textContent,'Envoyer par e-mail');assert.equal(q.form['aria-busy'],'false');
 }
});

test('quote date accepts a future date, remains optional, and distinguishes a five-digit year from a past date',async()=>{
 const q=quoteForm();q.setValid(true);const date=q.fields['#q-date'];
 date.value='20026-12-01';await q.email.click();assert.match(date.error,/année sur 4 chiffres/);assert.equal(q.requests.length,0);
 date.value='2020-12-01';await q.email.click();assert.match(date.error,/aujourd’hui/);assert.equal(q.requests.length,0);
 date.value='2027-12-01';await q.email.click();assert.equal(date.error,'');
 date.value='';await q.email.click();assert.equal(date.error,'');assert.equal(date.max,'9999-12-31');
});
