'use strict';
document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menu.querySelector('span').textContent=open?'−':'+';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.querySelector('span').textContent='+';}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}});
document.querySelectorAll('[data-copy-email]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.copyEmail);button.textContent='Email copied ✓';document.querySelector('#live-message').textContent='Email address copied.';setTimeout(()=>button.textContent='Copy email address',2500);}catch{button.textContent='Please select and copy the email above';document.querySelector('#live-message').textContent='Clipboard unavailable. Select the email address to copy it.';}}));

// Screenshot gallery: keep the current walkthrough image as the opening frame.
const dialog=document.querySelector('.image-dialog');let previousFocus=null;
if(dialog){
 const preview=dialog.querySelector('img'),caption=dialog.querySelector('p');
 const galleryData=document.querySelector('#walkthrough-data');
 const gallery=galleryData?JSON.parse(galleryData.textContent).map(step=>({src:'../assets/images/'+step.image+'.webp',alt:step.alt})):[];
 document.querySelectorAll('[data-lightbox] img').forEach(image=>{if(!gallery.some(item=>new URL(item.src,location.href).href===image.src))gallery.push({src:image.src,alt:image.alt});});
 let selected=0;
 const controls=document.createElement('div');controls.className='gallery-controls';
 controls.innerHTML='<button type="button" class="gallery-prev" aria-label="Previous screenshot">←</button><span class="gallery-count" aria-live="polite"></span><button type="button" class="gallery-next" aria-label="Next screenshot">→</button>';
 dialog.append(controls);
 function renderScreenshot(index){
  selected=(index+gallery.length)%gallery.length;const item=gallery[selected];
  preview.src=item.src;preview.alt=item.alt;caption.textContent=item.alt+' · synthetic demo data';
  controls.querySelector('.gallery-count').textContent=(selected+1)+' / '+gallery.length;
  controls.hidden=gallery.length<2;dialog.scrollTop=0;
 }
 document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{
  const image=button.querySelector('img');previousFocus=button;
  let index=gallery.findIndex(item=>new URL(item.src,location.href).href===image.src);
  if(index<0){gallery.push({src:image.src,alt:image.alt});index=gallery.length-1;}
  renderScreenshot(index);dialog.showModal();document.body.classList.add('preview-open');dialog.querySelector('.dialog-close').focus();
 }));
 controls.querySelector('.gallery-prev').addEventListener('click',()=>renderScreenshot(selected-1));
 controls.querySelector('.gallery-next').addEventListener('click',()=>renderScreenshot(selected+1));
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();renderScreenshot(selected+(event.key==='ArrowRight'?1:-1));}});
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('preview-open');previousFocus?.focus();});
}

const data=document.querySelector('#walkthrough-data');
if(data){
 const steps=JSON.parse(data.textContent),tabs=[...document.querySelectorAll('[data-step]')],image=document.querySelector('#walkthrough-image');let current=0;
 function show(index,focus=false){
  current=index;const step=steps[index];
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  image.src='../assets/images/'+step.image+'.webp';image.alt=step.alt;image.style.objectPosition=step.focus||'top';
  document.querySelector('#walkthrough-title').textContent=step.title;document.querySelector('#walkthrough-text').textContent=step.text;
  document.querySelector('#walkthrough-count').textContent=String(index+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0');
  document.querySelector('#walkthrough-panel').setAttribute('aria-labelledby','step-tab-'+index);
  document.querySelector('#walkthrough-prev').disabled=index===0;document.querySelector('#walkthrough-next').disabled=index===steps.length-1;
  document.querySelector('#live-message').textContent='Walkthrough step '+(index+1)+': '+step.title;
  if(focus)tabs[index].focus();
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>show(i));tab.addEventListener('keydown',e=>{let next=null;if(e.key==='ArrowRight')next=(i+1)%steps.length;if(e.key==='ArrowLeft')next=(i-1+steps.length)%steps.length;if(e.key==='Home')next=0;if(e.key==='End')next=steps.length-1;if(next!==null){e.preventDefault();show(next,true);}});});
 document.querySelector('#walkthrough-prev').addEventListener('click',()=>show(Math.max(0,current-1)));
 document.querySelector('#walkthrough-next').addEventListener('click',()=>show(Math.min(steps.length-1,current+1)));
}

// Small, progressive enhancements. Content and links work without these effects.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const spotlight=document.createElement('div');spotlight.className='cursor-spotlight';spotlight.setAttribute('aria-hidden','true');document.body.append(spotlight);
let pointerFrame=0,pointerX=0,pointerY=0,hoverCard=null;
document.addEventListener('pointermove',event=>{
 if(!finePointer.matches||reducedMotion.matches)return;
 pointerX=event.clientX;pointerY=event.clientY;hoverCard=event.target.closest('.project-card');
 if(pointerFrame)return;
 pointerFrame=requestAnimationFrame(()=>{
  spotlight.style.setProperty('--cursor-x',pointerX+'px');spotlight.style.setProperty('--cursor-y',pointerY+'px');spotlight.classList.add('is-visible');
  if(hoverCard){const bounds=hoverCard.getBoundingClientRect();hoverCard.style.setProperty('--card-x',pointerX-bounds.left+'px');hoverCard.style.setProperty('--card-y',pointerY-bounds.top+'px');}
  pointerFrame=0;
 });
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>spotlight.classList.remove('is-visible'));
window.addEventListener('blur',()=>spotlight.classList.remove('is-visible'));
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){spotlight.classList.remove('is-visible');document.querySelectorAll('.reveal').forEach(element=>element.classList.add('is-revealed'));}});
if('IntersectionObserver' in window&&!reducedMotion.matches){
 const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');reveals.unobserve(entry.target);}}),{threshold:0,rootMargin:'0px 0px -30px 0px'});
 document.querySelectorAll('.section,.case-section,.learning-entries>article').forEach(element=>{if(element.getBoundingClientRect().top>innerHeight){element.classList.add('reveal');reveals.observe(element);}});
}
const backToTop=document.createElement('button');backToTop.type='button';backToTop.className='back-to-top';backToTop.setAttribute('aria-label','Back to top');backToTop.innerHTML='<span aria-hidden="true">↑</span>';backToTop.hidden=true;document.body.append(backToTop);
backToTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});document.querySelector('.identity')?.focus({preventScroll:true});});
const sectionLinks=[...document.querySelectorAll('#site-nav a')].map(link=>{const url=new URL(link.href);return url.pathname===location.pathname||url.pathname.replace(/index\.html$/,'')===location.pathname.replace(/index\.html$/,'')?{link,section:document.querySelector(url.hash||'#no-section')}:null;}).filter(item=>item?.section).sort((a,b)=>(a.section.compareDocumentPosition(b.section)&Node.DOCUMENT_POSITION_FOLLOWING)?-1:1);
let scrollFrame=0;
function updateScrollState(){
 backToTop.hidden=window.scrollY<600;
 let current=null;sectionLinks.forEach(item=>{if(item.section.getBoundingClientRect().top<=180)current=item;});
 if(innerHeight+scrollY>=document.documentElement.scrollHeight-40&&sectionLinks.length)current=sectionLinks[sectionLinks.length-1];
 sectionLinks.forEach(item=>{item.link.classList.toggle('is-current',item===current);if(item===current)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current');});scrollFrame=0;
}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollState);},{passive:true});updateScrollState();
