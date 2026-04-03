// ═══════════════════════════════════════════════════
//  IGRIS CAPITAL — app.js v3
// ═══════════════════════════════════════════════════

function esc(s){const d=document.createElement('div');d.appendChild(document.createTextNode(String(s)));return d.innerHTML;}

// ── APPLY STATS FROM stats.js ──────────────────────
function applyStats(){
  if(typeof IGRIS_STATS === 'undefined') return;
  const s = IGRIS_STATS;

  // Hero right-side stat cards
  setText('hero-aum',     s.aum);
  setText('hero-loans',   s.loans);
  setText('hero-ins',     s.insurance);
  setText('hero-clients', s.clients);

  // Impact grid
  setText('impact-exp',     s.experience + '+ Year' + (parseFloat(s.experience)===1?'':'s'));
  setText('impact-clients', s.clients);
  setText('impact-aum',     s.aum);
  setText('impact-ins',     s.insurance);
}

// ── DUPLICATE TICKER for seamless infinite loop ─────
function initTicker(){
  const track = document.getElementById('ticker-track');
  if(!track) return;
  // Clone all children and append for seamless loop
  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden','true');
  track.parentElement.appendChild(clone);
}

function setText(id,val){const el=document.getElementById(id);if(el)el.textContent=val;}

// ── MOBILE NAV ─────────────────────────────────────
const hamBtn=document.getElementById('hamBtn');
const mobNav=document.getElementById('mobNav');
function closeMob(){hamBtn.classList.remove('open');mobNav.style.display='none';}
hamBtn.addEventListener('click',()=>{
  const open=hamBtn.classList.toggle('open');
  mobNav.style.display=open?'flex':'none';
});

// ── THEME ──────────────────────────────────────────
const root=document.documentElement;
const tBtn=document.getElementById('themeBtn');
function applyTheme(t){
  root.setAttribute('data-theme',t);
  tBtn.textContent=t==='dark'?'☀️':'🌙';
}
applyTheme('light'); // default light
tBtn.addEventListener('click',()=>applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));

// ── PAGE NAVIGATION ────────────────────────────────
function go(name){
  closeMob();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+name);
  if(pg) pg.classList.add('active');
  document.querySelectorAll('[data-p]').forEach(a=>a.classList.toggle('active',a.getAttribute('data-p')===name));
  window.scrollTo({top:0,behavior:'instant'});
  document.querySelectorAll('#page-'+name+' .fu').forEach(el=>{
    el.style.animation='none';el.offsetHeight;el.style.animation='';
  });
  setTimeout(revealAll,80);
}

// ── SCROLL REVEAL ──────────────────────────────────
function revealAll(){
  const els=document.querySelectorAll('.page.active .rev:not(.vis)');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('vis'),i*55);obs.unobserve(e.target);}
    });
  },{threshold:.06});
  els.forEach(el=>obs.observe(el));
}
revealAll();

// ── CALCULATOR TABS ────────────────────────────────
function switchCalc(idx){
  document.querySelectorAll('.calc-tab-btn').forEach((b,i)=>b.classList.toggle('on',i===idx));
  document.querySelectorAll('.calc-panel').forEach((p,i)=>p.classList.toggle('on',i===idx));
}

// ── CONTACT FORM → WhatsApp ────────────────────────
async function submitForm(){
  if(document.getElementById('hp-contact').value) return;
  const btn=document.getElementById('sbtn');
  const name=document.getElementById('fn').value.trim();
  const phone=document.getElementById('fp').value.trim();
  const email=document.getElementById('fe').value.trim();
  const service=document.getElementById('fs').value||'Not specified';
  const message=document.getElementById('fm').value.trim()||'No additional message';
  if(!name||!phone||!email){alert('Please fill in your name, phone number, and email.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Please enter a valid email address.');return;}
  btn.textContent='Opening WhatsApp…';btn.disabled=true;
  const text=`Hi Joy! I'd like to enquire about your services.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Interested in:* ${service}\n*Message:* ${message}`;
  window.open('https://wa.me/918928793627?text='+encodeURIComponent(text),'_blank');
  document.getElementById('f-fields').style.display='none';
  document.getElementById('f-success').style.display='block';
}

// ── CALCULATORS ─────────────────────────────────────
function fmt(n){return '₹'+Math.round(n).toLocaleString('en-IN');}
function fmtK(n){if(n>=10000000)return '₹'+(n/10000000).toFixed(2)+' Cr';if(n>=100000)return '₹'+(n/100000).toFixed(2)+' L';return fmt(n);}
function getVal(id){return parseFloat(document.getElementById(id)?.value)||0;}
function syncFromRange(rid,mid){const el=document.getElementById(mid);if(el)el.value=document.getElementById(rid).value;}
function syncFromManual(rid,mid,minV,maxV){
  let v=parseFloat(document.getElementById(mid)?.value)||minV;
  const s=document.getElementById(rid);
  if(s)s.value=Math.min(Math.max(v,parseFloat(s.min)),parseFloat(s.max));
}

function calcSIP(){
  const P=Math.max(100,getVal('sip-amt-manual'));
  const r=Math.max(0.01,getVal('sip-rate-manual'))/100/12;
  const n=Math.max(1,getVal('sip-yrs-manual'))*12;
  const infOn=document.getElementById('sip-inf-on')?.checked!==false;
  const inf=infOn?(getVal('sip-inf-manual')||0):0;
  const fv=P*((Math.pow(1+r,n)-1)/r)*(1+r);
  const invested=P*n;
  const yrs=Math.max(1,getVal('sip-yrs-manual'));
  const realFV=infOn?fv/Math.pow(1+inf/100,yrs):fv;
  setText('sip-invested',fmtK(invested));setText('sip-returns',fmtK(fv-invested));
  setText('sip-total',fmtK(fv));setText('sip-real',fmtK(realFV));
  const realRow=document.querySelector('#calc-0 .inf-row');
  if(realRow)realRow.style.display=infOn?'':'none';
  drawSIPChart(P,getVal('sip-rate-manual'),getVal('sip-yrs-manual'));
}

function drawSIPChart(P,rate,yrs){
  const chart=document.getElementById('sip-chart');if(!chart)return;chart.innerHTML='';
  const r=rate/100/12,steps=Math.min(Math.max(1,Math.round(yrs)),10);
  let maxVal=0,data=[];
  for(let i=1;i<=steps;i++){
    const n=Math.round(i*(yrs/steps)*12);
    const fv=P*((Math.pow(1+r,n)-1)/r)*(1+r),inv=P*n;
    data.push({y:Math.round(i*(yrs/steps)),fv,inv});if(fv>maxVal)maxVal=fv;
  }
  const H=100;
  data.forEach(d=>{
    const wrap=document.createElement('div');wrap.className='bar-wrap';
    const iH=Math.max(2,Math.round((d.inv/maxVal)*H)),rH=Math.max(2,Math.round(((d.fv-d.inv)/maxVal)*H));
    wrap.innerHTML=`<div class="bar-returns" style="height:${rH}px"></div><div class="bar-invested" style="height:${iH}px"></div><div class="bar-yr">${d.y}y</div>`;
    chart.appendChild(wrap);
  });
}

function calcLS(){
  const P=Math.max(100,getVal('ls-amt-manual'));
  const r=Math.max(0.01,getVal('ls-rate-manual'))/100;
  const n=Math.max(1,getVal('ls-yrs-manual'));
  const infOn=document.getElementById('ls-inf-on')?.checked!==false;
  const inf=infOn?(getVal('ls-inf-manual')||0):0;
  const fv=P*Math.pow(1+r,n),realFV=infOn?fv/Math.pow(1+inf/100,n):fv;
  setText('ls-invested',fmtK(P));setText('ls-returns',fmtK(fv-P));
  setText('ls-total',fmtK(fv));setText('ls-mult',(fv/P).toFixed(1)+'x');setText('ls-real',fmtK(realFV));
  const realRow=document.querySelector('#calc-1 .inf-row');if(realRow)realRow.style.display=infOn?'':'none';
}

function calcGoal(){
  const targetNominal=Math.max(1000,getVal('goal-target-manual'));
  const infOn=document.getElementById('goal-inf-on')?.checked!==false;
  const inf=infOn?(getVal('goal-inf-manual')||0):0;
  const yrs=Math.max(1,getVal('goal-yrs-manual'));
  const inflatedTarget=infOn?targetNominal*Math.pow(1+inf/100,yrs):targetNominal;
  const r=Math.max(0.01,getVal('goal-rate-manual'))/100/12,n=yrs*12;
  const sip=inflatedTarget*r/((Math.pow(1+r,n)-1)*(1+r));
  const invested=sip*n;
  setText('goal-corpus',fmtK(targetNominal));setText('goal-inf-target',fmtK(inflatedTarget));
  setText('goal-sip',fmt(sip));setText('goal-invested',fmtK(invested));setText('goal-returns',fmtK(inflatedTarget-invested));
  const infRow=document.querySelector('#calc-2 .inf-row');if(infRow)infRow.style.display=infOn?'':'none';
}

function calcEMI(){
  const P=Math.max(1000,getVal('emi-amt-manual'));
  const r=Math.max(0.01,getVal('emi-rate-manual'))/100/12;
  const n=Math.max(1,getVal('emi-yrs-manual'))*12;
  const emi=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),total=emi*n;
  setText('emi-monthly',fmt(emi));setText('emi-principal',fmtK(P));
  setText('emi-interest',fmtK(total-P));setText('emi-total',fmtK(total));
}

function toggleInf(prefix){
  const on=document.getElementById(prefix+'-inf-on').checked;
  const controls=document.getElementById(prefix+'-inf-controls');
  const wrap=document.getElementById(prefix+'-inf-wrap');
  if(on){controls.style.opacity='1';controls.style.maxHeight='200px';controls.style.pointerEvents='';wrap.classList.add('inf-active');}
  else{controls.style.opacity='0';controls.style.maxHeight='0';controls.style.pointerEvents='none';wrap.classList.remove('inf-active');}
  if(prefix==='sip')calcSIP();else if(prefix==='ls')calcLS();else if(prefix==='goal')calcGoal();
}

// Init calculators
calcSIP();calcLS();calcGoal();calcEMI();
['sip','ls','goal'].forEach(p=>{const w=document.getElementById(p+'-inf-wrap');if(w)w.classList.add('inf-active');});

// ── FEEDBACK — Formspree only, no localStorage ──────
(function(){
  let selectedRating=0;
  function initStars(){
    document.querySelectorAll('#star-row .star-btn').forEach(btn=>{
      btn.addEventListener('mouseenter',()=>highlightStars(parseInt(btn.dataset.val)));
      btn.addEventListener('mouseleave',()=>highlightStars(selectedRating));
      btn.addEventListener('click',()=>{
        selectedRating=parseInt(btn.dataset.val);
        highlightStars(selectedRating);
        document.getElementById('star-error').style.display='none';
      });
    });
  }
  function highlightStars(n){
    document.querySelectorAll('#star-row .star-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.val)<=n));
  }
  function renderCard(r){
    const wall=document.getElementById('fb-dynamic-wall');
    const empty=document.getElementById('fb-empty-state');
    if(empty)empty.style.display='none';
    const card=document.createElement('div');card.className='fb-card';
    const filled='★'.repeat(Math.min(5,Math.max(1,parseInt(r.rating)||5)));
    const empty_s='☆'.repeat(5-filled.length);
    card.innerHTML=`<div class="fb-stars">${filled}<span style="color:var(--txf);opacity:.35">${empty_s}</span></div><div class="fb-text">${esc(r.text)}</div><div class="fb-meta"><span class="fb-name">${esc(r.name)}</span><span class="fb-date">${r.date||''}</span></div>`;
    wall.prepend(card);
  }
  window.submitFeedbackNew=async function(){
    const nameEl=document.getElementById('fb-name'),textEl=document.getElementById('fb-text');
    const btn=document.getElementById('fb-submit-btn'),successMsg=document.getElementById('fb-success-msg');
    const name=nameEl.value.trim(),text=textEl.value.trim();
    if(!name){nameEl.focus();alert('Please enter your name.');return;}
    if(!selectedRating){document.getElementById('star-error').style.display='block';return;}
    if(!text||text.length<5){textEl.focus();alert('Please write at least a short feedback.');return;}
    btn.textContent='Submitting…';btn.disabled=true;
    try{
      await fetch('https://formspree.io/f/xjganlan',{
        method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({name,rating:selectedRating+' stars',feedback:text})
      });
    }catch(e){console.warn('Formspree error',e);}
    const review={name,rating:selectedRating,text,date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})};
    renderCard(review);
    nameEl.value='';textEl.value='';selectedRating=0;highlightStars(0);
    btn.textContent='Submit Feedback →';btn.disabled=false;
    successMsg.style.display='block';
    setTimeout(()=>successMsg.style.display='none',5000);
  };
  initStars();
})();

// ── LIVE STATS from GitHub ─────────────────────────
const STATS_URL='https://raw.githubusercontent.com/Joy2002-tech/Igris-Capital/main/stats.json';
async function fetchLiveStats(){
  applyStats(); // apply local stats.js first
  try{
    const res=await fetch(STATS_URL+'?t='+Date.now());
    if(!res.ok) throw new Error(res.status);
    const remote=await res.json();
    // Merge remote into IGRIS_STATS if available
    if(typeof IGRIS_STATS!=='undefined'){
      if(remote.aum)      IGRIS_STATS.aum=remote.aum+(remote.aumUnit==='Cr'?'Cr+':remote.aumUnit==='L'?'L+':'K+');
      if(remote.loans)    IGRIS_STATS.loans='₹'+remote.loans+(remote.loansUnit==='Cr'?'Cr+':remote.loansUnit==='L'?'L+':'K+');
      if(remote.ins)      IGRIS_STATS.insurance=remote.ins+(remote.insUnit==='none'?'+':'');
    }
    applyStats();
  }catch(e){
    console.warn('Remote stats not available, using stats.js values.');
  }
}
fetchLiveStats();
// Init ticker
initTicker();
