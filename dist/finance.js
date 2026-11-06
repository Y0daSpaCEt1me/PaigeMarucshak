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
