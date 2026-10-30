# Roomtone — business site

Context for Claude Code. Read this before changing anything.

## What this is

Marketing site for Dan Kozlowski's music curation business: an "interior designer for sound."
Dan is a working session percussionist (200+ sessions, major-label records, 100M+ streams) who
also teaches music theory at Belmont. He chooses the music for independent cafes, bars and shops
(later: upscale restaurants, boutique hotels, design-led retail). Real songs by real human artists,
no AI-generated music, with a lean toward artists local to each client. Plays through Soundtrack
Your Brand (partner program), which bills the client separately.

**"Roomtone" is the likely name (replacing the working name "Underscore") but isn't final.** Keep the name easy to swap (see below).
The Cloudflare Worker and its workers.dev address are still named `underscore`; renaming the Worker creates a new one, so leave it until the domain is set.

## Stack (on purpose)

- Plain static HTML + one CSS file. No framework, no build step, no npm. Keep it that way unless Dan asks.
- Hosting: **Cloudflare Workers (static assets)**, as its own Worker named `underscore` (separate from Dan's personal site).
  Deploys from GitHub `main` via Workers Builds. `wrangler.jsonc` at the repo root points it at `site/`; no build step.
  Domain: **roomtone.design** (registered at name.com, nameservers on Cloudflare; plan to add roomtone.music later).
  `routes` in `wrangler.jsonc` attach it (and www) to the Worker on deploy.
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
  robots.txt   Lets search engines crawl everything; points to the sitemap
  sitemap.xml  Every public page (add new notes here)
  images/og-roomtone.jpg  1200x630 image for link previews
  favicon.svg  The floor-plan mark
  apple-touch-icon.png  180px mark for iPhone home screens (regenerate if the mark changes)
  notes/index.html      Notes list (newest first)
  notes/*.html          One page per note; served without .html (e.g. /notes/your-music-is-part-of-your-brand)
brand/
  roomtone-logo.html  Logo options for the rename (not published)
templates/
  note.html    Starting point for a new note. Lives outside site/, so it's never published.
  drafts/      Notes in progress (also unpublished).
```

## Security and accessibility rules

- **No inline `<script>` or `style="..."`.** The CSP in `_headers` blocks inline scripts. JS goes in `site/js/`, styles in `styles.css`.
  The one exception is `<script type="application/ld+json">` (structured data for search engines): it's data, not code, so the CSP doesn't block it.
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
`track=NNNN` number in the track's Share/Embed code. Not on Bandcamp? Use `data-apple-music="album/<slug>/<id>?i=<id>"`
(the part of the Apple Music link after `/us/`) instead; non-subscribers hear a preview. Add `data-show-title` to put the song name on the button
(for notes, or anywhere several players sit together). Use streaming embeds only, never self-hosted audio files
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

Marks: underlined wordmark (`.wordmark`) + the mark (`.stamp`, an inline SVG in each page's header): a floor plan of a
room with an off-center doorway, and the red dot (the tone) inside. Options considered are in `brand/roomtone-logo.html`.

## Voice

Plain, warm, dry, sure. Decide, then explain: "here's what I'd do, and here's why." A smart friend
with great taste who happens to be the expert. First person ("I"), contractions, short sentences.

- Tagline: **"Music for places people want to come back to."**
- Supporting line: "Think of it as an interior designer for sound."
- Pull quote: "Most places just play music. Yours should sound like someone decided."
- **Never use:** curated experience, elevate, immersive, vibe-driven, bespoke soundscape. Also skip
  generic marketing filler (seamless, unlock, curated, solutions).

## Notes (the "blog")

Called Notes on purpose: evergreen, no dates shown, written only when there's something to say.
New note: copy `templates/note.html` to `site/notes/<short-title-with-dashes>.html`, fill in every [bracket],
then add it to the top of the list in `site/notes/index.html` and to the Notes list on `site/index.html` (up to three).
Also add its URL to `site/sitemap.xml`.
Pages in `notes/` use root-relative paths (`/styles.css`, `/js/site.js`). Writing is Dan's; don't draft posts for him.

## Renaming

The name appears as plain text. When it changes, find-and-replace `Roomtone` across `site/` and `templates/`
(titles, `aria-label`s, `.wordmark`, footer). Rethink the mark if the new name doesn't suit it; it's in the header of every page, `favicon.svg` and `apple-touch-icon.png`.

## Open items (leave placeholders until Dan supplies the real thing)

- [x] Name and domain: Roomtone, roomtone.design
- [x] Email: hello@roomtone.design forwards to Dan's Gmail (Cloudflare Email Routing). It's in the home page footer.
- [ ] Instagram: add to the footer once the account exists
- [x] www.roomtone.design 301-redirects to roomtone.design (a Redirect Rule on the zone, in the Cloudflare dashboard, not in this repo)
- [ ] Later: if roomtone.music is added, redirect one domain to the other the same way
- [x] Zone hardening (Cloudflare dashboard, not this repo): Always Use HTTPS on, minimum TLS 1.2, DNSSEC on
- [ ] DNSSEC: on in Cloudflare but not active, because name.com doesn't take DS records for this domain. Harmless as is.
  To finish it, move the domain to a registrar that does (check Cloudflare Registrar first) and add the DS record there.
- [ ] Email records: Email Routing's MX, SPF (`include:_spf.mx.cloudflare.net ~all`) and DKIM, plus DMARC `p=reject`.
  Receiving only. To *send* as hello@ (e.g. Gmail "Send mail as"), add that service to SPF and set up its DKIM first,
  or DMARC will reject the mail.
- [x] Two-factor login on Cloudflare, name.com and GitHub. Keep the name.com transfer lock on.
- [x] Sample sound brief: tracks, reasons and sample client (a coffee and wine bar) are in
- [x] Photography: hero (Unsplash cafe) and About (Dan) are in `site/images/`. Swap for commissioned shots later if wanted.
- [ ] Confirm with Soundtrack (meeting the week of Nov 2, 2026): licensing wording (live FAQ answer, marked with a TODO comment), and what the license covers for live music, DJs and admission-charge venues (stated as "usually" in `notes/can-i-use-spotify-for-my-business.html`)
- [ ] Pricing is paused on purpose (owner conversations first). Don't invent prices.
- [x] Launched Oct 30, 2026: noindex removed (the 404 page keeps it). Submit `https://roomtone.design/sitemap.xml` in Google Search Console.
  The workers.dev address stays noindexed via `_headers`.
- [ ] Optional: Cloudflare Access to password-protect the workers.dev preview before launch
- [x] Analytics: Cloudflare Web Analytics for roomtone.design; the token is in `ANALYTICS_TOKEN` in `js/site.js`.

## Working with Dan

Dan writes HTML/CSS/JS himself and learns by doing, so explain changes briefly and keep the code
readable. Don't add dependencies or tooling he didn't ask for. Don't invent stats, testimonials or
client names.
