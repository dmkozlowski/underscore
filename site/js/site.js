// Shared by every page. Kept in a file (not an inline <script>) so the
// Content-Security-Policy in _headers can block inline scripts.
//
// Everything here is an enhancement: with JS off or "reduce motion" on,
// the page is complete and fully visible.

// Footer year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());


// ---------- Sound brief: mark the row for the visitor's time of day ----------
// Rows carry data-hours="start-end" in 24h local time (end not included).
const hour = new Date().getHours();
document.querySelectorAll('.brief__row[data-hours]').forEach(row => {
  const [start, end] = row.dataset.hours.split('-').map(Number);
  if (hour >= start && hour < end) {
    row.classList.add('is-now');
    const tag = document.createElement('span');
    tag.className = 'brief__now';
    tag.textContent = 'Now';
    row.querySelector('.brief__time').append(tag);
  }
});


// ---------- Scroll reveals ----------
// data-reveal          the element eases up into place
// data-reveal="wipe"   a photo rises into its frame
// data-reveal="words"  text settles in word by word
// data-reveal-stagger  when the group comes into view, its children reveal
//                      one after another
//
// Only things still below the fold get hidden, so nothing you can already
// see ever blinks out and back in.
const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches;

if (motionOK && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const targets = el.hasAttribute('data-reveal-stagger') ? [...el.children] : [el];
      targets.forEach(t => t.classList.add('is-in'));
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  const belowFold = el => el.getBoundingClientRect().top > window.innerHeight;

  const prepare = (el, delay = 0) => {
    const kind = el.dataset.reveal;
    if (kind === 'words') splitWords(el);
    el.classList.add('reveal');
    if (kind) el.classList.add(`reveal--${kind}`);
    el.style.setProperty('--delay', `${delay}ms`);
  };

  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (!belowFold(el)) return;
    prepare(el);
    observer.observe(el);
  });

  document.querySelectorAll('[data-reveal-stagger]').forEach(group => {
    if (!belowFold(group)) return;
    [...group.children].forEach((child, i) => prepare(child, i * 110));
    observer.observe(group);
  });
}

// Wrap each word in a span so they can animate one by one. Screen readers
// get the sentence once, from a hidden copy, instead of word-by-word fragments.
function splitWords(el) {
  const text = el.textContent.trim();
  const spoken = document.createElement('span');
  spoken.className = 'visually-hidden';
  spoken.textContent = text;

  const shown = document.createElement('span');
  shown.setAttribute('aria-hidden', 'true');
  text.split(/\s+/).forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.style.setProperty('--i', i);
    span.textContent = word;
    shown.append(span, ' ');
  });

  el.replaceChildren(spoken, shown);
}
