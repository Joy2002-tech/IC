/* ===============================
🔒 CONFIG (SET ONLY ONCE)
=============================== */
const _BIN = ''; // 👈 PASTE YOUR BIN ID ONCE
const _API_KEY = '$2a$10$SJWxpEd/v9bLl6Wg1KJpL.MEwzBJVg1eBgoLYbJBQdUPV1wSFYRlS'; // 👈 PASTE YOUR JSONBIN KEY ONCE

/* ===============================
BASIC UTIL
=============================== */
function esc(s){const d=document.createElement('div');d.appendChild(document.createTextNode(String(s)));return d.innerHTML;}

/* ===============================
MOBILE NAV
=============================== */
const hamBtn=document.getElementById('hamBtn'),mobNav=document.getElementById('mobNav');
function closeMob(){hamBtn.classList.remove('open');mobNav.style.display='none'}
hamBtn.addEventListener('click',()=>{const open=hamBtn.classList.toggle('open');mobNav.style.display=open?'flex':'none';});

/* ===============================
THEME
=============================== */
const root=document.documentElement,tBtn=document.getElementById('themeBtn');
function applyTheme(t){root.setAttribute('data-theme',t);tBtn.textContent=t==='dark'?'☀️':'🌙';localStorage.setItem('ic-theme',t);}
applyTheme(localStorage.getItem('ic-theme')||'dark');
tBtn.addEventListener('click',()=>applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));

/* ===============================
PAGE NAV
=============================== */
function go(name){
closeMob();
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
const pg=document.getElementById('page-'+name);
if(pg){pg.classList.add('active');}
}

/* ===============================
CONTACT FORM
=============================== */
async function submitForm(){
const name=document.getElementById('fn').value.trim();
const phone=document.getElementById('fp').value.trim();
const email=document.getElementById('fe').value.trim();

if(!name||!phone||!email){alert('Fill all required fields');return;}

const text=`Hi Joy!%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}`;
window.open('https://wa.me/918928793627?text='+text,'_blank');
}

/* ===============================
📊 HERO STATS SYSTEM (FIXED)
=============================== */

const DEFAULT_STATS = {
aum:'12', aumUnit:'Cr',
loans:'8', loansUnit:'Cr',
ins:'50', insUnit:'none'
};

function formatStat(val, unit, prefix=''){
const n = parseFloat(val)||0;
if(unit==='none') return `${n}+`;
if(unit==='Cr') return `${prefix}${n} Cr+`;
return `${prefix}${n}`;
}

function applyStats(s){
document.getElementById('aum-display').textContent = formatStat(s.aum,s.aumUnit,'₹');
document.getElementById('loans-display').textContent = formatStat(s.loans,s.loansUnit,'₹');
document.getElementById('ins-display').textContent = formatStat(s.ins,s.insUnit);
}

/* ===============================
FETCH DATA
=============================== */
async function fetchStats(){
if(!_BIN || !_API_KEY){
applyStats(DEFAULT_STATS);
return;
}

try{
const res = await fetch(`https://api.jsonbin.io/v3/b/${_BIN}/latest`,{
headers:{'X-Master-Key':_API_KEY}
});

```
const data = await res.json();
applyStats(data.record);
```

}catch(e){
console.log('Fetch error',e);
applyStats(DEFAULT_STATS);
}
}

/* ===============================
UPDATE DATA (MAIN FIX)
=============================== */
async function updateStats(stats){

if(!_BIN || !_API_KEY){
alert('Set BIN + API KEY first');
return;
}

try{
await fetch(`https://api.jsonbin.io/v3/b/${_BIN}`,{
method:'PUT', // 🔥 FIXED
headers:{
'Content-Type':'application/json',
'X-Master-Key':_API_KEY
},
body:JSON.stringify(stats)
});

```
alert('Updated successfully');
```

}catch(e){
console.log('Update error',e);
}
}

/* ===============================
ADMIN SAVE
=============================== */
async function saveAdminStats(){

const stats={
aum:document.getElementById('admin-aum').value,
aumUnit:'Cr',
loans:document.getElementById('admin-loans').value,
loansUnit:'Cr',
ins:document.getElementById('admin-ins').value,
insUnit:'none'
};

applyStats(stats);
await updateStats(stats);
}

/* ===============================
INIT
=============================== */
fetchStats();
