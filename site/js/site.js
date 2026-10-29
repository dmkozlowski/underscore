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


// ---------- Sound brief: listen buttons ----------
// Each .brief__listen holds a plain Bandcamp link (works without JS). Here it
// becomes a Listen button that loads Bandcamp's player only when pressed, so
// nothing from Bandcamp loads for people who never press it. Loading a new
// player removes the old one, so only one track plays at a time.
// Bandcamp's player can't start on its own; it shows its own play button.
const listens = document.querySelectorAll('.brief__listen[data-bandcamp-track]');

listens.forEach(box => {
  // The "Now" row (marked above) gets the stronger, solid button.
  const isNow = box.closest('.brief__row.is-now');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn btn--small btn--play ${isNow ? 'btn--solid' : 'btn--line'}`;
  button.textContent = isNow ? "Listen to what's on now" : 'Listen';
  // Accessible name starts with the visible text, so voice control ("click Listen") works.
  button.setAttribute('aria-label', `${button.textContent}: ${box.dataset.title}`);
  button.addEventListener('click', () => openPlayer(box));
  box.replaceChildren(button);
});

function openPlayer(box) {
  listens.forEach(other => { if (other !== box && other.player) closePlayer(other); });

  const colors = 'bgcol=f4ecdf/linkcol=2a1d16';  // paper + ink
  const iframe = document.createElement('iframe');
  iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${box.dataset.bandcampTrack}/size=small/${colors}/transparent=true/`;
  iframe.title = `${box.dataset.title} (Bandcamp player)`;
  iframe.className = 'brief__player';
  iframe.loading = 'eager';
  iframe.allow = 'autoplay';

  box.player = iframe;
  box.button = box.firstElementChild;
  box.replaceChildren(iframe);
  iframe.focus();
}

function closePlayer(box) {
  box.replaceChildren(box.button);
  box.player = null;
}


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
