// Paginate real HTML onto full-screen sheets; never nest a scrolling document.
// Keep original controls and table cells so finance.js retains its live bindings.
export function preparePaperSlides(fusion,quantum){
 const models={fusion,quantum};
 const sources=new Map(Object.values(models).map(root=>[root,[...root.children]]));
 const tableRows=new Map();
 for(const root of Object.values(models))for(const table of root.querySelectorAll('table'))tableRows.set(table,[...table.tBodies[0].rows]);
 const pages={fusion:[],quantum:[]};
 function paginate(){
  for(const [name,root] of Object.entries(models)){
   if(sources.get(root).every(node=>node.classList.contains('workbook-sheet'))){
    const sheets=sources.get(root);root.replaceChildren(...sheets);pages[name]=sheets;
    sheets.forEach((sheet,i)=>{sheet.classList.add('paper-page');if(!sheet.querySelector('.paper-folio')){const footer=document.createElement('p');footer.className='paper-folio';footer.textContent=`${i+1} / ${sheets.length} · Scroll to continue`;sheet.append(footer);}sheet.hidden=true;});
    root.hidden=true;continue;
   }
   for(const node of sources.get(root))if(tableRows.has(node))node.tBodies[0].replaceChildren(...tableRows.get(node));
   root.replaceChildren();root.hidden=false;root.style.visibility='hidden';pages[name]=[];
   let page,content;
   const newPage=()=>{
    if(page)page.hidden=true;
    page=document.createElement('div');page.className='paper-page';
    const running=document.createElement('p');running.className='paper-running';running.textContent=`${name==='fusion'?'Fusion power':'Trapped-ion computing'} / Financial plan / Illustrative USD`;
    content=document.createElement('div');content.className='paper-content';page.append(running,content);root.append(page);pages[name].push(page);
   };
   newPage();
   const fits=()=>content.scrollHeight<=content.clientHeight+1;
   const add=node=>{content.append(node);if(!fits()&&content.children.length>1){node.remove();newPage();content.append(node);}};
   const nodes=sources.get(root);
   for(let index=0;index<nodes.length;index++){
    const node=nodes[index];if(node.classList.contains('ledger-kicker'))continue;
    if(tableRows.has(node)){
     let fragment;
     const makeTable=()=>{fragment=node.cloneNode(false);if(node.caption)fragment.append(node.caption.cloneNode(true));if(node.tHead)fragment.append(node.tHead.cloneNode(true));fragment.append(document.createElement('tbody'));content.append(fragment);};
     makeTable();
     for(const row of tableRows.get(node)){
      fragment.tBodies[0].append(row);
      if(!fits()){
       row.remove();if(!fragment.tBodies[0].rows.length)fragment.remove();newPage();makeTable();fragment.tBodies[0].append(row);
      }
     }
    }else if(node.tagName==='H3'&&nodes[index+1]?.tagName==='P'){
     const group=document.createElement('section');group.className='paper-section';group.append(node,nodes[++index]);add(group);
    }else add(node);
   }
   pages[name].forEach((sheet,i)=>{const footer=document.createElement('p');footer.className='paper-folio';footer.textContent=`${String(i+1).padStart(2,'0')} / ${String(pages[name].length).padStart(2,'0')}   ·   Scroll or use the arrows to continue`;sheet.append(footer);sheet.hidden=true;});
   root.hidden=true;root.style.visibility='';
  }
 }
 paginate();
 return {paginate,count:name=>pages[name].length,show:(name,index)=>{for(const [key,sheets] of Object.entries(pages))sheets.forEach((sheet,i)=>sheet.hidden=key!==name||i!==index);}};
}
