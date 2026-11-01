import {scenes,fusionMilestones} from './scenes.js';
history.scrollRestoration='manual';
if(!location.hash)scrollTo(0,0);
const assets=await fetch('assets.json').then(r=>{if(!r.ok)throw Error('Image manifest unavailable');return r.json()});
const $=id=>document.getElementById(id);
const story=$('opening'),screen=story.querySelector('.screen'),layers=[$('layer-a'),$('layer-b')];
const copy=$('scene-copy'),title=$('scene-title'),desc=$('scene-description'),eyebrow=$('scene-eyebrow');
const timeline=$('timeline'),milestones=$('milestones'),resume=$('resume');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let viewport=innerHeight,currentIndex=-1,raf=0,paused=reduced.matches,particleEngine=null;
const offsets=[];let total=0;scenes.forEach(s=>{offsets.push(total);total+=s.units});
function resize(){viewport=innerHeight;story.style.height=`${(total+1)*viewport}px`;schedule();}
const loaded=new Map();
function preload(key){if(loaded.has(key))return loaded.get(key);const im=new Image();im.src=assets[key].file;const p=im.decode().catch(()=>{});loaded.set(key,p);return p;}
function renderLayer(el,s){
 if(el.dataset.asset===s.asset&&el.dataset.crop===String(s.crop??1))return;
 const a=assets[s.asset];el.replaceChildren();el.className='scene-layer '+(s.kind??'')+(s.timeline?' milestone':'');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox',`0 0 ${a.w} ${Math.floor(a.h*(s.crop??1))}`);
 svg.setAttribute('preserveAspectRatio',s.kind==='stage'||s.kind==='micro'||s.kind==='paper'||innerWidth<701?'xMidYMid meet':'xMidYMid slice');
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
function updateCopy(i){
 const s=scenes[i];title.textContent=s.title;desc.textContent=s.description;eyebrow.textContent=s.eyebrow??'';
 copy.className='scene-copy'+(s.kind==='closing'?' centered':'');
 screen.classList.toggle('is-timeline',!!s.timeline);screen.classList.toggle('is-paper',s.kind==='paper');screen.classList.toggle('is-closing',s.kind==='closing');
 $('opening-note').hidden=s.kind!=='stage';
 timeline.hidden=!s.timeline;
 if(s.timeline){
  $('timeline-company').textContent='Fusion / Technical milestones';
  const labels=fusionMilestones;
  milestones.replaceChildren(...labels.map((label,j)=>{const li=document.createElement('li');li.textContent=label;if(j===s.step){li.className='current';li.setAttribute('aria-current','step')}return li}));
 }
 document.querySelectorAll('[data-chapter]').forEach(b=>{if(+b.dataset.chapter===s.chapter)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
 $('scene-count').textContent=`${String(i+1).padStart(2,'0')} / ${scenes.length}`;
 $('previous').disabled=i===0;$('next').disabled=false;
 currentIndex=i;
 for(let j=i;j<Math.min(scenes.length,i+4);j++)preload(scenes[j].asset);
}
const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>x*x*(3-2*x);
function draw(){
 raf=0;const y=scrollY;const unit=clamp(y/(total*viewport))*total;
 let i=0;while(i<scenes.length-1&&unit>=offsets[i+1])i++;
 const local=clamp((unit-offsets[i])/scenes[i].units);
 const mix=i===scenes.length-1?0:ease(clamp((local-.58)/.42));
 const active=reduced.matches?(mix>.5?Math.min(i+1,scenes.length-1):i):(mix>.5?Math.min(i+1,scenes.length-1):i);
 renderLayer(layers[0],scenes[i]);
 if(i<scenes.length-1)renderLayer(layers[1],scenes[i+1]);
 layers[0].style.opacity=reduced.matches?(mix>.5?0:1):1;
 layers[1].style.opacity=i===scenes.length-1?0:reduced.matches?(mix>.5?1:0):mix;
 if(i===scenes.length-1){screen.style.background='transparent';layers[0].style.opacity=reduced.matches?(local>.5?0:1):1-ease(clamp((local-.15)/.7));screen.querySelector('.story-controls').style.opacity=String(1-ease(local));}
 else{screen.style.background='#000';screen.querySelector('.story-controls').style.opacity='1';}
 if(active!==currentIndex)updateCopy(active);
 const changingTitle=i<scenes.length-1&&(scenes[i].title!==scenes[i+1].title);
 const copyOpacity=reduced.matches?1:changingTitle?1-Math.sin(mix*Math.PI)*.92:1;
 copy.style.opacity=scenes[active].kind==='stage'||scenes[active].kind==='dissolve'?0:copyOpacity;
 screen.querySelector('.shade').style.opacity=['stage','dissolve','paper'].includes(scenes[active].kind)?0:scenes[active].kind==='micro'?.45:.8;
 screen.querySelector('.progress').hidden=active===scenes.length-1;
 $('progress-fill').style.transform=`scaleX(${clamp(y/(total*viewport))})`;
 document.body.classList.toggle('on-resume',resume.getBoundingClientRect().top<90);
 if(particleEngine)particleEngine.setActive(!paused&&(active===scenes.length-1||resume.getBoundingClientRect().top<innerHeight));
}
function schedule(){if(!raf)raf=requestAnimationFrame(draw)}
function go(i){if(i>=scenes.length){resume.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});return;}scrollTo({top:offsets[Math.max(0,i)]*viewport,behavior:reduced.matches?'instant':'smooth'})}
document.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>go(scenes.findIndex(s=>s.chapter===+b.dataset.chapter))));
$('previous').addEventListener('click',()=>go(currentIndex-1));$('next').addEventListener('click',()=>go(currentIndex+1));
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{layers.forEach(el=>delete el.dataset.asset);resize()});
reduced.addEventListener('change',e=>{paused=e.matches;if(particleEngine)particleEngine.setPaused(paused);schedule()});
if(window.PaigeParticles){particleEngine=window.PaigeParticles($('particle-field'));}
for(const type of ['pointermove','pointerdown','pointerleave'])resume.addEventListener(type,event=>{if(paused)return;$('particle-field').querySelector('canvas').dispatchEvent(new PointerEvent(type,{clientX:event.clientX,clientY:event.clientY}));},{passive:true});
resize();draw();
// Restore direct résumé links after the dynamic story height has been calculated.
const initialTarget=location.hash?document.getElementById(decodeURIComponent(location.hash.slice(1))):null;
if(initialTarget)requestAnimationFrame(()=>initialTarget.scrollIntoView({behavior:'instant'}));
// A readable equivalent for assistive technology, without announcing on every scroll.
const transcript=$('story-transcript');scenes.forEach(s=>{if(!s.title)return;const h=document.createElement('h2');h.textContent=s.title;const p=document.createElement('p');p.textContent=s.description;transcript.append(h,p)});
// Decode the next scenes early; keep downloads incremental on slower connections.
preload('stage');preload('quarks');
