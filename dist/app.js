import {preparePaperSlides} from './paper.js';
import {scenes,fusionMilestones,quantumMilestones,createScenes} from './scenes.js';
history.scrollRestoration='manual';
if(!location.hash)scrollTo(0,0);
const assets=await fetch('assets.json').then(r=>{if(!r.ok)throw Error('Image manifest unavailable');return r.json()});
const $=id=>document.getElementById(id);
const story=$('opening'),screen=story.querySelector('.screen'),layers=[$('layer-a'),$('layer-b')];
const copy=$('scene-copy'),title=$('scene-title'),desc=$('scene-description'),eyebrow=$('scene-eyebrow');
const timeline=$('timeline'),milestones=$('milestones'),resume=$('resume');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let viewport=innerHeight,currentIndex=-1,raf=0,paused=reduced.matches,particleEngine=null;
const offsets=[];let total=0;function measure(){offsets.length=0;total=0;scenes.forEach(s=>{offsets.push(total);total+=s.units});}measure();
function resize(){viewport=innerHeight;story.style.height=`${(total+1)*viewport}px`;schedule();}
const loaded=new Map();
function preload(key){if(loaded.has(key))return loaded.get(key);const im=new Image();im.src=assets[key].file;const p=im.decode().catch(()=>{});loaded.set(key,p);return p;}
function renderLayer(el,s){
 if(el.dataset.asset===s.asset&&el.dataset.crop===String(s.crop??1))return;
 const a=assets[s.asset];el.replaceChildren();el.className='scene-layer '+(s.kind??'')+(s.timeline?' milestone':'');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 const imageHeight=Math.floor(a.h*(s.crop??1));
 const mobileFocus=innerWidth<701&&s.kind==='quantum-science';
 const viewWidth=mobileFocus?imageHeight*innerWidth/innerHeight:a.w;
 svg.setAttribute('viewBox',`${mobileFocus?(a.w-viewWidth)*.7:0} 0 ${viewWidth} ${imageHeight}`);
 svg.setAttribute('preserveAspectRatio',s.kind==='stage'||s.kind==='micro'?'xMidYMid meet':'xMidYMid slice');
 svg.setAttribute('aria-hidden','true');
 const image=document.createElementNS('http://www.w3.org/2000/svg','image');
 image.setAttribute('href',a.file);image.setAttribute('width',a.w);image.setAttribute('height',a.h);
 if(s.kind==='stage'){
  const ns='http://www.w3.org/2000/svg',defs=document.createElementNS(ns,'defs'),gradient=document.createElementNS(ns,'linearGradient'),mask=document.createElementNS(ns,'mask');
  const unique='stage-fade-'+el.id;
  gradient.id=unique;gradient.setAttribute('x1','0');gradient.setAttribute('x2','0');gradient.setAttribute('y1','0');gradient.setAttribute('y2','1');
  for(const [offset,color] of [['0%','white'],['81%','white'],['100%','black']]){const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color',color);gradient.append(stop)}
  mask.id=unique+'-mask';const rect=document.createElementNS(ns,'rect');rect.setAttribute('width',a.w);rect.setAttribute('height',a.h);rect.setAttribute('fill',`url(#${unique})`);mask.append(rect);defs.append(gradient,mask);svg.append(defs);image.setAttribute('mask',`url(#${unique}-mask)`);
 }
 svg.append(image);el.append(svg);el.dataset.asset=s.asset;el.dataset.crop=s.crop??1;
}
const modelDialog = $('model-details');
screen.append(modelDialog);
const quantumLedger=$('quantum-ledger');screen.append(quantumLedger);
let route=null;
let bypassChoice=!!location.hash&&location.hash!=='#opening';
document.querySelectorAll('a[href="#resume"]').forEach(a=>a.addEventListener('click',()=>{bypassChoice=true;}));
document.querySelector('a[href="#opening"]').addEventListener('click',()=>{route=null;bypassChoice=false;currentIndex=-1;});
const papers=preparePaperSlides(modelDialog,quantumLedger);
function rebuildScenes(){scenes.splice(0,scenes.length,...createScenes(route??'fusion').flatMap(s=>s.ledger?Array.from({length:papers.count(s.ledger)},(_,page)=>({...s,page,units:1})):s));measure();}
rebuildScenes();
const choice=document.createElement('div');choice.className='route-choice';choice.hidden=true;
choice.innerHTML='<p>Two paths from the same building blocks.</p><button data-route="fusion">Explore fusion →</button><button data-route="quantum">Explore quantum computing →</button>';
copy.append(choice);

choice.querySelectorAll('button').forEach(b=>b.onclick=()=>{route=b.dataset.route;rebuildScenes();currentIndex=-1;resize();updateTranscript();go(4);});
const qubit=document.createElement('div');qubit.className='qubit-control';qubit.hidden=true;qubit.innerHTML='<button type="button">Apply a half pulse</button><output>Prepared in |0⟩ · P(0) = 100%</output><small>Idealized probability demonstration</small>';copy.append(qubit);
let superposition=false;qubit.querySelector('button').onclick=()=>{superposition=!superposition;qubit.querySelector('button').textContent=superposition?'Reset to |0⟩':'Apply a half pulse';qubit.querySelector('output').textContent=superposition?'Superposition · P(0) = 50% · P(1) = 50%':'Prepared in |0⟩ · P(0) = 100%';};
function updateCopy(i){
 $('read-model').hidden = true;
 choice.hidden=!scenes[i].choice;qubit.hidden=scenes[i].interaction!=='qubit';
 modelDialog.hidden=scenes[i].ledger!=='fusion';quantumLedger.hidden=scenes[i].ledger!=='quantum';screen.classList.toggle('is-ledger',!!scenes[i].ledger);screen.classList.toggle('is-choice',!!scenes[i].choice);
 const s=scenes[i];papers.show(s.ledger,s.page??0);document.body.classList.toggle('on-paper',!!s.ledger||s.kind==='architecture');screen.classList.toggle('is-architecture',s.kind==='architecture');screen.classList.toggle('is-quantum-science',s.kind==='quantum-science');screen.classList.toggle('is-quantum-milestone',s.kind==='quantum-milestone');title.textContent=s.title;desc.textContent=s.description;eyebrow.textContent=s.eyebrow??'';
 if (s.timeline) desc.after(eyebrow);
 else title.before(eyebrow);
 copy.className='scene-copy'+(s.kind==='closing'?' centered':'');
 screen.classList.toggle('needs-contrast',s.timeline||s.kind==='closing'||s.kind==='paper');

 screen.classList.toggle('is-timeline',!!s.timeline);screen.classList.toggle('is-paper',s.kind==='paper');screen.classList.toggle('is-closing',s.kind==='closing');
 $('opening-note').hidden=s.kind!=='stage';
 timeline.hidden=!s.timeline;
 if(s.timeline){
  $('timeline-company').textContent=(s.timeline==='quantum'?'Quantum':'Fusion')+' / Investment milestones';
  const labels=s.timeline==='quantum'?quantumMilestones:fusionMilestones;
  milestones.replaceChildren(...labels.map((label,j)=>{const li=document.createElement('li');li.textContent=label;if(j===s.step){li.className='current';li.setAttribute('aria-current','step')}return li}));
 }
 document.querySelectorAll('[data-chapter]').forEach(b=>{if(+b.dataset.chapter===s.chapter)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
 $('scene-count').textContent=`${String(i+1).padStart(2,'0')} / ${scenes.length}`;
 $('previous').disabled=i===0;$('next').disabled=!!s.choice&&!route;
 currentIndex=i;
 for(let j=i;j<Math.min(scenes.length,i+4);j++)preload(scenes[j].asset);
}
// A scroll-driven band of bubbles bridges the fusion campus and the profile canvas.
const bubbleVeil = document.createElement('div');
bubbleVeil.className = 'bubble-veil';
bubbleVeil.setAttribute('aria-hidden', 'true');
for (let i = 0; i < 120; i++) {
 const bubble = document.createElement('i');
 bubble.style.left = ((i * 61.83) % 100) + '%';
 bubble.style.top = ((i * 37.17 + i * i * .13) % 100) + '%';
 bubble.style.width = (4 + (i * 17) % 19) + 'px';
 bubbleVeil.append(bubble);
}
screen.insertBefore(bubbleVeil, copy);
const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>x*x*(3-2*x);
function draw(){
 raf=0;if(!route&&!bypassChoice&&scrollY>gatePosition()){scrollTo({top:gatePosition(),behavior:'instant'});}const y=scrollY;const unit=clamp(y/(total*viewport))*total;
 let i=0;while(i<scenes.length-1&&unit>=offsets[i+1])i++;
 const local=clamp((unit-offsets[i])/scenes[i].units);
 const mix=i===scenes.length-1?0:ease(clamp((local-.58)/.42));
 const active=reduced.matches?(mix>.5?Math.min(i+1,scenes.length-1):i):(mix>.5?Math.min(i+1,scenes.length-1):i);
 renderLayer(layers[0],scenes[i]);
 if(i<scenes.length-1)renderLayer(layers[1],scenes[i+1]);
 layers[0].style.opacity=reduced.matches?(mix>.5?0:1):1;
 layers[1].style.opacity=i===scenes.length-1?0:reduced.matches?(mix>.5?1:0):mix;
 if (!reduced.matches && (scenes[i].timeline || scenes[i+1]?.timeline)) {
  layers[0].style.opacity = Math.max(0, 1 - 2 * mix);
  layers[1].style.opacity = Math.max(0, 2 * mix - 1);
 }
 const bubbleProgress = i === scenes.length-1 && !reduced.matches ? local : 0;
 bubbleVeil.style.opacity = String(Math.sin(Math.PI * bubbleProgress));
 bubbleVeil.style.transform = `translateY(${-12 * bubbleProgress}%)`;
 if(i===scenes.length-1){screen.style.background='transparent';layers[0].style.opacity=reduced.matches?(local>.5?0:1):1-ease(clamp((local-.15)/.7));screen.querySelector('.story-controls').style.opacity=String(1-ease(local));}
 else{screen.style.background='#000';screen.querySelector('.story-controls').style.opacity='1';}
 if(active!==currentIndex)updateCopy(active);
 const changingTitle=i<scenes.length-1&&(scenes[i].title!==scenes[i+1].title);
 const copyOpacity=reduced.matches?1:changingTitle?1-Math.sin(mix*Math.PI)*.92:1;
 copy.style.opacity=scenes[active].kind==='stage'||scenes[active].kind==='dissolve'?0:copyOpacity;
 screen.querySelector('.shade').style.opacity=['stage','dissolve','paper','architecture','ledger'].includes(scenes[active].kind)?0:scenes[active].kind==='micro'?.45:.8;
 screen.querySelector('.progress').hidden=active===scenes.length-1;
 $('progress-fill').style.transform=`scaleX(${clamp(y/(total*viewport))})`;
 document.body.classList.toggle('on-resume',resume.getBoundingClientRect().top<90);
 if(particleEngine)particleEngine.setActive(!paused&&(active===scenes.length-1||resume.getBoundingClientRect().top<innerHeight));
}
function schedule(){if(!raf)raf=requestAnimationFrame(draw)}
function gatePosition(){return (offsets[3]+scenes[3].units*.18)*viewport;}
function go(i){if(!route&&i>3)i=3;if(i>=scenes.length){resume.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});return;}scrollTo({top:offsets[Math.max(0,i)]*viewport,behavior:!route||reduced.matches?'instant':'smooth'})}
document.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>{if(+b.dataset.chapter===1||+b.dataset.chapter===0){route=null;bypassChoice=false;currentIndex=-1;}go(scenes.findIndex(s=>s.chapter===+b.dataset.chapter));}));
$('previous').addEventListener('click',()=>go(currentIndex-1));$('next').addEventListener('click',()=>go(currentIndex+1));
addEventListener('scroll',()=>{if(!route&&!bypassChoice&&scrollY>gatePosition())scrollTo({top:gatePosition(),behavior:'instant'});schedule();},{passive:true});
addEventListener('wheel',e=>{if(!route&&!bypassChoice&&e.deltaY>0&&scrollY+e.deltaY>gatePosition()&&scrollY<resume.offsetTop){e.preventDefault();scrollTo({top:gatePosition(),behavior:'instant'});schedule();}},{passive:false});
let touchY=0;addEventListener('touchstart',e=>{touchY=e.touches[0].clientY;},{passive:true});
addEventListener('touchmove',e=>{const delta=touchY-e.touches[0].clientY;if(!route&&!bypassChoice&&delta>0&&scrollY+delta>gatePosition()&&scrollY<resume.offsetTop){e.preventDefault();scrollTo({top:gatePosition(),behavior:'instant'});schedule();}touchY=e.touches[0].clientY;},{passive:false});
addEventListener('keydown',e=>{if(!route&&!bypassChoice&&['PageDown','End','ArrowDown',' '].includes(e.key)&&!['BUTTON','INPUT','A'].includes(document.activeElement.tagName)&&scrollY<resume.offsetTop){if(e.key==='End'||scrollY+viewport>gatePosition()){e.preventDefault();scrollTo({top:gatePosition(),behavior:'instant'});schedule();}}});
addEventListener('resize',()=>{const old=scenes[Math.max(0,currentIndex)];layers.forEach(el=>delete el.dataset.asset);papers.paginate();rebuildScenes();resize();const index=scenes.findIndex(s=>s.asset===old.asset&&s.title===old.title&&(!s.ledger||s.page===Math.min(old.page,papers.count(s.ledger)-1)));currentIndex=-1;go(Math.max(0,index))});
reduced.addEventListener('change',e=>{paused=e.matches;if(particleEngine)particleEngine.setPaused(paused);schedule()});
if(window.PaigeParticles){particleEngine=window.PaigeParticles($('particle-field'));}
for(const type of ['pointermove','pointerdown','pointerleave'])resume.addEventListener(type,event=>{if(paused)return;$('particle-field').querySelector('canvas').dispatchEvent(new PointerEvent(type,{clientX:event.clientX,clientY:event.clientY}));},{passive:true});
resize();draw();
// Restore direct résumé links after the dynamic story height has been calculated.
const initialTarget=location.hash?document.getElementById(decodeURIComponent(location.hash.slice(1))):null;
if(initialTarget)requestAnimationFrame(()=>initialTarget.scrollIntoView({behavior:'instant'}));
// A readable equivalent for assistive technology, without announcing on every scroll.
function updateTranscript(){const transcript=$('story-transcript');transcript.replaceChildren();scenes.forEach(s=>{if(!s.title)return;const h=document.createElement('h2');h.textContent=s.title;const p=document.createElement('p');p.textContent=s.description;transcript.append(h,p)});}updateTranscript();
// Decode the next scenes early; keep downloads incremental on slower connections.
preload('stage');preload('quarks');
