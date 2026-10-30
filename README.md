# Roomtone site

Static site. No build step.

## Preview locally

```
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly works too, but the header logo links to `/`, which only resolves on a server.)

The local server doesn't apply `site/_headers` (security headers, CSP); only Cloudflare does. After adding any third-party script, embed or font, check the deployed preview's browser console for CSP errors.

## Deploy (Cloudflare Workers)

The site is a Cloudflare Worker named `underscore` that serves the `site/` folder as static files.
`wrangler.jsonc` in the repo root tells Cloudflare which folder to serve; there's no build step.

Pushing to `main` on GitHub deploys automatically (Workers Builds). Check progress in the dashboard:
Workers & Pages → underscore → Deployments.

Live preview: https://underscore.dmkozlowski.workers.dev. Add a custom domain later under the Worker's
Settings → Domains & Routes.

See `CLAUDE.md` for brand rules, voice and open items.
