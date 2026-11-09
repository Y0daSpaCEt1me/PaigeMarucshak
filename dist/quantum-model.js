// USD millions; a comparable-informed scenario, fictional assumptions checked against multiple public peers.
export function calculateQuantum({growth=60,margin=50,expenseGrowth=8,capex=30,sbc=60,openingCash=600}={}){
 let revenue=50,cash=openingCash,ppe=80,ar=revenue*.15;
 let equity=cash+ppe+ar,shares=100,totalFunding=0;
 const years=[];
 for(let year=1;year<=3;year++){
  const startCash=cash,scale=(1+expenseGrowth/100)**year;
  revenue*=1+growth/100;
  const cost=revenue*(1-margin/100),gross=revenue-cost;
  const rd=180*scale,sales=25*scale,admin=45*scale;
  const opex=rd+sales+admin,stock=sbc*scale,da=Math.min(15,ppe);
  const operating=gross-opex-da,tax=Math.max(0,operating*.25),income=operating-tax;
  const endAr=revenue*.15,working=endAr-ar,cfo=income+da+stock-working;
  const fcf=cfo-capex,unfundedCash=cash+fcf,funding=Math.max(0,50-unfundedCash);
  cash=unfundedCash+funding;ppe+=capex-da;ar=endAr;equity+=income+stock+funding;
  shares+=(funding+stock)/20;totalFunding+=funding;
  const assets=cash+ppe+ar;
  years.push({year,revenue,cost,gross,rd,sales,admin,opex,stock,da,operating,tax,income,working,cfo,capex,fcf,startCash,unfundedCash,funding,cash,ppe,ar,assets,equity,liabilities:0,check:assets-equity,shares,dilution:(1-100/shares)*100,totalFunding});
 }
 return years;
}
