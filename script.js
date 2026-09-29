const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Theme Management
const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('banuja-theme');

if (savedTheme === 'light') {
  delete document.body.dataset.theme;
  themeToggle.textContent = '☾';
  themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  themeToggle.title = 'Switch to dark mode';
} else {
  document.body.dataset.theme = 'dark';
  themeToggle.textContent = '☀';
  themeToggle.setAttribute('aria-label', 'Switch to light mode');
  themeToggle.title = 'Switch to light mode';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.dataset.theme === 'dark';
  if (isDark) {
    delete document.body.dataset.theme;
    localStorage.setItem('banuja-theme', 'light');
    themeToggle.textContent = '☾';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    themeToggle.title = 'Switch to dark mode';
  } else {
    document.body.dataset.theme = 'dark';
    localStorage.setItem('banuja-theme', 'dark');
    themeToggle.textContent = '☀';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
    themeToggle.title = 'Switch to light mode';
  }
});

// Mobile Navigation Toggle
const menu = $('#menuToggle'),
  nav = $('#navLinks');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  menu.textContent = open ? '✕' : '☰';
});

$$('#navLinks a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  })
);

// Project Details Accordion Toggle
$$('.detail-toggle').forEach(b =>
  b.addEventListener('click', () => {
    const d = b.closest('.project-card').querySelector('.project-detail');
    const open = d.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.textContent = open ? 'Close details ↑' : 'Explore project ↗';
  })
);

// Skill Filtering & Dynamic Counter
$$('.skill-filter').forEach(button =>
  button.addEventListener('click', () => {
    const filter = button.dataset.skillFilter;
    let visible = 0;
    $$('.skill-filter').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    $$('.skill-node').forEach(node => {
      const show = filter === 'all' || node.dataset.skillCategory === filter;
      node.hidden = !show;
      if (show) visible++;
    });
    $('#skillCount').textContent =
      visible + ' skill' + (visible === 1 ? '' : 's');
    $('#skillFilterLabel').textContent =
      filter === 'all'
        ? 'Showing all technical skills'
        : 'Showing ' + button.textContent.trim().toLowerCase() + ' skills';
  })
);

// Scroll Animations (Reveal on Scroll)
const observer = new IntersectionObserver(
  entries =>
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
$$('.reveal').forEach(el => observer.observe(el));

// Rotating Headline Keywords
const words = ['working software.', 'useful AI.', 'practical solutions.'];
let wi = 0;
const rotatingWordEl = $('#rotatingWord');
if (rotatingWordEl) {
  rotatingWordEl.style.transition = 'opacity .18s';
  setInterval(() => {
    rotatingWordEl.style.opacity = '0';
    setTimeout(() => {
      wi = (wi + 1) % words.length;
      rotatingWordEl.textContent = words[wi];
      rotatingWordEl.style.opacity = '1';
    }, 180);
  }, 2800);
}

// Footer Dynamic Year
const yearEl = $('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Copy Email to Clipboard Toast
const toast = $('#toast');
const copyEmailBtn = $('#copyEmail');
if (copyEmailBtn && toast) {
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('banujaradhika15@gmail.com');
      toast.textContent = 'Email copied to clipboard!';
    } catch (e) {
      toast.textContent = 'Email: banujaradhika15@gmail.com';
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  });
}

// Scroll Progress Bar
const progressEl = $('#progress');
if (progressEl) {
  window.addEventListener(
    'scroll',
    () => {
      const h = document.documentElement;
      progressEl.style.width =
        (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
    },
    { passive: true }
  );
}

// Interactive CLI Terminal
const cliBtns = $$('.cli-btn');
const history = $('#cliHistory');
const commands = {
  skills: `[SKILLS] Python (Primary), OOP, LLM, RAG, BAAI-BGE, Gemma, Ollama, PostgreSQL, Redis, FastAPI, Pandas, NumPy, Git, Make.com, Airtable, Power BI.`,
  projects: `[PROJECTS] 1. RAG-Based Document Chatbot | 2. Loan Tracking Automation | 3. Indian Population Data Analysis.`,
  contact: `[CONTACT] Email: banujaradhika15@gmail.com | GitHub: github.com/Banuja15 | LinkedIn: in/banuja-r-29b738330 | Location: Chennai, India.`,
  clear: null
};

if (cliBtns.length && history) {
  cliBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd === 'clear') {
        history.innerHTML = `
          <div class="cli-line">Terminal cleared.</div>
          <div class="cli-line text-muted">Click a quick command below:</div>
        `;
        return;
      }
      const res = commands[cmd];
      if (!res) return;

      const cmdEntry = document.createElement('div');
      cmdEntry.className = 'cli-line';
      cmdEntry.innerHTML = `<span style="color: #3D68FF; font-weight: 600;">&gt; banuja.${cmd}</span>`;

      const resEntry = document.createElement('div');
      resEntry.className = 'cli-line';
      resEntry.textContent = res;

      history.appendChild(cmdEntry);
      history.appendChild(resEntry);
      history.scrollTop = history.scrollHeight;
    });
  });
}
