// USD millions; a comparable-informed scenario, not an IonQ forecast.
export function calculateQuantum({growth=70,margin=45,expenseGrowth=10,capex=40,sbc=200,openingCash=1000}={}){
 let revenue=130.016,cash=openingCash,ppe=120.145,ar=revenue*.15;
 let equity=cash+ppe+ar,shares=100,totalFunding=0;
 const years=[];
 for(let year=1;year<=3;year++){
  const startCash=cash,scale=(1+expenseGrowth/100)**year;
  revenue*=1+growth/100;
  const cost=revenue*(1-margin/100),gross=revenue-cost;
  const rd=305.705*scale,sales=53.447*scale,admin=245.087*scale;
  const opex=rd+sales+admin,stock=sbc*scale,da=Math.min(25,ppe);
  const operating=gross-opex-da,tax=Math.max(0,operating*.25),income=operating-tax;
  const endAr=revenue*.15,working=endAr-ar,cfo=income+da+stock-working;
  const fcf=cfo-capex,unfundedCash=cash+fcf,funding=Math.max(0,100-unfundedCash);
  cash=unfundedCash+funding;ppe+=capex-da;ar=endAr;equity+=income+stock+funding;
  shares+=(funding+stock)/20;totalFunding+=funding;
  const assets=cash+ppe+ar;
  years.push({year,revenue,cost,gross,rd,sales,admin,opex,stock,da,operating,tax,income,working,cfo,capex,fcf,startCash,unfundedCash,funding,cash,ppe,ar,assets,equity,liabilities:0,check:assets-equity,shares,dilution:(1-100/shares)*100,totalFunding});
 }
 return years;
}
