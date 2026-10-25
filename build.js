// Static site generator: node build.js  ->  dist/
const fs=require('fs'),path=require('path');
const {TOOLS}=require('./public/tools.js');
const SITE=(process.env.SITE_URL||'https://yoursite.pages.dev').replace(/\/$/,'');
const NAME=process.env.SITE_NAME||'ToolsHub';
const MAIL=process.env.CONTACT_EMAIL||'contact@example.com';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const write=(p,c)=>{p=path.join('dist',p);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c)};
fs.rmSync('dist',{recursive:true,force:true});fs.cpSync('public','dist',{recursive:true});
const cats=[...new Set(TOOLS.map(t=>t.c))];
const urls=['/'];
const ad=s=>`<div class="ad" data-slot="${s}"></div>`;
const card=t=>`<a class="card" href="/tools/${t.s}/" data-n="${esc((t.n+' '+t.d+' '+t.c).toLowerCase())}"><b>${esc(t.n)}</b><span>${esc(t.d)}</span></a>`;

function page({title,desc,url,body,ld,scripts}){
urls.push(url);
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE}${url}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${url}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0b7a75"><link rel="stylesheet" href="/style.css">${ld?`<script type="application/ld+json">${JSON.stringify(ld)}</script>`:''}</head><body>
<header><div class="w"><a class="logo" href="/">${esc(NAME)}</a><nav>${cats.map(c=>`<a href="/category/${slug(c)}/">${esc(c)}</a>`).join('')}</nav></div></header>
<main class="w">${body}</main>
<footer><div class="w"><a href="/about/">About</a> · <a href="/privacy/">Privacy Policy</a> · <a href="/terms/">Terms</a> · <a href="/contact/">Contact</a><p>© ${new Date().getFullYear()} ${esc(NAME)}. Free online tools.</p></div></footer>
<script src="/tools.js"></script><script src="/app.js"></script></body></html>`}

// Home
write('index.html',page({title:`${NAME} – Free Online Tools for Everyday Work`,desc:`${TOOLS.length}+ free online tools: calculators, converters, SEO, image, text and YouTube tools. No signup, fast and mobile friendly.`,url:'/',
body:`<section class="hero"><h1>Free online tools that just work</h1><p>${TOOLS.length} tools for text, images, SEO, YouTube, money and code. No signup.</p><input id="q" type="search" placeholder="Search tools, e.g. image compressor" aria-label="Search tools"></section>${ad('top')}
${cats.map(c=>`<h2><a href="/category/${slug(c)}/">${esc(c)}</a></h2><div class="grid">${TOOLS.filter(t=>t.c===c).map(card).join('')}</div>`).join('')}${ad('bottom')}`}));
urls.shift();urls.unshift('/');

// Categories
cats.forEach(c=>write(`category/${slug(c)}/index.html`,page({title:`Free ${c} Online – ${NAME}`,desc:`Use free ${c.toLowerCase()} online. ${TOOLS.filter(t=>t.c===c).map(t=>t.n).slice(0,4).join(', ')} and more.`,url:`/category/${slug(c)}/`,
body:`<h1>${esc(c)}</h1>${ad('top')}<div class="grid">${TOOLS.filter(t=>t.c===c).map(card).join('')}</div>${ad('bottom')}`})));

// Tools
TOOLS.forEach(t=>{
const rel=TOOLS.filter(x=>x.c===t.c&&x!==t).slice(0,6);
const url=`/tools/${t.s}/`;
write(`tools/${t.s}/index.html`,page({title:`${t.n} – Free Online ${t.c.replace(/ Tools$/,'')} Tool | ${NAME}`,desc:`${t.d} Free, fast, no signup.`,url,
ld:{"@context":"https://schema.org","@type":"WebApplication",name:t.n,url:SITE+url,description:t.d,applicationCategory:"UtilitiesApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}},
body:`<nav class="crumbs"><a href="/">Home</a> / <a href="/category/${slug(t.c)}/">${esc(t.c)}</a></nav><h1>${esc(t.n)}</h1><p class="lead">${esc(t.d)}</p>${ad('top')}
<div class="box" id="tool" data-slug="${t.s}"><noscript>Please enable JavaScript to use this tool.</noscript></div>${ad('middle')}
<section class="box"><h2>About ${esc(t.n)}</h2><p>${esc(t.n)} is a free online tool. ${esc(t.d)} It runs fast on phones, tablets and computers, and you do not need an account.</p>
<h3>Is ${esc(t.n)} free?</h3><p>Yes. You can use it as many times as you like at no cost.</p>
<h3>Is my data safe?</h3><p>Text, number and image tools process your input inside your own browser. Nothing you type is saved on our servers.</p></section>
${rel.length?`<h2>Related tools</h2><div class="grid">${rel.map(card).join('')}</div>`:''}${ad('bottom')}`}))});

// Info pages
const info={about:['About',`<p>${esc(NAME)} offers free online tools for everyday tasks. Our goal is simple: fast tools that work on any device without signup.</p>`],
privacy:['Privacy Policy',`<p>We do not store the text, numbers or images you process with our browser-based tools. We may use cookies and third-party advertising partners (such as Adsterra) that collect anonymous usage data to show ads. You can disable cookies in your browser settings. Server-assisted tools (such as the YouTube playlist calculator) send only the link you enter to our server and the YouTube API. Contact us to request any data questions.</p>`],
terms:['Terms of Use',`<p>The tools are provided "as is" without warranty. Calculator results are estimates and must not be used as financial, medical or legal advice. By using this site you agree not to abuse or attack it.</p>`],
contact:['Contact',`<p>Email us at <a href="mailto:${esc(MAIL)}">${esc(MAIL)}</a>.</p>`]};
Object.entries(info).forEach(([k,[h,b]])=>write(`${k}/index.html`,page({title:`${h} – ${NAME}`,desc:`${h} for ${NAME}.`,url:`/${k}/`,body:`<h1>${h}</h1><div class="box">${b}</div>`})));

write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${SITE}${u}</loc></url>`).join('')}</urlset>`);
write('robots.txt',`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${TOOLS.length} tools, ${urls.length} pages -> dist/`);
