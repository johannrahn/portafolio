/* =============================================
   main.js — Portfolio Interactive Logic
   Johann Rahn Indriago
   ============================================= */

'use strict';

/* --- NAV scroll effect & burger --- */
const nav    = document.getElementById('nav');
const burger = document.getElementById('burger');
const links  = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

burger.addEventListener('click', () => {
  links.classList.toggle('open');
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => links.classList.remove('open'));
});

/* --- Counter animation (hero metrics) --- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* --- Skill bar animation --- */
function animateBars() {
  document.querySelectorAll('.skill-bar__fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

/* --- IntersectionObserver for on-scroll triggers --- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    if (el.classList.contains('hero__metric-num')) {
      animateCounter(el);
    }
    if (el.classList.contains('skills__grid')) {
      animateBars();
    }

    io.unobserve(el);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero__metric-num').forEach(n => io.observe(n));
const skillsGrid = document.querySelector('.skills__grid');
if (skillsGrid) io.observe(skillsGrid);

/* --- Hero terminal typewriter --- */
const heroCodeLines = [
  { text: '<span class="t-kw">class</span> <span class="t-cls">Developer</span>:',            delay: 0 },
  { text: '',                                                                                   delay: 80 },
  { text: '    <span class="t-fn">def</span> <span class="t-cls">__init__</span>(self):',       delay: 160 },
  { text: '        self.name = <span class="t-str">"Johann Rahn Indriago"</span>',              delay: 280 },
  { text: '        self.role = <span class="t-str">"Full Stack Developer"</span>',          delay: 400 },
  { text: '        self.stack = [<span class="t-str">"Python"</span>, <span class="t-str">"Flask"</span>, <span class="t-str">"SQL"</span>]', delay: 520 },
  { text: '        self.open_to_work = <span class="t-num">True</span>',                        delay: 640 },
  { text: '',                                                                                   delay: 720 },
  { text: '    <span class="t-fn">def</span> <span class="t-cls">get_status</span>(self):',     delay: 800 },
  { text: '        <span class="t-kw">return</span> {',                                         delay: 900 },
  { text: '            <span class="t-str">"location"</span>: <span class="t-str">"Berlin, Germany"</span>,', delay: 1000 },
  { text: '            <span class="t-str">"focus"</span>: <span class="t-str">"Full Stack · APIs"</span>,',    delay: 1100 },
  { text: '            <span class="t-str">"status"</span>: <span class="t-str">"Open to work"</span>',      delay: 1200 },
  { text: '        }',                                                                          delay: 1300 },
];

const heroCodeEl = document.getElementById('heroCode');
if (heroCodeEl) {
  heroCodeLines.forEach(({ text, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.innerHTML = text || '&nbsp;';
      heroCodeEl.appendChild(line);
    }, delay + 400);
  });
}

/* --- API Simulator --- */
const apiData = {
  profile: {
    id: 1,
    name: "Johann Rahn Indriago",
    role: "Full Stack Developer",
    stack: ["Python", "Flask", "REST APIs", "SQL", "Git"],
    location: "Berlin, Germany",
    open_to_work: true,
    languages: ["Spanish (native)", "English (professional)", "German (B1)", "Portuguese (A1)"]
  },
  skills: {
    backend: { Python: 85, Flask: 80, REST_APIs: 78, SQL: 72 },
    frontend: { HTML_CSS: 80, JavaScript: 65, Bootstrap: 70 },
    tools: ["Git", "GitHub", "Linux", "Netlify", "Postman"]
  },
  projects: [
    { id: 1, name: "Insurance Agency Website", stack: ["HTML","CSS","JS","Netlify"], status: "live", client: true, url: "https://jade-insurance.com" },
    { id: 2, name: "Pokedex API App",          stack: ["Flask","REST API","JSON"], status: "live", url: "https://pokedex-1-cggu.onrender.com/" }
  ],
  status: {
    available: true,
    target_roles: ["Full Stack Developer", "Python Developer"],
    target_countries: ["Germany", "Europe", "Remote"],
    response_time: "< 24h"
  }
};

function syntaxHighlight(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      if (/^"/.test(match)) {
        return /:$/.test(match)
          ? `<span class="json-key">${match}</span>`
          : `<span class="json-str">${match}</span>`;
      }
      if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
      if (/null/.test(match))        return `<span class="json-null">${match}</span>`;
      return `<span class="json-num">${match}</span>`;
    });
}

const sendBtn      = document.getElementById('sendRequest');
const methodSel    = document.getElementById('apiMethod');
const endpointSel  = document.getElementById('apiEndpoint');
const apiStatus    = document.getElementById('apiStatus');
const apiResponse  = document.getElementById('apiResponse');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const method   = methodSel.value;
    const endpoint = endpointSel.value;

    apiStatus.className = 'api-sim__status';
    apiStatus.textContent = 'Sending request…';
    apiResponse.innerHTML = '<span class="json-comment">// loading...</span>';
    sendBtn.disabled = true;

    const delay = 400 + Math.random() * 300;

    setTimeout(() => {
      sendBtn.disabled = false;

      if (method !== 'GET') {
        apiStatus.className = 'api-sim__status err';
        apiStatus.textContent = '405 Method Not Allowed';
        apiResponse.innerHTML =
          `<span class="json-key">"error"</span>: <span class="json-str">"This demo only supports GET requests."</span>\n` +
          `<span class="json-key">"hint"</span>:  <span class="json-str">"Try GET /api/${endpoint}"</span>`;
        return;
      }

      const data = apiData[endpoint];
      if (!data) {
        apiStatus.className = 'api-sim__status err';
        apiStatus.textContent = '404 Not Found';
        apiResponse.innerHTML = `<span class="json-null">null</span>`;
        return;
      }

      apiStatus.className = 'api-sim__status ok';
      apiStatus.textContent = `200 OK  ·  ${Math.round(delay)}ms  ·  application/json`;
      apiResponse.innerHTML = syntaxHighlight(data);
    }, delay);
  });
}

/* --- Smooth scroll for all anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
