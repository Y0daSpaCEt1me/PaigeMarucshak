// Each science beat is one full-frame cinematic image. Captions live in scene-copy.
export function createStoryVisual(scene,assets) {
 const root=document.createElement('div');
 root.className=`story-visual visual-${scene.visual}`;
 root.setAttribute('aria-hidden','true');
 const art=document.createElement('img');
 art.className='story-art';art.src=assets[scene.asset].file;art.alt='';
 root.append(art);
 return root;
}

export function updateQubitVisual(layer,value,assets) {
 const art=layer.querySelector('.visual-pulse .story-art');
 if(!art)return;
 const key=value?'qubit-superposition-v1':'qubit-states-v1';
 if(art.dataset.state===key)return;
 art.src=assets[key].file;art.dataset.state=key;
}

export function advanceStoryVisual(layer,scene,progress,reduced) {
 if(!scene?.visual)return;
 const root=layer.querySelector('.story-visual');if(!root)return;
 const p=Math.max(0,Math.min(1,progress/.44));
 root.style.setProperty('--camera',reduced||['states','pulse'].includes(scene.visual)?1:scene.visual==='plant'?1.12-.12*p:1.035-.035*p);
}
