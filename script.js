function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const themeIcon = themeToggle.querySelector('i');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(themeIcon, savedTheme);
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(themeIcon, newTheme);
  });
}

function updateThemeIcon(icon, theme) {
  if (!icon) return;
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function showContactInfo() {
  const contactInfo = `
📧 Email: eddinekoukhoubadr@gmail.com
📞 Téléphone: +212 657 038 202
📍 Localisation: Benslimane, Maroc
💼 Poste: Développeur Full Stack
N'hésitez pas à me contacter pour des opportunités de collaboration !
`;
  navigator.clipboard.writeText(contactInfo).then(() => {
    alert('Informations de contact copiées dans le presse-papier !');
  }).catch(() => {
    prompt('Copiez ces informations de contact :', contactInfo);
  });
}

function initNavigation() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;
  function updateActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', updateActiveNav);
}

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!link.getAttribute('href')?.startsWith('#')) return;
      e.preventDefault();
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    submitBtn.disabled = true;
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        form.reset();
        alert('Message envoyé avec succès !');
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch {
      alert('Erreur de connexion. Veuillez réessayer.');
    } finally {
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.card, .skill, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function initContentProtection() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;
  const blockEvent = e => { e.preventDefault(); showWarning(); };
  document.addEventListener('contextmenu', blockEvent);
  document.addEventListener('keydown', e => {
    if (['F12', 'i', 'j', 'c', 'u'].includes(e.key.toLowerCase()) && (e.ctrlKey || e.key === 'F12')) showWarning();
  });
  ['copy', 'selectstart', 'dragstart'].forEach(evt => document.addEventListener(evt, blockEvent));
  let devToolsOpen = false;
  setInterval(() => {
    const threshold = 100;
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    if ((widthDiff || heightDiff) && !devToolsOpen) {
      devToolsOpen = true;
      showWarning();
    }
  }, 1000);
}

function showWarning() {
  document.getElementById('protectionOverlay')?.style.setProperty('display', 'block');
  document.getElementById('warningMessage')?.style.setProperty('display', 'block');
}

function closeWarning() {
  document.getElementById('protectionOverlay')?.style.setProperty('display', 'none');
  document.getElementById('warningMessage')?.style.setProperty('display', 'none');
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initMobileMenu();
  initBackToTop();
  initContactForm();
  initScrollAnimations();
  initContentProtection();
});
