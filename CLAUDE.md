# Underscore — business site

Context for Claude Code. Read this before changing anything.

## What this is

Marketing site for Dan Kozlowski's music curation business: an "interior designer for sound."
Dan is a working session percussionist (200+ sessions, major-label records, 100M+ streams) who
also teaches music theory at Belmont. He chooses the music for independent cafes, bars and shops
(later: upscale restaurants, boutique hotels, design-led retail). Real songs by real human artists,
no AI-generated music, with a lean toward artists local to each client. Plays through Soundtrack
Your Brand (partner program), which bills the client separately.

**"Underscore" is a working name and will probably change.** Keep the name easy to swap (see below).

## Stack (on purpose)

- Plain static HTML + one CSS file. No framework, no build step, no npm. Keep it that way unless Dan asks.
- Hosting: **Cloudflare Workers (static assets)**, as its own Worker named `underscore` (separate from Dan's personal site).
  Deploys from GitHub `main` via Workers Builds. `wrangler.jsonc` at the repo root points it at `site/`; no build step.
  Live preview: https://underscore.dmkozlowski.workers.dev
- Booking: **Cal.com** inline embed on `book.html`
  → https://cal.com/dmkozlowski/listening-session
  Intake questions live in Cal.com's booking form, not on the site.
- Budget rule: free tiers wherever possible until client volume justifies consolidating.

## Files

```
site/
  index.html   Home: hero, quote, what I do, how it works, sample brief, promises, about, who it's for, FAQ, CTA
  book.html    Booking: what to expect + Cal.com inline embed (with a plain-link fallback)
  404.html     Not-found page (served via not_found_handling in wrangler.jsonc). Uses root-relative paths.
  styles.css   All styles; brand tokens are CSS variables on :root
  js/site.js   Shared JS: footer year, analytics, scroll reveals, sound brief "Now" marker + Bandcamp players
  js/book.js   Cal.com embed + fallback handling
  _headers     Cloudflare security headers (CSP etc.). Not served publicly.
  favicon.svg  Dot-over-bar stamp
  apple-touch-icon.png  180px stamp for iPhone home screens (regenerate if the stamp changes)
```

## Security and accessibility rules

- **No inline `<script>` or `style="..."`.** The CSP in `_headers` blocks inline scripts. JS goes in `site/js/`, styles in `styles.css`.
- **New third-party service = update the CSP** in `_headers` (add its domain), or the browser blocks it.
- Focus rings use `--focus`; dark bands (`.band--ink`, `.band--walnut`, footer) flip it to paper. New dark areas should do the same.
- Decorative things get `aria-hidden="true"`. Real photos need real `alt` text (or `alt=""` if purely mood).
- Keep one `<h1>` per page and don't skip heading levels. Use `.visually-hidden` for a heading that shouldn't show.
- Tap targets at least 44px tall. Motion only inside `prefers-reduced-motion: no-preference`.

## Motion

Slow and settled, never bouncy (`--ease` in `styles.css`). Hero/book/404 load-ins are CSS only.
Scroll reveals are opt-in attributes handled by `js/site.js`:
`data-reveal` (ease up), `data-reveal="wipe"` (photo rises into frame), `data-reveal="words"` (word by word),
`data-reveal-stagger` on a parent (children arrive in sequence). Only below-the-fold elements get hidden,
and nothing hides without JS or with reduced motion on. Sound brief rows take `data-hours="start-end"`
(24h) so the visitor's current time of day gets a "Now" marker.

Sound brief tracks: wrap a plain Bandcamp link in `<div class="brief__listen" data-bandcamp-track="ID" data-title="Song by Artist">`.
JS turns it into a Listen button that loads Bandcamp's player only on click (one plays at a time). The ID is the
`track=NNNN` number in the track's Share/Embed code. Use streaming embeds only, never self-hosted audio files
(licensing), unless an artist gives written permission.

## Brand rules (from the brand one-sheet; don't break these)

Colors (CSS vars in `styles.css`):
paper `#F4ECDF` · plaster `#E9DDC9` · line `#CDBBA0` · ink `#2A1D16` · ink-soft `#6A5C50` ·
walnut `#6B4A32` · ochre `#C48A2C` · signal `#B3342A`

- **Red (signal) once per page, kept small.** Right now it's only the stamp dot in the header. Don't add more.
- **Ochre is for fills only.** It fails text contrast on cream. Never use it for text.
- Type: **Fraunces Medium (500)** for the name and big statements; **Hanken Grotesk** for everything else. Both from Google Fonts.
- Shape: **hard edges, no border-radius** (the stamp dot is the only circle). Spacing on a 32px grid.
- Nothing distressed, no retro badges, no gradients, no emoji.
- Imagery: people listening, never posing. Warm light, film grain, wood, knit, plaster.
  Photos are placeholders (`.photo` boxes) until real photography exists. Drop an `<img>` inside `.photo` and it fills the box.

Marks: underlined wordmark (`.wordmark`) + dot-over-bar stamp (`.stamp`). Only the stamp is tied to
the current name; the underlined-wordmark layout survives a rename.

## Voice

Plain, warm, dry, sure. Decide, then explain: "here's what I'd do, and here's why." A smart friend
with great taste who happens to be the expert. First person ("I"), contractions, short sentences.

- Tagline: **"Music for places people want to come back to."**
- Supporting line: "Think of it as an interior designer for sound."
- Pull quote: "Most places just play music. Yours should sound like someone decided."
- **Never use:** curated experience, elevate, immersive, vibe-driven, bespoke soundscape. Also skip
  generic marketing filler (seamless, unlock, curated, solutions).

## Renaming

The name appears as plain text. When it changes, find-and-replace `Underscore` across `site/`
(titles, `aria-label`s, `.wordmark`, footer). Rethink the stamp if the new name doesn't suit it.

## Open items (leave placeholders until Dan supplies the real thing)

- [ ] Final business name → then domain, email, socials (all on hold until the name settles)
- [ ] Real email + Instagram in the footer (`[EMAIL]`, `[INSTAGRAM]`)
- [x] Sample sound brief: tracks, reasons and sample client (a coffee and wine bar) are in
- [x] Photography: hero (Unsplash cafe) and About (Dan) are in `site/images/`. Swap for commissioned shots later if wanted.
- [ ] Confirm with Soundtrack: AI-track filtering, licensing wording (FAQ answers are marked with TODO comments)
- [ ] Pricing is paused on purpose (owner conversations first). Don't invent prices.
- [ ] At launch: remove `<meta name="robots" content="noindex, nofollow">` from both pages, add OG/social tags (404 page is done). The workers.dev address stays noindexed via `_headers`.
- [ ] Optional: Cloudflare Access to password-protect the workers.dev preview before launch
- [ ] Optional: Cloudflare Email Routing for hello@<domain> → Gmail
- [ ] Analytics: paste the Cloudflare Web Analytics token into `ANALYTICS_TOKEN` in `js/site.js` (it's off until then). Add a new site in Web Analytics when the real domain goes live.

## Working with Dan

Dan writes HTML/CSS/JS himself and learns by doing, so explain changes briefly and keep the code
readable. Don't add dependencies or tooling he didn't ask for. Don't invent stats, testimonials or
client names.
