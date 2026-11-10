import {calculateQuantum} from './quantum-model.js';
const money = new Intl.NumberFormat('en-US', {minimumFractionDigits:1,maximumFractionDigits:1});
const model=document.querySelector('#model-details');
const f={use:80,price:100,cost:200,rate:7};
function updateFusion(){
 let cash=200,ppe=6000,debt=2400,equity=3800;const years=[];
 for(let y=0;y<3;y++){
 const startCash=cash,revenue=1000*8760*f.use/100*f.price/1e6,cost=f.cost,ebitda=revenue-cost,da=200,operating=ebitda-da,interest=debt*f.rate/100,pretax=operating-interest,tax=Math.max(0,pretax*.25),income=pretax-tax,cfo=income+da,capex=60,fcf=cfo-capex,principal=120,funding=Math.max(0,50-(cash+fcf-principal)),coverage=(ebitda-tax-capex)/(interest+principal);
 cash+=fcf-principal+funding;ppe+=capex-da;debt-=principal;equity+=income+funding;const assets=cash+ppe,financing=debt+equity;
 years.push({startCash,revenue,cost,ebitda,da,operating,interest,pretax,tax,income,cfo,capex,fcf,principal,funding,coverage,cash,ppe,debt,equity,assets,financing,check:assets-financing});
 }
 model.querySelectorAll('[data-f-input]').forEach(e=>e.value=f[e.dataset.fInput]);
 model.querySelectorAll('[data-f-label]').forEach(e=>{const k=e.dataset.fLabel;e.textContent=['use','rate'].includes(k)?f[k]+'%':'$'+f[k];});
 model.querySelectorAll('[data-f-value]').forEach(e=>{const v=years[+e.dataset.year][e.dataset.fValue];e.textContent=Math.abs(v)<.00001?'0.0':v<0?'('+money.format(-v)+')':money.format(v);e.classList.toggle('negative',v<-.00001);});
}
model.addEventListener('input',e=>{if(e.target.dataset.fInput){f[e.target.dataset.fInput]=+e.target.value;updateFusion();}});
model.querySelectorAll('[data-f-preset]').forEach(e=>e.onclick=()=>{Object.assign(f,({low:{use:55,price:70,cost:250,rate:9},base:{use:80,price:100,cost:200,rate:7},high:{use:90,price:140,cost:180,rate:5}})[e.dataset.fPreset]);updateFusion();});
updateFusion();

const quantum=document.querySelector('#quantum-ledger');
const inputs=[...quantum.querySelectorAll('[data-q-input]')];
let assumptions={growth:60,margin:50,expenseGrowth:8,capex:30,sbc:60,openingCash:600};
const format=x=>Math.abs(x)<.00001?'0.0':x<0?'('+money.format(-x)+')':money.format(x);
function updateQuantum(){
 const years=calculateQuantum(assumptions);
 inputs.forEach(input=>{input.value=assumptions[input.dataset.qInput];});
 quantum.querySelectorAll('[data-q-label]').forEach(out=>{const key=out.dataset.qLabel;out.textContent=['growth','margin','expenseGrowth'].includes(key)?assumptions[key]+'%':'$'+assumptions[key]+'M';});
 quantum.querySelectorAll('[data-q-value]').forEach(cell=>{const value=years[Number(cell.dataset.year)][cell.dataset.qValue];cell.textContent=format(value);cell.classList.toggle('negative',value<-.00001);});
}
quantum.addEventListener('input',event=>{if(event.target.dataset.qInput){assumptions[event.target.dataset.qInput]=Number(event.target.value);updateQuantum();}});
quantum.querySelectorAll('[data-q-preset]').forEach(button=>button.onclick=()=>{const presets={slow:[30,35,15,50,60,600],base:[60,50,8,30,60,600],scale:[100,65,5,50,60,600]};Object.keys(assumptions).forEach((key,i)=>assumptions[key]=presets[button.dataset.qPreset][i]);updateQuantum();});
updateQuantum();
