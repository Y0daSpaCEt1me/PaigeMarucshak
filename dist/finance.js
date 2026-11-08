// All statement values are in millions of dollars. The loan is drawn at commissioning.
const model = document.querySelector('#model-details');
const utilization = model.querySelector('#plant-use');
const price = model.querySelector('#power-price');
const money = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1});

function updateStatements() {
  const mwh = 1000 * 8760 * utilization.value / 100;
  const revenue = mwh * price.value / 1e6;
  const ebitda = revenue - 200;
  const depreciation = 6000 / 30;
  const principal = 2400 / 20;
  const interest = 2400 * .07;
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
  const figures = {revenue, ebitda, pretax, tax, income, available, retainedCash, closingCash,
    closingPlant, closingDebt, closingEquity, accumulated: -2000 + income,
    assets: closingCash + closingPlant, financing: closingDebt + closingEquity};
  for (const cell of model.querySelectorAll('[data-figure]')) {
    cell.textContent = money.format(figures[cell.dataset.figure]);
  }
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

model.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{[utilization.value,price.value]=button.dataset.scenario.split(',');updateStatements();}));
const customers=document.querySelector('#quantum-customers');
function updateQuantum(){const revenue=Number(customers.value),burn=25-revenue;document.querySelector('#quantum-customer-label').textContent=revenue;document.querySelector('#quantum-revenue').textContent=revenue.toFixed(1);document.querySelector('#quantum-cash').textContent=(revenue-25).toFixed(1);document.querySelector('#quantum-runway').textContent=burn>0?`Cash runway: ${(75/burn).toFixed(1)} years at $${burn}M annual cash use.`:burn===0?'Cash operating break-even: customer revenue matches the assumed annual cash costs.':`$${-burn}M annual cash surplus before excluded costs.`;}
customers.addEventListener('input',updateQuantum);updateQuantum();
