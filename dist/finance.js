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
const format=x=>Math.abs(x)<.00001?'0.0':x<0?'('+money.format(-x)+')':money.format(x);
function updateQuantum(){
 const assumptions=Object.fromEntries(inputs.map(input=>[input.dataset.qInput,Number(input.value)]));
 const years=calculateQuantum(assumptions),last=years[2];
 inputs.forEach(input=>{const key=input.dataset.qInput;quantum.querySelector('#q-'+key+'-label').textContent=['growth','margin','expenseGrowth'].includes(key)?input.value+'%':'$'+input.value+'M';});
 quantum.querySelectorAll('[data-q-value]').forEach(cell=>{const value=years[Number(cell.dataset.year)][cell.dataset.qValue];cell.textContent=format(value);cell.classList.toggle('negative',value<-.00001);});
 const summary={revenue:`Year 3 revenue: $${format(last.revenue)}M`,income:`Year 3 net income / (loss): $${format(last.income)}M`,opex:`Year 3 operating expenses: $${format(last.opex)}M`,fcf:`Year 3 free cash flow: $${format(last.fcf)}M`,dilution:`Year 3 original-owner dilution: ${last.dilution.toFixed(1)}%`,funding:`Total new equity required: $${format(last.totalFunding)}M`};
 quantum.querySelectorAll('[data-q-summary]').forEach(el=>el.textContent=summary[el.dataset.qSummary]);
}
quantum.addEventListener('input',updateQuantum);
quantum.querySelectorAll('[data-q-preset]').forEach(button=>button.onclick=()=>{const presets={slow:[30,35,15,60,200,1000],base:[70,45,10,40,200,1000],scale:[110,65,5,60,200,1000]};inputs.forEach((input,i)=>input.value=presets[button.dataset.qPreset][i]);updateQuantum();});
updateQuantum();
