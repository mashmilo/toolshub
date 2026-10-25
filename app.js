(async()=>{
const $=s=>document.querySelector(s);
// Ads from admin panel
try{const a=await (await fetch('/api/ads')).json();
document.querySelectorAll('[data-slot]').forEach(e=>{if(a[e.dataset.slot])e.append(document.createRange().createContextualFragment(a[e.dataset.slot]))});
if(a.global)document.body.append(document.createRange().createContextualFragment(a.global))}catch(e){}
// Homepage search
const q=$('#q');if(q)q.oninput=()=>{const t=q.value.toLowerCase();document.querySelectorAll('.card').forEach(c=>c.style.display=c.dataset.n.includes(t)?'':'none')};
// Tool runner
const box=$('#tool');if(!box)return;
const tool=TOOLS.find(t=>t.s===box.dataset.slug);
box.replaceChildren();
tool.i.forEach(d=>{const l=document.createElement('label');l.textContent=d.l;l.htmlFor=d.id;let e;
if(d.t==='textarea'){e=document.createElement('textarea');e.rows=8}
else if(d.t==='select'){e=document.createElement('select');d.o.forEach(o=>e.add(new Option(o,o)))}
else{e=document.createElement('input');e.type=d.t;if(d.t==='file')e.accept='image/*'}
e.id=d.id;if(d.v!==undefined&&d.t!=='file')e.value=d.v;box.append(l,e)});
const run=document.createElement('button');run.textContent='Run tool';
const copy=document.createElement('button');copy.textContent='Copy result';copy.className='alt';
const out=document.createElement('div');out.id='out';out.setAttribute('aria-live','polite');
box.append(run,copy,out);
run.onclick=async()=>{const v={};
tool.i.forEach(d=>{const e=$('#'+d.id);v[d.id]=d.t==='file'?e.files[0]:d.t==='number'?parseFloat(e.value):e.value});
out.replaceChildren();out.className='';
try{const r=await tool.f(v);if(r instanceof Node)out.append(r);else if(r&&r.html)out.innerHTML=r.html;else out.textContent=r}
catch(e){out.textContent=e.message;out.className='err'}};
copy.onclick=()=>{navigator.clipboard.writeText(out.innerText);copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy result',1500)};
})();
