'use strict';
document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menu.querySelector('span').textContent=open?'−':'+';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.querySelector('span').textContent='+';}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}});
document.querySelectorAll('[data-copy-email]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.copyEmail);button.textContent='Email copied ✓';document.querySelector('#live-message').textContent='Email address copied.';setTimeout(()=>button.textContent='Copy email address',2500);}catch{button.textContent='Please select and copy the email above';document.querySelector('#live-message').textContent='Clipboard unavailable. Select the email address to copy it.';}}));

const dialog=document.querySelector('.image-dialog');let previousFocus=null;
document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{const image=button.querySelector('img');previousFocus=button;dialog.querySelector('img').src=image.src;dialog.querySelector('img').alt=image.alt;dialog.querySelector('p').textContent=image.alt+' · synthetic demo data';dialog.showModal();dialog.querySelector('.dialog-close').focus();}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>previousFocus?.focus());

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
