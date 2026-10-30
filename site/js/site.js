// Shared by every page. Kept in a file (not an inline <script>) so the
// Content-Security-Policy in _headers can block inline scripts.
//
// Everything here is an enhancement: with JS off or "reduce motion" on,
// the page is complete and fully visible.

// Footer year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());


// ---------- Analytics: Cloudflare Web Analytics ----------
// Privacy-friendly: no cookies, no personal data. Off until a token is pasted in.
// Get it from Cloudflare → Analytics & Logs → Web Analytics → your site → "JS snippet":
// copy just the "token" value. Change the token here only; every page picks it up.
const ANALYTICS_TOKEN = '09d76db384c84eb9b8d3ad58d7c95f05';  // roomtone.design

if (ANALYTICS_TOKEN) {
  const beacon = document.createElement('script');
  beacon.defer = true;
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.dataset.cfBeacon = JSON.stringify({ token: ANALYTICS_TOKEN });
  document.head.append(beacon);
}


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
//
// For songs that aren't on Bandcamp, use data-apple-music instead, set to the
// part of the song's Apple Music link after "/us/", e.g.
// "album/all-yourn/1462929670?i=1462929680". Visitors who aren't signed in
// to Apple Music hear a preview, not the whole song.
const listens = document.querySelectorAll('.brief__listen[data-bandcamp-track], .brief__listen[data-apple-music]');

listens.forEach(box => {
  // The "Now" row (marked above) gets the stronger, solid button.
  const isNow = box.closest('.brief__row.is-now');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn btn--small btn--play ${isNow ? 'btn--solid' : 'btn--line'}`;
  // data-show-title puts the song in the button, for spots with several players in a row.
  button.textContent = isNow ? "Listen to what's on now"
    : box.hasAttribute('data-show-title') ? `Listen: ${box.dataset.title}` : 'Listen';
  // Accessible name starts with the visible text, so voice control ("click Listen") works.
  if (!box.hasAttribute('data-show-title')) {
    button.setAttribute('aria-label', `${button.textContent}: ${box.dataset.title}`);
  }
  button.addEventListener('click', () => openPlayer(box));
  box.replaceChildren(button);
});

function openPlayer(box) {
  listens.forEach(other => { if (other !== box && other.player) closePlayer(other); });

  const iframe = document.createElement('iframe');
  if (box.dataset.appleMusic) {
    iframe.src = `https://embed.music.apple.com/us/${box.dataset.appleMusic}`;
    iframe.title = `${box.dataset.title} (Apple Music player)`;
    iframe.className = 'brief__player brief__player--apple';
    iframe.allow = 'autoplay *; encrypted-media *; clipboard-write';
    iframe.sandbox = 'allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation';
  } else {
    const colors = 'bgcol=f4ecdf/linkcol=2a1d16';  // paper + ink
    iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${box.dataset.bandcampTrack}/size=small/${colors}/transparent=true/`;
    iframe.title = `${box.dataset.title} (Bandcamp player)`;
    iframe.className = 'brief__player';
    iframe.allow = 'autoplay';
  }
  iframe.loading = 'eager';

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
