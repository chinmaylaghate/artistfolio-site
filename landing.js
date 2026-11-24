// ArtistFolio landing: compact nav, reveal, pinned feature phone, parallax.
// The page works without this file; it only adds motion.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Nav narrows once the page scrolls
const nav = document.getElementById('nav');
const updateNav = () => nav.classList.toggle('is-compact', scrollY > 24);
addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Sections fade up once
const revealer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    }
  }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

// Feature in the middle of the screen picks the phone screen
const features = [...document.querySelectorAll('.feature')];
const screens = [...document.querySelectorAll('.phone-pin img')];
const setFeature = index => {
  features.forEach((f, i) => f.classList.toggle('is-active', i === index));
  screens.forEach((s, i) => {
    s.classList.toggle('is-active', i === index);
    if (i === index) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
  });
};
const featureWatcher = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) setFeature(features.indexOf(entry.target));
  }
}, { rootMargin: '-45% 0px -45% 0px' });
features.forEach(f => featureWatcher.observe(f));

// Parallax: each [data-speed] layer moves relative to its section's distance from the viewport centre.
// Mobile gets half the movement so nothing feels seasick.
const layers = [...document.querySelectorAll('[data-speed]')];
const band = document.querySelector('[data-drift]');
let ticking = false;

const render = () => {
  ticking = false;
  const vh = innerHeight;
  const scale = innerWidth < 760 ? 0.5 : 1;
  for (const el of layers) {
    const host = el.closest('section');
    const rect = host.getBoundingClientRect();
    if (rect.bottom < -200 || rect.top > vh + 200) continue;
    const offset = (rect.top + rect.height / 2 - vh / 2) * Number(el.dataset.speed) * scale;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  }
  if (band) {
    const rect = band.parentElement.getBoundingClientRect();
    band.style.transform = `translate3d(${((rect.top - vh) * 0.35).toFixed(1)}px, 0, 0)`;
  }
};
const onScroll = () => {
  if (!ticking) { ticking = true; requestAnimationFrame(render); }
};

const setMotion = () => {
  if (reduceMotion.matches) {
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    layers.forEach(el => { el.style.transform = ''; });
    if (band) band.style.transform = '';
  } else {
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    render();
  }
};
reduceMotion.addEventListener('change', setMotion);
setMotion();
