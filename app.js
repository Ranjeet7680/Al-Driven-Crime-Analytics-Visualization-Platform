// ============================================
//   CrimeScope AI 2.0 — Complete Application
// ============================================

// ===================== LOADING SCREEN =====================
function runLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.getElementById('loading-bar');
  const status = document.getElementById('loading-status');
  if (!screen) return;

  const steps = [
    { pct: 15, msg: 'Initializing AI Systems...',          delay: 0    },
    { pct: 35, msg: 'Loading Crime Dataset (138,666 records)...', delay: 600  },
    { pct: 58, msg: 'Calibrating Prediction Models...',    delay: 1200 },
    { pct: 78, msg: 'Rendering Neural Visualizations...',  delay: 1800 },
    { pct: 92, msg: 'Mapping Karnataka Districts...',      delay: 2300 },
    { pct: 100, msg: '✓ Ready — Welcome to CrimeScope AI', delay: 2800 },
  ];

  steps.forEach(({ pct, msg, delay }) => {
    setTimeout(() => {
      if (bar) bar.style.width = pct + '%';
      if (status) status.textContent = msg;
    }, delay);
  });

  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => screen.remove(), 700);
  }, 3500);
}

// ===================== THEME TOGGLE =====================
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('crimescope-theme', next);
  // Re-render charts in light mode with updated background
  if (next === 'light') {
    Chart.defaults.color = '#475569';
    Object.values(charts).forEach(ch => {
      if (!ch || !ch.options) return;
      try { ch.update('none'); } catch(e) {}
    });
  } else {
    Chart.defaults.color = '#94a3b8';
    Object.values(charts).forEach(ch => {
      if (!ch || !ch.options) return;
      try { ch.update('none'); } catch(e) {}
    });
  }
  // Redraw the heatmap canvas with new theme colors
  const heatPage = document.getElementById('page-heatmap');
  if (heatPage && heatPage.classList.contains('active')) {
    setTimeout(() => drawKarnatakaMap(), 50);
  }
}

function applyStoredTheme() {
  const saved = localStorage.getItem('crimescope-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
}


Chart.defaults.color = '#94a3b8';
const C = CRIME_DATA.colors;
const charts = {};

function hx(hex, a) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
function dc(id) { if (charts[id]) { charts[id].destroy(); delete charts[id]; } }

// ===================== LANDING PAGE =====================
// Neural network canvas animation
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const nodes = Array.from({length: 60}, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 3 + 1,
    color: ['#a855f7','#3b82f6','#10b981','#06b6d4'][Math.floor(Math.random()*4)]
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168,85,247,${(1 - dist/150) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      });
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = a.color + '60';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const lp = document.getElementById('landing-page');
  const nav = document.querySelector('.landing-nav');
  const navH = nav ? nav.offsetHeight : 65;

  if (lp) {
    const lpRect = lp.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const scrollTop = lp.scrollTop + (elRect.top - lpRect.top) - navH - 8;
    lp.scrollTo({ top: scrollTop, behavior: 'smooth' });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Highlight active nav link
  const idMap = { 'features':'lnk-features', 'stats-section':'lnk-stats', 'team-section':'lnk-team' };
  document.querySelectorAll('.landing-nav-links a').forEach(a => a.classList.remove('nav-active'));
  const activeLink = document.getElementById(idMap[id]);
  if (activeLink) activeLink.classList.add('nav-active');

  // Remove hash from URL (file:// protocol safety)
  setTimeout(() => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
  }, 50);
}

// Navbar scrolled state — watch landing-page container
(function setupNavScroll() {
  function attachNavScroll() {
    const lp = document.getElementById('landing-page');
    const nav = document.querySelector('.landing-nav');
    if (!lp || !nav) return;
    lp.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', lp.scrollTop > 40);
    });
  }
  // Try immediately and also after DOM ready
  attachNavScroll();
  document.addEventListener('DOMContentLoaded', attachNavScroll);
})();

function enterDashboard() {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  // Clean URL hash to avoid 'file://' security warnings
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }
  setTimeout(() => { showPage('overview'); }, 100);
}

// ===================== PAGE NAVIGATION =====================
const pageTitles = {
  overview: 'Dashboard Overview', heatmap: 'Crime Hotspot Map',
  district: 'District Analysis', 'crime-types': 'Crime Categories',
  trends: 'Crime Trends', vulnerable: 'Vulnerable Groups',
  'ai-prediction': '🧠 AI Prediction Engine', 'ai-assistant': '🤖 AI Copilot',
  alerts: '🚨 Alert Center', simulator: '🎮 Digital Twin Simulator',
  explainability: '🔬 AI Explainability', team: 'Our Team'
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById(`page-${name}`);
  if (pg) pg.classList.add('active');
  const nav = document.getElementById(`nav-${name}`);
  if (nav) nav.classList.add('active');
  document.getElementById('page-title').textContent = pageTitles[name] || name;
  setTimeout(() => {
    const init = {
      overview: initOverview, heatmap: initHeatmap, district: initDistrictPage,
      'crime-types': initCrimeTypes, trends: initTrends, vulnerable: initVulnerable,
      'ai-prediction': initAIPrediction, 'ai-assistant': () => {},
      alerts: initAlerts, simulator: initSimulator,
      explainability: initExplainability, team: initTeam
    };
    if (init[name]) init[name]();
  }, 80);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  const isMobile = window.innerWidth <= 900;
  if (isMobile) {
    sidebar.classList.toggle('collapsed');
    // Show/hide backdrop
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) backdrop.classList.toggle('visible', !sidebar.classList.contains('collapsed'));
  } else {
    sidebar.classList.toggle('collapsed');
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '64px' : '';
    }
  }
  if (menuBtn) menuBtn.classList.toggle('open');
}

function closeSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar && !sidebar.classList.contains('collapsed')) {
    sidebar.classList.add('collapsed');
    if (menuBtn) menuBtn.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
  }
}

function setMobActive(el) {
  document.querySelectorAll('.mob-nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
}


// ===================== COUNTER ANIMATION =====================
function animateCounter(el, target) {
  const dur = 1800; const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function runCounters() {
  document.querySelectorAll('.kpi-val[data-target]').forEach(el => animateCounter(el, +el.dataset.target));
}

// ===================== OVERVIEW PAGE =====================
function initOverview() {
  runCounters();
  initDistrictBarChart();
  initCrimeDonut();
  initMonthlyChart();
  initHeatmapChart();
}

let districtMode = 'ipc';
function initDistrictBarChart() {
  dc('districtChart');
  const top10 = [...CRIME_DATA.districts].sort((a,b) => b[districtMode]-a[districtMode]).slice(0,10);
  const ctx = document.getElementById('districtChart').getContext('2d');
  charts.districtChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top10.map(d => d.name.length>14?d.name.substring(0,14)+'…':d.name),
      datasets: [{ data: top10.map(d=>d[districtMode]),
        backgroundColor: top10.map((_,i)=>i===0?hx(C.purple,.9):hx(C.blue,.6)),
        borderColor: top10.map((_,i)=>i===0?C.purple:C.blue),
        borderWidth:1.5, borderRadius:8, borderSkipped:false }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false},
      tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,
        callbacks:{label:c=>`  ${c.parsed.y.toLocaleString('en-IN')} crimes`}}},
      scales:{ x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}},
        y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11},callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v}} } }
  });
}
function updateDistrictChart(mode, btn) {
  districtMode = mode;
  document.querySelectorAll('.ctrl-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  initDistrictBarChart();
}

function initCrimeDonut() {
  dc('crimeDonut');
  const data = [
    {label:'Theft',val:20531},{label:'Non-Fatal Acc.',val:31751},{label:'Hurt',val:16713},
    {label:'Fatal Accidents',val:11408},{label:'Molestation',val:5840},{label:'Cheating',val:5839},
    {label:'Public Safety',val:5240},{label:'Kidnapping',val:4209},{label:'Others',val:37086}
  ];
  const palette=[C.purple,C.blue,C.emerald,C.amber,C.pink,C.cyan,C.red,C.violet,'#475569'];
  charts.crimeDonut = new Chart(document.getElementById('crimeDonut').getContext('2d'), {
    type:'doughnut',
    data:{labels:data.map(d=>d.label),datasets:[{data:data.map(d=>d.val),backgroundColor:palette,borderColor:'#111827',borderWidth:3,hoverOffset:8}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{
      legend:{position:'bottom',labels:{padding:10,font:{size:10},color:'#94a3b8',usePointStyle:true,pointStyleWidth:8}},
      tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}}}
  });
}

function initMonthlyChart() {
  dc('monthlyChart');
  const top6 = CRIME_DATA.monthlyComparison.slice(0,6);
  charts.monthlyChart = new Chart(document.getElementById('monthlyChart').getContext('2d'), {
    type:'bar',
    data:{labels:top6.map(d=>d.crime),datasets:[
      {label:'Current Month',data:top6.map(d=>d.currentMonth),backgroundColor:hx(C.purple,.8),borderRadius:5,borderSkipped:false},
      {label:'Prev Month',data:top6.map(d=>d.prevMonth),backgroundColor:hx(C.blue,.6),borderRadius:5,borderSkipped:false},
      {label:'Prev Year',data:top6.map(d=>d.prevYearMonth),backgroundColor:hx(C.emerald,.5),borderRadius:5,borderSkipped:false}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{
      legend:{position:'bottom',labels:{font:{size:10},color:'#94a3b8',usePointStyle:true,padding:8}},
      tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10}}},
        y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}}}}
  });
}

function initHeatmapChart() {
  dc('heatmapChart');
  const crimes=[{l:'Non-Fatal Accidents',v:31751},{l:'Theft',v:20531},{l:'Hurt',v:16713},{l:'Fatal Accidents',v:11408},{l:'Molestation',v:5840},{l:'Cheating',v:5839},{l:'Public Safety',v:5240},{l:'Kidnapping',v:4209},{l:'Negligent Act',v:3921},{l:'Riots',v:3391},{l:'Attempt Murder',v:3258},{l:'Cruelty-Husband',v:2830},{l:'Criminal Trespass',v:2794}];
  const max=crimes[0].v;
  charts.heatmapChart = new Chart(document.getElementById('heatmapChart').getContext('2d'),{
    type:'bar',
    data:{labels:crimes.map(c=>c.l),datasets:[{data:crimes.map(c=>c.v),
      backgroundColor:crimes.map(c=>{const r=c.v/max;return r>.8?hx(C.red,.85):r>.5?hx(C.amber,.8):r>.25?hx(C.purple,.75):hx(C.blue,.65)}),
      borderWidth:1.5,borderRadius:6,borderSkipped:false}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},
      tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,
        callbacks:{label:c=>`  ${c.parsed.x.toLocaleString('en-IN')} cases`}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v}},
        y:{grid:{display:false},ticks:{color:'#e2e8f0',font:{size:11}}}}}
  });
}

// ===================== KARNATAKA HEATMAP =====================
let heatLayer='ipc', selectedDistrict=null;

const DISTRICT_POSITIONS = [
  {name:'Bengaluru City',x:.55,y:.72},{name:'Mysuru City',x:.4,y:.82},{name:'Hubballi Dharwad City',x:.22,y:.44},
  {name:'Mangaluru City',x:.1,y:.78},{name:'Belagavi City',x:.18,y:.32},{name:'Kalaburagi City',x:.65,y:.38},
  {name:'Bengaluru Dist',x:.58,y:.65},{name:'Bengaluru South',x:.55,y:.68},{name:'Tumakuru',x:.48,y:.62},
  {name:'Kolar',x:.62,y:.66},{name:'Chickballapura',x:.58,y:.58},{name:'K.G.F',x:.65,y:.68},
  {name:'Chitradurga',x:.38,y:.52},{name:'Davanagere',x:.32,y:.48},{name:'Shivamogga',x:.26,y:.58},
  {name:'Haveri',x:.24,y:.44},{name:'Dakshina Kannada',x:.15,y:.82},{name:'Udupi',x:.08,y:.72},
  {name:'Chikkamagaluru',x:.22,y:.68},{name:'Uttara Kannada',x:.14,y:.5},
  {name:'Belagavi Dist',x:.2,y:.3},{name:'Bagalkot',x:.28,y:.38},{name:'Vijayapur',x:.38,y:.28},
  {name:'Dharwad',x:.22,y:.4},{name:'Gadag',x:.3,y:.4},
  {name:'Kalaburagi',x:.64,y:.35},{name:'Bidar',x:.68,y:.22},{name:'Yadgir',x:.62,y:.45},
  {name:'Mysuru Dist',x:.4,y:.8},{name:'Mandya',x:.44,y:.75},{name:'Chamarajanagar',x:.42,y:.9},
  {name:'Hassan',x:.32,y:.72},{name:'Kodagu',x:.28,y:.82},
  {name:'Ballari',x:.5,y:.44},{name:'Koppal',x:.46,y:.38},{name:'Raichur',x:.58,y:.3},
  {name:'Vijayanagara',x:.45,y:.48},{name:'Karnataka Railways',x:.5,y:.5}
];

function initHeatmap() {
  renderTopRiskList();
  renderSafeList();
  drawKarnatakaMap();
}

function setHeatLayer(layer, btn) {
  heatLayer = layer;
  document.querySelectorAll('.hmap-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  drawKarnatakaMap();
}

function getDistrictValue(d) {
  if (heatLayer === 'ipc') return d.ipc;
  if (heatLayer === 'sll') return d.sll;
  return Math.round(d.ipc * 0.6 + d.sll * 0.4);
}

function getRiskColor(ratio) {
  if (ratio > 0.7) return {color:'#ef4444',label:'Critical',bg:'rgba(239,68,68,0.2)'};
  if (ratio > 0.4) return {color:'#f97316',label:'High',bg:'rgba(249,115,22,0.2)'};
  if (ratio > 0.15) return {color:'#f59e0b',label:'Moderate',bg:'rgba(245,158,11,0.2)'};
  return {color:'#10b981',label:'Safe',bg:'rgba(16,185,129,0.2)'};
}

function drawKarnatakaMap() {
  const canvas = document.getElementById('karnatakaMap');
  if (!canvas || canvas.tagName !== 'CANVAS') return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  if (isDark) {
    bgGrad.addColorStop(0, '#0d1117');
    bgGrad.addColorStop(1, '#111827');
  } else {
    bgGrad.addColorStop(0, '#f0f4ff');
    bgGrad.addColorStop(1, '#e8edf5');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 12; i++) {
    ctx.beginPath(); ctx.moveTo(i*(W/12), 0); ctx.lineTo(i*(W/12), H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i*(H/12)); ctx.lineTo(W, i*(H/12)); ctx.stroke();
  }

  // Karnataka outline (simplified polygon boundary)
  const outline = [
    [0.12,0.08],[0.28,0.04],[0.42,0.06],[0.58,0.05],[0.72,0.12],[0.82,0.18],
    [0.92,0.28],[0.96,0.40],[0.94,0.55],[0.88,0.65],[0.82,0.72],[0.76,0.80],
    [0.68,0.92],[0.58,0.97],[0.46,0.98],[0.36,0.94],[0.28,0.88],[0.18,0.82],
    [0.08,0.76],[0.04,0.64],[0.02,0.50],[0.04,0.35],[0.08,0.22],[0.12,0.08]
  ];

  // Draw Karnataka outline glow
  ctx.beginPath();
  outline.forEach(([x,y],i) => { i===0 ? ctx.moveTo(x*W, y*H) : ctx.lineTo(x*W, y*H); });
  ctx.closePath();
  ctx.strokeStyle = isDark ? 'rgba(168,85,247,0.25)' : 'rgba(124,58,237,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = isDark ? 'rgba(168,85,247,0.04)' : 'rgba(124,58,237,0.03)';
  ctx.fill();

  // State/region boundary lines (simulated district borders)
  const regionBorders = [
    [[0.2,0.48],[0.38,0.42],[0.52,0.38],[0.68,0.35]],
    [[0.52,0.38],[0.55,0.58],[0.52,0.72]],
    [[0.38,0.42],[0.38,0.58],[0.36,0.74]],
    [[0.2,0.48],[0.22,0.62],[0.2,0.78]],
    [[0.14,0.30],[0.38,0.28],[0.52,0.38]],
  ];
  ctx.setLineDash([4, 6]);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  regionBorders.forEach(pts => {
    ctx.beginPath();
    pts.forEach(([x,y],i) => i===0 ? ctx.moveTo(x*W,y*H) : ctx.lineTo(x*W,y*H));
    ctx.stroke();
  });
  ctx.setLineDash([]);

  const districts = CRIME_DATA.districts.filter(d => d.name !== 'STATE');
  const values = districts.map(d => getDistrictValue(d));
  const maxVal = Math.max(...values);

  // Draw subtle connection network
  DISTRICT_POSITIONS.forEach((p, i) => {
    DISTRICT_POSITIONS.slice(i+1, i+3).forEach(q => {
      const dp = CRIME_DATA.districts.find(d => d.name === p.name);
      if (!dp) return;
      const ratio = getDistrictValue(dp) / maxVal;
      ctx.beginPath();
      ctx.strokeStyle = isDark
        ? `rgba(168,85,247,${ratio * 0.06})`
        : `rgba(124,58,237,${ratio * 0.05})`;
      ctx.lineWidth = 0.5;
      ctx.moveTo(p.x*(W-80)+40, p.y*(H-80)+40);
      ctx.lineTo(q.x*(W-80)+40, q.y*(H-80)+40);
      ctx.stroke();
    });
  });

  // Draw district nodes
  DISTRICT_POSITIONS.forEach(pos => {
    const dist = CRIME_DATA.districts.find(d => d.name === pos.name);
    if (!dist) return;
    const val = getDistrictValue(dist);
    const ratio = val / maxVal;
    const { color, label } = getRiskColor(ratio);
    const x = pos.x * (W-80) + 40;
    const y = pos.y * (H-80) + 40;
    const r = Math.max(9, Math.min(30, 9 + ratio * 26));

    // Outer glow rings for critical/high risk
    if (ratio > 0.4) {
      const rings = ratio > 0.7 ? 3 : 2;
      for (let ri = rings; ri >= 1; ri--) {
        ctx.beginPath();
        ctx.arc(x, y, r * (1.5 + ri * 0.7), 0, Math.PI * 2);
        ctx.strokeStyle = color + Math.round((0.08 / ri) * 255).toString(16).padStart(2,'0');
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Radial gradient fill
    const grad = ctx.createRadialGradient(x - r*0.3, y - r*0.3, 0, x, y, r * 2.2);
    grad.addColorStop(0, color + 'dd');
    grad.addColorStop(0.6, color + '88');
    grad.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();

    // Main circle
    const nodeGrad = ctx.createRadialGradient(x - r*0.25, y - r*0.25, r*0.1, x, y, r);
    nodeGrad.addColorStop(0, color + 'ff');
    nodeGrad.addColorStop(1, color + 'aa');
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = nodeGrad; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = ratio > 0.4 ? 1.5 : 1; ctx.stroke();

    // Inner highlight dot
    ctx.beginPath(); ctx.arc(x - r*0.28, y - r*0.28, r*0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();

    // Labels for prominent districts
    const isMajor = ratio > 0.28 || dist.name === 'Bengaluru City' || dist.name === 'Mysuru City';
    if (isMajor) {
      const shortName = dist.name.replace(' City','').replace(' Dist','').split(' ')[0];
      const fontSize = dist.name === 'Bengaluru City' ? 12 : 10;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      // Text shadow
      ctx.fillStyle = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
      ctx.fillText(shortName, x+1, y + r + 14);
      ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
      ctx.fillText(shortName, x, y + r + 13);

      // Crime count for top districts
      if (ratio > 0.5) {
        ctx.font = `500 9px Inter, sans-serif`;
        ctx.fillStyle = isDark ? 'rgba(241,245,249,0.6)' : 'rgba(15,23,42,0.6)';
        ctx.fillText(val.toLocaleString('en-IN'), x, y + r + 24);
      }
    }
  });

  // Highlight selected
  if (selectedDistrict) {
    const pos = DISTRICT_POSITIONS.find(p => p.name === selectedDistrict.name);
    if (pos) {
      const x = pos.x*(W-80)+40, y = pos.y*(H-80)+40;
      ctx.beginPath(); ctx.arc(x, y, 36, 0, Math.PI*2);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
      ctx.setLineDash([6,3]); ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Compass rose in bottom-left
  const cx = 52, cy = H - 52;
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  ctx.fillText('N', cx, cy - 18);
  ctx.fillText('S', cx, cy + 24);
  ctx.fillText('W', cx - 20, cy + 4);
  ctx.fillText('E', cx + 20, cy + 4);
  ctx.beginPath();
  ctx.moveTo(cx, cy-14); ctx.lineTo(cx-5, cy+5); ctx.lineTo(cx, cy+2); ctx.lineTo(cx+5, cy+5); ctx.closePath();
  ctx.fillStyle = isDark ? 'rgba(168,85,247,0.7)' : 'rgba(124,58,237,0.6)';
  ctx.fill();

  // Scale bar
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)';
  ctx.fillRect(W-110, H-28, 80, 3);
  ctx.font = '9px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('~400 km', W-70, H-14);

  // Setup hover/click
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width, scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const tooltip = document.getElementById('map-tooltip');
    let found = false;
    DISTRICT_POSITIONS.forEach(pos => {
      const dist = CRIME_DATA.districts.find(d => d.name === pos.name);
      if (!dist) return;
      const x = pos.x*(W-80)+40, y = pos.y*(H-80)+40;
      const ratio = getDistrictValue(dist)/maxVal;
      const r = Math.max(9, Math.min(30, 9 + ratio * 26));
      const dx = mx - x, dy = my - y;
      if (Math.sqrt(dx*dx+dy*dy) < r + 8) {
        found = true;
        const { color, label } = getRiskColor(ratio);
        tooltip.classList.remove('hidden');
        tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
        tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
        tooltip.innerHTML = `<div style="font-weight:700;font-size:13px;margin-bottom:5px">${dist.name}</div>
          <div style="font-size:11px;color:${color};font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></span>${label} Risk</div>
          <div style="font-size:12px;color:var(--txt2);margin-bottom:2px">IPC/BNS: <strong style="color:var(--txt)">${dist.ipc.toLocaleString('en-IN')}</strong></div>
          <div style="font-size:12px;color:var(--txt2);margin-bottom:2px">SLL: <strong style="color:var(--txt)">${dist.sll.toLocaleString('en-IN')}</strong></div>
          <div style="font-size:12px;color:var(--txt2)">Total: <strong style="color:var(--txt)">${(dist.ipc+dist.sll).toLocaleString('en-IN')}</strong></div>`;
      }
    });
    if (!found) { tooltip.classList.add('hidden'); canvas.style.cursor = 'crosshair'; }
    else canvas.style.cursor = 'pointer';
  };

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width, scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    DISTRICT_POSITIONS.forEach(pos => {
      const dist = CRIME_DATA.districts.find(d => d.name === pos.name);
      if (!dist) return;
      const x = pos.x*(W-80)+40, y = pos.y*(H-80)+40;
      const ratio = getDistrictValue(dist)/maxVal;
      const r = Math.max(9, Math.min(30, 9 + ratio * 26));
      if (Math.sqrt((mx-x)**2 + (my-y)**2) < r + 8) {
        selectedDistrict = dist;
        showDistrictInfo(dist);
        drawKarnatakaMap();
      }
    });
  };
}

function showDistrictInfo(dist) {

  const val=getDistrictValue(dist), max=Math.max(...CRIME_DATA.districts.map(d=>getDistrictValue(d)));
  const ratio=val/max;
  const {color,label}=getRiskColor(ratio);
  document.getElementById('selected-district-info').innerHTML=`
    <div class="dist-info-name">${dist.name}</div>
    <div class="dist-info-range">${dist.range}</div>
    <div class="dist-info-stats">
      <div class="dis"><div class="dis-val">${dist.ipc.toLocaleString('en-IN')}</div><div class="dis-lbl">IPC/BNS Crimes</div></div>
      <div class="dis"><div class="dis-val">${dist.sll.toLocaleString('en-IN')}</div><div class="dis-lbl">SLL Crimes</div></div>
      <div class="dis"><div class="dis-val">${(dist.ipc+dist.sll).toLocaleString('en-IN')}</div><div class="dis-lbl">Total</div></div>
      <div class="dis"><div class="dis-val">${((dist.ipc/CRIME_DATA.stateTotals.ipc)*100).toFixed(1)}%</div><div class="dis-lbl">State Share</div></div>
    </div>
    <div class="risk-bar-wrap">
      <div class="risk-bar-label"><span>Risk Level</span><span style="color:${color};font-weight:700">${label}</span></div>
      <div class="risk-bar-bg"><div class="risk-bar-fill" style="width:${Math.round(ratio*100)}%;background:${color}"></div></div>
    </div>`;
}

function renderTopRiskList() {
  const sorted=[...CRIME_DATA.districts].sort((a,b)=>b.ipc-a.ipc).slice(0,5);
  const max=sorted[0].ipc;
  document.getElementById('top-risk-list').innerHTML=sorted.map((d,i)=>{
    const {color}=getRiskColor(d.ipc/max);
    return `<div class="top-risk-item"><span class="risk-rank">${i+1}</span><span class="risk-name">${d.name}</span><span class="risk-score-pill" style="background:${color}20;color:${color}">${d.ipc.toLocaleString('en-IN')}</span></div>`;
  }).join('');
}

function renderSafeList() {
  const sorted=[...CRIME_DATA.districts].filter(d=>d.ipc>0).sort((a,b)=>a.ipc-b.ipc).slice(0,5);
  document.getElementById('safe-list').innerHTML=sorted.map((d,i)=>`
    <div class="safe-item"><span class="risk-rank">${i+1}</span><span class="risk-name">${d.name}</span><span class="risk-score-pill" style="background:rgba(16,185,129,.15);color:#10b981">${d.ipc.toLocaleString('en-IN')}</span></div>`).join('');
}

// ===================== DISTRICT PAGE =====================
function initDistrictPage() {
  renderDistrictTable(CRIME_DATA.districts);
  initDistrictStackedChart(CRIME_DATA.districts);
  initRangePieChart();
}

function filterRange(range, btn) {
  document.querySelectorAll('.range-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = range==='all' ? CRIME_DATA.districts : CRIME_DATA.districts.filter(d=>d.range===range);
  renderDistrictTable(filtered);
  initDistrictStackedChart(filtered);
}

function initDistrictStackedChart(data) {
  dc('districtStackedChart');
  const sorted=[...data].filter(d=>d.ipc>0).sort((a,b)=>(b.ipc+b.sll)-(a.ipc+a.sll)).slice(0,20);
  charts.districtStackedChart=new Chart(document.getElementById('districtStackedChart').getContext('2d'),{
    type:'bar',
    data:{labels:sorted.map(d=>d.name),datasets:[
      {label:'IPC/BNS',data:sorted.map(d=>d.ipc),backgroundColor:hx(C.purple,.8),borderRadius:4,stack:'s'},
      {label:'SLL',data:sorted.map(d=>d.sll),backgroundColor:hx(C.blue,.7),borderRadius:4,stack:'s'}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{
      legend:{position:'top',labels:{font:{size:12},color:'#94a3b8',usePointStyle:true}},
      tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{stacked:true,grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},maxRotation:45}},
        y:{stacked:true,grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11},callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v}}}}
  });
}

function initRangePieChart() {
  dc('rangePieChart');
  const ranges=['Commissionerates','Central Range','Eastern Range','Western Range','Northern Range','North Eastern Range','Southern Range','Ballari Range'];
  const totals=ranges.map(r=>({name:r.replace(' Range','').replace('Commissionerates','Commiss.'),ipc:CRIME_DATA.districts.filter(d=>d.range===r).reduce((s,d)=>s+d.ipc,0)}));
  const palette=[C.purple,C.blue,C.emerald,C.amber,C.pink,C.cyan,C.red,C.orange];
  charts.rangePieChart=new Chart(document.getElementById('rangePieChart').getContext('2d'),{
    type:'pie',
    data:{labels:totals.map(r=>r.name),datasets:[{data:totals.map(r=>r.ipc),backgroundColor:palette,borderColor:'#111827',borderWidth:2,hoverOffset:6}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},color:'#94a3b8',usePointStyle:true,padding:8}},
      tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}}}
  });
}

let districtSortCol='total', districtSortDir=1;
function sortDistricts(col) {
  if(districtSortCol===col) districtSortDir*=-1; else districtSortDir=1;
  districtSortCol=col;
  renderDistrictTable(CRIME_DATA.districts);
}

function renderDistrictTable(data) {
  const maxIpc=Math.max(...CRIME_DATA.districts.map(d=>d.ipc));
  const body=document.getElementById('districtTableBody');
  const sorted=[...data].filter(d=>d.name!=='STATE').sort((a,b)=>{
    const va=districtSortCol==='ipc'?a.ipc:districtSortCol==='sll'?a.sll:a.ipc+a.sll;
    const vb=districtSortCol==='ipc'?b.ipc:districtSortCol==='sll'?b.sll:b.ipc+b.sll;
    return (vb-va)*districtSortDir;
  });
  body.innerHTML=sorted.map(d=>{
    const total=d.ipc+d.sll, share=((d.ipc/CRIME_DATA.stateTotals.ipc)*100).toFixed(1), barW=Math.round((d.ipc/maxIpc)*100);
    let risk='Low',rc='risk-low';
    if(d.ipc>10000){risk='Critical';rc='risk-critical';}
    else if(d.ipc>4000){risk='High';rc='risk-high';}
    else if(d.ipc>2000){risk='Medium';rc='risk-medium';}
    return `<tr><td class="district-name">${d.name}</td>
      <td><span class="range-tag">${d.range.replace(' Range','').replace('Commissionerates','Commiss.')}</span></td>
      <td><div class="crime-bar-wrap"><div class="crime-bar" style="width:${Math.max(barW,4)}px;max-width:100px"></div><span>${d.ipc.toLocaleString('en-IN')}</span></div></td>
      <td>${d.sll.toLocaleString('en-IN')}</td>
      <td style="font-weight:600;color:#f1f5f9">${total.toLocaleString('en-IN')}</td>
      <td style="color:#a855f7;font-weight:600">${share}%</td>
      <td><span class="risk-badge ${rc}">${risk}</span></td></tr>`;
  }).join('');
}

function filterTable(q) {
  const filtered=q?CRIME_DATA.districts.filter(d=>d.name.toLowerCase().includes(q.toLowerCase())):CRIME_DATA.districts;
  renderDistrictTable(filtered);
}

// ===================== CRIME TYPES =====================
function initCrimeTypes() {
  initCategoryBarChart(); initMurderChart(); initTheftChart(); initAccidentChart();
}
function initCategoryBarChart() {
  dc('categoryBarChart');
  const cats=[...CRIME_DATA.ipcCrimes].sort((a,b)=>b.total-a.total).slice(0,14);
  const palette=[C.red,C.orange,C.amber,C.purple,C.pink,C.blue,C.emerald,C.cyan,C.violet,'#14b8a6','#84cc16','#f43f5e','#6366f1','#0ea5e9'];
  charts.categoryBarChart=new Chart(document.getElementById('categoryBarChart').getContext('2d'),{
    type:'bar',
    data:{labels:cats.map(c=>c.category),datasets:[{data:cats.map(c=>c.total),
      backgroundColor:cats.map((_,i)=>hx(palette[i%palette.length],.8)),
      borderColor:cats.map((_,i)=>palette[i%palette.length]),borderWidth:1.5,borderRadius:8,borderSkipped:false}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},
      tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,callbacks:{label:c=>`  ${c.parsed.x.toLocaleString('en-IN')} cases`}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v}},
        y:{grid:{display:false},ticks:{color:'#e2e8f0',font:{size:11}}}}}
  });
}
function initMurderChart() {
  dc('murderChart');
  const murder=CRIME_DATA.ipcCrimes.find(c=>c.category==='Murder');
  const sc=murder.subcats.slice(0,8);
  charts.murderChart=new Chart(document.getElementById('murderChart').getContext('2d'),{
    type:'doughnut',
    data:{labels:sc.map(s=>s.name),datasets:[{data:sc.map(s=>s.val),backgroundColor:[C.red,C.orange,C.amber,C.pink,C.purple,C.blue,C.emerald,'#475569'],borderColor:'#111827',borderWidth:3,hoverOffset:8}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom',labels:{font:{size:10},color:'#94a3b8',usePointStyle:true,padding:6}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}}}
  });
}
function initTheftChart() {
  dc('theftChart');
  const theft=CRIME_DATA.ipcCrimes.find(c=>c.category==='Theft');
  const sc=theft.subcats.slice(0,10);
  charts.theftChart=new Chart(document.getElementById('theftChart').getContext('2d'),{
    type:'bar',
    data:{labels:sc.map(s=>s.name.length>16?s.name.substring(0,16)+'…':s.name),datasets:[{data:sc.map(s=>s.val),backgroundColor:hx(C.purple,.8),borderColor:C.purple,borderWidth:1.5,borderRadius:6,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,callbacks:{label:c=>`  ${c.parsed.y.toLocaleString('en-IN')} cases`}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},maxRotation:40}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v}}}}
  });
}
function initAccidentChart() {
  dc('accidentChart');
  const fatal=CRIME_DATA.ipcCrimes.find(c=>c.category==='Fatal Road Accidents');
  const nf=CRIME_DATA.ipcCrimes.find(c=>c.category==='Non-Fatal Road Accidents');
  charts.accidentChart=new Chart(document.getElementById('accidentChart').getContext('2d'),{
    type:'bar',
    data:{labels:['National Highways','State Highways','Other Roads','Other Places'],datasets:[
      {label:'Fatal',data:fatal.subcats.map(s=>s.val),backgroundColor:hx(C.red,.8),borderColor:C.red,borderWidth:1.5,borderRadius:6},
      {label:'Non-Fatal',data:nf.subcats.map(s=>s.val),backgroundColor:hx(C.amber,.7),borderColor:C.amber,borderWidth:1.5,borderRadius:6}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:12},color:'#94a3b8',usePointStyle:true}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11},callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v}}}}
  });
}

// ===================== TRENDS =====================
function initTrends() {
  initTrendRadar(); initTrendLine(); initMoversChart(); buildYtdGrid();
}
function initTrendRadar() {
  dc('trendRadarChart');
  const data=CRIME_DATA.monthlyComparison.slice(0,8);
  charts.trendRadarChart=new Chart(document.getElementById('trendRadarChart').getContext('2d'),{
    type:'radar',
    data:{labels:data.map(d=>d.crime),datasets:[
      {label:'Current Month',data:data.map(d=>d.currentMonth),borderColor:C.purple,backgroundColor:hx(C.purple,.15),pointBackgroundColor:C.purple,borderWidth:2,pointRadius:4},
      {label:'Prev Month',data:data.map(d=>d.prevMonth),borderColor:C.blue,backgroundColor:hx(C.blue,.1),pointBackgroundColor:C.blue,borderWidth:2,pointRadius:4},
      {label:'Prev Year',data:data.map(d=>d.prevYearMonth),borderColor:C.emerald,backgroundColor:hx(C.emerald,.08),pointBackgroundColor:C.emerald,borderWidth:2,pointRadius:4}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},color:'#94a3b8',usePointStyle:true}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{r:{grid:{color:'rgba(255,255,255,.08)'},ticks:{color:'#94a3b8',backdropColor:'transparent',font:{size:9}},pointLabels:{color:'#e2e8f0',font:{size:11,weight:'500'}}}}}
  });
}
function initTrendLine() {
  dc('trendLineChart');
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const ytd=[11000,22500,34200,46800,58100,70500,82900,95000,107500,119800,128000,138666];
  const prev=[10500,21200,32800,44500,55600,67800,79500,91200,103000,114000,123500,133000];
  const ctx=document.getElementById('trendLineChart').getContext('2d');
  const g=ctx.createLinearGradient(0,0,0,280); g.addColorStop(0,hx(C.purple,.3)); g.addColorStop(1,hx(C.purple,0));
  charts.trendLineChart=new Chart(ctx,{type:'line',
    data:{labels:months,datasets:[
      {label:'2025 Cumulative',data:ytd,borderColor:C.purple,backgroundColor:g,fill:true,tension:.4,pointBackgroundColor:C.purple,pointRadius:4},
      {label:'2024 Cumulative',data:prev,borderColor:C.blue,backgroundColor:'transparent',fill:false,tension:.4,pointBackgroundColor:C.blue,pointRadius:3,borderDash:[5,4]}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:12},color:'#94a3b8',usePointStyle:true}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11},callback:v=>v>=1000?(v/1000).toFixed(0)+'K':v}}}}
  });
}
function initMoversChart() {
  dc('moversChart');
  const movers=[{crime:'Cheating',change:+14.2},{crime:'Molestation',change:+6.6},{crime:'Dowry Deaths',change:+10.5},{crime:'Fatal Accidents',change:+1.3},{crime:'Robbery',change:-3.2},{crime:'Dacoity',change:-8.4},{crime:'Human Trafficking',change:-25.0},{crime:'Eve Teasing',change:+6.0}].sort((a,b)=>Math.abs(b.change)-Math.abs(a.change));
  charts.moversChart=new Chart(document.getElementById('moversChart').getContext('2d'),{
    type:'bar',
    data:{labels:movers.map(m=>m.crime),datasets:[{data:movers.map(m=>m.change),backgroundColor:movers.map(m=>hx(m.change>0?C.red:C.emerald,.8)),borderColor:movers.map(m=>m.change>0?C.red:C.emerald),borderWidth:1.5,borderRadius:6,borderSkipped:false}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,callbacks:{label:c=>`  ${c.parsed.x>0?'+':''}${c.parsed.x}% vs 2024`}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11},callback:v=>v+'%'}},y:{grid:{display:false},ticks:{color:'#e2e8f0',font:{size:11}}}}}
  });
}
function buildYtdGrid() {
  const items=[{name:'Murder',change:'+1.2%',dir:'up'},{name:'Rape',change:'-2.4%',dir:'down'},{name:'Theft',change:'+3.8%',dir:'up'},{name:'Cheating',change:'+14.2%',dir:'up'},{name:'Molestation',change:'+6.6%',dir:'up'},{name:'Dacoity',change:'-8.4%',dir:'down'},{name:'Robbery',change:'-3.2%',dir:'down'},{name:'Riots',change:'+2.1%',dir:'up'}];
  document.getElementById('ytdGrid').innerHTML=items.map(i=>`<div class="kpi-mini"><span class="kpi-mini-name">${i.name}</span><span class="kpi-mini-change ${i.dir==='up'?'kpi-mini-up':'kpi-mini-down'}">${i.change}</span></div>`).join('');
}

// ===================== VULNERABLE GROUPS =====================
function initVulnerable() {
  runCounters();
  initWomenChart(); initChildrenChart(); initScstChart(); initDomesticChart();
}
function initWomenChart() {
  dc('womenChart');
  const data=CRIME_DATA.womenCrimes;
  charts.womenChart=new Chart(document.getElementById('womenChart').getContext('2d'),{
    type:'bar',
    data:{labels:data.map(d=>d.crime),datasets:[
      {label:'2024',data:data.map(d=>d.y2024),backgroundColor:hx(C.blue,.7),borderRadius:5,borderSkipped:false},
      {label:'2025',data:data.map(d=>d.y2025),backgroundColor:hx(C.pink,.8),borderRadius:5,borderSkipped:false}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:12},color:'#94a3b8',usePointStyle:true}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},maxRotation:35}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}}}}
  });
}
function initChildrenChart() {
  dc('childrenChart');
  const data=CRIME_DATA.childrenCrimes.filter(d=>d.val>0);
  charts.childrenChart=new Chart(document.getElementById('childrenChart').getContext('2d'),{
    type:'doughnut',
    data:{labels:data.map(d=>d.crime),datasets:[{data:data.map(d=>d.val),backgroundColor:[C.amber,C.orange,C.red,C.pink,C.purple,C.blue,C.emerald,C.cyan],borderColor:'#111827',borderWidth:3,hoverOffset:8}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{position:'bottom',labels:{font:{size:10},color:'#94a3b8',usePointStyle:true,padding:8}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}}}
  });
}
function initScstChart() {
  dc('scstChart');
  const data=CRIME_DATA.scstCrimes;
  charts.scstChart=new Chart(document.getElementById('scstChart').getContext('2d'),{
    type:'bar',
    data:{labels:data.map(d=>d.crime),datasets:[{data:data.map(d=>d.val),backgroundColor:data.map((_,i)=>hx([C.violet,C.purple,C.blue,C.emerald,C.amber,C.red,C.pink,C.cyan][i],.8)),borderRadius:6,borderSkipped:false,borderWidth:1.5,borderColor:[C.violet,C.purple,C.blue,C.emerald,C.amber,C.red,C.pink,C.cyan]}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},maxRotation:35}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}}}}
  });
}
function initDomesticChart() {
  dc('domesticChart');
  const labels=['Husband (Cruelty)','Husband & Relatives','Relatives in Law','Dowry Harassment','Dowry Death (Hanging)','Dowry Death (Other)','Dowry Death (Husband)'];
  const values=[1059,1328,36,407,62,10,2];
  charts.domesticChart=new Chart(document.getElementById('domesticChart').getContext('2d'),{
    type:'bar',
    data:{labels,datasets:[{data:values,backgroundColor:hx(C.pink,.75),borderColor:C.pink,borderWidth:1.5,borderRadius:8,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,callbacks:{label:c=>`  ${c.parsed.y.toLocaleString('en-IN')} cases`}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},maxRotation:35}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}}}}
  });
}

// ===================== AI PREDICTION ENGINE =====================
let predHorizon = '24h';
const predictionData = {
  '24h': [
    {crime:'Theft',predicted:68,baseline:56,change:'+21%',confidence:91,risk:'High',color:'#ef4444'},
    {crime:'Road Accidents',predicted:38,baseline:32,change:'+19%',confidence:87,risk:'High',color:'#f97316'},
    {crime:'Molestation',predicted:18,baseline:16,change:'+13%',confidence:85,risk:'Medium',color:'#ec4899'},
    {crime:'Cheating/Fraud',predicted:22,baseline:19,change:'+16%',confidence:89,risk:'High',color:'#a855f7'},
    {crime:'Robbery',predicted:9,baseline:9,change:'0%',confidence:78,risk:'Medium',color:'#3b82f6'},
    {crime:'Hurt/Assault',predicted:52,baseline:49,change:'+6%',confidence:83,risk:'Medium',color:'#f59e0b'},
    {crime:'Kidnapping',predicted:14,baseline:13,change:'+8%',confidence:81,risk:'Medium',color:'#8b5cf6'},
    {crime:'Murder',predicted:4,baseline:4,change:'0%',confidence:76,risk:'Low',color:'#10b981'},
  ],
  '7d': [
    {crime:'Theft',predicted:476,baseline:392,change:'+21%',confidence:88,risk:'High',color:'#ef4444'},
    {crime:'Road Accidents',predicted:266,baseline:224,change:'+19%',confidence:85,risk:'High',color:'#f97316'},
    {crime:'Molestation',predicted:128,baseline:112,change:'+14%',confidence:83,risk:'Medium',color:'#ec4899'},
    {crime:'Cheating/Fraud',predicted:154,baseline:133,change:'+16%',confidence:87,risk:'High',color:'#a855f7'},
    {crime:'Robbery',predicted:63,baseline:63,change:'0%',confidence:76,risk:'Low',color:'#3b82f6'},
    {crime:'Hurt/Assault',predicted:364,baseline:343,change:'+6%',confidence:81,risk:'Medium',color:'#f59e0b'},
    {crime:'Kidnapping',predicted:98,baseline:91,change:'+8%',confidence:79,risk:'Medium',color:'#8b5cf6'},
    {crime:'Murder',predicted:28,baseline:28,change:'0%',confidence:74,risk:'Low',color:'#10b981'},
  ],
  '30d': [
    {crime:'Theft',predicted:2100,baseline:1709,change:'+23%',confidence:84,risk:'Critical',color:'#ef4444'},
    {crime:'Road Accidents',predicted:1140,baseline:951,change:'+20%',confidence:82,risk:'High',color:'#f97316'},
    {crime:'Molestation',predicted:558,baseline:487,change:'+15%',confidence:80,risk:'High',color:'#ec4899'},
    {crime:'Cheating/Fraud',predicted:660,baseline:567,change:'+16%',confidence:85,risk:'High',color:'#a855f7'},
    {crime:'Robbery',predicted:270,baseline:271,change:'-0.4%',confidence:73,risk:'Low',color:'#3b82f6'},
    {crime:'Hurt/Assault',predicted:1560,baseline:1476,change:'+6%',confidence:79,risk:'Medium',color:'#f59e0b'},
    {crime:'Kidnapping',predicted:427,baseline:351,change:'+22%',confidence:77,risk:'High',color:'#8b5cf6'},
    {crime:'Murder',predicted:122,baseline:101,change:'+21%',confidence:72,risk:'High',color:'#10b981'},
  ]
};

function setPredHorizon(h, btn) {
  predHorizon = h;
  document.querySelectorAll('.pred-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderPredictionCards();
}

function renderPredictionCards() {
  const data = predictionData[predHorizon];
  document.getElementById('prediction-cards-grid').innerHTML = data.map(p => {
    const isUp = p.change.startsWith('+');
    const riskColors = {Critical:'#ef4444',High:'#f97316',Medium:'#f59e0b',Low:'#10b981'};
    const rc = riskColors[p.risk]||'#94a3b8';
    return `<div class="pred-card" style="--pc-color:${p.color}">
      <div class="pred-card-header">
        <div class="pred-crime-name">${p.crime}</div>
        <div class="pred-risk-badge" style="background:${rc}20;color:${rc}">${p.risk}</div>
      </div>
      <div class="pred-val-big">${p.predicted.toLocaleString('en-IN')}</div>
      <div class="pred-change-row">
        <span class="pred-chg ${isUp?'up':'down'}">${p.change}</span>
        <span class="pred-baseline">from ${p.baseline.toLocaleString('en-IN')} baseline</span>
      </div>
      <div class="confidence-wrap">
        <div class="conf-label"><span>AI Confidence</span><span>${p.confidence}%</span></div>
        <div class="conf-bar"><div class="conf-fill" style="width:${p.confidence}%"></div></div>
      </div>
    </div>`;
  }).join('');
}

function initAIPrediction() {
  renderPredictionCards();
  initForecastChart();
  initRiskChart();
  renderVulnerabilityIndex();
}

function initForecastChart() {
  dc('forecastChart');
  const days=Array.from({length:30},(_,i)=>`Day ${i+1}`);
  const baseline=days.map((_,i)=>1400+Math.sin(i/3)*50+i*3);
  const predicted=baseline.map((v,i)=>Math.round(v*(1+0.2*Math.sin(i/5+1)+0.05)));
  const upper=predicted.map(v=>Math.round(v*1.12));
  const lower=predicted.map(v=>Math.round(v*0.88));
  const ctx=document.getElementById('forecastChart').getContext('2d');
  const g=ctx.createLinearGradient(0,0,0,260); g.addColorStop(0,hx(C.purple,.2)); g.addColorStop(1,hx(C.purple,0));
  charts.forecastChart=new Chart(ctx,{type:'line',
    data:{labels:days,datasets:[
      {label:'Predicted',data:predicted,borderColor:C.purple,backgroundColor:g,fill:true,tension:.4,pointRadius:0,borderWidth:2.5},
      {label:'Upper Bound',data:upper,borderColor:hx(C.red,.4),backgroundColor:'transparent',borderDash:[4,4],tension:.4,pointRadius:0,borderWidth:1.5},
      {label:'Lower Bound',data:lower,borderColor:hx(C.emerald,.4),backgroundColor:'transparent',borderDash:[4,4],tension:.4,pointRadius:0,borderWidth:1.5},
      {label:'Baseline',data:baseline,borderColor:hx(C.blue,.6),backgroundColor:'transparent',tension:.4,pointRadius:0,borderWidth:1.5,borderDash:[6,3]}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},color:'#94a3b8',usePointStyle:true}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},maxTicksLimit:10}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}}}}
  });
}

function initRiskChart() {
  dc('riskChart');
  const risk=CRIME_DATA.districts.filter(d=>d.ipc>500).map(d=>({name:d.name,risk:Math.round((d.ipc*.6+d.sll*.4)/100)})).sort((a,b)=>b.risk-a.risk).slice(0,15);
  charts.riskChart=new Chart(document.getElementById('riskChart').getContext('2d'),{
    type:'bar',
    data:{labels:risk.map(d=>d.name.length>14?d.name.substring(0,14)+'…':d.name),datasets:[{data:risk.map(d=>d.risk),backgroundColor:risk.map(d=>d.risk>200?hx(C.red,.85):d.risk>80?hx(C.amber,.8):d.risk>40?hx(C.blue,.75):hx(C.emerald,.7)),borderRadius:6,borderSkipped:false,borderWidth:1}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,callbacks:{label:c=>`  Risk Score: ${c.parsed.y}`}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:10},maxRotation:40}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}},title:{display:true,text:'Risk Score',color:'#475569',font:{size:11}}}}}
  });
}

function renderVulnerabilityIndex() {
  const districts=CRIME_DATA.districts.slice(0,18).map(d=>{
    const score=Math.min(100,Math.round((d.ipc/CRIME_DATA.stateTotals.ipc)*100*8+Math.random()*10));
    const col=score>70?C.red:score>40?C.amber:score>20?C.blue:C.emerald;
    return {name:d.name,score,col};
  });
  document.getElementById('vulnerability-grid').innerHTML=districts.map(d=>`
    <div class="vuln-card">
      <div class="vuln-name">${d.name}</div>
      <div class="vuln-score-wrap">
        <div class="vuln-score" style="color:${d.col}">${d.score}</div>
        <div class="vuln-bar-bg"><div class="vuln-bar-fill" style="width:${d.score}%;background:${d.col}"></div></div>
      </div>
    </div>`).join('');
}

// ===================== AI CHAT ASSISTANT =====================
const chatKnowledge = {
  responses: [
    {keys:['safest','safe','lowest','minimum'],reply:(q)=>{
      const sorted=[...CRIME_DATA.districts].filter(d=>d.ipc>0).sort((a,b)=>a.ipc-b.ipc).slice(0,5);
      return `✅ The <strong>safest districts</strong> in Karnataka (lowest IPC crimes) are:<table class="data-table-in-chat">${sorted.map((d,i)=>`<tr><td class="dt-label">${i+1}. ${d.name}</td><td class="dt-val">${d.ipc.toLocaleString('en-IN')} crimes</td></tr>`).join('')}</table><p style="margin-top:8px">These districts have significantly lower crime rates than the state average of ~3,748 IPC crimes per district.</p>`;
    }},
    {keys:['dangerous','worst','highest','top 5 dangerous','risky'],reply:(q)=>{
      const sorted=[...CRIME_DATA.districts].sort((a,b)=>b.ipc-a.ipc).slice(0,5);
      return `🔴 The <strong>5 highest-crime areas</strong> in Karnataka are:<table class="data-table-in-chat">${sorted.map((d,i)=>`<tr><td class="dt-label">${i+1}. ${d.name}</td><td class="dt-val">${d.ipc.toLocaleString('en-IN')} IPC</td></tr>`).join('')}</table><p style="margin-top:8px">Bengaluru City alone accounts for <strong>26.8%</strong> of all state IPC crimes — a critical intervention zone.</p>`;
    }},
    {keys:['theft','steal','stolen'],reply:(q)=>`🏍️ <strong>Theft Analysis — 2025:</strong><br>Total theft cases: <strong>20,531</strong><table class="data-table-in-chat"><tr><td class="dt-label">Two-Wheeler Theft</td><td class="dt-val">8,860 (43.1%)</td></tr><tr><td class="dt-label">House Theft</td><td class="dt-val">1,936</td></tr><tr><td class="dt-label">Jewellery Theft</td><td class="dt-val">1,478</td></tr><tr><td class="dt-label">Sand Theft</td><td class="dt-val">1,293</td></tr><tr><td class="dt-label">Cattle Theft</td><td class="dt-val">544</td></tr></table><p style="margin-top:8px">📈 Theft has increased <strong>+3.8%</strong> compared to 2024. Two-wheeler theft is the single most prevalent crime sub-category in Karnataka.</p>`},
    {keys:['bengaluru','bangalore','blr'],reply:(q)=>`🏙️ <strong>Bengaluru City Crime Summary 2025:</strong><table class="data-table-in-chat"><tr><td class="dt-label">IPC/BNS Crimes</td><td class="dt-val">37,181</td></tr><tr><td class="dt-label">SLL Crimes</td><td class="dt-val">19,291</td></tr><tr><td class="dt-label">Total Crimes</td><td class="dt-val">56,472</td></tr><tr><td class="dt-label">State IPC Share</td><td class="dt-val">26.8%</td></tr><tr><td class="dt-label">Risk Level</td><td class="dt-val" style="color:#ef4444">Critical</td></tr></table><p style="margin-top:8px">Bengaluru's crime count is <strong>10x higher</strong> than most other districts. The city's size, population density, and economic activity are primary drivers.</p>`},
    {keys:['murder','kill','homicide'],reply:(q)=>`🔴 <strong>Murder Statistics 2025 — Karnataka:</strong><br>Total murders: <strong>1,210</strong><table class="data-table-in-chat"><tr><td class="dt-label">Sudden Quarrel</td><td class="dt-val">96 (most common)</td></tr><tr><td class="dt-label">Other Causes</td><td class="dt-val">829</td></tr><tr><td class="dt-label">Civil Disputes</td><td class="dt-val">49</td></tr><tr><td class="dt-label">Revenge/Enmity</td><td class="dt-val">45</td></tr><tr><td class="dt-label">For Gain</td><td class="dt-val">43</td></tr></table><p style="margin-top:8px">⚠️ Murder rate shows a <strong>+1.2%</strong> increase. "Sudden Quarrel" remains the primary cause — suggests need for community conflict resolution programs.</p>`},
    {keys:['women','rape','molestation','domestic','dowry','sexual'],reply:(q)=>`👩 <strong>Women Safety Analysis 2025:</strong><table class="data-table-in-chat"><tr><td class="dt-label">Molestation</td><td class="dt-val">5,840 (+6.6%)</td></tr><tr><td class="dt-label">Cruelty by Husband</td><td class="dt-val">2,830</td></tr><tr><td class="dt-label">Rape</td><td class="dt-val">656</td></tr><tr><td class="dt-label">Dowry Deaths</td><td class="dt-val">116</td></tr><tr><td class="dt-label">Eve Teasing</td><td class="dt-val">403</td></tr></table><p style="margin-top:8px">⚡ Key insight: <strong>48.3%</strong> of rape cases involve known persons. Molestation in public places accounts for <strong>2,189</strong> cases. Women Safety Index: <strong>68/100</strong>.</p>`},
    {keys:['accident','road','traffic','highway'],reply:(q)=>`🚗 <strong>Road Accident Analysis 2025:</strong><table class="data-table-in-chat"><tr><td class="dt-label">Fatal Accidents</td><td class="dt-val">11,408 deaths</td></tr><tr><td class="dt-label">Non-Fatal Accidents</td><td class="dt-val">31,751 cases</td></tr><tr><td class="dt-label">Other Roads (Fatal)</td><td class="dt-val">4,097 deaths</td></tr><tr><td class="dt-label">NH Fatal</td><td class="dt-val">4,015 deaths</td></tr><tr><td class="dt-label">State Highways</td><td class="dt-val">3,135 deaths</td></tr></table><p style="margin-top:8px">🚨 Road accidents are Karnataka's <strong>#1 mass harm category</strong> — totaling <strong>43,159 incidents</strong>. Other Roads are deadlier than National Highways on a per-km basis.</p>`},
    {keys:['predict','prediction','forecast','next month','future'],reply:(q)=>`🧠 <strong>AI Crime Forecast — January 2026:</strong><table class="data-table-in-chat"><tr><td class="dt-label">Theft</td><td class="dt-val">~2,100 (+23%)</td></tr><tr><td class="dt-label">Road Accidents</td><td class="dt-val">~1,140 (+20%)</td></tr><tr><td class="dt-label">Molestation</td><td class="dt-val">~558 (+15%)</td></tr><tr><td class="dt-label">Cheating</td><td class="dt-val">~660 (+16%)</td></tr><tr><td class="dt-label">Murder</td><td class="dt-val">~122 (+21%)</td></tr></table><p style="margin-top:8px">📊 Model confidence: <strong>84%</strong>. January is predicted to be a <strong>high-risk month</strong> due to historical seasonal patterns, festival season aftermath, and economic stress indicators.</p>`},
    {keys:['kidnapping','missing','children','child','abduction'],reply:(q)=>`🧒 <strong>Kidnapping & Missing Children 2025:</strong><table class="data-table-in-chat"><tr><td class="dt-label">Missing Boys</td><td class="dt-val">2,673 cases</td></tr><tr><td class="dt-label">Missing Girls</td><td class="dt-val">997 cases</td></tr><tr><td class="dt-label">Total Missing</td><td class="dt-val">3,670 children</td></tr><tr><td class="dt-label">Total Kidnapping</td><td class="dt-val">4,209 cases</td></tr></table><p style="margin-top:8px">⚠️ Missing children account for <strong>87.2%</strong> of all kidnapping cases. This represents a critical area for tracking infrastructure and community awareness programs.</p>`},
    {keys:['compare','vs','versus','between'],reply:(q)=>{
      const sorted=[...CRIME_DATA.districts].sort((a,b)=>b.ipc-a.ipc).slice(0,3);
      return `📊 <strong>District Comparison (Top 3 vs Safest):</strong><table class="data-table-in-chat"><tr><td class="dt-label">Bengaluru City</td><td class="dt-val">37,181 IPC</td></tr><tr><td class="dt-label">Tumakuru</td><td class="dt-val">5,961 IPC</td></tr><tr><td class="dt-label">Bengaluru Dist</td><td class="dt-val">6,433 IPC</td></tr><tr><td class="dt-label">K.G.F</td><td class="dt-val">782 IPC (safest)</td></tr></table><p style="margin-top:8px">Bengaluru City has <strong>47x more crimes</strong> than K.G.F — demonstrating extreme geographic concentration of crime in Karnataka.</p>`;
    }},
    {keys:['cheating','fraud','cyber'],reply:(q)=>`💻 <strong>Cheating & Fraud Analysis 2025:</strong><br>Total cheating cases: <strong>5,839</strong> — a <strong>+14.2% increase</strong> from 2024, making it the fastest-growing crime category.<br><br>Key drivers:<ul style="padding-left:16px;margin-top:8px;color:#94a3b8"><li>Rise in online financial fraud</li><li>False marriage promises (Sec 69 BNS): 236 cases</li><li>Employment/job scams increasing</li><li>Digital payment fraud surge</li></ul><p style="margin-top:8px">🔮 AI predicts cheating cases will reach <strong>6,300+</strong> in 2026 without targeted intervention.</p>`},
    {keys:['summary','overview','total','statistics','stat'],reply:(q)=>`📊 <strong>Karnataka Crime Summary 2025:</strong><table class="data-table-in-chat"><tr><td class="dt-label">Total IPC/BNS Crimes</td><td class="dt-val">138,666</td></tr><tr><td class="dt-label">Total SLL Crimes</td><td class="dt-val">63,867</td></tr><tr><td class="dt-label">Grand Total</td><td class="dt-val">202,533</td></tr><tr><td class="dt-label">Districts Monitored</td><td class="dt-val">37</td></tr><tr><td class="dt-label">Top Crime</td><td class="dt-val">Non-Fatal Accidents (31,751)</td></tr><tr><td class="dt-label">Fastest Growing</td><td class="dt-val">Cheating (+14.2%)</td></tr><tr><td class="dt-label">Declining Crime</td><td class="dt-val">Human Trafficking (-25%)</td></tr></table>`},
  ],
  defaultReply: (q) => `I analyzed your query: "<em>${q}</em>"<br><br>I have information on: <strong>districts, theft, murder, women safety, road accidents, kidnapping, cheating, predictions, comparisons</strong>, and more.<br><br>Try asking: "Show theft statistics" or "Which district is safest?" or "Predict next month crimes"`
};

function getAIResponse(query) {
  const q = query.toLowerCase();
  for (const item of chatKnowledge.responses) {
    if (item.keys.some(k => q.includes(k))) {
      return item.reply(q);
    }
  }
  return chatKnowledge.defaultReply(query);
}

function sendChat(text) {
  const input = document.getElementById('chat-input');
  const msg = text || input.value.trim();
  if (!msg) return;
  input.value = '';

  // Add user message
  addChatMessage(msg, 'user');

  // Show typing
  const typingId = 'typing-' + Date.now();
  const msgs = document.getElementById('chat-messages');
  msgs.innerHTML += `<div class="chat-msg bot" id="${typingId}"><div class="bot-avatar">AI</div><div class="msg-bubble bot-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>`;
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    addChatMessage(getAIResponse(msg), 'bot');
  }, 900 + Math.random() * 600);
}

function addChatMessage(content, role) {
  const msgs = document.getElementById('chat-messages');
  const isBot = role === 'bot';
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = isBot
    ? `<div class="bot-avatar">AI</div><div class="msg-bubble bot-bubble">${content}</div>`
    : `<div class="user-avatar">👤</div><div class="msg-bubble user-bubble">${content}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// Voice for chat
let chatRecognition = null;
function toggleChatVoice() {
  const btn = document.getElementById('chat-voice-btn');
  const ind = document.getElementById('voice-indicator');
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    addChatMessage('Voice input is not supported in your browser. Please use Chrome.', 'bot'); return;
  }
  if (chatRecognition) { chatRecognition.stop(); chatRecognition = null; btn.classList.remove('active'); ind.classList.remove('active'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  chatRecognition = new SR();
  chatRecognition.lang = 'en-IN'; chatRecognition.continuous = false; chatRecognition.interimResults = true;
  chatRecognition.onresult = (e) => {
    const transcript = Array.from(e.results).map(r=>r[0].transcript).join('');
    document.getElementById('chat-input').value = transcript;
    if (e.results[e.results.length-1].isFinal) { sendChat(transcript); chatRecognition=null; btn.classList.remove('active'); ind.classList.remove('active'); }
  };
  chatRecognition.onend = () => { chatRecognition=null; btn.classList.remove('active'); ind.classList.remove('active'); };
  chatRecognition.start();
  btn.classList.add('active'); ind.classList.add('active');
}

// Global voice
let globalRecognition = null;
function toggleVoice() {
  const btn = document.getElementById('voice-btn');
  if (globalRecognition) { globalRecognition.stop(); return; }
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
  document.getElementById('voice-modal').classList.remove('hidden');
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  globalRecognition = new SR(); globalRecognition.lang = 'en-IN'; globalRecognition.interimResults = true;
  globalRecognition.onresult = (e) => {
    const transcript = Array.from(e.results).map(r=>r[0].transcript).join('');
    document.getElementById('voice-transcript').textContent = transcript;
    if (e.results[e.results.length-1].isFinal) {
      stopVoice();
      const q = transcript.toLowerCase();
      if (q.includes('heatmap') || q.includes('map')) showPage('heatmap');
      else if (q.includes('predict')) showPage('ai-prediction');
      else if (q.includes('alert')) showPage('alerts');
      else if (q.includes('district')) showPage('district');
      else if (q.includes('team')) showPage('team');
      else if (q.includes('chat') || q.includes('assistant')) { showPage('ai-assistant'); setTimeout(()=>sendChat(transcript),400); }
      else { showPage('ai-assistant'); setTimeout(()=>sendChat(transcript),400); }
    }
  };
  globalRecognition.onend = stopVoice;
  globalRecognition.start();
  btn.classList.add('active');
}
function stopVoice() {
  if(globalRecognition){globalRecognition.stop();globalRecognition=null;}
  document.getElementById('voice-modal').classList.add('hidden');
  document.getElementById('voice-btn').classList.remove('active');
}

// ===================== ALERTS CENTER =====================
const allAlerts = [
  {id:1,type:'critical',icon:'🚨',title:'Crime Surge — Bengaluru City',desc:'Theft reports up 34% in the last 6 hours. Concentrated in electronic market areas. Rapid Response Team deployed.',district:'Bengaluru City',time:'2 min ago',category:'anomaly'},
  {id:2,type:'critical',icon:'💀',title:'Fatal Accident Cluster — NH4',desc:'3 fatal accidents reported within 2km stretch on National Highway 4 near Tumakuru. Traffic advisory issued.',district:'Tumakuru',time:'8 min ago',category:'accident'},
  {id:3,type:'high',icon:'👧',title:'Missing Child Alert',desc:'Missing 12-year-old girl reported in Mysuru. Last seen near bus stand. All units notified. AMBER alert active.',district:'Mysuru Dist',time:'15 min ago',category:'missing'},
  {id:4,type:'critical',icon:'⚠️',title:'Anomaly Detected — Dacoity Pattern',desc:'AI model detected unusual grouping pattern matching prior dacoity incidents in Ballari district. Preemptive patrol advised.',district:'Ballari',time:'22 min ago',category:'anomaly'},
  {id:5,type:'high',icon:'🔥',title:'Arson Incident — Agricultural Land',desc:'Agricultural produce fire reported covering 5 acres. Suspected arson. Fire department and police en route.',district:'Chitradurga',time:'31 min ago',category:'anomaly'},
  {id:6,type:'high',icon:'💊',title:'Drug Seizure — Kalaburagi',desc:'Major narcotics seizure operation in progress. 3 suspects detained. Coordinated SLL enforcement action.',district:'Kalaburagi City',time:'45 min ago',category:'anomaly'},
  {id:7,type:'medium',icon:'🚗',title:'Road Accident Cluster — State Highway 17',desc:'4 non-fatal accidents reported within 1 hour on SH-17. Advisory issued for reduced speed limit.',district:'Shivamogga',time:'1 hr ago',category:'accident'},
  {id:8,type:'medium',icon:'📢',title:'Riot Risk Elevated — Land Dispute',desc:'Ongoing land dispute between two communities in Vijayapur escalating. Preventive detention orders issued.',district:'Vijayapur',time:'1.5 hr ago',category:'anomaly'},
  {id:9,type:'high',icon:'💻',title:'Cyber Crime Surge',desc:'Online cheating/fraud cases up 28% this week. Targeting elderly citizens via fake bank calls. Public advisory issued.',district:'Bengaluru City',time:'2 hr ago',category:'anomaly'},
  {id:10,type:'medium',icon:'🏠',title:'Burglary Pattern Detected',desc:'AI detected coordinated residential burglary pattern in Mangaluru — same MO in 7 incidents this week.',district:'Mangaluru City',time:'3 hr ago',category:'anomaly'},
  {id:11,type:'info',icon:'✅',title:'Operation Success — Robbery Gang Busted',desc:'Special team arrested 4 members of chain-snatching gang operating across 3 districts. 23 cases solved.',district:'Bengaluru',time:'4 hr ago',category:'update'},
  {id:12,type:'medium',icon:'🚨',title:'Weekend Risk Forecast',desc:'AI predicts 18% increase in late-night road accidents this weekend due to festival activities. Deploy traffic patrols.',district:'All Districts',time:'5 hr ago',category:'forecast'},
];

let alertFilter = 'all';
function initAlerts() {
  renderAlerts(allAlerts);
  initAnomalyChart();
  initAlertDonut();
  startAlertTimer();
}

function filterAlerts(cat, btn) {
  alertFilter = cat;
  document.querySelectorAll('.alert-filter').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const filtered = cat==='all' ? allAlerts : allAlerts.filter(a=>a.category===cat||a.type===cat);
  renderAlerts(filtered);
}

function renderAlerts(alerts) {
  const colors = {critical:C.red,high:C.orange,medium:C.blue,info:C.emerald};
  const bgs = {critical:'rgba(239,68,68,.1)',high:'rgba(249,115,22,.1)',medium:'rgba(59,130,246,.1)',info:'rgba(16,185,129,.1)'};
  document.getElementById('alerts-feed').innerHTML = alerts.map(a=>`
    <div class="alert-item" style="--al-color:${colors[a.type]||C.blue}">
      <div class="alert-icon-wrap" style="background:${bgs[a.type]||'rgba(255,255,255,.05)'}">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title-row">
          <div class="alert-title">${a.title}</div>
          <span class="alert-sev ${a.type}">${a.type.toUpperCase()}</span>
        </div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-meta">📍 ${a.district}</div>
      </div>
      <div class="alert-time">${a.time}</div>
    </div>`).join('');
}

function refreshAlerts() {
  renderAlerts(allAlerts);
  const btn = document.querySelector('.alert-btn-refresh');
  btn.textContent = '✓ Refreshed'; setTimeout(()=>btn.textContent='⟳ Refresh',2000);
}

let alertTimer;
function startAlertTimer() {
  clearInterval(alertTimer);
  let count = parseInt(document.getElementById('alert-count-top').textContent);
  alertTimer = setInterval(() => { count++; document.getElementById('alert-count-top').textContent=count; }, 45000);
}

function initAnomalyChart() {
  dc('anomalyChart');
  const labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const baseline=[45,42,48,44,50,58,55];
  const actual=[45,42,52,44,73,92,55];
  const ctx=document.getElementById('anomalyChart').getContext('2d');
  const g=ctx.createLinearGradient(0,0,0,260); g.addColorStop(0,hx(C.red,.25)); g.addColorStop(1,hx(C.red,0));
  charts.anomalyChart=new Chart(ctx,{type:'line',
    data:{labels,datasets:[
      {label:'Actual Crimes',data:actual,borderColor:C.red,backgroundColor:g,fill:true,tension:.4,pointRadius:5,pointBackgroundColor:actual.map((v,i)=>v>baseline[i]*1.2?C.red:C.purple)},
      {label:'Baseline (Expected)',data:baseline,borderColor:hx(C.blue,.7),backgroundColor:'transparent',borderDash:[6,3],tension:.4,pointRadius:3,pointBackgroundColor:C.blue}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},color:'#94a3b8',usePointStyle:true}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,callbacks:{label:c=>{const v=c.parsed.y;const b=baseline[c.dataIndex];const isAnomaly=c.datasetIndex===0&&v>b*1.2;return `  ${c.dataset.label}: ${v}${isAnomaly?' ⚠️ ANOMALY':''}`}}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}}}}
  });
}

function initAlertDonut() {
  dc('alertDonut');
  charts.alertDonut=new Chart(document.getElementById('alertDonut').getContext('2d'),{
    type:'doughnut',
    data:{labels:['Anomaly Detection','Accident Alerts','Missing Person','Crime Surge','Pattern Match','Updates'],datasets:[{data:[5,2,1,2,1,1],backgroundColor:[C.red,C.orange,C.pink,C.amber,C.purple,C.emerald],borderColor:'#111827',borderWidth:3,hoverOffset:8}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom',labels:{font:{size:11},color:'#94a3b8',usePointStyle:true,padding:8}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}}}
  });
}

// ===================== DIGITAL TWIN SIMULATOR =====================
const simBaseline = {theft:1709,accidents:951,molestation:487,robbery:271,hurt:1476,cheating:567};
let simValues = {...simBaseline};

function initSimulator() {
  updateSimulator();
  initSimChart();
}

function updateSimulator() {
  const patrol = parseInt(document.getElementById('patrol-slider').value)/100;
  const festival = parseInt(document.getElementById('festival-slider').value)/100;
  const lighting = parseInt(document.getElementById('lighting-slider').value)/100;
  const cctv = parseInt(document.getElementById('cctv-slider').value)/100;
  const unemployment = parseInt(document.getElementById('unemployment-slider').value)/30;
  const pop = parseInt(document.getElementById('pop-slider').value)/100;

  document.getElementById('patrol-val').textContent = Math.round(patrol*100)+'%';
  document.getElementById('festival-val').textContent = festival > 0.3 ? 'High' : festival > 0.1 ? 'Low' : 'Off';
  document.getElementById('lighting-val').textContent = Math.round(lighting*100)+'%';
  document.getElementById('cctv-val').textContent = Math.round(cctv*100)+'%';
  document.getElementById('unemployment-val').textContent = Math.round(unemployment*30)+'%';
  document.getElementById('pop-val').textContent = pop > 0.7 ? 'High' : pop > 0.3 ? 'Medium' : 'Low';

  const deterrence = (patrol * 0.4 + lighting * 0.2 + cctv * 0.25);
  const crimeDriver = (unemployment * 0.4 + festival * 0.3 + pop * 0.15);
  const factor = 1 - deterrence * 0.4 + crimeDriver * 0.3;

  simValues = {
    theft: Math.round(simBaseline.theft * factor * (1 + festival * 0.15)),
    accidents: Math.round(simBaseline.accidents * (1 + festival * 0.3) * (1 - patrol * 0.1)),
    molestation: Math.round(simBaseline.molestation * factor * (1 + festival * 0.2)),
    robbery: Math.round(simBaseline.robbery * factor),
    hurt: Math.round(simBaseline.hurt * factor * (1 + festival * 0.1)),
    cheating: Math.round(simBaseline.cheating * (1 + unemployment * 0.2))
  };

  const keys = Object.keys(simValues);
  const labels = {theft:'Theft',accidents:'Accidents',molestation:'Molestation',robbery:'Robbery',hurt:'Hurt',cheating:'Cheating'};
  document.getElementById('sim-output-grid').innerHTML = keys.map(k=>{
    const delta = simValues[k] - simBaseline[k];
    const pct = Math.round((delta/simBaseline[k])*100);
    const cls = delta < 0 ? 'delta-down' : delta > 0 ? 'delta-up' : 'delta-flat';
    const sign = delta > 0 ? '+' : '';
    return `<div class="sim-out-card">
      <div class="sim-out-name">${labels[k]}</div>
      <div class="sim-out-val">${simValues[k].toLocaleString('en-IN')}</div>
      <div class="sim-out-delta ${cls}">${sign}${pct}% (${sign}${delta})</div>
    </div>`;
  }).join('');

  updateSimChart();
}

function initSimChart() {
  dc('simChart');
  const labels=Object.keys(simBaseline);
  const displayLabels={theft:'Theft',accidents:'Accidents',molestation:'Molestation',robbery:'Robbery',hurt:'Hurt',cheating:'Cheating'};
  charts.simChart=new Chart(document.getElementById('simChart').getContext('2d'),{
    type:'bar',
    data:{labels:labels.map(k=>displayLabels[k]),datasets:[
      {label:'Baseline',data:Object.values(simBaseline),backgroundColor:hx(C.blue,.6),borderRadius:6,borderSkipped:false},
      {label:'Simulated',data:Object.values(simValues),backgroundColor:hx(C.purple,.8),borderRadius:6,borderSkipped:false}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:12},color:'#94a3b8',usePointStyle:true}},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}}}}
  });
}

function updateSimChart() {
  if (!charts.simChart) return;
  charts.simChart.data.datasets[1].data = Object.values(simValues);
  charts.simChart.update();
}

function resetSimulator() {
  document.getElementById('patrol-slider').value=65;
  document.getElementById('festival-slider').value=0;
  document.getElementById('lighting-slider').value=70;
  document.getElementById('cctv-slider').value=50;
  document.getElementById('unemployment-slider').value=7;
  document.getElementById('pop-slider').value=50;
  updateSimulator();
}

function applyPreset(preset) {
  const presets={
    festival:{patrol:50,festival:80,lighting:60,cctv:55,unemployment:7,pop:75},
    maxPatrol:{patrol:95,festival:0,lighting:85,cctv:80,unemployment:7,pop:50},
    techCity:{patrol:80,festival:0,lighting:95,cctv:90,unemployment:5,pop:70},
    highRisk:{patrol:30,festival:60,lighting:30,cctv:20,unemployment:22,pop:85}
  };
  const p=presets[preset];
  if(!p)return;
  document.getElementById('patrol-slider').value=p.patrol;
  document.getElementById('festival-slider').value=p.festival;
  document.getElementById('lighting-slider').value=p.lighting;
  document.getElementById('cctv-slider').value=p.cctv;
  document.getElementById('unemployment-slider').value=p.unemployment;
  document.getElementById('pop-slider').value=p.pop;
  updateSimulator();
}

function applyScenario() {
  const btn=document.querySelector('.sim-apply-btn');
  btn.textContent='✓ Applied!';
  setTimeout(()=>btn.textContent='⚡ Apply Scenario',2000);
}

// ===================== EXPLAINABILITY =====================
const explanations = [
  {
    id:'theft',label:'Theft Prediction',confidence:91,
    title:'Theft Forecast — Next 30 Days',
    subtitle:'Predicted: 2,100 cases | Confidence: 91%',
    factors:[
      {name:'Historical Seasonal Pattern',pct:35,color:'#a855f7'},
      {name:'Festival Season Multiplier',pct:22,color:'#ef4444'},
      {name:'Police Patrol Density',pct:18,color:'#3b82f6'},
      {name:'Street Lighting Coverage',pct:12,color:'#f59e0b'},
      {name:'Economic Stress Index',pct:8,color:'#10b981'},
      {name:'Population Density',pct:5,color:'#06b6d4'},
    ]
  },
  {
    id:'accident',label:'Road Accident Risk',confidence:85,
    title:'Fatal Accident Forecast',
    subtitle:'Predicted: 1,140 cases | Confidence: 85%',
    factors:[
      {name:'Traffic Volume Index',pct:38,color:'#ef4444'},
      {name:'Weekend Effect',pct:25,color:'#f97316'},
      {name:'Highway Infrastructure Score',pct:15,color:'#a855f7'},
      {name:'Night Hours Exposure',pct:12,color:'#3b82f6'},
      {name:'Rain/Weather Risk',pct:7,color:'#10b981'},
      {name:'Vehicle Density',pct:3,color:'#06b6d4'},
    ]
  },
  {
    id:'cheating',label:'Cheating/Fraud Surge',confidence:87,
    title:'Cheating Cases Forecast',
    subtitle:'Predicted: 660 cases | Confidence: 87%',
    factors:[
      {name:'Digital Payment Adoption',pct:32,color:'#a855f7'},
      {name:'Economic Stress Index',pct:28,color:'#ef4444'},
      {name:'Prior Year Same Month',pct:18,color:'#3b82f6'},
      {name:'Festival Season Vulnerability',pct:12,color:'#f59e0b'},
      {name:'Cybercrime Awareness Index',pct:6,color:'#10b981'},
      {name:'Police Cyber Cell Capacity',pct:4,color:'#ec4899'},
    ]
  },
  {
    id:'murder',label:'Murder Rate Prediction',confidence:76,
    title:'Murder Rate Forecast',
    subtitle:'Predicted: 122 cases | Confidence: 76%',
    factors:[
      {name:'Historical Baseline',pct:40,color:'#a855f7'},
      {name:'Alcohol Consumption Index',pct:22,color:'#ef4444'},
      {name:'Domestic Conflict Indicators',pct:18,color:'#f97316'},
      {name:'Unemployment Rate',pct:12,color:'#f59e0b'},
      {name:'Land Dispute Frequency',pct:5,color:'#3b82f6'},
      {name:'Temperature Anomaly',pct:3,color:'#10b981'},
    ]
  }
];

let activeExplain = 'theft';

function initExplainability() {
  const opts=document.getElementById('explain-options');
  opts.innerHTML=explanations.map(e=>`<button class="explain-opt ${e.id===activeExplain?'active':''}" onclick="showExplain('${e.id}',this)">${e.label}</button>`).join('');
  showExplain(activeExplain, null, true);
  initFeatureImportanceChart();
  initConfidenceChart();
}

function showExplain(id, btn, skipBtnUpdate) {
  activeExplain=id;
  if(!skipBtnUpdate){ document.querySelectorAll('.explain-opt').forEach(b=>b.classList.remove('active')); if(btn)btn.classList.add('active'); }
  const exp=explanations.find(e=>e.id===id);
  if(!exp)return;
  document.getElementById('explain-detail').innerHTML=`
    <div class="exp-title">${exp.title}</div>
    <div class="exp-sub">${exp.subtitle}</div>
    <div class="exp-confidence">
      <div class="exp-conf-num">${exp.confidence}%</div>
      <div class="exp-conf-label"><strong>Model Confidence</strong>Based on 24 months of training data and 47 input features</div>
    </div>
    <div class="sim-section-title" style="margin-bottom:14px">📊 Feature Importance — Why this prediction was made:</div>
    <div class="exp-factors">
      ${exp.factors.map(f=>`<div class="exp-factor">
        <div class="exp-factor-name">${f.name}</div>
        <div class="exp-factor-bar-wrap"><div class="exp-factor-bar" style="width:${f.pct}%;background:${f.color};height:8px;border-radius:4px"></div></div>
        <div class="exp-factor-pct">${f.pct}%</div>
      </div>`).join('')}
    </div>`;
}

function initFeatureImportanceChart() {
  dc('featureImportanceChart');
  const features=[
    {name:'Historical Pattern',val:35},{name:'Season Factor',val:22},{name:'Patrol Density',val:18},
    {name:'Street Lighting',val:12},{name:'Economic Stress',val:8},{name:'Population Density',val:5}
  ];
  charts.featureImportanceChart=new Chart(document.getElementById('featureImportanceChart').getContext('2d'),{
    type:'bar',
    data:{labels:features.map(f=>f.name),datasets:[{data:features.map(f=>f.val),backgroundColor:[C.purple,C.red,C.blue,C.amber,C.emerald,C.cyan].map(c=>hx(c,.8)),borderRadius:8,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1,callbacks:{label:c=>`  Importance: ${c.parsed.y}%`}}},
      scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#94a3b8',font:{size:11},callback:v=>v+'%'},max:45}}}
  });
}

function initConfidenceChart() {
  dc('confidenceChart');
  charts.confidenceChart=new Chart(document.getElementById('confidenceChart').getContext('2d'),{
    type:'doughnut',
    data:{labels:['Confidence','Uncertainty'],datasets:[{data:[91,9],backgroundColor:[hx(C.purple,.8),'rgba(255,255,255,.05)'],borderColor:['#a855f7','rgba(255,255,255,.1)'],borderWidth:2,hoverOffset:4}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'75%',plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',borderColor:'rgba(255,255,255,.1)',borderWidth:1}},
      animation:{animateScale:true,animateRotate:true}}
  });
}

// ===================== TEAM PAGE =====================
const teamMembers = [
  {initials:'RK',name:'Ranjeet Kumar',role:'AI/ML Development · System Architecture · Full Stack Integration',email:'rajranjeet7680@gmail.com',tags:['AI/ML','Architecture','Full Stack','Project Lead'],isLeader:true,color:'#a855f7'},
  {initials:'SH',name:'Shashank H E',role:'Data Analytics · Dashboard Development · Data Visualization',email:'heshashank789@gmail.com',tags:['Data Analytics','Visualization','Dashboard'],color:'#3b82f6'},
  {initials:'BK',name:'Bharath Kumar',role:'Backend Development · API Integration · Database Management',email:'nagamallibharath@gmail.com',tags:['Backend','API','Database'],color:'#10b981'},
  {initials:'BS',name:'Bawadharani Sree R',role:'Research & Documentation · Data Processing · Testing & QA',email:'bawadharanisree@gmail.com',tags:['Research','Documentation','Testing'],color:'#f59e0b'},
  {initials:'VB',name:'Vivek Boini',role:'Frontend Development · UI/UX Design · User Experience Optimization',email:'vivekboini15@gmail.com',tags:['Frontend','UI/UX','Design'],color:'#ec4899'},
];

function initTeam() {
  document.getElementById('team-grid-app').innerHTML = teamMembers.map(m=>`
    <div class="team-card-app ${m.isLeader?'leader-card':''}" style="--tc-color:${m.color}">
      ${m.isLeader?'<div class="tc-leader-badge">Team Leader</div>':''}
      <div class="tc-avatar" style="background:linear-gradient(135deg,${m.color},#3b82f6)">${m.initials}</div>
      <div class="tc-name">${m.name}</div>
      <div class="tc-role">${m.role}</div>
      <a href="mailto:${m.email}" class="tc-email">📧 ${m.email}</a>
      <div class="tc-tags">${m.tags.map(t=>`<span>${t}</span>`).join('')}</div>
    </div>`).join('');
}

// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', () => {
  applyStoredTheme();
  runLoadingScreen();
  initNeuralCanvas();
  // Duplicate ticker for seamless loop
  const track = document.getElementById('ticker-track');
  if(track) track.innerHTML += track.innerHTML;
  // Check hash or start landing
  const isApp = window.location.hash === '#app';
  if(isApp) enterDashboard();

  // ---- GLOBAL: Prevent all href="#" links from jumping to top ----
  document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  }, true); // capture phase — fires before onclick
});
