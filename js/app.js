function esc(s){const d=document.createElement('div');d.appendChild(document.createTextNode(String(s)));return d.innerHTML;}

// MOBILE NAV
const hamBtn=document.getElementById('hamBtn'),mobNav=document.getElementById('mobNav');
function closeMob(){hamBtn.classList.remove('open');mobNav.style.display='none'}
hamBtn.addEventListener('click',()=>{const open=hamBtn.classList.toggle('open');mobNav.style.display=open?'flex':'none';});

// THEME
const root=document.documentElement,tBtn=document.getElementById('themeBtn');
function applyTheme(t){root.setAttribute('data-theme',t);tBtn.textContent=t==='dark'?'☀️':'🌙';localStorage.setItem('ic-theme',t);}
applyTheme(localStorage.getItem('ic-theme')||'dark');
tBtn.addEventListener('click',()=>applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));

// CALC TABS
function switchCalc(idx){
  document.querySelectorAll('.calc-tab-btn').forEach((b,i)=>b.classList.toggle('on',i===idx));
  document.querySelectorAll('.calc-panel').forEach((p,i)=>p.classList.toggle('on',i===idx));
}

// PAGE NAV
function go(name){
  closeMob();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+name);
  if(pg){pg.classList.add('active');}
  document.querySelectorAll('.nav-pill a[data-p],.mob-nav a[data-p]').forEach(a=>a.classList.toggle('active',a.getAttribute('data-p')===name));
  window.scrollTo({top:0,behavior:'instant'});
  document.querySelectorAll('#page-'+name+' .fu').forEach(el=>{el.style.animation='none';el.offsetHeight;el.style.animation='';});
  setTimeout(revealAll,80);
}

// SCROLL NAV
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('scrolled',window.scrollY>50));

// SCROLL REVEAL
function revealAll(){
  const els=document.querySelectorAll('.page.active .rev:not(.vis)');
  const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('vis'),i*55);obs.unobserve(e.target);}});},{threshold:.08});
  els.forEach(el=>obs.observe(el));
}
revealAll();

// CONTACT FORM
async function submitForm(){
  const btn=document.getElementById('sbtn');
  if(document.getElementById('hp-contact').value){return;}
  const name=document.getElementById('fn').value.trim();
  const phone=document.getElementById('fp').value.trim();
  const email=document.getElementById('fe').value.trim();
  const service=document.getElementById('fs').value||'Not specified';
  const message=document.getElementById('fm').value.trim()||'No additional message';
  if(!name||!phone||!email){alert('Please fill in your name, phone number, and email.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Please enter a valid email address.');return;}
  btn.textContent='Opening WhatsApp…';btn.disabled=true;
  const text=
    `Hi Joy! I'd like to enquire about your services.\n\n`+
    `*Name:* ${name}\n`+
    `*Phone:* ${phone}\n`+
    `*Email:* ${email}\n`+
    `*Interested in:* ${service}\n`+
    `*Message:* ${message}`;
  const waUrl='https://wa.me/918928793627?text='+encodeURIComponent(text);
  window.open(waUrl,'_blank');
  document.getElementById('f-fields').style.display='none';
  document.getElementById('f-success').style.display='block';
}

// ── CALCULATORS ──
function fmt(n){return '₹'+Math.round(n).toLocaleString('en-IN');}
function fmtK(n){if(n>=10000000)return '₹'+(n/10000000).toFixed(2)+' Cr';if(n>=100000)return '₹'+(n/100000).toFixed(2)+' L';return fmt(n);}
function getVal(id){return parseFloat(document.getElementById(id).value)||0;}

function syncFromRange(rangeId,manualId){
  document.getElementById(manualId).value=document.getElementById(rangeId).value;
}
function syncFromManual(rangeId,manualId,minV,maxV){
  let v=parseFloat(document.getElementById(manualId).value)||minV;
  const slider=document.getElementById(rangeId);
  slider.value=Math.min(Math.max(v,parseFloat(slider.min)),parseFloat(slider.max));
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
  document.getElementById('sip-invested').textContent=fmtK(invested);
  document.getElementById('sip-returns').textContent=fmtK(fv-invested);
  document.getElementById('sip-total').textContent=fmtK(fv);
  const realRow=document.querySelector('#calc-0 .inf-row');
  if(realRow) realRow.style.display=infOn?'':'none';
  document.getElementById('sip-real').textContent=fmtK(realFV);
  drawSIPChart(P,getVal('sip-rate-manual'),getVal('sip-yrs-manual'));
}

function drawSIPChart(P,rate,yrs){
  const chart=document.getElementById('sip-chart');
  if(!chart)return;
  chart.innerHTML='';
  const r=rate/100/12;
  const steps=Math.min(Math.max(1,Math.round(yrs)),10);
  let maxVal=0;const data=[];
  for(let i=1;i<=steps;i++){
    const n=Math.round(i*(yrs/steps)*12);
    const fv=P*((Math.pow(1+r,n)-1)/r)*(1+r);
    const inv=P*n;
    data.push({y:Math.round(i*(yrs/steps)),fv,inv});
    if(fv>maxVal)maxVal=fv;
  }
  const H=110;
  data.forEach(d=>{
    const wrap=document.createElement('div');wrap.className='bar-wrap';
    const iH=Math.max(2,Math.round((d.inv/maxVal)*H));
    const rH=Math.max(2,Math.round(((d.fv-d.inv)/maxVal)*H));
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
  const fv=P*Math.pow(1+r,n);
  const realFV=infOn?fv/Math.pow(1+inf/100,n):fv;
  document.getElementById('ls-invested').textContent=fmtK(P);
  document.getElementById('ls-returns').textContent=fmtK(fv-P);
  document.getElementById('ls-total').textContent=fmtK(fv);
  document.getElementById('ls-mult').textContent=(fv/P).toFixed(1)+'x';
  const realRow=document.querySelector('#calc-1 .inf-row');
  if(realRow) realRow.style.display=infOn?'':'none';
  document.getElementById('ls-real').textContent=fmtK(realFV);
}

function calcGoal(){
  const targetNominal=Math.max(1000,getVal('goal-target-manual'));
  const infOn=document.getElementById('goal-inf-on')?.checked!==false;
  const inf=infOn?(getVal('goal-inf-manual')||0):0;
  const yrs=Math.max(1,getVal('goal-yrs-manual'));
  const inflatedTarget=infOn?targetNominal*Math.pow(1+inf/100,yrs):targetNominal;
  const r=Math.max(0.01,getVal('goal-rate-manual'))/100/12;
  const n=yrs*12;
  const sip=inflatedTarget*r/((Math.pow(1+r,n)-1)*(1+r));
  const invested=sip*n;
  document.getElementById('goal-corpus').textContent=fmtK(targetNominal);
  const infRow=document.querySelector('#calc-2 .inf-row');
  if(infRow) infRow.style.display=infOn?'':'none';
  document.getElementById('goal-inf-target').textContent=fmtK(inflatedTarget);
  document.getElementById('goal-sip').textContent=fmt(sip);
  document.getElementById('goal-invested').textContent=fmtK(invested);
  document.getElementById('goal-returns').textContent=fmtK(inflatedTarget-invested);
}

function calcEMI(){
  const P=Math.max(1000,getVal('emi-amt-manual'));
  const r=Math.max(0.01,getVal('emi-rate-manual'))/100/12;
  const n=Math.max(1,getVal('emi-yrs-manual'))*12;
  const emi=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const total=emi*n;
  document.getElementById('emi-monthly').textContent=fmt(emi);
  document.getElementById('emi-principal').textContent=fmtK(P);
  document.getElementById('emi-interest').textContent=fmtK(total-P);
  document.getElementById('emi-total').textContent=fmtK(total);
}


// ── INFLATION TOGGLE ──
function toggleInf(prefix){
  const on = document.getElementById(prefix+'-inf-on').checked;
  const controls = document.getElementById(prefix+'-inf-controls');
  const wrap = document.getElementById(prefix+'-inf-wrap');
  controls.style.transition='opacity .25s,max-height .3s';
  if(on){
    controls.style.opacity='1';
    controls.style.maxHeight='200px';
    controls.style.pointerEvents='';
    wrap.classList.add('inf-active');
  } else {
    controls.style.opacity='0';
    controls.style.maxHeight='0';
    controls.style.pointerEvents='none';
    controls.style.overflow='hidden';
    wrap.classList.remove('inf-active');
  }
  // Recalculate
  if(prefix==='sip') calcSIP();
  else if(prefix==='ls') calcLS();
  else if(prefix==='goal') calcGoal();
}

// Init calculators on load
calcSIP();calcLS();calcGoal();calcEMI();
// Set initial inflation wrap state
['sip','ls','goal'].forEach(p=>{
  const wrap=document.getElementById(p+'-inf-wrap');
  if(wrap) wrap.classList.add('inf-active');
});


// FEEDBACK SYSTEM — proper star rating + localStorage persistence
(function(){
  const STORAGE_KEY = 'igris-reviews-v2';
  let selectedRating = 0;

  // --- Star rating interaction ---
  function initStars(){
    const stars = document.querySelectorAll('#star-row .star-btn');
    stars.forEach(btn=>{
      btn.addEventListener('mouseenter',()=> highlightStars(parseInt(btn.dataset.val)));
      btn.addEventListener('mouseleave',()=> highlightStars(selectedRating));
      btn.addEventListener('click',()=>{
        selectedRating = parseInt(btn.dataset.val);
        highlightStars(selectedRating);
        document.getElementById('star-error').style.display='none';
      });
    });
  }

  function highlightStars(n){
    document.querySelectorAll('#star-row .star-btn').forEach(b=>{
      const v = parseInt(b.dataset.val);
      b.classList.toggle('active', v <= n);
    });
  }

  // --- Load saved reviews from localStorage ---
  function loadReviews(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      if(saved.length>0){
        document.getElementById('fb-empty-state').style.display='none';
        saved.forEach(r=>renderCard(r));
      }
    }catch(e){}
  }

  // --- Render a review card ---
  function renderCard(r){
    const wall = document.getElementById('fb-wall');
    const empty = document.getElementById('fb-empty-state');
    if(empty) empty.style.display='none';

    const card = document.createElement('div');
    card.className='fb-card';
    const filled = '★'.repeat(Math.min(5,Math.max(1,parseInt(r.rating)||5)));
    const empty_s = '☆'.repeat(5 - filled.length);
    card.innerHTML=`<div class="fb-stars">${filled}<span style="color:var(--txf);opacity:.4">${empty_s}</span></div><div class="fb-text">${esc(r.text)}</div><div class="fb-meta"><span class="fb-name">${esc(r.name)}</span><span class="fb-date">${r.date||''}</span></div>`;
    wall.prepend(card);
  }

  // --- Submit ---
  window.submitFeedbackNew = async function(){
    const nameEl = document.getElementById('fb-name');
    const textEl = document.getElementById('fb-text');
    const btn = document.getElementById('fb-submit-btn');
    const successMsg = document.getElementById('fb-success-msg');

    const name = nameEl.value.trim();
    const text = textEl.value.trim();

    // Validate
    if(!name){ nameEl.focus(); alert('Please enter your name.'); return; }
    if(!selectedRating){
      document.getElementById('star-error').style.display='block';
      return;
    }
    if(!text || text.length < 5){ textEl.focus(); alert('Please write at least a short feedback.'); return; }

    btn.textContent = 'Submitting…';
    btn.disabled = true;

    // Save to Formspree
    try{
      await fetch('https://formspree.io/f/xjganlan',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({name, rating: selectedRating+' stars', feedback: text})
      });
    }catch(e){ console.warn('Formspree error',e); }

    // Build review object
    const review = {
      name,
      rating: selectedRating,
      text,
      date: new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
    };

    // Save to localStorage
    try{
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      existing.unshift(review);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0,50)));
    }catch(e){}

    // Render card
    renderCard(review);

    // Reset form
    nameEl.value='';
    textEl.value='';
    selectedRating=0;
    highlightStars(0);
    btn.textContent='Submit Feedback →';
    btn.disabled=false;
    successMsg.style.display='block';
    setTimeout(()=>{ successMsg.style.display='none'; }, 5000);
  };

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded',()=>{
    initStars();
    loadReviews();
  });
})();

// ── HERO STATS — JSONBin live sync ──
const BIN_SETUP_KEY = 'igris-bin-setup';
const STATS_CACHE   = 'igris-stats-cache';
const DEFAULT_STATS = {
  aum:'12', aumUnit:'Cr',
  loans:'8', loansUnit:'Cr',
  ins:'50',  insUnit:'none'
};
// Hardcoded master key — embedded so all devices auto-sync
const _MK = '$2a$10$lfvMBG.DfL.srrIrM7/uS..R.WKmcWpVSIKeaKtR0xFd2x08LruHK';
function getBinSetup(){
  // Always inject master key, preserve any saved binId
  try{
    const saved = JSON.parse(localStorage.getItem(BIN_SETUP_KEY)||'null');
    const binId = saved?.binId||'';
    const setup = {key:_MK, binId};
    localStorage.setItem(BIN_SETUP_KEY, JSON.stringify(setup));
    return setup;
  }catch(e){ return {key:_MK, binId:''}; }
}

function formatStat(val, unit, prefix=''){
  const n = parseFloat(val)||0;
  if(unit==='none') return `${n}+`;
  if(unit==='K')    return `${prefix}${n.toLocaleString('en-IN')}K+`;
  if(unit==='L')    return `${prefix}${n}L+`;
  if(unit==='Cr')   return `${prefix}${n}Cr+`;
  return `${n}`;
}

function applyStats(s){
  const el = id => document.getElementById(id);
  if(el('aum-display'))   el('aum-display').textContent   = formatStat(s.aum,   s.aumUnit,   '₹');
  if(el('loans-display')) el('loans-display').textContent = formatStat(s.loans, s.loansUnit, '₹');
  if(el('ins-display'))   el('ins-display').textContent   = formatStat(s.ins,   s.insUnit,   '');
}

// getBinSetup defined above with hardcoded key

async function fetchLiveStats(){
  const setup = getBinSetup();
  if(!setup || !setup.key || !setup.binId){
    // Fallback: use cached or defaults
    try{
      const cached = JSON.parse(localStorage.getItem(STATS_CACHE)||'null');
      applyStats(cached || DEFAULT_STATS);
    }catch(e){ applyStats(DEFAULT_STATS); }
    return;
  }
  try{
    const res = await fetch(`https://api.jsonbin.io/v3/b/${setup.binId}/latest`,{
      headers:{'X-Master-Key': setup.key}
    });
    if(!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const stats = data.record;
    localStorage.setItem(STATS_CACHE, JSON.stringify(stats));
    applyStats(stats);
  }catch(e){
    // fallback to cache
    try{
      const cached = JSON.parse(localStorage.getItem(STATS_CACHE)||'null');
      applyStats(cached || DEFAULT_STATS);
    }catch(e2){ applyStats(DEFAULT_STATS); }
  }
}

async function pushLiveStats(stats){
  const setup = getBinSetup();
  if(!setup || !setup.key) return false;

  try{
    let binId = setup.binId;

    if(!binId){
      // Create new bin
      const res = await fetch('https://api.jsonbin.io/v3/b',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-Master-Key':setup.key,'X-Bin-Name':'igris-stats','X-Bin-Private':'false'},
        body: JSON.stringify(stats)
      });
      if(!res.ok) throw new Error('create failed');
      const data = await res.json();
      binId = data.metadata.id;
      // Save bin ID
      const newSetup = {...setup, binId};
      localStorage.setItem(BIN_SETUP_KEY, JSON.stringify(newSetup));
      document.getElementById('admin-binid').value = binId;
    } else {
      // Update existing bin
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json','X-Master-Key':setup.key},
        body: JSON.stringify(stats)
      });
      if(!res.ok) throw new Error('update failed');
    }

    localStorage.setItem(STATS_CACHE, JSON.stringify(stats));
    return true;
  }catch(e){
    console.warn('JSONBin error:', e);
    return false;
  }
}

function updatePreviews(){
  const get = id => document.getElementById(id);
  const pv = (valId, unitId, previewId, prefix) => {
    const el = get(previewId);
    if(!el) return;
    const v = get(valId)?.value;
    const u = get(unitId)?.value;
    if(v) el.textContent = '→ Will show as: ' + formatStat(v, u, prefix);
    else el.textContent = '';
  };
  pv('admin-aum',   'admin-aum-unit',   'aum-preview',   '₹');
  pv('admin-loans', 'admin-loans-unit', 'loans-preview', '₹');
  pv('admin-ins',   'admin-ins-unit',   'ins-preview',   '');
}

function saveApiSetup(){
  const key   = document.getElementById('admin-binkey')?.value?.trim();
  const binId = document.getElementById('admin-binid')?.value?.trim();
  if(!key){ alert('Please enter a JSONBin Master Key.'); return; }
  localStorage.setItem(BIN_SETUP_KEY, JSON.stringify({key, binId}));
  document.getElementById('admin-setup').style.display = 'none';
  alert('API setup saved! Now you can update stats.');
}

async function saveAdminStats(){
  const btn = document.getElementById('admin-save-btn');
  const status = document.getElementById('admin-save-status');
  btn.textContent = 'Saving…'; btn.disabled = true;

  const stats = {
    aum:      document.getElementById('admin-aum')?.value   || DEFAULT_STATS.aum,
    aumUnit:  document.getElementById('admin-aum-unit')?.value || DEFAULT_STATS.aumUnit,
    loans:    document.getElementById('admin-loans')?.value  || DEFAULT_STATS.loans,
    loansUnit:document.getElementById('admin-loans-unit')?.value || DEFAULT_STATS.loansUnit,
    ins:      document.getElementById('admin-ins')?.value    || DEFAULT_STATS.ins,
    insUnit:  document.getElementById('admin-ins-unit')?.value || DEFAULT_STATS.insUnit,
  };

  // Always apply locally first
  applyStats(stats);
  localStorage.setItem(STATS_CACHE, JSON.stringify(stats));

  const setup = getBinSetup();
  if(!setup || !setup.key){
    status.style.display='block';
    status.style.background='rgba(245,158,11,.12)';
    status.style.color='#f59e0b';
    status.style.border='1px solid rgba(245,158,11,.3)';
    status.textContent='⚠️ Saved locally only. Set up JSONBin API key to push to all visitors.';
    btn.textContent='Update Live Stats →'; btn.disabled=false;
    setTimeout(()=>{ status.style.display='none'; closeAdmin(); },3000);
    return;
  }

  const ok = await pushLiveStats(stats);
  status.style.display='block';
  if(ok){
    status.style.background='rgba(34,197,94,.1)';
    status.style.color='#16a34a';
    status.style.border='1px solid rgba(34,197,94,.3)';
    status.textContent='✓ Stats updated! All visitors will see the new values.';
    setTimeout(()=>{ status.style.display='none'; closeAdmin(); },2500);
  } else {
    status.style.background='rgba(239,68,68,.1)';
    status.style.color='#dc2626';
    status.style.border='1px solid rgba(239,68,68,.3)';
    status.textContent='⚠️ JSONBin save failed — saved locally only. Check your API key.';
    setTimeout(()=>{ status.style.display='none'; }, 4000);
  }
  btn.textContent='Update Live Stats →'; btn.disabled=false;
}

function openAdmin(){
  const setup = getBinSetup();
  const setupDiv = document.getElementById('admin-setup');
  if(setupDiv) setupDiv.style.display = 'none'; // key is hardcoded, never show setup

  // Pre-fill fields from cache or defaults
  let s = DEFAULT_STATS;
  try{ const c=JSON.parse(localStorage.getItem(STATS_CACHE)||'null'); if(c) s=c; }catch(e){}
  const set = (id,v)=>{ const el=document.getElementById(id); if(el) el.value=v; };
  set('admin-aum',        s.aum);
  set('admin-aum-unit',   s.aumUnit   || 'Cr');
  set('admin-loans',      s.loans);
  set('admin-loans-unit', s.loansUnit || 'Cr');
  set('admin-ins',        s.ins);
  set('admin-ins-unit',   s.insUnit   || 'none');
  if(setup?.binId){ set('admin-binid', setup.binId); }

  // Wire up live previews
  ['admin-aum','admin-aum-unit','admin-loans','admin-loans-unit','admin-ins','admin-ins-unit']
    .forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input',updatePreviews); });
  updatePreviews();

  document.getElementById('admin-overlay').style.display='block';
  document.getElementById('admin-panel').style.display='block';
  document.body.style.overflow='hidden';
}

function closeAdmin(){
  document.getElementById('admin-overlay').style.display='none';
  document.getElementById('admin-panel').style.display='none';
  document.body.style.overflow='';
}

// Hash trigger
function checkAdminHash(){
  if(location.hash==='#admin-igris'){ openAdmin(); history.replaceState(null,'',location.pathname); }
}
window.addEventListener('hashchange', checkAdminHash);
checkAdminHash();

// Load stats for all visitors on page load
fetchLiveStats();
