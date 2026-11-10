#!/usr/bin/env python3
"""Compose the 5 Kaizen landing pages from a shared scrub engine + per-page art direction.
Each page folder is fully self-contained (frames/, logo.webp, poster.jpg, index.html).
"""
import os

ROOT = os.path.expanduser("~/workspace/kaizen/landing-pages")
FRAMES = 72

TOKENS = """
:root{
  --p50:#FAF9F5;--p100:#F4F1E7;--p200:#EFE5C8;--p300:#EBD798;--p400:#E1C365;--p500:#C9A227;
  --p600:#B39123;--p700:#91751C;--p800:#735D16;--p900:#524519;--p950:#342E18;
  --n50:#FAFAFA;--n100:#F3F3F1;--n200:#E7E6E4;--n300:#D4D3CE;--n400:#A9A69E;--n500:#8C887D;
  --n600:#726E65;--n700:#59574F;--n800:#413F3A;--n900:#2B2A26;--n950:#1B1A18;
  --bg:#050507;--panel:rgba(20,20,26,.66);--line:rgba(235,215,152,.16);
  --ease-out:cubic-bezier(.16,1,.3,1);--ease-in-out:cubic-bezier(.65,0,.35,1);
  --r-sm:.25rem;--r-md:.5rem;--r-lg:.75rem;--r-xl:1rem;
  --sh-lg:0 10px 15px -3px rgba(0,0,0,.45),0 4px 6px -4px rgba(0,0,0,.4);
  --font:"Zen Kaku Gothic New","Segoe UI",system-ui,-apple-system,Roboto,"Helvetica Neue",Arial,sans-serif;
  --font-display:"Fuji Fantastic","Yuji Syuku","Zen Kaku Gothic New",serif;
}
"""

BASE_CSS = TOKENS + """
@font-face{font-family:"Fuji Fantastic";src:url("fuji-fantastic.otf") format("opentype");font-weight:700;font-style:normal;font-display:swap}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;color-scheme:dark;scrollbar-width:thin;scrollbar-color:var(--p700) #0a0a0d}
body{background:var(--bg);color:var(--n100);font-family:var(--font);line-height:1.6;
  -webkit-font-smoothing:antialiased;overflow-x:hidden}
::selection{background:var(--p500);color:#0a0a0c}
::-webkit-scrollbar{width:9px}
::-webkit-scrollbar-track{background:#0a0a0d}
::-webkit-scrollbar-thumb{background:linear-gradient(180deg,var(--p500),var(--p800));border-radius:99px;border:2px solid #0a0a0d}
::-webkit-scrollbar-thumb:hover{background:var(--p400)}
.skip{position:absolute;left:-999px;top:0;background:var(--p500);color:#0a0a0c;padding:.6rem 1rem;z-index:60;border-radius:0 0 var(--r-md) 0;font-weight:600}
.skip:focus{left:0}
a{color:var(--p300)}
a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid var(--p400);outline-offset:3px;border-radius:4px}
h1,h2,h3{font-family:var(--font-display);font-weight:700;line-height:1.12;text-wrap:balance;letter-spacing:.01em}
.wrap{width:min(1120px,92vw);margin-inline:auto}
/* header */
.hdr{position:fixed;inset:0 0 auto 0;z-index:50;transition:background-color .35s var(--ease-out),border-color .35s var(--ease-out);border-bottom:1px solid transparent}
.hdr.scrolled{background:rgba(5,5,8,.78);backdrop-filter:blur(14px);border-color:var(--line)}
.hdr-in{display:flex;align-items:center;gap:1.4rem;padding:.85rem 0}
.brand{display:flex;align-items:center;gap:.6rem;text-decoration:none;color:var(--n50);font-weight:700;letter-spacing:.24em;font-size:.86rem}
.brand img{border-radius:8px}
.nav{display:flex;gap:1.3rem;margin-left:auto}
.nav a{color:var(--n300);text-decoration:none;font-size:.9rem;transition:color .2s var(--ease-out)}
.nav a:hover{color:var(--p300)}
.socials{display:flex;gap:.55rem;margin-left:1.2rem}
.socials a{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--line);border-radius:50%;color:var(--n200);transition:color .2s var(--ease-out),border-color .2s var(--ease-out),transform .2s var(--ease-out)}
.socials a:hover{color:var(--p300);border-color:var(--p500);transform:translateY(-2px)}
@media (max-width:760px){.nav{display:none}.socials{margin-left:auto}}
/* scrub stage */
.scrub{position:relative;height:440vh}
.stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
.stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.stage .veil{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 42%,transparent 40%,rgba(3,3,5,.55) 100%)}
.poster{display:none;width:100%;height:100%;object-fit:cover}
.act{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 6vw;opacity:0;pointer-events:none;will-change:opacity,transform}
.act.on{pointer-events:auto}
.kicker{letter-spacing:.34em;font-size:.78rem;font-weight:700;color:var(--p400);text-transform:uppercase;margin-bottom:1.1rem}
.act h1,.act h2{font-size:clamp(2.3rem,6.4vw,4.6rem);font-weight:700;color:var(--n50);max-width:15ch}
.act p{margin-top:1.1rem;font-size:clamp(1rem,2vw,1.3rem);color:var(--n200);max-width:52ch}
.act .cta{margin-top:2rem}
.btn{display:inline-block;background:var(--p500);color:#0b0b0d;font-weight:700;text-decoration:none;padding:.9rem 1.7rem;border-radius:999px;border:0;cursor:pointer;font-size:1rem;transition:background-color .2s var(--ease-out),transform .2s var(--ease-out)}
.btn:hover{background:var(--p400);transform:translateY(-2px)}
.btn.ghost{background:transparent;color:var(--p300);border:1px solid var(--p700)}
.btn.ghost:hover{border-color:var(--p400);color:var(--p200)}

/* sections */
section.block{padding:7rem 0;scroll-margin-top:84px}
.eyebrow{letter-spacing:.3em;font-size:.75rem;font-weight:700;color:var(--p400);text-transform:uppercase}
.block h2{font-size:clamp(1.9rem,4.4vw,3rem);color:var(--n50);margin:.7rem 0 1rem;max-width:22ch}
.lede{font-size:1.15rem;color:var(--n300);max-width:62ch}
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s var(--ease-out),transform .7s var(--ease-out)}
.rv.in{opacity:1;transform:none}
.grid{display:grid;gap:1.2rem;margin-top:3rem}
.grid.c3{grid-template-columns:repeat(3,1fr)}
.grid.c2{grid-template-columns:repeat(2,1fr)}
@media (max-width:860px){.grid.c3,.grid.c2{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r-xl);padding:1.7rem;backdrop-filter:blur(10px)}
.card h3{color:var(--n50);font-size:1.12rem;margin-bottom:.5rem}
.card p{color:var(--n300);font-size:.97rem}
.card .ic{font-size:1.5rem;display:block;margin-bottom:.8rem}
/* answer mock */
.mock{background:rgba(10,10,14,.82);border:1px solid var(--line);border-radius:var(--r-xl);box-shadow:var(--sh-lg);padding:1.8rem;margin-top:3rem}
.mock .q{font-size:1.05rem;color:var(--n100)}
.mock .q b{color:var(--p300)}
.mock h4{letter-spacing:.22em;font-size:.72rem;color:var(--p400);text-transform:uppercase;margin:1.4rem 0 .5rem}
.mock p,.mock ul li{color:var(--n200);font-size:.98rem}
.mock ul{list-style:none}
.mock ul li{padding:.34rem 0 .34rem 1.5rem;position:relative}
.mock ul li::before{content:"";position:absolute;left:0;top:.72em;width:.55rem;height:.55rem;border-radius:2px}
.mock ul li.pro::before{background:#7BC47F}
.mock ul li.con::before{background:#E0655F}
.mock ul li.step::before{background:var(--p400);border-radius:50%}
.mock .cols{display:grid;grid-template-columns:1fr 1fr;gap:0 2.4rem}
@media (max-width:760px){.mock .cols{grid-template-columns:1fr}}
/* quote */
.quote{padding:6rem 0;text-align:center}
.quote blockquote{font-family:"Fuji Fantastic","Yuji Syuku",Georgia,serif;font-size:clamp(1.5rem,3.6vw,2.4rem);color:var(--n50);max-width:26ch;margin-inline:auto;line-height:1.35;text-wrap:balance}
.quote cite{display:block;margin-top:1.2rem;font-style:normal;color:var(--n400);letter-spacing:.14em;font-size:.82rem;text-transform:uppercase}
/* waitlist */
.wl-box{background:linear-gradient(160deg,rgba(201,162,39,.12),rgba(20,20,26,.7) 55%);border:1px solid var(--line);border-radius:var(--r-xl);padding:2.6rem;text-align:center}
.wl-box h2{margin-inline:auto}
.wl{display:flex;gap:.7rem;justify-content:center;margin-top:2rem;flex-wrap:wrap}
.wl label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.wl input{background:rgba(5,5,8,.8);border:1px solid var(--n700);color:var(--n50);border-radius:999px;padding:.9rem 1.3rem;font-size:1rem;min-width:min(340px,80vw);font-family:var(--font)}
.wl input::placeholder{color:var(--n500)}
.wl-msg{margin-top:1rem;color:var(--p300);min-height:1.5em;font-size:.95rem}
/* footer */
footer{border-top:1px solid var(--line);padding:3rem 0 3.4rem;color:var(--n400);font-size:.92rem}
.ftr{display:flex;flex-wrap:wrap;gap:1.4rem;align-items:center;justify-content:space-between}
.ftr .socials{margin-left:0}
/* layout variants */
.v-split .act{align-items:flex-start;text-align:left;padding-left:8vw}
.v-split .act h1,.v-split .act h2{max-width:13ch}
.v-split .act p{max-width:44ch}
.v-story .act{align-items:flex-start;text-align:left;padding-left:8vw;justify-content:flex-end;padding-bottom:16vh}
.v-zen .act h1{font-family:"Fuji Fantastic","Yuji Syuku",cursive;font-weight:700;letter-spacing:.04em;font-size:clamp(3.2rem,10vw,7.2rem);color:var(--n50)}
.principles{list-style:none;margin-top:2.6rem}
.principles li{display:flex;gap:1.4rem;padding:1.3rem 0;border-bottom:1px solid var(--line);align-items:baseline}
.principles .n{font-family:"Yuji Syuku",Georgia,serif;color:var(--p400);font-size:1.3rem;min-width:2.2rem}
.principles h3{color:var(--n50);font-size:1.15rem}
.principles p{color:var(--n300)}
.route{list-style:none;margin-top:2.4rem;counter-reset:step}
.route li{display:flex;gap:1.1rem;padding:1.05rem 0;border-bottom:1px solid var(--line);color:var(--n200)}
.route li::before{counter-increment:step;content:counter(step);display:grid;place-items:center;flex:none;width:30px;height:30px;border-radius:50%;border:1px solid var(--p600);color:var(--p300);font-size:.85rem;font-weight:700}
.route li.done{color:var(--n400)}
.route li.done::before{background:var(--p500);color:#0b0b0d;border-color:var(--p500)}
/* reduced motion */
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  .scrub{height:auto}
  .stage{position:static;height:auto;overflow:visible}
  .stage canvas,.stage .veil{display:none}
  .poster{display:block;height:52vh}
  .act{position:static;opacity:1;pointer-events:auto;padding:3.2rem 6vw;transform:none}
  .rv{opacity:1;transform:none;transition:none}
  .btn,.socials a,.nav a{transition:none}
}
"""

ENGINE_JS = """
(function(){
  "use strict";
  var N=%d, pad=function(n){return ("00"+n).slice(-3);};
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* header state */
  var hdr=document.querySelector(".hdr");
  /* reveals */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.16});
  document.querySelectorAll(".rv").forEach(function(el){io.observe(el);});
  /* waitlist (front-end demo state until launch wiring) */
  var form=document.querySelector(".wl");
  if(form){form.addEventListener("submit",function(ev){ev.preventDefault();
    var input=form.querySelector("input[type=email]"),btn=form.querySelector("button"),msg=form.querySelector(".wl-msg");
    var ok=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input.value.trim());
    if(!ok){msg.textContent="That email looks incomplete — check it and try again.";input.focus();return;}
    btn.disabled=true;btn.textContent="Joining…";
    setTimeout(function(){msg.textContent="You are on the list. First invites go out at launch — watch your inbox.";input.disabled=true;btn.textContent="You are in";},650);
  });}
  window.addEventListener("scroll",function(){hdr.classList.toggle("scrolled",window.scrollY>40);},{passive:true});
  if(reduced){return;}
  /* scroll-scrubbed frame sequence */
  var section=document.querySelector(".scrub"),canvas=document.getElementById("seq"),ctx=canvas.getContext("2d");
  var bar=document.querySelector(".progress i");
  var frames=new Array(N),loaded=0,cur=0,target=0,lastDrawn=-1;
  for(var i=0;i<N;i++){var im=new Image();im.src="frames/f"+pad(i)+".webp";im.onload=function(){loaded++;};frames[i]=im;}
  function size(){var d=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.floor(innerWidth*d);canvas.height=Math.floor(innerHeight*d);}
  size();window.addEventListener("resize",size);
  function draw(idx){
    var img=frames[idx];if(!img||!img.complete||!img.naturalWidth){return;}
    var cw=canvas.width,ch=canvas.height,s=Math.max(cw/img.naturalWidth,ch/img.naturalHeight);
    var w=img.naturalWidth*s,h=img.naturalHeight*s;
    ctx.drawImage(img,(cw-w)/2,(ch-h)/2,w,h);lastDrawn=idx;
  }
  var acts=Array.prototype.map.call(document.querySelectorAll(".act"),function(el){
    return {el:el,from:parseFloat(el.dataset.from),to:parseFloat(el.dataset.to)};
  });
  function frame(){
    var r=section.getBoundingClientRect();
    var total=section.offsetHeight-window.innerHeight;
    var p=Math.min(1,Math.max(0,-r.top/Math.max(total,1)));
    target=p*(N-1);cur+=(target-cur)*0.14;
    var idx=Math.round(cur);
    if(idx!==lastDrawn){draw(idx);}
    if(bar){bar.style.width=(p*100)+"%";}
    acts.forEach(function(a){
      var o=0,y=26;
      if(p>=a.from&&p<=a.to){
        var fade=0.07,lp=(p-a.from),rp=(a.to-p);
        o=Math.min(1,lp/fade,rp/fade);o=Math.max(0,o);
        var mid=(a.from+a.to)/2,span=(a.to-a.from)/2||1;
        y=(1-Math.min(1,Math.abs(p-mid)/span))*0+ (p<a.from+span? (1-lp/span)*26 : (1-rp/span)*-26);
      }
      a.el.style.opacity=o.toFixed(3);
      a.el.style.transform="translateY("+y.toFixed(1)+"px)";
      a.el.classList.toggle("on",o>0.6);
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
"""

SOCIALS = [
    ("X (Twitter)", "https://x.com/kaizenbrowser",
     '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.5 22H3.4l7.3-8.3L1.5 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7 3.9H5.2L17.8 20z"/></svg>'),
    ("Instagram", "https://www.instagram.com/kaizenbrowser",
     '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.25" fill="currentColor" stroke="none"/></svg>'),
    ("YouTube", "https://www.youtube.com/@kaizenbrowser",
     '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 0 0 1 7.2 31.3 31.3 0 0 0 .5 12 31.3 31.3 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 23.5 12 31.3 31.3 0 0 0 23 7.2zM9.8 15.5v-7l6 3.5-6 3.5z"/></svg>'),
    ("Reddit", "https://www.reddit.com/user/kaizenbrowser",
     '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.1 12.3a3.9 3.9 0 0 1-2 3.4 10.6 10.6 0 0 1-6.2 0 3.9 3.9 0 0 1-2-3.4.9.9 0 0 1 .9-1 1 1 0 0 1 .5.6 8.3 8.3 0 0 0 3.5.8l.7-3.3a.4.4 0 0 1 .3-.3l2.4-.5a1.2 1.2 0 1 1 .2.5l-2.2.5-.6 2.9a8.5 8.5 0 0 0 3.6-.8 1 1 0 0 1 .5-.6.9.9 0 0 1 .9.9zM8.9 12.4a1.4 1.4 0 1 1-1.4 1.4 1.4 1.4 0 0 1 1.4-1.4zm6.3 2.9a3.4 3.4 0 0 1-3.2 1.2 3.4 3.4 0 0 1-3.2-1.2.3.3 0 0 1 .4-.4 4.2 4.2 0 0 0 2.8.9 4.2 4.2 0 0 0 2.8-.9.3.3 0 1 1 .4.4zm-.1-2.9a1.4 1.4 0 1 1-1.4 1.4 1.4 1.4 0 0 1 1.4-1.4z"/></svg>'),
    ("Indie Hackers", "https://www.indiehackers.com/kaizenbrowser",
     '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="9.5" font-weight="700" font-family="Arial,sans-serif">IH</text></svg>'),
]

def socials_html():
    return "".join(
        f'<a href="{url}" target="_blank" rel="noopener" aria-label="Kaizen on {name}">{svg}</a>'
        for name, url, svg in SOCIALS)

DISPLAY_CSS = """
.act .display{font-family:var(--font-display);font-size:clamp(2.3rem,6.4vw,4.6rem);font-weight:700;color:var(--n50);max-width:15ch;line-height:1.12;letter-spacing:.01em}
.v-split .act .display{max-width:13ch}
"""

def header(nav):
    links = "".join(f'<a href="{href}">{label}</a>' for label, href in nav)
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="wrap hdr-in">
<a class="brand" href="#top" aria-label="Kaizen home"><img src="logo.webp" alt="" width="34" height="34">KAIZEN</a>
<nav class="nav" aria-label="Page">{links}</nav>
<div class="socials">{socials_html()}</div>
</div></header>"""

def acts_html(acts):
    out = []
    for i, (frm, to, inner) in enumerate(acts):
        if i == 0:
            frm = -0.08  # first act fully visible at the very top, before any scroll
        if i == len(acts) - 1:
            to = 1.08  # last act stays visible through the end of the scrub
        out.append(f'<div class="act" data-from="{frm}" data-to="{to}">{inner}</div>')
    return "\n".join(out)

def scrub_section(acts, label):
    return f"""<section class="scrub" id="top" aria-label="Kaizen introduction">
<div class="stage">
<canvas id="seq" role="img" aria-label="{label}"></canvas>
<img class="poster" src="poster.jpg" alt="" width="960" height="540">
<div class="veil" aria-hidden="true"></div>
{acts_html(acts)}
</div></section>"""

def waitlist(heading, sub):
    return f"""<section class="block" id="waitlist"><div class="wrap">
<div class="wl-box rv">
<p class="eyebrow">Launching soon</p>
<h2>{heading}</h2>
<p class="lede" style="margin-inline:auto">{sub}</p>
<form class="wl" novalidate>
<label for="wl-email">Email address</label>
<input id="wl-email" type="email" name="email" autocomplete="email" spellcheck="false" placeholder="you@company.com…" required>
<button class="btn" type="submit">Join the Waitlist</button>
<p class="wl-msg" aria-live="polite"></p>
</form>
<p style="margin-top:1rem;color:var(--n500);font-size:.85rem">One email at launch. No spam, no noise — that is the whole brand.</p>
</div></div></section>"""

def footer():
    return f"""<footer><div class="wrap ftr">
<div><strong style="color:var(--n100);letter-spacing:.2em">KAIZEN</strong><br>
The browser for entrepreneurs. Building in public, from India.</div>
<div class="socials">{socials_html()}</div>
<div>© 2026 Kaizen · 1% better, every day.</div>
</div></footer>"""

def page(cfg):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{cfg['title']}</title>
<meta name="description" content="{cfg['desc']}">
<meta name="theme-color" content="#050507">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Yuji+Syuku&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>{BASE_CSS}{DISPLAY_CSS}{cfg.get('css','')}</style>
</head>
<body class="{cfg['variant']}">
{header(cfg['nav'])}
<main id="main">
{scrub_section(cfg['acts'], cfg['canvas_label'])}
{cfg['sections']}
{waitlist(cfg['wl_h'], cfg['wl_sub'])}
</main>
{footer()}
<script>{ENGINE_JS.replace('N=%d', 'N=' + str(FRAMES))}</script>
</body>
</html>"""

# ---------------------------------------------------------------- page 1: climb
P1_SECTIONS = """
<section class="block" id="problem"><div class="wrap">
<p class="eyebrow rv">The problem</p>
<h2 class="rv">Founders don't drown in work. They drown in tabs.</h2>
<p class="lede rv">Every question your business asks — pricing, tools, hiring, taxes — turns into ten links, forty minutes, and a headache. The work was never the hard part. Finding the next step was.</p>
</div></section>
<section class="block" id="how" style="padding-top:0"><div class="wrap">
<p class="eyebrow rv">How Kaizen answers</p>
<h2 class="rv">One search. One answer. One next step.</h2>
<div class="mock rv">
<p class="q">You searched: <b>“best way to price my design work?”</b></p>
<h4>The answer</h4>
<p>Price on value, not hours. Anchor with three tiers — a safe option, your target, and a premium stretch — and let the client choose, instead of negotiating you down from one lonely number.</p>
<div class="cols"><div>
<h4>Pros — value pricing</h4>
<ul><li class="pro">Income stops depending on your hours</li><li class="pro">Premium tier makes the middle feel safe</li></ul>
</div><div>
<h4>Cons — watch out</h4>
<ul><li class="con">Needs a portfolio that proves the value</li><li class="con">Scope must be written down, tightly</li></ul>
</div></div>
<h4>Your next step</h4>
<ul><li class="step">Rewrite one current quote as three tiers — today, before anything else</li><li class="step">Send it to your next enquiry, unchanged</li><li class="step">Note what they pick; that is your market talking</li></ul>
</div>
</div></section>
<section class="quote"><div class="wrap rv">
<blockquote>You do not rise to the level of your goals. You fall to the level of your systems.</blockquote>
<cite>James Clear — Atomic Habits</cite>
</div></section>
<section class="block" id="features" style="padding-top:0"><div class="wrap">
<p class="eyebrow rv">Inside Kaizen</p>
<h2 class="rv">Built for how founders actually work.</h2>
<div class="grid c3">
<div class="card rv"><span class="ic" aria-hidden="true">◎</span><h3>The Answer, Not Homework</h3><p>Beside every result: what it gives you, what it costs you, and the exact click-by-click steps to get the task done.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">♫</span><h3>Mood Aware Music</h3><p>Deep work, admin grind, or the 1 AM slump — Kaizen reads the moment and plays what the work needs.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">✦</span><h3>A Voice That Pushes Back</h3><p>Talk to it hands-free. And when the spiral starts, it drops the line you needed to hear and gets you moving.</p></div>
</div></div></section>
"""

# ---------------------------------------------------------------- page 2: glass
P2_CSS = """
.browser{background:rgba(12,12,17,.9);border:1px solid var(--line);border-radius:var(--r-xl);box-shadow:var(--sh-lg);margin-top:3rem;overflow:hidden}
.b-bar{display:flex;align-items:center;gap:.5rem;padding:.8rem 1.1rem;border-bottom:1px solid var(--line)}
.dot{width:11px;height:11px;border-radius:50%}
.b-url{margin-left:.8rem;flex:1;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:999px;padding:.42rem 1rem;color:var(--n300);font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.result{padding:1.25rem 1.4rem;border-bottom:1px solid rgba(235,215,152,.08)}
.result:last-child{border-bottom:0}
.result h3{color:var(--n50);font-size:1.05rem}
.result p{color:var(--n400);font-size:.9rem;margin:.25rem 0 .4rem}
.chip{display:inline-block;padding:.14rem .55rem;border-radius:999px;font-size:.74rem;margin:.15rem .25rem 0 0;font-weight:600}
.chip.pro{background:rgba(123,196,127,.13);color:#9CD3A0;border:1px solid rgba(123,196,127,.35)}
.chip.con{background:rgba(224,101,95,.11);color:#F0A19C;border:1px solid rgba(224,101,95,.35)}
.chip.step{background:rgba(201,162,39,.13);color:var(--p300);border:1px solid rgba(201,162,39,.4)}
"""
P2_SECTIONS = """
<section class="block" id="how"><div class="wrap">
<p class="eyebrow rv">Seen clearly</p>
<h2 class="rv">Every result, with its price tag showing.</h2>
<p class="lede rv">Kaizen sits on top of the search you already trust and reads each result like a cofounder would — what you gain, what it costs, and whether it deserves your next hour.</p>
<div class="browser rv" role="img" aria-label="Preview of Kaizen search results with pros, cons, and next steps beside each result">
<div class="b-bar"><span class="dot" style="background:#E0655F"></span><span class="dot" style="background:#E8C15A"></span><span class="dot" style="background:#7BC47F"></span><span class="b-url">kaizen — best CRM for a two-person startup</span></div>
<div class="result"><h3>The lightweight CRM founders actually keep using</h3><p>Simple pipelines, no admin swamp. Set up in an afternoon.</p><span class="chip pro">Pro · free tier is enough</span><span class="chip pro">Pro · 1-hour setup</span><span class="chip con">Con · weak reporting</span><span class="chip step">Next step · start the free trial</span></div>
<div class="result"><h3>The enterprise CRM everyone recommends</h3><p>Powerful, endless, and built for teams of two hundred.</p><span class="chip pro">Pro · scales forever</span><span class="chip con">Con · weeks of setup</span><span class="chip con">Con · priced per seat</span><span class="chip step">Next step · skip for now</span></div>
<div class="result"><h3>The spreadsheet plus automation route</h3><p>Your current sheet, upgraded with forms and reminders.</p><span class="chip pro">Pro · costs nothing</span><span class="chip pro">Pro · zero learning curve</span><span class="chip con">Con · breaks past ~200 clients</span><span class="chip step">Next step · copy the template</span></div>
</div>
</div></section>
<section class="quote"><div class="wrap rv">
<blockquote>Ten blue links is not an answer.</blockquote>
<cite>The Kaizen rule</cite>
</div></section>
<section class="block" id="features" style="padding-top:0"><div class="wrap">
<p class="eyebrow rv">Why glass</p>
<h2 class="rv">Nothing hidden. Nothing padded.</h2>
<div class="grid c3">
<div class="card rv"><span class="ic" aria-hidden="true">◇</span><h3>Clarity by Default</h3><p>Pros, cons, and costs beside every result — the full picture before you spend a single click.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">⬡</span><h3>Chromium Underneath</h3><p>The engine the whole web is built for, with Kaizen’s layer of judgement on top. Every site just works.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">→</span><h3>The Next Step, Visible</h3><p>Each answer ends in one doable action. Momentum is a design choice, and we chose it.</p></div>
</div></div></section>
"""

# ---------------------------------------------------------------- page 3: night
P3_CSS = """
.story p{font-size:1.13rem;color:var(--n200);max-width:58ch;margin-bottom:1.5rem}
.story p b{color:var(--n50)}
"""
P3_SECTIONS = """
<section class="block" id="story"><div class="wrap story">
<p class="eyebrow rv">The 1 AM problem</p>
<h2 class="rv">Nobody warns you about the nights.</h2>
<p class="rv">The product is half-built. The money question has no answer yet. And the browser — the tool that is supposed to help — hands you <b>forty open tabs and a sinking feeling</b>.</p>
<p class="rv">Kaizen was designed in that exact chair. It answers in plain words, keeps only the tab that matters, and when the spiral starts, it says the thing a good cofounder would say — <b>then hands you one small step</b>.</p>
<p class="rv">Not a productivity hack. A steadier way to keep going.</p>
</div></section>
<section class="quote"><div class="wrap rv">
<blockquote>What stands in the way becomes the way.</blockquote>
<cite>Marcus Aurelius — Meditations</cite>
</div></section>
<section class="block" id="features" style="padding-top:0"><div class="wrap">
<p class="eyebrow rv">On your side</p>
<h2 class="rv">Tools for the hours nobody sees.</h2>
<div class="grid c2">
<div class="card rv"><span class="ic" aria-hidden="true">☾</span><h3>Mood Aware Music</h3><p>Tell it the truth — focused, fried, or fired up — and it scores the session to match. No playlist hunting at midnight.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">✦</span><h3>The Right Line, on Time</h3><p>When the work stalls and the doubt gets loud, Kaizen drops a quote that earns its place — then the smallest possible next step under it.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">♫</span><h3>Voice in, Voice Out</h3><p>Ask out loud, hear the answer back. Built for pacing-around-the-room thinking, not just desk thinking.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">◎</span><h3>Search That Ends in a Step</h3><p>Answers with pros, cons, and the exact moves — so a search session ends with something done, not something dreaded.</p></div>
</div></div></section>
"""

# ---------------------------------------------------------------- page 4: flow
P4_SECTIONS = """
<section class="block" id="how"><div class="wrap">
<p class="eyebrow rv">The route</p>
<h2 class="rv">One goal in. A path out.</h2>
<p class="lede rv">Tell Kaizen the outcome — “launch my store”, “file my taxes”, “hire my first designer” — and it turns the searching, comparing, and second-guessing into a route you can simply walk.</p>
<div class="mock rv">
<p class="q">Your goal: <b>Launch my online store</b></p>
<ol class="route">
<li class="done">Pick the platform — Kaizen compared three, with costs, and picked the one that fits a solo founder</li>
<li class="done">Register the store name and connect payments</li>
<li>Add your first five products — photos, prices, one-line descriptions</li>
<li>Set shipping rates and a returns line you can actually honour</li>
<li>Share the link where your audience already is</li>
</ol>
<p style="margin-top:1.2rem;color:var(--n400);font-size:.92rem">Every step opens with its answer, its pros and cons, and the exact clicks — researched when you reach it, not dumped on you at the start.</p>
</div>
</div></section>
<section class="block" id="features" style="padding-top:0"><div class="wrap">
<p class="eyebrow rv">Under the hood</p>
<h2 class="rv">A copilot, not a directory.</h2>
<div class="grid c3">
<div class="card rv"><span class="ic" aria-hidden="true">⌖</span><h3>Task Detection</h3><p>Kaizen recognises what you are trying to do — or you just tell it — and organises everything around that outcome.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">≡</span><h3>Steps, Not Links</h3><p>Research becomes a sequence: do this, then this. Each step small enough to finish before your coffee cools.</p></div>
<div class="card rv"><span class="ic" aria-hidden="true">♫</span><h3>Speaks and Listens</h3><p>Full voice in and out, music matched to your mood, and a nudge when the route stalls. A browser that works the way you do.</p></div>
</div></div></section>
"""

# ---------------------------------------------------------------- page 5: zen
P5_SECTIONS = """
<section class="block" id="principles"><div class="wrap">
<p class="eyebrow rv">The philosophy</p>
<h2 class="rv">Improvement, compounded.</h2>
<p class="lede rv">Kaizen is a browser for entrepreneurs that answers instead of listing — the answer, the pros and cons, and the exact next step — with music for your mood and a voice that talks back. It is built on three principles, and nothing else.</p>
<ul class="principles">
<li class="rv"><span class="n">一</span><div><h3>Small Steps</h3><p>Kaizen never asks for a leap. It finds the one step small enough to actually happen today.</p></div></li>
<li class="rv"><span class="n">二</span><div><h3>Every Day</h3><p>Momentum is a daily practice, not a mood. One percent, compounded, is not a metaphor — it is arithmetic.</p></div></li>
<li class="rv"><span class="n">三</span><div><h3>No Noise</h3><p>No feeds screaming for your attention. One goal, one answer, one next step.</p></div></li>
</ul>
</div></section>
"""

NAV_MAIN = [("The Problem", "#problem"), ("How It Works", "#how"), ("Features", "#features"), ("Waitlist", "#waitlist")]

PAGES = [
    dict(slug="kaizen-1-climb", variant="", nav=NAV_MAIN,
         title="Kaizen — The Browser for Entrepreneurs",
         desc="Google gives you 10 links and homework. Kaizen gives you the answer, the pros and cons, and the exact next step.",
         canvas_label="Golden embers rising past dark steps as you scroll",
         acts=[(0.02, 0.30, '<h1>Thirty tabs open. Zero progress.</h1><p>Sound familiar? Keep scrolling — it gets clearer.</p>'),
               (0.38, 0.62, '<p class="display">You don\'t need more links. You need the next step.</p>'),
               (0.70, 0.97, '<p class="display">Answer. Pros and cons. Next step.</p><a class="btn cta" href="#waitlist">Join the Waitlist</a>')],
         sections=P1_SECTIONS, wl_h="Be first in line.",
         wl_sub="Kaizen is being built in public, one percent at a time. Leave your email and you are in the first group of invites."),
    dict(slug="kaizen-2-glass", variant="v-split",
         nav=[("How It Works", "#how"), ("Features", "#features"), ("Waitlist", "#waitlist")],
         title="Kaizen — Search, Through Glass",
         desc="Every search result with its pros, cons, and costs showing. Kaizen — the browser for entrepreneurs.",
         canvas_label="Frosted glass panes drifting and turning as you scroll",
         acts=[(0.02, 0.30, '<h1>Search, through glass.</h1><p>Every result, seen clearly — what it gives you, and what it costs you.</p>'),
               (0.38, 0.62, '<p class="display">No fog. No tab archaeology.</p>'),
               (0.70, 0.97, '<p class="display">Just the step that moves your business.</p><a class="btn cta" href="#waitlist">Join the Waitlist</a>')],
         sections=P2_SECTIONS, css=P2_CSS, wl_h="See clearly. Join the waitlist.",
         wl_sub="First invites go to the waitlist, in order. Bring the question your business is stuck on — Kaizen will be ready for it."),
    dict(slug="kaizen-3-night", variant="v-story",
         nav=[("The Story", "#story"), ("Features", "#features"), ("Waitlist", "#waitlist")],
         title="Kaizen — For the Founder at 1 AM",
         desc="Built for the hours nobody sees. Kaizen answers, steadies, and hands you the next step.",
         canvas_label="Rain on a window at night with warm city lights behind it, moving as you scroll",
         acts=[(0.02, 0.30, '<h1>Past midnight. The tabs are still open.</h1>'),
               (0.38, 0.62, '<p class="display">You\'re not lazy. You\'re buried.</p>'),
               (0.70, 0.97, '<p class="display">Kaizen clears the desk, and stays kind while it does.</p><a class="btn ghost cta" href="#waitlist">Join the Waitlist</a>')],
         sections=P3_SECTIONS, css=P3_CSS, wl_h="For the ones still up.",
         wl_sub="If the nights are where your business gets built, this browser is being built for you. First invites, in order, at launch."),
    dict(slug="kaizen-4-flow", variant="",
         nav=[("The Route", "#how"), ("Features", "#features"), ("Waitlist", "#waitlist")],
         title="Kaizen — Every Search Becomes a Route",
         desc="One goal in. A path out. Kaizen turns research into a route of small, finishable steps.",
         canvas_label="Streams of golden light converging into one bright route as you scroll",
         acts=[(0.02, 0.30, '<h1>Every search becomes a route.</h1><p>Tell it the outcome. It draws the way.</p>'),
               (0.38, 0.62, '<p class="display">One goal in. A path out.</p>'),
               (0.70, 0.97, '<p class="display">Follow the line. Do the step. Arrive.</p><a class="btn cta" href="#waitlist">Join the Waitlist</a>')],
         sections=P4_SECTIONS, wl_h="Get routed.",
         wl_sub="Bring one goal you have been circling for weeks. Kaizen’s first job is turning it into a route. Join the waitlist for first access."),
    dict(slug="kaizen-5-zen", variant="v-zen",
         nav=[("Principles", "#principles"), ("Waitlist", "#waitlist")],
         title="Kaizen — 1% Better, Every Day",
         desc="Kaizen. The browser for entrepreneurs. Small steps, every day, no noise.",
         canvas_label="A single bright star with slow drifting clouds as you scroll",
         acts=[(0.02, 0.30, '<h1>KAIZEN</h1><p>改善 — continuous improvement, as a browser.</p>'),
               (0.38, 0.62, '<p class="display">One percent better, every day.</p>'),
               (0.70, 0.97, '<p class="display">That is the whole strategy.</p><a class="btn ghost cta" href="#waitlist">Begin</a>')],
         sections=P5_SECTIONS, wl_h="Begin.",
         wl_sub="One email at launch. Nothing before, nothing after that you did not ask for."),
]

if __name__ == "__main__":
    for cfg in PAGES:
        path = os.path.join(ROOT, cfg["slug"], "index.html")
        html = page(cfg)
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"{cfg['slug']}: index.html {len(html)} bytes")
    print("PAGES BUILT")
