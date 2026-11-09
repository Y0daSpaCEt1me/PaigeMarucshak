import {calculateQuantum} from './quantum-model.js';
// All statement values are in millions of dollars. The loan is drawn at commissioning.
const model = document.querySelector('#model-details');
const utilization = model.querySelector('#plant-use');
const price = model.querySelector('#power-price');
const money = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1});

function updateStatements() {
  const mwh = 1000 * 8760 * utilization.value / 100;
  const revenue = mwh * price.value / 1e6;
  const costs=Number(model.querySelector('#operating-cost').value);
  const ebitda = revenue - costs;
  const depreciation = 6000 / 30;
  const principal = 2400 / 20;
  const rate=Number(model.querySelector('#loan-rate').value);
  const interest = 2400 * rate/100;
  const pretax = ebitda - depreciation - interest;
  const tax = Math.max(0, pretax * .25);
  const income = pretax - tax;
  const available = ebitda - tax - 60;
  const service = principal + interest;
  const retainedCash = available - service;
  const closingCash = 200 + retainedCash;
  const closingPlant = 6000 + 60 - depreciation;
  const closingDebt = 2400 - principal;
  const closingEquity = 3800 + income;
  const figures = {costs,interest,service,revenue, ebitda, pretax, tax, income, available, retainedCash, closingCash,
    closingPlant, closingDebt, closingEquity, accumulated: -2000 + income,
    assets: closingCash + closingPlant, financing: closingDebt + closingEquity};
  for (const cell of model.querySelectorAll('[data-figure]')) {
    cell.textContent = money.format(figures[cell.dataset.figure]);
  }
  model.querySelector('#cost-label').textContent='$'+costs+'M';
  model.querySelector('#rate-label').textContent=rate+'%';
  model.querySelector('#use-label').textContent = utilization.value + '%';
  model.querySelector('#price-label').textContent = '$' + price.value + '/MWh';
  model.querySelector('#generation').textContent = mwh.toLocaleString('en-US');
  model.querySelector('#coverage').textContent = (available / service).toFixed(2) + '×';
  model.querySelector('#coverage-status').textContent = available >= 1.35 * service
    ? 'Meets the illustrative 1.35× lender test.'
    : available >= service ? 'Covers scheduled payments but falls below the 1.35× lender test.'
    : 'Operating cash falls short of scheduled payments. The shortfall draws on opening cash.';
}
model.addEventListener('input', updateStatements);
updateStatements();

model.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{[utilization.value,price.value]=button.dataset.scenario.split(',');model.querySelector('#operating-cost').value=200;model.querySelector('#loan-rate').value=7;updateStatements();}));


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
