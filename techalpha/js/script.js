// ===== TechAlpha - Common JavaScript =====
// Mobile menu toggle (chhoti screen par menu kholna/band karna)
const menuBtn=document.getElementById('menuBtn'),links=document.getElementById('navLinks');
if(menuBtn)menuBtn.addEventListener('click',()=>{const o=links.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o)});
// Footer year khud update hota hai
const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
// Stats counter (About page): numbers 0 se upar count karte hain
document.querySelectorAll('[data-count]').forEach(el=>{
  const end=+el.dataset.count;let n=0;const step=Math.max(1,Math.ceil(end/60));
  const t=setInterval(()=>{n=Math.min(end,n+step);el.textContent=n.toLocaleString()+(end===24?'':'+');if(n>=end)clearInterval(t)},25);
});
// Gallery lightbox: image par click karo to bari ho jati hai
const lb=document.getElementById('lightbox');
if(lb){document.querySelectorAll('.gallery img').forEach(i=>i.addEventListener('click',()=>{lb.querySelector('img').src=i.src;lb.classList.add('open')}));
lb.addEventListener('click',()=>lb.classList.remove('open'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});}
